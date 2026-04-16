import { useSEO } from '@/core/utils/useSEO'

const SECTIONS = [
  { id: 'eligibility-accounts', title: 'Eligibility & Accounts', type: 'p', body: 'You are responsible for safeguarding your account and ensuring the information you provide is accurate. Access may be restricted based on role, training stage, or compliance requirements.' },
  { id: 'training-conduct', title: 'Training & Community Conduct', type: 'ul', items: ['Use the platform for ethical, authorized learning and execution only.', 'Respect community members, mentors, and the confidentiality of engagements.', 'Do not share protected materials, credentials, or client data without permission.'] },
  { id: 'engagements-services', title: 'Engagements & Services', type: 'p', body: 'Participation in real-world engagements is supervised and permission-based. Any testing or assessment outside HSOCIETY-approved scopes is prohibited. Reports and deliverables are owned and managed according to the engagement agreement.' },
  { id: 'payments', title: 'Payments', type: 'p', body: 'Paid training and paid engagements are billed per the pricing shown at the time of purchase. Refunds, if available, follow the specific terms provided during checkout.' },
  { id: 'intellectual-property', title: 'Intellectual Property', type: 'p', body: 'HSOCIETY content, tools, and training materials remain the property of HSOCIETY or its licensors. You may not copy, resell, or distribute materials without written permission.' },
  { id: 'prohibited-use', title: 'Prohibited Use', type: 'ul', items: ['Unauthorized testing, exploitation, or access to third-party systems.', 'Abuse, harassment, or interference with the platform or community.', 'Any activity that violates applicable law or HSOCIETY policies.'] },
  { id: 'disclaimers-liability', title: 'Disclaimers & Liability', type: 'p', body: 'The platform is provided as-is. HSOCIETY is not liable for indirect or consequential damages arising from platform use, training outcomes, or engagement results.' },
  { id: 'changes-termination', title: 'Changes & Termination', type: 'p', body: 'We may update these terms to reflect changes in the platform or legal requirements. We may suspend or terminate access for violations or security risk.' },
]

export default function TermsPage() {
  useSEO({ title: 'Terms of Service', description: 'Terms and conditions for using the HSOCIETY OFFSEC platform, training, and engagement services.', path: '/terms' })
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="relative py-24 px-4 sm:px-6 border-b border-[var(--border)] overflow-hidden">
        <img
          src="/images/how-it-works-section/Engagements-4Completed.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[var(--bg-primary)]/72 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-accent/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// legal</p>
          <h1 className="font-mono font-black text-4xl md:text-5xl text-[var(--text-primary)] mb-3 leading-tight">Terms of Service</h1>
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
              <section key={s.id} id={s.id} className="border-l-2 border-accent/40 pl-4 sm:pl-5 py-1 scroll-mt-24">
                <h2 className="font-mono font-bold text-lg text-[var(--text-primary)] mb-3">{s.title}</h2>
                {s.type === 'ul'
                  ? <ul className="text-base text-[var(--text-secondary)] space-y-2 font-mono">{s.items.map((item, i) => <li key={i} className="break-words">{item}</li>)}</ul>
                  : <p className="text-base text-[var(--text-secondary)] font-mono leading-relaxed break-words">{s.body}</p>
                }
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  )
}
