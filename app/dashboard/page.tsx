import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TrendingUp, ArrowLeftRight, DollarSign, Activity, ExternalLink, ArrowUpRight, QrCode } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { formatCurrency, formatRelativeTime, getSolanaExplorerUrl } from "@/lib/utils";
import { Transaction } from "@/types";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: merchant } = await supabase.from("merchants").select("*").eq("user_id", user.id).single();
  if (!merchant) redirect("/register");

  const { data: allTx } = await supabase.from("transactions").select("amount, currency, created_at, status").eq("merchant_id", merchant.id).eq("status", "confirmed");
  const { data: recentTx } = await supabase.from("transactions").select("*").eq("merchant_id", merchant.id).order("created_at", { ascending: false }).limit(8);

  const totalSol = allTx?.filter(t => t.currency === "SOL").reduce((s, t) => s + t.amount, 0) ?? 0;
  const totalUsdt = allTx?.filter(t => t.currency === "USDT").reduce((s, t) => s + t.amount, 0) ?? 0;
  const today = new Date().toISOString().split("T")[0];
  const todayTx = allTx?.filter(t => t.created_at.startsWith(today)).length ?? 0;
  const estUgx = totalSol * 555000 + totalUsdt * 3700;

  const stats = [
    { label: "SOL Received", value: `◎ ${totalSol.toFixed(4)}`, sub: "Total confirmed", icon: TrendingUp },
    { label: "USDT Received", value: `$ ${totalUsdt.toFixed(2)}`, sub: "Total confirmed", icon: DollarSign },
    { label: "Transactions", value: String(allTx?.length ?? 0), sub: `${todayTx} today`, icon: ArrowLeftRight },
    { label: "Est. UGX Value", value: formatCurrency(estUgx, "UGX"), sub: "Live rate", icon: Activity },
  ];

  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <DashboardHeader title={merchant.name} subtitle={`${merchant.location} · ${merchant.business_type}`} />
      <div className="p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg brand-btn">
                  <s.icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              <p className="mt-1 text-xs brand-text font-medium">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Payment QR", sub: "Share with customers", href: "/dashboard/qr", icon: QrCode },
            { label: "Pay Link", sub: "Customer payment page", href: `/pay/${merchant.id}`, icon: ExternalLink, external: true },
            { label: "Transactions", sub: "Full history", href: "/dashboard/transactions", icon: ArrowLeftRight },
          ].map(a => (
            <Link key={a.label} href={a.href} target={a.external ? "_blank" : undefined}
              className="card card-hover p-4 flex items-center gap-3"
              style={{ textDecoration: "none" }}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl brand-btn shrink-0">
                <a.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{a.label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{a.sub}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 ml-auto shrink-0" style={{ color: "var(--text-muted)" }} />
            </Link>
          ))}
        </div>

        {/* Recent transactions */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-sm font-bold">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-xs font-medium brand-text">View all</Link>
          </div>
          {!recentTx?.length ? (
            <div className="py-14 text-center">
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>No transactions yet</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Share your QR code to start receiving payments</p>
            </div>
          ) : (
            <div>
              {(recentTx as Transaction[]).map((tx, i) => (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5"
                  style={{ borderBottom: i < recentTx.length - 1 ? `1px solid var(--border)` : "none" }}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0"
                    style={{ background: "var(--bg-secondary)" }}>
                    <span className="text-sm font-bold brand-text">{tx.currency === "SOL" ? "◎" : "$"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{tx.payer_name || "Anonymous"}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatRelativeTime(tx.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>+{formatCurrency(tx.amount, tx.currency)}</p>
                    <span className={`text-[10px] font-semibold ${tx.status === "confirmed" ? "text-cyan-500" : tx.status === "pending" ? "text-amber-500" : "text-red-500"}`}>{tx.status}</span>
                  </div>
                  {tx.tx_signature && (
                    <a href={getSolanaExplorerUrl(tx.tx_signature)} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)" }}>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
