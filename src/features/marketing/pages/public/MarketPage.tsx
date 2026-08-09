import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, Cpu, FileText, Search } from 'lucide-react';
import { IconMarketplace, IconLock } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import api from '@/core/services/api';
import { AuthImage, Skeleton, ErrorState, DottedMapOverlay } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import CpLogo from '@/shared/components/CpLogo';
import { useAuth } from '@/core/contexts/AuthContext';

interface ProductItem {
  id: string;
  title: string;
  description: string;
  cpPrice: number;
  coverUrl: string;
  type: string;
}

const MarketPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    api.get('/public/cp-products').then((r) => {
      if (!mounted) return;
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      setProducts(items);
    }).catch(() => {
      if (mounted) setError('Failed to load marketplace products.');
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filtered = products.filter(
    (p) => !query || p.title?.toLowerCase().includes(query.toLowerCase()) || p.type?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Zero Day Market - QYVORA" description="Intelligence assets, guides, papers, and tools available for CP." />
      <PublicSnapLayout>
        <StudentHeroSection
          title="Zero Day"
          accentWord="Market"
          titleClassName={PUBLIC_HERO_TITLE_CLASS}
          showGlobe
          typewrite
          description="Intelligence assets, research papers, guides, and offensive security tools. Available for CP."
        >
          {!user && (
            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2 px-6 py-2.5"
            >
              Join to Purchase <IconMarketplace className="h-4 w-4" />
            </Link>
          )}
        </StudentHeroSection>

        <PublicSnapSection>
          <div className="space-y-8">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-border/40 bg-bg-card py-3 pl-11 pr-4 text-sm text-text-primary transition-all focus:border-accent outline-none"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
                <Skeleton className="aspect-[16/9] w-full rounded-none" />
                <div className="flex flex-col gap-2.5 p-4">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-3 w-full rounded bg-border/20" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} title="Marketplace Unavailable" bare />
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-20 rounded-3xl border-2 border-dashed border-border/20">
            <IconLock className="h-12 w-12 text-text-muted/20 mx-auto mb-4" />
            <p className="text-text-muted text-sm">{query ? 'No products match your search.' : 'No products available yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((prod, idx) => (
              <ScrollReveal key={prod.id || idx} amount={0.05}>
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-bg-card transition-all duration-300 hover:border-accent/30 h-full">
                  <DottedMapOverlay />
                  <div className="relative aspect-[16/9] overflow-hidden bg-accent/5 border-b border-border/30">
                    <AuthImage
                      src={prod.coverUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-4 flex-1">
                    <span className="self-start px-2 py-0.5 rounded-lg bg-accent/10 text-[9px] font-black uppercase text-accent tracking-widest border border-accent/20 flex items-center gap-1">
                      <IconMarketplace className="h-2.5 w-2.5" /> Intelligence Asset
                    </span>
                    <h3 className="text-sm sm:text-base md:text-lg font-black leading-snug text-text-primary group-hover:text-accent transition-colors tracking-tight line-clamp-2">
                      {prod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3 flex-1">
                      {prod.description || 'Premium intelligence asset.'}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-1.5">
                        <CpLogo className="h-4 w-4" />
                        <span className="font-mono text-sm font-black text-text-primary">
                          {Number(prod.cpPrice || 0).toLocaleString()}
                        </span>
                      </div>
                      {user ? (
                        <Link
                          to="/dashboard/marketplace"
                          className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-accent text-on-accent transition-all hover:brightness-110"
                        >
                          View in Store
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-border/40 text-text-primary hover:border-accent/30 hover:text-accent transition-all"
                        >
                          Log In to Purchase
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          )}
          </div>
        </PublicSnapSection>
        <LandingFinalCtaSection user={user} />
        <Footer />
      </PublicSnapLayout>
    </div>
  );
};

export default MarketPage;
