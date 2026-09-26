import React from 'react';
import { repoFileUrl, type ToolEntry } from '@/features/marketing/data/tools/registry';
import type { DocBlock } from '@/features/marketing/data/tools/types';
import DocCode from '@/shared/components/docs/DocCode';
import DocCommand from '@/shared/components/docs/DocCommand';
import DocDefinitions from '@/shared/components/docs/DocDefinitions';
import DocFacts from '@/shared/components/docs/DocFacts';
import DocLinks from '@/shared/components/docs/DocLinks';
import DocList from '@/shared/components/docs/DocList';
import DocNote from '@/shared/components/docs/DocNote';
import DocStages from '@/shared/components/docs/DocStages';
import DocTable from '@/shared/components/docs/DocTable';
import { cn } from '@/shared/utils/cn';

interface DocBlocksProps {
  blocks: DocBlock[];
  /** Used to resolve a block's repo-relative `path` into a GitHub link. */
  tool: ToolEntry;
  className?: string;
}

/**
 * DocBlocks — renders a section's typed blocks in order.
 *
 * This is the single presentation path for all 14 tool pages: the data files
 * decide what a page says, this decides how it looks. Vertical rhythm comes
 * from one consistent gap so sections read as a document rather than as a
 * stack of independently styled components.
 */
const DocBlocks: React.FC<DocBlocksProps> = ({ blocks, tool, className }) => (
  <div className={cn('space-y-5', className)}>
    {blocks.map((block, index) => {
      switch (block.kind) {
        case 'prose':
          return (
            <p
              key={index}
              className="text-sm leading-[2] text-text-secondary md:text-base md:leading-[2.2]"
            >
              {block.text}
            </p>
          );

        case 'subheading':
          return (
            <h3
              key={index}
              className="pt-3 text-xl font-black uppercase tracking-tight text-accent md:text-2xl"
            >
              {block.text}
            </h3>
          );

        case 'code':
          return (
            <DocCode
              key={index}
              code={block.code}
              lang={block.lang}
              filename={block.filename}
              sourceUrl={block.path ? repoFileUrl(tool, block.path) : undefined}
              caption={block.caption}
              maxHeight={block.maxHeight}
            />
          );

        case 'command':
          return (
            <DocCommand key={index} command={block.command} note={block.note} />
          );

        case 'commands':
          return (
            <div key={index} className="space-y-2">
              {block.title && (
                <p className="font-mono text-[11px] font-black uppercase tracking-[0.16em] text-text-muted">
                  {block.title}
                </p>
              )}
              <div className="space-y-2">
                {block.items.map((item) => (
                  <DocCommand
                    key={item.command}
                    command={item.command}
                    note={item.note}
                  />
                ))}
              </div>
            </div>
          );

        case 'table':
          return (
            <DocTable
              key={index}
              columns={block.columns}
              rows={block.rows}
              caption={block.caption}
            />
          );

        case 'note':
          return (
            <DocNote key={index} variant={block.variant} title={block.title}>
              {block.text}
            </DocNote>
          );

        case 'list':
          return <DocList key={index} items={block.items} ordered={block.ordered} />;

        case 'facts':
          return <DocFacts key={index} items={block.items} />;

        case 'definitions':
          return <DocDefinitions key={index} items={block.items} />;

        case 'stages':
          return <DocStages key={index} items={block.items} />;

        case 'links':
          return <DocLinks key={index} items={block.items} />;

        default:
          return null;
      }
    })}
  </div>
);

export default DocBlocks;
