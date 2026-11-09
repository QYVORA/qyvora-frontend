import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { BookOpen, Terminal } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PageBody from '@/shared/components/layout/PageBody';
import Button from '@/shared/components/ui/Button';
import FilterTabs from '@/shared/components/ui/FilterTabs';
import { LearningCatalogue } from '@/shared/components/learning';
import LearningCard from '@/shared/components/learning/LearningCard';
import type { LearningCatalogueItem } from '@/shared/components/learning';
import { UNIFIED_LABS, LAB_FORMAT_LABELS } from '@/features/student/data/labs';
import { getContentLabProgress } from '@/features/student/utils/savedLabs';
import type { LabFormat, UnifiedLab } from '@/features/student/data/labs';
import LabCard from './LabCard';

type FormatFilter = 'all' | LabFormat;

const FORMAT_ICONS: Record<LabFormat, ReactNode> = {
  content: <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />,
  'hands-on': <Terminal className="h-3.5 w-3.5" aria-hidden="true" />,
  hybrid: <Terminal className="h-3.5 w-3.5" aria-hidden="true" />,
};

/**
 * Unified Labs discovery.
 *
 * Content Labs and hands-on Labs share one catalogue and one card surface so a
 * learner never has to know which internal system owns a Lab. Format is a
 * filter, not a separate destination. Each Lab still links to its existing
 * route; nothing about the Lab experiences themselves changed.
 */
const LabsPage = () => {
  const [format, setFormat] = useState<FormatFilter>('all');

  const visibleLabs = useMemo(
    () => (format === 'all' ? UNIFIED_LABS : UNIFIED_LABS.filter((lab) => lab.format === format)),
    [format],
  );

  const items: LearningCatalogueItem[] = useMemo(
    () =>
      visibleLabs.map((lab: UnifiedLab) => {
        const progress =
          lab.format === 'content' ? getContentLabProgress(lab.id, lab.lessonsCount ?? 0) : undefined;
        const isHandsOn = lab.format !== 'content';

        return {
          key: lab.id,
          id: lab.id,
          type: isHandsOn ? 'lab' : 'course',
          to: lab.route,
          accentColor: lab.accentColor,
          difficulty: lab.difficulty,
          cpReward: lab.cpReward,
          title: lab.title,
          description: lab.description,
          lessonsCount: lab.lessonsCount,
          tags: [LAB_FORMAT_LABELS[lab.format], ...(lab.isNew ? ['New'] : [])],
          actionLabel: isHandsOn ? 'Launch' : 'Open Lab',
          progress: progress && progress > 0 ? progress : undefined,
          icon: isHandsOn ? undefined : <BookOpen className="h-6 w-6" aria-hidden="true" />,
        } satisfies LearningCatalogueItem;
      }),
    [visibleLabs],
  );

  const contentCount = UNIFIED_LABS.filter((lab) => lab.format === 'content').length;
  const handsOnCount = UNIFIED_LABS.length - contentCount;
  const totalCpMin = UNIFIED_LABS.reduce(
    (sum, lab) => sum + parseInt(String(lab.cpReward).split('-')[0], 10) || 0,
    0,
  );
  const totalCpMax = UNIFIED_LABS.reduce(
    (sum, lab) => sum + (parseInt(String(lab.cpReward).split('-').pop() ?? '0', 10) || 0),
    0,
  );

  const tabs = [
    { key: 'all', label: 'All Labs', count: UNIFIED_LABS.length },
    { key: 'content', label: LAB_FORMAT_LABELS.content, icon: FORMAT_ICONS.content, count: contentCount },
    { key: 'hands-on', label: LAB_FORMAT_LABELS['hands-on'], icon: FORMAT_ICONS['hands-on'], count: handsOnCount },
  ];

  return (
    <div className="min-h-full bg-canvas">
      <SEO
        title={'Labs'}
        description={'One Lab library: guided content Labs and hands-on offensive security simulations on QYVORA.'}
        noindex
      />
      <PageBody spacing="sections">
        <PageHeader
          kicker={'QYVORA · Learning'}
          title={'Labs'}
          description={
            'One library for every learning experience. Work through guided content Labs, then apply the same skills in hands-on attack simulations.'
          }
          metadata={
            <span className="type-meta inline-flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-bold text-accent">{UNIFIED_LABS.length}</span> Labs ·{' '}
              <span className="font-bold text-text-primary">{contentCount}</span> content ·{' '}
              <span className="font-bold text-text-primary">{handsOnCount}</span> hands-on ·{' '}
              <span className="font-bold text-text-primary">{totalCpMin}-{totalCpMax}</span> CP range
            </span>
          }
          actions={
            <Button to={UNIFIED_LABS[0]?.route || '/dashboard/labs'}>
              Start First Lab
            </Button>
          }
        />

        <div className="mt-6">
          <FilterTabs
            tabs={tabs}
            activeKey={format}
            onChange={(key) => setFormat(key as FormatFilter)}
          />
        </div>

        <LearningCatalogue
          items={items}
          gridClassName="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
          showSearch
          searchPlaceholder={'Search Labs…'}
          filterLabel={(id) => (id === 'all' ? 'All levels' : id.charAt(0).toUpperCase() + id.slice(1))}
          renderItem={(item) =>
            item.type === 'lab' ? (
              <LabCard
                id={item.id!}
                title={item.title}
                description={item.description ?? ''}
                difficulty={item.difficulty ?? 'beginner'}
                cpReward={String(item.cpReward ?? '')}
                route={item.to ?? ''}
                accentColor={item.accentColor ?? ''}
                tags={item.tags}
              />
            ) : (
              <LearningCard {...item} />
            )
          }
          emptyTitle={'No Labs found'}
          emptyDescription={'Try adjusting your search or filter criteria.'}
        />
      </PageBody>
    </div>
  );
};

export default LabsPage;
