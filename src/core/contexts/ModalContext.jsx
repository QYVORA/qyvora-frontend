import { createContext, useContext, useState, useCallback } from 'react'
import { X } from 'lucide-react'

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null)

  const openModal = useCallback((config) => setModal(config), [])
  const closeModal = useCallback(() => setModal(null), [])

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modal && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm animate-fade-in" onClick={modal.dismissible !== false ? closeModal : undefined} />
          <div className="relative card shadow-2xl shadow-black/50 w-full max-w-md animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <div>
                {modal.badge && (
                  <span className="tag bg-accent/10 text-accent border border-accent/20 mb-2">{modal.badge}</span>
                )}
                <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">{modal.title}</h3>
              </div>
              {modal.dismissible !== false && (
                <button onClick={closeModal} className="btn-ghost p-2 rounded-lg">
                  <X size={18} />
                </button>
              )}
            </div>
            {/* Body */}
            <div className="p-6">
              {modal.description && (
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{modal.description}</p>
              )}
              {modal.content}
            </div>
            {/* Footer */}
            {(modal.onConfirm || modal.onCancel) && (
              <div className="flex gap-3 p-6 pt-0">
                {modal.onCancel && (
                  <button onClick={() => { modal.onCancel(); closeModal() }} className="flex-1 btn-ghost border border-[var(--border)] py-2.5 rounded-lg">
                    {modal.cancelLabel || 'Cancel'}
                  </button>
                )}
                {modal.onConfirm && (
                  <button
                    onClick={() => { modal.onConfirm(); closeModal() }}
                    className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${modal.danger ? 'bg-red-500 hover:bg-red-400 text-white' : 'btn-primary'}`}
                  >
                    {modal.confirmLabel || 'Confirm'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be within ModalProvider')
  return ctx
}
