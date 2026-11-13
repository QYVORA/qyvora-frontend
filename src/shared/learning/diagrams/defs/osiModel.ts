import type { DiagramDefinition } from '@/shared/components/diagrams/types';
import { createNodeSequenceAnimation } from '../animationSequence';

interface LayerSpec {
  id: string;
  label: string;
  explanation: string;
}

const LAYERS: LayerSpec[] = [
  {
    id: 'layer-7',
    label: 'Application',
    explanation:
      'Layer 7 — the protocols your programs speak: HTTP, DNS, SMTP. This is where the user request is born.',
  },
  {
    id: 'layer-6',
    label: 'Presentation',
    explanation:
      'Layer 6 — translation, encoding and encryption: TLS, JPEG, UTF-8. Turns data into a shared format.',
  },
  {
    id: 'layer-5',
    label: 'Session',
    explanation:
      'Layer 5 — opens, manages and closes the conversation between two machines.',
  },
  {
    id: 'layer-4',
    label: 'Transport',
    explanation:
      'Layer 4 — TCP/UDP. Adds ports and decides between reliable delivery (TCP) and fast fire-and-forget (UDP).',
  },
  {
    id: 'layer-3',
    label: 'Network',
    explanation:
      'Layer 3 — IP. Adds source and destination IP addresses and routes packets between networks.',
  },
  {
    id: 'layer-2',
    label: 'Data Link',
    explanation:
      'Layer 2 — Ethernet/Wi-Fi. Adds MAC addresses so frames travel between devices on the same link.',
  },
  {
    id: 'layer-1',
    label: 'Physical',
    explanation:
      'Layer 1 — the actual wire, fibre or radio. Turns bits into electrical, light or radio signals.',
  },
];

const downSteps = LAYERS.map((layer, index) => ({
  nodeId: layer.id,
  description: `Send · Layer ${7 - index} · ${layer.label}`,
}));

const upSteps = [...LAYERS].reverse().map((layer, index) => ({
  nodeId: layer.id,
  description: `Receive · Layer ${index + 1} · ${layer.label}`,
}));

export const osiModelDiagram: DiagramDefinition = {
  id: 'osi-model',
  type: 'system-architecture',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'The OSI Model',
  description: 'Seven layers — data flows down the stack on send and back up on receive.',
  nodes: LAYERS.map((layer, index) => ({
    id: layer.id,
    type: 'component',
    label: layer.label,
    sublabel: `Layer ${7 - index}`,
    position: { x: 0, y: index * 96 },
    tooltip: layer.explanation,
    metadata: { explanation: layer.explanation },
  })),
  edges: LAYERS.slice(0, -1).map((layer, index) => ({
    id: `osi-${index}`,
    source: layer.id,
    target: LAYERS[index + 1].id,
    type: 'logical-link',
  })),
  animation: createNodeSequenceAnimation([...downSteps, ...upSteps], { stepDuration: 1200 }),
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'The seven layers of the OSI model',
    ariaDescription:
      'A vertical stack of the seven OSI layers from Application (7) to Physical (1). Data travels down the stack when sending and back up when receiving.',
  },
};
