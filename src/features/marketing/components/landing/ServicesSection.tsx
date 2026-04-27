import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { MARKETING_SERVICES } from '../../content/services';
import { SITE_CONFIG } from '../../content/siteConfig';

const ServicesSection: React.FC = () => (
  <section className="py-16 md:py-24 bg-bg relative overflow-hidden">
    <img
      src="/images/section-backgrounds/offsec-grid-background.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-[0.16] md:opacity-[0.2] pointer-events-none"
    />
    <div className="absolute inset-0 bg-bg/40 pointer-events-none" />
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
            className="text-xs font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-2 flex-none"
          >
            All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8">
        {MARKETING_SERVICES.map((serv, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.08}>
            <div className="group relative rounded-xl border border-border bg-bg-card overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-accent/30"
              style={{ boxShadow: 'inset 0 1px 0 rgba(183,255,153,0.05)' }}>

              {/* Image panel */}
              <div className="relative h-44 md:h-48 overflow-hidden flex-none">
                <img
                  src={serv.img}
                  alt=""
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700"
                />
                <div aria-hidden className="scanlines absolute inset-0 pointer-events-none" />
                <div aria-hidden className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, var(--color-bg-card), transparent)' }} />
                <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, var(--color-accent), transparent)' }} />
                {/* Index */}
                <div className="absolute top-3 left-3 font-mono text-3xl font-black leading-none select-none pointer-events-none"
                  style={{ color: 'rgba(183,255,153,0.18)' }}>
                  0{idx + 1}
                </div>
                {/* Category */}
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] font-bold text-accent border border-accent/30 bg-bg/80 backdrop-blur-sm rounded px-2 py-0.5 uppercase tracking-wider font-mono">
                    {serv.category}
                  </span>
                </div>
                {/* Icon */}
                <div className="absolute bottom-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--color-accent-dim)', border: '1px solid rgba(183,255,153,0.25)' }}>
                  <serv.icon className="w-4 h-4 text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-black text-text-primary mb-1 group-hover:text-accent transition-colors font-mono uppercase tracking-tight">
                  {serv.title}
                </h3>
                <p className="text-xs text-text-muted mb-4 font-mono">{serv.tagline}</p>

                <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                  {serv.bullet.slice(0, 2).map((b, i) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                      <span className="text-accent font-mono font-bold flex-none mt-0.5 text-[10px]">{'>'}</span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 mt-auto pt-2 border-t border-border">
                  <a
                    href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                    className="btn-primary !py-2 !px-3 text-xs flex items-center justify-center gap-1.5 flex-1"
                  >
                    <Mail className="w-3.5 h-3.5" /> Talk to Us
                  </a>
                  <Link
                    to="/services"
                    className="btn-secondary !py-2 !px-3 text-xs flex items-center justify-center gap-1.5 flex-1"
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Hover glow */}
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                style={{ boxShadow: '0 0 40px var(--color-accent-glow)' }} />
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* CTA strip */}
      <ScrollReveal>
        <div className="relative rounded-xl border border-border overflow-hidden p-6 md:p-8 text-center"
          style={{ background: 'var(--color-accent-dim)' }}>
          <div aria-hidden className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
          <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }} />
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
              <Link to="/services" className="text-xs font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-1.5">
                View All Services <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ServicesSection;
