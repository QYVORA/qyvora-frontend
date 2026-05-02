import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../styles/index.css';
import { AuthProvider } from '../core/contexts/AuthContext';
import { ToastProvider } from '../core/contexts/ToastContext';
import { ThemeProvider } from '../core/contexts/ThemeContext';
import { TooltipProvider } from '../shared/components/ui/Tooltip';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
