/**
 * RECALL BLOCK
 * ============
 * Concise summary for retention — what to remember.
 * Plain points render as a list; term/definition pairs render as a
 * description list so glossary-style content reads correctly.
 */

import React from 'react';
import { Bookmark } from 'lucide-react';
import type { RecallBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { GameProse } from './GameProse';

function splitDefinition(point: string): { term: string | null; description: string } {
  const match = point.match(/^\s*\*\*([^*]+)\*\*\s*[:.\-–—]\s*([\s\S]*)$/);
  if (!match) return { term: null, description: point };
  return { term: match[1].trim(), description: match[2].trim() };
}

export const RecallBlockComponent: React.FC<BlockRendererProps<RecallBlock>> = ({ block }) => {
  const title = block.title ?? 'Remember';
  const ordered = Boolean(block.ordered);
  const ListTag = ordered ? 'ol' : 'ul';

  // Flattened surface: avoid a nested card inside the task accordion.
  return (
    <div className="border-l-2 border-accent/40 pl-4">
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-accent sm:text-xs">
          {title}
        </p>
      </div>

      {block.variant === 'definition' ? (
        <dl className="space-y-3">
          {block.points.map((point, index) => {
            const { term, description } = splitDefinition(point);
            return (
              <div key={index}>
                {term && (
                  <dt className="font-sans text-sm font-bold text-text-primary">{term}</dt>
                )}
                <dd className={term ? 'mt-0.5' : undefined}>
                  <GameProse text={description} className="min-w-0 text-text-secondary" />
                </dd>
              </div>
            );
          })}
        </dl>
      ) : (
        <ListTag className="space-y-3" role="list">
          {block.points.map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                className="shrink-0 select-none pt-0.5 font-mono text-xs font-black text-accent"
                aria-label={ordered ? `Point ${index + 1}` : undefined}
                aria-hidden={ordered ? undefined : true}
              >
                {ordered ? String(index + 1).padStart(2, '0') : '•'}
              </span>
              <GameProse text={point} className="min-w-0 flex-1 text-text-primary" />
            </li>
          ))}
        </ListTag>
      )}
    </div>
  );
};

export default RecallBlockComponent;
