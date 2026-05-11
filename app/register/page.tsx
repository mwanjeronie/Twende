"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, Mail, Lock, Building2, MapPin,
  Zap, ArrowRight, Wallet, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { isValidSolanaAddress, BUSINESS_TYPES, UGANDA_LOCATIONS } from "@/lib/utils";
import toast from "react-hot-toast";

const STEPS = ["Account", "Business", "Wallet", "Done"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
    location: "",
    phone: "",
    walletAddress: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!form.email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email";
      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 8) newErrors.password = "Minimum 8 characters";
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    }
    if (step === 1) {
      if (!form.businessName) newErrors.businessName = "Business name is required";
      if (!form.businessType) newErrors.businessType = "Select a business type";
      if (!form.location) newErrors.location = "Select your location";
    }
    if (step === 2) {
      if (!form.walletAddress) newErrors.walletAddress = "Wallet address is required";
      else if (!isValidSolanaAddress(form.walletAddress)) newErrors.walletAddress = "Enter a valid Solana wallet address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.businessName } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create account");

      // Create merchant profile
      const { error: merchantError } = await supabase.from("merchants").insert({
        user_id: authData.user.id,
        name: form.businessName,
        business_type: form.businessType,
        location: form.location,
        phone: form.phone || null,
        wallet_address: form.walletAddress,
        description: form.description || null,
        is_active: true,
        twende_discount: 30,
      });
      if (merchantError) throw merchantError;

      setStep(3);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blue-600 to-violet-700 flex-col justify-between p-12 text-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">Twende dApp</span>
        </Link>

        {/* Step indicator */}
        <div className="space-y-6">
          {STEPS.slice(0, 3).map((label, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                i < step ? "border-white bg-white text-blue-600" :
                i === step ? "border-white bg-transparent text-white" :
                "border-white/30 bg-transparent text-white/40"
              }`}>
                {i < step ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
              </div>
              <div>
                <p className={`text-sm font-semibold ${i <= step ? "text-white" : "text-white/40"}`}>{label}</p>
                <p className={`text-xs ${i <= step ? "text-blue-200" : "text-white/30"}`}>
                  {["Create your account", "Tell us about your business", "Connect your Solana wallet"][i]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-blue-200">Free to register. No monthly fees.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-8 lg:px-12 bg-white overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-slate-900">Twende dApp</span>
            </Link>
          </div>

          {step < 3 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {STEPS.slice(0, 3).map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-gradient-to-r from-blue-600 to-violet-600" : "bg-slate-100"}`} />
                ))}
              </div>
              <p className="text-xs font-medium text-slate-400">Step {step + 1} of 3</p>
            </div>
          )}

          {/* Step 0: Account */}
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Create your account</h1>
              <p className="text-sm text-slate-500 mb-6">Start accepting crypto payments today</p>
              <div className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@business.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  error={errors.email}
                  icon={<Mail className="h-4 w-4" />}
                />
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    error={errors.password}
                    icon={<Lock className="h-4 w-4" />}
                  />
                  <button type="button" className="absolute right-3 top-9 text-slate-400" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                  icon={<Lock className="h-4 w-4" />}
                />
              </div>
              <Button className="w-full mt-6" size="lg" onClick={handleNext}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Business */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Your business</h1>
              <p className="text-sm text-slate-500 mb-6">Tell us about the business accepting payments</p>
              <div className="space-y-4">
                <Input
                  label="Business name"
                  placeholder="e.g. Solana Medical Services"
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  error={errors.businessName}
                  icon={<Building2 className="h-4 w-4" />}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Business type</label>
                  <Select value={form.businessType} onValueChange={(v) => update("businessType", v)}>
                    <SelectTrigger className={errors.businessType ? "border-red-400" : ""}>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.businessType && <p className="mt-1.5 text-xs text-red-500">{errors.businessType}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                  <Select value={form.location} onValueChange={(v) => update("location", v)}>
                    <SelectTrigger className={errors.location ? "border-red-400" : ""}>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {UGANDA_LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && <p className="mt-1.5 text-xs text-red-500">{errors.location}</p>}
                </div>
                <Input
                  label="Phone number (optional)"
                  placeholder="+256 7XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(0)}>Back</Button>
                <Button size="lg" className="flex-1" onClick={handleNext}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Wallet */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Connect your wallet</h1>
              <p className="text-sm text-slate-500 mb-6">Payments will be sent directly to this Solana wallet address</p>
              <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 p-4">
                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-semibold mb-1">Use Phantom Wallet</p>
                    <p className="text-blue-600 text-xs">Download Phantom from phantom.com, create a wallet, and paste your address below. Never share your seed phrase.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Input
                  label="Solana wallet address"
                  placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                  value={form.walletAddress}
                  onChange={(e) => update("walletAddress", e.target.value)}
                  error={errors.walletAddress}
                  icon={<Wallet className="h-4 w-4" />}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Business description (optional)</label>
                  <textarea
                    placeholder="Briefly describe your business..."
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={3}
                    className="flex w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" className="flex-1" onClick={handleSubmit} loading={loading}>
                  Register Business
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">You&apos;re all set!</h1>
              <p className="text-slate-500 mb-2">
                <span className="font-semibold text-slate-700">{form.businessName}</span> is now registered on Twende.
              </p>
              <p className="text-sm text-slate-400 mb-8">
                You can now accept SOL and USDT payments from your customers.
              </p>
              <Button size="lg" className="w-full" onClick={() => router.push("/dashboard")}>
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-4 text-xs text-slate-400">
                Check your email to verify your account
              </p>
            </div>
          )}

          {step < 3 && (
            <p className="mt-6 text-center text-sm text-slate-500">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
