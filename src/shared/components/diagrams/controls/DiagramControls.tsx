/**
 * DIAGRAM CONTROLS
 * ================
 * 
 * Interactive controls for diagram animations and interactions.
 */

import React, { memo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
  Gauge,
} from 'lucide-react';
import type { AnimationState, AnimationControls } from '../animations/useAnimationEngine';
import type { InteractionConfig } from '../types';

export interface DiagramControlsProps {
  animationState: AnimationState;
  animationControls: AnimationControls;
  interactionConfig?: InteractionConfig;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const DiagramControls = memo<DiagramControlsProps>(({
  animationState,
  animationControls,
  interactionConfig,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const { isPlaying, isPaused, currentStage, speed } = animationState;
  const { play, pause, stop, replay, nextStage, prevStage, setSpeed } = animationControls;
  
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };
  
  return (
    <div className="diagram-controls diagram-controls-bottom-right">
      {/* Animation controls */}
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        {!isPlaying || isPaused ? (
          <button
            onClick={play}
            className="diagram-control-btn"
            aria-label="Play animation"
            title="Play"
          >
            <Play size={18} />
          </button>
        ) : (
          <button
            onClick={pause}
            className="diagram-control-btn diagram-control-btn-active"
            aria-label="Pause animation"
            title="Pause"
          >
            <Pause size={18} />
          </button>
        )}
        
        {/* Stop/Replay */}
        <button
          onClick={isPlaying ? stop : replay}
          className="diagram-control-btn"
          aria-label={isPlaying ? 'Stop animation' : 'Replay animation'}
          title={isPlaying ? 'Stop' : 'Replay'}
        >
          <RotateCcw size={18} />
        </button>
        
        {/* Previous stage */}
        <button
          onClick={prevStage}
          className="diagram-control-btn"
          aria-label="Previous stage"
          title="Previous"
          disabled={!currentStage}
        >
          <SkipBack size={18} />
        </button>
        
        {/* Next stage */}
        <button
          onClick={nextStage}
          className="diagram-control-btn"
          aria-label="Next stage"
          title="Next"
          disabled={!currentStage}
        >
          <SkipForward size={18} />
        </button>
        
        {/* Speed control */}
        <div className="relative group">
          <button
            className="diagram-control-btn"
            aria-label="Adjust speed"
            title={`Speed: ${speed}x`}
          >
            <Gauge size={18} />
          </button>
          
          {/* Speed dropdown */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block group-focus-within:block">
            <div className="bg-bg-card border border-border rounded-lg p-2 flex flex-col gap-1 min-w-[100px]">
              <span className="text-xs font-mono text-text-muted mb-1">Speed</span>
              {[0.25, 0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-1 text-xs rounded text-left hover:bg-bg-elevated transition-colors ${
                    speed === s ? 'bg-accent/10 text-accent' : 'text-text-secondary'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Interaction controls */}
      {interactionConfig?.fullscreenable && (
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
          <button
            onClick={onToggleFullscreen}
            className="diagram-control-btn"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      )}
      
      {/* Stage indicator */}
      {currentStage && (
        <div className="absolute bottom-full right-0 mb-2 bg-bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono text-text-secondary max-w-xs">
          {currentStage.description || `Stage ${animationState.currentStageIndex + 1}`}
        </div>
      )}
    </div>
  );
});

DiagramControls.displayName = 'DiagramControls';

export default DiagramControls;
