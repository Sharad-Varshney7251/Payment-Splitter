import React from 'react';
import { ArrowDown, QrCode, Sparkles, ShieldCheck } from 'lucide-react';

export default function Hero({ onStartCreating }) {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Fintech trust badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Client-Side UPI QR Generation • Zero Server Storage</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight sm:leading-none mb-6">
          Split payments. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
            Scan. Pay.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Split a payment into multiple amounts and generate ready-to-scan UPI QR codes in seconds.
        </p>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-14">
          <button
            type="button"
            onClick={onStartCreating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <QrCode className="w-4 h-4" />
            Create Payment
          </button>
          <button
            type="button"
            onClick={scrollToHowItWorks}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            How It Works
          </button>
        </div>

        {/* Premium interactive animated visual card */}
        <div className="max-w-xl mx-auto p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-slate-900/5 glow-emerald">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Interactive Split Mechanism
          </div>

          {/* Original Total Amount Box */}
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total:</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              ₹5,000
            </span>
          </div>

          {/* Dividing Arrow indicator */}
          <div className="my-3 flex items-center justify-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 animate-bounce">
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Resulting Split Breakdown */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col items-center">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Part 1</span>
              <span className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                ₹1,999
              </span>
            </div>
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col items-center">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Part 2</span>
              <span className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                ₹1,999
              </span>
            </div>
            <div className="p-3 rounded-xl border border-teal-500/20 bg-teal-50/50 dark:bg-teal-950/20 flex flex-col items-center">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Part 3</span>
              <span className="text-sm sm:text-base font-bold text-teal-700 dark:text-teal-400 font-mono">
                ₹1,002
              </span>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Exact sum preserved: ₹1,999 + ₹1,999 + ₹1,002 = ₹5,000.00</span>
          </div>
        </div>
      </div>
    </section>
  );
}

