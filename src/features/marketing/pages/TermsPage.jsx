export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
      <div className="text-center space-y-3">
        <p className="font-mono text-accent text-xs uppercase tracking-widest">// terms</p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-[var(--text-primary)]">Terms of Service</h1>
        <p className="text-[var(--text-secondary)] text-sm md:text-base">
          HSOCIETY is a cycle-based offensive security ecosystem focused on real execution,
          community growth, and disciplined skill validation. By using this platform, you agree
          to the terms below.
        </p>
      </div>

      <div className="space-y-8">
        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Eligibility & Accounts</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            You are responsible for safeguarding your account and ensuring the information you provide is accurate.
            Access may be restricted based on role, training stage, or compliance requirements.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Training & Community Conduct</h2>
          <ul className="text-sm text-[var(--text-secondary)] space-y-2">
            <li>Use the platform for ethical, authorized learning and execution only.</li>
            <li>Respect community members, mentors, and the confidentiality of engagements.</li>
            <li>Do not share protected materials, credentials, or client data without permission.</li>
          </ul>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Engagements & Services</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Participation in real-world engagements is supervised and permission-based. Any testing or
            assessment outside HSOCIETY-approved scopes is prohibited. Reports and deliverables are
            owned and managed according to the engagement agreement.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Payments</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Paid training and paid engagements are billed per the pricing shown at the time of purchase.
            Refunds, if available, follow the specific terms provided during checkout.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Intellectual Property</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            HSOCIETY content, tools, and training materials remain the property of HSOCIETY or its licensors.
            You may not copy, resell, or distribute materials without written permission.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Prohibited Use</h2>
          <ul className="text-sm text-[var(--text-secondary)] space-y-2">
            <li>Unauthorized testing, exploitation, or access to third-party systems.</li>
            <li>Abuse, harassment, or interference with the platform or community.</li>
            <li>Any activity that violates applicable law or HSOCIETY policies.</li>
          </ul>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Disclaimers & Liability</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            The platform is provided “as is.” HSOCIETY is not liable for indirect or consequential damages
            arising from platform use, training outcomes, or engagement results. Some limitations may not
            apply in certain jurisdictions.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Changes & Termination</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            We may update these terms to reflect changes in the platform or legal requirements. We may
            suspend or terminate access for violations or security risk.
          </p>
        </section>
      </div>
    </div>
  )
}
