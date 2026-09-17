import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ShieldAlert, 
  Layers, 
  CreditCard,
  QrCode
} from 'lucide-react';
import { formatINR } from '../utils/currency.js';

export default function PaymentSummary({ 
  totalPaise, 
  splitParts, 
  splitMode, 
  onReset 
}) {
  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 mb-10 glow-emerald">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Payment Split Created
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payment Summary
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deterministic split generated using <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{splitMode} Split</span> mode.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          Create New Split
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Amount
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {formatINR(totalPaise)}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Payments
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {splitParts.length} Parts
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                QRs Ready
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 ml-1">
                Unverified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Split breakdown list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Breakdown Progression</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">
            100% Allocated ({formatINR(totalPaise)})
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex p-0.5 gap-0.5 border border-slate-200/60 dark:border-slate-700/60">
          {splitParts.map((partPaise, idx) => {
            const widthPct = (partPaise / totalPaise) * 100;
            return (
              <div
                key={idx}
                style={{ width: `${widthPct}%` }}
                className="h-full rounded-sm bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                title={`Part ${idx + 1}: ${formatINR(partPaise)} (${widthPct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Pill list */}
        <div className="flex flex-wrap gap-2 pt-1">
          {splitParts.map((partPaise, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-mono"
            >
              <span className="text-slate-400 font-sans">#{idx + 1}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatINR(partPaise)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Section 22: Payment Verification Disclaimer */}
      <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong className="font-bold block text-sm mb-0.5">Payment Verification Notice</strong>
          SplitPay generates UPI payment QR codes but does <strong>not</strong> verify whether a payment has been completed or received. QR generation or scanning does not prove receipt of funds. Always confirm transaction status directly in your banking app.
        </div>
      </div>
    </div>
  );
}

