/**
 * MENTAL MODEL BLOCK
 * ==================
 * Teaches relationships between concepts as a node/link map.
 * Renders nodes in a vertical flow with labelled connections.
 */

import React from 'react';
import { Network, ArrowDown } from 'lucide-react';
import type { MentalModelBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const MentalModelBlockComponent: React.FC<BlockRendererProps<MentalModelBlock>> = ({ block }) => {
  const title = block.title ?? 'Mental Model';
  const nodesById = new Map(block.nodes.map((n) => [n.id, n]));

  return (
    <div className="rounded-2xl border border-border/50 bg-bg-card px-5 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">{title}</p>
      </div>

      {block.nodes.length > 0 && (
        <ul className="space-y-3" role="list">
          {block.nodes.map((node, i) => {
            const outgoing = block.connections.filter((c) => c.from === node.id);
            return (
              <li key={node.id}>
                <div className="rounded-xl border border-border/40 bg-bg-elevated px-4 py-3">
                  <p className="text-sm md:text-base font-black text-text-primary">{node.label}</p>
                  {node.description && (
                    <p className="mt-1 text-sm font-mono text-text-secondary leading-relaxed">{node.description}</p>
                  )}
                </div>
                {outgoing.length > 0 && (
                  <div className="ml-4 mt-1.5 space-y-1.5">
                    {outgoing.map((conn, ci) => {
                      const target = nodesById.get(conn.to);
                      return (
                        <div key={ci} className="flex items-center gap-2 pl-2">
                          <ArrowDown className="w-3 h-3 text-accent shrink-0" aria-hidden="true" />
                          <span className="text-xs font-mono text-text-muted">
                            {conn.label ? <>{conn.label} — </> : null}
                            {target?.label ?? conn.to}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {i < block.nodes.length - 1 && outgoing.length === 0 && (
                  <div className="ml-4 mt-1.5 flex items-center gap-2 pl-2">
                    <ArrowDown className="w-3 h-3 text-text-muted shrink-0" aria-hidden="true" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {block.caption && <p className="mt-4 text-sm font-mono text-text-muted leading-relaxed">{block.caption}</p>}
    </div>
  );
};

export default MentalModelBlockComponent;