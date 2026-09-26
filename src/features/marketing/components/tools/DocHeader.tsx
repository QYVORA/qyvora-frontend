import React from 'react';
import { Download, Github, Library } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import DocFacts, { type DocFact } from '@/shared/components/docs/DocFacts';
import { openToolInstall, type ToolInstallKey } from '@/features/marketing/components/ToolInstallModal';
import { TOOL_INSTALL_CONFIG } from '@/features/marketing/data/toolInstallConfig';
import { TOOL_DOMAIN_LABELS, type ToolEntry } from '@/features/marketing/data/tools/registry';

interface DocHeaderProps {
  tool: ToolEntry;
  summary: string;
  facts: DocFact[];
}

/**
 * DocHeader — the heading block at the top of a documentation page.
 *
 * A page title, a one-paragraph statement of what the tool is, the two links a
 * reader actually needs (repository, install), and the facts that frame
 * everything below. No logo billboard, no stat tiles: this is the entry point
 * to a document, not a product hero.
 */
const DocHeader: React.FC<DocHeaderProps> = ({ tool, summary, facts }) => {
  // The install modal can help whenever TOOL_INSTALL_CONFIG has an entry for
  // the tool. That is a broader set than `hasInstaller` (a root install.sh
  // one-liner): TOHA3EE installs from a release archive and the offline
  // frameworks build from source. Only QYVORA-COMMON, a library with no
  // binary, has no entry at all.
  const canInstall = Boolean(TOOL_INSTALL_CONFIG[tool.slug as ToolInstallKey]);

  return (
    <header className="border-b border-border-subtle pb-8">
      <p className="text-kicker font-black uppercase tracking-[0.3em] text-accent">
        Reference
        <span className="mx-2 text-text-muted" aria-hidden="true">
          /
        </span>
        {TOOL_DOMAIN_LABELS[tool.domain]}
      </p>

      <div className="mt-4 flex items-center gap-4 md:gap-5">
        {tool.logo ? (
          <img
            src={tool.logo}
            alt=""
            aria-hidden="true"
            className="h-12 w-12 shrink-0 object-contain md:h-14 md:w-14"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 md:h-14 md:w-14"
          >
            <Library className="h-6 w-6 text-accent md:h-7 md:w-7" />
          </span>
        )}

        <h1 className="min-w-0 text-3xl font-black uppercase tracking-tight text-text-primary md:text-4xl">
          {tool.displayName}
        </h1>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-[2] text-text-secondary md:text-base md:leading-[2.2]">
        {summary}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          href={tool.github}
          external
          variant="secondary"
          size="sm"
          icon={<Github className="h-4 w-4" aria-hidden="true" />}
        >
          Repository
        </Button>
        {canInstall && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => openToolInstall(tool.slug as ToolInstallKey)}
            icon={<Download className="h-4 w-4" aria-hidden="true" />}
          >
            Install
          </Button>
        )}
      </div>

      <DocFacts items={facts} className="mt-8" />
    </header>
  );
};

export default DocHeader;
