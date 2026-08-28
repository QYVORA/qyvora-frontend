import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, FileText, BookOpen, Cpu } from 'lucide-react';
import { IconArrowRight, IconMarketplace, IconLock } from '@/shared/components/icons';
import ScrollReveal from '@/shared/components/ScrollReveal';
import api from '@/core/services/api';
import { AuthImage, Skeleton, ErrorState } from '@/shared/components/ui';
import { useTranslation } from 'react-i18next';

interface ProductItem {
  id: string;
  title: string;
  description: string;
  cpPrice: number;
  coverUrl: string;
  type: string;
}

const FEATURES: { icon: React.ElementType; tKey: string }[] = [
  { icon: FileText, tKey: 'featureGuides' },
  { icon: BookOpen, tKey: 'featurePapers' },
  { icon: Cpu, tKey: 'featureTools' },
];

const LandingMarketSection = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    api.get('/public/cp-products').then((r) => {
      if (!mounted) return;
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      if (items.length === 0) {
        setError('No products available.');
      } else {
        setProducts(items.slice(0, 4));
      }
    }).catch(() => {
      if (mounted) setError('Failed to load marketplace products.');
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="relative bg-bg min-h-dvh flex flex-col overflow-hidden snap-section" data-nav-invert>
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 py-10 sm:py-8 md:py-12 lg:py-12 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-20 lg:items-stretch">
        {/* Header column */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-10">
            {t('landing.market.title')} <span className="text-accent">{t('landing.market.titleAccent')}</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-10">
            {t('landing.market.description')}
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            {FEATURES.map((f) => (
              <div key={f.tKey} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bg/20 bg-bg/10">
                <f.icon className="h-4 w-4 text-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{t(`landing.market.${f.tKey}`)}</span>
              </div>
            ))}
          </div>
          <Link
            to="/zero-day-market"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-border/50 bg-bg-elevated text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-bg-card transition-colors"
          >
            <IconMarketplace className="h-4 w-4" /> {t('landing.market.accessMarket')} <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Products column */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-center lg:pl-12 xl:pl-16 lg:justify-end">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-accent bg-bg-card overflow-hidden">
                  <Skeleton className="aspect-[16/9] w-full rounded-none" />
                  <div className="flex flex-col gap-2.5 p-4">
                    <Skeleton className="h-5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-full rounded bg-border/20" />
                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-4 w-16 rounded" />
                      <Skeleton className="h-4 w-16 rounded bg-border/20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} title="Marketplace Unavailable" bare className="w-full" />
          ) : products.length > 0 ? (
            <div className={`grid gap-4 md:gap-6 w-full ${products.length === 1 ? 'grid-cols-1 max-w-lg' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {products.map((prod) => (
                <div key={prod.id} className="group relative overflow-hidden flex flex-col card-accent bg-bg-card transition-all duration-300">
                  <div className="relative aspect-[16/9] overflow-hidden bg-accent/5">
                    <AuthImage
                      src={prod.coverUrl}
                      alt={prod.title}
                      width={1200}
                      height={675}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-3 gap-1.5">
                    <span className="self-start inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-accent/10 border border-accent/20 text-[9px] font-black uppercase text-accent tracking-widest">
                      <IconMarketplace className="h-2.5 w-2.5" /> {t('landing.market.intelligenceAsset')}
                    </span>
                    <h3 className="text-sm sm:text-base font-black leading-snug text-text-primary group-hover:text-accent transition-colors tracking-tight line-clamp-2">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-text-muted/70 line-clamp-1 leading-relaxed font-mono flex-1">
                      {prod.description || t('landing.market.defaultDesc')}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <span className="text-xs font-black text-accent uppercase tracking-widest">{prod.cpPrice} CP</span>
                      <Link to="/zero-day-market" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                        {t('landing.market.viewAll')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4 border-2 border-dashed border-bg/20 rounded-3xl w-full">
              <IconLock className="h-12 w-12 text-text-muted/20 mx-auto" />
              <p className="text-text-muted/40 text-sm font-mono">{t('landing.market.emptyState')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(LandingMarketSection);
