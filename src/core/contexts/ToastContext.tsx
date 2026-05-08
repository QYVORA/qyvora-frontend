import React, { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldAlert, CheckCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  addToast: (message: string, type: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container — above mobile bottom nav, bottom-right on desktop */}
      <div
        className="fixed bottom-[88px] md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-[100] flex flex-col gap-3 pointer-events-none md:w-[27rem]"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto px-5 py-4 rounded-2xl bg-bg-card border shadow-2xl flex items-start gap-3.5 w-full ${
                toast.type === 'success' ? 'border-accent/40' : toast.type === 'error' ? 'border-red-500/40' : 'border-blue-500/40'
              }`}
              role="status"
            >
              <div className={`flex-none mt-0.5 ${
                toast.type === 'success' ? 'text-accent' : toast.type === 'error' ? 'text-red-400' : 'text-blue-400'
              }`}>
                {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {toast.type === 'error' && <ShieldAlert className="w-5 h-5" />}
                {toast.type === 'info' && <Info className="w-5 h-5" />}
              </div>
              <p className="text-base text-text-primary flex-1 leading-snug">{toast.message}</p>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="flex-none text-text-muted hover:text-text-primary transition-colors mt-0.5"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
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
