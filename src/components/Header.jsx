import React, { useState } from 'react';
import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { Menu, X, PlusCircle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Header({ theme, toggleTheme, onReset, hasGeneratedSplit }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <Logo size="md" />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              SplitPay
              <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                UPI Utility
              </span>
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline -mt-0.5">
              Smart payment splitting, made simple.
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => scrollToSection('payment-section')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Create Payment
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('safety-notice')}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Safety & Privacy
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {hasGeneratedSplit && (
            <button
              onClick={onReset}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all shadow-sm"
              title="Start a fresh payment split"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
              New Split
            </button>
          )}

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => scrollToSection('payment-section')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Create Payment
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('safety-notice')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Safety & Privacy
          </button>
          {hasGeneratedSplit && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReset();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create New Split
            </button>
          )}
        </div>
      )}
    </header>
  );
}

