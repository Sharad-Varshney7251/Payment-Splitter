import React from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import { calculateEqualSplit } from '../utils/splitAmount.js';
import { formatINR } from '../utils/currency.js';

const QUICK_PARTS = [2, 3, 4, 5];

export default function EqualSplit({ totalPaise, parts, onChangeParts }) {
  const safeParts = Math.max(1, Math.min(20, Number(parts) || 2));

  const handleIncrement = () => {
    if (safeParts < 20) onChangeParts(safeParts + 1);
  };

  const handleDecrement = () => {
    if (safeParts > 2) onChangeParts(safeParts - 1);
  };

  // Calculate preview parts
  const previewParts = totalPaise > 0 ? calculateEqualSplit(totalPaise, safeParts) : [];

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label htmlFor="equal-parts-input" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Number of Parts
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total amount is distributed equally. Any odd paise are balanced mathematically.
          </p>
        </div>

        {/* Stepper control */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={safeParts <= 2}
            className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Decrease parts"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-14 text-center font-mono font-bold text-lg text-slate-900 dark:text-white">
            {safeParts}
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={safeParts >= 20}
            className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Increase parts"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Parts Selectors */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Presets:</span>
        <div className="flex gap-1.5">
          {QUICK_PARTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChangeParts(p)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg font-mono transition-all ${
                safeParts === p
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {p} parts
            </button>
          ))}
        </div>
      </div>

      {/* Live Breakdown Preview */}
      {previewParts.length > 0 && (
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Live Split Preview</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Sum: {formatINR(totalPaise)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {previewParts.map((partPaise, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 flex items-center gap-2"
              >
                <span className="text-[10px] text-slate-400 font-sans">QR {idx + 1}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(partPaise)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

