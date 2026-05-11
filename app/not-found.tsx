import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <Image src="/logo.png" alt="Twende" width={52} height={52} className="mb-6 rounded-2xl" />
      <h1 className="text-6xl font-black brand-text mb-3">404</h1>
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Page not found</h2>
      <p className="text-sm mb-8 text-center" style={{ color: "var(--text-secondary)" }}>
        This page doesn&apos;t exist or the business may be inactive.
      </p>
      <Link href="/" className="brand-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Twende
      </Link>
    </div>
  );
}
