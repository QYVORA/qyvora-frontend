import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShoppingBag } from 'lucide-react';
import { IconLock, IconMarketplace } from '@/shared/components/icons';
import { ScrollReveal } from '@/shared/components';
import api from '@/core/services/api';
import { Skeleton, ErrorState, BatchPagination } from '@/shared/components/ui';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import EmptyState from '@/shared/components/ui/EmptyState';
import { useAuth } from '@/core/contexts/AuthContext';
import { CardCollection, ViewToggle, type ViewMode } from '@/shared/components/card-collection';
import ProductCard, { type MarketProduct } from './cards/ProductCard';

const MarketPage = () => {
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
    <div className="min-h-full w-full bg-canvas">
      <SEO title="Zero Day Market - QYVORA" description="Intelligence assets, guides, papers, and tools available for CP." />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Market"}
          title="Zero Day Market"
          description="Intelligence assets, research papers, guides, and offensive security tools. Available for CP."
          actions={
            !user ? (
              <Button to="/register">
                Join to Purchase <IconMarketplace className="h-4 w-4" />
              </Button>
            ) : (
              <Button to="/dashboard/marketplace">
                <ShoppingBag className="h-4 w-4" /> {"Open the CP marketplace"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )
          }
        />

        <div className="mt-10 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full rounded-xl border border-border-subtle bg-surface py-3 pl-10 pr-3 text-sm text-text-primary transition-colors outline-none focus:border-accent"
              />
            </div>
            <ViewToggle value={view} onChange={setView} label="Market view mode" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-accent overflow-hidden bg-surface">
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
            <EmptyState
              icon={<IconLock className="h-6 w-6" />}
              title={query ? 'No products match your search.' : 'No products available yet.'}
            />
          ) : (
            <div className="flex flex-col justify-between gap-6">
              <CardCollection
                view={view}
                items={currentBatch}
                keyOf={(prod, idx) => prod.id || idx}
                gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-stretch"
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
      </PublicContainer>
    </div>
  );
};

export default MarketPage;