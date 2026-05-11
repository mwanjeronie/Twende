"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Building2, Wallet, Zap, ArrowRight, CheckCircle2, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isValidSolanaAddress, BUSINESS_TYPES, UGANDA_LOCATIONS } from "@/lib/utils";
import toast from "react-hot-toast";

const STEPS = ["Account", "Business", "Wallet"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", businessName: "", businessType: "", location: "", phone: "", walletAddress: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.email) e.email = "Required"; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
      if (!form.password) e.password = "Required"; else if (form.password.length < 8) e.password = "Min 8 characters";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    if (step === 1) {
      if (!form.businessName) e.businessName = "Required";
      if (!form.businessType) e.businessType = "Select a type";
      if (!form.location) e.location = "Select location";
    }
    if (step === 2) {
      if (!form.walletAddress) e.walletAddress = "Required";
      else if (!isValidSolanaAddress(form.walletAddress)) e.walletAddress = "Invalid Solana address";
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };

  const submit = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.businessName } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create account");

      const res = await fetch("/api/merchants/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.businessName, business_type: form.businessType, location: form.location, phone: form.phone || null, wallet_address: form.walletAddress, description: form.description || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create business profile");
      setDone(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
        <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-twende glow-purple">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">You&apos;re live!</h1>
          <p className="text-slate-400 mb-1">
            <span className="font-semibold text-white">{form.businessName}</span> is now on Twende.
          </p>
          <p className="text-sm text-slate-500 mb-8">Start accepting SOL and USDT from your customers.</p>
          <button onClick={() => router.push("/dashboard")}
            className="w-full rounded-xl gradient-twende py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Left */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />
        </div>
        <Link href="/" className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-twende"><Zap className="h-4 w-4 text-white" /></div>
          <span className="font-bold text-white">Twende dApp</span>
        </Link>
        <div className="relative space-y-6">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${i < step ? "border-emerald-400 bg-emerald-400/15" : i === step ? "border-purple-400 bg-purple-400/15" : "border-white/10"}`}>
                {i < step ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <span className={`text-sm font-bold ${i === step ? "text-purple-400" : "text-slate-600"}`}>{i + 1}</span>}
              </div>
              <div>
                <p className={`text-sm font-semibold ${i <= step ? "text-white" : "text-slate-600"}`}>{label}</p>
                <p className={`text-xs ${i <= step ? "text-slate-400" : "text-slate-700"}`}>{["Create your account", "Your business details", "Connect Solana wallet"][i]}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="relative text-sm text-slate-600">Free to register. No monthly fees.</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-twende"><Zap className="h-4 w-4 text-white" /></div>
              <span className="font-bold text-white">Twende dApp</span>
            </Link>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "gradient-twende" : "bg-white/8"}`} />
            ))}
          </div>
          <p className="text-xs font-medium text-slate-500 mb-6">Step {step + 1} of {STEPS.length}</p>

          <div className="glass rounded-2xl p-8">
            {/* Step 0 */}
            {step === 0 && (
              <>
                <h1 className="text-2xl font-black text-white mb-1">Create account</h1>
                <p className="text-sm text-slate-400 mb-6">Start accepting crypto payments today</p>
                <div className="space-y-4">
                  <Field label="Email" error={errors.email}>
                    <DInput type="email" placeholder="you@business.com" value={form.email} onChange={v => set("email", v)} icon={<Mail className="h-4 w-4" />} />
                  </Field>
                  <Field label="Password" error={errors.password}>
                    <div className="relative">
                      <DInput type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={v => set("password", v)} icon={<Lock className="h-4 w-4" />} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"><EyeOff className="h-4 w-4" /></button>
                    </div>
                  </Field>
                  <Field label="Confirm Password" error={errors.confirmPassword}>
                    <DInput type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={v => set("confirmPassword", v)} icon={<Lock className="h-4 w-4" />} />
                  </Field>
                </div>
                <Btn onClick={next} className="mt-6">Continue <ArrowRight className="h-4 w-4" /></Btn>
              </>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <>
                <h1 className="text-2xl font-black text-white mb-1">Your business</h1>
                <p className="text-sm text-slate-400 mb-6">Tell us who&apos;s accepting payments</p>
                <div className="space-y-4">
                  <Field label="Business name" error={errors.businessName}>
                    <DInput placeholder="e.g. Solana Medical Services" value={form.businessName} onChange={v => set("businessName", v)} icon={<Building2 className="h-4 w-4" />} />
                  </Field>
                  <Field label="Business type" error={errors.businessType}>
                    <select value={form.businessType} onChange={e => set("businessType", e.target.value)}
                      className="w-full rounded-xl px-4 py-3 text-sm text-white border border-white/8 outline-none appearance-none"
                      style={{ background: "var(--bg-input)" }}>
                      <option value="">Select type...</option>
                      {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Location" error={errors.location}>
                    <select value={form.location} onChange={e => set("location", e.target.value)}
                      className="w-full rounded-xl px-4 py-3 text-sm text-white border border-white/8 outline-none appearance-none"
                      style={{ background: "var(--bg-input)" }}>
                      <option value="">Select location...</option>
                      {UGANDA_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </Field>
                  <Field label="Phone (optional)">
                    <DInput placeholder="+256 7XX XXX XXX" value={form.phone} onChange={v => set("phone", v)} />
                  </Field>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="flex-1 rounded-xl border border-white/10 py-3.5 text-sm font-semibold text-slate-400 hover:bg-white/5 flex items-center justify-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <Btn onClick={next} className="flex-1">Continue <ArrowRight className="h-4 w-4" /></Btn>
                </div>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <h1 className="text-2xl font-black text-white mb-1">Solana wallet</h1>
                <p className="text-sm text-slate-400 mb-6">Payments go directly to this address</p>
                <div className="mb-4 rounded-xl p-4" style={{ background: "rgba(153,69,255,0.08)", border: "1px solid rgba(153,69,255,0.2)" }}>
                  <div className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-purple-300">Use Phantom Wallet</p>
                      <p className="text-xs text-slate-400 mt-0.5">Download Phantom at phantom.com, create a wallet, and paste your address below.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Field label="Wallet address" error={errors.walletAddress}>
                    <DInput placeholder="e.g. 7xKXtg2CW87d..." value={form.walletAddress} onChange={v => set("walletAddress", v)} icon={<Wallet className="h-4 w-4" />} />
                  </Field>
                  <Field label="Description (optional)">
                    <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
                      placeholder="Brief description of your business..."
                      className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 border border-white/8 outline-none resize-none"
                      style={{ background: "var(--bg-input)" }} />
                  </Field>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-white/10 py-3.5 text-sm font-semibold text-slate-400 hover:bg-white/5 flex items-center justify-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <button onClick={submit} disabled={loading}
                    className="flex-1 rounded-xl gradient-twende py-3.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                    {loading ? "Creating..." : "Register Business"}
                  </button>
                </div>
              </>
            )}

            <p className="mt-6 text-center text-sm text-slate-500">
              Have an account? <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300">Sign in</Link>
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

function DInput({ type = "text", placeholder, value, onChange, icon }: { type?: string; placeholder?: string; value: string; onChange: (v: string) => void; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className={`w-full rounded-xl ${icon ? "pl-10" : "pl-4"} pr-4 py-3 text-sm text-white placeholder-slate-600 border border-white/8 outline-none focus:border-purple-500/50 transition-colors`}
        style={{ background: "var(--bg-input)" }} />
    </div>
  );
}

function Btn({ onClick, children, className = "" }: { onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button onClick={onClick} className={`w-full rounded-xl gradient-twende py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${className}`}>
      {children}
    </button>
  );
}
