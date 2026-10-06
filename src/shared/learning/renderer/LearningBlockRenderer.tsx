/**
 * LEARNING BLOCK RENDERER
 * ========================
 * Dispatches individual learning blocks to their appropriate renderers.
 */

import React from 'react';
import type { LearningBlock } from '../types/blocks';
import type { BlockRenderContext } from '../utils/blockRegistry';
import { blockRegistry, assertBlockRegistered } from '../utils/blockRegistry';

export interface LearningBlockRendererProps {
  block: LearningBlock;
  context?: BlockRenderContext;
}

/**
 * Renders a single learning block by looking up its registered component.
 * 
 * This is the central dispatch point for all block rendering.
 * Each block type must be registered in the blockRegistry before use.
 */
export const LearningBlockRenderer: React.FC<LearningBlockRendererProps> = ({
  block,
  context,
}) => {
  // Get the registered renderer component for this block type
  const BlockComponent = blockRegistry.getRenderer(block.type);
  
  // Handle unregistered block types gracefully
  if (!BlockComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`No renderer registered for block type: ${block.type}`);
      return (
        <div className="rounded-xl border-2 border-danger/40 bg-danger/5 px-4 py-3 font-mono text-sm text-danger">
          <strong>Error:</strong> No renderer registered for block type "{block.type}".
          <br />
          Block ID: {block.id}
        </div>
      );
    }
    // In production, silently skip unknown block types
    return null;
  }
  
  // Render the block with its registered component
  return <BlockComponent block={block} context={context} />;
};

export default LearningBlockRenderer;
