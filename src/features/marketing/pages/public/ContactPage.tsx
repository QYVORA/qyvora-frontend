import React, { useState } from 'react';
import { Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
import { IconArrowRight } from '@/shared/components/icons';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { SITE_CONFIG } from '@/features/marketing/content/siteConfig';
import api from '@/core/services/api';

type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

const CHANNELS = [
  {
    key: 'email',
    label: 'Email',
    title: SITE_CONFIG.contactPage.emailHeading,
    desc: SITE_CONFIG.contactPage.emailDescription,
    value: SITE_CONFIG.contact.opsEmail,
    href: `mailto:${SITE_CONFIG.contact.opsEmail}`,
    cta: 'Send an email',
    icon: Mail,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    title: SITE_CONFIG.contactPage.whatsappHeading,
    desc: SITE_CONFIG.contactPage.whatsappDescription,
    value: 'QYVORA Community Channel',
    href: SITE_CONFIG.contact.whatsappUrl,
    cta: 'Join the channel',
    icon: MessageCircle,
  },
  {
    key: 'ops',
    label: 'Operations',
    title: SITE_CONFIG.contactPage.hqHeading,
    desc: `QYVORA · Tamale, Ghana · ${SITE_CONFIG.contactPage.hqDescriptionSuffix}`,
    value: SITE_CONFIG.contact.headquarters,
    cta: 'Learn more',
    href: '/about',
    icon: MapPin,
  },
] as const;

const ContactPage: React.FC = () => {
  const [status, setStatus] = useState<ContactStatus>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const formData = new FormData(event.currentTarget);
      await api.post('/public/contact', {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: '[Website] Contact Form Inquiry',
        message: formData.get('message'),
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Contact | QYVORA"}
        description={"Reach the QYVORA operations desk: email, WhatsApp channel, and the secure message form."}
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Contact"}
          title={"Contact the Desk"}
          description={"Establishing a secure channel for inquiries, partnerships, and operational support."}
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {/* Channel cards */}
          <div className="flex flex-col gap-4">
            {CHANNELS.map((channel) => {
              const Icon = channel.icon;
              const external = channel.href.startsWith('http');
              return (
                <Card key={channel.key} interactive className="flex flex-col gap-3 p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-accent">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="type-meta">{channel.label}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-black uppercase tracking-tight text-text-primary">
                      {channel.title}
                    </h3>
                    <p className="text-sm text-text-secondary">{channel.desc}</p>
                    <p className="text-sm font-mono text-accent break-all">{channel.value}</p>
                  </div>
                  <span className="mt-auto flex min-h-[44px] items-center pt-1">
                    {external ? (
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-text-primary"
                      >
                        {channel.cta}
                        <IconArrowRight size={14} aria-hidden="true" />
                      </a>
                    ) : (
                      <>
                        <a
                          href={channel.href}
                          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-text-primary"
                        >
                          {channel.cta}
                          <IconArrowRight size={14} aria-hidden="true" />
                        </a>
                        {channel.key === 'ops' && (
                          <span className="ml-auto inline-flex items-center gap-1.5 text-tiny font-black uppercase tracking-widest text-text-muted">
                            <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                            {`Replies ${SITE_CONFIG.contact.responseTime}`}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </Card>
              );
            })}
          </div>

          {/* Message form */}
          <Card className="flex h-fit flex-col gap-5 p-5 md:p-6">
            <div className="flex flex-col gap-1">
              <p className="type-label uppercase tracking-[0.12em] text-accent">{"Secure message form"}</p>
              <h2 className="text-xl font-black uppercase tracking-tight text-text-primary md:text-2xl">
                {"Send a transmission"}
              </h2>
              <p className="text-sm text-text-secondary">
                {"A member of the operations desk will get back to you within 24 hours."}
              </p>
            </div>

            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
                  <Mail className="h-6 w-6 text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-base font-black uppercase tracking-tight text-text-primary">
                  {"Transmission received"}
                </h3>
                <p className="text-sm text-text-muted">
                  {"Thank you for reaching out. We'll get back to you within 24-48 hours."}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="btn-secondary text-xs !px-5 !py-2"
                >
                  {"Send another"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="type-label block uppercase tracking-[0.12em] text-text-tertiary">
                    {"Name"}
                  </label>
                  <Input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder={SITE_CONFIG.contactPage.placeholders.name}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="type-label block uppercase tracking-[0.12em] text-text-tertiary">
                    {"Email"}
                  </label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder={SITE_CONFIG.contactPage.placeholders.email}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="type-label block uppercase tracking-[0.12em] text-text-tertiary">
                    {"Message"}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    placeholder={SITE_CONFIG.contactPage.placeholders.message}
                    className="w-full min-h-[44px] bg-surface border border-border-subtle rounded-lg py-3 px-4 text-body-sm text-text-primary placeholder:text-text-tertiary outline-none transition-[border-color,box-shadow] focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-xs text-danger font-mono">
                    {"Transmission failed. Try emailing us directly at "}{SITE_CONFIG.contact.opsEmail}
                  </p>
                )}

                <Button type="submit" size="lg" loading={status === 'sending'} className="w-full">
                  {status === 'sending' ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </PublicContainer>
    </div>
  );
};

export default ContactPage;