import React from 'react';
import PageHeader from '@/shared/components/ui/PageHeader';
import { cn } from '@/shared/utils/cn';

/**
 * ProgrammeHeroCard — the one hero composition every programme page opens with
 * (`/hpb`, `/qose`, `/cp`).
 *
 * Structure is fixed by the mapped-art pattern in `docs/BACKGROUNDS.md`:
 * `relative overflow-hidden` root carrying `data-theme-persist="dark"`, the
 * mapped scene as the decorative first child, and every piece of copy in a
 * `relative` sibling above it. No scrim, no overlay — the art stays full colour
 * and readability comes from the forced-light tokens.
 *
 * The programme mark is an **identity lockup**, not a showcase tile. It sits
 * inline with the kicker and the status chips so the logo reads as part of the
 * heading block, instead of a large logo parked in its own bordered box at the
 * bottom of the card.
 */
export interface ProgrammeHeroCardProps {
  /** Mapped dark scene from `src/assets/backgrounds`. */
  background: string;
  /**
   * Tile-sized programme mark — `BootcampLogo size="sm" accent` for bootcamps,
   * `CpLogo` for the CP coin. Sized by the caller, never by this card.
   */
  mark: React.ReactNode;
  /** Tiny uppercase eyebrow, e.g. `QYVORA · Bootcamp`. */
  kicker: string;
  /** Status chips / meta rendered under the kicker (Badge, mono meta line …). */
  status?: React.ReactNode;
  title: string;
  description: React.ReactNode;
  /** Factual metadata row rendered under the title block. */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** `id` for the `h1` — the card is labelled by it via `aria-labelledby`. */
  headingId: string;
  className?: string;
}

const ProgrammeHeroCard: React.FC<ProgrammeHeroCardProps> = ({
  background,
  mark,
  kicker,
  status,
  title,
  description,
  meta,
  actions,
  headingId,
  className,
}) => (
  <section
    aria-labelledby={headingId}
    data-theme-persist="dark"
    className={cn('relative overflow-hidden rounded-2xl', className)}
  >
    <img
      src={background}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
    />

    <div className="relative px-4 py-10 sm:px-6 md:px-8 md:py-14 lg:flex lg:min-h-[440px] lg:flex-col lg:justify-center">
      <div className="flex flex-col gap-7">
        {/* Identity lockup — mark + kicker + status as one block */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          {mark}
          <div className="flex min-w-0 flex-col gap-2">
            <span className="block text-kicker font-black uppercase tracking-[0.3em] text-accent">
              {kicker}
            </span>
            {status && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">{status}</div>
            )}
          </div>
        </div>

        <PageHeader
          titleId={headingId}
          title={title}
          description={description}
          actions={actions}
          metadata={meta}
        />
      </div>
    </div>
  </section>
);

export default ProgrammeHeroCard;