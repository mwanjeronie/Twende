"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
  getMint,
} from "@solana/spl-token";
import {
  CheckCircle2, Zap, MapPin, Building2,
  ArrowLeft, ExternalLink, Loader2, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Merchant, Currency } from "@/types";
import { USDT_MINT_ADDRESS, NETWORK } from "@/lib/solana";
import { formatCurrency, BUSINESS_TYPES, getSolanaExplorerUrl as getExplorerUrl } from "@/lib/utils";
import { SolanaWalletProvider } from "@/components/wallet/wallet-provider";
import Link from "next/link";
import toast from "react-hot-toast";

interface PaymentClientProps {
  merchant: Merchant;
}

function PaymentForm({ merchant }: PaymentClientProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("SOL");
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");

  const businessTypeLabel = BUSINESS_TYPES.find((t) => t.value === merchant.business_type)?.label || merchant.business_type;

  const ugxRate = currency === "SOL" ? 390000 : 3700;
  const ugxAmount = parseFloat(amount || "0") * ugxRate;

  const handlePayment = useCallback(async () => {
    if (!publicKey || !amount) return;

    setLoading(true);
    try {
      const recipientPubkey = new PublicKey(merchant.wallet_address);
      const amountNum = parseFloat(amount);
      let transaction = new Transaction();

      if (currency === "SOL") {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubkey,
            lamports: Math.floor(amountNum * LAMPORTS_PER_SOL),
          })
        );
      } else {
        const mintPubkey = new PublicKey(USDT_MINT_ADDRESS[NETWORK]);
        const mintInfo = await getMint(connection, mintPubkey);
        const senderAta = await getAssociatedTokenAddress(mintPubkey, publicKey);
        const recipientAta = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

        transaction.add(
          createTransferCheckedInstruction(
            senderAta,
            mintPubkey,
            recipientAta,
            publicKey,
            BigInt(Math.floor(amountNum * 10 ** mintInfo.decimals)),
            mintInfo.decimals
          )
        );
      }

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      // Save transaction to Supabase
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: merchant.id,
          amount: amountNum,
          currency,
          tx_signature: signature,
          payer_wallet: publicKey.toBase58(),
          ugx_equivalent: ugxAmount,
          status: "confirmed",
        }),
      });

      setTxSignature(signature);
      setStep("success");
      toast.success("Payment sent!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment failed";
      if (message.includes("User rejected")) {
        toast.error("Transaction cancelled");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }, [publicKey, amount, currency, merchant, connection, sendTransaction, ugxAmount]);

  if (step === "success" && txSignature) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Payment Sent!</h2>
        <p className="text-slate-500 mb-1">
          You paid <span className="font-semibold text-slate-700">{amount} {currency}</span> to
        </p>
        <p className="font-semibold text-slate-900 mb-6">{merchant.name}</p>

        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 mb-6 text-left">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="font-semibold">{amount} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Est. UGX</span>
              <span className="font-semibold">{formatCurrency(ugxAmount, "UGX")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Network</span>
              <Badge variant="success">Confirmed</Badge>
            </div>
          </div>
        </div>

        <a
          href={getExplorerUrl(txSignature)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="lg" className="w-full mb-3">
            <ExternalLink className="h-4 w-4" />
            View on Solana Explorer
          </Button>
        </a>
        <Button
          variant="ghost"
          size="lg"
          className="w-full"
          onClick={() => { setStep("form"); setAmount(""); setTxSignature(null); }}
        >
          Make another payment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Currency selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Pay with</label>
        <div className="grid grid-cols-2 gap-3">
          {(["SOL", "USDT"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 px-4 text-sm font-semibold transition-all ${
                currency === c
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className="text-base">{c === "SOL" ? "◎" : "$"}</span>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Amount input */}
      <div>
        <Input
          label="Amount"
          type="number"
          placeholder={`0.00 ${currency}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step={currency === "SOL" ? "0.001" : "0.01"}
        />
        {amount && parseFloat(amount) > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="h-3.5 w-3.5" />
            ≈ {formatCurrency(ugxAmount, "UGX")} at current rate
          </div>
        )}
      </div>

      {/* Quick amounts */}
      {currency === "USDT" && (
        <div className="flex gap-2">
          {[5, 10, 20, 50].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v.toString())}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              ${v}
            </button>
          ))}
        </div>
      )}
      {currency === "SOL" && (
        <div className="flex gap-2">
          {[0.01, 0.05, 0.1, 0.5].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v.toString())}
              className="flex-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              ◎{v}
            </button>
          ))}
        </div>
      )}

      {/* Discount notice */}
      {merchant.twende_discount > 0 && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-start gap-2.5">
          <span className="text-blue-600 font-bold text-sm shrink-0">%</span>
          <p className="text-xs text-blue-700">
            <span className="font-semibold">{merchant.twende_discount}% Twende discount</span> — Ask the cashier to apply your discount when paying with Twende.
          </p>
        </div>
      )}

      {/* Wallet + Pay button */}
      {!connected ? (
        <div className="space-y-3">
          <p className="text-center text-sm text-slate-500">Connect your Phantom wallet to pay</p>
          <div className="flex justify-center">
            <WalletMultiButton
              style={{
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                borderRadius: "12px",
                height: "48px",
                fontSize: "14px",
                fontWeight: 600,
                width: "100%",
              }}
            />
          </div>
        </div>
      ) : (
        <Button
          className="w-full"
          size="lg"
          onClick={handlePayment}
          loading={loading}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          {loading ? "Confirming..." : `Pay ${amount || "0"} ${currency}`}
        </Button>
      )}

      <p className="text-center text-xs text-slate-400">
        Powered by Solana · Instant settlement
      </p>
    </div>
  );
}

export function PaymentClient({ merchant }: PaymentClientProps) {
  const businessTypeLabel = BUSINESS_TYPES.find((t) => t.value === merchant.business_type)?.label || merchant.business_type;

  return (
    <SolanaWalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 flex flex-col">
        {/* Header */}
        <header className="px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Twende</span>
          </Link>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 flex items-start justify-center px-4 py-6">
          <div className="w-full max-w-md">
            {/* Merchant Card */}
            <Card className="border-slate-100 shadow-lg mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-md">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-slate-900 truncate">{merchant.name}</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">{businessTypeLabel}</Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {merchant.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-600 font-medium">Active</span>
                  </div>
                </div>
                {merchant.description && (
                  <p className="mt-3 text-sm text-slate-500 border-t border-slate-50 pt-3">
                    {merchant.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment Card */}
            <Card className="border-slate-100 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-base font-bold text-slate-900 mb-5">Make a Payment</h2>
                <PaymentForm merchant={merchant} />
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Zap className="h-3 w-3 text-blue-500" />
            Secured by Solana blockchain
          </div>
        </footer>
      </div>
    </SolanaWalletProvider>
  );
}
