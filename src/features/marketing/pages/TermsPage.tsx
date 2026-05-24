import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { Mail, ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { SITE_CONFIG } from '../content/siteConfig';
import HeroBackground from '../components/HeroBackground';
import { ContactTrigger } from '../components/ContactModal';
import { termsData, TermsSection } from '../content/termsData';
import { useAdaptiveUi } from '../../../core/hooks/useAdaptiveUi';
import Footer from '../components/layout/Footer';
import AsciiHeading from '../../../shared/components/ui/AsciiHeading';

const SnapSection: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();
  const { constrainedDevice } = useAdaptiveUi();
  const minimizeEffects = shouldReduceMotion || constrainedDevice;
  return (
    <section
      id={id}
      className={`relative md:snap-start md:snap-always md:min-h-full md:flex-shrink-0 md:box-border bg-transparent ${className}`}
    >
      <motion.div
        initial={minimizeEffects ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.1 }}
        transition={minimizeEffects ? { duration: 0.2 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
};

const TermsSectionCard: React.FC<{ section: TermsSection; index: number }> = ({
  section,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    className="terminal-card relative rounded-2xl border border-border bg-bg-card overflow-hidden p-6 md:p-8"
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
      className="absolute top-0 left-0 right-0 h-[1px] bg-accent/30 pointer-events-none"
    />
    <h3 className="text-base md:text-lg font-black text-text-primary mb-3 font-mono uppercase tracking-tight pr-12">
      {section.title}
    </h3>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 60]);
  const { constrainedDevice } = useAdaptiveUi();
  const shouldReduceMotion = useReducedMotion();
  const minimizeEffects = shouldReduceMotion || constrainedDevice;

  return (
    <div className="relative h-[100svh] w-full bg-bg overflow-hidden">
      {/* ── Global Background ── */}
      <HeroBackground className="opacity-70" />

      <div
        ref={containerRef}
        className="landing-snap relative z-10 h-[100svh] w-full overflow-y-scroll overflow-x-hidden bg-transparent md:snap-y md:snap-mandatory"
      >
        {/* ── HERO SECTION ── */}
        <section className="md:snap-start md:snap-always md:h-full md:flex-shrink-0 md:box-border relative bg-transparent overflow-hidden">
          <motion.div 
            style={{ y: minimizeEffects ? 0 : heroY, opacity: heroOpacity }}
            className="relative z-20 h-full max-w-7xl mx-auto px-4 md:px-10 flex flex-col justify-center pt-32 pb-12"
          >
            <div className="max-w-3xl">
              <ScrollReveal>
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-4 lg:mb-3">
                  <div className="h-[1px] w-8 bg-accent/40" />
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">
                    Legal Documentation
                  </span>
                </div>
                <AsciiHeading text="TERMS" font="ANSI Shadow" align="left" animated className="mb-8" />
              </ScrollReveal>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-text-secondary text-sm sm:text-base md:text-lg max-w-lg mb-8 leading-relaxed opacity-80"
              >
                By accessing or using HSOCIETY services you agree to these terms. Read them carefully
                before participating in any training, community, or professional engagement.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-6 text-[11px] font-mono text-text-muted uppercase tracking-[0.2em]"
              >
                {termsData.effectiveDate && (
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    <span>Effective: {termsData.effectiveDate}</span>
                  </div>
                )}
                {termsData.lastUpdated && (
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    <span>Updated: {termsData.lastUpdated}</span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── CONTENT SECTION ── */}
        <SnapSection id="terms-content">
          <div className="min-h-full flex flex-col items-center justify-start md:justify-center py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-10 w-full">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left side: Heading */}
                <div className="lg:w-1/3 shrink-0">
                   <ScrollReveal>
                     <div className="flex items-center gap-3 mb-4 lg:mb-3">
                        <div className="h-[1px] w-8 bg-accent/40" />
                        <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">Legal Framework</span>
                     </div>
                     <AsciiHeading text="Protocols" font="ANSI Shadow" align="left" compact animated className="mb-6" />
                     <p className="text-text-secondary text-sm leading-relaxed max-w-sm mt-4">
                       These terms govern your use of all HSOCIETY platforms, training programs, and
                       professional services. Questions? Reach out via our{' '}
                       <ContactTrigger type="link" className="text-accent hover:underline">contact modal</ContactTrigger>.
                     </p>
                   </ScrollReveal>
                </div>

                {/* Right side: Terms Grid */}
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {termsData.sections.map((section, idx) => (
                      <TermsSectionCard key={idx} section={section} index={idx} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SnapSection>

        {/* ── CTA SECTION ── */}
        <SnapSection id="terms-cta">
          <div className="min-h-full flex flex-col justify-center py-20 md:py-24">
            <div className="max-w-5xl mx-auto px-4 md:px-10 w-full">
              <ScrollReveal>
                <div
                  className="terminal-card relative rounded-3xl border border-border bg-bg-card overflow-hidden p-8 md:p-16 text-center"
                >
                  <div aria-hidden className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
                  <div
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-[1px] bg-accent/30 pointer-events-none"
                  />
                  
                  <div className="relative z-10 max-w-2xl mx-auto">
                     <div className="flex flex-col items-center justify-center mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-[1px] w-8 bg-accent/40" />
                          <span className="text-[10px] font-black text-accent uppercase tracking-[0.35em]">Legal Support</span>
                        </div>
                        <AsciiHeading text="Questions?" font="ANSI Shadow" compact animated />
                     </div>
                     <p className="text-text-muted text-sm md:text-base mb-10 leading-relaxed max-w-md mx-auto">
                       Our operations desk is available for legal and compliance inquiries. Reach out
                       directly and we'll respond within {SITE_CONFIG.contact.responseTime}.
                     </p>
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                       <a href={`mailto:${SITE_CONFIG.contact.opsEmail}`} className="btn-primary !px-10 py-4 inline-flex items-center gap-3 text-sm font-bold w-full sm:w-auto">
                         <Mail className="w-4 h-4" /> {SITE_CONFIG.contact.opsEmail}
                       </a>
                       <Link to="/" className="btn-secondary !px-10 py-4 inline-flex items-center gap-3 text-sm font-bold w-full sm:w-auto">
                         Return Home <ArrowRight className="w-4 h-4" />
                       </Link>
                     </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </SnapSection>

        {/* ── FOOTER SECTION ── */}
        <section id="footer" className="md:snap-start md:snap-always md:min-h-full md:flex md:flex-shrink-0 bg-transparent overflow-hidden">
          <Footer />
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
