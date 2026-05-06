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
    <section className="
      py-16 bg-bg relative has-bg-image
      md:h-full md:overflow-hidden md:py-0 md:flex md:items-center
    ">
      <img
        src="/assets/sections/backgrounds/corporate-security-bg.webp"
        alt=""
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.12] md:opacity-[0.15] pointer-events-none"
        loading="lazy"
        decoding="async"
      />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">

        {/* Header */}
        <ScrollReveal className="mb-6 md:mb-6">
          <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.35em] text-accent">
            Operations
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-text-primary">Security Services</h2>
              <p className="mt-1 text-sm text-text-muted max-w-xl">
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

        {/* Service cards — 1-col mobile, 2-col sm, 4-col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {MARKETING_SERVICES.map((serv, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: 0.94, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1], filter: { duration: 0.35 } }}
              className="h-full"
            >
              <div
                className="group flex flex-col overflow-hidden rounded-xl border-2 border-border bg-bg-card transition-colors duration-200 hover:border-accent/40 h-full"
                style={{ boxShadow: 'var(--card-shimmer)' }}
              >
                {/* Illustration strip */}
                <div className="relative flex items-center justify-center overflow-hidden bg-bg h-28 lg:h-36 flex-none">
                  <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at center, var(--color-accent-dim) 0%, transparent 70%)' }}
                  />
                  <img
                    src={serv.img}
                    alt=""
                    className="relative z-10 h-16 lg:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <div className="absolute top-2 right-2 z-20">
                    <span className="text-[7px] font-bold text-accent border border-accent/30 bg-bg/80 backdrop-blur-sm rounded px-1.5 py-0.5 uppercase tracking-wider font-mono">
                      {serv.category.split('//').pop()?.trim() || serv.category}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 z-20 font-mono text-xl font-black leading-none select-none pointer-events-none opacity-20">
                    0{idx + 1}
                  </div>
                  <div
                    aria-hidden
                    className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, var(--color-bg-card), transparent)' }}
                  />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-3 lg:p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent-dim">
                      <serv.icon className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <h3 className="text-xs lg:text-sm font-black leading-snug text-text-primary group-hover:text-accent transition-colors">
                      {serv.title}
                    </h3>
                  </div>

                  <p className="text-[10px] lg:text-xs text-text-muted mb-2 leading-relaxed line-clamp-2">{serv.tagline}</p>

                  <ul className="flex flex-col gap-1 mb-2 flex-1">
                    {serv.bullet.slice(0, 2).map((b, i) => (
                      <li key={i} className="text-[10px] lg:text-xs text-text-secondary flex items-start gap-1.5">
                        <span className="text-accent font-mono font-bold flex-none mt-0.5 text-[9px]">›</span>
                        <span className="line-clamp-1">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex gap-1.5">
                    <a
                      href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                      className="btn-primary !py-1.5 !px-2 text-[10px] flex items-center justify-center gap-1 flex-1"
                    >
                      <Mail className="w-2.5 h-2.5" /> Contact
                    </a>
                    <Link
                      to="/services"
                      className="btn-secondary !py-1.5 !px-2 text-[10px] flex items-center justify-center gap-1 flex-1"
                    >
                      More <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA strip — compact */}
        <ScrollReveal>
          <div
            className="relative rounded-xl border border-border overflow-hidden px-5 py-4 md:py-3 text-center"
            style={{ background: 'var(--color-accent-dim)' }}
          >
            <div aria-hidden className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
            />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <h3 className="text-sm font-black text-text-primary">Not sure which service fits?</h3>
                <p className="text-text-muted text-xs">Our security desk can map our capabilities to your threat model.</p>
              </div>
              <div className="flex items-center gap-2 flex-none">
                <a
                  href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                  className="btn-primary text-xs !py-2 !px-4 inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Talk to Us
                </a>
                <Link
                  to="/services"
                  className="text-xs font-black text-accent hover:underline uppercase tracking-widest inline-flex items-center gap-1"
                >
                  All services <ArrowRight className="w-3 h-3" />
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
