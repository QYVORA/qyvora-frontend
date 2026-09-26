import React from 'react';
import SEO from '@/shared/components/SEO';
import DocBlocks from './DocBlocks';
import DocHeader from './DocHeader';
import DocPager, { DocColophon } from './DocPager';
import type { DocFact } from '@/shared/components/docs/DocFacts';
import { getToolOrThrow, type ToolEntry } from '@/features/marketing/data/tools/registry';
import type { ToolDoc } from '@/features/marketing/data/tools/types';

/** Facts derived from the registry, so no page repeats tool metadata by hand. */
const factsFor = (tool: ToolEntry): DocFact[] => {
  const facts: DocFact[] = [
    { label: 'Repository', value: tool.repo },
    { label: 'Go module', value: tool.module },
    { label: 'Go version', value: tool.goVersion },
  ];

  if (tool.binary) facts.push({ label: 'Binary', value: tool.binary });
  facts.push({ label: 'Entrypoint', value: tool.entrypoint });
  facts.push({
    label: 'License',
    value: tool.license ?? 'No license text committed',
    mono: Boolean(tool.license),
  });

  return facts;
};

interface ToolDocViewProps {
  doc: ToolDoc;
}

/**
 * ToolDocView — the single renderer for every tool documentation page.
 *
 * A page is its data plus this layout: heading, facts, then one section per
 * topic separated by rules. Because every tool goes through the same renderer,
 * a page can never drift into a different visual language, and the sections
 * stay in the order the sidebar lists them.
 */
const ToolDocView: React.FC<ToolDocViewProps> = ({ doc }) => {
  const tool = getToolOrThrow(doc.slug);

  return (
    <>
      <SEO title={doc.seoTitle} description={doc.seoDescription} />

      <article className="wc-prose mx-auto w-full px-4 py-10 md:px-6 md:py-14 lg:px-10">
        <DocHeader tool={tool} summary={doc.summary} facts={factsFor(tool)} />

        {doc.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-20 border-b border-border-subtle py-10 last:border-b-0 md:scroll-mt-8"
          >
            <header className="mb-6">
              {section.kicker && (
                <p className="text-kicker font-black uppercase tracking-[0.3em] text-accent">
                  {section.kicker}
                </p>
              )}
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-text-primary md:text-3xl">
                {section.title}
              </h2>
              {section.description && (
                <p className="mt-3 text-sm leading-[2] text-text-secondary md:text-base md:leading-[2.2]">
                  {section.description}
                </p>
              )}
            </header>

            <DocBlocks blocks={section.blocks} tool={tool} />
          </section>
        ))}

        <DocPager slug={tool.slug} />
        <DocColophon />
      </article>
    </>
  );
};

export default ToolDocView;
