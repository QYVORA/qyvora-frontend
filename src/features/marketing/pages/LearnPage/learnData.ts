import { Shield, Terminal, Network, Globe, Users, type LucideIcon } from 'lucide-react';
import phaseOneImg from '@/assets/bootcamp/rooms/phaseOne.webp';
import phaseTwoImg from '@/assets/bootcamp/rooms/phaseTwo.webp';
import phaseThreeImg from '@/assets/bootcamp/rooms/phaseThree.webp';
import phaseFourImg from '@/assets/bootcamp/rooms/phaseFour.webp';
import phaseFiveImg from '@/assets/bootcamp/rooms/phaseFive.webp';

export interface LearnPhase {
  id: string;
  name: string;
  icon: LucideIcon;
  desc: string;
  image: string;
}

export const PHASES: LearnPhase[] = [
  {
    id: '01',
    name: 'Hacker Mindset',
    icon: Shield,
    desc: 'Offensive security is a proactive mindset. Train to find weaknesses before adversaries do by understanding the legal boundaries, scopes, and coordinator rules.',
    image: phaseOneImg,
  },
  {
    id: '02',
    name: 'Linux Foundations',
    icon: Terminal,
    desc: 'Master navigation, user privilege escalation, file permissions, and directory structures. Transition from a GUI observer to a terminal-proficient operator.',
    image: phaseTwoImg,
  },
  {
    id: '03',
    name: 'Networking',
    icon: Network,
    desc: 'Establish total visibility over the network stack. Audit TCP/IP, OSI layers, routing protocols, and intercept packets at the raw bytecode level.',
    image: phaseThreeImg,
  },
  {
    id: '04',
    name: 'Web & Backend Systems',
    icon: Globe,
    desc: 'Analyze web server frameworks, dissect HTTP protocol traffic, manipulate REST APIs, and compromise backend database persistence layers.',
    image: phaseFourImg,
  },
  {
    id: '05',
    name: 'Social Engineering',
    icon: Users,
    desc: 'Understand the human factor in the defensive boundary. Study pretexting, psychological vectors, coordinates of trust, and human spoofing.',
    image: phaseFiveImg,
  },
];
