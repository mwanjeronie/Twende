"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Zap, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Min 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
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
          <h1 className="text-2xl font-black text-white mb-1">Set new password</h1>
          <p className="text-sm text-slate-400 mb-6">Choose a strong password for your account</p>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 border border-white/8 outline-none focus:border-purple-500/50"
                  style={{ background: "var(--bg-input)" }} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input type="password" placeholder="Re-enter password" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 border border-white/8 outline-none focus:border-purple-500/50"
                  style={{ background: "var(--bg-input)" }} />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-xl gradient-twende py-3.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {loading && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
