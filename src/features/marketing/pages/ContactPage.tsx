import React, { useState } from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { Mail, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import api from '../../../core/services/api';
import { SITE_CONFIG } from '../content/siteConfig';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const fd = new FormData(e.currentTarget);
      await api.post('/public/contact', {
        name: fd.get('name'),
        email: fd.get('email'),
        subject: fd.get('subject'),
        message: fd.get('message'),
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{SITE_CONFIG.contactPage.heroTag}</span>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6">{SITE_CONFIG.contactPage.heroTitle}</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {SITE_CONFIG.contactPage.heroSubtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <ScrollReveal delay={0.1} className="space-y-8">
            <div className="card-hsociety p-8 space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-accent-dim border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1 uppercase tracking-tight">{SITE_CONFIG.contactPage.emailHeading}</h3>
                  <p className="text-sm text-text-muted mb-4">{SITE_CONFIG.contactPage.emailDescription}</p>
                  <a href={`mailto:${SITE_CONFIG.contact.opsEmail}`} className="text-accent font-mono font-bold hover:underline">{SITE_CONFIG.contact.opsEmail}</a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-accent-dim border border-accent/20 flex items-center justify-center text-accent shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1 uppercase tracking-tight">{SITE_CONFIG.contactPage.hqHeading}</h3>
                  <p className="text-sm text-text-muted mb-4">{SITE_CONFIG.contact.headquarters}. {SITE_CONFIG.contactPage.hqDescriptionSuffix}</p>
                  <address className="not-italic text-accent font-mono font-bold">{SITE_CONFIG.contact.headquarters}</address>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Form Side */}
          <ScrollReveal delay={0.2} className="card-hsociety p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-8 uppercase tracking-tighter">{SITE_CONFIG.contactPage.formTitle}</h2>

            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <CheckCircle className="w-12 h-12 text-accent" />
                <h3 className="text-lg font-bold text-text-primary">{SITE_CONFIG.contactPage.sentTitle}</h3>
                <p className="text-sm text-text-muted">We'll respond to your operator email {SITE_CONFIG.contact.responseTime}.</p>
                <button onClick={() => setStatus('idle')} className="btn-secondary text-xs !py-2 !px-4 mt-2">{SITE_CONFIG.contactPage.sentButtonLabel}</button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{SITE_CONFIG.contactPage.labels.name}</label>
                    <input name="name" type="text" required placeholder={SITE_CONFIG.contactPage.placeholders.name}
                      className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{SITE_CONFIG.contactPage.labels.email}</label>
                    <input name="email" type="email" required placeholder={SITE_CONFIG.contactPage.placeholders.email}
                      className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{SITE_CONFIG.contactPage.labels.subject}</label>
                  <select name="subject" className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm appearance-none cursor-pointer">
                    <option value="">{SITE_CONFIG.contactPage.selectSubjectPlaceholder}</option>
                    {SITE_CONFIG.contactSubjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>{subject.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{SITE_CONFIG.contactPage.labels.message}</label>
                  <textarea name="message" rows={5} required placeholder={SITE_CONFIG.contactPage.placeholders.message}
                    className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm resize-none transition-colors" />
                </div>
                {status === 'error' && (
                  <p className="text-xs text-red-400 font-mono">{SITE_CONFIG.contactPage.errorPrefix} {SITE_CONFIG.contact.opsEmail}</p>
                )}
                <button type="submit" disabled={status === 'sending'}
                  className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-60">
                  {status === 'sending'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> {SITE_CONFIG.contactPage.sendingLabel}</>
                    : <><Send className="w-4 h-4" /> {SITE_CONFIG.contactPage.submitLabel}</>}
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;
