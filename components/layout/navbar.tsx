"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Partners", href: "/#partners" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border)" }}>
      <nav className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.png" alt="Twende dApp" width={36} height={36} className="rounded-lg" />
            <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              Twende <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>dApp</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="text-sm font-medium transition-colors" style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors" style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}>
              Sign in
            </Link>
            <Link href="/register" className="brand-btn px-4 py-2 text-sm rounded-xl">
              Get started
            </Link>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setOpen(!open)} style={{ color: "var(--text-secondary)" }}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-4 space-y-1 border-t" style={{ borderColor: "var(--border)" }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: "var(--text-secondary)" }}>
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t mt-3" style={{ borderColor: "var(--border)" }}>
              <Link href="/login" onClick={() => setOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-semibold"
                style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                Sign in
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="brand-btn text-center py-2.5 rounded-xl text-sm">
                Get started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
