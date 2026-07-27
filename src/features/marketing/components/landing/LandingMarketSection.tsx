import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, FileText, BookOpen, Cpu } from 'lucide-react';
import { IconArrowRight, IconMarketplace, IconLock } from '@/shared/components/icons';
import { Carousel } from '@/shared/components/carousel';
import { GridBoxedBackground } from '@/shared/components/backgrounds';
import StickySidebarLayout from '@/shared/components/layout/StickySidebarLayout';
import ScrollReveal from '@/shared/components/ScrollReveal';
import api from '@/core/services/api';
import productFallbackImg from '@/assets/sections/stats/cp-earned-bg.webp';
import { AuthImage } from '@/shared/components/ui';
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

  useEffect(() => {
    let mounted = true;
    api.get('/public/cp-products').then((r) => {
      if (!mounted) return;
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      setProducts(items.slice(0, 4));
    }).catch(() => {}).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return null;

  return (
    <div className="relative bg-bg min-h-dvh md:h-dvh flex flex-col overflow-hidden" data-nav-invert>
      <GridBoxedBackground opacity={0.4} blur={0} mask="right" />
      <div className="relative z-10 w-full h-full px-3 md:px-4 lg:px-6 py-10 sm:py-8 md:py-12 lg:py-16 flex flex-col lg:flex-row gap-10 sm:gap-10 lg:gap-16 lg:items-stretch">
        {/* Header column */}
        <div className="shrink-0 lg:w-[420px] xl:w-[480px] flex flex-col lg:justify-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-none mb-2">
            {t('landing.market.title')} <span className="text-text-secondary">{t('landing.market.titleAccent')}</span>
          </h2>
          <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-xl mb-4">
            {t('landing.market.description')}
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            {FEATURES.map((f) => (
              <div key={f.tKey} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-bg/20 bg-bg/10">
                <f.icon className="h-4 w-4 text-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{t(`landing.market.${f.tKey}`)}</span>
              </div>
            ))}
          </div>
          <Link
            to="/zero-day-market"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-border/30 bg-bg-elevated text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-bg-card transition-colors"
          >
            <IconMarketplace className="h-4 w-4" /> {t('landing.market.accessMarket')} <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Products column */}
        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden flex items-center">
          {products.length > 0 ? (
            <Carousel
              slides={products.map((p, i) => ({ ...p, id: p.id || `prod-${i}` }))}
              renderCard={(prod) => (
                <div className="group overflow-hidden flex flex-col w-full border border-border/30 bg-bg-card rounded-2xl transition-all duration-300 hover:border-accent/30">
                  <div className="relative aspect-[16/9] overflow-hidden bg-accent/5">
                    <AuthImage
                      src={prod.coverUrl}
                      fallback={productFallbackImg}
                      alt={prod.title}
                      width={1200}
                      height={675}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-bg/85 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-accent tracking-widest shadow-sm border border-accent/20">
                        <IconMarketplace className="h-2.5 w-2.5" /> {t('landing.market.intelligenceAsset')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4 gap-2">
                    <h3 className="text-sm sm:text-base font-black leading-snug text-text-primary group-hover:text-accent transition-colors tracking-tight line-clamp-2">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-text-muted/70 line-clamp-2 leading-relaxed font-mono flex-1">
                      {prod.description || t('landing.market.defaultDesc')}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-xs font-black text-accent uppercase tracking-widest">{prod.cpPrice} CP</span>
                      <Link to="/zero-day-market" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                        {t('landing.market.viewAll')}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            />
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

export default LandingMarketSection;
