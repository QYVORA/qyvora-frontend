import { Link } from 'react-router-dom'
import { ArrowRight, Bug, GraduationCap, Globe, Shield, Users } from 'lucide-react'

const SERVICES = [
  { icon: Shield, title: 'Penetration Testing', desc: 'Full-scope attack simulation against your infrastructure and applications.' },
  { icon: Globe, title: 'Web App Security Audit', desc: 'OWASP Top 10 and beyond — APIs, auth, business logic, and more.' },
  { icon: Bug, title: 'Vulnerability Assessment', desc: 'Risk-rated inventory of weaknesses across your entire attack surface.' },
  { icon: Users, title: 'Employee Training', desc: 'Teach your team to think like attackers with hands-on labs and workshops.' },
  { icon: GraduationCap, title: 'Corporate Bootcamp', desc: 'Multi-week structured offensive security programme for your organisation.' },
]

export function ServicesTeaser() {
  return (
    <section className="py-32 px-6 border-t border-accent/10 bg-[var(--bg-primary)]" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// for organisations</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-[var(--text-primary)]">
              Security Services
            </h2>
            <p className="text-[var(--text-secondary)] mt-3 max-w-xl leading-relaxed">
              Beyond training — we deliver professional offensive security services to organisations across Africa and beyond.
              All engagements are scoped and priced individually.
            </p>
          </div>
          <Link
            to="/services"
            className="btn-secondary flex items-center gap-2 group shrink-0 self-start md:self-auto"
          >
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
              className="card p-6 flex flex-col gap-4 group hover:border-accent/40 hover:-translate-y-1 transition-all duration-200"
              style={{ willChange: 'transform' }}
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <s.icon size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{s.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-accent group-hover:gap-2 transition-all">
                Get a quote <ArrowRight size={11} />
              </div>
            </Link>
          ))}

          {/* Contact card */}
          <Link
            to="/contact"
            className="card p-6 flex flex-col gap-4 group hover:border-accent/40 hover:-translate-y-1 transition-all duration-200 bg-accent/5 border-accent/20"
            style={{ willChange: 'transform' }}
          >
            <div className="flex-1 flex flex-col justify-center items-center text-center gap-3 py-4">
              <p className="font-display font-bold text-xl text-[var(--text-primary)]">Not sure what you need?</p>
              <p className="text-sm text-[var(--text-secondary)]">Tell us about your organisation and we will recommend the right engagement.</p>
            </div>
            <div className="btn-primary flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-accent/25 transition-all rounded-xl py-3">
              Contact Us <ArrowRight size={15} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
