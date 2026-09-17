import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div 
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none"
      >
        {toasts.map(toast => {
          let Icon = CheckCircle2;
          let colorStyles = 'bg-emerald-900/90 border-emerald-700 text-emerald-100 dark:bg-emerald-950/95 dark:border-emerald-700/80';

          if (toast.type === 'error') {
            Icon = AlertCircle;
            colorStyles = 'bg-rose-900/90 border-rose-700 text-rose-100 dark:bg-rose-950/95 dark:border-rose-700/80';
          } else if (toast.type === 'info') {
            Icon = Info;
            colorStyles = 'bg-slate-900/90 border-slate-700 text-slate-100 dark:bg-slate-900/95 dark:border-slate-700';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 ${colorStyles}`}
              role="alert"
            >
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-white"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

