import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  TrendingUp, ArrowLeftRight, DollarSign, Activity,
  ExternalLink, ArrowUpRight,
} from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime, getSolanaExplorerUrl } from "@/lib/utils";
import { Transaction } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getDashboardData(merchantId: string) {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("merchant_id", merchantId)
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("amount, currency, created_at")
    .eq("merchant_id", merchantId)
    .eq("status", "confirmed");

  const totalSol = allTransactions?.filter((t) => t.currency === "SOL").reduce((s, t) => s + t.amount, 0) ?? 0;
  const totalUsdt = allTransactions?.filter((t) => t.currency === "USDT").reduce((s, t) => s + t.amount, 0) ?? 0;
  const today = new Date().toISOString().split("T")[0];
  const todayCount = allTransactions?.filter((t) => t.created_at.startsWith(today)).length ?? 0;

  return {
    transactions: (transactions ?? []) as Transaction[],
    stats: {
      total_sol: totalSol,
      total_usdt: totalUsdt,
      total_transactions: allTransactions?.length ?? 0,
      transactions_today: todayCount,
      estimated_ugx: totalSol * 390000 + totalUsdt * 3700,
    },
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!merchant) redirect("/register");

  const { transactions, stats } = await getDashboardData(merchant.id);

  const statCards = [
    {
      title: "Total SOL Received",
      value: formatCurrency(stats.total_sol, "SOL"),
      change: "+12%",
      icon: TrendingUp,
      color: "from-blue-500 to-violet-500",
      bg: "bg-blue-50",
    },
    {
      title: "Total USDT Received",
      value: formatCurrency(stats.total_usdt, "USDT"),
      change: "+8%",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Transactions",
      value: stats.total_transactions.toString(),
      change: `+${stats.transactions_today} today`,
      icon: ArrowLeftRight,
      color: "from-violet-500 to-pink-500",
      bg: "bg-violet-50",
    },
    {
      title: "Est. UGX Value",
      value: formatCurrency(stats.estimated_ugx, "UGX"),
      change: "Live rate",
      icon: Activity,
      color: "from-orange-500 to-red-500",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div>
      <DashboardHeader
        title={`Welcome back, ${merchant.name}`}
        subtitle={`${merchant.location} · ${merchant.business_type}`}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="border-slate-100">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500">{stat.title}</p>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-xs text-emerald-600 font-medium">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/dashboard/qr">
            <Card className="border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">View Payment QR</p>
                  <p className="text-xs text-slate-500">Share with customers</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 ml-auto" />
              </CardContent>
            </Card>
          </Link>
          <Link href={`/pay/${merchant.id}`} target="_blank">
            <Card className="border-slate-100 hover:border-violet-200 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500">
                  <ExternalLink className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Payment Page</p>
                  <p className="text-xs text-slate-500">Your public pay link</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 ml-auto" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/transactions">
            <Card className="border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                  <ArrowLeftRight className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">All Transactions</p>
                  <p className="text-xs text-slate-500">Full history</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 ml-auto" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent transactions */}
        <Card className="border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <ArrowLeftRight className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">No transactions yet</p>
                <p className="text-xs mt-1">Share your QR code to start receiving payments</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      tx.currency === "SOL" ? "bg-violet-100" : "bg-emerald-100"
                    }`}>
                      <span className="text-xs font-bold text-slate-600">
                        {tx.currency === "SOL" ? "◎" : "$"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {tx.payer_name || "Anonymous"}
                      </p>
                      <p className="text-xs text-slate-400">{formatRelativeTime(tx.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        +{formatCurrency(tx.amount, tx.currency)}
                      </p>
                      <Badge
                        variant={tx.status === "confirmed" ? "success" : tx.status === "pending" ? "warning" : "destructive"}
                        className="text-[10px]"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                    {tx.tx_signature && (
                      <a
                        href={getSolanaExplorerUrl(tx.tx_signature)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-blue-500 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
