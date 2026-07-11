import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Mail, Send, MessageSquare, AlertCircle, User } from 'lucide-react';
import api from '../../../core/services/api';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';
import { cn } from '../../../shared/utils/cn';
import { SITE_CONFIG } from '../content/siteConfig';

const CONTACT_MODAL_EVENT = 'qyvora:open-contact-modal';

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        title="CONTACT"
        maxWidth="max-w-xl"
        className="max-h-[calc(100svh-2rem)] overflow-y-auto"
      >
        {status === 'sent' ? (
          <div className="flex flex-col items-center justify-center py-12 gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-black text-text-primary uppercase tracking-wide">Message Sent!</h3>
            <p className="text-sm text-text-muted max-w-md leading-relaxed break-words">
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
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em]">
                Category
              </span>
              <div className="flex bg-bg/50 border border-border p-1 rounded-xl w-full md:w-60">
                <button
                  type="button"
                  onClick={() => setContactType('student')}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
                    contactType === 'student'
                      ? 'bg-accent text-bg shadow-[0_0_12px_var(--color-accent-glow)] font-black'
                      : 'text-text-muted hover:text-text-primary'
                  )}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('business')}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
                    contactType === 'business'
                      ? 'bg-accent text-bg shadow-[0_0_12px_var(--color-accent-glow)] font-black'
                      : 'text-text-muted hover:text-text-primary'
                  )}
                >
                  Business
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] flex items-center gap-2">
                <User className="w-3 h-3" />
                Your Name
              </label>
              <input
                name="name"
                type="text"
                required
                minLength={2}
                placeholder="John Doe"
                className="w-full bg-bg border border-border rounded-xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
              />
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
                className="w-full bg-bg border border-border rounded-xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
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
                className="w-full bg-bg border border-border rounded-xl py-3.5 px-5 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm resize-none transition-colors"
              />
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
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
              className="w-full bg-accent text-bg font-bold uppercase tracking-[0.1em] rounded-xl px-8 py-4 transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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


          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactModalHost;
