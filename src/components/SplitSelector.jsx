import React from 'react';
import { Divide, Sparkles, Sliders } from 'lucide-react';

const SPLIT_MODES = [
  {
    id: 'equal',
    label: 'Equal Split',
    description: 'Even distribution across parts',
    icon: Divide
  },
  {
    id: 'smart',
    label: 'Smart Split',
    description: 'Custom maximum limit per part',
    icon: Sparkles
  },
  {
    id: 'custom',
    label: 'Custom Split',
    description: 'Tailored amounts for each QR',
    icon: Sliders
  }
];

export default function SplitSelector({ currentMode, onSelectMode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        Choose Split Method
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
        {SPLIT_MODES.map((mode) => {
          const isSelected = currentMode === mode.id;
          const Icon = mode.icon;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={`flex flex-col sm:items-center text-left sm:text-center p-3 sm:py-3.5 sm:px-2 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 sm:flex-col sm:gap-1.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400'
                      : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold tracking-tight">
                  {mode.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 hidden sm:block">
                {mode.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

