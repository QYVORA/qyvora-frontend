import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Mail, Send, User, Briefcase, MessageSquare, AlertCircle } from 'lucide-react';
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

type ContactType = 'student' | 'business';

const ContactModalHost: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [contactType, setContactType] = useState<ContactType>('student');

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(CONTACT_MODAL_EVENT, handleOpen);
    return () => window.removeEventListener(CONTACT_MODAL_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      setStatus('idle');
      setContactType('student');
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const formData = new FormData(event.currentTarget);
      await api.post('/public/contact', {
        email: formData.get('email'),
        message: formData.get('message'),
        contactType,
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        title="Get in Touch"
        description="We're here to help. Choose your contact type below."
        maxWidth="max-w-2xl"
        className="max-h-[calc(100svh-2rem)] overflow-y-auto"
      >
        {status === 'sent' ? (
          <div className="flex flex-col items-center justify-center py-12 gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-black text-text-primary uppercase tracking-wide">Message Sent!</h3>
            <p className="text-sm text-text-muted max-w-md leading-relaxed">
              Thank you for reaching out. We'll get back to you within 24-48 hours.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="bg-accent text-bg font-bold uppercase tracking-[0.08em] rounded-xl px-8 py-3 transition-all hover:brightness-110 active:scale-95 hover:shadow-[0_0_20px_var(--color-accent-glow)] text-sm mt-2"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Contact Type Toggle */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] block">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setContactType('student')}
                  className={cn(
                    'relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300',
                    contactType === 'student'
                      ? 'border-accent bg-accent/5 shadow-[0_0_20px_var(--color-accent-glow)]'
                      : 'border-border bg-bg-card hover:border-accent/40'
                  )}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                    contactType === 'student' ? 'bg-accent/20 text-accent' : 'bg-bg text-text-muted'
                  )}>
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      'text-sm font-black uppercase tracking-wide transition-colors',
                      contactType === 'student' ? 'text-accent' : 'text-text-primary'
                    )}>
                      Student
                    </p>
                    <p className="text-[10px] text-text-muted mt-1">
                      Training support
                    </p>
                  </div>
                  {contactType === 'student' && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent animate-pulse" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setContactType('business')}
                  className={cn(
                    'relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300',
                    contactType === 'business'
                      ? 'border-accent bg-accent/5 shadow-[0_0_20px_var(--color-accent-glow)]'
                      : 'border-border bg-bg-card hover:border-accent/40'
                  )}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                    contactType === 'business' ? 'bg-accent/20 text-accent' : 'bg-bg text-text-muted'
                  )}>
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      'text-sm font-black uppercase tracking-wide transition-colors',
                      contactType === 'business' ? 'text-accent' : 'text-text-primary'
                    )}>
                      Business
                    </p>
                    <p className="text-[10px] text-text-muted mt-1">
                      Security services
                    </p>
                  </div>
                  {contactType === 'business' && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-accent/5 border border-accent/20">
              <MessageSquare className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-primary">
                  {contactType === 'student' ? 'Student Support' : 'Business Inquiry'}
                </p>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {contactType === 'student' 
                    ? 'Get help with bootcamps, challenges, account issues, or general questions about the platform.'
                    : 'Inquire about penetration testing, security audits, vulnerability assessments, or custom security solutions.'}
                </p>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Your Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="your.email@example.com"
                className="w-full bg-bg border-2 border-border rounded-2xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-accent/40 outline-none font-mono text-sm transition-all"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                Message
              </label>
              <textarea
                name="message"
                rows={6}
                required
                placeholder={contactType === 'student' 
                  ? "Describe your question or issue. Include any relevant details like bootcamp name, challenge ID, or error messages..."
                  : "Tell us about your security needs. Include information about your organization, services you're interested in, and any specific requirements..."}
                className="w-full bg-bg border-2 border-border rounded-2xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-accent/40 outline-none font-mono text-sm resize-none transition-all"
              />
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/30">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400 font-mono">
                  Failed to send message. Please try again or email us directly at {SITE_CONFIG.contact.opsEmail}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-accent text-bg font-bold uppercase tracking-[0.1em] rounded-2xl px-8 py-4 transition-all hover:brightness-110 active:scale-[0.98] hover:shadow-[0_0_24px_var(--color-accent-glow)] flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>

            {/* Direct Email Link */}
            <div className="pt-4 border-t border-border/50 flex items-center justify-center gap-2">
              <p className="text-[10px] text-text-muted">
                Prefer email?
              </p>
              <a
                href={`mailto:${SITE_CONFIG.contact.opsEmail}`}
                className="text-[10px] font-bold text-accent hover:underline decoration-accent/30 underline-offset-2 transition-all"
              >
                {SITE_CONFIG.contact.opsEmail}
              </a>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactModalHost;
