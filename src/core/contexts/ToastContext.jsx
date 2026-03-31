import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const STYLES = {
  success: 'border-green-500/30 bg-green-500/10 text-green-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-400',
  info: 'border-accent/30 bg-accent/10 text-accent',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
}

function Toast({ toast, onRemove }) {
  const Icon = ICONS[toast.type] || Info
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm card shadow-2xl animate-slide-in-right w-full sm:min-w-[300px] sm:max-w-[420px] ${STYLES[toast.type]}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
        <p className={`text-sm ${toast.title ? 'text-[var(--text-secondary)] mt-0.5' : ''}`}>{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, title, message }])
    if (duration > 0) {
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
    }
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 left-6 sm:left-auto z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be within ToastProvider')
  return ctx
}
