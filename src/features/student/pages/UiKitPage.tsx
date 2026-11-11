import React, { useState } from 'react';
import {
  Activity, Award, BookOpen, CheckCircle2, ChevronRight, Compass,
  Flag, Flame, LogOut, Search, Settings, Shield, Target, User,
} from 'lucide-react';
import {
  Avatar, Badge, Breadcrumb, Button, Field, FieldGrid, Input, Menu, MenuItem,
  MenuLabel, MenuSeparator, OptionTile, Progress, RuleHeading, SectionCard,
  SegmentedTabs, Select, StatStrip, Switch, Textarea, Toggle, UnderlineTabs,
} from '@/shared/components/ui';
import { Card } from '@/shared/components/ui/Card';
import TwoColumn from '@/shared/components/layout/TwoColumn';
import LearningHero from '@/shared/components/learning/LearningHero';
import { getLabBadgeAsset } from '@/shared/learning/labBadges';

const Page: React.FC = () => {
  const [tab, setTab] = useState('overview');
  const [seg, setSeg] = useState('week');
  const [passed, setPassed] = useState(true);
  const [digest, setDigest] = useState(false);
  const [level, setLevel] = useState('beginner');
  const [goal, setGoal] = useState('pentest');
  const [menuOpen, setMenuOpen] = useState(false);
  const heroBadge = getLabBadgeAsset('privesc');

  return (
    <div className="mx-auto w-full space-y-6 px-[var(--app-gutter)] py-8">
      <header className="space-y-2">
        <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'UI kit' }]} />
        <h1 className="type-h1 text-text-primary">UI kit</h1>
        <p className="type-body text-text-muted">
          DEV-only reference for App UI System v2. Every signed-in surface composes these primitives.
        </p>
      </header>

      <SectionCard title="Buttons" icon={<Compass />} description="Primary, secondary, ghost, danger and link sizes.">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger-outline">Delete</Button>
          <Button variant="danger-solid" icon={<LogOut className="h-4 w-4" />}>Sign out</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Form controls" icon={<Settings />}>
          <div className="space-y-5">
            <Field label="Display name" hint="Shown on your public profile." required>
              <Input placeholder="operator" />
            </Field>
            <Field label="Email" error="Enter a valid email address.">
              <Input type="email" placeholder="you@qyvora.io" icon={<User className="h-4 w-4" />} />
            </Field>
            <Field label="Region">
              <Select
                defaultValue="eu"
                options={[
                  { value: 'eu', label: 'Europe' },
                  { value: 'us', label: 'United States' },
                  { value: 'ap', label: 'Asia Pacific' },
                ]}
              />
            </Field>
            <Field label="Bio">
              <Textarea placeholder="A short line about you" />
            </Field>
            <Toggle
              label="Weekly digest"
              description="A Monday summary of your progress."
              checked={digest}
              onCheckedChange={setDigest}
            />
            <div className="flex items-center gap-3">
              <Switch checked={passed} onCheckedChange={setPassed} label="Lesson complete" />
              <span className="type-body-sm text-text-secondary">Lesson complete</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Choice tiles" icon={<Target />}>
          <FieldGrid className="md:grid-cols-1">
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium text-text-primary">Experience</legend>
              {[
                ['beginner', 'Beginner', 'New to security.'],
                ['intermediate', 'Intermediate', 'Comfortable with the basics.'],
              ].map(([value, title, desc]) => (
                <OptionTile
                  key={value}
                  name="level"
                  value={value}
                  title={title}
                  description={desc}
                  selected={level === value}
                  onSelect={() => setLevel(value)}
                />
              ))}
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium text-text-primary">Goal</legend>
              {[
                ['pentest', 'Penetration testing'],
                ['soc', 'SOC analysis'],
              ].map(([value, title]) => (
                <OptionTile
                  key={value}
                  name="goal"
                  value={value}
                  title={title}
                  selected={goal === value}
                  onSelect={() => setGoal(value)}
                />
              ))}
            </fieldset>
          </FieldGrid>
        </SectionCard>
      </div>

      <SectionCard title="Tabs" icon={<BookOpen />}>
        <div className="space-y-5">
          <UnderlineTabs
            ariaLabel="Overview tabs"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'overview', label: 'Overview' },
              { value: 'activity', label: 'Activity', count: 12 },
              { value: 'paths', label: 'Paths' },
            ]}
          />
          <SegmentedTabs
            ariaLabel="Range"
            value={seg}
            onChange={setSeg}
            tabs={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'all', label: 'All time' },
            ]}
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Cards" icon={<Shield />}>
          <div className="space-y-4">
            <Card className="p-5">
              <p className="type-h3 text-text-primary">Default card</p>
              <p className="type-body-sm mt-1 text-text-muted">bg-surface + 1px subtle border</p>
            </Card>
            <Card variant="nested" className="p-5">
              <p className="type-h3 text-text-primary">Nested panel</p>
              <p className="type-body-sm mt-1 text-text-muted">bg-canvas inside a card</p>
            </Card>
            <Card variant="raised" className="p-5">
              <p className="type-h3 text-text-primary">Raised surface</p>
              <p className="type-body-sm mt-1 text-text-muted">Menus and accordion rows</p>
            </Card>
            <Card selected className="p-5">
              <p className="type-h3 text-text-primary">Selected</p>
              <p className="type-body-sm mt-1 text-text-muted">Accent border + 6% tint</p>
            </Card>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <div>
            <RuleHeading>Stats</RuleHeading>
            <StatStrip
              className="mt-3"
              label="Summary"
              cells={[
                { value: '12', label: 'Labs', icon: <Target /> },
                { value: '48', label: 'Rooms', icon: <BookOpen /> },
                { value: '7', label: 'Streak', icon: <Flame />, accent: true },
              ]}
            />
          </div>
          <div>
            <RuleHeading action={<Button variant="ghost" size="sm" trailingIcon={<ChevronRight className="h-4 w-4" />}>View all</Button>}>
              Progress
            </RuleHeading>
            <div className="mt-4 space-y-4">
              <Progress label="Bootcamp" value={64} showValue />
              <Progress label="Weekly mission" value={40} size="strip" />
            </div>
          </div>
          <div>
            <RuleHeading>Badges &amp; avatars</RuleHeading>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge>Default</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="danger" pill>Locked</Badge>
              <Badge variant="success" pill>Complete</Badge>
              {[24, 32, 40, 48, 64].map((size) => (
                <Avatar key={size} name="operator" size={size as 24 | 32 | 40 | 48 | 64} />
              ))}
              <Avatar name="operator" size={40} ring />
            </div>
          </div>
        </div>
      </div>

      <SectionCard title="Gradient tones" icon={<Flame />} description="The only sanctioned gradients — quiet accent mixes, no glow or animation.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(['feature', 'hero', 'strip', 'header'] as const).map((tone) => (
            <Card key={tone} tone={tone} className="p-5">
              <p className="type-h3 capitalize text-text-primary">{tone}</p>
              <p className="type-body-sm mt-1 text-text-muted">{`Card tone="${tone}"`}</p>
            </Card>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="TwoColumn" icon={<Compass />} description="The one page split — stacks below lg, literal grid templates from lg.">
        <TwoColumn split="profile">
          <Card className="min-w-0 p-5">
            <p className="type-h3 text-text-primary">Left rail</p>
            <p className="type-body-sm mt-1 text-text-muted">4fr — identity, rank, trophy.</p>
          </Card>
          <Card className="min-w-0 p-5">
            <p className="type-h3 text-text-primary">Main column</p>
            <p className="type-body-sm mt-1 text-text-muted">7fr — stats, activity, achievements.</p>
          </Card>
        </TwoColumn>
      </SectionCard>

      <SectionCard title="Learning hero" icon={<Shield />} description="Full-bleed gradient band with the item badge slanted behind the title.">
        <div className="overflow-hidden rounded-2xl border border-border-subtle">
          <LearningHero
            kicker="Hands-on lab"
            icon={heroBadge ? <img src={heroBadge.image} alt="" /> : undefined}
            title="Privilege escalation"
            description="Enumerate, escalate and prove impact across a Linux target."
            heroArtSrc={heroBadge?.image}
            stats={[
              { label: 'Difficulty', value: 'Intermediate' },
              { label: 'Time', value: '45 min', accent: true },
            ]}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Menu"
        icon={<Search />}
        actions={
          <div className="relative">
            <Button
              variant="secondary"
              data-menu-trigger
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
            >
              Open menu
            </Button>
            <Menu open={menuOpen} onClose={() => setMenuOpen(false)} className="absolute right-0 top-12">
              <MenuLabel>operator</MenuLabel>
              <MenuItem icon={<User />} to="/dashboard/profile">Profile</MenuItem>
              <MenuItem icon={<Settings />} to="/dashboard/settings">Settings</MenuItem>
              <MenuItem icon={<Award />} to="/dashboard/certificates">Certificates</MenuItem>
              <MenuSeparator />
              <MenuItem icon={<LogOut />} danger onClick={() => setMenuOpen(false)}>Sign out</MenuItem>
            </Menu>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: <Activity />, title: 'Activity', body: 'Recent completions.' },
            { icon: <CheckCircle2 />, title: 'Done', body: 'Finished this week.' },
            { icon: <Flag />, title: 'Mission', body: 'This week’s target.' },
          ].map((item) => (
            <Card key={item.title} variant="nested" className="p-4">
              <span className="text-accent [&_svg]:h-5 [&_svg]:w-5">{item.icon}</span>
              <p className="type-h3 mt-3 text-text-primary">{item.title}</p>
              <p className="type-body-sm mt-1 text-text-muted">{item.body}</p>
            </Card>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default Page;
