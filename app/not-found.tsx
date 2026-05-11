import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-twende glow-purple">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-6xl font-black gradient-twende-text mb-4">404</h1>
        <h2 className="text-xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-slate-400 mb-8 text-sm">This page doesn&apos;t exist or the business may be inactive.</p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl gradient-twende px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity">
          <ArrowLeft className="h-4 w-4" /> Back to Twende
        </Link>
      </div>
    </div>
  );
}
