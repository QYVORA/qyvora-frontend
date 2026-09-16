import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import { LearningCatalogue } from '@/shared/components/learning';
import type { LearningCatalogueItem } from '@/shared/components/learning';
import { LABS } from '@/features/student/constants/labs';

const LabsPage = () => {
  const { t } = useTranslation();

  const items: LearningCatalogueItem[] = LABS.map((lab) => ({
    key: lab.id,
    id: lab.id,
    type: 'lab',
    to: lab.route,
    accentColor: lab.accentColor,
    title: t(lab.titleKey ?? '', lab.id),
    description: t(lab.descKey ?? '', ''),
    difficulty: lab.difficulty,
    cpReward: lab.cpReward,
    actionLabel: t('labsPage.cardCta', 'Launch'),
  }));

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={t('labsPage.seo.title', 'Attack Labs | QYVORA')}
        description={t(
          'labsPage.seo.description',
          'Hands-on offensive security labs covering privilege escalation, password cracking, SQL injection, OSINT, and the full kill chain.',
        )}
      />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <PageHeader
          kicker={t('labsPage.kicker', 'QYVORA · Practice')}
          title={t('labsPage.title', 'Attack Labs')}
          description={t(
            'labsPage.description',
            'Real-world offensive security labs in a sandboxed environment. Practice privilege escalation, password attacks, SQL injection, OSINT, and full kill-chain operations.',
          )}
          actions={
            <Button to="/register">
              {t('labsPage.cta', 'Start training')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <LearningCatalogue
          className="mt-10"
          items={items}
          showSearch
          searchPlaceholder={t('labsPage.searchPlaceholder', 'Search labs...')}
          emptyTitle={t('labsPage.empty.title', 'No labs match this filter')}
          emptyDescription={t(
            'labsPage.empty.description',
            'Try a different difficulty or check back soon — new labs ship frequently.',
          )}
        />
      </div>
    </div>
  );
};

export default LabsPage;