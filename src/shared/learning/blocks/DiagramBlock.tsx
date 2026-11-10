/**
 * DIAGRAM BLOCK COMPONENT
 * =======================
 *
 * Learning block for interactive technical diagrams.
 * Integrates the QYVORA diagram system with the semantic content architecture.
 */

import React from 'react';
import type { DiagramBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import { Diagram } from '@/shared/components/diagrams';
import type { DiagramDefinition } from '@/shared/components/diagrams';

export const DiagramBlockComponent: React.FC<BlockRendererProps<DiagramBlock>> = ({ block }) => {
  // Convert DiagramBlock content to DiagramDefinition
  const diagramDefinition: DiagramDefinition = {
    ...block.content,
    // Ensure required fields are present
    id: block.content.id || block.id,
    renderer: block.content.renderer || 'react-flow',
  };

  return (
    <div className="my-6 md:my-8">
      {block.title && (
        <h4 className="text-base md:text-lg font-black uppercase tracking-tight mb-4 text-text-primary">
          {block.title}
        </h4>
      )}

      <Diagram
        definition={diagramDefinition}
        className="wc-diagram"
        showControls={diagramDefinition.animation !== undefined}
        showLegend={diagramDefinition.legend !== undefined}
      />

      {block.caption && (
        <p className="mt-3 text-xs text-text-muted font-mono text-center">
          {block.caption}
        </p>
      )}
    </div>
  );
};

export default DiagramBlockComponent;
