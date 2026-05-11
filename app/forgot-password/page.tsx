"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Zap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-twende"><Zap className="h-4 w-4 text-white" /></div>
            <span className="font-bold text-white">Twende dApp</span>
          </Link>
        </div>
        <div className="glass rounded-2xl p-8">
          {!sent ? (
            <>
              <h1 className="text-2xl font-black text-white mb-1">Reset password</h1>
              <p className="text-sm text-slate-400 mb-6">We&apos;ll send a reset link to your email</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 border border-white/8 outline-none focus:border-purple-500/50"
                      style={{ background: "var(--bg-input)" }} />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full rounded-xl gradient-twende py-3.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--green-dim)" }}>
                <CheckCircle2 className="h-7 w-7" style={{ color: "var(--green)" }} />
              </div>
              <h2 className="text-xl font-black text-white mb-2">Check your email</h2>
              <p className="text-sm text-slate-400">
                Reset link sent to <span className="font-semibold text-white">{email}</span>
              </p>
            </div>
          )}
          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 font-medium">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
