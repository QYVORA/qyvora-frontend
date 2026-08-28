import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { IconLock, IconMarketplace } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import api from '@/core/services/api';
import { Skeleton, ErrorState, BatchPagination } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import PublicSnapLayout from '@/shared/components/PublicSnapLayout';
import PublicSnapSection from '@/shared/components/PublicSnapSection';
import StudentHeroSection, { PUBLIC_HERO_TITLE_CLASS } from '@/shared/components/StudentHeroSection';
import { Footer } from '@/shared/components/layout';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { useAuth } from '@/core/contexts/AuthContext';
import { CardCollection, ViewToggle, type ViewMode } from '@/shared/components/card-collection';
import ProductCard, { type MarketProduct } from './cards/ProductCard';

const MarketPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [products, setProducts] = useState<MarketProduct[]>([]);
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

  const [page, setPage] = useState(0);
  const [view, setView] = useState<ViewMode>('grid');
  const BATCH_SIZE = 3;

  const handleQueryChange = (q: string) => {
    setQuery(q);
    setPage(0);
  };

  const filtered = products.filter(
    (p) => !query || p.title?.toLowerCase().includes(query.toLowerCase()) || p.type?.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / BATCH_SIZE);
  const currentBatch = filtered.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Zero Day Market - QYVORA" description="Intelligence assets, guides, papers, and tools available for CP." />
      <PublicSnapLayout>
        <section className="relative w-full min-h-dvh snap-section bg-bg">
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
        </section>

        <PublicSnapSection>
          <div className="flex flex-col justify-between flex-1 min-h-0 space-y-4">
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-border/40 bg-bg-card py-2.5 pl-9 pr-3 text-xs text-text-primary transition-all focus:border-accent outline-none"
                />
              </div>
              <ViewToggle value={view} onChange={setView} label="Market view mode" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card-accent bg-bg-card overflow-hidden">
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
              <div className="col-span-full text-center py-20 rounded-2xl border-2 border-dashed border-border/20 flex-1 flex flex-col justify-center">
                <IconLock className="h-12 w-12 text-text-muted/20 mx-auto mb-4" />
                <p className="text-text-muted text-sm">{query ? 'No products match your search.' : 'No products available yet.'}</p>
              </div>
            ) : (
              <div className="flex flex-col justify-between flex-1 min-h-0">
                <CardCollection
                  view={view}
                  items={currentBatch}
                  keyOf={(prod, idx) => prod.id || idx}
                  gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1 items-stretch"
                  renderItem={(prod) => (
                    <ScrollReveal amount={0.05} className="h-full">
                      <ProductCard product={prod} isLoggedIn={!!user} view={view} />
                    </ScrollReveal>
                  )}
                />
                <BatchPagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </div>
        </PublicSnapSection>
        <section className="relative w-full min-h-dvh snap-section bg-bg-alt">
          <LandingFinalCtaSection user={user} />
        </section>

        <section className="w-full bg-bg pt-10 md:pt-0 snap-section">
          <Footer />
        </section>
      </PublicSnapLayout>
    </div>
  );
};

export default MarketPage;
