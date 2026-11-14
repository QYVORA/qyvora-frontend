import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import api from '@/core/services/api';
import {
  FALLBACK_QOSE_PRICING,
  type PublicQosePlanOption,
} from '@/features/marketing/content/qosePricing';

type RegStatus = 'idle' | 'sending' | 'redirecting' | 'error';
type Plan = 'full' | 'installment';


interface QoseRegistrationFormProps {
  /** Bootcamp programme id recorded with the registration, e.g. `qose`. */
  bootcampId: string;
  /** Source slug recorded with the registration so the dashboard can trace it. */
  source: string;
  /** Copy shown on the submit button. */
  submitLabel?: string;
  /** Server-driven plan amounts; falls back to the canonical QOSE prices. */
  plans?: PublicQosePlanOption[];
}

const fieldLabel =
  'type-label block uppercase tracking-[0.12em] text-text-tertiary';

const getErrorMessage = (err: unknown): string => {
  const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
  return message || 'Could not start the secure checkout. Please try again.';
};

/**
 * Public QOSE registration form.
 *
 * Posts only the applicant fields; the backend derives the amount, creates a
 * pending Payment row and returns a Paystack authorization URL. The browser then
 * redirects to Paystack. Success is never inferred here — the callback page
 * verifies the reference against the backend.
 */
const QoseRegistrationForm: React.FC<QoseRegistrationFormProps> = ({
  bootcampId,
  source,
  submitLabel = 'Continue to secure payment',
  plans,
}) => {
  const [status, setStatus] = useState<RegStatus>('idle');
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<Plan>('full');
  const idp = `reg-${bootcampId}`;
  const planOptions = plans?.length ? plans : FALLBACK_QOSE_PRICING.planOptions;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setError('');
    const formData = new FormData(event.currentTarget);

    try {
      const { data } = await api.post('/qose/register', {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        githubUsername: formData.get('githubUsername'),
        plan,
        bootcampId,
        source,
        companyWebsite: formData.get('companyWebsite'),
      });

      const authorizationUrl = String(data?.authorizationUrl || '');
      if (!/^https:\/\//i.test(authorizationUrl)) {
        throw new Error('The payment provider did not return a valid checkout URL.');
      }

      setStatus('redirecting');
      window.location.assign(authorizationUrl);
    } catch (err) {
      setStatus('error');
      setError(getErrorMessage(err));
    }
  };

  const busy = status === 'sending' || status === 'redirecting';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <fieldset className="space-y-2">
        <legend className={fieldLabel}>Payment plan</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {planOptions.map((option) => {
            const selected = plan === option.id;
            return (
              <label
                key={option.id}
                className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                  selected
                    ? 'border-accent bg-accent/10'
                    : 'border-border-subtle bg-surface-raised hover:border-accent/40'
                } ${busy ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={option.id}
                  checked={selected}
                  onChange={() => setPlan(option.id)}
                  disabled={busy}
                  className="sr-only"
                />
                <span className="flex items-center justify-between gap-2">
                  <span className="type-label uppercase tracking-[0.12em] text-text-tertiary">
                    {option.label}
                  </span>
                  <span className={`h-3 w-3 rounded-full border ${selected ? 'border-accent bg-accent' : 'border-text-tertiary'}`} aria-hidden="true" />
                </span>
                <span className="mt-2 block text-xl font-black tracking-tight text-text-primary">
                  {option.amount}
                </span>
                <span className="mt-1 block type-body-sm text-text-secondary">
                  {option.description}
                </span>
              </label>
            );
          })}
        </div>
        <p className="type-meta text-text-muted">
          Already started a plan? Use the same email and select that plan, or pay
          the next amount from your payment confirmation page.
        </p>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${idp}-name`} className={fieldLabel}>
            Full name
          </label>
          <Input
            id={`${idp}-name`}
            name="fullName"
            required
            autoComplete="name"
            placeholder="Your full name"
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${idp}-email`} className={fieldLabel}>
            Email
          </label>
          <Input
            id={`${idp}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            disabled={busy}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${idp}-phone`} className={fieldLabel}>
            Ghana phone / WhatsApp
          </label>
          <Input
            id={`${idp}-phone`}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="024 123 4567"
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${idp}-github`} className={fieldLabel}>
            GitHub username (optional)
          </label>
          <Input
            id={`${idp}-github`}
            name="githubUsername"
            autoComplete="username"
            placeholder="octocat"
            disabled={busy}
          />
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
        <p className="flex items-start gap-2 type-body-sm text-semantic-danger" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}

      {status === 'redirecting' && (
        <p className="type-body-sm text-text-secondary" role="status">
          Redirecting you to Paystack&apos;s secure checkout…
        </p>
      )}

      <Button type="submit" size="lg" loading={busy} className="w-full sm:w-auto">
        {submitLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>

      <p className="type-meta text-text-muted">
        {"By continuing, you agree to our "}
        <Link
          to="/terms"
          className="font-bold text-text-secondary underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {"Terms of Service"}
        </Link>
        {", "}
        <Link
          to="/privacy"
          className="font-bold text-text-secondary underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {"Privacy Policy"}
        </Link>
        {", and "}
        <Link
          to="/refund-policy"
          className="font-bold text-text-secondary underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {"Refund & Cancellation Policy"}
        </Link>
        {"."}
      </p>

      <p className="flex items-start gap-2 type-meta text-text-muted">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span>
          Payment is processed securely by Paystack. The amount is calculated on
          our server, and your seat is confirmed only after the payment is verified.
          Instalment payers can return from the confirmation page to pay the next amount.
        </span>
      </p>
    </form>
  );
};

export default QoseRegistrationForm;
