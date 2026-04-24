import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
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
    <div className="absolute inset-0 bg-bg/36 pointer-events-none" />
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

      {/* 2-col on md+, 1-col on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8">
        {MARKETING_SERVICES.map((serv, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.08}>
            <div className="card-hsociety overflow-hidden flex flex-col group h-full">
              {/* Image header */}
              <div className="relative h-44 md:h-48 overflow-hidden flex-none">
                <img
                  src={serv.img}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-black/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[9px] font-bold text-accent border border-accent/40 bg-bg/80 backdrop-blur-sm rounded px-2 py-0.5 uppercase tracking-wider">
                    {serv.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center backdrop-blur-sm">
                  <serv.icon className="w-4 h-4 text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6 flex flex-col flex-1">
                <h3 className="text-base md:text-lg font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">
                  {serv.title}
                </h3>
                <p className="text-xs text-text-muted italic mb-3">{serv.tagline}</p>
                <ul className="flex flex-col gap-1.5 mb-5 flex-1">
                  {serv.bullet.slice(0, 2).map((b, i) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent/60 flex-none mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-auto">
                  <a
                    href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                    className="btn-primary !py-2 !px-4 text-xs flex items-center justify-center gap-1.5 flex-1"
                  >
                    <Mail className="w-3.5 h-3.5" /> Talk to Us
                  </a>
                  <Link
                    to="/services"
                    className="btn-secondary !py-2 !px-4 text-xs flex items-center justify-center gap-1.5 flex-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Learn More
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* CTA strip */}
      <ScrollReveal>
        <div
          className="card-hsociety p-6 md:p-8 text-center border border-border"
          style={{ background: 'var(--color-accent-dim)' }}
        >
          <h3 className="text-lg md:text-xl font-bold text-text-primary mb-2">Not sure which service fits?</h3>
          <p className="text-text-muted text-sm mb-5 max-w-lg mx-auto">
            Our security desk can map our capabilities to your threat model.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
              className="btn-secondary text-sm inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Talk to Us
            </a>
            <Link to="/services" className="text-xs font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-1.5">
              View All Services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ServicesSection;
