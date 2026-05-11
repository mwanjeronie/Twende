"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
        </div>
        <Link href="/" className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-twende">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white">Twende dApp</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-black text-white leading-tight mb-4">
            Crypto payments built for<br />
            <span className="gradient-twende-text">Kampala businesses</span>
          </h2>
          <p className="text-slate-400 leading-relaxed mb-8">Accept SOL and USDT. Get paid in UGX instantly.</p>
          <div className="space-y-3">
            {["Sub-second settlement on Solana", "Automatic UGX conversion", "Free to register — zero monthly fees", "5 live partner businesses in Kampala"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "rgba(20,241,149,0.15)" }}>
                  <span className="text-emerald-400 text-xs">✓</span>
                </span>
                <span className="text-sm text-slate-400">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-sm text-slate-600">© 2026 Twende dApp · Kampala, Uganda</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-twende">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">Twende dApp</span>
            </Link>
          </div>

          <div className="glass rounded-2xl p-8">
            <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
            <p className="text-sm text-slate-400 mb-8">Sign in to your merchant dashboard</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <Field label="Email" error={errors.email}>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all ${errors.email ? "border border-red-500/50" : "border border-white/8"}`}
                    style={{ background: "var(--bg-input)" }}
                    autoComplete="email"
                  />
                </div>
              </Field>

              <Field label="Password" error={errors.password}>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPw ? "text" : "password"} placeholder="••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 border border-white/8 outline-none"
                    style={{ background: "var(--bg-input)" }}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 font-medium">Forgot password?</Link>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full rounded-xl gradient-twende py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : null}
                Sign In
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              No account?{" "}
              <Link href="/register" className="font-semibold text-purple-400 hover:text-purple-300">Register your business</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
