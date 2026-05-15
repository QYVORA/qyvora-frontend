import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileText, ArrowRight, Mail } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { SITE_CONFIG } from '../content/siteConfig';
import api from '../../../core/services/api';
import BinaryStreamBackground from '../../../shared/components/BinaryStreamBackground';

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Loading skeleton ─────────────────────────────────────────────────────────

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

// ─── Section card ─────────────────────────────────────────────────────────────

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
    {/* Section number */}
    <div
      className="absolute top-4 right-5 font-mono text-4xl font-black leading-none select-none pointer-events-none"
      style={{ color: 'var(--color-accent-dim)' }}
      aria-hidden="true"
    >
      {String(index + 1).padStart(2, '0')}
    </div>

    {/* Top accent bar */}
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const TermsPage: React.FC = () => {
  const [terms, setTerms] = useState<TermsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchTerms = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<TermsData>('/public/terms');
        if (!cancelled) setTerms(res.data);
      } catch {
        if (!cancelled) setError('Failed to load Terms of Service. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTerms();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-bg">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="ascii-section relative min-h-[50svh] md:min-h-[45vh] w-full overflow-hidden scanlines">
        <BinaryStreamBackground />
        <div className="absolute inset-0 bg-bg z-0" />
        <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
        <div className="absolute inset-0 bg-radial-vignette opacity-60 z-10 hero-vignette" />

        <div className="relative z-20 min-h-[50svh] md:min-h-[45vh] max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center pt-10 pb-12 md:pt-14 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="ascii-kicker mb-3 block md:text-sm">
              // LEGAL
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5 max-w-3xl"
          >
            Terms of Service<br />
            <span className="text-accent">Know the Rules.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-text-secondary text-sm md:text-base max-w-lg mb-6"
          >
            By accessing or using HSOCIETY services you agree to these terms. Read them carefully
            before participating in any training, community, or professional engagement.
          </motion.p>

          {/* Meta dates */}
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
                  <span className="text-accent">Last updated:</span> {terms.lastUpdated}
                </span>
              )}
              {terms.jurisdiction && terms.jurisdiction !== '[Insert Jurisdiction]' && (
                <span>
                  <span className="text-accent">Jurisdiction:</span> {terms.jurisdiction}
                </span>
              )}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter mt-8 overflow-hidden whitespace-nowrap"
          >
            $ hsociety --module legal --doc terms-of-service<span className="animate-blink italic">_</span>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <section className="ascii-section py-16 md:py-24 relative overflow-hidden">
        <BinaryStreamBackground />
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">

          {/* Section header */}
          <ScrollReveal className="mb-12 md:mb-16">
            <span className="ascii-kicker mb-3 block">
              // TERMS &amp; CONDITIONS
            </span>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-none mt-1"
                style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border-strong)' }}>
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-2">
                  Full Terms of Service
                </h2>
                <p className="text-text-muted text-sm max-w-xl">
                  These terms govern your use of all HSOCIETY platforms, training programs, and
                  professional services. Questions? Reach out via our{' '}
                  <Link to="/contact" className="text-accent hover:underline">contact page</Link>.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Content states */}
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

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="ascii-section pb-16 md:pb-24 max-w-4xl mx-auto px-4 md:px-8">
        <BinaryStreamBackground />
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
              <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block font-mono">
                // QUESTIONS?
              </span>
              <h3 className="text-xl md:text-2xl font-black text-text-primary mb-3">
                Need clarification on any of these terms?
              </h3>
              <p className="text-text-muted text-sm mb-8 max-w-md mx-auto">
                Our operations desk is available for legal and compliance inquiries. Reach out
                directly and we'll respond within {SITE_CONFIG.contact.responseTime}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`mailto:${SITE_CONFIG.contact.opsEmail}`}
                  className="btn-primary text-sm !px-8 inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Email Us
                </a>
                <Link
                  to="/contact"
                  className="btn-secondary text-sm !px-8 inline-flex items-center gap-2"
                >
                  Contact Page <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};

export default TermsPage;
