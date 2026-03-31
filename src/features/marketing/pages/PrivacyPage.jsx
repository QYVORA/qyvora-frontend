export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
      <div className="text-center space-y-3">
        <p className="font-mono text-accent text-xs uppercase tracking-widest">// privacy</p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-[var(--text-primary)]">Privacy Policy</h1>
        <p className="text-[var(--text-secondary)] text-sm md:text-base">
          HSOCIETY is a cycle-based offensive security ecosystem that connects training, community,
          and supervised real-world execution. This policy explains how we handle your data.
        </p>
      </div>

      <div className="space-y-8">
        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Information We Collect</h2>
          <ul className="text-sm text-[var(--text-secondary)] space-y-2">
            <li>Account details: name, handle, email, and authentication data.</li>
            <li>Training and community activity: module progress, submissions, and participation.</li>
            <li>Engagement data: reports, findings, and supervised execution notes.</li>
            <li>Usage data: device, browser, IP, and log events for security and analytics.</li>
            <li>Communications: messages to support and announcements you opt into.</li>
          </ul>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">How We Use Data</h2>
          <ul className="text-sm text-[var(--text-secondary)] space-y-2">
            <li>Deliver training, community collaboration, and supervised engagements.</li>
            <li>Measure progress, skill validation, and rank progression.</li>
            <li>Improve platform security, performance, and user experience.</li>
            <li>Provide penetration testing services to organizations when applicable.</li>
            <li>Comply with legal and contractual obligations.</li>
          </ul>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Data Sharing</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            We do not sell your personal data. We may share data with trusted service providers
            (hosting, analytics, communications) and with client organizations during supervised
            engagements, only as required to deliver services. We may also disclose data to comply
            with law or protect our platform and users.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Security & Retention</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            We apply security-first practices, access controls, and monitoring. We retain data only
            as long as necessary for training records, engagement obligations, and legal requirements.
          </p>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Your Choices</h2>
          <ul className="text-sm text-[var(--text-secondary)] space-y-2">
            <li>Access and update your profile and preferences at any time.</li>
            <li>Request deletion or export of your data, subject to engagement obligations.</li>
            <li>Opt out of non-essential communications.</li>
          </ul>
        </section>

        <section className="card p-6 space-y-3">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">Contact</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Questions about privacy? Reach us through the support channels listed on the platform.
          </p>
        </section>
      </div>
    </div>
  )
}
