import React from 'react';
import Logo from './Logo.jsx';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                SplitPay
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart payment splitting, made simple.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
            <a href="#payment-section" className="hover:text-emerald-500 transition-colors">
              Payment Generator
            </a>
            <a href="#how-it-works" className="hover:text-emerald-500 transition-colors">
              How It Works
            </a>
            <a href="#safety-notice" className="hover:text-emerald-500 transition-colors">
              Safety & Privacy
            </a>
          </div>
        </div>

        {/* Regulatory & Disclaimer Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Client-side utility. No financial or banking credentials are requested or stored.
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Built with precision for professional portfolio presentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

