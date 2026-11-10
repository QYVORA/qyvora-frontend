/**
 * DIAGRAM ANIMATION ENGINE
 * ========================
 * 
 * Orchestrates staged animations for educational diagrams.
 * Handles packet flows, signal propagation, state transitions, and path highlighting.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  AnimationConfig,
  AnimationStage,
  AnimationAction,
  DiagramNode,
  DiagramEdge,
  NodeState,
} from '../types';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

export interface AnimationState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStageIndex: number;
  currentStage: AnimationStage | null;
  progress: number; // 0-100
  speed: number; // Playback speed multiplier
}

export interface AnimationControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  replay: () => void;
  nextStage: () => void;
  prevStage: () => void;
  setSpeed: (speed: number) => void;
  goToStage: (index: number) => void;
}

export interface UseAnimationEngineResult {
  state: AnimationState;
  controls: AnimationControls;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

/**
 * Animation Engine Hook
 * 
 * Manages the animation lifecycle and applies animation actions to diagram elements.
 */
export function useAnimationEngine(
  initialNodes: DiagramNode[],
  initialEdges: DiagramEdge[],
  config?: AnimationConfig
): UseAnimationEngineResult {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = config?.respectReducedMotion !== false && !prefersReducedMotion;
  
  // Animation state
  const [state, setState] = useState<AnimationState>({
    isPlaying: false,
    isPaused: false,
    currentStageIndex: -1,
    currentStage: null,
    progress: 0,
    speed: config?.speed || 1,
  });
  
  // Diagram elements state
  const [nodes, setNodes] = useState<DiagramNode[]>(initialNodes);
  const [edges, setEdges] = useState<DiagramEdge[]>(initialEdges);
  
  // Animation timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stageStartTimeRef = useRef<number>(0);
  
  // Clear any active timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // Reset diagram to initial state
  const resetDiagram = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);
  
  // Apply a single animation action
  const applyAction = useCallback((action: AnimationAction) => {
    switch (action.type) {
      case 'node-highlight':
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === action.nodeId
              ? { ...node, state: action.highlight ? 'highlighted' : 'normal' }
              : node
          )
        );
        break;
        
      case 'edge-animate':
        setEdges((prevEdges) =>
          prevEdges.map((edge) =>
            edge.id === action.edgeId
              ? { ...edge, animated: true, state: 'transmitting' }
              : edge
          )
        );
        break;
        
      case 'node-state-change':
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === action.nodeId
              ? { ...node, state: action.state as NodeState }
              : node
          )
        );
        break;
        
      case 'path-highlight':
        if (action.highlight) {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              action.nodeIds.includes(node.id)
                ? { ...node, state: 'highlighted' }
                : node
            )
          );
          setEdges((prevEdges) =>
            prevEdges.map((edge) =>
              action.edgeIds.includes(edge.id)
                ? { ...edge, state: 'highlighted' }
                : edge
            )
          );
        } else {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              action.nodeIds.includes(node.id)
                ? { ...node, state: 'normal' }
                : node
            )
          );
          setEdges((prevEdges) =>
            prevEdges.map((edge) =>
              action.edgeIds.includes(edge.id)
                ? { ...edge, state: 'normal' }
                : edge
            )
          );
        }
        break;
        
      case 'pause':
        // Pause is handled by stage timing
        break;
    }
  }, []);
  
  // Execute a stage
  const executeStage = useCallback((stage: AnimationStage) => {
    // Apply all actions in the stage
    stage.actions.forEach(applyAction);
    
    setState((prev) => ({
      ...prev,
      currentStage: stage,
      progress: 0,
    }));
    
    stageStartTimeRef.current = Date.now();
    
    // Schedule next stage or completion
    const adjustedDuration = stage.duration / state.speed;
    
    timerRef.current = setTimeout(() => {
      setState((prev) => {
        const nextIndex = prev.currentStageIndex + 1;
        const stages = config?.stages || [];
        
        if (nextIndex < stages.length) {
          // Move to next stage
          return {
            ...prev,
            currentStageIndex: nextIndex,
            progress: 0,
          };
        } else {
          // Animation complete
          if (config?.loop) {
            // Loop back to start
            return {
              ...prev,
              currentStageIndex: 0,
              progress: 0,
            };
          } else {
            // Stop
            return {
              ...prev,
              isPlaying: false,
              currentStageIndex: -1,
              currentStage: null,
              progress: 100,
            };
          }
        }
      });
    }, adjustedDuration);
  }, [config, state.speed, applyAction]);
  
  // Execute current stage when index changes
  useEffect(() => {
    if (!shouldAnimate || !config?.stages) return;
    
    if (state.isPlaying && !state.isPaused && state.currentStageIndex >= 0) {
      const stage = config.stages[state.currentStageIndex];
      if (stage) {
        executeStage(stage);
      }
    }
    
    return () => clearTimer();
  }, [state.isPlaying, state.isPaused, state.currentStageIndex, config, shouldAnimate, executeStage, clearTimer]);
  
  // Animation controls
  const controls: AnimationControls = {
    play: useCallback(() => {
      if (!shouldAnimate || !config?.stages?.length) return;
      
      setState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentStageIndex: prev.currentStageIndex === -1 ? 0 : prev.currentStageIndex,
      }));
    }, [config, shouldAnimate]),
    
    pause: useCallback(() => {
      clearTimer();
      setState((prev) => ({
        ...prev,
        isPaused: true,
      }));
    }, [clearTimer]),
    
    stop: useCallback(() => {
      clearTimer();
      resetDiagram();
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentStageIndex: -1,
        currentStage: null,
        progress: 0,
      }));
    }, [clearTimer, resetDiagram]),
    
    replay: useCallback(() => {
      clearTimer();
      resetDiagram();
      setState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentStageIndex: 0,
        progress: 0,
      }));
    }, [clearTimer, resetDiagram]),
    
    nextStage: useCallback(() => {
      if (!config?.stages) return;
      
      setState((prev) => {
        const nextIndex = Math.min(prev.currentStageIndex + 1, config.stages!.length - 1);
        return {
          ...prev,
          currentStageIndex: nextIndex,
          isPaused: true,
        };
      });
    }, [config]),
    
    prevStage: useCallback(() => {
      setState((prev) => {
        const prevIndex = Math.max(prev.currentStageIndex - 1, 0);
        return {
          ...prev,
          currentStageIndex: prevIndex,
          isPaused: true,
        };
      });
    }, []),
    
    setSpeed: useCallback((speed: number) => {
      setState((prev) => ({
        ...prev,
        speed: Math.max(0.25, Math.min(4, speed)), // Clamp between 0.25x and 4x
      }));
    }, []),
    
    goToStage: useCallback((index: number) => {
      if (!config?.stages) return;
      
      const clampedIndex = Math.max(0, Math.min(index, config.stages.length - 1));
      setState((prev) => ({
        ...prev,
        currentStageIndex: clampedIndex,
        isPaused: true,
      }));
    }, [config]),
  };
  
  // Auto-play on mount if configured
  useEffect(() => {
    if (config?.autoPlay && shouldAnimate && config.stages?.length) {
      controls.play();
    }
    
    return () => clearTimer();
  }, [config?.autoPlay, shouldAnimate]); // Only run on mount
  
  // Update nodes/edges when initialNodes/initialEdges change
  useEffect(() => {
    if (!state.isPlaying) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, state.isPlaying]);
  
  return {
    state,
    controls,
    nodes,
    edges,
  };
}
