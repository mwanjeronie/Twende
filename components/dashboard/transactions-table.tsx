"use client";

import { useState } from "react";
import { ExternalLink, Search, Filter, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/types";
import { formatCurrency, formatDate, getSolanaExplorerUrl } from "@/lib/utils";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "SOL" | "USDT">("all");

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      !search ||
      tx.payer_wallet?.toLowerCase().includes(search.toLowerCase()) ||
      tx.payer_name?.toLowerCase().includes(search.toLowerCase()) ||
      tx.tx_signature?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || tx.currency === filter;
    return matchSearch && matchFilter;
  });

  const totalSol = filtered.filter((t) => t.currency === "SOL" && t.status === "confirmed").reduce((s, t) => s + t.amount, 0);
  const totalUsdt = filtered.filter((t) => t.currency === "USDT" && t.status === "confirmed").reduce((s, t) => s + t.amount, 0);

  const handleExport = () => {
    const csv = [
      ["Date", "Amount", "Currency", "Status", "Payer", "Tx Signature"].join(","),
      ...filtered.map((tx) =>
        [
          formatDate(tx.created_at),
          tx.amount,
          tx.currency,
          tx.status,
          tx.payer_name || tx.payer_wallet || "Anonymous",
          tx.tx_signature || "",
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "twende-transactions.csv";
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="border-slate-100">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Total SOL</p>
            <p className="text-lg font-bold text-slate-900">◎ {totalSol.toFixed(4)}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-100">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Total USDT</p>
            <p className="text-lg font-bold text-slate-900">$ {totalUsdt.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-100 col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Transactions shown</p>
            <p className="text-lg font-bold text-slate-900">{filtered.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by wallet, name, or signature..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-4 w-4" />}
          className="sm:max-w-xs"
        />
        <div className="flex gap-2">
          {(["all", "SOL", "USDT"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="ml-auto" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <Card className="border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payer</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <p className="text-sm">No transactions found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(tx.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{tx.payer_name || "Anonymous"}</p>
                        {tx.payer_wallet && (
                          <p className="text-xs text-slate-400 font-mono">
                            {tx.payer_wallet.slice(0, 8)}...{tx.payer_wallet.slice(-6)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-slate-900">{formatCurrency(tx.amount, tx.currency)}</p>
                      {tx.ugx_equivalent && (
                        <p className="text-xs text-slate-400">{formatCurrency(tx.ugx_equivalent, "UGX")}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant={tx.status === "confirmed" ? "success" : tx.status === "pending" ? "warning" : "destructive"}
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {tx.tx_signature ? (
                        <a
                          href={getSolanaExplorerUrl(tx.tx_signature)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
