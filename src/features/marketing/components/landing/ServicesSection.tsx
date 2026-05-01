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
    <section className="py-16 md:py-24 bg-bg relative overflow-hidden">
      <img
        src="/assets/sections/backgrounds/offsec-grid-background.png"
        alt=""
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.16] md:opacity-[0.2] pointer-events-none"
      />
      <div className="section-bg-overlay absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <ScrollReveal className="mb-10 md:mb-14">
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// OPERATIONS</span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-2">Security Services</h2>
              <p className="text-text-muted text-sm max-w-xl">
                Offensive-grade expertise for organisations that take security seriously.
              </p>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-2 flex-none group"
            >
              All Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8">
          {MARKETING_SERVICES.map((serv, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="group relative rounded-2xl border border-border bg-bg-card overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-accent/30"
                style={{ boxShadow: 'var(--card-shimmer)' }}
              >
                {/* Image panel */}
                <div className="relative h-48 md:h-52 overflow-hidden flex-none">
                  <img
                    src={serv.img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div aria-hidden className="scanlines absolute inset-0 pointer-events-none" />
                  <div
                    aria-hidden
                    className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, var(--color-bg-card), transparent)' }}
                  />
                  <div
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, var(--color-accent), transparent)' }}
                  />
                  {/* Index */}
                  <div
                    className="absolute top-3 left-3 font-mono text-3xl font-black leading-none select-none pointer-events-none"
                    style={{ color: 'var(--color-accent-dim)' }}
                  >
                    0{idx + 1}
                  </div>
                  {/* Category */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[9px] font-bold text-accent border border-accent/30 bg-bg/80 backdrop-blur-sm rounded px-2 py-0.5 uppercase tracking-wider font-mono">
                      {serv.category}
                    </span>
                  </div>
                  {/* Icon */}
                  <div
                    className="absolute bottom-3 left-3 w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border-strong)' }}
                  >
                    <serv.icon className="w-4 h-4 text-accent" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <h3 className="text-base md:text-lg font-black text-text-primary mb-2 group-hover:text-accent transition-colors font-mono uppercase tracking-tight">
                    {serv.title}
                  </h3>
                  <p className="text-sm text-text-muted mb-5 font-mono">{serv.tagline}</p>

                  <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                    {serv.bullet.slice(0, 2).map((b, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2.5">
                        <span className="text-accent font-mono font-bold flex-none mt-0.5 text-[11px]">{'>'}</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-3 mt-auto">
                    <a
                      href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                      className="btn-primary !py-2.5 !px-4 text-xs flex items-center justify-center gap-1.5 flex-1"
                    >
                      <Mail className="w-3.5 h-3.5" /> Talk to Us
                    </a>
                    <Link
                      to="/services"
                      className="btn-secondary !py-2.5 !px-4 text-xs flex items-center justify-center gap-1.5 flex-1"
                    >
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                  style={{ boxShadow: '0 0 40px var(--color-accent-glow)' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <ScrollReveal>
          <div
            className="relative rounded-xl border border-border overflow-hidden p-6 md:p-8 text-center"
            style={{ background: 'var(--color-accent-dim)' }}
          >
            <div aria-hidden className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
            />
            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-bold text-text-primary mb-2">Not sure which service fits?</h3>
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
                  className="text-xs font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-1.5"
                >
                  View All Services <ArrowRight className="w-3.5 h-3.5" />
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
