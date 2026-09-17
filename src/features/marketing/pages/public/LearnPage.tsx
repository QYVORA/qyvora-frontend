import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Bug, ShieldCheck, Globe, Coins } from 'lucide-react';
import { COURSES, COURSE_ICON_MAP } from '@/features/student/data/courses';
import { LABS } from '@/features/student/constants/labs';
import { PHASES } from '@/features/marketing/data/learnData';
import { Card } from '@/shared/components/ui/Card';
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
          <Card key={lab.id} to={lab.route} interactive className="flex min-h-[170px] flex-col gap-2 p-6">
            <span className="type-meta">{lab.difficulty}</span>
            <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
              {lab.title}
            </h3>
            <p className="type-body-sm flex-1 line-clamp-3">
              {lab.desc}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <span className="type-meta">{lab.cpReward} CP</span>
            </div>
          </Card>
        ));
      case 'bootcamp':
        return PHASES.map((phase) => {
          const Icon = phase.icon;
          return (
            <Card key={phase.id} to={`/hpb/phase${Number(phase.id)}`} interactive className="flex min-h-[170px] flex-col gap-2 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-raised text-accent">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                <span className="text-text-tertiary">{phase.id} · </span>{phase.name}
              </h3>
              <p className="type-body-sm flex-1 line-clamp-3">{phase.desc}</p>
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
            className="max-w-2xl"
          >
            <ScrollReveal>
              <Card to="/simulations/terminal" interactive className="flex min-h-[160px] flex-col gap-3 p-6">
                <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                  {"Practice inside simulated networks."}
                </h3>
                <p className="type-body-sm flex-1">{"Corporation-scale environments for terminal and networking practice without any of the risk."}</p>
                <span className="flex min-h-[48px] items-center gap-2 text-sm font-bold text-accent">
                  {"Open simulations"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </ScrollReveal>
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