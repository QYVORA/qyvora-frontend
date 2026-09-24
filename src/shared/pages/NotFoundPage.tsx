import { ArrowRight, LayoutDashboard } from 'lucide-react';
import SEO from '../components/SEO';
import Button from '@/shared/components/ui/Button';
import { useAuth } from '@/core/contexts/AuthContext';
import ADMIN_PATH from '@/shared/utils/adminPath';

const NotFoundPage = () => {
  const { user, loading } = useAuth();
  const dashboardHref = user?.isAdmin ? `${ADMIN_PATH}/dashboard` : '/dashboard';

  return (
    <div
      className="flex min-h-dvh w-full flex-col items-center justify-center bg-bg px-3 py-20 md:px-4 lg:px-6"
      data-theme-persist="dark"
    >
      <SEO
        title="404 - Node Not Found"
        description="The requested page could not be located on the QYVORA network."
        noindex
      />

      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/50 bg-bg-card shadow-[var(--card-shadow)]">
        <div className="flex items-center justify-between gap-2 border-b border-border/20 bg-bg-elevated px-4 py-3">
          <span className="truncate font-mono text-xs text-text-muted">
            {"qyvora@core:~$"}
          </span>
          <span className="shrink-0 font-mono text-xs font-black uppercase tracking-widest text-accent">
            {"HTTP 404"}
          </span>
        </div>

        <div className="px-5 py-10 text-center sm:px-10 sm:py-14">
          <span
            aria-hidden="true"
            className="block leading-none tracking-tight text-text-primary text-6xl font-black md:text-8xl"
          >
            404
          </span>
          <h1 className="mt-4 text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
            {"Lost in the Network?"}
          </h1>
          <p className="mx-auto mt-4 max-w-md font-mono text-sm leading-relaxed text-text-secondary md:text-base">
            {"The page you were looking for has been scrubbed from the network or moved to a new address. Let's get you back to base."}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button
              to="/"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<ArrowRight className="h-4 w-4 rotate-180" />}
            >
              {"Return to Base"}
            </Button>
            {!loading && user && (
              <Button
                to={dashboardHref}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                trailingIcon={<LayoutDashboard className="h-4 w-4" />}
              >
                {"Go to Dashboard"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;