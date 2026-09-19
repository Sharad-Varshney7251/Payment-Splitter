import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRUpload({ onDecoded }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (.png, .jpg, .jpeg, .webp).');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create off-screen scanner ID container if needed
      const tempId = 'qr-upload-temp-node';
      let tempNode = document.getElementById(tempId);
      if (!tempNode) {
        tempNode = document.createElement('div');
        tempNode.id = tempId;
        tempNode.style.display = 'none';
        document.body.appendChild(tempNode);
      }

      const html5QrCode = new Html5Qrcode(tempId);
      try {
        const decodedText = await html5QrCode.scanFile(file, false);
        html5QrCode.clear();
        setIsProcessing(false);
        if (decodedText) {
          onDecoded(decodedText);
        }
      } catch (scanErr) {
        html5QrCode.clear();
        setIsProcessing(false);
        setError('No QR code detected in this image. Please try another image with better lighting and contrast.');
      }
    } catch (err) {
      setIsProcessing(false);
      setError('Failed to process the uploaded image.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
          dragActive
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:border-emerald-500/60 dark:hover:border-emerald-500/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleChange}
          className="hidden"
          aria-label="Upload QR Code Image"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Decoding QR code...
            </span>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Choose or drop a QR image
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Supports PNG, JPG, JPEG, and WEBP. Decoded entirely inside your browser.
            </p>

            <button
              type="button"
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors pointer-events-none"
            >
              Browse Files
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

