import { FormEvent, useCallback, useEffect, useState } from 'react';
import { CalendarClock, Trash2 } from 'lucide-react';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { Card } from '@/shared/components/ui';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';

interface SessionPlan {
  _id: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
  labId: string;
}

const defaultStartTime = () => {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(0, 0, 0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

const SessionPlannerCard = () => {
  const { addToast } = useToast();
  const [plans, setPlans] = useState<SessionPlan[]>([]);
  const [title, setTitle] = useState('');
  const [startsAt, setStartsAt] = useState(defaultStartTime);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState('');

  const loadPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const response = await api.get<{ items: SessionPlan[] }>('/student/session-plans');
      setPlans(response.data.items || []);
      setError('');
    } catch {
      setError('Could not load your planned sessions.');
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  const createPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post('/student/session-plans', {
        title: title.trim(),
        startsAt: new Date(startsAt).toISOString(),
        durationMinutes,
      });
      setTitle('');
      await loadPlans();
      setFormOpen(false);
      addToast('Study session scheduled.', 'success');
    } catch {
      addToast('Could not schedule this session.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removePlan = async (planId: string) => {
    try {
      await api.delete(`/student/session-plans/${encodeURIComponent(planId)}`);
      setPlans((items) => items.filter((item) => item._id !== planId));
    } catch {
      addToast('Could not remove this session.', 'error');
    }
  };

  const upcomingPlans = plans
    .filter((plan) => new Date(plan.startsAt).getTime() >= Date.now())
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 3);

  return (
    <Card as="section" tone="strip" className="p-[var(--app-card-pad)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center text-accent">
            <CalendarClock className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="type-h2 text-text-primary">Next study sessions</h2>
        </div>
        <Button
          type="button"
          variant={formOpen ? 'secondary' : 'ghost'}
          size="sm"
          aria-expanded={formOpen}
          aria-controls="session-planner-form"
          onClick={() => setFormOpen((open) => !open)}
        >
          {formOpen ? 'Cancel' : 'Plan session'}
        </Button>
      </div>

      {error && (
        <div role="alert" className="mb-3">
          <p className="type-body-sm text-semantic-danger">{error}</p>
          <Button type="button" variant="ghost" size="sm" className="mt-1" onClick={() => void loadPlans()}>
            Retry
          </Button>
        </div>
      )}

      <div className="space-y-3" aria-live="polite">
        {plansLoading ? (
          <p role="status" className="type-body-sm text-text-secondary">Loading planned sessions…</p>
        ) : upcomingPlans.length > 0 ? (
          <ul>
            {upcomingPlans.map((plan) => (
              <li key={plan._id} className="flex items-center justify-between gap-3 border-t border-border-subtle py-3 first:border-t-0 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate type-body-sm font-bold text-text-primary">{plan.title}</p>
                  <p className="type-meta">
                    {new Date(plan.startsAt).toLocaleString()} · {plan.durationMinutes} min
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  ariaLabel={`Remove ${plan.title}`}
                  onClick={() => void removePlan(plan._id)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        ) : !error ? (
          <p className="type-body-sm text-text-muted">No upcoming sessions planned.</p>
        ) : null}
      </div>

      {formOpen && (
        <form
          id="session-planner-form"
          className="mt-4 space-y-3 border-t border-border-subtle pt-4"
          onSubmit={(event) => void createPlan(event)}
        >
          <label className="sr-only" htmlFor="session-plan-title">
            Session title
          </label>
          <Input
            id="session-plan-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Practice network enumeration"
            required
            minLength={2}
            maxLength={120}
          />
          <div className="grid grid-cols-[minmax(0,1fr)_8rem] gap-3">
            <div>
              <label className="type-meta mb-1 block" htmlFor="session-plan-start">
                Start time
              </label>
              <Input
                id="session-plan-start"
                type="datetime-local"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
                required
              />
            </div>
            <div>
              <label className="type-meta mb-1 block" htmlFor="session-plan-duration">
                Minutes
              </label>
              <Input
                id="session-plan-duration"
                type="number"
                min={15}
                max={480}
                step={15}
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(Number(event.target.value))}
                required
              />
            </div>
          </div>
          <Button type="submit" size="sm" loading={loading} className="w-full">
            Schedule session
          </Button>
        </form>
      )}
    </Card>
  );
};

export default SessionPlannerCard;
