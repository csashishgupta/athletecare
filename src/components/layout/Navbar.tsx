"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Activity, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy-800/80 bg-navy-950/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-sports-green flex items-center justify-center text-navy-950 shadow-lg shadow-sports-green/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-100 flex items-center gap-1">
                Athlete<span className="text-sports-green">Care</span>
              </span>
              <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-bold">
                Wellness & Readiness Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Anchors */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link href="#features" className="hover:text-sports-green transition-colors">
              Platform Workflow
            </Link>
            <Link href="#roles" className="hover:text-sports-green transition-colors">
              Stakeholders
            </Link>
            <Link href="#readiness" className="hover:text-sports-green transition-colors">
              Readiness Scoring
            </Link>
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-bold text-slate-300 hover:text-slate-100 px-4 py-2 rounded-xl hover:bg-navy-850 border border-transparent hover:border-navy-800 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm font-black bg-sports-green hover:bg-sports-green-hover text-navy-950 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-sports-green/20 hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-navy-850 border border-navy-800 text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-800 bg-navy-900/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-navy-800 rounded-lg"
          >
            Platform Workflow
          </Link>
          <Link
            href="#roles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-navy-800 rounded-lg"
          >
            Stakeholders
          </Link>
          <Link
            href="#readiness"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-navy-800 rounded-lg"
          >
            Readiness Scoring
          </Link>
          <div className="pt-3 border-t border-navy-800 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-bold text-slate-200 bg-navy-800 rounded-xl"
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-black text-navy-950 bg-sports-green rounded-xl"
            >
              Get Started &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
