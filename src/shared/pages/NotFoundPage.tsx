import { Link } from 'react-router-dom';
import { IconTerminal } from '@/shared/components/icons';
import SEO from '../components/SEO';
import PublicHeroSection from '@/shared/components/PublicHeroSection';

const NotFoundPage = () => (
  <div className="min-h-screen bg-bg">
    <SEO
      title="404 - Node Not Found"
      description="The requested page could not be located on the QYVORA network."
    />
    <PublicHeroSection mask="none" showGlobe={false}>
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-bg/50 mb-2">
        <IconTerminal size={16} className="text-bg/80" />
        <span className="font-mono">// 404 — NODE NOT FOUND</span>
      </div>
      <h1 className="font-black text-bg leading-[1.08] tracking-tight w-full relative">
        <span className="block text-[2rem] min-[400px]:text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] uppercase">
          Lost in the Network ?
        </span>
      </h1>
      <p className="text-bg/70 text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl font-mono">
        How did you End Up here? I am suspecting you! ^_^
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
          Return to Base
        </Link>
      </div>
    </PublicHeroSection>
  </div>
);

export default NotFoundPage;
