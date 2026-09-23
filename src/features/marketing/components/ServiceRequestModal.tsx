import React, { useEffect, useState } from 'react';
import { Send, Building2, Globe, Phone, User as UserIcon } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import api from '../../../core/services/api';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';

const SERVICE_REQUEST_MODAL_EVENT = 'qyvora:open-service-request-modal';

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
        title={"Request Assessment"}
        description={packageTier ? `Inquiry for ${packageTier}` : "Describe your needs and we'll get back to you."}
        maxWidth="max-w-2xl"
      >
        {status === 'sent' ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-dim border border-accent/30 flex items-center justify-center">
              <IconCheck size={28} className="text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">{"Request Received"}</h3>
            <p className="text-sm text-text-muted">
              {"Your request has been received. We'll contact you shortly."}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary text-xs !py-2 !px-5 mt-2"
            >
              {"Close"}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-accent/5 p-4">
              <p className="text-xs text-text-secondary">
                {"We offer comprehensive cybersecurity services including "} <strong className="text-accent">{"bootcamps, training, "}</strong> {"and consulting."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="sr-name" className="type-label block uppercase tracking-[0.12em] text-text-tertiary">
                    {"Full Name"}
                  </label>
                  <Input
                    id="sr-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Alhassan Boateng"
                    icon={<UserIcon className="h-4 w-4" aria-hidden="true" />}
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label htmlFor="sr-email" className="type-label block uppercase tracking-[0.12em] text-text-tertiary">
                    {"Email Address"}
                  </label>
                  <Input
                    id="sr-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="operations@yourcompany.africa"
                    icon={<Send className="h-4 w-4" aria-hidden="true" />}
                  />
                </div>

                {/* Business Name */}
                <div className="space-y-2">
                  <label htmlFor="sr-business" className="type-label block uppercase tracking-[0.12em] text-text-tertiary">
                    {"Business Name"}
                  </label>
                  <Input
                    id="sr-business"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    placeholder="QYVORA Africa"
                    icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="sr-phone" className="type-label block uppercase tracking-[0.12em] text-text-tertiary">
                    {"Phone Number"}
                  </label>
                  <Input
                    id="sr-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+233 00 000 0000"
                    icon={<Phone className="h-4 w-4" aria-hidden="true" />}
                  />
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <label htmlFor="sr-website" className="type-label block uppercase tracking-[0.12em] text-text-tertiary">
                  {"Website URL"}
                </label>
                <Input
                  id="sr-website"
                  name="websiteUrl"
                  type="url"
                  inputMode="url"
                  placeholder="https://your-application.com"
                  icon={<Globe className="h-4 w-4" aria-hidden="true" />}
                />
              </div>

              {/* Message / Notes */}
              <div className="space-y-2">
                <label htmlFor="sr-message" className="type-label block uppercase tracking-[0.12em] text-text-tertiary">
                  {"Optional Notes / Message"}
                </label>
                <textarea
                  id="sr-message"
                  name="message"
                  rows={4}
                  placeholder="Describe your project scope, timeline, or any specific security concerns..."
                  className="w-full min-h-[44px] bg-surface border border-border-subtle rounded-lg py-3 px-4 text-body-sm text-text-primary placeholder:text-text-tertiary outline-none transition-[border-color,box-shadow] focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-danger font-mono">
                  {"Failed to send request. Please try again."}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                loading={status === 'sending'}
                className="w-full"
              >
                {status === 'sending'
                  ? "Transmitting..."
                  : <><Send className="h-4 w-4" /> {"Submit Request"}</>}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestModalHost;
