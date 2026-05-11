"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { isValidSolanaAddress, BUSINESS_TYPES, UGANDA_LOCATIONS } from "@/lib/utils";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", businessName: "", businessType: "", location: "", phone: "", walletAddress: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.email) e.email = "Required";
      if (!form.password || form.password.length < 8) e.password = "Min 8 characters";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    if (step === 1) {
      if (!form.businessName) e.businessName = "Required";
      if (!form.businessType) e.businessType = "Required";
      if (!form.location) e.location = "Required";
    }
    if (step === 2) {
      if (!form.walletAddress) e.walletAddress = "Required";
      else if (!isValidSolanaAddress(form.walletAddress)) e.walletAddress = "Invalid Solana address";
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.businessName } } });
      if (error) throw error;
      if (!data.user) throw new Error("Failed to create account");
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

  const STEPS = ["Account", "Business", "Wallet"];
  const labelStyle = { color: "var(--text-muted)" };
  const Err = ({ k }: { k: string }) => errors[k] ? <p className="mt-1 text-xs text-red-500">{errors[k]}</p> : null;

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="card p-10 max-w-sm w-full text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl brand-btn">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-black mb-2">You&apos;re live!</h1>
        <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{form.businessName}</span> is now on Twende.
        </p>
        <p className="text-sm mb-7" style={{ color: "var(--text-muted)" }}>You can now accept SOL and USDT payments.</p>
        <button onClick={() => router.push("/dashboard")} className="brand-btn w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2">
          Go to Dashboard <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      <div className="flex h-16 items-center justify-between px-6 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Twende dApp" width={32} height={32} className="rounded-lg" />
          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Twende dApp</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center py-10 px-4 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Steps */}
          <div className="flex items-center gap-2 mb-7">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${i < step ? "brand-btn" : i === step ? "brand-btn" : ""}`}
                  style={i > step ? { border: "1px solid var(--border)", color: "var(--text-muted)" } : {}}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="text-xs font-medium" style={{ color: i <= step ? "var(--text-primary)" : "var(--text-muted)" }}>{s}</span>
                {i < 2 && <div className="flex-1 h-px" style={{ background: i < step ? "var(--brand-blue)" : "var(--border)" }} />}
              </div>
            ))}
          </div>

          <div className="card p-7">
            {/* Step 0 */}
            {step === 0 && <>
              <h1 className="text-xl font-black mb-1">Create account</h1>
              <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>Start accepting crypto payments today</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={labelStyle}>Email</label>
                  <input type="email" placeholder="you@business.com" value={form.email} onChange={e => set("email", e.target.value)} className="input-base" />
                  <Err k="email" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={labelStyle}>Password</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={e => set("password", e.target.value)} className="input-base pr-10" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }}>
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Err k="password" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={labelStyle}>Confirm Password</label>
                  <input type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} className="input-base" />
                  <Err k="confirmPassword" />
                </div>
              </div>
              <button onClick={() => validateStep() && setStep(1)} className="brand-btn w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 mt-5">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </>}

            {/* Step 1 */}
            {step === 1 && <>
              <h1 className="text-xl font-black mb-1">Your business</h1>
              <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>Tell us who&apos;s accepting payments</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={labelStyle}>Business name</label>
                  <input placeholder="e.g. Solana Medical Services" value={form.businessName} onChange={e => set("businessName", e.target.value)} className="input-base" />
                  <Err k="businessName" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={labelStyle}>Business type</label>
                  <select value={form.businessType} onChange={e => set("businessType", e.target.value)} className="input-base appearance-none">
                    <option value="">Select type...</option>
                    {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <Err k="businessType" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={labelStyle}>Location</label>
                  <select value={form.location} onChange={e => set("location", e.target.value)} className="input-base appearance-none">
                    <option value="">Select location...</option>
                    {UGANDA_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <Err k="location" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={labelStyle}>Phone (optional)</label>
                  <input placeholder="+256 7XX XXX XXX" value={form.phone} onChange={e => set("phone", e.target.value)} className="input-base" />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5" style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={() => validateStep() && setStep(2)} className="brand-btn flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>}

            {/* Step 2 */}
            {step === 2 && <>
              <h1 className="text-xl font-black mb-1">Solana wallet</h1>
              <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>Payments go directly to this address</p>
              <div className="rounded-xl p-4 mb-4 text-sm" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <p className="font-semibold mb-0.5">Need Phantom?</p>
                <p style={{ color: "var(--text-secondary)" }}>Download at <a href="https://phantom.com" target="_blank" rel="noopener noreferrer" className="brand-text font-medium">phantom.com</a>, create a wallet, copy your address.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={labelStyle}>Wallet address</label>
                  <input placeholder="e.g. 7xKXtg2CW87d..." value={form.walletAddress} onChange={e => set("walletAddress", e.target.value)} className="input-base font-mono text-xs" />
                  <Err k="walletAddress" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={labelStyle}>Description (optional)</label>
                  <textarea placeholder="Brief description of your business..." value={form.description} onChange={e => set("description", e.target.value)} rows={2}
                    className="input-base resize-none" />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5" style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={submit} disabled={loading} className="brand-btn flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                  {loading && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                  {loading ? "Creating..." : "Register"}
                </button>
              </div>
            </>}
          </div>

          <p className="mt-5 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Have an account? <Link href="/login" className="font-bold brand-text">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
