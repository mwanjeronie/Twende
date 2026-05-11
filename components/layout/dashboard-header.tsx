"use client";

import { Bell } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
      <div>
        <h1 className="text-base font-bold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <button className="relative p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-purple-500" />
      </button>
    </header>
  );
}
