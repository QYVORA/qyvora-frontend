/**
 * BLOCK REGISTRY
 * ==============
 * Registry of available learning block types and their renderers.
 * This allows dynamic block rendering based on block type.
 */

import type { LearningBlock, BlockType } from '../types/blocks';
import type { ComponentType } from 'react';

export interface BlockRendererProps<T extends LearningBlock = LearningBlock> {
  block: T;
  context?: BlockRenderContext;
}

export interface BlockRenderContext {
  /** Surface type (bootcamp, course, lab) */
  surface: 'bootcamp' | 'course' | 'lab';
  
  /** Current unit context */
  sequenceId: string;
  unitId: string;
  
  /** Progress callbacks */
  onCheckpointSubmit?: (blockId: string, answer: any) => Promise<{ correct: boolean }>;
  onComplete?: (unitId: string) => void;
  
  /** Lab-specific context */
  labId?: string;
  
  /** Additional surface-specific context */
  metadata?: Record<string, any>;
}

interface BlockRegistryEntry {
  type: BlockType;
  component: ComponentType<BlockRendererProps<any>>;
  description: string;
}

class BlockRegistry {
  private registry = new Map<BlockType, BlockRegistryEntry>();
  
  register(entry: BlockRegistryEntry): void {
    if (this.registry.has(entry.type)) {
      console.warn(`Block type "${entry.type}" is already registered. Overwriting.`);
    }
    this.registry.set(entry.type, entry);
  }
  
  getRenderer(type: BlockType): ComponentType<BlockRendererProps<any>> | null {
    const entry = this.registry.get(type);
    return entry?.component ?? null;
  }
  
  isRegistered(type: BlockType): boolean {
    return this.registry.has(type);
  }
  
  getAllTypes(): BlockType[] {
    return Array.from(this.registry.keys());
  }
  
  getDescription(type: BlockType): string | null {
    const entry = this.registry.get(type);
    return entry?.description ?? null;
  }
}

// Global singleton instance
export const blockRegistry = new BlockRegistry();

// Helper to ensure a block type is registered
export function assertBlockRegistered(type: BlockType): void {
  if (!blockRegistry.isRegistered(type)) {
    throw new Error(
      `Block type "${type}" is not registered. ` +
      `Make sure to import the block component before using it.`
    );
  }
}
