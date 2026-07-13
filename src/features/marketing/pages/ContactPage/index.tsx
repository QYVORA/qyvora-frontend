import React, { useState } from 'react';
import { Send, Loader2, AlertCircle, Mail, MapPin, Globe } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import api from '@/core/services/api';
import { Footer } from '@/shared/components/layout';
import SEO from '@/shared/components/SEO';
import LandingFinalCtaSection from '@/features/marketing/components/landing/LandingFinalCtaSection';
import { useAuth } from '@/core/contexts/AuthContext';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';

type ContactType = 'student' | 'business';

const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [contactType, setContactType] = useState<ContactType>('business');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const formData = new FormData(event.currentTarget);
      await api.post('/public/contact', {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: `[${contactType === 'student' ? 'Student' : 'Business'}] Contact Form Inquiry`,
        message: formData.get('message'),
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-bg">
      <SEO
        title="Contact"
        description="Get in touch with QYVORA for partnerships, inquiries, and operational support."
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Contact', item: '/contact' },
        ]}
      />

      <section className="relative bg-accent overflow-hidden min-h-[85svh] md:min-h-screen pt-24 md:pt-32 pb-16 md:pb-24" data-nav-invert>
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6 text-bg/70 text-xs font-black uppercase tracking-[0.3em]">
              <Mail className="w-4 h-4" />
              {SITE_CONFIG.contactPage.heroTag}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] mb-6 text-bg">
              {SITE_CONFIG.contactPage.heroTitle.split(' ').map((word, i) =>
                i === SITE_CONFIG.contactPage.heroTitle.split(' ').length - 1 ? (
                  <span key={i} className="text-bg/80">{word}</span>
                ) : (
                  <React.Fragment key={i}>{word} </React.Fragment>
                )
              )}
            </h1>
            <p className="text-lg md:text-xl text-bg/70 font-mono leading-relaxed max-w-2xl">
              {SITE_CONFIG.contactPage.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="relative w-full py-20 md:py-28 border-t border-border/20">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-16">
            {/* Left info cards */}
            <div className="md:col-span-2 space-y-6">
              <div className="card-qyvora border border-border bg-bg-card/60 p-6 md:p-8 hover:border-accent/35">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">{SITE_CONFIG.contactPage.emailHeading}</h3>
                    <p className="text-xs text-text-muted mt-1 break-words">{SITE_CONFIG.contactPage.emailDescription}</p>
                    <span className="inline-block mt-2 text-sm font-mono text-accent/70">
                      Use the form below
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-qyvora border border-border bg-bg-card/60 p-6 md:p-8 hover:border-accent/35">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">{SITE_CONFIG.contactPage.whatsappHeading}</h3>
                    <p className="text-xs text-text-muted mt-1">{SITE_CONFIG.contactPage.whatsappDescription}</p>
                    <a href={SITE_CONFIG.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm font-mono text-accent hover:underline">
                      {SITE_CONFIG.contact.whatsappUrl}
                    </a>
                  </div>
                </div>
              </div>

              <div className="card-qyvora border border-border bg-bg-card/60 p-6 md:p-8 hover:border-accent/35">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">{SITE_CONFIG.contactPage.hqHeading}</h3>
                    <p className="text-xs text-text-muted mt-1 break-words">{SITE_CONFIG.contact.headquarters} — {SITE_CONFIG.contactPage.hqDescriptionSuffix}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="md:col-span-3">
              <div className="card-qyvora border border-border bg-bg-card/60 p-6 md:p-8 lg:p-10 hover:border-accent/35">
                {status === 'sent' ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-5 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                      <IconCheck size={32} className="text-accent" />
                    </div>
                    <h3 className="text-xl font-black text-text-primary uppercase tracking-wide">{SITE_CONFIG.contactPage.sentTitle}</h3>
                    <p className="text-sm text-text-muted max-w-md leading-relaxed">
                      Thank you for reaching out. We'll get back to you {SITE_CONFIG.contact.responseTime}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="bg-accent text-bg font-bold uppercase tracking-[0.08em] rounded-xl px-8 py-3 transition-all hover:brightness-110 active:scale-95 hover:shadow-[0_0_20px_var(--color-accent-glow)] text-sm mt-2"
                    >
                      {SITE_CONFIG.contactPage.sentButtonLabel}
                    </button>
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between border-b border-border/40 pb-4">
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em]">
                        {SITE_CONFIG.contactPage.formTitle}
                      </span>
                      <div className="flex bg-bg/50 border border-border p-1 rounded-xl w-full md:w-60">
                        <button
                          type="button"
                          onClick={() => setContactType('student')}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            contactType === 'student'
                              ? 'bg-accent text-bg shadow-[0_0_12px_var(--color-accent-glow)] font-black'
                              : 'text-text-muted hover:text-text-primary'
                          }`}
                        >
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactType('business')}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            contactType === 'business'
                              ? 'bg-accent text-bg shadow-[0_0_12px_var(--color-accent-glow)] font-black'
                              : 'text-text-muted hover:text-text-primary'
                          }`}
                        >
                          Business
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                        {SITE_CONFIG.contactPage.labels.name}
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        placeholder={SITE_CONFIG.contactPage.placeholders.name}
                        className="w-full bg-bg border border-border rounded-xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                        {SITE_CONFIG.contactPage.labels.email}
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder={SITE_CONFIG.contactPage.placeholders.email}
                        className="w-full bg-bg border border-border rounded-xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                        {SITE_CONFIG.contactPage.labels.message}
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        required
                        placeholder={SITE_CONFIG.contactPage.placeholders.message}
                        className="w-full bg-bg border border-border rounded-xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm resize-none transition-colors"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-xs text-red-400 font-mono">
                          {SITE_CONFIG.contactPage.errorPrefix} {SITE_CONFIG.contact.opsEmail}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-accent text-bg font-bold uppercase tracking-[0.1em] rounded-xl px-8 py-4 transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {status === 'sending' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {SITE_CONFIG.contactPage.sendingLabel}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {SITE_CONFIG.contactPage.submitLabel}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="relative w-full">
        <LandingFinalCtaSection user={user} />
      </section>

      <section className="bg-transparent overflow-hidden">
        <Footer />
      </section>
    </div>
  );
};

export default ContactPage;
