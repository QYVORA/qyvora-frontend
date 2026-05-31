import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Send, Building2, Globe, Phone, User as UserIcon, Shield } from 'lucide-react';
import api from '../../../core/services/api';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';
import { cn } from '../../../shared/utils/cn';

const SERVICE_REQUEST_MODAL_EVENT = 'hsociety:open-service-request-modal';

export function openServiceRequestModal(packageTier?: string) {
  window.dispatchEvent(new CustomEvent(SERVICE_REQUEST_MODAL_EVENT, { detail: { packageTier } }));
}

const ServiceRequestModalHost: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [packageTier, setPackageTier] = useState<string | undefined>();

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setPackageTier(detail?.packageTier);
      setOpen(true);
    };
    window.addEventListener(SERVICE_REQUEST_MODAL_EVENT, handleOpen);
    return () => window.removeEventListener(SERVICE_REQUEST_MODAL_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      setStatus('idle');
      setPackageTier(undefined);
    }
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const formData = new FormData(event.currentTarget);
      await api.post('/public/service-request', {
        name: formData.get('name'),
        email: formData.get('email'),
        businessName: formData.get('businessName'),
        phone: formData.get('phone'),
        websiteUrl: formData.get('websiteUrl'),
        message: formData.get('message'),
        packageTier: packageTier || 'Standard Inquiry',
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        title="Request Assessment"
        description={packageTier ? `Inquiry for ${packageTier}` : "Tell us about your project requirements and we'll get back to you with a tailored proposal."}
        maxWidth="max-w-4xl"
      >
        {status === 'sent' ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-dim border border-accent/30 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Request Received</h3>
            <p className="text-sm text-text-muted">
              Thank you for your interest. A security consultant will review your request and contact you within 24-48 hours.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary text-xs !py-2 !px-5 mt-2"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column: Branding / Value Prop (2/5 on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="h-full rounded-2xl border border-border bg-bg/40 p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Deployment Scope</p>
                    <h4 className="text-xl font-bold text-text-primary leading-tight">Tailored Offensive Security Solutions</h4>
                  </div>
                  
                  <ul className="space-y-4">
                    {[
                      { icon: Shield, text: 'Comprehensive Vulnerability Analysis' },
                      { icon: Globe, text: 'Cross-Border Infrastructure Testing' },
                      { icon: Building2, text: 'Enterprise-Grade Security Reporting' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
                        <item.icon className="h-4 w-4 text-accent/60" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-border mt-8">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Global Operations Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form (3/5 on desktop) */}
            <form className="lg:col-span-3 space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Alhassan Boateng"
                    className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Send className="w-3 h-3" /> Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="operations@yourcompany.africa"
                    className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                  />
                </div>

                {/* Business Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="w-3 h-3" /> Business Name
                  </label>
                  <input
                    name="businessName"
                    type="text"
                    placeholder="HSOCIETY Africa"
                    className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+233 00 000 0000"
                    className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Website URL
                </label>
                <input
                  name="websiteUrl"
                  type="url"
                  placeholder="https://your-application.com"
                  className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                />
              </div>

              {/* Message / Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Optional Notes / Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Describe your project scope, timeline, or any specific security concerns..."
                  className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm resize-none transition-colors"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-400 font-mono">
                  Failed to send request. Please try again or email us directly at ops@hsociety.com
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {status === 'sending'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</>
                  : <><Send className="w-4 h-4" /> Submit Request</>}
              </button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestModalHost;
