"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#070B14]/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-100 flex items-center gap-0.5">
                Athlete<span className="text-cyan-400">Care</span>
              </span>
              <span className="text-[9px] text-slate-400 block tracking-widest uppercase font-bold">
                Sports Wellness Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <Link href="#simulator" className="hover:text-cyan-400 transition-colors">
              Live Simulator
            </Link>
            <Link href="#portals" className="hover:text-cyan-400 transition-colors">
              Role Portals
            </Link>
            <Link href="#science" className="hover:text-cyan-400 transition-colors">
              Sports Science
            </Link>
          </nav>

          {/* Clean Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-300 hover:text-slate-100 px-3.5 py-2 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-white text-slate-950 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#070B14]/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-3">
          <Link
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/50 rounded-lg"
          >
            Live Simulator
          </Link>
          <Link
            href="#portals"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/50 rounded-lg"
          >
            Role Portals
          </Link>
          <Link
            href="#science"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800/50 rounded-lg"
          >
            Sports Science
          </Link>
          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800 rounded-xl"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-bold text-slate-950 bg-slate-100 rounded-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
