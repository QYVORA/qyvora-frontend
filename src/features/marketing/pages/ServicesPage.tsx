import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowRight } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { MARKETING_SERVICES } from '../content/services';
import { SITE_CONFIG } from '../content/siteConfig';

const Services: React.FC = () => (
  <div className="min-h-screen bg-bg">
    {/* HERO */}
    <section className="relative min-h-[60svh] md:min-h-[55vh] w-full overflow-hidden scanlines">
      <div className="absolute inset-0 bg-bg z-0" />
      <img
        src="/assets/sections/backgrounds/offsec-grid-background.png"
        alt=""
        aria-hidden="true"
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.18] z-0 pointer-events-none"
      />
      <div className="absolute inset-0 dot-grid hero-dot-grid opacity-20 z-0" />
      <div className="absolute inset-0 bg-radial-vignette opacity-60 z-10 hero-vignette" />
      <div className="relative z-20 min-h-[60svh] md:min-h-[55vh] max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center pt-10 pb-12 md:pt-14 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm w-fit"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">// OPERATIONS</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5 max-w-3xl"
        >
          Security Services<br />
          <span className="text-accent">Built for the Real World.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="text-text-secondary text-sm md:text-base max-w-xl mb-8"
        >
          From corporate security assessments to AI-integrated defence systems — we deliver
          offensive-grade expertise to organisations that take security seriously.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <a
            href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
            className="btn-primary text-sm !px-6 text-center inline-flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" /> Talk to Us
          </a>
          <Link
            to="/contact"
            className="btn-secondary text-sm !px-6 text-center inline-flex items-center justify-center gap-2"
          >
            Send a Message <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}
          className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter mt-8 overflow-hidden whitespace-nowrap"
        >
          $ hsociety --module services --status active<span className="animate-blink italic">_</span>
        </motion.div>
      </div>
    </section>

    {/* SERVICE CARDS */}
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <ScrollReveal className="mb-12 md:mb-16">
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// WHAT WE DO</span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-text-primary mb-2">Core Offerings</h2>
              <p className="text-text-muted text-sm max-w-xl">
                Each service is aligned with our operating loop — from training operators to protecting the organisations they will defend.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {MARKETING_SERVICES.map((serv, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: idx * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="group relative rounded-xl border border-border bg-bg-card overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-accent/30"
                style={{ boxShadow: 'var(--card-shimmer)' }}>

                {/* Image panel — full bleed with overlays */}
                <div className="relative h-52 md:h-56 overflow-hidden flex-none">
                  <img
                    src={serv.img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {/* Scanlines on image */}
                  <div aria-hidden className="scanlines absolute inset-0 pointer-events-none" />
                  {/* Bottom gradient fade into card */}
                  <div aria-hidden className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, var(--color-bg-card), transparent)' }} />
                  {/* Top-left accent bar */}
                  <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, var(--color-accent), transparent)' }} />
                  {/* Index number */}
                  <div className="absolute top-4 left-4 font-mono text-4xl font-black leading-none select-none pointer-events-none"
                    style={{ color: 'var(--color-accent-dim)' }}>
                    0{idx + 1}
                  </div>
                  {/* Category tag */}
                  <div className="absolute top-4 right-4">
                    <span className="text-[9px] font-bold text-accent border border-accent/30 bg-bg/80 backdrop-blur-sm rounded px-2 py-1 uppercase tracking-wider font-mono">
                      {serv.category}
                    </span>
                  </div>
                  {/* Icon badge bottom-left */}
                  <div className="absolute bottom-4 left-4 w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-border-strong)' }}>
                    <serv.icon className="w-4 h-4 text-accent" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-black text-text-primary mb-1 group-hover:text-accent transition-colors leading-tight font-mono uppercase tracking-tight">
                    {serv.title}
                  </h3>
                  <p className="text-xs text-text-muted mb-5 font-mono">{serv.tagline}</p>

                  {/* Bullet list — terminal style */}
                  <ul className="flex flex-col gap-2 mb-6 flex-1">
                    {serv.bullet.map((b, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-3">
                        <span className="text-accent font-mono font-bold flex-none mt-0.5 text-xs">{'>'}</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* CTA row */}
                  <div className="flex gap-3 mt-auto pt-2 border-t border-border">
                    <a
                      href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                      className="btn-primary text-xs !py-2.5 flex items-center justify-center gap-2 flex-1"
                    >
                      <Mail className="w-3.5 h-3.5" /> Talk to Us
                    </a>
                    <Link
                      to="/contact"
                      className="btn-secondary text-xs !py-2.5 flex items-center justify-center gap-2 flex-1"
                    >
                      Send a Message <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Hover glow */}
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                  style={{ boxShadow: '0 0 40px var(--color-accent-glow)' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA BANNER */}
    <section className="pb-16 md:pb-24 max-w-7xl mx-auto px-4 md:px-8">
      <ScrollReveal>
        <div className="relative rounded-xl border border-border overflow-hidden p-8 md:p-14 text-center"
          style={{ background: 'var(--color-accent-dim)' }}>
          <div aria-hidden className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
          <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }} />
          <div className="relative z-10">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block font-mono">// SECURE CHANNEL</span>
            <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-3">Not sure which service fits?</h3>
            <p className="text-text-muted text-sm md:text-base mb-8 max-w-lg mx-auto">
              Our security desk can map our capabilities to your threat model. Reach out for a confidential briefing — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                className="btn-primary text-sm !px-8 inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Talk to Us
              </a>
              <Link to="/contact" className="btn-secondary text-sm !px-8 inline-flex items-center gap-2">
                Send a Message <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  </div>
);

export default Services;
