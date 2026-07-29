import { Globe, Users } from 'lucide-react';
import { IconShield, IconTerminal, IconNetwork } from '@/shared/components/icons';
import hpbCoverImg from '@/assets/bootcamp/hpb-cover.webp';

export interface LearnPhase {
  id: string;
  name: string;
  icon: React.ElementType<{ className?: string; size?: number | string }>;
  desc: string;
  image: string;
}

export const PHASES: LearnPhase[] = [
  {
    id: '01',
    name: 'Hacker Mindset',
    icon: IconShield,
    desc: 'Offensive security is a proactive mindset. Train to find weaknesses before adversaries do by understanding the legal boundaries, scopes, and coordinator rules.',
    image: hpbCoverImg,
  },
  {
    id: '02',
    name: 'Linux Foundations',
    icon: IconTerminal,
    desc: 'Master navigation, user privilege escalation, file permissions, and directory structures. Transition from a GUI observer to a terminal-proficient operator.',
    image: hpbCoverImg,
  },
  {
    id: '03',
    name: 'Networking',
    icon: IconNetwork,
    desc: 'Establish total visibility over the network stack. Audit TCP/IP, OSI layers, routing protocols, and intercept packets at the raw bytecode level.',
    image: hpbCoverImg,
  },
  {
    id: '04',
    name: 'Web & Backend Systems',
    icon: Globe,
    desc: 'Analyze web server frameworks, dissect HTTP protocol traffic, manipulate REST APIs, and compromise backend database persistence layers.',
    image: hpbCoverImg,
  },
  {
    id: '05',
    name: 'Social Engineering',
    icon: Users,
    desc: 'Understand the human factor in the defensive boundary. Study pretexting, psychological vectors, coordinates of trust, and human spoofing.',
    image: hpbCoverImg,
  },
];
