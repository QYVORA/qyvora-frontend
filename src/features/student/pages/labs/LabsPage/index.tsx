import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/shared/components/SEO';
import LabCard from './LabCard';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import { LearningCatalogue } from '@/shared/components/learning';
import type { LearningCatalogueItem } from '@/shared/components/learning';
import { LABS } from '@/features/student/constants/labs';

const LabsPage = () => {
  const { t } = useTranslation();

  const items: LearningCatalogueItem[] = useMemo(
    () =>
      LABS.map((lab) => ({
        key: lab.id,
        id: lab.id,
        type: 'lab',
        to: lab.route,
        accentColor: lab.accentColor,
        difficulty: lab.difficulty,
        cpReward: lab.cpReward,
        title: t(`student.labs.list.${lab.id}.title`),
        description: t(`student.labs.list.${lab.id}.description`),
      })),
    [t],
  );

  const totalCpMin = LABS.reduce((sum, lab) => sum + parseInt(lab.cpReward.split('-')[0]), 0);
  const totalCpMax = LABS.reduce((sum, lab) => sum + parseInt(lab.cpReward.split('-')[1]), 0);

  return (
    <div className="min-h-full bg-canvas">
      <SEO title={t('student.labs.seoTitle')} description={t('student.labs.seoDesc')} noindex />
      <div className="w-full space-y-8 px-3 pb-16 pt-6 md:px-4 md:pb-20 md:pt-8 lg:px-6 lg:pb-24">
        <PageHeader
          kicker={t('student.labs.eyebrow', 'QYVORA · Practice')}
          title={t('student.labs.title')}
          description={t('student.labs.description')}
          metadata={
            <span className="type-meta inline-flex items-center gap-2">
              <span className="font-bold text-accent">{LABS.length}</span> {t('stat.labs')} · <span className="font-bold text-text-primary">{totalCpMin}-{totalCpMax}</span> {t('stat.cpRange')}
            </span>
          }
          actions={
            <Button to={LABS[0]?.route || '/dashboard/labs'}>
              {t('button.startFirstLab')}
            </Button>
          }
        />

        <LearningCatalogue
          items={items}
          gridClassName="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"
          showSearch
          searchPlaceholder={t('student.labs.searchPlaceholder')}
          filterLabel={(id) =>
            id === 'all'
              ? t('student.labs.filter.all')
              : id.charAt(0).toUpperCase() + id.slice(1)
          }
          renderItem={(item) => (
            <LabCard
              id={item.id!}
              title={item.title}
              description={item.description ?? ''}
              difficulty={item.difficulty ?? 'beginner'}
              cpReward={String(item.cpReward ?? '')}
              route={item.to ?? ''}
              accentColor={item.accentColor ?? ''}
            />
          )}
          emptyTitle={t('student.labs.empty.title')}
          emptyDescription={t('student.labs.empty.description')}
        />
      </div>
    </div>
  );
};

export default LabsPage;