import React from 'react';
import { CreditCard, SlidersHorizontal, QrCode, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Enter payment details',
    description: 'Enter the total amount, your payee UPI ID (VPA), and optional payee name or payment note.',
    icon: CreditCard,
    accent: 'from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400'
  },
  {
    step: '02',
    title: 'Choose your split',
    description: 'Pick Equal parts, Smart Split with a custom maximum cap, or customize each payment part manually.',
    icon: SlidersHorizontal,
    accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400'
  },
  {
    step: '03',
    title: 'Generate & scan',
    description: 'Instantly generate individual UPI QR codes to scan with Google Pay, PhonePe, Paytm, or BHIM.',
    icon: QrCode,
    accent: 'from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-20 border-t border-slate-200/60 dark:border-slate-800/60 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            Simple 3-Step Process
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How SplitPay Works
          </h3>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Split amounts mathematically in your browser without passing sensitive payment details to external servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200 dark:text-slate-800 group-hover:text-emerald-500/40 transition-colors font-mono">
                      {item.step}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center text-xs font-semibold text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <span>Step {index + 1} of 3</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

