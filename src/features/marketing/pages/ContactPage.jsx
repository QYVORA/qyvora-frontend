import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Mail, MapPin, MessageSquare, MessageCircle, Send } from 'lucide-react'
import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'
import { CONTACT_REASONS } from '@/features/marketing/data/servicesData'
import api from '@/core/services/api'
import { useToast } from '@/core/contexts/ToastContext'

export default function ContactPage() {
  const location = useLocation()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', company: '', reason: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const preselectedReason = location.state?.reason
    if (preselectedReason && CONTACT_REASONS.includes(preselectedReason)) {
      setForm((prev) => ({ ...prev, reason: prev.reason || preselectedReason }))
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/public/subscribe', {
        email: form.email,
        name: form.name,
        source: `contact:${form.reason || 'general'}`,
      })
      await api.post('/public/security-events', {
        eventType: 'contact_form',
        action: 'contact_form_submitted',
        path: '/contact',
        metadata: {
          company: form.company || '',
          reason: form.reason || '',
          message: form.message || '',
        },
      })
      setSubmitted(true)
      toast({ type: 'success', message: 'Message sent. We will contact you shortly.' })
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send message. Please try again.')
      toast({ type: 'error', message: 'Could not send your message right now.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero header */}
      <section className="relative py-32 px-6 border-b border-[var(--border)] overflow-hidden">
        <img
          src="/images/cta-setion-background/cta-background.webp"
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
            <div className="rounded-none overflow-hidden h-48 border border-[var(--border)]">
              <img
                src="/images/how-it-works-section/Learners-Trained.webp"
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
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Email</p>
                  <a href="mailto:info@hsociety.io" className="text-sm text-[var(--text-primary)] mt-0.5 hover:text-accent transition-colors">
                    info@hsociety.io
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">WhatsApp Community</p>
                  <a
                    href="https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[var(--text-primary)] mt-0.5 hover:text-accent transition-colors"
                  >
                    Join the briefing room
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Location</p>
                  <p className="text-sm text-[var(--text-primary)] mt-0.5">South Africa · Remote Worldwide</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Follow Us</p>
              <div className="flex flex-wrap gap-3">
                {SOCIAL_MEDIA.map(({ key, label, url, icon: Icon }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-none border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-accent hover:border-accent/40 transition-all"
                  >
                    <Icon size={14} /> {label}
                  </a>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-none border border-accent/20 bg-accent/5 space-y-2">
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
                    src="/HSOCIETY-H-LOGO.webp"
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
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base rounded-none shadow-lg shadow-accent/25 disabled:opacity-60">
                  {loading ? (
                    <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={17} /> Send Message</>
                  )}
                </button>
                <p className="text-xs text-[var(--text-muted)] text-center">
                  No pricing is shown — all engagements are scoped and quoted individually.
                </p>
                {error && (
                  <p className="text-xs text-red-400 text-center">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
