import React from 'react';
import { ArrowRight, BookOpen, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/shared/components/SEO';
import PageHeader from '@/shared/components/ui/PageHeader';
import PublicContainer from '@/shared/components/layout/PublicContainer';
import Button from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import {
  CHEATSHEET_REPO,
  POPULAR_CHEATSHEET_GROUPS,
  QYVORA_CHEATSHEETS,
  type CheatSheet,
} from '@/features/marketing/content/resourcesData';

const SheetCard: React.FC<{ sheet: CheatSheet; showDocs?: boolean }> = ({
  sheet,
  showDocs = false,
}) => (
  <Card className="flex h-full flex-col gap-3 p-5">
    <div className="flex items-start gap-3">
      {sheet.logo && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center">
          <img
            src={sheet.logo}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </span>
      )}
      <div className="min-w-0">
        <h3 className="text-sm font-black uppercase tracking-tight text-text-primary">
          {sheet.title}
        </h3>
        <p className="type-body-sm mt-1 text-text-secondary">{sheet.description}</p>
      </div>
    </div>
    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border-subtle pt-3">
      <a
        href={sheet.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-accent transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <BookOpen className="h-4 w-4" aria-hidden="true" />
        Open cheat sheet
      </a>
      {showDocs && sheet.docsPath && (
        <Link
          to={sheet.docsPath}
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Tool docs
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  </Card>
);

const SectionHeading: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="mb-4">
    <h2 className="type-h3 font-black uppercase tracking-tight text-text-primary">{title}</h2>
    <p className="type-body-sm mt-1 text-text-muted">{description}</p>
  </div>
);

const ResourcesPage: React.FC = () => (
  <div className="w-full bg-canvas">
    <SEO
      title="Cheat Sheets & Resources | QYVORA"
      description="Practical cheat sheets for the QYVORA frameworks and popular offensive-security tools, maintained in the public qyvora-cheatsheets repository."
    />
    <PublicContainer className="pb-20 pt-24 md:pb-24 md:pt-28 lg:pt-32">
      <PageHeader
        kicker={"QYVORA · Resources"}
        title={"Cheat sheets for operators"}
        description={"Concise, practical sheets for the QYVORA frameworks and the tools that surround them. Every link opens the maintained Markdown source on GitHub."}
        actions={
          <Button href={CHEATSHEET_REPO} external variant="secondary" size="lg">
            <Github className="h-4 w-4" aria-hidden="true" />
            Open the repository
          </Button>
        }
      />

      <Card className="mt-8 flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <p className="type-label uppercase tracking-[0.12em] text-accent">
            {"One source of truth"}
          </p>
          <p className="type-body-sm mt-1 max-w-2xl text-text-secondary">
            {"The repository is the source of truth. Sheets are written for authorized testing only — use them against systems you own or have written permission to test."}
          </p>
        </div>
        <span className="type-meta shrink-0 text-text-muted">
          {`${QYVORA_CHEATSHEETS.length} framework sheets · ${POPULAR_CHEATSHEET_GROUPS.reduce(
            (total, group) => total + group.sheets.length,
            0,
          )} tool sheets`}
        </span>
      </Card>

      <section aria-labelledby="qyvora-sheets-title" className="mt-12">
        <div id="qyvora-sheets-title">
          <SectionHeading
            title={"QYVORA frameworks"}
            description={"The framework sheets, each paired with its full documentation page."}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QYVORA_CHEATSHEETS.map((sheet) => (
            <SheetCard key={sheet.slug} sheet={sheet} showDocs />
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-col gap-12">
        {POPULAR_CHEATSHEET_GROUPS.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-24">
            <SectionHeading title={group.title} description={group.description} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.sheets.map((sheet) => (
                <SheetCard key={sheet.slug} sheet={sheet} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Card className="mt-12 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="type-label uppercase tracking-[0.12em] text-accent">
            {"Looking for release notes?"}
          </p>
          <p className="type-body-sm mt-1 max-w-xl text-text-secondary">
            {"The tool changelog tracks current release versions and links every framework to its maintained changelog."}
          </p>
        </div>
        <Button to="/changelog" size="lg">
          Read the changelog
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Card>
    </PublicContainer>
  </div>
);

export default ResourcesPage;
