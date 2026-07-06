import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Shield, ShoppingBag, Cloud, Lock, FileText, BookOpen, Cpu } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { Carousel } from '@/shared/components/carousel';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SimpleHeading from '@/shared/components/ui/SimpleHeading';
import api from '@/core/services/api';
import productFallbackImg from '@/assets/sections/stats/cp-earned-bg.webp';
import { resolveImg } from '@/shared/utils/resolveImg';
import { useAdaptiveUi } from '@/core/hooks/useAdaptiveUi';
import ErrorBoundary from '@/shared/components/ErrorBoundary';

const HackerGlobe = lazy(() => import('@/features/marketing/components/HackerGlobe'));

interface ProductItem {
  id: string;
  title: string;
  description: string;
  cpPrice: number;
  coverUrl: string;
  type: string;
}

const FEATURES: { icon: React.ElementType; label: string; desc: string }[] = [
  { icon: FileText, label: 'Exploitation Guides', desc: 'Operational procedures for weaponizing CVEs, writing custom payloads, and chaining exploits in real-world environments.' },
  { icon: BookOpen, label: 'Research Papers', desc: 'Whitepapers covering novel attack vectors, cryptographic weaknesses, protocol analysis, and hardware reverse engineering.' },
  { icon: Cpu, label: 'Tooling & Payloads', desc: 'Privately developed implants, enumeration scripts, and post-exploitation modules with source code.' },
];

const ZeroDayMarketPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice, isMobile, isLg } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice || isMobile;

  useEffect(() => {
    let mounted = true;
    api.get('/public/cp-products').then((r) => {
      if (!mounted) return;
      const items = Array.isArray(r.data?.items) ? r.data.items : [];
      setProducts(items.slice(0, 4));
    }).catch(() => {}).finally(() => {
      if (mounted) setLoadingProducts(false);
    });
    return () => { mounted = false; };
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-bg">
      <SEO
        title="Zero-Day Intelligence Market"
        description="Classified digital exchange for offensive security assets. Access exploitation guides, red-team tooling, and threat intelligence reports."
      />

      {/* ── HERO ── */}
      <section id="zd-hero" className="relative w-full min-h-screen overflow-hidden">
        <div className="relative z-30 w-full min-h-screen mx-auto grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="flex flex-col items-start justify-center px-6 sm:px-10 md:px-12 lg:pl-16 xl:pl-20 lg:pr-8 xl:pr-12 pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 lg:pb-16 w-full h-full">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5 sm:space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 border border-accent/35 bg-accent/10 rounded-lg max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-none" />
                <span className="font-mono text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-[0.12em] min-[380px]:tracking-[0.14em] sm:tracking-[0.3em] text-accent whitespace-normal">
                  <Shield className="h-3 w-3 inline-block -mt-0.5 mr-1.5" /> Intelligence Exchange
                </span>
              </div>

              <h1 className="font-black text-text-primary leading-[1.08] tracking-tight w-full">
                <span className="block text-[2.5rem] min-[400px]:text-[3rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.25rem] xl:text-[3.75rem] lg:leading-[1.1] xl:leading-[1.05] uppercase">
                  Zero-Day
                </span>
                <span className="block text-[2.5rem] min-[400px]:text-[3rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.25rem] xl:text-[3.75rem] lg:leading-[1.1] xl:leading-[1.05] uppercase text-accent">
                  Market
                </span>
              </h1>

              <p className="text-text-secondary text-base sm:text-lg lg:text-base xl:text-lg leading-relaxed max-w-xl animate-fade-in font-mono">
                A classified digital exchange where offensive security operators access high-value research assets. Each asset is a curated intelligence package — from exploitation guides and red-team tooling to vulnerability disclosures and network datasets.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2.5 !px-8 sm:!px-10 !py-3 sm:!py-4 whitespace-nowrap">
                  <ShoppingBag className="h-4 w-4" /> Access the Market
                </Link>
                <button onClick={() => scrollToSection('zd-products')} className="btn-secondary !px-8 sm:!px-10 !py-3 sm:!py-4 text-center whitespace-nowrap">
                  Browse Assets
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex items-center justify-center w-full h-full pt-20 xl:pt-24"
          >
            <div className="relative z-10 w-full h-full max-w-[80%] 2xl:max-w-[75%] flex items-center justify-center">
              <ErrorBoundary scope="HackerGlobe" fallback={null}>
                <Suspense fallback={null}>
                  {isLg && <HackerGlobe scale={1.0} />}
                </Suspense>
              </ErrorBoundary>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="zd-features" className="relative w-full min-h-screen flex items-center border-t border-border/20">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 sm:py-28 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <ScrollReveal direction="up">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[10px] font-black uppercase tracking-[0.25em] text-accent mb-2">
                  <Cloud className="h-3 w-3" /> Asset Categories
                </span>
                <SimpleHeading
                  text="The Operator's Intelligence Supply Chain"
                  align="left"
                  className="mb-4"
                />
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.1}>
                <p className="text-sm sm:text-base text-text-secondary font-mono leading-relaxed">
                  The Zero-Day Intelligence Market is a classified digital exchange where offensive security operators, penetration testers, and cyber intelligence analysts access high-value research assets. Assets are acquired using CP (Cyber Points), earned through bootcamp completion, challenge solving, and platform contributions.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.15}>
                <Link to="/dashboard/marketplace" className="text-[10px] font-black uppercase tracking-widest text-accent inline-flex items-center gap-2 hover:gap-3 transition-all">
                  Browse the Vault →
                </Link>
              </ScrollReveal>
            </div>

            <div className="space-y-4">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f.label} direction="up" delay={0.1 + i * 0.08}>
                  <div className="group flex items-start gap-5 p-5 sm:p-6 rounded-2xl border border-border/30 bg-bg-card/50 transition-all hover:border-accent/20 hover:bg-accent-dim/5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-dim">
                      <f.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-text-primary mb-1 group-hover:text-accent transition-colors">{f.label}</h3>
                      <p className="text-xs text-text-muted leading-relaxed font-mono">{f.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="zd-products" className="relative w-full min-h-screen flex items-center border-t border-border/20">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 sm:py-28 lg:py-24">
          <ScrollReveal direction="up" className="mb-10 lg:mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[10px] font-black uppercase tracking-[0.25em] text-accent mb-3">
              <Lock className="h-3 w-3" /> Featured Assets
            </span>
            <SimpleHeading text="Recently Published" align="left" className="mb-0" />
          </ScrollReveal>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-2xl border border-border/30 bg-bg-card/50 animate-pulse overflow-hidden">
                  <div className="aspect-video bg-bg-elevated" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-bg-elevated rounded w-3/4" />
                    <div className="h-3 bg-bg-elevated rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="hidden md:grid md:grid-cols-2 gap-6 md:gap-8">
                {products.map((prod, idx) => (
                  <ScrollReveal key={prod.id || idx} direction="up" delay={idx * 0.08}>
                    <div className="group overflow-hidden flex flex-col w-full border border-border/40 bg-bg-card rounded-2xl transition-all duration-300 hover:border-accent/30 hover:scale-[1.01]">
                      <div className="relative aspect-video overflow-hidden rounded-t-2xl shadow-sm">
                        <img src={resolveImg(prod.coverUrl, productFallbackImg)} alt={prod.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-bg/85 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-text-primary tracking-widest shadow-sm">
                            <ShoppingBag className="h-3 w-3 text-accent" /> Intelligence Asset
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <h3 className="mb-2 text-lg font-black leading-snug text-text-primary group-hover:text-accent transition-colors tracking-tight line-clamp-1">
                          {prod.title}
                        </h3>
                        <p className="text-xs text-text-muted/70 mb-6 line-clamp-2 leading-relaxed font-mono">
                          {prod.description || 'Secure intelligence report for offensive security operatives.'}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-accent uppercase tracking-widest">{prod.cpPrice} CP</span>
                          </div>
                          <Link to="/dashboard/marketplace" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                            View All
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <div className="md:hidden">
                <Carousel
                  slides={products.map((p, i) => ({ ...p, id: p.id || `prod-${i}` }))}
                  autoPlayInterval={5000}
                  renderCard={(prod) => (
                    <div className="group overflow-hidden flex flex-col w-full border border-border/40 bg-bg-card rounded-2xl transition-all duration-300">
                      <div className="relative aspect-video overflow-hidden rounded-t-2xl shadow-sm">
                        <img src={resolveImg(prod.coverUrl, productFallbackImg)} alt={prod.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute bottom-4 left-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-bg/85 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-text-primary tracking-widest shadow-sm">
                            <ShoppingBag className="h-3 w-3 text-accent" /> Intelligence Asset
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-2 text-lg font-black leading-snug text-text-primary line-clamp-1 tracking-tight">
                          {prod.title}
                        </h3>
                        <p className="text-xs text-text-muted/70 mb-6 line-clamp-2 leading-relaxed font-mono">
                          {prod.description || 'Secure intelligence report for offensive security operatives.'}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm font-black text-accent uppercase tracking-widest">{prod.cpPrice} CP</span>
                          <Link to="/dashboard/marketplace" className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">
                            View All
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-16 space-y-4 border-2 border-dashed border-border/20 rounded-3xl">
              <BookOpen className="h-12 w-12 text-text-muted/20 mx-auto" />
              <p className="text-text-muted/60 text-sm font-mono">No assets currently published. Check back soon.</p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/dashboard/marketplace" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> Explore Full Vault
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative w-full min-h-screen flex items-center border-t border-border/20">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-20 sm:py-28 lg:py-24 text-center">
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[10px] font-black uppercase tracking-[0.25em] text-accent mb-4">
              <Lock className="h-3 w-3" /> Classified Access
            </div>

            <SimpleHeading
              text="Ready to Access the Intelligence Vault?"
              align="center"
              className="mb-4"
            />

            <p className="text-sm sm:text-base text-text-muted font-mono max-w-xl mx-auto mb-8">
              Create an account, complete the Hacker Protocol Bootcamp, and earn CP to unlock premium intelligence assets.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Get Started
              </Link>
              <Link to="/hpb" className="btn-secondary inline-flex items-center gap-2">
                Learn About Bootcamps →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default ZeroDayMarketPage;
