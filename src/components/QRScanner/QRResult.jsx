import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Copy, 
  Check, 
  ShieldCheck, 
  User, 
  AtSign, 
  IndianRupee, 
  FileText, 
  ExternalLink,
  Info
} from 'lucide-react';
import { formatINR, toPaise } from '../../utils/currency.js';

export default function QRResult({ parsedResult, onConfirm, onScanAnother }) {
  const [copied, setCopied] = useState(false);

  if (!parsedResult) return null;

  // Case 1: Valid UPI QR Code
  if (parsedResult.isUpi && !parsedResult.error && parsedResult.data) {
    const { upiId, payeeName, amount, currency, note } = parsedResult.data;
    const amountPaise = amount ? toPaise(amount) : null;

    return (
      <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Detection Header */}
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">
              UPI QR Detected
            </span>
            <span className="text-xs opacity-90">
              Valid UPI payment parameters extracted successfully.
            </span>
          </div>
        </div>

        {/* Details Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {/* Payee Name */}
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Payee
            </span>
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
              {payeeName || <span className="text-slate-400 italic">Not specified</span>}
            </span>
          </div>

          {/* UPI ID */}
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5 text-slate-400" />
              UPI ID
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">
              {upiId}
            </span>
          </div>

          {/* Existing Amount */}
          <div className="p-3.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
              Existing Amount
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {amountPaise ? (
                formatINR(amountPaise)
              ) : (
                <span className="text-xs text-slate-400 font-sans font-normal italic">
                  Not embedded in QR
                </span>
              )}
            </span>
          </div>

          {/* Payment Note */}
          {note && (
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Payment Note
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 italic truncate max-w-[200px]">
                {note}
              </span>
            </div>
          )}
        </div>

        {/* Safety Note */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            Always verify the recipient UPI ID and name before confirming any transaction.
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onConfirm(parsedResult.data)}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95"
          >
            <span>Use These Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onScanAnother}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-semibold text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </button>
        </div>
      </div>
    );
  }

  // Case 2: UPI Scheme present but invalid/missing parameters
  if (parsedResult.isUpi && parsedResult.error) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Incomplete UPI QR Code</span>
          </div>
          <p className="text-xs leading-relaxed">
            {parsedResult.error}
          </p>
        </div>

        <button
          type="button"
          onClick={onScanAnother}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Scan Another QR</span>
        </button>
      </div>
    );
  }

  // Case 3: Non-UPI QR (URL or Plain Text)
  const isUrl = parsedResult.type === 'url';
  const displayContent = parsedResult.content || '';

  const handleCopyContent = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(displayContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300">
        <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <span className="text-xs font-bold uppercase tracking-wider block">
            QR Code Detected (Non-UPI)
          </span>
          <span className="text-xs opacity-90">
            {isUrl ? 'Website Link' : 'Plain Text QR'}
          </span>
        </div>
      </div>

      {/* Content Box */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Content</span>
          <button
            type="button"
            onClick={handleCopyContent}
            className="inline-flex items-center gap-1 text-[11px] hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Copy decoded text"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-all max-h-36 overflow-y-auto">
          {displayContent}
        </div>
      </div>

      {/* Clear Guidance as required by Section 6 */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        This QR is not a UPI payment QR, so SplitPay cannot use it to create UPI payment splits.
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onScanAnother}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-sm transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Scan Another QR</span>
      </button>
    </div>
  );
}

