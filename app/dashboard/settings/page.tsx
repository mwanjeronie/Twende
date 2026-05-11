import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { shortenAddress } from "@/lib/utils";
import { Wallet, Shield, Bell } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!merchant) redirect("/register");

  return (
    <div>
      <DashboardHeader title="Settings" subtitle="Manage your account and preferences" />
      <div className="p-6 space-y-6 max-w-2xl">
        {/* Account Info */}
        <Card className="border-slate-100">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Account</CardTitle>
                <CardDescription>Your login details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-500">Account status</span>
              <Badge variant="success">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Wallet */}
        <Card className="border-slate-100">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                <Wallet className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-base">Solana Wallet</CardTitle>
                <CardDescription>Payments are sent to this address</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Wallet address</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-slate-100 px-2 py-1 rounded-lg font-mono text-slate-700">
                  {shortenAddress(merchant.wallet_address, 6)}
                </code>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-500">Network</span>
              <Badge variant="default">
                {process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-slate-100">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                <Bell className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Coming soon</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400">
              Email and SMS notifications for new payments will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
