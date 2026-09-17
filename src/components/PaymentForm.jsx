import React, { useState } from 'react';
import AmountInput from './AmountInput.jsx';
import SplitSelector from './SplitSelector.jsx';
import EqualSplit from './EqualSplit.jsx';
import SmartSplit from './SmartSplit.jsx';
import CustomSplit from './CustomSplit.jsx';
import { validateAmount, toPaise } from '../utils/currency.js';
import { validateUpiId, generateUpiUri } from '../utils/upi.js';
import { calculateEqualSplit, calculateSmartSplit, evaluateCustomSplit } from '../utils/splitAmount.js';
import { 
  QrCode, 
  User, 
  FileText, 
  AtSign, 
  Sparkles, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentForm({ onGenerateSplit }) {
  const [totalAmount, setTotalAmount] = useState('5000');
  const [upiId, setUpiId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [splitMode, setSplitMode] = useState('smart'); // 'equal' | 'smart' | 'custom'

  // Sub-configuration states
  const [equalParts, setEqualParts] = useState(3);
  const [smartMaxAmount, setSmartMaxAmount] = useState('1999');
  const [customParts, setCustomParts] = useState(['2000', '1500', '1500']);

  // Validation errors
  const [errors, setErrors] = useState({});

  const totalPaise = toPaise(totalAmount);

  // Validate form and split validity
  const checkValidity = () => {
    const newErrors = {};

    const amountValidation = validateAmount(totalAmount);
    if (!amountValidation.isValid) {
      newErrors.totalAmount = amountValidation.error;
    }

    const upiValidation = validateUpiId(upiId);
    if (!upiValidation.isValid) {
      newErrors.upiId = upiValidation.error;
    }

    if (splitMode === 'smart') {
      const maxPaise = toPaise(smartMaxAmount);
      if (maxPaise <= 0) {
        newErrors.smartMax = 'Please specify a maximum amount greater than ₹0.';
      }
    }

    if (splitMode === 'custom') {
      const partsInPaise = customParts.map(p => toPaise(p));
      const { isExact, isOver, overByPaise, isUnder } = evaluateCustomSplit(totalPaise, partsInPaise);
      if (!isExact) {
        if (isOver) {
          newErrors.custom = `Custom amounts exceed total by ₹${(overByPaise / 100).toFixed(2)}.`;
        } else if (isUnder) {
          newErrors.custom = 'Custom amounts do not sum to total amount yet.';
        } else {
          newErrors.custom = 'Custom split amounts must exactly match the total.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!checkValidity()) return;

    let partsPaise = [];
    if (splitMode === 'equal') {
      partsPaise = calculateEqualSplit(totalPaise, equalParts);
    } else if (splitMode === 'smart') {
      partsPaise = calculateSmartSplit(totalPaise, toPaise(smartMaxAmount));
    } else if (splitMode === 'custom') {
      partsPaise = customParts.map(p => toPaise(p));
    }

    if (partsPaise.length === 0) return;

    // Generate UPI URIs for each split part
    const splitData = partsPaise.map((amtPaise, index) => {
      const uri = generateUpiUri({
        upiId,
        amountPaise: amtPaise,
        payeeName,
        note: paymentNote ? `${paymentNote} (${index + 1}/${partsPaise.length})` : `Split ${index + 1} of ${partsPaise.length}`
      });

      return {
        id: `split-${index + 1}-${Date.now()}`,
        index,
        amountPaise: amtPaise,
        upiUri: uri,
        upiId,
        payeeName,
        note: paymentNote
      };
    });

    // Fire subtle celebratory confetti for polish
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (_) {}

    onGenerateSplit({
      totalPaise,
      splitMode,
      splitData,
      payeeName,
      upiId,
      paymentNote
    });
  };

  // Custom split status check to conditionally disable generate button if in custom mode
  const isCustomInvalid = splitMode === 'custom' && !evaluateCustomSplit(totalPaise, customParts.map(p => toPaise(p))).isExact;

  return (
    <form onSubmit={handleGenerate} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Financial & UPI Inputs */}
        <div className="space-y-5 p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1. Payment Information
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the total amount to split and payee details.
            </p>
          </div>

          {/* Total Amount Input */}
          <AmountInput
            value={totalAmount}
            onChange={(val) => {
              setTotalAmount(val);
              if (errors.totalAmount) setErrors(prev => ({ ...prev, totalAmount: null }));
            }}
            error={errors.totalAmount}
          />

          {/* UPI ID Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="upi-id-input"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                UPI ID (VPA) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">e.g. merchant@okhdfcbank</span>
            </div>

            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                id="upi-id-input"
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  if (errors.upiId) setErrors(prev => ({ ...prev, upiId: null }));
                }}
                placeholder="example@upi"
                className={`block w-full pl-9 pr-4 py-2.5 text-sm font-mono rounded-xl bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 ${
                  errors.upiId
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500/20'
                }`}
                aria-invalid={!!errors.upiId}
              />
            </div>

            {errors.upiId ? (
              <div className="flex items-start gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{errors.upiId}</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-slate-400" />
                Format validation only; does not query banking systems for existence.
              </p>
            )}
          </div>

          {/* Payee Name (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="payee-name-input"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <span>Payee Name</span>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="payee-name-input"
                type="text"
                value={payeeName}
                onChange={(e) => setPayeeName(e.target.value)}
                placeholder="Sharad Varshney"
                className="block w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Payment Note (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="payment-note-input"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <span>Payment Note / Reference</span>
              <span className="text-xs text-slate-400 font-normal">Optional</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <input
                id="payment-note-input"
                type="text"
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="Website Development Payment"
                className="block w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Split Selector & Mode Options */}
        <div className="space-y-5 p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/90 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                2. Partition Strategy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose how your ₹ amount will be divided across payment QRs.
              </p>
            </div>

            <SplitSelector
              currentMode={splitMode}
              onSelectMode={(mode) => {
                setSplitMode(mode);
                setErrors(prev => ({ ...prev, custom: null, smartMax: null }));
              }}
            />

            {splitMode === 'equal' && (
              <EqualSplit
                totalPaise={totalPaise}
                parts={equalParts}
                onChangeParts={setEqualParts}
              />
            )}

            {splitMode === 'smart' && (
              <SmartSplit
                totalPaise={totalPaise}
                maxPartAmount={smartMaxAmount}
                onChangeMaxPartAmount={setSmartMaxAmount}
              />
            )}

            {splitMode === 'custom' && (
              <CustomSplit
                totalPaise={totalPaise}
                customParts={customParts}
                onChangeCustomParts={setCustomParts}
              />
            )}

            {errors.custom && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.custom}</span>
              </div>
            )}
          </div>

          {/* Submission CTA */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              disabled={isCustomInvalid}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/35 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <QrCode className="w-4 h-4" />
              Generate Split QR Codes
            </button>
            {isCustomInvalid && (
              <p className="text-center text-[11px] text-amber-600 dark:text-amber-400 mt-2">
                Please balance custom parts to equal total amount exactly before generating.
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

