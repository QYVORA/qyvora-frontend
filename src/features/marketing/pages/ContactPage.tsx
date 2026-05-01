import React, { useState } from 'react';
import { motion } from 'motion/react';
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
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-bg-card py-16 md:py-24 has-bg-image">
        <img
          src="/assets/sections/backgrounds/employee-training-bg.png"
          alt=""
          aria-hidden="true"
          className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none"
        />
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
              {SITE_CONFIG.contactPage.heroTag}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-5 leading-tight">
              {SITE_CONFIG.contactPage.heroTitle}
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto">
              {SITE_CONFIG.contactPage.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          {/* Info Side */}
          <ScrollReveal delay={0.05} className="space-y-6">
            <div className="card-hsociety p-7 md:p-8 space-y-8">
              {[
                {
                  icon: Mail,
                  heading: SITE_CONFIG.contactPage.emailHeading,
                  desc: SITE_CONFIG.contactPage.emailDescription,
                  value: <a href={`mailto:${SITE_CONFIG.contact.opsEmail}`} className="text-accent font-mono font-bold hover:underline break-all">{SITE_CONFIG.contact.opsEmail}</a>,
                },
                {
                  icon: MapPin,
                  heading: SITE_CONFIG.contactPage.hqHeading,
                  desc: `${SITE_CONFIG.contact.headquarters}. ${SITE_CONFIG.contactPage.hqDescriptionSuffix}`,
                  value: <address className="not-italic text-accent font-mono font-bold">{SITE_CONFIG.contact.headquarters}</address>,
                },
              ].map(({ icon: Icon, heading, desc, value }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-5"
                >
                  <div className="w-11 h-11 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center text-accent shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary mb-1 uppercase tracking-tight">{heading}</h3>
                    <p className="text-sm text-text-muted mb-3">{desc}</p>
                    {value}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Form Side */}
          <ScrollReveal delay={0.1} className="card-hsociety p-7 md:p-8">
            <h2 className="text-xl font-bold text-text-primary mb-7 uppercase tracking-tighter">
              {SITE_CONFIG.contactPage.formTitle}
            </h2>

            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center py-14 gap-4 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-dim border border-accent/30 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">{SITE_CONFIG.contactPage.sentTitle}</h3>
                <p className="text-sm text-text-muted">We'll respond to your operator email {SITE_CONFIG.contact.responseTime}.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-secondary text-xs !py-2 !px-5 mt-2"
                >
                  {SITE_CONFIG.contactPage.sentButtonLabel}
                </button>
              </motion.div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { name: 'name',  label: SITE_CONFIG.contactPage.labels.name,  type: 'text',  placeholder: SITE_CONFIG.contactPage.placeholders.name  },
                    { name: 'email', label: SITE_CONFIG.contactPage.labels.email, type: 'email', placeholder: SITE_CONFIG.contactPage.placeholders.email },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name} className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</label>
                      <input
                        name={name}
                        type={type}
                        required
                        placeholder={placeholder}
                        className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{SITE_CONFIG.contactPage.labels.subject}</label>
                  <select
                    name="subject"
                    className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm appearance-none cursor-pointer transition-colors"
                  >
                    <option value="">{SITE_CONFIG.contactPage.selectSubjectPlaceholder}</option>
                    {SITE_CONFIG.contactSubjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>{subject.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{SITE_CONFIG.contactPage.labels.message}</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder={SITE_CONFIG.contactPage.placeholders.message}
                    className="w-full bg-bg border border-border rounded-lg py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm resize-none transition-colors"
                  />
                </div>

                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-400 font-mono"
                  >
                    {SITE_CONFIG.contactPage.errorPrefix} {SITE_CONFIG.contact.opsEmail}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full btn-primary !py-3.5 flex items-center justify-center gap-3 disabled:opacity-60"
                >
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
