import React from 'react';
import { QrCode, ArrowUpRight, Sparkles } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-12 px-4 sm:px-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
        <QrCode className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
        Ready when you are
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Enter your payment details above to create a smart payment split and generate scannable UPI QR codes.
      </p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/20">
        <Sparkles className="w-3 h-3" />
        Instant client-side QR generation
      </div>
    </div>
  );
}

