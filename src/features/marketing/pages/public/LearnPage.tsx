import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Bug, ShieldCheck, Globe, Coins } from 'lucide-react';
import { COURSES, COURSE_ICON_MAP } from '@/features/student/data/courses';
import { LABS } from '@/features/student/constants/labs';
import { PHASES } from '@/features/marketing/data/learnData';
import { Card } from '@/shared/components/ui/Card';
import LabBadge from '@/shared/components/LabBadge';
import HpbAvatar, { type HpbVariant } from '@/shared/components/HpbAvatar';
import { SIMULATIONS } from '@/features/marketing/pages/public/SimulationsPage';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';
import Button from '@/shared/components/ui/Button';

type TabId = 'courses' | 'labs' | 'bootcamp' | 'simulations' | 'cp';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'courses', label: 'Courses', icon: <BookOpen className="h-4 w-4" aria-hidden="true" /> },
  { id: 'labs', label: 'Labs', icon: <Bug className="h-4 w-4" aria-hidden="true" /> },
  { id: 'bootcamp', label: 'Bootcamp', icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" /> },
  { id: 'simulations', label: 'Simulations', icon: <Globe className="h-4 w-4" aria-hidden="true" /> },
  { id: 'cp', label: 'CyberPoints', icon: <Coins className="h-4 w-4" aria-hidden="true" /> },
];

const TAB_CTA_LABELS: Record<TabId, string> = {
  courses: 'Browse courses',
  labs: 'Browse labs',
  bootcamp: 'Explore the bootcamp',
  simulations: 'Open simulations',
  cp: 'About CyberPoints',
};

const SUGGESTED_CTA: Record<TabId, string> = {
  courses: '/register',
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
    TAB_IDS.includes(initialTab as TabId) ? (initialTab as TabId) : 'courses',
  );

  const renderItems = () => {
    switch (active) {
      case 'courses':
        return COURSES.map((course) => {
          const cfg = COURSE_ICON_MAP[course.id];
          return (
            <Card key={course.id} to={`/dashboard/courses/${course.id}`} interactive className="flex min-h-[170px] flex-col gap-2 p-6">
              <div className="flex items-center gap-2">
                {cfg && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
                    <cfg.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
                <span className="type-meta">{course.skillLevel}</span>
              </div>
              <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">{course.title}</h3>
              <p className="type-body-sm flex-1 line-clamp-3">{course.overview}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                <span className="type-meta">{course.lessons.length} lessons</span>
                <span className="type-meta">{course.estimatedMinutes} min</span>
                <span className="type-meta text-accent">{course.cpCost} CP</span>
              </div>
            </Card>
          );
        });
      case 'labs':
        return LABS.map((lab) => (
          <Card key={lab.id} to={lab.route} interactive className="flex min-h-[190px] flex-col gap-3 p-6">
            <div className="flex items-center gap-3">
              <LabBadge labId={lab.id} accentColor={lab.accentColor} className="w-14 h-14 shrink-0" />
              <span className="type-meta">{lab.difficulty}</span>
            </div>
            <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
              {lab.title}
            </h3>
            <p className="type-body-sm flex-1 line-clamp-3">
              {lab.desc}
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border-subtle pt-3">
              <span className="type-meta text-accent">{lab.cpReward} CP</span>
            </div>
          </Card>
        ));
      case 'bootcamp':
        return PHASES.map((phase) => {
          const hpbVariant = `phase${Number(phase.id)}` as HpbVariant;
          return (
            <Card key={phase.id} to={`/hpb/phase${Number(phase.id)}`} interactive className="flex min-h-[190px] flex-col gap-3 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface-raised">
                  <HpbAvatar variant={hpbVariant} className="h-full w-auto max-h-full max-w-full" />
                </div>
                <span className="type-meta">Phase {phase.id}</span>
              </div>
              <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                {phase.name}
              </h3>
              <p className="type-body-sm flex-1 line-clamp-3">{phase.desc}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border-subtle pt-3">
                <span className="type-meta">Hacker Protocol Bootcamp</span>
              </div>
            </Card>
          );
        });
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={"Learn | QYVORA"}
        description={"Courses, labs, the Hacker Protocol Bootcamp, and more."}
      />
      <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
        <PageHeader
          kicker="QYVORA"
          title={"Learn | QYVORA".replace(' | QYVORA', '')}
          description={"Courses, labs, the Hacker Protocol Bootcamp, and more."}
        />

        <div
          role="tablist"
          aria-label={"Learn | QYVORA"}
          className="mb-10 mt-10 flex flex-wrap gap-2 border-b border-border-subtle pb-4"
        >
          {TABS.map((tab) => {
            const selected = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`learn-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`learn-panel-${tab.id}`}
                onClick={() => setActive(tab.id)}
                className={[
                  'flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-sm font-bold transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  selected
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-tertiary hover:bg-surface-raised hover:text-text-primary',
                ].join(' ')}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {(['courses', 'labs', 'bootcamp'] as TabId[]).includes(active) && (
          <div
            key={active}
            role="tabpanel"
            id={`learn-panel-${active}`}
            aria-labelledby={`learn-tab-${active}`}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {renderItems()}
          </div>
        )}

        {active === 'simulations' && (
          <div
            role="tabpanel"
            id="learn-panel-simulations"
            aria-labelledby="learn-tab-simulations"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {SIMULATIONS.map((sim) => {
              const Icon = sim.icon;
              return (
                <Card key={sim.id} to={sim.slug} interactive className="flex min-h-[190px] flex-col gap-3 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface-raised text-accent">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <span className="type-meta">Live demo</span>
                  </div>
                  <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
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
            className="max-w-2xl"
          >
            <ScrollReveal>
              <Card to="/cp" interactive className="flex min-h-[160px] flex-col gap-3 p-6">
                <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                  {"Earn CyberPoints on-chain."}
                </h3>
                <p className="type-body-sm flex-1">{"Every verified achievement across courses, labs, and bootcamp rooms earns CP — a verifiable record of your skill."}</p>
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