/**
 * DIAGRAM BLOCK
 * =============
 * Generic diagram renderer. Flow/sequence/network payloads render through the
 * shared FlowDiagram/DiagramFrame primitives; kill-chain payloads render through
 * the existing KillChainDiagramSimple. Unknown payloads fall back to JSON.
 */

import React from 'react';
import { ChartSpline } from 'lucide-react';
import type { DiagramBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import {
  FlowDiagram,
  type FlowArrow,
  type FlowNode,
} from '@/shared/components/diagrams/FlowDiagram';
import { KillChainDiagramSimple } from '@/shared/components/diagrams/KillChainDiagram';
import { DiagramFrame } from '@/shared/components/diagrams/DiagramFrame';

interface FlowPayload {
  nodes: FlowNode[];
  arrows?: FlowArrow[];
  connections?: Array<{ from: string; to: string; label?: string }>;
  direction?: 'horizontal' | 'vertical';
}

interface KillChainPayload {
  variant: 'kill-chain';
  phases: string[];
  currentPhaseIndex?: number;
  completedPhaseIds?: string[];
}

const isFlowPayload = (content: any): content is FlowPayload =>
  Boolean(content && Array.isArray(content.nodes));

const isKillChainPayload = (content: any): content is KillChainPayload =>
  Boolean(content && content.variant === 'kill-chain' && Array.isArray(content.phases));

export const DiagramBlockComponent: React.FC<BlockRendererProps<DiagramBlock>> = ({ block }) => {
  const title = block.title ?? 'Diagram';
  const { diagramType, content, caption } = block;

  if (isKillChainPayload(content)) {
    return (
      <KillChainDiagramSimple
        phases={content.phases}
        currentPhaseIndex={content.currentPhaseIndex}
        completedPhaseIds={content.completedPhaseIds}
      />
    );
  }

  if (isFlowPayload(content)) {
    const arrows: FlowArrow[] =
      content.arrows ??
      (content.connections ?? []).map((connection) => ({
        from: connection.from,
        to: connection.to,
        label: connection.label,
      }));

    return (
      <FlowDiagram
        title={title}
        nodes={content.nodes}
        arrows={arrows}
        direction={content.direction ?? (diagramType === 'flow' ? 'horizontal' : 'vertical')}
        caption={caption}
      />
    );
  }

  return (
    <DiagramFrame title={title} icon={<ChartSpline className="w-4 h-4 text-accent" />}>
      <div className="mb-3 flex items-center gap-2">
        <span className="ml-auto rounded-md border border-border/30 bg-bg-elevated px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-text-muted">
          {diagramType}
        </span>
      </div>
      <div className="wc-code overflow-x-auto rounded-xl border border-border/40 bg-bg p-4">
        <pre className="text-xs font-mono text-text-secondary leading-relaxed">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
      {caption && <p className="mt-4 text-base font-mono text-text-muted leading-relaxed">{caption}</p>}
    </DiagramFrame>
  );
};

export default DiagramBlockComponent;
