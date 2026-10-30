import type { ReactNode } from 'react';
import { Route } from 'lucide-react';
import { FlowDiagram, type FlowArrow, type FlowNode } from '@/shared/components/diagrams/FlowDiagram';

export interface LearningPathItem {
  id: string;
  label: ReactNode;
}

interface LearningPathDiagramProps {
  items: LearningPathItem[];
  activeId?: string;
  title?: string;
  className?: string;
}

function labelText(label: ReactNode, index: number): string {
  if (typeof label === 'string' || typeof label === 'number') return String(label);
  return `Section ${index + 1}`;
}

export function LearningPathDiagram({
  items,
  activeId,
  title = 'Learning path',
  className,
}: LearningPathDiagramProps) {
  if (items.length < 2) return null;

  const nodes: FlowNode[] = items.map((item, index) => ({
    id: item.id,
    label: labelText(item.label, index),
    sublabel: `Section ${String(index + 1).padStart(2, '0')}`,
    status: item.id === activeId ? 'active' : 'default',
  }));

  const arrows: FlowArrow[] = items.slice(1).map((item, index) => ({
    from: items[index].id,
    to: item.id,
    type: 'solid',
  }));

  return (
    <FlowDiagram
      title={title}
      icon={<Route className="h-4 w-4 text-accent" aria-hidden="true" />}
      nodes={nodes}
      arrows={arrows}
      compact={items.length > 3}
      caption="Follow the sections in order, or jump straight to one from the sidebar."
      className={className}
    />
  );
}

export default LearningPathDiagram;
