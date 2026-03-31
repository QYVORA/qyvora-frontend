import { ThemeProvider, AuthProvider, ToastProvider, ModalProvider } from '@/core/contexts'
import { AppRouter } from '@/app/router'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ModalProvider>
            <AppRouter />
          </ModalProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
