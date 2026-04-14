import { useState } from 'react'
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'

const CONTACT_REASONS = [
  'Penetration Testing',
  'Web Application Security Audit',
  'Employee Security Training',
  'Bootcamp Enrollment',
  'General Inquiry',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', reason: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero header */}
      <section className="relative py-32 px-6 border-b border-[var(--border)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1400&q=60"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/50 to-[var(--bg-primary)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// get in touch</p>
          <h1 className="font-display font-black text-4xl md:text-6xl text-[var(--text-primary)] mb-4">Contact Us</h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            Ready to secure your organisation or train your team? Tell us what you need and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left — info + image */}
          <div className="lg:col-span-2 space-y-8">

            {/* Office/team image */}
            <div className="rounded-2xl overflow-hidden h-48 border border-[var(--border)]">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=75"
                alt="HSOCIETY team"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">Let's talk</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Pricing is negotiated based on your organisation's size, scope, and requirements. No hidden fees — just a conversation.
              </p>
            </div>

            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'info@hsociety.io' },
                { icon: Phone, label: 'Phone', value: '+27 (0) 000 000 0000' },
                { icon: MapPin, label: 'Location', value: 'South Africa · Remote Worldwide' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
                    <p className="text-sm text-[var(--text-primary)] mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl border border-accent/20 bg-accent/5 space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-accent" />
                <p className="text-sm font-semibold text-[var(--text-primary)]">Response time</p>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                We respond to all enquiries within 24 hours on business days. For urgent security incidents, mention it in your message.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent/30 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&q=75"
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
                  <Send size={26} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-2xl text-[var(--text-primary)]">Message sent</h3>
                <p className="text-[var(--text-secondary)] max-w-sm">
                  Thanks for reaching out. We'll review your enquiry and get back to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', company: '', reason: '', message: '' }) }}
                  className="text-sm text-accent font-mono hover:opacity-80 mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Full Name *</label>
                    <input required className="input-field" placeholder="John Doe" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Work Email *</label>
                    <input required type="email" className="input-field" placeholder="john@company.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label">Company / Organisation</label>
                  <input className="input-field" placeholder="Acme Corp" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
                </div>
                <div>
                  <label className="label">What can we help with? *</label>
                  <select required className="input-field" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}>
                    <option value="">Select a service...</option>
                    {CONTACT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Message *</label>
                  <textarea required className="input-field min-h-[140px] resize-none" placeholder="Tell us about your organisation, team size, and what you're looking to achieve..." value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base rounded-xl shadow-lg shadow-accent/25 disabled:opacity-60">
                  {loading ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={17} /> Send Message</>
                  )}
                </button>
                <p className="text-xs text-[var(--text-muted)] text-center">
                  No pricing is shown — all engagements are scoped and quoted individually.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
