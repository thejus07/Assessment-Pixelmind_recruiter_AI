"use client";

import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border glass-panel shadow-lg animate-[slideIn_0.2s_ease-out] relative overflow-hidden"
          >
            {/* Slide animation helper */}
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
            `}</style>
            
            {/* Color Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
              t.type === 'success' ? 'bg-emerald-500' :
              t.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'
            }`} />

            <div className="mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-indigo-500" />}
            </div>

            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-sm text-foreground">{t.title}</h4>
              {t.description && (
                <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-muted-foreground hover:text-foreground transition-colors absolute top-3 right-3"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
export default ToastProvider;
