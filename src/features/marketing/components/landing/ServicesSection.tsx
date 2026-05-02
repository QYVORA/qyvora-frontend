import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { MARKETING_SERVICES } from '../../content/services';
import { SITE_CONFIG } from '../../content/siteConfig';

const ServicesSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24 bg-bg relative overflow-hidden has-bg-image">
      <img
        src="/assets/sections/backgrounds/corporate-security-bg.png"
        alt=""
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.12] md:opacity-[0.15] pointer-events-none"
      />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <ScrollReveal className="mb-10 md:mb-12">
          <span className="mb-3 block text-xs font-black uppercase tracking-[0.35em] text-accent md:text-sm">
            Operations
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-text-primary md:text-4xl">Security Services</h2>
              <p className="mt-2 text-sm text-text-muted max-w-xl">
                Offensive-grade expertise for organisations that take security seriously.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-accent hover:underline flex-none"
            >
              All services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Service cards — 4-column grid, compact horizontal layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 mb-8">
          {MARKETING_SERVICES.map((serv, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="group flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-bg-card transition-colors duration-200 hover:border-accent/40 h-full"
                style={{ boxShadow: 'var(--card-shimmer)' }}
              >
                {/* Compact illustration strip */}
                <div className="relative flex items-center justify-center overflow-hidden bg-bg h-36">
                  <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at center, var(--color-accent-dim) 0%, transparent 70%)' }}
                  />
                  <img
                    src={serv.img}
                    alt=""
                    className="relative z-10 h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  {/* Category badge */}
                  <div className="absolute top-2.5 right-2.5 z-20">
                    <span className="text-[8px] font-bold text-accent border border-accent/30 bg-bg/80 backdrop-blur-sm rounded px-1.5 py-0.5 uppercase tracking-wider font-mono">
                      {serv.category.split('//').pop()?.trim() || serv.category}
                    </span>
                  </div>
                  {/* Index */}
                  <div className="absolute top-2.5 left-3 z-20 font-mono text-2xl font-black leading-none select-none pointer-events-none opacity-20">
                    0{idx + 1}
                  </div>
                  {/* Bottom fade */}
                  <div
                    aria-hidden
                    className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, var(--color-bg-card), transparent)' }}
                  />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Icon + title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent-dim">
                      <serv.icon className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="text-sm font-black leading-snug text-text-primary group-hover:text-accent transition-colors">
                      {serv.title}
                    </h3>
                  </div>

                  <p className="text-xs text-text-muted mb-4 leading-relaxed">{serv.tagline}</p>

                  <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                    {serv.bullet.slice(0, 2).map((b, i) => (
                      <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="text-accent font-mono font-bold flex-none mt-0.5 text-[10px]">›</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex gap-2">
                    <a
                      href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                      className="btn-primary !py-2 !px-3 text-[11px] flex items-center justify-center gap-1 flex-1"
                    >
                      <Mail className="w-3 h-3" /> Contact
                    </a>
                    <Link
                      to="/services"
                      className="btn-secondary !py-2 !px-3 text-[11px] flex items-center justify-center gap-1 flex-1"
                    >
                      More <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <ScrollReveal>
          <div
            className="relative rounded-2xl border border-border overflow-hidden p-6 md:p-8 text-center"
            style={{ background: 'var(--color-accent-dim)' }}
          >
            <div aria-hidden className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
            />
            <div className="relative z-10">
              <h3 className="text-lg font-black text-text-primary mb-2 md:text-xl">Not sure which service fits?</h3>
              <p className="text-text-muted text-sm mb-5 max-w-lg mx-auto">
                Our security desk can map our capabilities to your threat model.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                  className="btn-primary text-sm inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Talk to Us
                </a>
                <Link
                  to="/services"
                  className="text-xs font-black text-accent hover:underline uppercase tracking-widest inline-flex items-center gap-1.5"
                >
                  View all services <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default ServicesSection;
