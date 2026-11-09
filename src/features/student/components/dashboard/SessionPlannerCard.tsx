import { FormEvent, useCallback, useEffect, useState } from 'react';
import { CalendarClock, Trash2 } from 'lucide-react';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { CardBase as Card } from '@/shared/components/ui/Card';
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
  const [error, setError] = useState('');

  const loadPlans = useCallback(async () => {
    try {
      const response = await api.get<{ items: SessionPlan[] }>('/student/session-plans');
      setPlans(response.data.items || []);
      setError('');
    } catch {
      setError('Could not load your planned sessions.');
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

  return (
    <Card className="p-5 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="type-h2 text-text-primary">
          Next study sessions
        </h2>
      </div>

      <form className="space-y-3" onSubmit={(event) => void createPlan(event)}>
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

      {error && <p className="mt-3 type-body-sm text-semantic-danger" role="status">{error}</p>}
      <div className="mt-4 space-y-3 border-t border-border-subtle pt-4" aria-live="polite">
        {plans.slice(0, 3).map((plan) => (
          <div key={plan._id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate type-body-sm font-bold text-text-primary">{plan.title}</p>
              <p className="type-meta">
                {new Date(plan.startsAt).toLocaleString()} · {plan.durationMinutes} min
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              ariaLabel="Remove session"
              onClick={() => void removePlan(plan._id)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ))}
        {!error && plans.length === 0 && (
          <p className="type-body-sm text-text-muted">
            Plan a focused block for your next Lab.
          </p>
        )}
      </div>
    </Card>
  );
};

export default SessionPlannerCard;
