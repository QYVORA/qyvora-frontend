import React, { useState } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import api from '@/core/services/api';

type RegStatus = 'idle' | 'sending' | 'sent' | 'error';

interface QoseRegistrationFormProps {
  /** Bootcamp programme id recorded with the lead, e.g. `qose`. */
  bootcampId: string;
  /** Source slug recorded with the lead so the dashboard can trace it. */
  source: string;
  /** Copy shown on the submit button. */
  submitLabel?: string;
}

const fieldLabel =
  'type-label block uppercase tracking-[0.12em] text-text-tertiary';

/**
 * QOSE pre-registration form (EX-BC-011).
 *
 * Captures a lead — name, contact and source — for a bootcamp cohort and posts
 * it to `/public/bootcamp-registration`. This registers *interest*: it does not
 * reserve a seat or take payment (see EX-BC-007/EX-BC-008). A hidden honeypot
 * field (`companyWebsite`) matches the backend's bot filter.
 */
const QoseRegistrationForm: React.FC<QoseRegistrationFormProps> = ({
  bootcampId,
  source,
  submitLabel = 'Register interest',
}) => {
  const [status, setStatus] = useState<RegStatus>('idle');
  const idp = `reg-${bootcampId}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const formData = new FormData(event.currentTarget);
    try {
      await api.post('/public/bootcamp-registration', {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        notes: formData.get('notes'),
        bootcampId,
        source,
        companyWebsite: formData.get('companyWebsite'),
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-3 rounded-2xl border border-accent/20 bg-accent/5 p-6"
      >
        <CheckCircle2 className="h-6 w-6 text-accent" aria-hidden="true" />
        <p className="type-body-sm text-text-primary">
          You are on the list. We will contact you with the next intake and schedule.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${idp}-name`} className={fieldLabel}>
            {'Full name'}
          </label>
          <Input id={`${idp}-name`} name="name" required autoComplete="name" placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${idp}-email`} className={fieldLabel}>
            {'Email'}
          </label>
          <Input
            id={`${idp}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${idp}-phone`} className={fieldLabel}>
            {'Phone / WhatsApp (optional)'}
          </label>
          <Input id={`${idp}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="+233 …" />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${idp}-notes`} className={fieldLabel}>
            {'Anything we should know? (optional)'}
          </label>
          <Input id={`${idp}-notes`} name="notes" placeholder="Prior experience, questions…" />
        </div>
      </div>

      {/* Honeypot — hidden from humans, filled by bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={`${idp}-companyWebsite`}>Company website</label>
        <input
          id={`${idp}-companyWebsite`}
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === 'error' && (
        <p className="flex items-center gap-2 type-body-sm text-semantic-danger" role="alert">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          Something went wrong. Please try again, or join the community group.
        </p>
      )}

      <Button type="submit" size="lg" loading={status === 'sending'} className="w-full sm:w-auto">
        {submitLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>

      <p className="type-meta text-text-muted">
        Pre-registration records your interest only — it does not reserve a seat or take
        payment. We will confirm the intake before any fee.
      </p>
    </form>
  );
};

export default QoseRegistrationForm;
