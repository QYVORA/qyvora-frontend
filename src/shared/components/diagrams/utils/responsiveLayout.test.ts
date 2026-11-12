import { describe, it, expect } from 'vitest';
import type { DiagramNode } from '../types';
import {
  RESPONSIVE_BREAKPOINT,
  resolvePositions,
  layoutBounds,
  stackNodes,
  shouldStack,
  responsiveLayout,
} from './responsiveLayout';

const wideNodes: DiagramNode[] = [
  { id: 'a', type: 'client', label: 'A', position: { x: 0, y: 0 } },
  { id: 'b', type: 'server', label: 'B', position: { x: 400, y: 0 } },
  { id: 'c', type: 'database', label: 'C', position: { x: 800, y: 0 } },
];

const twoColumn: DiagramNode[] = [
  { id: 'top-left', type: 'client', label: 'TL', position: { x: 0, y: 0 } },
  { id: 'bottom-left', type: 'client', label: 'BL', position: { x: 0, y: 200 } },
  { id: 'top-right', type: 'server', label: 'TR', position: { x: 300, y: 0 } },
  { id: 'bottom-right', type: 'server', label: 'BR', position: { x: 300, y: 200 } },
];

describe('resolvePositions', () => {
  it('assigns deterministic fallback positions to nodes without one', () => {
    const nodes: DiagramNode[] = [
      { id: 'a', type: 'client', label: 'A' },
      { id: 'b', type: 'server', label: 'B' },
    ];
    const resolved = resolvePositions(nodes);
    expect(resolved[0].position).toEqual({ x: 0, y: 0 });
    expect(resolved[1].position!.x).toBeGreaterThan(0);
  });
});

describe('layoutBounds', () => {
  it('returns zero bounds for an empty list', () => {
    expect(layoutBounds([])).toEqual({
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0,
    });
  });

  it('measures the authored bounding box', () => {
    const bounds = layoutBounds(resolvePositions(wideNodes));
    expect(bounds.width).toBeGreaterThan(800);
    expect(bounds.height).toBeGreaterThan(0);
  });
});

describe('stackNodes', () => {
  it('stacks every node into a single column', () => {
    const stacked = stackNodes(wideNodes);
    expect(stacked.every((n) => n.position!.x === 0)).toBe(true);
    const ys = stacked.map((n) => n.position!.y);
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
  });

  it('orders by original x first, then y (columns in sequence)', () => {
    const stacked = stackNodes(twoColumn);
    expect(stacked.map((n) => n.id)).toEqual([
      'top-left',
      'bottom-left',
      'top-right',
      'bottom-right',
    ]);
  });
});

describe('shouldStack', () => {
  it('stacks when the container is narrower than the breakpoint', () => {
    expect(shouldStack(wideNodes, RESPONSIVE_BREAKPOINT - 1)).toBe(true);
  });

  it('stacks when the authored box is wider than a wide container', () => {
    expect(shouldStack(wideNodes, 700)).toBe(true);
  });

  it('does not stack when content fits', () => {
    const small: DiagramNode[] = [
      { id: 'a', type: 'client', label: 'A', position: { x: 0, y: 0 } },
    ];
    expect(shouldStack(small, 1024)).toBe(false);
  });

  it('treats an unmeasured container as non-stacking', () => {
    expect(shouldStack(wideNodes, 0)).toBe(false);
  });
});

describe('responsiveLayout', () => {
  it('stacks on narrow containers and grows the canvas height', () => {
    const result = responsiveLayout(wideNodes, 360);
    expect(result.stacked).toBe(true);
    expect(result.fits).toBe(false);
    expect(result.nodes.every((n) => n.position!.x === 0)).toBe(true);
    expect(result.canvasHeight).toBeGreaterThan(260);
  });

  it('keeps authored positions in manual mode', () => {
    const result = responsiveLayout(wideNodes, 360, 'manual');
    expect(result.stacked).toBe(false);
    expect(result.fits).toBe(true);
    expect(result.nodes[1].position).toEqual({ x: 400, y: 0 });
  });

  it('does not stack a small diagram on a wide container', () => {
    const small: DiagramNode[] = [
      { id: 'a', type: 'client', label: 'A', position: { x: 0, y: 0 } },
    ];
    const result = responsiveLayout(small, 1024);
    expect(result.stacked).toBe(false);
    expect(result.fits).toBe(true);
  });
});
