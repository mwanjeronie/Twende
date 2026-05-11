"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Merchant } from "@/types";
import QRCode from "qrcode";
import toast from "react-hot-toast";

interface MerchantQRCodeProps {
  merchant: Merchant;
}

export function MerchantQRCode({ merchant }: MerchantQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const payUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pay/${merchant.id}`;
  const solanpayUrl = `solana:${merchant.wallet_address}?label=${encodeURIComponent(merchant.name)}&message=${encodeURIComponent("Pay with Twende")}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, solanpayUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: "#1e1b4b",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
    }
  }, [solanpayUrl]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `twende-qr-${merchant.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
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
      await navigator.share({
        title: `Pay ${merchant.name} with Twende`,
        text: `Use this link to pay ${merchant.name} with SOL or USDT`,
        url: payUrl,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* QR Code Card */}
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="text-base">Your Solana Pay QR Code</CardTitle>
          <CardDescription>Customers scan this with Phantom wallet to pay you instantly</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative rounded-2xl bg-white p-4 shadow-lg border border-slate-100">
            {/* Logo overlay */}
            <div className="relative">
              <canvas ref={canvasRef} className="rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg border-2 border-white">
                  <span className="text-lg font-black text-white">T</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-900">{merchant.name}</p>
            <p className="text-xs text-slate-500">{merchant.location}</p>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button size="sm" className="flex-1" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <div className="space-y-4">
        {/* Payment link */}
        <Card className="border-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Payment Link</CardTitle>
            <CardDescription>Share this URL directly with customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
              <code className="flex-1 text-xs text-slate-700 truncate font-mono">{payUrl}</code>
              <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7" onClick={handleCopyLink}>
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <a href={payUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="mt-3 w-full">
                <ExternalLink className="h-4 w-4" />
                Preview payment page
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Accepted currencies */}
        <Card className="border-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Accepted Currencies</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Badge variant="sol" className="py-1.5 px-3">◎ SOL</Badge>
            <Badge variant="usdt" className="py-1.5 px-3">$ USDT</Badge>
          </CardContent>
        </Card>

        {/* Discount info */}
        <Card className="border-blue-100 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold shrink-0">
                %
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Twende Discount Active</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Offer a {merchant.twende_discount}% discount to customers who pay via Twende.
                  This is manually applied at your counter.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to use */}
        <Card className="border-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">How customers pay</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2.5">
              {[
                "Customer scans the QR code with Phantom wallet",
                "They enter the payment amount in SOL or USDT",
                "Payment confirms on Solana in under 1 second",
                "You see it instantly in your dashboard",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white text-[10px] font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
