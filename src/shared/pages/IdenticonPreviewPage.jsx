import { useMemo, useState } from 'react'
import { Avatar, Button, Card } from '@/shared/components/ui'

const SAMPLE_SEEDS = ['root', 'anonymous', 'wsuits6', 'operator', 'offsec']

export default function IdenticonPreviewPage() {
  const [seed, setSeed] = useState('root')
  const seeds = useMemo(() => {
    const set = new Set([seed, ...SAMPLE_SEEDS])
    return Array.from(set)
  }, [seed])

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14">
      <div className="mb-10 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--text-muted)]">Hacker Mask Identicons</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)]">Avatar Seed Preview</h1>
        <p className="mt-2 text-sm md:text-base text-[var(--text-secondary)]">
          Deterministic hacker mask avatars. Change the seed to preview a specific operator identity.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.6fr]">
        <Card className="flex flex-col gap-6">
          <div>
            <label className="label">Seed</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="input-field flex-1"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Enter a username or identifier..."
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => setSeed('anonymous')}
              >
                Reset
              </Button>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)] font-mono">Same seed = same avatar, everywhere.</p>
          </div>

          <div className="flex items-center gap-5">
            <Avatar username={seed || 'anonymous'} size="xl" seed={seed || 'anonymous'} />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Current Seed</p>
              <p className="font-mono text-lg text-[var(--text-primary)]">{seed || 'anonymous'}</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-4">Sample Seeds</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {seeds.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSeed(item)}
                className="group flex items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-3 hover:border-accent/40 hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <Avatar username={item} size="sm" seed={item} />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-mono text-[var(--text-secondary)] truncate">{item}</p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)]">seed</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
