"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Partners", href: "/#partners" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5" style={{ background: "rgba(8,11,18,0.85)", backdropFilter: "blur(16px)" }}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-twende">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">
              Twende
              <span className="ml-1 text-[10px] font-semibold text-purple-400 align-super">dApp</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl gradient-twende px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="block px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 px-4 pt-4 border-t border-white/5 mt-4">
              <Link href="/login" onClick={() => setOpen(false)} className="text-center py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/5">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="text-center py-2.5 rounded-xl gradient-twende text-sm font-bold text-white">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
