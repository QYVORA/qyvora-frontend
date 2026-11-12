import React from 'react';
import { ArrowRight, GitBranch, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { TOOLS, type ToolEntry } from '@/features/marketing/data/tools/registry';
import { TOOL_RELEASE_NOTES } from '@/features/marketing/content/toolChangelogData';

const toolBySlug = new Map(TOOLS.map((tool: ToolEntry) => [tool.slug, tool]));

const RELEASES = TOOL_RELEASE_NOTES.flatMap((release) => {
  const tool = toolBySlug.get(release.slug);
  if (!tool) return [];
  return [
    {
      ...release,
      tool,
      changelogUrl: `https://github.com/${tool.repo}/blob/${tool.defaultBranch}/CHANGELOG.md`,
    },
  ];
});

const ChangelogPage: React.FC = () => (
  <div className="w-full bg-canvas">
    <SEO
      title="Tool Changelog & Release Notes | QYVORA"
      description="Current release versions and recent changes across the QYVORA open-source security frameworks, linked to each repository's maintained changelog."
    />
    <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
      <PageHeader
        kicker={"QYVORA · Changelog"}
        title={"Tool releases, tracked in public"}
        description={"Current versions and recent changes across the QYVORA frameworks. Every row links to the maintained CHANGELOG.md in the repository."}
        actions={
          <Button to="/tools" variant="secondary" size="lg">
            Browse the tools
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <Card className="mt-8 flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <p className="type-label uppercase tracking-[0.12em] text-accent">
            {"Source of truth"}
          </p>
          <p className="type-body-sm mt-1 max-w-2xl text-text-secondary">
            {"Version tags identify the release; the repository changelog records the full entry. Highlights here summarise the latest changes and may include work already merged ahead of the next tag."}
          </p>
        </div>
        <span className="type-meta shrink-0 text-text-muted">
          {`${RELEASES.length} frameworks tracked`}
        </span>
      </Card>

      <section aria-labelledby="release-tracker-title" className="mt-12">
        <div className="mb-4">
          <h2
            id="release-tracker-title"
            className="type-h3 font-black uppercase tracking-tight text-text-primary"
          >
            {"Release tracker"}
          </h2>
          <p className="type-body-sm mt-1 text-text-muted">
            {"Latest tagged release per framework. All repositories publish from their main branch."}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border-subtle bg-bg-card">
          {RELEASES.map((release, index) => (
            <div
              key={release.slug}
              className={`flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6 ${
                index > 0 ? 'border-t border-border-subtle' : ''
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                {release.tool.logo && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                    <img
                      src={release.tool.logo}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase tracking-tight text-text-primary">
                    {release.tool.displayName}
                  </p>
                  <p className="type-meta text-text-muted">{release.tool.summary}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <span className="inline-flex items-center rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-xs font-bold text-accent">
                  {release.version}
                </span>
                <span className="type-meta text-text-muted">
                  {`Released ${release.releasedAt}`}
                </span>
                <a
                  href={release.changelogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  Changelog
                </a>
                <Link
                  to={release.tool.path}
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Docs
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="recent-changes-title" className="mt-12">
        <div className="mb-4">
          <h2
            id="recent-changes-title"
            className="type-h3 font-black uppercase tracking-tight text-text-primary"
          >
            {"Recent changes"}
          </h2>
          <p className="type-body-sm mt-1 text-text-muted">
            {"The top highlights from each framework’s current changelog entry."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {RELEASES.map((release) => (
            <Card key={release.slug} className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {release.tool.logo && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                      <img
                        src={release.tool.logo}
                        alt=""
                        width={28}
                        height={28}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    </span>
                  )}
                  <h3 className="text-sm font-black uppercase tracking-tight text-text-primary">
                    {release.tool.displayName}
                  </h3>
                </div>
                <span className="shrink-0 rounded-lg border border-border-subtle bg-surface-raised px-2 py-1 font-mono text-[11px] font-bold text-text-secondary">
                  {release.version}
                </span>
              </div>

              <ul className="flex flex-col gap-2">
                {release.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <GitBranch
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span className="type-body-sm text-text-secondary">{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-border-subtle pt-3">
                <a
                  href={release.changelogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  Full changelog
                </a>
                <Link
                  to={release.tool.path}
                  className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Tool docs
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card className="mt-12 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="type-label uppercase tracking-[0.12em] text-accent">
            {"Need the commands?"}
          </p>
          <p className="type-body-sm mt-1 max-w-xl text-text-secondary">
            {"The resources page collects the cheat sheets for every framework and the tools around them."}
          </p>
        </div>
        <Button to="/resources" size="lg">
          Open resources
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Card>
    </PublicContainer>
  </div>
);

export default ChangelogPage;
