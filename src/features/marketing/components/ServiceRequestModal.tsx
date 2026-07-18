import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Send, Building2, Globe, Phone, User as UserIcon } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
import api from '../../../core/services/api';
import { Dialog, DialogContent } from '../../../shared/components/ui/Dialog';

const SERVICE_REQUEST_MODAL_EVENT = 'qyvora:open-service-request-modal';

export function openServiceRequestModal(packageTier?: string) {
  window.dispatchEvent(new CustomEvent(SERVICE_REQUEST_MODAL_EVENT, { detail: { packageTier } }));
}

const ServiceRequestModalHost: React.FC = () => {
  const { t } = useTranslation();
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
        title={t('services2.requestAssessment')}
        description={packageTier ? t('services2.inquiryFor', { packageTier }) : t('services2.description')}
        maxWidth="max-w-2xl"
      >
        {status === 'sent' ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent-dim border border-accent/30 flex items-center justify-center">
              <IconCheck size={28} className="text-accent" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">{t('services2.requestReceived')}</h3>
            <p className="text-sm text-text-muted">
              {t('services2.requestReceivedDesc')}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary text-xs !py-2 !px-5 mt-2"
            >
              {t('button.close')}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-accent/5 p-4">
              <p className="text-xs text-text-secondary">
                {t('services2.introText')} <strong className="text-accent">{t('services2.bootcampsHighlight')}</strong> {t('services2.introTextEnd')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> {t('services2.fullName')}
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
                    <Send className="w-3 h-3" /> {t('services2.emailAddress')}
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
                    <Building2 className="w-3 h-3" /> {t('services2.businessName')}
                  </label>
                  <input
                    name="businessName"
                    type="text"
                    placeholder="QYVORA Africa"
                    className="w-full bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent hover:border-border/80 outline-none font-mono text-sm transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> {t('services2.phoneNumber')}
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
                  <Globe className="w-3 h-3" /> {t('services2.websiteUrl')}
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
                  {t('services2.optionalNotes')}
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
                  {t('services2.sendError')}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full btn-primary !py-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {status === 'sending'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('services2.transmitting')}</>
                  : <><Send className="w-4 h-4" /> {t('services2.submitRequest')}</>}
              </button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRequestModalHost;
