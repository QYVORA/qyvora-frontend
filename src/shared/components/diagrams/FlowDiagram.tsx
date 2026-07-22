import { cn } from '@/shared/utils/cn';

export interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
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
  className?: string;
}

const STATUS_STYLES = {
  default: 'border-border/40 bg-bg-elevated text-text-muted',
  active: 'border-accent/50 bg-accent/10 text-accent',
  completed: 'border-green-500/50 bg-green-500/10 text-green-400',
  danger: 'border-red-500/50 bg-red-500/10 text-red-400',
  warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
  success: 'border-accent/50 bg-accent/10 text-accent',
};

const NODE_SIZE = 'w-24 h-16 md:w-32 md:h-20';

function FlowArrowHorizontal({ arrow }: { arrow: FlowArrow }) {
  const dashStyle = arrow.type === 'dashed' ? 'stroke-dasharray="6 3"' : arrow.type === 'dotted' ? 'stroke-dasharray="2 2"' : '';
  return (
    <div className="flex flex-col items-center justify-center px-1">
      <svg width="60" height="24" viewBox="0 0 60 24" className="shrink-0">
        <defs>
          <marker id={`arrowhead-${arrow.from}-${arrow.to}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="currentColor" className="text-accent/60" />
          </marker>
        </defs>
        <line
          x1="0" y1="12" x2="50" y2="12"
          stroke="currentColor"
          strokeWidth="2"
          className="text-accent/40"
          {...(dashStyle ? { style: { strokeDasharray: arrow.type === 'dashed' ? '6 3' : '2 2' } } : {})}
          markerEnd={`url(#arrowhead-${arrow.from}-${arrow.to})`}
        />
      </svg>
      {arrow.label && (
        <span className="text-[8px] font-mono text-text-muted/60 mt-0.5 whitespace-nowrap">{arrow.label}</span>
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
        <span className="absolute text-[8px] font-mono text-text-muted/60 ml-8">{arrow.label}</span>
      )}
    </div>
  );
}

function FlowNodeBox({ node }: { node: FlowNode }) {
  return (
    <div className={cn(
      NODE_SIZE,
      'rounded-xl border flex flex-col items-center justify-center text-center px-2 transition-all',
      STATUS_STYLES[node.status || 'default'],
    )}>
      {node.icon && <span className="text-lg mb-1">{node.icon}</span>}
      <span className="text-[10px] md:text-xs font-black uppercase tracking-wider leading-tight">{node.label}</span>
      {node.sublabel && (
        <span className="text-[8px] md:text-[9px] font-mono opacity-60 mt-0.5">{node.sublabel}</span>
      )}
    </div>
  );
}

export function FlowDiagram({ nodes, arrows, direction = 'horizontal', className }: FlowDiagramProps) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const ArrowComponent = direction === 'horizontal' ? FlowArrowHorizontal : FlowArrowVertical;

  if (direction === 'horizontal') {
    return (
      <div className={cn('rounded-xl border border-border/20 bg-bg-elevated/50 p-4 overflow-x-auto', className)}>
        <div className="flex items-center justify-center min-w-max gap-0">
          {arrows.map((arrow, i) => {
            const fromNode = nodeMap.get(arrow.from);
            const toNode = nodeMap.get(arrow.to);
            if (!fromNode || !toNode) return null;
            return (
              <div key={i} className="flex items-center">
                {i === 0 && <FlowNodeBox node={fromNode} />}
                <ArrowComponent arrow={arrow} />
                <FlowNodeBox node={toNode} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border/20 bg-bg-elevated/50 p-4', className)}>
      <div className="flex flex-col items-center gap-0">
        {arrows.map((arrow, i) => {
          const fromNode = nodeMap.get(arrow.from);
          const toNode = nodeMap.get(arrow.to);
          if (!fromNode || !toNode) return null;
          return (
            <div key={i} className="flex flex-col items-center">
              {i === 0 && <FlowNodeBox node={fromNode} />}
              <ArrowComponent arrow={arrow} />
              <FlowNodeBox node={toNode} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
