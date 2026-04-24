import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { MARKETING_SERVICES } from '../content/services';
import { SITE_CONFIG } from '../content/siteConfig';

const Services: React.FC = () => (
  <div className="min-h-screen bg-bg">

    {/* ── Hero ── */}
    <section className="relative min-h-[60svh] md:min-h-[55vh] w-full overflow-hidden scanlines">
      <div className="absolute inset-0 bg-bg z-0" />
      <img
        src="/images/section-backgrounds/offsec-grid-background.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.18] z-0 pointer-events-none"
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

    {/* ── Service Cards ── */}
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-8">
      <ScrollReveal className="mb-10 md:mb-14">
        <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// WHAT WE DO</span>
        <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-2">Core Offerings</h2>
        <p className="text-text-muted text-sm max-w-xl">
          Each service is aligned with our operating loop — from training operators to protecting the organisations they'll defend.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {MARKETING_SERVICES.map((serv, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.08}>
            <div className="card-hsociety overflow-hidden flex flex-col group h-full">
              {/* Full-width image header */}
              <div className="relative h-52 md:h-60 overflow-hidden flex-none">
                <img
                  src={serv.img}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-black/40 to-transparent" />
                {/* Category badge on image */}
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] font-bold text-accent border border-accent/40 bg-bg/80 backdrop-blur-sm rounded px-2 py-1 uppercase tracking-wider">
                    {serv.category}
                  </span>
                </div>
                {/* Icon bottom-right */}
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center backdrop-blur-sm">
                  <serv.icon className="w-5 h-5 text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <h3 className="text-xl md:text-2xl font-black text-text-primary mb-2 group-hover:text-accent transition-colors leading-tight">
                  {serv.title}
                </h3>
                <p className="text-sm text-text-muted italic mb-5">{serv.tagline}</p>

                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {serv.bullet.map((b, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accent/70 flex-none mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <a
                    href={`mailto:${SITE_CONFIG.contact.securityDeskEmail}`}
                    className="btn-primary text-sm flex items-center justify-center gap-2 flex-1"
                  >
                    <Mail className="w-4 h-4" /> Talk to Us
                  </a>
                  <Link
                    to="/contact"
                    className="btn-secondary text-sm flex items-center justify-center gap-2 flex-1"
                  >
                    <MessageCircle className="w-4 h-4" /> Send a Message
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* ── CTA Banner ── */}
    <section className="pb-16 md:pb-24 max-w-7xl mx-auto px-4 md:px-8">
      <ScrollReveal>
        <div
          className="card-hsociety p-8 md:p-14 text-center border border-border relative overflow-hidden"
          style={{ background: 'var(--color-accent-dim)' }}
        >
          <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">// SECURE CHANNEL</span>
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
