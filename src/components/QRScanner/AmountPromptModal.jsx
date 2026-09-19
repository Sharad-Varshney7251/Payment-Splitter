import React from 'react';
import { IndianRupee, HelpCircle, ArrowRight, X } from 'lucide-react';
import { formatINR, toPaise } from '../../utils/currency.js';

export default function AmountPromptModal({ 
  scannedAmount, 
  currentAmount, 
  onChooseScanned, 
  onKeepCurrent, 
  onCancel 
}) {
  const scannedPaise = toPaise(scannedAmount);
  const currentPaise = toPaise(currentAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="amount-conflict-title"
      >
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h3 id="amount-conflict-title" className="text-lg font-extrabold text-slate-900 dark:text-white">
            Use {formatINR(scannedPaise)} from scanned QR?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The scanned UPI QR has an embedded amount of <strong>{formatINR(scannedPaise)}</strong>, but you already have <strong>{formatINR(currentPaise)}</strong> entered in the payment form.
          </p>
        </div>

        {/* Amount Comparison Box */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="block text-[11px] font-medium text-slate-400">Scanned QR</span>
            <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
              {formatINR(scannedPaise)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span className="block text-[11px] font-medium text-slate-400">Current Amount</span>
            <span className="font-mono font-bold text-base text-slate-700 dark:text-slate-300">
              {formatINR(currentPaise)}
            </span>
          </div>
        </div>

        {/* Choice buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onChooseScanned}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all text-center"
          >
            Use Scanned Amount ({formatINR(scannedPaise)})
          </button>

          <button
            type="button"
            onClick={onKeepCurrent}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-semibold text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-center"
          >
            Keep My Amount ({formatINR(currentPaise)})
          </button>
        </div>
      </div>
    </div>
  );
}

