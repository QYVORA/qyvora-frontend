import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';
import { DiagramFrame } from './DiagramFrame';

export interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  status?: 'default' | 'active' | 'completed' | 'danger' | 'warning' | 'success';
}

export interface FlowArrow {
  from: string;
  to: string;
  label?: string;
  type?: 'solid' | 'dashed' | 'dotted';
}

interface FlowDiagramProps {
  nodes: FlowNode[];
  arrows: FlowArrow[];
  direction?: 'horizontal' | 'vertical';
  title?: string;
  icon?: ReactNode;
  caption?: string;
  className?: string;
  /** Smaller nodes and arrows for section maps with many items. */
  compact?: boolean;
}

const STATUS_STYLES = {
  default: 'border-border/40 bg-bg-elevated text-text-secondary',
  active: 'border-accent/60 bg-accent/10 text-accent',
  completed: 'border-success/60 bg-success/10 text-success',
  danger: 'border-danger/60 bg-danger/10 text-danger',
  warning: 'border-warning/60 bg-warning/10 text-warning',
  success: 'border-accent/60 bg-accent/10 text-accent',
};

const NODE_SIZE = 'w-32 h-24 md:w-40 md:h-28';
const COMPACT_NODE_SIZE = 'w-24 h-20 md:w-[7.5rem] md:h-24';

function FlowArrowHorizontal({ arrow, compact = false }: { arrow: FlowArrow; compact?: boolean }) {
  const dashStyle = arrow.type === 'dashed' ? 'stroke-dasharray="6 3"' : arrow.type === 'dotted' ? 'stroke-dasharray="2 2"' : '';
  const width = compact ? 32 : 60;
  return (
    <div className="flex flex-col items-center justify-center px-1">
      <svg width={width} height="24" viewBox={`0 0 ${width} 24`} className="shrink-0">
        <defs>
          <marker id={`arrowhead-${arrow.from}-${arrow.to}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="currentColor" className="text-accent/60" />
          </marker>
        </defs>
        <line
          x1="0" y1="12" x2={width - 10} y2="12"
          stroke="currentColor"
          strokeWidth="2"
          className="text-accent/40"
          {...(dashStyle ? { style: { strokeDasharray: arrow.type === 'dashed' ? '6 3' : '2 2' } } : {})}
          markerEnd={`url(#arrowhead-${arrow.from}-${arrow.to})`}
        />
      </svg>
      {arrow.label && (
        <span className="text-xs font-mono text-text-muted/60 mt-0.5 whitespace-nowrap">{arrow.label}</span>
      )}
    </div>
  );
}

function FlowArrowVertical({ arrow }: { arrow: FlowArrow }) {
  return (
    <div className="flex items-center justify-center py-1">
      <svg width="24" height="40" viewBox="0 0 24 40" className="shrink-0">
        <defs>
          <marker id={`arrowhead-v-${arrow.from}-${arrow.to}`} markerWidth="6" markerHeight="8" refX="3" refY="0" orient="auto">
            <polygon points="0 0, 6 0, 3 8" fill="currentColor" className="text-accent/60" />
          </marker>
        </defs>
        <line
          x1="12" y1="0" x2="12" y2="32"
          stroke="currentColor"
          strokeWidth="2"
          className="text-accent/40"
          markerEnd={`url(#arrowhead-v-${arrow.from}-${arrow.to})`}
        />
      </svg>
      {arrow.label && (
        <span className="absolute text-xs font-mono text-text-muted/60 ml-8">{arrow.label}</span>
      )}
    </div>
  );
}

function FlowNodeBox({ node, compact = false }: { node: FlowNode; compact?: boolean }) {
  return (
    <div className={cn(
      compact ? COMPACT_NODE_SIZE : NODE_SIZE,
      'rounded-xl border flex flex-col items-center justify-center text-center px-2 transition-[border-color,background-color,color,box-shadow,transform]',
      STATUS_STYLES[node.status || 'default'],
    )}>
      {node.icon && (
        <span className="text-lg leading-none mb-1 flex items-center justify-center">
          {node.icon}
        </span>
      )}
      <span className={cn('font-black uppercase tracking-wide leading-tight', compact ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm')}>{node.label}</span>
      {node.sublabel && (
        <span className={cn('font-mono opacity-70 mt-1', compact ? 'text-[10px] md:text-[11px]' : 'text-[11px] md:text-xs')}>{node.sublabel}</span>
      )}
    </div>
  );
}

export function FlowDiagram({ nodes, arrows, direction = 'horizontal', title, icon, caption, className, compact = false }: FlowDiagramProps) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const ArrowComponent = direction === 'horizontal' ? FlowArrowHorizontal : FlowArrowVertical;

  if (direction === 'horizontal') {
    return (
      <DiagramFrame title={title} icon={icon} className={cn('overflow-x-auto p-4 md:p-6', className)}>
        <div className="flex items-center min-w-max gap-0">
          {arrows.map((arrow, i) => {
            const fromNode = nodeMap.get(arrow.from);
            const toNode = nodeMap.get(arrow.to);
            if (!fromNode || !toNode) return null;
            return (
              <div key={i} className="flex items-center">
                {i === 0 && <FlowNodeBox node={fromNode} compact={compact} />}
                <ArrowComponent arrow={arrow} compact={compact} />
                <FlowNodeBox node={toNode} compact={compact} />
              </div>
            );
          })}
        </div>
        {caption && <p className="mt-3 text-center text-xs font-mono text-text-muted">{caption}</p>}
      </DiagramFrame>
    );
  }

  return (
    <DiagramFrame title={title} icon={icon} className={className}>
      <div className="flex flex-col items-center gap-0">
        {arrows.map((arrow, i) => {
          const fromNode = nodeMap.get(arrow.from);
          const toNode = nodeMap.get(arrow.to);
          if (!fromNode || !toNode) return null;
          return (
            <div key={i} className="flex flex-col items-center">
              {i === 0 && <FlowNodeBox node={fromNode} compact={compact} />}
              <ArrowComponent arrow={arrow} compact={compact} />
              <FlowNodeBox node={toNode} compact={compact} />
            </div>
          );
        })}
      </div>
      {caption && <p className="mt-3 text-center text-xs font-mono text-text-muted">{caption}</p>}
    </DiagramFrame>
  );
}
