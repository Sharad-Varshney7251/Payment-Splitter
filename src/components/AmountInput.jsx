import React from 'react';
import { formatINR, toPaise } from '../utils/currency.js';
import { IndianRupee, AlertCircle } from 'lucide-react';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function AmountInput({ value, onChange, error }) {
  const handleInputChange = (e) => {
    const val = e.target.value;
    // Allow empty string, numbers, and at most one decimal point with up to 2 decimal places
    if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) {
      onChange(val);
    }
  };

  const currentPaise = toPaise(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="total-amount-input"
          className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
        >
          Total Amount <span className="text-rose-500">*</span>
        </label>
        {currentPaise > 0 && (
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            {formatINR(currentPaise, false)}
          </span>
        )}
      </div>

      <div className="relative rounded-xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <IndianRupee className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </div>

        <input
          id="total-amount-input"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleInputChange}
          placeholder="e.g. 5000"
          className={`block w-full pl-10 pr-4 py-3 text-lg font-mono font-semibold rounded-xl bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-500 text-rose-900 dark:text-rose-100 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500/20'
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? 'amount-error' : undefined}
        />
      </div>

      {error && (
        <div id="amount-error" className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Amount Buttons */}
      <div className="pt-1">
        <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
          Quick Amounts
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((amt) => {
            const isSelected = String(amt) === String(value);
            return (
              <button
                key={amt}
                type="button"
                onClick={() => onChange(String(amt))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg font-mono transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

