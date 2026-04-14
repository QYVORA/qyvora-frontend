import { Link } from 'react-router-dom'
import { ArrowRight, Bug, GraduationCap, Globe, Shield, Users } from 'lucide-react'

const SERVICES = [
  {
    icon: Shield,
    title: 'Penetration Testing',
    desc: 'Full-scope attack simulation against your infrastructure and applications.',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=70',
  },
  {
    icon: Globe,
    title: 'Web App Security Audit',
    desc: 'OWASP Top 10 and beyond — APIs, auth, business logic, and more.',
    img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=70',
  },
  {
    icon: Bug,
    title: 'Vulnerability Assessment',
    desc: 'Risk-rated inventory of weaknesses across your entire attack surface.',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=70',
  },
  {
    icon: Users,
    title: 'Employee Training',
    desc: 'Teach your team to think like attackers with hands-on labs and workshops.',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=70',
  },
  {
    icon: GraduationCap,
    title: 'Corporate Bootcamp',
    desc: 'Multi-week structured offensive security programme for your organisation.',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=70',
  },
]

export function ServicesTeaser() {
  return (
    <section className="py-32 px-6 border-t border-accent/10 bg-[var(--bg-primary)]" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// for organisations</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-[var(--text-primary)]">Security Services</h2>
            <p className="text-[var(--text-secondary)] mt-3 max-w-xl leading-relaxed">
              Beyond training — we deliver professional offensive security services to organisations across Africa and beyond.
              All engagements are scoped and priced individually.
            </p>
          </div>
          <Link to="/services" className="btn-secondary flex items-center gap-2 group shrink-0 self-start md:self-auto">
            View all services
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              to="/contact"
              state={{ reason: s.title }}
              className="card overflow-hidden flex flex-col group hover:border-accent/40 hover:-translate-y-1 transition-all duration-200"
              style={{ willChange: 'transform' }}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-[var(--bg-secondary)]">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center text-accent">
                    <s.icon size={16} />
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{s.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">{s.desc}</p>
                <div className="flex items-center gap-1 text-xs font-mono text-accent group-hover:gap-2 transition-all mt-1">
                  Get a quote <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          ))}

          {/* Contact CTA card */}
          <Link
            to="/contact"
            className="card overflow-hidden flex flex-col group hover:border-accent/40 hover:-translate-y-1 transition-all duration-200"
            style={{ willChange: 'transform' }}
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&q=70"
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-50"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-accent/20" />
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1 bg-accent/5">
              <p className="font-display font-bold text-lg text-[var(--text-primary)]">Not sure what you need?</p>
              <p className="text-sm text-[var(--text-secondary)] flex-1">Tell us about your organisation and we will recommend the right engagement.</p>
              <div className="btn-primary flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm">
                Contact Us <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
