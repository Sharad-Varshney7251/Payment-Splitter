import React, { useState, useEffect } from 'react';
import { X, Camera, Upload, Shield, QrCode } from 'lucide-react';
import QRScanner from './QRScanner.jsx';
import QRUpload from './QRUpload.jsx';
import QRResult from './QRResult.jsx';
import { parseQrContent } from '../../utils/parseUpiQr.js';

export default function QRScannerModal({ isOpen, onClose, onConfirmDetails }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'upload'
  const [decodedResult, setDecodedResult] = useState(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDecoded = (rawText) => {
    const parsed = parseQrContent(rawText);
    setDecodedResult(parsed);
  };

  const handleScanAnother = () => {
    setDecodedResult(null);
  };

  const handleConfirm = (data) => {
    onConfirmDetails(data);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-modal-title"
    >
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 id="scanner-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Scan QR Code
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Scan any UPI QR code to auto-detect payment details.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close scanner modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {decodedResult ? (
            /* Result view */
            <QRResult
              parsedResult={decodedResult}
              onConfirm={handleConfirm}
              onScanAnother={handleScanAnother}
            />
          ) : (
            /* Active scanner views */
            <div className="space-y-4">
              {/* Tab Selector: Camera vs Upload */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab('camera')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'camera'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Camera Scanner
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'upload'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload QR Image
                </button>
              </div>

              {/* View Content */}
              {activeTab === 'camera' ? (
                <QRScanner
                  onDecoded={handleDecoded}
                  onSwitchToUpload={() => setActiveTab('upload')}
                />
              ) : (
                <QRUpload onDecoded={handleDecoded} />
              )}
            </div>
          )}
        </div>

        {/* Safety & Verification Notice Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 shrink-0 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            Scanned locally in your browser. Review payee details carefully. Never enter your UPI PIN or banking credentials to receive money.
          </span>
        </div>
      </div>
    </div>
  );
}

