import React from 'react';
import { Shield, Lock, AlertOctagon, CheckCircle, Scale, EyeOff } from 'lucide-react';

export default function SafetyNotice() {
  return (
    <section id="safety-notice" className="py-16 border-t border-slate-200/80 dark:border-slate-800/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            Zero-Knowledge Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            UPI Safety & Privacy
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Essential guidelines and our strict commitment to client-side data privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Your UPI Information */}
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/70 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                Your UPI Information
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>Your UPI ID is used strictly to render the payment QR codes locally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>All splitting calculations and QR generations execute entirely in your browser.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>No payment amounts, payee names, or notes are stored or transmitted to external servers.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              Zero backend persistence in this MVP.
            </div>
          </div>

          {/* Card 2: Before You Pay (Security Rules) */}
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/70 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                Before You Pay
              </h3>
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-rose-800 dark:text-rose-300 mb-3">
                Always verify the payee name and amount in your UPI app before confirming a payment.
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Never share your UPI PIN or OTP with anyone.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Never enter a PIN to receive money (UPI PIN is ONLY for paying).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>SplitPay will never ask for your PIN, card number, CVV, or passwords.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              Only approve payments you intentionally initiated.
            </div>
          </div>

          {/* Card 3: Regulatory & Privacy Notice */}
          <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/70 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                Financial & Regulatory Notice
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                Payment splitting does not change applicable taxes, fees, transaction rules, or regulatory requirements.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                "SplitPay is designed as a client-side payment-splitting utility. In this MVP, your payment details are not intentionally sent to or stored on a SplitPay backend."
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              Strictly compliant with Indian financial guidelines.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

