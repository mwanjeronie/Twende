import Link from "next/link";
import {
  Zap, ArrowRight, CheckCircle, Stethoscope,
  ShoppingBag, Utensils, Building2, QrCode,
  Shield, Globe, TrendingUp, RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";

const features = [
  {
    icon: Zap,
    title: "Sub-second settlement",
    description: "Payments confirm on Solana in under 400ms. No waiting, no delays.",
  },
  {
    icon: Shield,
    title: "Zero volatility risk",
    description: "Clinics receive stable UGX via Yellow Card off-ramp. No crypto price exposure.",
  },
  {
    icon: QrCode,
    title: "Scan & pay",
    description: "Patients scan a QR code with Phantom. No accounts, no forms, no friction.",
  },
  {
    icon: Globe,
    title: "SOL & USDT",
    description: "Accept any Solana-native token. Automatic conversion to UGX for merchants.",
  },
  {
    icon: TrendingUp,
    title: "Real-time analytics",
    description: "Every transaction tracked live. Revenue in SOL, USDT, and UGX equivalents.",
  },
  {
    icon: RefreshCw,
    title: "Fiat off-ramp",
    description: "Yellow Card and local liquidity providers convert crypto to UGX instantly.",
  },
];

const partners = [
  { name: "Solana Medical Services", type: "Clinic", location: "Kawempe Kazo", icon: Stethoscope, active: true },
  { name: "Ram Medical Centre", type: "Medical Centre", location: "Kampala", icon: Stethoscope, active: true },
  { name: "Span Hospital", type: "Hospital", location: "Kisaasi", icon: Building2, active: true },
  { name: "Hive Liquor Store", type: "Retail", location: "Kyanja", icon: ShoppingBag, active: true },
  { name: "Ringroad Pub", type: "Restaurant", location: "Kyanja", icon: Utensils, active: true },
];

const steps = [
  { n: "01", title: "Register your business", desc: "Sign up, add your Solana wallet address, and you're live in under 5 minutes." },
  { n: "02", title: "Share your QR code", desc: "Display it at your counter, on receipts, or share the payment link digitally." },
  { n: "03", title: "Receive payments instantly", desc: "Patients scan, connect Phantom, and pay. Funds arrive in under a second." },
];

const stats = [
  { value: "5+", label: "Partner businesses" },
  { value: "<1s", label: "Settlement time" },
  { value: "2", label: "Tokens accepted" },
  { value: "0", label: "Setup fees" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="gradient-hero relative overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            Built on Solana · Kampala, Uganda
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl leading-[1.1]">
            Crypto payments for<br />
            <span className="gradient-twende-text">real healthcare</span>
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Twende enables clinics, hospitals, and businesses across Kampala to accept SOL and USDT — with instant UGX conversion. No banks, no delays.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-twende px-8 py-4 text-base font-bold text-white shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Register your business
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors active:scale-[0.98]"
            >
              See how it works
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {["Free to register", "No monthly fees", "Instant payouts"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-slate-400">{t}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-black gradient-twende-text">{s.value}</p>
                <p className="mt-1.5 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Built for the real world</h2>
            <p className="mt-4 text-slate-400 text-lg">Everything a Kampala business needs to go crypto.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="glass glass-hover rounded-2xl p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-twende">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Up and running in minutes</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%-0px)] w-full h-px bg-gradient-to-r from-purple-500/30 to-transparent z-0" />
                )}
                <div className="glass rounded-2xl p-6 relative z-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-twende">
                    <span className="text-xl font-black text-white">{s.n}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section id="partners" className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Live in Kampala</h2>
            <p className="mt-4 text-slate-400">Real businesses already using Twende today.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <div key={p.name} className="glass glass-hover rounded-2xl p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-twende">
                  <p.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.type} · {p.location}</p>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
            ))}
            <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center text-center border-dashed border border-white/10">
              <p className="text-sm font-medium text-slate-400">Your business</p>
              <p className="text-xs text-slate-600 mt-0.5">could be next</p>
              <Link href="/register" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300">
                Join now <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="gradient-card rounded-3xl p-10 sm:p-14 glow-purple">
            <h2 className="text-3xl font-black text-white sm:text-4xl mb-4">
              Ready to accept crypto payments?
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Join the Kampala businesses already on Twende. Free to start.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-twende px-8 py-4 text-base font-bold text-white hover:opacity-90 transition-opacity"
            >
              Register your business
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-twende">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">Twende dApp</span>
            </div>
            <p className="text-sm text-slate-600">Built on Solana · Kampala, Uganda · © 2026</p>
            <div className="flex gap-4 text-sm text-slate-600">
              <Link href="/login" className="hover:text-slate-400 transition-colors">Sign in</Link>
              <Link href="/register" className="hover:text-slate-400 transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
