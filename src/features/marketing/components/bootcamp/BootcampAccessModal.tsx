import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import { BrandWhatsAppIcon } from '@/shared/components/icons';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import {
  BOOTCAMPS,
  BOOTCAMP_WHATSAPP_URLS,
  type Bootcamp,
} from '@/features/marketing/content/bootcampData';

const BOOTCAMP_ACCESS_MODAL_EVENT = 'qyvora:open-bootcamp-access-modal';

/**
 * Opens the bootcamp access dialog for a given programme. Bootcamps that are
 * not open for website enrollment (see `Bootcamp.status`) route here instead of
 * to a registration form, so the public site never implies enrollment that is
 * not taking place.
 */
export function openBootcampAccessModal(bootcampId: Bootcamp['id'] = 'qose') {
  window.dispatchEvent(
    new CustomEvent(BOOTCAMP_ACCESS_MODAL_EVENT, { detail: { bootcampId } }),
  );
}

const BootcampAccessModalHost: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [bootcamp, setBootcamp] = useState<Bootcamp>(BOOTCAMPS.qose);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as { bootcampId?: Bootcamp['id'] } | undefined;
      const next = detail?.bootcampId ? BOOTCAMPS[detail.bootcampId] : undefined;
      if (next) setBootcamp(next);
      setOpen(true);
    };
    window.addEventListener(BOOTCAMP_ACCESS_MODAL_EVENT, handleOpen);
    return () => window.removeEventListener(BOOTCAMP_ACCESS_MODAL_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) setBootcamp(BOOTCAMPS.qose);
  }, [open]);

  const whatsappUrl = bootcamp.whatsappUrl || BOOTCAMP_WHATSAPP_URLS.fallback;
  const isOpenForEnrollment = bootcamp.status === 'open';
  const alternateBootcamp = isOpenForEnrollment ? BOOTCAMPS.qose : BOOTCAMPS.hpb;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        title={
          isOpenForEnrollment
            ? `Join the ${bootcamp.acronym} community group`
            : `${bootcamp.acronym} is preparing for launch`
        }
        description={bootcamp.statusNote}
        maxWidth="max-w-lg"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-raised p-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface p-2">
              <img
                src={bootcamp.logo}
                alt={bootcamp.logoAlt}
                width={bootcamp.logoWidth}
                height={bootcamp.logoHeight}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-base font-black uppercase tracking-tight text-text-primary">
                {bootcamp.name}
              </p>
              <Badge
                variant={isOpenForEnrollment ? 'success' : 'warning'}
                size="sm"
                className="mt-2"
              >
                {isOpenForEnrollment ? (
                  <CheckCircle2 className="mr-1.5 h-3 w-3" aria-hidden="true" />
                ) : (
                  <Clock className="mr-1.5 h-3 w-3" aria-hidden="true" />
                )}
                {bootcamp.statusLabel}
              </Badge>
            </div>
          </div>

          {isOpenForEnrollment ? (
            <p className="text-sm font-mono leading-[2] text-text-secondary">
              Enrollment for {bootcamp.name} is open. Register on the website to secure your
              place, and join the community group for the schedule, session links and
              announcements.
            </p>
          ) : (
            <>
              <p className="text-sm font-mono leading-[2] text-text-secondary">
                {bootcamp.name} is currently being prepared for launch. Enrollment is not
                open on the website yet, so we are not taking sign-ups here — that would be a
                promise we cannot keep today.
              </p>
              <p className="text-sm font-mono leading-[2] text-text-secondary">
                The fastest way to be in the first cohort is the {bootcamp.acronym} community
                group. You will get the launch announcement, the schedule and the intake window
                as soon as they are confirmed.
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            {isOpenForEnrollment ? (
              <Button to="/register" size="lg" className="w-full">
                Register for {bootcamp.acronym}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button href={whatsappUrl} external size="lg" className="w-full">
                <BrandWhatsAppIcon className="h-4 w-4" />
                Join the {bootcamp.acronym} WhatsApp group
              </Button>
            )}
            <Button href={whatsappUrl} external variant="secondary" size="md" className="w-full">
              <BrandWhatsAppIcon className="h-4 w-4" />
              {isOpenForEnrollment
                ? `Join the ${bootcamp.acronym} community group`
                : `Start with ${alternateBootcamp.acronym} instead`}
            </Button>
          </div>

          <p className="type-meta text-text-muted">
            <MessageCircle className="mr-1.5 inline h-3 w-3 align-text-bottom" aria-hidden="true" />
            Group invite links are configured in{' '}
            <code className="type-code text-text-secondary">bootcampData.ts</code> and can be
            overridden with the{' '}
            <code className="type-code text-text-secondary">
              VITE_{bootcamp.acronym}_WHATSAPP_URL
            </code>{' '}
            build variable.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BootcampAccessModalHost;