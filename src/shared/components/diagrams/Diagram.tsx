/**
 * DIAGRAM COMPONENT
 * =================
 * 
 * Main diagram component that orchestrates rendering, animation, and interaction.
 * Automatically selects the appropriate renderer based on diagram type.
 */

import React, { memo, useState, useCallback } from 'react';
import type { DiagramDefinition } from './types';
import { ReactFlowRenderer } from './renderers/ReactFlowRenderer';
import { useAnimationEngine } from './animations/useAnimationEngine';
import { DiagramControls } from './controls/DiagramControls';
import { DiagramLegend } from './controls/DiagramLegend';
import { validateDiagramDefinition, logValidationWarnings } from './utils/validation';

import '@xyflow/react/dist/style.css';
import './styles/diagram.css';

export interface DiagramProps {
  definition: DiagramDefinition;
  className?: string;
  showControls?: boolean;
  showLegend?: boolean;
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
}

/**
 * Diagram — Main component for rendering interactive technical diagrams
 */
export const Diagram = memo<DiagramProps>(({
  definition,
  className = '',
  showControls = true,
  showLegend = true,
  onNodeClick,
  onEdgeClick,
}) => {
  // Validate diagram definition in development
  if (process.env.NODE_ENV === 'development') {
    const validationResult = validateDiagramDefinition(definition);
    if (!validationResult.valid) {
      console.error('Invalid diagram definition:', validationResult.errors);
    }
    logValidationWarnings(definition);
  }
  
  // Animation engine
  const {
    state: animationState,
    controls: animationControls,
    nodes,
    edges,
  } = useAnimationEngine(
    definition.nodes,
    definition.edges,
    definition.animation
  );
  
  // Create animated diagram definition
  const animatedDiagram: DiagramDefinition = {
    ...definition,
    nodes,
    edges,
  };
  
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);
  
  // Select renderer based on diagram type
  const renderDiagram = () => {
    switch (definition.renderer) {
      case 'react-flow':
        return (
          <ReactFlowRenderer
            diagram={animatedDiagram}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            className={isFullscreen ? 'diagram-canvas-fullscreen' : ''}
          />
        );
      
      case 'svg':
        // TODO: Implement SVG renderer
        return (
          <div className="diagram-canvas flex items-center justify-center">
            <p className="text-text-muted">SVG renderer coming soon</p>
          </div>
        );
      
      case 'mermaid':
        // TODO: Implement Mermaid renderer
        return (
          <div className="diagram-canvas flex items-center justify-center">
            <p className="text-text-muted">Mermaid renderer coming soon</p>
          </div>
        );
      
      default:
        return (
          <ReactFlowRenderer
            diagram={animatedDiagram}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
          />
        );
    }
  };
  
  return (
    <div className={`relative w-full ${className}`}>
      {/* Diagram title and description */}
      {(definition.title || definition.description) && (
        <div className="mb-4">
          {definition.title && (
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-text-primary mb-2">
              {definition.title}
            </h3>
          )}
          {definition.description && (
            <p className="text-sm text-text-secondary font-mono">
              {definition.description}
            </p>
          )}
        </div>
      )}
      
      {/* Main diagram */}
      <div className="relative">
        {renderDiagram()}
        
        {/* Controls */}
        {showControls && definition.animation && (
          <DiagramControls
            animationState={animationState}
            animationControls={animationControls}
            interactionConfig={definition.interaction}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        )}
        
        {/* Legend */}
        {showLegend && definition.legend && (
          <DiagramLegend
            legend={definition.legend}
            position={definition.legend.position || 'bottom-right'}
          />
        )}
      </div>
      
      {/* Accessibility label */}
      {definition.accessibility?.ariaLabel && (
        <div className="sr-only" role="img" aria-label={definition.accessibility.ariaLabel}>
          {definition.accessibility.ariaDescription}
        </div>
      )}
    </div>
  );
});

Diagram.displayName = 'Diagram';

export default Diagram;
