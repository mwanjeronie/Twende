import Link from "next/link";
import {
  Zap, Shield, Globe, ArrowRight, CheckCircle,
  Stethoscope, ShoppingBag, Utensils, Building2,
  QrCode, Wallet, RefreshCw, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

const features = [
  {
    icon: Zap,
    title: "Instant Payments",
    description: "Sub-second transaction finality on Solana. Payments clear immediately — no waiting.",
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Shield,
    title: "Zero Volatility Risk",
    description: "Clinics receive stable UGX via our off-ramp partners. No crypto price exposure.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
  },
  {
    icon: Globe,
    title: "Accept SOL & USDT",
    description: "Support all Solana-native tokens. Patients pay in the crypto they already hold.",
    color: "from-blue-500 to-violet-500",
    bg: "bg-blue-50",
  },
  {
    icon: QrCode,
    title: "QR-Based Checkout",
    description: "Merchants get a unique QR code. Patients scan and pay in seconds with Phantom.",
    color: "from-violet-500 to-pink-500",
    bg: "bg-violet-50",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Analytics",
    description: "Track every transaction, revenue trends, and daily volumes from your dashboard.",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
  },
  {
    icon: RefreshCw,
    title: "Fiat Off-Ramp",
    description: "Automatic conversion to UGX via Yellow Card and local liquidity providers.",
    color: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-50",
  },
];

const steps = [
  {
    step: "01",
    title: "Register Your Business",
    description: "Sign up with your email, connect your Solana wallet, and complete your business profile in under 5 minutes.",
    icon: Building2,
  },
  {
    step: "02",
    title: "Share Your QR Code",
    description: "Get your unique Twende payment QR code. Display it at your counter or share it digitally.",
    icon: QrCode,
  },
  {
    step: "03",
    title: "Receive Payments Instantly",
    description: "Customers scan, connect their wallet, enter the amount, and pay. Funds arrive in seconds.",
    icon: Wallet,
  },
];

const partners = [
  { name: "Solana Medical Services", type: "Clinic", location: "Kawempe Kazo", icon: Stethoscope },
  { name: "Ram Medical Centre", type: "Medical Centre", location: "Kampala", icon: Stethoscope },
  { name: "Span Hospital", type: "Hospital", location: "Kisaasi", icon: Building2 },
  { name: "Hive Liquor Store", type: "Retail", location: "Kyanja", icon: ShoppingBag },
  { name: "Ringroad Pub", type: "Restaurant", location: "Kyanja", icon: Utensils },
];

const stats = [
  { label: "Partner Businesses", value: "5+" },
  { label: "Transactions Processed", value: "500+" },
  { label: "Cities in Uganda", value: "3" },
  { label: "Avg. Settlement Time", value: "<1s" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-violet-50/50 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              Powered by Solana · Built for Africa
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Crypto Payments for{" "}
              <span className="gradient-twende-text">
                Real Businesses
              </span>
              {" "}in Uganda
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Twende enables clinics, hospitals, and local businesses to accept SOL and USDT payments instantly — with automatic conversion to UGX. No banks, no delays.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="xl" className="w-full sm:w-auto">
                  Register Your Business
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-500">
              {["No setup fees", "Free to register", "Instant payouts"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard preview card */}
          <div className="mt-16 mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4 h-6 rounded-md bg-slate-200 flex items-center px-3">
                  <span className="text-xs text-slate-400">twende.app/dashboard</span>
                </div>
              </div>
              {/* Mock dashboard */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total Received", value: "24.5 SOL", change: "+12%" },
                    { label: "USDT Received", value: "3,240 USDT", change: "+8%" },
                    { label: "Transactions", value: "142", change: "+23%" },
                    { label: "Est. UGX Value", value: "UGX 4.2M", change: "+15%" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">{stat.label}</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-emerald-600 font-medium">{stat.change}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm h-32 flex items-center justify-center">
                    <div className="w-full space-y-2">
                      {[80, 60, 90, 45, 70, 85, 55].map((h, i) => (
                        <div key={i} className="flex items-end gap-1">
                          <div
                            className="rounded bg-gradient-to-t from-blue-600 to-violet-500 opacity-80"
                            style={{ height: `${h * 0.3}px`, width: "100%" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                      <QrCode className="h-8 w-8 text-blue-600" />
                    </div>
                    <span className="text-xs text-slate-500 text-center">Your QR Code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold gradient-twende-text">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything your business needs
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Built specifically for African businesses accepting crypto for the first time.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`rounded-2xl ${feature.bg} border border-slate-100 p-6 hover:shadow-md transition-shadow`}
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Three simple steps to start accepting crypto payments.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-violet-200 -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-xs font-bold text-blue-600 mb-2">STEP {step.step}</div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Already trusted by businesses in Kampala
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Real businesses. Real payments. Real impact.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow hover:border-blue-200"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-violet-100">
                  <partner.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{partner.name}</p>
                  <p className="text-xs text-slate-500">{partner.type} · {partner.location}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center">
              <div>
                <p className="text-sm font-medium text-slate-500">Your business</p>
                <p className="text-xs text-slate-400 mt-1">could be next</p>
                <Link href="/register" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Join now <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to accept crypto payments?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join the growing network of Kampala businesses using Twende. Free to get started.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" variant="white">
                Register Your Business
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold text-white">Twende dApp</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Blockchain-powered payments for real-world businesses in Africa. Fast, cheap, and easy.
              </p>
              <p className="mt-4 text-xs">Built on Solana · Kampala, Uganda</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                {["Features", "How it Works", "Partners", "Pricing"].map((item) => (
                  <li key={item}>
                    <Link href={`/#${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Register", href: "/register" },
                  { label: "Sign In", href: "/login" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs">© 2026 Twende dApp. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
              <Link href="#" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
