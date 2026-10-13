/**
 * DIAGRAM BLOCK
 * =============
 * Generic diagram renderer. Supports a `nodes`+`connections` graph payload
 * (flow/sequence/network) and falls back to a serialised view for custom data.
 */

import React from 'react';
import { ChartSpline } from 'lucide-react';
import type { DiagramBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

interface NamedNode {
  id: string;
  label?: string;
  description?: string;
}

interface NamedConnection {
  from: string;
  to: string;
  label?: string;
}

const isGraphPayload = (content: any): content is { nodes: NamedNode[]; connections?: NamedConnection[] } =>
  Boolean(content && Array.isArray(content.nodes));

export const DiagramBlockComponent: React.FC<BlockRendererProps<DiagramBlock>> = ({ block }) => {
  const title = block.title ?? 'Diagram';
  const { diagramType } = block;

  return (
    <div className="rounded-2xl border border-border/50 bg-bg-card px-5 py-4">
      <div className="flex items-center gap-2 mb-4">
        <ChartSpline className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">{title}</p>
        <span className="ml-auto rounded-md border border-border/30 bg-bg-elevated px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-text-muted">
          {diagramType}
        </span>
      </div>

      {isGraphPayload(block.content) ? (
        <ol className="space-y-3" role="list">
          {block.content.nodes.map((node) => {
            const outgoing = (block.content?.connections ?? []).filter((c) => c.from === node.id);
            return (
              <li key={node.id}>
                <div className="rounded-xl border border-accent/25 bg-accent-dim px-4 py-3">
                  <p className="text-sm font-black text-text-primary">{node.label ?? node.id}</p>
                  {node.description && <p className="mt-1 text-sm font-mono text-text-secondary leading-[2]">{node.description}</p>}
                </div>
                {outgoing.length > 0 && (
                  <div className="ml-4 mt-1.5 space-y-1 text-xs font-mono text-text-muted">
                    {outgoing.map((c, i) => (
                      <p key={i}>
                        → {c.label ? `${c.label} ` : ''}{block.content?.nodes.find((n) => n.id === c.to)?.label ?? c.to}
                      </p>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="wc-code overflow-x-auto rounded-xl border border-border/40 bg-bg p-4">
          <pre className="text-xs font-mono text-text-secondary leading-[2]">
            {JSON.stringify(block.content, null, 2)}
          </pre>
        </div>
      )}

      {block.caption && <p className="mt-4 text-sm font-mono text-text-muted leading-[2]">{block.caption}</p>}
    </div>
  );
};

export default DiagramBlockComponent;