import { useSEO } from '@/core/utils/useSEO'

const SECTIONS = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    items: [
      'Account details: name, handle, email, and authentication data.',
      'Training and community activity: module progress, submissions, and participation.',
      'Engagement data: reports, findings, and supervised execution notes.',
      'Usage data: device, browser, IP, and log events for security and analytics.',
      'Communications: messages to support and announcements you opt into.',
    ],
    type: 'ul',
  },
  {
    id: 'how-we-use-data',
    title: 'How We Use Data',
    items: [
      'Deliver training, community collaboration, and supervised engagements.',
      'Measure progress, skill validation, and rank progression.',
      'Improve platform security, performance, and user experience.',
      'Provide penetration testing services to organizations when applicable.',
      'Comply with legal and contractual obligations.',
    ],
    type: 'ul',
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing',
    body: 'We do not sell your personal data. We may share data with trusted service providers (hosting, analytics, communications) and with client organizations during supervised engagements, only as required to deliver services.',
    type: 'p',
  },
  {
    id: 'security-retention',
    title: 'Security & Retention',
    body: 'We apply security-first practices, access controls, and monitoring. We retain data only as long as necessary for training records, engagement obligations, and legal requirements.',
    type: 'p',
  },
  {
    id: 'your-choices',
    title: 'Your Choices',
    items: [
      'Access and update your profile and preferences at any time.',
      'Request deletion or export of your data, subject to engagement obligations.',
      'Opt out of non-essential communications.',
    ],
    type: 'ul',
  },
  {
    id: 'contact',
    title: 'Contact',
    body: 'Questions about privacy? Email us at info@hsociety.io',
    type: 'p',
  },
]

export default function PrivacyPage() {
  useSEO({ title: 'Privacy Policy', description: 'How HSOCIETY OFFSEC collects, uses, and protects your data.', path: '/privacy' })
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="relative py-24 px-4 sm:px-6 border-b border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-accent/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// legal</p>
          <h1 className="font-mono font-black text-4xl md:text-5xl text-[var(--text-primary)] mb-3 leading-tight">Privacy Policy</h1>
          <p className="font-mono text-xs text-[var(--text-muted)]">Last updated: January 2025</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex gap-12 items-start">
          <aside className="hidden lg:block w-52 shrink-0 sticky top-24">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-4">// sections</p>
            <nav className="flex flex-col gap-0.5">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="font-mono text-xs text-[var(--text-secondary)] hover:text-accent transition-colors py-1.5 border-l-2 border-[var(--border)] hover:border-accent pl-3">{s.title}</a>
              ))}
            </nav>
          </aside>
          <main className="flex-1 min-w-0 space-y-8">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="border-l-2 border-accent/40 pl-5 py-1 scroll-mt-24">
                <h2 className="font-mono font-bold text-base text-[var(--text-primary)] mb-3">{s.title}</h2>
                {s.type === 'ul' ? (
                  <ul className="text-sm text-[var(--text-secondary)] space-y-2 font-mono">
                    {s.items.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] font-mono leading-relaxed">{s.body}</p>
                )}
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  )
}
