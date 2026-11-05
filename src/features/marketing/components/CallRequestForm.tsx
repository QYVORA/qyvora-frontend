import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import api from '@/core/services/api';

type CallStatus = 'idle' | 'sending' | 'sent' | 'error';

const labelClass =
  'type-label block uppercase tracking-[0.12em] text-text-tertiary';

const CALL_TOPICS = [
  'QOSE enrollment',
  'Hacker Protocol Bootcamp',
  'Security assessment',
  'Employee cybersecurity training',
  'Partnership',
  'Something else',
] as const;

/**
 * Request-a-call form. The public contact endpoint has no appointment model, so
 * the request is sent as a normal contact message with the preferred slot in the
 * body. The desk confirms the actual time.
 */
const CallRequestForm: React.FC = () => {
  const [status, setStatus] = useState<CallStatus>('idle');
  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    const formData = new FormData(event.currentTarget);
    const preferredDate = String(formData.get('preferredDate') || '').trim();
    const preferredTime = String(formData.get('preferredTime') || '').trim();
    const timezone = String(formData.get('timezone') || '').trim();
    const organization = String(formData.get('organization') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const topic = String(formData.get('topic') || 'Something else');
    const notes = String(formData.get('notes') || '').trim();

    const message = [
      `Topic: ${topic}`,
      `Organization: ${organization || '—'}`,
      `Phone / WhatsApp: ${phone || '—'}`,
      `Preferred date: ${preferredDate || 'No preference'}`,
      `Preferred time: ${preferredTime || 'No preference'}${timezone ? ` (${timezone})` : ''}`,
      '',
      notes || 'No additional notes.',
    ].join('\n');

    try {
      await api.post('/public/contact', {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: `[Website] Call request — ${topic}`,
        message,
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="flex flex-col items-start gap-3 py-6">
        <CheckCircle2 className="h-6 w-6 text-accent" aria-hidden="true" />
        <p className="type-body-sm text-text-primary">
          Your call request is in. The operations desk will confirm a time by email.
        </p>
        <Button type="button" variant="secondary" onClick={() => setStatus('idle')}>
          Request another call
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="call-name" className={labelClass}>
            {'Name'}
          </label>
          <Input id="call-name" name="name" required autoComplete="name" placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="call-email" className={labelClass}>
            {'Email'}
          </label>
          <Input
            id="call-email"
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
          <label htmlFor="call-organization" className={labelClass}>
            {'Organization (optional)'}
          </label>
          <Input
            id="call-organization"
            name="organization"
            autoComplete="organization"
            placeholder="Company or school"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="call-phone" className={labelClass}>
            {'Phone / WhatsApp (optional)'}
          </label>
          <Input
            id="call-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+233 …"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="call-topic" className={labelClass}>
          {'What would you like to discuss?'}
        </label>
        <select
          id="call-topic"
          name="topic"
          required
          defaultValue={CALL_TOPICS[0]}
          className="w-full min-h-[44px] rounded-lg border border-border-subtle bg-surface px-4 py-2.5 text-body-sm text-text-primary outline-none transition-[border-color,box-shadow] focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {CALL_TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="call-date" className={labelClass}>
            {'Preferred date'}
          </label>
          <Input id="call-date" name="preferredDate" type="date" min={today} />
        </div>
        <div className="space-y-2">
          <label htmlFor="call-time" className={labelClass}>
            {'Preferred time'}
          </label>
          <Input id="call-time" name="preferredTime" type="time" />
        </div>
        <div className="space-y-2">
          <label htmlFor="call-timezone" className={labelClass}>
            {'Timezone'}
          </label>
          <Input
            id="call-timezone"
            name="timezone"
            placeholder="GMT / Africa/Accra"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="call-notes" className={labelClass}>
          {'Anything we should prepare for? (optional)'}
        </label>
        <textarea
          id="call-notes"
          name="notes"
          rows={4}
          placeholder="Scope, questions or context for the call"
          className="w-full min-h-[44px] resize-none rounded-lg border border-border-subtle bg-surface px-4 py-3 text-body-sm text-text-primary outline-none transition-[border-color,box-shadow] placeholder:text-text-tertiary focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      {status === 'error' && (
        <p className="flex items-center gap-2 type-body-sm text-semantic-danger" role="alert">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          Something went wrong. Please try again, or email the operations desk directly.
        </p>
      )}

      <Button type="submit" size="lg" loading={status === 'sending'} className="w-full sm:w-auto">
        Request a call
      </Button>

      <p className="type-meta text-text-muted">
        This sends a request, not a confirmed booking. The desk will reply by email to agree
        a time.
      </p>
    </form>
  );
};

export default CallRequestForm;
