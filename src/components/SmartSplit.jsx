import React from 'react';
import { IndianRupee, Info, Check, AlertCircle } from 'lucide-react';
import { calculateSmartSplit } from '../utils/splitAmount.js';
import { formatINR, toPaise } from '../utils/currency.js';

const SMART_PRESETS = [999, 1999, 2000, 4999];

export default function SmartSplit({ totalPaise, maxPartAmount, onChangeMaxPartAmount }) {
  const maxPaise = toPaise(maxPartAmount);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) {
      onChangeMaxPartAmount(val);
    }
  };

  const previewParts = totalPaise > 0 && maxPaise > 0 ? calculateSmartSplit(totalPaise, maxPaise) : [];

  const isCapGreaterThanTotal = totalPaise > 0 && maxPaise >= totalPaise;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="max-amount-input"
            className="text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Maximum Amount Per Part
          </label>
          {maxPaise > 0 && (
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              Cap: {formatINR(maxPaise)}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Amounts will be allocated up to this ceiling, with the final remainder in the last part.
        </p>
      </div>

      <div className="relative rounded-xl shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <IndianRupee className="w-4 h-4" />
        </div>
        <input
          id="max-amount-input"
          type="text"
          inputMode="decimal"
          value={maxPartAmount}
          onChange={handleInputChange}
          placeholder="e.g. 1999"
          className="block w-full pl-9 pr-4 py-2.5 text-base font-mono font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/20"
        />
      </div>

      {/* Suggested presets */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Quick Caps:</span>
        <div className="flex flex-wrap gap-1.5">
          {SMART_PRESETS.map((cap) => (
            <button
              key={cap}
              type="button"
              onClick={() => onChangeMaxPartAmount(String(cap))}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg font-mono transition-all ${
                String(maxPartAmount) === String(cap)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              ₹{cap.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
      </div>

      {isCapGreaterThanTotal && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            The maximum per part ({formatINR(maxPaise)}) is greater than or equal to the total amount ({formatINR(totalPaise)}). A single payment part will be generated.
          </span>
        </div>
      )}

      {/* Live Preview */}
      {previewParts.length > 0 && (
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Result: {previewParts.length} Payment {previewParts.length === 1 ? 'Part' : 'Parts'}</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Exact Total: {formatINR(totalPaise)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {previewParts.map((partPaise, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 flex items-center gap-2"
              >
                <span className="text-[10px] text-slate-400 font-sans">Part {idx + 1}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(partPaise)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Informational Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
        <span>
          Smart Split divides your amount into manageable payment parts. It does not change any applicable taxes, fees, limits, or financial rules.
        </span>
      </div>
    </div>
  );
}

