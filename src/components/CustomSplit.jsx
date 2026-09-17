import React from 'react';
import { Plus, Trash2, CheckCircle2, AlertTriangle, IndianRupee, Sparkles } from 'lucide-react';
import { evaluateCustomSplit } from '../utils/splitAmount.js';
import { formatINR, toPaise, toRupees } from '../utils/currency.js';

export default function CustomSplit({ totalPaise, customParts, onChangeCustomParts }) {
  // customParts is an array of strings e.g. ['2000', '1500', '']
  const partsInPaise = customParts.map(p => toPaise(p));
  const { sumPaise, remainingPaise, overByPaise, isExact, isOver, isUnder } = evaluateCustomSplit(
    totalPaise,
    partsInPaise
  );

  const handlePartChange = (index, value) => {
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      const next = [...customParts];
      next[index] = value;
      onChangeCustomParts(next);
    }
  };

  const handleAddPart = () => {
    // If there is remaining paise, pre-fill with remaining, else empty string
    const prefill = remainingPaise > 0 ? String(toRupees(remainingPaise)) : '';
    onChangeCustomParts([...customParts, prefill]);
  };

  const handleRemovePart = (index) => {
    if (customParts.length <= 2) return;
    const next = customParts.filter((_, i) => i !== index);
    onChangeCustomParts(next);
  };

  const handleFillRemaining = (index) => {
    if (remainingPaise <= 0) return;
    const currentValPaise = toPaise(customParts[index]);
    const nextValPaise = currentValPaise + remainingPaise;
    const next = [...customParts];
    next[index] = String(toRupees(nextValPaise));
    onChangeCustomParts(next);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Custom Part Allocation
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manually specify each payment portion. The sum must match the total exactly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddPart}
          disabled={customParts.length >= 10}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100 transition-all disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Part
        </button>
      </div>

      {/* Parts Input Rows */}
      <div className="space-y-2.5">
        {customParts.map((val, idx) => {
          const partPaise = toPaise(val);
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-xs font-semibold text-slate-500 font-mono">
                Part {idx + 1}:
              </span>

              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={val}
                  onChange={(e) => handlePartChange(idx, e.target.value)}
                  placeholder="0.00"
                  className="block w-full pl-8 pr-3 py-2 text-sm font-mono font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              {/* Fill remaining quick button */}
              {remainingPaise > 0 && idx === customParts.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleFillRemaining(idx)}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 hover:bg-emerald-200/80 transition-colors shrink-0"
                  title="Auto-fill the remaining amount into this field"
                >
                  <Sparkles className="w-3 h-3" />
                  Fill Rest
                </button>
              )}

              {/* Delete button (enabled if > 2 parts) */}
              <button
                type="button"
                onClick={() => handleRemovePart(idx)}
                disabled={customParts.length <= 2}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                aria-label={`Remove part ${idx + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Calculation Indicator Box */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 space-y-2">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="block text-slate-400 font-medium">Total</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {formatINR(totalPaise)}
            </span>
          </div>
          <div>
            <span className="block text-slate-400 font-medium">Entered</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {formatINR(sumPaise)}
            </span>
          </div>
          <div>
            <span className="block text-slate-400 font-medium">Remaining</span>
            <span
              className={`font-mono font-bold ${
                isExact
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isOver
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {formatINR(remainingPaise)}
            </span>
          </div>
        </div>

        {/* Status Alerts */}
        {isExact && (
          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Split perfectly balanced! Ready to generate QR codes.</span>
          </div>
        )}

        {isOver && (
          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs font-semibold text-rose-600 dark:text-rose-400 border-t border-rose-100 dark:border-rose-950/40">
            <AlertTriangle className="w-4 h-4" />
            <span>Your split exceeds the total amount by {formatINR(overByPaise)}.</span>
          </div>
        )}

        {isUnder && (
          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-amber-600 dark:text-amber-400 border-t border-amber-100 dark:border-amber-950/40">
            <span>Remaining to allocate: {formatINR(remainingPaise)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

