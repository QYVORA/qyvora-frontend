import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, ArrowRight, Mail } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { SITE_CONFIG } from '../content/siteConfig';
import api from '../../../core/services/api';
import HeroBackground from '../components/HeroBackground';
import AsciiHeading from '../../../shared/components/ui/AsciiHeading';
import { ContactTrigger } from '../components/ContactModal';

interface TermsSection {
  title: string;
  body: string;
  bullets: string[];
}

interface TermsData {
  effectiveDate: string;
  lastUpdated: string;
  jurisdiction: string;
  sections: TermsSection[];
}

const TermsSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-8">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="h-5 bg-border rounded w-1/3" />
        <div className="h-3 bg-border/60 rounded w-full" />
        <div className="h-3 bg-border/60 rounded w-5/6" />
        <div className="h-3 bg-border/60 rounded w-4/6" />
      </div>
    ))}
  </div>
);

const TermsSectionCard: React.FC<{ section: TermsSection; index: number }> = ({
  section,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    className="terminal-card relative rounded-xl border border-border bg-bg-card overflow-hidden p-6 md:p-8"
    style={{ boxShadow: 'var(--card-shimmer)' }}
  >
    <div
      className="absolute top-4 right-5 font-mono text-4xl font-black leading-none select-none pointer-events-none"
      style={{ color: 'var(--color-accent-dim)' }}
      aria-hidden="true"
    >
      {String(index + 1).padStart(2, '0')}
    </div>
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
      style={{ background: 'linear-gradient(90deg, var(--color-accent), transparent)' }}
    />
    <h2 className="text-base md:text-lg font-black text-text-primary mb-3 font-mono uppercase tracking-tight pr-12">
      {section.title}
    </h2>
    {section.body ? (
      <p className="text-sm text-text-secondary leading-relaxed mb-4">{section.body}</p>
    ) : null}
    {section.bullets.length > 0 && (
      <ul className="flex flex-col gap-2">
        {section.bullets.map((bullet, i) => (
          <li key={i} className="text-sm text-text-secondary flex items-start gap-3">
            <span className="text-accent font-mono font-bold flex-none mt-0.5 text-xs">{'>'}</span>
            {bullet}
          </li>
        ))}
      </ul>
    )}
  </motion.div>
);

const TermsPage: React.FC = () => {
  const [terms, setTerms] = useState<TermsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/public/terms')
      .then((res) => {
        if (cancelled) return;
        setTerms(res.data);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Failed to load terms of service. Please try again later.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-bg">

      {/* ── HERO ── */}
      <section className="ascii-section relative min-h-[50svh] md:min-h-[45vh] w-full overflow-hidden scanlines">
        <HeroBackground />
        <div className="absolute inset-0 bg-bg z-0 opacity-40" />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-60 z-10 hero-vignette" />

        <div className="relative z-20 min-h-[50svh] md:min-h-[45vh] max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center pt-10 pb-12 md:pt-14 md:pb-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
             <AsciiHeading text="Terms of Service" font="Standard" animated className="mb-6" />
           </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-text-secondary text-sm md:text-base max-w-lg mb-6"
          >
            By accessing or using HSOCIETY services you agree to these terms. Read them carefully
            before participating in any training, community, or professional engagement.
          </motion.p>

          {terms && (terms.effectiveDate || terms.lastUpdated) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap gap-4 text-[11px] font-mono text-text-muted"
            >
              {terms.effectiveDate && terms.effectiveDate !== '[Insert Date]' && (
                <span>
                  <span className="text-accent">Effective:</span> {terms.effectiveDate}
                </span>
              )}
              {terms.lastUpdated && terms.lastUpdated !== '[Insert Date]' && (
                <span>
                  <span className="text-accent">Last Updated:</span> {terms.lastUpdated}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="ascii-section py-16 md:py-24 relative overflow-hidden">
        <HeroBackground className="opacity-40" />
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">

           <ScrollReveal className="mb-12 md:mb-16">
             <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-none mt-1"
                 style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border-strong)' }}>
                 <FileText className="w-5 h-5 text-accent" />
               </div>
               <div>
                 <AsciiHeading text="Full Terms" font="Standard" animated glow="normal" className="mb-4" />
                 <p className="text-text-muted text-sm max-w-xl">
                   These terms govern your use of all HSOCIETY platforms, training programs, and
                   professional services. Questions? Reach out via our{' '}
                   <ContactTrigger type="link" className="text-accent hover:underline">contact modal</ContactTrigger>.
                 </p>
               </div>
             </div>
           </ScrollReveal>

          {loading && <TermsSkeleton />}

          {error && !loading && (
            <div className="terminal-card rounded-xl border border-border bg-bg-card p-8 text-center">
              <p className="text-text-muted text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary text-xs !px-6"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && terms && terms.sections.length === 0 && (
            <div className="terminal-card rounded-xl border border-border bg-bg-card p-8 text-center">
              <p className="text-text-muted text-sm">
                Terms of Service are being updated. Check back soon.
              </p>
            </div>
          )}

          {!loading && !error && terms && terms.sections.length > 0 && (
            <div className="flex flex-col gap-5 md:gap-6">
              {terms.sections.map((section, idx) => (
                <TermsSectionCard key={idx} section={section} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="ascii-section pb-16 md:pb-24 max-w-4xl mx-auto px-4 md:px-8 relative">
        <HeroBackground className="opacity-40" />
        <ScrollReveal>
          <div
            className="terminal-card relative rounded-xl border border-border overflow-hidden p-8 md:p-12 text-center"
            style={{ background: 'var(--color-accent-dim)' }}
          >
            <div aria-hidden className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
            />
            <div className="relative z-10">
               <AsciiHeading text="Questions?" font="Standard" compact animated glow="normal" className="mb-4" />
               <p className="text-text-muted text-sm mb-8 max-w-md mx-auto">
                 Our operations desk is available for legal and compliance inquiries. Reach out
                 directly and we'll respond within {SITE_CONFIG.contact.responseTime}.
               </p>
               <a href={`mailto:${SITE_CONFIG.contact.opsEmail}`} className="btn-primary !px-8 py-3 inline-flex items-center gap-2">
                 <Mail className="w-4 h-4" /> {SITE_CONFIG.contact.opsEmail}
               </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FOOTER ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/40 pt-12">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-text-muted hover:text-accent text-[10px] font-bold uppercase tracking-widest transition-colors">Home</Link>
            <ContactTrigger type="link" className="text-text-muted hover:text-accent text-[10px] font-bold uppercase tracking-widest transition-colors">Contact</ContactTrigger>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded border border-border flex items-center justify-center grayscale opacity-40">
               <span className="font-mono text-[10px] font-bold">18+</span>
             </div>
             <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
               © {new_Date().getFullYear()} HSOCIETY OFFSEC
             </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TermsPage;

function new_Date() { return new Date(); }
