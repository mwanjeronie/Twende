"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2, Copy, Check, ExternalLink } from "lucide-react";
import { Merchant } from "@/types";
import QRCode from "qrcode";
import toast from "react-hot-toast";

export function MerchantQRCode({ merchant }: { merchant: Merchant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const payUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pay/${merchant.id}`;
  const solanaPayUrl = `solana:${merchant.wallet_address}?label=${encodeURIComponent(merchant.name)}&message=${encodeURIComponent("Pay with Twende")}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, solanaPayUrl, {
        width: 260,
        margin: 2,
        color: { dark: "#1a0533", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
    }
  }, [solanaPayUrl]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = `twende-${merchant.name.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
    a.href = canvasRef.current.toDataURL();
    a.click();
    toast.success("QR code downloaded!");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(payUrl);
    setCopied(true);
    toast.success("Payment link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: `Pay ${merchant.name} with Twende`, url: payUrl });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* QR */}
      <div className="glass rounded-2xl p-6 flex flex-col items-center gap-5">
        <div>
          <h2 className="text-base font-bold text-white mb-1">Your Payment QR Code</h2>
          <p className="text-xs text-slate-500">Solana Pay compatible — works with Phantom</p>
        </div>

        <div className="relative rounded-2xl bg-white p-4 shadow-2xl glow-purple">
          <canvas ref={canvasRef} className="rounded-xl block" />
          {/* Twende logo overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-twende shadow-lg border-2 border-white">
              <span className="text-xl font-black text-white">T</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="font-bold text-white">{merchant.name}</p>
          <p className="text-xs text-slate-500">{merchant.location}</p>
        </div>

        <div className="flex gap-2 w-full">
          <button onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors">
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <button onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl gradient-twende py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-4">
        {/* Payment link */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">Payment Link</h3>
          <p className="text-xs text-slate-500 mb-3">Share this URL — patients can pay without scanning</p>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 border border-white/8" style={{ background: "var(--bg-input)" }}>
            <code className="flex-1 text-xs text-slate-400 font-mono truncate">{payUrl}</code>
            <button onClick={handleCopyLink} className="shrink-0 text-slate-500 hover:text-white transition-colors">
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <a href={payUrl} target="_blank" rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" /> Preview
          </a>
        </div>

        {/* Tokens */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">Accepted</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(153,69,255,0.15)", color: "#C084FC" }}>◎ SOL</span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(20,241,149,0.1)", color: "#14F195" }}>$ USDT</span>
          </div>
        </div>

        {/* Discount */}
        <div className="glass rounded-2xl p-5 border border-purple-500/20" style={{ background: "rgba(153,69,255,0.06)" }}>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-twende shrink-0">
              <span className="text-sm font-black text-white">%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-purple-300">{merchant.twende_discount}% Twende Discount</p>
              <p className="text-xs text-slate-500 mt-0.5">Applied manually at your counter for patients who pay via Twende.</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">How patients pay</h3>
          <ol className="space-y-2.5">
            {["Patient scans QR with Phantom wallet", "Enters payment amount in SOL or USDT", "Confirms — settles on Solana in <1 second", "Appears instantly in your dashboard"].map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-slate-400">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full gradient-twende text-[10px] font-black text-white">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
