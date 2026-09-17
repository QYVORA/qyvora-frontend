import { ArrowRight } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import Button from '@/shared/components/ui/Button';
import { LearningCatalogue } from '@/shared/components/learning';
import type { LearningCatalogueItem } from '@/shared/components/learning';
import { LABS } from '@/features/student/constants/labs';

const LabsPage = () => {

  const items: LearningCatalogueItem[] = LABS.map((lab) => ({
    key: lab.id,
    id: lab.id,
    type: 'lab',
    to: lab.route,
    accentColor: lab.accentColor,
    title: lab.title,
    description: lab.desc,
    difficulty: lab.difficulty,
    cpReward: lab.cpReward,
    actionLabel: "Launch",
  }));

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Attack Labs | QYVORA"}
        description={"Hands-on offensive security labs covering privilege escalation, password cracking, SQL injection, OSINT, and the full kill chain."}
      />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <PageHeader
          kicker={"QYVORA · Practice"}
          title={"Attack Labs"}
          description={"Real-world offensive security labs in a sandboxed environment. Practice privilege escalation, password attacks, SQL injection, OSINT, and full kill-chain operations."}
          actions={
            <Button to="/register">
              {"Start training"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <LearningCatalogue
          className="mt-10"
          items={items}
          showSearch
          searchPlaceholder={"Search labs..."}
          emptyTitle={"No labs match this filter"}
          emptyDescription={"Try a different difficulty or check back soon — new labs ship frequently."}
        />
      </div>
    </div>
  );
};

export default LabsPage;