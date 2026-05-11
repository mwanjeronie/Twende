"use client";

import { useState } from "react";
import { ExternalLink, Search, Download } from "lucide-react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate, getSolanaExplorerUrl } from "@/lib/utils";

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "SOL" | "USDT">("all");

  const filtered = transactions.filter((tx) => {
    const matchSearch = !search || [tx.payer_wallet, tx.payer_name, tx.tx_signature].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (filter === "all" || tx.currency === filter);
  });

  const totalSol = filtered.filter(t => t.currency === "SOL" && t.status === "confirmed").reduce((s, t) => s + t.amount, 0);
  const totalUsdt = filtered.filter(t => t.currency === "USDT" && t.status === "confirmed").reduce((s, t) => s + t.amount, 0);

  const handleExport = () => {
    const csv = [
      ["Date", "Amount", "Currency", "Status", "Payer", "Signature"].join(","),
      ...filtered.map(tx => [formatDate(tx.created_at), tx.amount, tx.currency, tx.status, tx.payer_name || tx.payer_wallet || "Anonymous", tx.tx_signature || ""].join(","))
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "twende-transactions.csv";
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "SOL Received", value: `◎ ${totalSol.toFixed(4)}` },
          { label: "USDT Received", value: `$ ${totalUsdt.toFixed(2)}` },
          { label: "Shown", value: filtered.length.toString() },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-lg font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 border border-white/8 outline-none focus:border-purple-500/50"
            style={{ background: "var(--bg-input)" }} />
        </div>
        <div className="flex gap-2">
          {(["all", "SOL", "USDT"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${filter === f ? "gradient-twende text-white border-transparent" : "border-white/8 text-slate-400 hover:text-white"}`}
              style={filter !== f ? { background: "var(--bg-input)" } : {}}>
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
        <button onClick={handleExport}
          className="ml-auto flex items-center gap-2 rounded-xl border border-white/8 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          style={{ background: "var(--bg-input)" }}>
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                {["Date", "Payer", "Amount", "Status", "Tx"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-14 text-center text-slate-600 text-sm">No transactions found</td></tr>
              ) : filtered.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-white/2 transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{formatDate(tx.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-white text-sm">{tx.payer_name || "Anonymous"}</p>
                    {tx.payer_wallet && <p className="text-xs text-slate-600 font-mono">{tx.payer_wallet.slice(0, 8)}...{tx.payer_wallet.slice(-6)}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-white">{formatCurrency(tx.amount, tx.currency)}</p>
                    {tx.ugx_equivalent && <p className="text-xs text-slate-600">{formatCurrency(tx.ugx_equivalent, "UGX")}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tx.status === "confirmed" ? "text-emerald-400 bg-emerald-400/10" : tx.status === "pending" ? "text-amber-400 bg-amber-400/10" : "text-red-400 bg-red-400/10"}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {tx.tx_signature ? (
                      <a href={getSolanaExplorerUrl(tx.tx_signature)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium">
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : <span className="text-slate-700">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
