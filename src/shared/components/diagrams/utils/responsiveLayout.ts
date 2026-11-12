/**
 * RESPONSIVE DIAGRAM LAYOUT
 * =========================
 *
 * Pure helpers that decide whether a diagram should be re-laid-out into a
 * vertical stack for narrow viewports, and compute the resulting geometry.
 *
 * A diagram authored for a wide canvas (e.g. a horizontal network topology)
 * turns into a horizontal strip on a phone. When the container is narrow — or
 * the authored bounding box is wider than the container — we remap the nodes
 * to a single vertical column so the diagram stays readable with no horizontal
 * scrolling.
 */

import type { DiagramNode } from '../types';

export const RESPONSIVE_BREAKPOINT = 640;

const NODE_WIDTH = 180;
const NODE_HEIGHT = 88;
const GAP_X = 56;
const GAP_Y = 48;
const PADDING = 48;

export interface LayoutBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface ResponsiveLayoutResult {
  /** Nodes with resolved (and possibly remapped) positions. */
  nodes: DiagramNode[];
  /** Whether the nodes were remapped into a vertical stack. */
  stacked: boolean;
  /** Bounding box of the laid-out nodes. */
  bounds: LayoutBounds;
  /** Suggested canvas height in px (before CSS clamping). */
  canvasHeight: number;
  /** True when the laid-out content fits the container without panning. */
  fits: boolean;
}

/**
 * Resolve a position for every node. Nodes without an authored position fall
 * back to a deterministic left-to-right row so the result is stable.
 */
export function resolvePositions(nodes: DiagramNode[]): DiagramNode[] {
  return nodes.map((node, index) => ({
    ...node,
    position: node.position ?? { x: index * (NODE_WIDTH + GAP_X), y: 0 },
  }));
}

export function layoutBounds(nodes: DiagramNode[]): LayoutBounds {
  const positioned = nodes.filter((n) => n.position);
  if (positioned.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const node of positioned) {
    const { x, y } = node.position!;
    const width = node.style?.width || NODE_WIDTH;
    const height = node.style?.height || NODE_HEIGHT;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Remap nodes to a single vertical column. Order is by original x first, then
 * y — so a two-column diagram stacks the left column in sequence, followed by
 * the right column.
 */
export function stackNodes(nodes: DiagramNode[]): DiagramNode[] {
  const positioned = resolvePositions(nodes);
  const ordered = [...positioned].sort((a, b) => {
    const ax = a.position!.x;
    const bx = b.position!.x;
    if (ax !== bx) return ax - bx;
    return a.position!.y - b.position!.y;
  });

  return ordered.map((node, index) => ({
    ...node,
    position: { x: 0, y: index * (NODE_HEIGHT + GAP_Y) },
  }));
}

export function shouldStack(
  nodes: DiagramNode[],
  containerWidth: number,
  breakpoint: number = RESPONSIVE_BREAKPOINT
): boolean {
  if (!Number.isFinite(containerWidth) || containerWidth <= 0) return false;
  if (containerWidth < breakpoint) return true;
  const bounds = layoutBounds(resolvePositions(nodes));
  return bounds.width > containerWidth;
}

/**
 * Compute the responsive layout for a set of nodes.
 *
 * @param mode `'auto'` restacks on narrow containers; `'manual'` keeps the
 *   authored positions untouched.
 */
export function responsiveLayout(
  nodes: DiagramNode[],
  containerWidth: number,
  mode: 'auto' | 'manual' = 'auto'
): ResponsiveLayoutResult {
  if (mode === 'manual') {
    const resolved = resolvePositions(nodes);
    const bounds = layoutBounds(resolved);
    return {
      nodes: resolved,
      stacked: false,
      bounds,
      canvasHeight: bounds.height + PADDING * 2,
      fits: true,
    };
  }

  const stacked = shouldStack(nodes, containerWidth);
  const laidOut = stacked ? stackNodes(nodes) : resolvePositions(nodes);
  const bounds = layoutBounds(laidOut);
  const canvasHeight = stacked
    ? laidOut.length * NODE_HEIGHT + Math.max(0, laidOut.length - 1) * GAP_Y + PADDING * 2
    : bounds.height + PADDING * 2;

  return {
    nodes: laidOut,
    stacked,
    bounds,
    canvasHeight,
    fits: !stacked,
  };
}
