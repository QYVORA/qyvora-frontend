import type { DiagramDefinition } from '@/shared/components/diagrams/types';
import { createNodeSequenceAnimation } from '../animationSequence';

interface StageSpec {
  id: string;
  label: string;
  sublabel: string;
  explanation: string;
}

const STAGES: StageSpec[] = [
  {
    id: 'data',
    label: 'Data',
    sublabel: 'Application',
    explanation: 'The raw message your application wants to send.',
  },
  {
    id: 'segment',
    label: 'Segment',
    sublabel: '+ TCP header',
    explanation:
      'The Transport layer adds a TCP header with source/destination ports and sequence numbers.',
  },
  {
    id: 'packet',
    label: 'Packet',
    sublabel: '+ IP header',
    explanation:
      'The Network layer adds an IP header with source and destination IP addresses so it can be routed.',
  },
  {
    id: 'frame',
    label: 'Frame',
    sublabel: '+ Ethernet header',
    explanation:
      'The Data Link layer adds an Ethernet header with MAC addresses for the local link.',
  },
  {
    id: 'bits',
    label: 'Bits',
    sublabel: 'on the wire',
    explanation:
      'The Physical layer converts the frame into electrical, light or radio signals — 1s and 0s.',
  },
];

export const encapsulationDiagram: DiagramDefinition = {
  id: 'encapsulation',
  type: 'data-flow',
  renderer: 'react-flow',
  layout: 'auto',
  title: 'Encapsulation',
  description: 'Each layer wraps the data with its own header as it travels down the stack.',
  nodes: STAGES.map((stage, index) => ({
    id: stage.id,
    type: 'component',
    label: stage.label,
    sublabel: stage.sublabel,
    position: { x: index * 210, y: 0 },
    tooltip: stage.explanation,
    metadata: { explanation: stage.explanation },
  })),
  edges: STAGES.slice(0, -1).map((stage, index) => ({
    id: `encap-${index}`,
    source: stage.id,
    target: STAGES[index + 1].id,
    type: 'transform',
  })),
  animation: createNodeSequenceAnimation(
    STAGES.map((stage, index) => ({
      nodeId: stage.id,
      description: `${index + 1} · ${stage.label} — ${stage.explanation}`,
    }))
  ),
  interaction: { selectable: true },
  accessibility: {
    ariaLabel: 'Encapsulation as data travels down the network stack',
    ariaDescription:
      'Application data is wrapped by a TCP header to become a segment, an IP header to become a packet, an Ethernet header to become a frame, and finally signals on the wire.',
  },
};
