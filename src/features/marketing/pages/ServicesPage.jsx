import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { SERVICES } from '@/features/marketing/data/servicesData'
import { useSEO } from '@/core/utils/useSEO'

export default function ServicesPage() {
  useSEO({
    title: 'Offensive Security Services',
    description: 'Penetration testing, web application security audits, vulnerability assessments, and corporate security training. Scoped and priced individually for your organisation.',
    path: '/services',
  })
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero */}
      <section className="relative py-28 px-4 sm:px-6 border-b border-[var(--border)] overflow-hidden">
        <img
          src="/images/how-it-works-section/Engagements-4Completed.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/60 via-transparent to-[var(--bg-primary)] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// what we do</p>
          <h1 className="font-mono font-black text-4xl md:text-6xl text-[var(--text-primary)] mb-4 leading-tight">Our Services</h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed">
            Offensive security services for organisations that take security seriously.
            All engagements are scoped individually — contact us to discuss your requirements.
          </p>
        </div>
      </section>

      {/* Services cards */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="card group flex flex-col hover:border-accent/50 hover:-translate-y-1 transition-all duration-200"
            >
              {/* Cover image */}
              <div className="relative h-44 w-full overflow-hidden shrink-0">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-accent/50 text-accent bg-black/70">
                    {service.tag}
                  </span>
                </div>
                {/* Icon overlay */}
                <div className="absolute bottom-3 right-3 w-9 h-9 border border-accent/40 bg-black/60 flex items-center justify-center">
                  <service.icon size={16} className="text-accent" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4 p-6 flex-1">
                <div>
                  <h2 className="font-mono font-bold text-base sm:text-lg text-[var(--text-primary)] leading-snug">{service.title}</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{service.desc}</p>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{service.description}</p>

                {/* Bullets */}
                <ul className="space-y-1.5 flex-1">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                      <ChevronRight size={11} className="text-accent shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="pt-2 border-t border-[var(--border)]">
                  <Link
                    to="/contact"
                    state={{ reason: service.title }}
                    className="btn-primary inline-flex items-center gap-2 text-xs px-4 py-2"
                  >
                    Get a Quote
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-20 px-4 sm:px-6 border-t border-[var(--border)] overflow-hidden">
        <img
          src="/images/cta-setion-background/cta-background.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[var(--bg-primary)]/80 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5">
          <p className="font-mono text-accent text-xs uppercase tracking-widest">// pricing</p>
          <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--text-primary)]">No fixed pricing</h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Every organisation is different. Pricing is determined by scope, team size, and engagement type.
            Reach out and we will put together a proposal tailored to your needs.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 group px-8 py-3 text-sm">
            Contact Us
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
