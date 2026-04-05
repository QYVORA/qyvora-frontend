import { SOCIAL_MEDIA } from '@/features/marketing/data/socialMedia'
import { Card } from '@/shared/components/ui'

export function OnboardingWelcomeCard({ onStart, onSocialClick }) {
  return (
    <Card className="p-6 border border-accent/20 bg-[var(--bg-card)]/80" data-tour="onboarding-welcome">
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-2">// welcome operator</p>
          <h2 className="font-display text-2xl text-[var(--text-primary)] font-semibold">Your command center is ready.</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Step 1 starts at YouTube. Click the highlighted card, complete the follow, and we will advance to the next channel.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SOCIAL_MEDIA.map(({ key, label, handle, url, icon: Icon }) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noreferrer"
              data-tour={`social-${key}`}
              onClick={() => onSocialClick?.(key)}
              className="group flex items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-accent/40 hover:bg-[var(--bg-card-hover)] transition"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-[var(--text-primary)]">{label}</span>
                <span className="block text-xs text-[var(--text-muted)] truncate">{handle}</span>
              </span>
            </a>
          ))}
        </div>
        <div>
          <button type="button" onClick={onStart} className="btn-primary px-5 py-2.5">
            Start walkthrough
          </button>
        </div>
      </div>
    </Card>
  )
}
