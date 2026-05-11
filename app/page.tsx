import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Stethoscope, ShoppingBag, Building2, Utensils, Zap, Shield, Globe, BarChart2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

const features = [
  { icon: Zap, title: "Instant settlement", desc: "Transactions confirm on Solana in under a second. Funds arrive immediately." },
  { icon: Shield, title: "Zero volatility risk", desc: "Clinics receive stable UGX via off-ramp partners. No crypto exposure." },
  { icon: Globe, title: "SOL & USDT", desc: "Accept any Solana-native token. Automatic conversion to UGX for merchants." },
  { icon: BarChart2, title: "Live analytics", desc: "Every transaction tracked in real time. Revenue in SOL, USDT, and UGX." },
];

const partners = [
  { name: "Solana Medical Services", type: "Clinic", location: "Kawempe Kazo", icon: Stethoscope },
  { name: "Ram Medical Centre", type: "Medical Centre", location: "Kampala", icon: Stethoscope },
  { name: "Span Hospital", type: "Hospital", location: "Kisaasi", icon: Building2 },
  { name: "Hive Liquor Store", type: "Retail", location: "Kyanja", icon: ShoppingBag },
  { name: "Ringroad Pub", type: "Restaurant", location: "Kyanja", icon: Utensils },
];

const steps = [
  { n: "1", title: "Register", desc: "Sign up, connect your Solana wallet, and go live in minutes." },
  { n: "2", title: "Share your QR", desc: "Display your QR code at your counter or share the payment link." },
  { n: "3", title: "Get paid", desc: "Patients scan and pay. Funds arrive in under a second." },
];

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Built on Solana · Kampala, Uganda
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Crypto payments for<br />
            <span className="brand-text">real healthcare</span>
          </h1>

          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "var(--text-secondary)" }}>
            Twende enables clinics, hospitals, and businesses in Kampala to accept SOL and USDT — with instant conversion to UGX. No banks, no delays.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/register" className="brand-btn inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm">
              Register your business <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", background: "var(--bg-secondary)" }}>
              See how it works
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm" style={{ color: "var(--text-muted)" }}>
            {["Free to register", "No monthly fees", "Instant payouts"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-cyan-500" />
                <span style={{ color: "var(--text-secondary)" }}>{t}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[["5+", "Partner businesses"], ["<1s", "Settlement time"], ["2", "Tokens accepted"], ["0", "Setup fees"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-3xl font-black brand-text">{v}</p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black">Built for the real world</h2>
            <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>Everything a Kampala business needs to go crypto.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(f => (
              <div key={f.title} className="card p-6">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl brand-btn">
                  <f.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold mb-1.5">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black">Up and running in minutes</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.n} className="card p-7 text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full brand-btn text-lg font-black">
                  {s.n}
                </div>
                <h3 className="text-base font-bold mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black">Live in Kampala</h2>
            <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>Real businesses already using Twende today.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map(p => (
              <div key={p.name} className="card p-5 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl brand-btn">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.type} · {p.location}</p>
                </div>
                <span className="ml-auto h-2 w-2 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
              </div>
            ))}
            <div className="card p-5 flex flex-col items-center justify-center text-center" style={{ borderStyle: "dashed" }}>
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Your business next?</p>
              <Link href="/register" className="mt-2 inline-flex items-center gap-1 text-sm font-bold brand-text hover:opacity-80">
                Join now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <Image src="/logo.png" alt="Twende dApp" width={56} height={56} className="mx-auto mb-6 rounded-2xl" />
          <h2 className="text-3xl font-black mb-4">Ready to start?</h2>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Join the Kampala businesses on Twende. Free to start, no monthly fees.
          </p>
          <Link href="/register" className="brand-btn inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm">
            Register your business <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Twende" width={28} height={28} className="rounded-lg" />
            <span className="text-sm font-bold">Twende dApp</span>
          </Link>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Built on Solana · Kampala, Uganda · © 2026</p>
          <div className="flex gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <Link href="/login" className="hover:underline">Sign in</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
