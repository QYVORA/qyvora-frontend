import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Mail, Send } from 'lucide-react';
import api from '../../../core/services/api';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';
import { cn } from '../../../shared/utils/cn';
import { SITE_CONFIG } from '../content/siteConfig';

const CONTACT_MODAL_EVENT = 'hsociety:open-contact-modal';

export function openContactModal() {
  window.dispatchEvent(new Event(CONTACT_MODAL_EVENT));
}

type ContactTriggerProps = {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  isActive?: boolean;
  onOpen?: () => void;
  type?: 'button' | 'link';
};

export const ContactTrigger: React.FC<ContactTriggerProps> = ({
  children,
  className,
  activeClassName,
  isActive = false,
  onOpen,
  type = 'button',
}) => {
  const handleOpen = () => {
    onOpen?.();
    openContactModal();
  };

  if (type === 'link') {
    return (
      <a
        href="/contact"
        onClick={(event) => {
          event.preventDefault();
          handleOpen();
        }}
        className={cn(className, isActive && activeClassName)}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={cn(className, isActive && activeClassName)}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </button>
  );
};

const ContactModalHost: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(CONTACT_MODAL_EVENT, handleOpen);
    return () => window.removeEventListener(CONTACT_MODAL_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) setStatus('idle');
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const formData = new FormData(event.currentTarget);
      await api.post('/public/contact', {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        title={SITE_CONFIG.contactPage.formTitle}
        description={SITE_CONFIG.contactPage.heroSubtitle}
        maxWidth="max-w-2xl"
        className="max-h-[calc(100svh-2rem)] overflow-y-auto"
      >
        {status === 'sent' ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-dim border border-accent/30 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">{SITE_CONFIG.contactPage.sentTitle}</h3>
            <p className="text-sm text-text-muted">
              We'll respond to your operator email {SITE_CONFIG.contact.responseTime}.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="btn-secondary text-xs !py-2 !px-5 mt-2"
            >
              {SITE_CONFIG.contactPage.sentButtonLabel}
            </button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-border bg-bg/70 p-5 md:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-dim text-accent">
                  <Mail className="h-5 w-5 md:h-4 md:w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-text-primary">
                    {SITE_CONFIG.contactPage.emailHeading}
                  </p>
                  <a
                    href={`mailto:${SITE_CONFIG.contact.opsEmail}`}
                    className="mt-1 block break-all font-mono text-base md:text-sm font-bold text-accent hover:underline"
                  >
                    {SITE_CONFIG.contact.opsEmail}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { name: 'name', label: SITE_CONFIG.contactPage.labels.name, type: 'text', placeholder: SITE_CONFIG.contactPage.placeholders.name },
                { name: 'email', label: SITE_CONFIG.contactPage.labels.email, type: 'email', placeholder: SITE_CONFIG.contactPage.placeholders.email },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</label>
                  <input
                    name={name}
                    type={type}
                    required
                    placeholder={placeholder}
                    className="w-full bg-bg border border-border rounded-xl py-3.5 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                {SITE_CONFIG.contactPage.labels.subject}
              </label>
              <select
                name="subject"
                className="w-full bg-bg border border-border rounded-xl py-3.5 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm appearance-none cursor-pointer transition-colors"
              >
                <option value="">{SITE_CONFIG.contactPage.selectSubjectPlaceholder}</option>
                {SITE_CONFIG.contactSubjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>{subject.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                {SITE_CONFIG.contactPage.labels.message}
              </label>
              <textarea
                name="message"
                rows={5}
                required
                placeholder={SITE_CONFIG.contactPage.placeholders.message}
                className="w-full bg-bg border border-border rounded-xl py-3.5 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm resize-none transition-colors"
              />
            </div>

            {status === 'error' && (
              <p className="text-xs text-red-400 font-mono">
                {SITE_CONFIG.contactPage.errorPrefix} {SITE_CONFIG.contact.opsEmail}
              </p>
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
      </DialogContent>
    </Dialog>
  );
};

export default ContactModalHost;
