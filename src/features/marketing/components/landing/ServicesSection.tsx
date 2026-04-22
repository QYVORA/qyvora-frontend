import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { MARKETING_SERVICES } from '../../content/services';
import { SITE_CONFIG } from '../../content/siteConfig';

const ServicesSection: React.FC = () => (
  <section className="py-16 md:py-24 bg-bg">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <ScrollReveal className="text-center mb-10 md:mb-16">
        <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// OPERATIONS</span>
        <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">Security Services</h2>
        <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">Core offerings aligned with our company operating loop, including Stage 04 corporate services and productized security solutions.</p>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
        {MARKETING_SERVICES.map((serv, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.1}>
            <div className="card-hsociety overflow-hidden flex flex-col h-full group">
              <div className="h-40 md:h-48 overflow-hidden relative">
                <img src={serv.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-[#050706]/50 group-hover:bg-[#050706]/20 transition-all duration-700" />
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <span className="text-[10px] font-bold text-accent border border-accent/30 rounded px-2 py-0.5 w-fit mb-3">{serv.category}</span>
                <h3 className="text-lg md:text-xl font-bold text-text-primary mb-3">{serv.title}</h3>
                <ul className="flex flex-col space-y-2 mb-6">
                  {serv.bullet.map((b, i) => (<li key={i} className="text-sm text-text-secondary flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent/40 rounded-full flex-none" /> {b}</li>))}
                </ul>
                <Link to="/contact" className="mt-auto btn-secondary !py-2.5 !px-5 text-xs text-center block">Get a Quote</Link>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal className="card-hsociety p-6 md:p-12 text-center bg-accent-dim/10">
        <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">Not sure which service fits?</h3>
        <p className="text-text-muted text-sm mb-6 max-w-lg mx-auto">Our strategic advisory team can map our capabilities to your threat model.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={SITE_CONFIG.contact.whatsappUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-sm"><MessageSquare className="w-4 h-4" /> Message on WhatsApp</a>
          <a href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`} className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2 text-sm"><Mail className="w-4 h-4" /> Email Security Desk</a>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ServicesSection;

