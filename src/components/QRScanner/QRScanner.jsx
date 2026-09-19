import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, RefreshCw, Upload, Sparkles, VideoOff } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanner({ onDecoded, onSwitchToUpload }) {
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(true);
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const containerId = 'splitpay-camera-scanner-view';

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      setIsStarting(true);
      setError(null);

      // Clean up previous instance if any
      if (scannerRef.current && isRunningRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch (_) {}
        isRunningRef.current = false;
      }

      try {
        const html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edge = Math.floor(minEdge * 0.72);
            return { width: edge, height: edge };
          },
          aspectRatio: 1.0
        };

        // Prefer environment/rear camera on mobile devices
        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (!mounted) return;
            // Stop scanning once detected to release camera
            if (isRunningRef.current) {
              isRunningRef.current = false;
              html5QrCode.stop().then(() => {
                html5QrCode.clear();
                onDecoded(decodedText);
              }).catch(() => {
                onDecoded(decodedText);
              });
            }
          },
          () => {
            // Frame callback without QR: ignore
          }
        );

        if (mounted) {
          isRunningRef.current = true;
          setIsStarting(false);
        }
      } catch (err) {
        if (!mounted) return;
        setIsStarting(false);
        isRunningRef.current = false;

        const errString = String(err).toLowerCase();
        if (errString.includes('permission') || errString.includes('notallowed')) {
          setError({
            type: 'permission',
            message: 'Camera permission was denied. Please allow camera access in your browser settings, or use the "Upload QR Image" option below.'
          });
        } else if (errString.includes('notfound') || errString.includes('device') || errString.includes('camera')) {
          setError({
            type: 'not_found',
            message: 'No camera found on this device. You can easily upload an existing QR code image instead.'
          });
        } else {
          setError({
            type: 'general',
            message: 'Unable to start camera stream. Please ensure camera is not currently used by another app, or upload an image.'
          });
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false;
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
        }).catch(() => {});
      }
    };
  }, [onDecoded]);

  return (
    <div className="space-y-4">
      {/* Scanner Viewport */}
      <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[380px] mx-auto rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
        {/* html5-qrcode target container */}
        <div id={containerId} className="w-full h-full object-cover" />

        {/* Custom Framing Overlay */}
        {!error && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8">
            {/* Viewfinder Target Frame */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl border-2 border-emerald-500/40">
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

              {/* Scanning laser effect */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" 
                   style={{
                     animation: 'scan-laser 2.2s ease-in-out infinite alternate',
                     top: '48%'
                   }}
              />
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isStarting && !error && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-semibold tracking-wide">
              Initializing camera...
            </span>
          </div>
        )}

        {/* Camera Error overlay */}
        {error && (
          <div className="absolute inset-0 bg-slate-950 p-6 flex flex-col items-center justify-center text-center gap-3 text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <VideoOff className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-200">
              {error.type === 'permission' ? 'Camera Access Denied' : 'Camera Unavailable'}
            </span>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              {error.message}
            </p>
            <button
              type="button"
              onClick={onSwitchToUpload}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload QR Image Instead
            </button>
          </div>
        )}
      </div>

      {/* Instruction text */}
      {!error && (
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Position the QR code inside the frame.
        </div>
      )}
    </div>
  );
}

