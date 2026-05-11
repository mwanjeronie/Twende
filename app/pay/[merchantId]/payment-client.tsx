"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferCheckedInstruction, getMint } from "@solana/spl-token";
import { CheckCircle2, ArrowLeft, ExternalLink, Info, MapPin, Building2, Stethoscope, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Merchant, Currency } from "@/types";
import { USDT_MINT_ADDRESS, NETWORK } from "@/lib/solana";
import { formatCurrency, BUSINESS_TYPES, getSolanaExplorerUrl } from "@/lib/utils";
import { SolanaWalletProvider } from "@/components/wallet/wallet-provider";
import toast from "react-hot-toast";

const typeIcons: Record<string, typeof Building2> = {
  clinic: Stethoscope, hospital: Building2, pharmacy: Stethoscope,
  dental: Stethoscope, lab: Stethoscope, retail: ShoppingBag,
  restaurant: ShoppingBag, other: Building2,
};

const QUICK: Record<Currency, number[]> = { SOL: [0.01, 0.05, 0.1, 0.5], USDT: [5, 10, 20, 50] };

function PaymentForm({ merchant }: { merchant: Merchant }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("USDT");
  const [loading, setLoading] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [solPrice, setSolPrice] = useState(150);

  useEffect(() => {
    fetch("/api/prices").then(r => r.json()).then(d => { if (d?.SOL?.usd) setSolPrice(d.SOL.usd); }).catch(() => {});
  }, []);

  const ugxRate = currency === "SOL" ? solPrice * 3700 : 3700;
  const ugxAmount = parseFloat(amount || "0") * ugxRate;

  const pay = useCallback(async () => {
    if (!publicKey || !amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      const recipient = new PublicKey(merchant.wallet_address);
      const num = parseFloat(amount);
      let tx = new Transaction();

      if (currency === "SOL") {
        tx.add(SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: recipient, lamports: Math.floor(num * LAMPORTS_PER_SOL) }));
      } else {
        const mint = new PublicKey(USDT_MINT_ADDRESS[NETWORK]);
        const info = await getMint(connection, mint);
        tx.add(createTransferCheckedInstruction(
          await getAssociatedTokenAddress(mint, publicKey),
          mint,
          await getAssociatedTokenAddress(mint, recipient),
          publicKey, BigInt(Math.floor(num * 10 ** info.decimals)), info.decimals
        ));
      }

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");

      await fetch("/api/transactions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchant_id: merchant.id, amount: num, currency, tx_signature: sig, payer_wallet: publicKey.toBase58(), ugx_equivalent: ugxAmount, status: "confirmed" }),
      });

      setTxSig(sig);
      setSuccess(true);
      toast.success("Payment confirmed!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      toast.error(msg.includes("User rejected") ? "Transaction cancelled" : msg);
    } finally {
      setLoading(false);
    }
  }, [publicKey, amount, currency, merchant, connection, sendTransaction, ugxAmount]);

  if (success && txSig) return (
    <div className="text-center py-4">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full brand-btn">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-black mb-1">Payment confirmed</h2>
      <p className="text-sm mb-0.5" style={{ color: "var(--text-secondary)" }}>
        <span className="font-bold" style={{ color: "var(--text-primary)" }}>{amount} {currency}</span> sent to {merchant.name}
      </p>
      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>≈ {formatCurrency(ugxAmount, "UGX")}</p>
      <a href={getSolanaExplorerUrl(txSig)} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold mb-3 transition-colors"
        style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
        <ExternalLink className="h-4 w-4" /> View on Solana Explorer
      </a>
      <button onClick={() => { setSuccess(false); setAmount(""); setTxSig(null); }}
        className="w-full py-2.5 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        Make another payment
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Currency */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Pay with</label>
        <div className="grid grid-cols-2 gap-2">
          {(["USDT", "SOL"] as Currency[]).map(c => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${currency === c ? "brand-btn border-transparent" : ""}`}
              style={currency !== c ? { border: "1px solid var(--border)", color: "var(--text-secondary)", background: "var(--bg-secondary)" } : {}}>
              {c === "SOL" ? "◎ SOL" : "$ USDT"}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Amount</label>
        <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="0"
          className="input-base text-lg font-bold" />
        {amount && parseFloat(amount) > 0 && (
          <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <Info className="h-3 w-3" /> ≈ {formatCurrency(ugxAmount, "UGX")}
          </p>
        )}
      </div>

      {/* Quick amounts */}
      <div className="flex gap-2">
        {QUICK[currency].map(v => (
          <button key={v} onClick={() => setAmount(String(v))}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-focus)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
            {currency === "SOL" ? `◎${v}` : `$${v}`}
          </button>
        ))}
      </div>

      {/* Discount */}
      {merchant.twende_discount > 0 && (
        <div className="rounded-xl p-3 text-sm" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <span className="font-bold brand-text">{merchant.twende_discount}% Twende discount</span>
          <span style={{ color: "var(--text-secondary)" }}> — ask the cashier to apply when you pay with Twende.</span>
        </div>
      )}

      {/* Pay */}
      {!connected ? (
        <div>
          <p className="text-center text-xs mb-3" style={{ color: "var(--text-muted)" }}>Connect Phantom wallet to pay</p>
          <WalletMultiButton style={{
            background: "linear-gradient(135deg, #22D3EE, #2563EB, #7C3AED)",
            borderRadius: "12px", height: "48px", fontSize: "14px",
            fontWeight: 700, width: "100%", justifyContent: "center",
          }} />
        </div>
      ) : (
        <button onClick={pay} disabled={loading || !amount || parseFloat(amount) <= 0}
          className="brand-btn w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
          {loading && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
          {loading ? "Confirming..." : `Pay ${amount || "0"} ${currency}`}
        </button>
      )}

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>Secured by Solana · Instant settlement</p>
    </div>
  );
}

export function PaymentClient({ merchant }: { merchant: Merchant }) {
  const TypeIcon = typeIcons[merchant.business_type] || Building2;
  const typeLabel = BUSINESS_TYPES.find(t => t.value === merchant.business_type)?.label || merchant.business_type;

  return (
    <SolanaWalletProvider>
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <header className="flex h-14 items-center justify-between px-4 border-b" style={{ borderColor: "var(--border)" }}>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <Image src="/logo.png" alt="Twende" width={28} height={28} className="rounded-lg" />
        </header>

        <main className="flex justify-center px-4 py-8">
          <div className="w-full max-w-sm space-y-3">
            {/* Merchant */}
            <div className="card p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl brand-btn shrink-0">
                  <TypeIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base font-bold truncate">{merchant.name}</h1>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{typeLabel}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <MapPin className="h-3 w-3" />
                    {merchant.location}
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-cyan-500 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live
                </span>
              </div>
              {merchant.description && (
                <p className="mt-3 text-xs border-t pt-3" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                  {merchant.description}
                </p>
              )}
            </div>

            {/* Form */}
            <div className="card p-5">
              <h2 className="text-sm font-bold mb-4">Make a Payment</h2>
              <PaymentForm merchant={merchant} />
            </div>
          </div>
        </main>
      </div>
    </SolanaWalletProvider>
  );
}
