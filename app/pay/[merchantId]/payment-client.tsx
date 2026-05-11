"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferCheckedInstruction, getMint } from "@solana/spl-token";
import { CheckCircle2, Zap, MapPin, ArrowLeft, ExternalLink, Info, Stethoscope, ShoppingBag, Building2 } from "lucide-react";
import { Merchant, Currency } from "@/types";
import { USDT_MINT_ADDRESS, NETWORK } from "@/lib/solana";
import { formatCurrency, BUSINESS_TYPES, getSolanaExplorerUrl } from "@/lib/utils";
import { SolanaWalletProvider } from "@/components/wallet/wallet-provider";
import Link from "next/link";
import toast from "react-hot-toast";

interface PaymentClientProps { merchant: Merchant }

const QUICK_AMOUNTS: Record<Currency, number[]> = {
  SOL: [0.01, 0.05, 0.1, 0.5],
  USDT: [5, 10, 20, 50],
};

const typeIcons: Record<string, typeof Building2> = {
  clinic: Stethoscope, hospital: Building2, pharmacy: Stethoscope,
  dental: Stethoscope, lab: Stethoscope, retail: ShoppingBag,
  restaurant: ShoppingBag, other: Building2,
};

function PaymentForm({ merchant }: PaymentClientProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("USDT");
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [solPrice, setSolPrice] = useState(150);
  const [success, setSuccess] = useState(false);

  // Fetch live SOL price
  useEffect(() => {
    fetch("/api/prices").then(r => r.json()).then(d => {
      if (d?.SOL?.usd) setSolPrice(d.SOL.usd);
    }).catch(() => {});
  }, []);

  const ugxRate = currency === "SOL" ? solPrice * 3700 : 3700;
  const ugxAmount = parseFloat(amount || "0") * ugxRate;

  const handlePayment = useCallback(async () => {
    if (!publicKey || !amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      const recipientPubkey = new PublicKey(merchant.wallet_address);
      const amountNum = parseFloat(amount);
      let tx = new Transaction();

      if (currency === "SOL") {
        tx.add(SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: recipientPubkey, lamports: Math.floor(amountNum * LAMPORTS_PER_SOL) }));
      } else {
        const mintPubkey = new PublicKey(USDT_MINT_ADDRESS[NETWORK]);
        const mintInfo = await getMint(connection, mintPubkey);
        const senderAta = await getAssociatedTokenAddress(mintPubkey, publicKey);
        const recipientAta = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);
        tx.add(createTransferCheckedInstruction(senderAta, mintPubkey, recipientAta, publicKey, BigInt(Math.floor(amountNum * 10 ** mintInfo.decimals)), mintInfo.decimals));
      }

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");

      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchant_id: merchant.id, amount: amountNum, currency, tx_signature: sig, payer_wallet: publicKey.toBase58(), ugx_equivalent: ugxAmount, status: "confirmed" }),
      });

      setTxSignature(sig);
      setSuccess(true);
      toast.success("Payment confirmed!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg.includes("User rejected")) toast.error("Transaction cancelled");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [publicKey, amount, currency, merchant, connection, sendTransaction, ugxAmount]);

  if (success && txSignature) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full glow-green" style={{ background: "rgba(20,241,149,0.15)", border: "2px solid rgba(20,241,149,0.4)" }}>
          <CheckCircle2 className="h-10 w-10" style={{ color: "var(--green)" }} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Payment Confirmed!</h2>
        <p className="text-slate-400 mb-1">You paid <span className="font-bold text-white">{amount} {currency}</span></p>
        <p className="text-sm text-slate-500 mb-1">to <span className="font-semibold text-slate-300">{merchant.name}</span></p>
        <p className="text-xs text-slate-600 mb-6">≈ {formatCurrency(ugxAmount, "UGX")}</p>

        <a href={getSolanaExplorerUrl(txSignature)} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors w-full justify-center mb-3">
          <ExternalLink className="h-4 w-4" /> View on Solana Explorer
        </a>
        <button onClick={() => { setSuccess(false); setAmount(""); setTxSignature(null); }}
          className="w-full rounded-xl py-2.5 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
          Make another payment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Currency */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pay with</label>
        <div className="grid grid-cols-2 gap-2">
          {(["USDT", "SOL"] as Currency[]).map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all border ${currency === c ? "border-purple-500/50 text-white" : "border-white/8 text-slate-500 hover:border-white/15"}`}
              style={currency === c ? { background: "rgba(153,69,255,0.12)" } : { background: "var(--bg-input)" }}>
              <span className="text-base">{c === "SOL" ? "◎" : "$"}</span> {c}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{currency === "SOL" ? "◎" : "$"}</span>
          <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="0"
            className="w-full rounded-xl pl-9 pr-4 py-3.5 text-lg font-bold text-white placeholder-slate-700 border border-white/8 outline-none focus:border-purple-500/50 transition-colors"
            style={{ background: "var(--bg-input)" }} />
        </div>
        {amount && parseFloat(amount) > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="h-3 w-3" />
            ≈ {formatCurrency(ugxAmount, "UGX")} at current rate
          </div>
        )}
      </div>

      {/* Quick amounts */}
      <div className="flex gap-2">
        {QUICK_AMOUNTS[currency].map(v => (
          <button key={v} onClick={() => setAmount(v.toString())}
            className="flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors border border-white/8 hover:border-purple-500/40 text-slate-400 hover:text-white"
            style={{ background: "var(--bg-input)" }}>
            {currency === "SOL" ? `◎${v}` : `$${v}`}
          </button>
        ))}
      </div>

      {/* Discount */}
      {merchant.twende_discount > 0 && (
        <div className="rounded-xl px-4 py-3 flex items-start gap-2.5 border" style={{ background: "rgba(153,69,255,0.06)", borderColor: "rgba(153,69,255,0.2)" }}>
          <span className="text-purple-400 font-black text-sm shrink-0">%</span>
          <p className="text-xs text-purple-300">
            <span className="font-bold">{merchant.twende_discount}% Twende discount</span> — ask the cashier to apply your discount when you show this payment.
          </p>
        </div>
      )}

      {/* Wallet connect or Pay */}
      {!connected ? (
        <div>
          <p className="text-center text-xs text-slate-500 mb-3">Connect Phantom wallet to pay</p>
          <WalletMultiButton style={{
            background: "linear-gradient(135deg, #9945FF, #2563EB)",
            borderRadius: "12px", height: "52px", fontSize: "14px",
            fontWeight: 700, width: "100%", justifyContent: "center",
          }} />
        </div>
      ) : (
        <button onClick={handlePayment} disabled={loading || !amount || parseFloat(amount) <= 0}
          className="w-full rounded-xl gradient-twende py-4 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
          {loading && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
          {loading ? "Confirming on Solana..." : `Pay ${amount || "0"} ${currency}`}
        </button>
      )}

      <p className="text-center text-xs text-slate-600">Secured by Solana · Instant settlement</p>
    </div>
  );
}

export function PaymentClient({ merchant }: PaymentClientProps) {
  const TypeIcon = typeIcons[merchant.business_type] || Building2;
  const typeLabel = BUSINESS_TYPES.find(t => t.value === merchant.business_type)?.label || merchant.business_type;

  return (
    <SolanaWalletProvider>
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        {/* Header */}
        <header className="px-4 py-4 flex items-center justify-between border-b" style={{ borderColor: "var(--border)" }}>
          <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Twende
          </Link>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-twende">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
        </header>

        <main className="flex justify-center px-4 py-8">
          <div className="w-full max-w-sm space-y-4">
            {/* Merchant card */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-twende shrink-0">
                  <TypeIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-base font-bold text-white truncate">{merchant.name}</h1>
                  <p className="text-xs text-slate-500">{typeLabel}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-600">
                    <MapPin className="h-3 w-3" />
                    {merchant.location}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Live</span>
                </div>
              </div>
              {merchant.description && (
                <p className="mt-3 text-xs text-slate-500 border-t pt-3" style={{ borderColor: "var(--border)" }}>
                  {merchant.description}
                </p>
              )}
            </div>

            {/* Payment form */}
            <div className="glass rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white mb-5">Make a Payment</h2>
              <PaymentForm merchant={merchant} />
            </div>
          </div>
        </main>
      </div>
    </SolanaWalletProvider>
  );
}
