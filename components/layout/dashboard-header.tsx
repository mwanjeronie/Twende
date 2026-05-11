"use client";

interface Props { title: string; subtitle?: string; }

export function DashboardHeader({ title, subtitle }: Props) {
  return (
    <header className="flex h-16 items-center justify-between px-6 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>
      <div>
        <h1 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{title}</h1>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{subtitle}</p>}
      </div>
    </header>
  );
}
