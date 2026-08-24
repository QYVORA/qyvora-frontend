import { Link } from 'react-router-dom';
import { IconArrowRight, IconTerminal } from '@/shared/components/icons';
import SEO from '../components/SEO';
import Dobia from '@/shared/components/Dobia';
import { GridBoxedBackground } from '@/shared/components/backgrounds';

const NotFoundPage = () => (
  <div className="relative min-h-dvh bg-bg flex flex-col items-center justify-center overflow-hidden px-3 md:px-4 lg:px-6 py-20" data-nav-invert>
    <SEO
      title="404 - Node Not Found"
      description="The requested page could not be located on the QYVORA network."
      noindex
    />
    <GridBoxedBackground blur={0} mask="none" />

    <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
      <Dobia expression="confused" size="xl" />

      <div className="relative mt-5 w-full rounded-2xl border border-border/30 bg-bg-card px-6 sm:px-8 py-5 sm:py-6 shadow-[var(--card-shimmer)]">
        <span
          aria-hidden
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t border-border/30 bg-bg-card"
        />
        <p className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-widest text-accent mb-3">
          <IconTerminal size={14} /> // 404 - NODE NOT FOUND
        </p>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-text-primary leading-none">
          Lost in the Network?
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed mt-3 font-mono">
          The page you were looking for has been scrubbed from the network.
          Let&apos;s get you back to base.
        </p>
      </div>

      <Link
        to="/"
        className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap mt-6"
      >
        Return to Base <IconArrowRight size={18} />
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
