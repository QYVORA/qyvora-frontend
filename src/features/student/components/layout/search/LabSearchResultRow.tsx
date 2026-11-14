import { CornerDownLeft, FlaskConical } from 'lucide-react';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import LabBadge from '@/shared/components/LabBadge';
import { DifficultyBadge } from '@/shared/components/learning/LearningCard';
import { getLabBadgeAsset } from '@/shared/learning/labBadges';
import { LAB_FORMAT_LABELS, type UnifiedLab } from '@/features/student/data/labs';
import { cn } from '@/shared/utils/cn';

interface LabSearchResultRowProps {
  lab: UnifiedLab;
  id: string;
  active: boolean;
  onSelect: (lab: UnifiedLab) => void;
  onActive: () => void;
}

const PHASE_VARIANTS = new Set<HpbVariant>(['phase1', 'phase2', 'phase3', 'phase4', 'phase5']);

const getPhaseVariant = (phaseId?: string): HpbVariant | undefined =>
  phaseId && PHASE_VARIANTS.has(phaseId as HpbVariant) ? (phaseId as HpbVariant) : undefined;

const LabVisual = ({ lab }: { lab: UnifiedLab }) => {
  if (getLabBadgeAsset(lab.id)) {
    return (
      <LabBadge
        labId={lab.id}
        accentColor={lab.accentColor}
        className="h-10 w-10"
        glow={false}
      />
    );
  }

  const phaseVariant = getPhaseVariant(lab.phaseId);
  if (phaseVariant) {
    return <HpbAvatar variant={phaseVariant} className="h-10 w-10" />;
  }

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
      <FlaskConical className="h-5 w-5" aria-hidden="true" />
    </span>
  );
};

/**
 * A single Lab result shared by the inline topbar search and the mobile
 * search dialog. Real badge artwork is used whenever the Lab owns one;
 * bootcamp rooms fall back to their phase avatar.
 */
const LabSearchResultRow = ({
  lab,
  id,
  active,
  onSelect,
  onActive,
}: LabSearchResultRowProps) => {
  const context =
    lab.source === 'bootcamp' ? lab.phaseTitle : lab.tags.find((tag) => tag !== 'hands-on');

  return (
    <button
      type="button"
      role="option"
      id={id}
      aria-selected={active}
      onClick={() => onSelect(lab)}
      onMouseEnter={onActive}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 text-left',
        'transition-colors duration-[var(--dur-fast)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        active ? 'border-accent/40 bg-accent/10' : 'hover:bg-surface-raised',
      )}
    >
      <span className="shrink-0" aria-hidden="true">
        <LabVisual lab={lab} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-text-primary">{lab.title}</span>
          {lab.isNew && (
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-accent">
              New
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-xs text-text-muted">{lab.description}</span>
        <span className="mt-1 flex flex-wrap items-center gap-1.5">
          {lab.difficulty && <DifficultyBadge difficulty={lab.difficulty} />}
          <span className="text-[11px] text-text-tertiary">
            {context ?? LAB_FORMAT_LABELS[lab.format]}
          </span>
          {lab.estimatedMinutes ? (
            <span className="text-[11px] text-text-tertiary">· {lab.estimatedMinutes} min</span>
          ) : null}
        </span>
      </span>

      <CornerDownLeft
        className={cn(
          'h-4 w-4 shrink-0 text-accent transition-opacity',
          active ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden="true"
      />
    </button>
  );
};

export default LabSearchResultRow;
