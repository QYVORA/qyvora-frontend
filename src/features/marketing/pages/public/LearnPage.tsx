import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Bug, ShieldCheck, Globe, Coins } from 'lucide-react';
import { UNIFIED_LABS, LAB_FORMAT_SHORT_LABELS } from '@/features/student/data/labs';
import { PHASES } from '@/features/marketing/data/learnData';
import { BOOTCAMPS } from '@/features/marketing/content/bootcampData';
import { Card } from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import LabBadge from '@/shared/components/LabBadge';
import CourseBadge from '@/shared/components/CourseBadge';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { SIMULATIONS } from '@/features/marketing/pages/public/SimulationsPage';
import PageHeader from '@/shared/components/ui/PageHeader';
import UnderlineTabs from '@/shared/components/ui/UnderlineTabs';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import Button from '@/shared/components/ui/Button';

type TabId = 'labs' | 'bootcamp' | 'simulations' | 'cp';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'labs', label: 'Labs', icon: <Bug className="h-4 w-4" aria-hidden="true" /> },
  { id: 'bootcamp', label: 'Bootcamp', icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" /> },
  { id: 'simulations', label: 'Simulations', icon: <Globe className="h-4 w-4" aria-hidden="true" /> },
  { id: 'cp', label: 'CyberPoints', icon: <Coins className="h-4 w-4" aria-hidden="true" /> },
];

const TAB_CTA_LABELS: Record<TabId, string> = {
  labs: 'Browse labs',
  bootcamp: 'Explore the bootcamp',
  simulations: 'Open simulations',
  cp: 'About CyberPoints',
};

const SUGGESTED_CTA: Record<TabId, string> = {
  labs: '/register',
  bootcamp: '/register',
  simulations: '/simulations',
  cp: '/cp',
};

const TAB_IDS = TABS.map((tab) => tab.id);

/**
 * LearnPage — the public learning discovery hub. Tabs surface each content
 * type with real items. Cards link to the item's destination; the footer CTA
 * is the single primary action for the active tab.
 */
const LearnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [active, setActive] = React.useState<TabId>(() =>
    TAB_IDS.includes(initialTab as TabId) ? (initialTab as TabId) : 'labs',
  );

  const renderItems = () => {
    switch (active) {
      case 'labs':
        return UNIFIED_LABS.map((lab) => (
          <Card key={lab.id} to={lab.route} interactive className="flex min-h-[220px] flex-col gap-3 p-6">
            <div className="flex items-center gap-3">
              {lab.source === 'content' ? (
                <CourseBadge courseId={lab.id} className="h-24 w-24 shrink-0" />
              ) : (
                <LabBadge labId={lab.id} accentColor={lab.accentColor} className="h-24 w-24 shrink-0" />
              )}
              <span className="type-meta">{LAB_FORMAT_SHORT_LABELS[lab.format]}</span>
            </div>
            <h3 className="text-base font-bold text-text-primary">
              {lab.title}
            </h3>
            <p className="type-body-sm flex-1 line-clamp-3">
              {lab.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border-subtle pt-3">
              {lab.cpReward && <span className="type-meta text-accent">{lab.cpReward} CP</span>}
              {lab.lessonsCount !== undefined && (
                <span className="type-meta">{lab.lessonsCount} lessons</span>
              )}
              {lab.estimatedMinutes !== undefined && (
                <span className="type-meta">{lab.estimatedMinutes} min</span>
              )}
            </div>
          </Card>
        ));
      case 'bootcamp':
        return [
          <Card
            key="qose"
            to={BOOTCAMPS.qose.path}
            interactive
            className="flex min-h-[190px] flex-col gap-3 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden">
                <img
                  src={BOOTCAMPS.qose.logo}
                  alt={BOOTCAMPS.qose.logoAlt}
                  width={BOOTCAMPS.qose.logoWidth}
                  height={BOOTCAMPS.qose.logoHeight}
                  className="h-full w-auto max-h-full max-w-full object-contain"
                />
              </div>
              <Badge variant="warning" size="sm">
                {BOOTCAMPS.qose.statusLabel}
              </Badge>
            </div>
            <h3 className="text-base font-bold text-text-primary">
              {BOOTCAMPS.qose.name}
            </h3>
            <p className="type-body-sm flex-1 line-clamp-3">{BOOTCAMPS.qose.tagline}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border-subtle pt-3">
              <span className="type-meta">{`12 weeks · Online`}</span>
            </div>
          </Card>,
          ...PHASES.map((phase) => {
            const hpbVariant = `phase${Number(phase.id)}` as HpbVariant;
            return (
              <Card key={phase.id} to="/hpb" interactive className="flex min-h-[190px] flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden">
                    <HpbAvatar variant={hpbVariant} className="h-full w-auto max-h-full max-w-full object-contain" />
                  </div>
                  <span className="type-meta">Phase {phase.id}</span>
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  {phase.name}
                </h3>
                <p className="type-body-sm flex-1 line-clamp-3">{phase.desc}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border-subtle pt-3">
                  <span className="type-meta">Hacker Protocol Bootcamp</span>
                </div>
              </Card>
            );
          }),
        ];
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Learn | QYVORA"}
        description={"Labs, the Hacker Protocol Bootcamp, simulations and more."}
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA"
          title={"Learn | QYVORA".replace(' | QYVORA', '')}
          description={"Labs, the Hacker Protocol Bootcamp, simulations and more."}
        />

        <UnderlineTabs
          tabs={TABS.map((tab) => ({ value: tab.id, label: tab.label, icon: tab.icon }))}
          value={active}
          onChange={(value) => setActive(value as TabId)}
          ariaLabel="Learn sections"
          className="mb-8 mt-10"
        />

        {(['labs', 'bootcamp'] as TabId[]).includes(active) && (
          <div
            key={active}
            role="tabpanel"
            id={`learn-panel-${active}`}
            aria-labelledby={`learn-tab-${active}`}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {renderItems()}
          </div>
        )}

        {active === 'simulations' && (
          <div
            role="tabpanel"
            id="learn-panel-simulations"
            aria-labelledby="learn-tab-simulations"
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {SIMULATIONS.map((sim) => {
              const Icon = sim.icon;
              return (
                <Card key={sim.id} to={sim.slug} interactive className="flex min-h-[190px] flex-col gap-3 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center text-accent">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <span className="type-meta">Live demo</span>
                  </div>
                  <h3 className="text-base font-bold text-text-primary">
                    {sim.title}
                  </h3>
                  <p className="type-body-sm flex-1 line-clamp-3">{sim.description}</p>
                  <div className="flex items-center gap-2 pt-3 text-sm font-bold text-accent">
                    {"Open simulation"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {active === 'cp' && (
          <div
            role="tabpanel"
            id="learn-panel-cp"
            aria-labelledby="learn-tab-cp"
            
          >
            <ScrollReveal>
              <Card to="/cp" interactive className="flex min-h-[160px] flex-col gap-3 p-6">
                <h3 className="text-base font-bold text-text-primary">
                  {"Earn CyberPoints on-chain."}
                </h3>
                <p className="type-body-sm flex-1">{"Every verified achievement across labs and bootcamp rooms earns CP: a verifiable record of your skill."}</p>
                <span className="flex min-h-[48px] items-center gap-2 text-sm font-bold text-accent">
                  {"About CyberPoints"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </ScrollReveal>
          </div>
        )}

        <div className="mt-10">
          <Button to={SUGGESTED_CTA[active]}>
            {TAB_CTA_LABELS[active]}
          </Button>
        </div>
      </PublicContainer>
    </div>
  );
};

export default LearnPage;