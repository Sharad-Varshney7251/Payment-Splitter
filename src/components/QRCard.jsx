import React, { useEffect, useRef, useState } from 'react';
import { 
  Download, 
  Copy, 
  Share2, 
  ExternalLink, 
  Check, 
  QrCode, 
  User, 
  FileText, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { renderQrToCanvas, downloadQrImage } from '../utils/qr.js';
import { launchUpiApp, isMobileDevice } from '../utils/upi.js';
import { formatINR } from '../utils/currency.js';
import { useToast } from './Toast.jsx';

export default function QRCard({ 
  index, 
  totalParts, 
  amountPaise, 
  upiUri, 
  upiId, 
  payeeName, 
  note 
}) {
  const canvasRef = useRef(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (canvasRef.current && upiUri) {
      renderQrToCanvas(canvasRef.current, upiUri, {
        width: 260,
        margin: 2
      }).catch(err => {
        console.error('QR Render Error:', err);
      });
    }
  }, [upiUri]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(upiUri);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = upiUri;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      addToast('Payment link copied to clipboard', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      addToast('Failed to copy payment link', 'error');
    }
  };

  const handleCopyUpiId = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(upiId);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = upiId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedUpi(true);
      addToast('UPI ID copied to clipboard', 'success');
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch (err) {
      addToast('Failed to copy UPI ID', 'error');
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    const filename = `splitpay-payment-${index + 1}.png`;
    const success = await downloadQrImage(upiUri, filename);
    setIsDownloading(false);
    if (success) {
      addToast(`Downloaded ${filename}`, 'success');
    } else {
      addToast('Failed to download QR code image', 'error');
    }
  };

  const handleOpenUpiApp = () => {
    const result = launchUpiApp(upiUri);
    if (!result.launched) {
      addToast(result.reason || 'Please scan the QR code using a mobile UPI app.', 'info', 5000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `SplitPay Payment ${index + 1}`,
      text: `Payment of ${formatINR(amountPaise)} to ${payeeName || upiId} (${upiId})${note ? ` for "${note}"` : ''}`,
      url: upiUri
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast('Payment shared successfully', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      // Graceful fallback to copying the payment link
      handleCopyLink();
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 overflow-hidden group">
      {/* Card Header */}
      <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Payment {index + 1} of {totalParts}
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight mt-0.5">
            {formatINR(amountPaise)}
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
          #{index + 1}
        </div>
      </div>

      {/* QR Code Container */}
      <div className="p-6 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="relative p-3.5 rounded-2xl bg-white border-2 border-slate-100 dark:border-slate-800 shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-48 h-48 sm:w-52 sm:h-52 block rounded-lg"
            aria-label={`UPI QR Code for Payment ${index + 1} amount ${formatINR(amountPaise)}`}
          />
          {/* Subtle center watermark indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-emerald-600 font-extrabold text-xs">
              ₹
            </div>
          </div>
        </div>

        <span className="mt-3 text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Smartphone className="w-3 h-3" />
          Scan with GPay, PhonePe, Paytm or BHIM
        </span>
      </div>

      {/* Payee & Transaction Details */}
      <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2 text-xs">
        {payeeName && (
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="text-slate-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Payee:
            </span>
            <span className="font-semibold truncate max-w-[170px]" title={payeeName}>
              {payeeName}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
          <span className="text-slate-400 flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" /> UPI ID:
          </span>
          <span className="font-mono font-medium truncate max-w-[170px] text-emerald-600 dark:text-emerald-400" title={upiId}>
            {upiId}
          </span>
        </div>

        {note && (
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span className="text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Note:
            </span>
            <span className="truncate max-w-[170px] text-slate-500 italic" title={note}>
              {note}
            </span>
          </div>
        )}
      </div>

      {/* Actions Toolbar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
        {/* Primary Action: Open in UPI App */}
        <button
          type="button"
          onClick={handleOpenUpiApp}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow-emerald-600/20 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open UPI App
        </button>

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Copy standard UPI deep-link URI"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyUpiId}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Copy payee VPA / UPI ID"
          >
            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Download QR code as PNG image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Saving...' : 'Download QR'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Share payment details"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}

