import { Link } from 'react-router-dom'
import { ArrowRight, Bug, GraduationCap, Globe, Shield, Users } from 'lucide-react'

const SERVICES = [
  {
    icon: Shield,
    title: 'Penetration Testing',
    tag: 'For Organisations',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=75',
    description: 'Full-scope penetration tests conducted by certified offensive security professionals. We simulate real-world attacks against your infrastructure, applications, and people to identify vulnerabilities before adversaries do.',
    bullets: [
      'Network and infrastructure penetration testing',
      'Internal and external attack simulation',
      'Detailed findings report with remediation guidance',
      'Executive summary for leadership',
      'Re-test included after remediation',
    ],
  },
  {
    icon: Globe,
    title: 'Web Application Security Audit',
    tag: 'For Organisations',
    img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=75',
    description: 'Comprehensive security assessment of your web applications covering OWASP Top 10 and beyond. We test authentication, authorisation, injection flaws, business logic, and API security.',
    bullets: [
      'OWASP Top 10 full coverage',
      'API and authentication testing',
      'Business logic vulnerability analysis',
      'Source code review (optional)',
      'Severity-rated findings with proof-of-concept',
    ],
  },
  {
    icon: Bug,
    title: 'Vulnerability Assessment',
    tag: 'For Organisations',
    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=75',
    description: 'Systematic identification and prioritisation of security weaknesses across your attack surface. Ideal for organisations that need a clear picture of their risk posture without a full penetration test.',
    bullets: [
      'Automated and manual scanning',
      'Risk-rated vulnerability inventory',
      'Prioritised remediation roadmap',
      'Compliance-ready reporting',
    ],
  },
  {
    icon: Users,
    title: 'Employee Security Training',
    tag: 'For Teams',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=75',
    description: 'Hands-on offensive security training for your technical teams. We run structured bootcamps and workshops that teach your developers, IT staff, and security teams to think like attackers.',
    bullets: [
      'Custom curriculum for your team skill level',
      'Hands-on labs and real-world scenarios',
      'Phishing simulation and awareness training',
      'Secure development practices for developers',
      'Ongoing access to HSOCIETY platform',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Corporate Security Bootcamp',
    tag: 'For Teams',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=75',
    description: 'Structured multi-week offensive security bootcamp delivered to your organisation. Teams go from fundamentals to advanced techniques through guided modules, live sessions, and supervised engagements.',
    bullets: [
      'Beginner to advanced tracks available',
      'Live instructor-led sessions',
      'CTF challenges and supervised engagements',
      'Certificates of completion',
      'Post-training support',
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero header with background image */}
      <section className="relative py-32 px-6 border-b border-[var(--border)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1400&q=60"
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
          <h1 className="font-display font-black text-4xl md:text-6xl text-[var(--text-primary)] mb-4">Our Services</h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            Offensive security services for organisations that take security seriously.
            All engagements are scoped individually — contact us to discuss your requirements.
          </p>
        </div>
      </section>

      {/* Services list */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {SERVICES.map((service, i) => (
            <div
              key={service.title}
              className="card overflow-hidden flex flex-col lg:flex-row hover:border-accent/40 transition-all duration-200 group"
            >
              {/* Image */}
              <div className={`relative lg:w-72 shrink-0 h-52 lg:h-auto overflow-hidden ${i % 2 !== 0 ? 'lg:order-last' : ''}`}>
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-accent/50 text-accent bg-black/60 backdrop-blur-sm">
                    {service.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <service.icon size={24} />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">{service.title}</h2>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2">{service.description}</p>
                  </div>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link
                    to="/contact"
                    state={{ reason: service.title }}
                    className="btn-primary inline-flex items-center gap-2 group/btn"
                  >
                    Get a Quote
                    <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA with background */}
      <section className="relative py-24 px-6 border-t border-[var(--border)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1400&q=60"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-8 pointer-events-none"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[var(--bg-primary)]/80 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
          <p className="font-mono text-accent text-xs uppercase tracking-widest">// pricing</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--text-primary)]">No fixed pricing</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Every organisation is different. Pricing is determined by scope, team size, and engagement type.
            Reach out and we will put together a proposal tailored to your needs.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 group px-8 py-4 rounded-xl text-base shadow-lg shadow-accent/25">
            Contact Us
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
