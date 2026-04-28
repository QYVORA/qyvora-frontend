import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback. If omitted the default full-page error UI is shown. */
  fallback?: ReactNode;
  /** Scope label shown in the error card (e.g. "Dashboard", "Bootcamp") */
  scope?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary — catches rendering errors in the subtree and shows a
 * fallback UI instead of a blank screen.
 *
 * Usage:
 *   <ErrorBoundary scope="Dashboard">
 *     <DashboardPage />
 *   </ErrorBoundary>
 *
 * React requires this to be a class component — hooks cannot catch render errors.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Log to console in dev; swap for a real error-reporting service in prod
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  private reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, scope } = this.props;

    if (!hasError) return children;

    if (fallback) return fallback;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
            <Terminal className="w-7 h-7 text-red-400" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em]">
              // {scope ? `${scope} — ` : ''}Render Error
            </p>
            <h2 className="text-xl font-black text-text-primary">Something went wrong</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              This section crashed unexpectedly. The rest of the app is still running.
            </p>
          </div>

          {/* Error message — dev only */}
          {import.meta.env.DEV && error && (
            <div className="text-left p-4 bg-bg-card border border-red-500/20 rounded-xl overflow-auto max-h-40">
              <p className="text-[11px] font-mono text-red-400 break-all whitespace-pre-wrap">
                {error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={this.reset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-bg rounded-xl text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => { window.location.href = '/dashboard'; }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border text-text-muted rounded-xl text-sm font-bold uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
