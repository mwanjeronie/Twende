"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, QrCode, ArrowLeftRight, Settings, LogOut, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Payment QR", href: "/dashboard/qr", icon: QrCode },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Profile", href: "/dashboard/profile", icon: Store },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await createClient().auth.signOut();
    router.push("/");
  };

  return (
    <aside className="flex h-full w-56 flex-col" style={{ background: "var(--bg-primary)", borderRight: "1px solid var(--border)" }}>
      <div className="flex h-16 items-center justify-between px-4 border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Twende" width={28} height={28} className="rounded-lg" />
          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Twende</span>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all", active ? "brand-btn" : "")}
              style={!active ? { color: "var(--text-secondary)" } : {}}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-secondary)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = ""; }}>
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t" style={{ borderColor: "var(--border)" }}>
        <button onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = ""; }}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
