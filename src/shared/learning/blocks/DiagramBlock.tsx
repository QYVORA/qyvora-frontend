/**
 * DIAGRAM BLOCK COMPONENT
 * =======================
 *
 * Learning block for interactive technical diagrams.
 * Integrates the QYVORA diagram system with the semantic content architecture.
 */

import React, { Suspense, lazy, useState } from 'react';
import { X } from 'lucide-react';
import type { DiagramBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import type { DiagramDefinition, DiagramNode } from '@/shared/components/diagrams';

const Diagram = lazy(() =>
  import('@/shared/components/diagrams').then((m) => ({ default: m.Diagram }))
);

function DiagramSkeleton() {
  return (
    <div
      className="diagram-canvas animate-pulse rounded-2xl border border-border bg-bg-card"
      style={{ height: 'clamp(260px, 360px, 70dvh)' }}
      role="status"
      aria-label="Loading diagram"
    />
  );
}

function nodeExplanation(node: DiagramNode): string | undefined {
  const fromMetadata = (node.metadata as { explanation?: string } | undefined)?.explanation;
  return fromMetadata ?? node.tooltip;
}

export const DiagramBlockComponent: React.FC<BlockRendererProps<DiagramBlock>> = ({ block }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Convert DiagramBlock content to DiagramDefinition
  const diagramDefinition: DiagramDefinition = {
    ...block.content,
    // Ensure required fields are present
    id: block.content.id || block.id,
    renderer: block.content.renderer || 'react-flow',
  };

  const selectedNode = selectedNodeId
    ? diagramDefinition.nodes.find((node) => node.id === selectedNodeId)
    : undefined;
  const selectedExplanation = selectedNode ? nodeExplanation(selectedNode) : undefined;

  return (
    <div className="my-6 md:my-8">
      {block.title && (
        <h4 className="text-base md:text-lg font-black uppercase tracking-tight mb-4 text-text-primary">
          {block.title}
        </h4>
      )}

      <Suspense fallback={<DiagramSkeleton />}>
        <Diagram
          definition={diagramDefinition}
          className="wc-diagram"
          showControls={diagramDefinition.animation !== undefined}
          showLegend={diagramDefinition.legend !== undefined}
          onNodeClick={setSelectedNodeId}
        />
      </Suspense>

      {selectedNode && selectedExplanation && (
        <div className="mt-3 flex items-start gap-3 rounded-xl border border-border bg-bg-card px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-tight text-accent">
              {selectedNode.label}
            </p>
            <p className="mt-1 text-sm text-text-secondary font-mono leading-relaxed">
              {selectedExplanation}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedNodeId(null)}
            className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Close node details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {block.caption && (
        <p className="mt-3 text-xs text-text-muted font-mono text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
};

export default DiagramBlockComponent;
