import { BrainCircuit, Shield, UserCheck, Wrench } from 'lucide-react';

export interface MarketingService {
  title: string;
  category: string;
  icon: typeof Shield;
  img: string;
  bullet: string[];
}

export const MARKETING_SERVICES: MarketingService[] = [
  {
    title: 'Corporate Penetration Testing',
    category: 'STAGE 04 // REVENUE ENGINE',
    icon: Shield,
    img: '/images/how-it-works-section/Engagements-4Completed.webp',
    bullet: [
      'Paid security audits and penetration tests for established companies.',
    ],
  },
  {
    title: 'Employee Cybersecurity Training',
    category: 'FOR COMPANY TEAMS',
    icon: UserCheck,
    img: '/images/Curriculum-images/phase1.webp',
    bullet: [
      'Security awareness training covering safer personal habits, device security, and day-to-day work practices.',
    ],
  },
  {
    title: 'Authentic Security Tooling',
    category: 'HSOCIETY OFFSEC PRODUCT',
    icon: Wrench,
    img: '/images/how-it-works-section/Findings-Identified.webp',
    bullet: [
      'We build proprietary cybersecurity tools that security teams can subscribe to and use in their operations.',
    ],
  },
  {
    title: 'AI-Integrated Security Solutions',
    category: 'AUTOMATED DEFENSE',
    icon: BrainCircuit,
    img: '/images/how-it-works-section/Pentesters-Active.webp',
    bullet: [
      'AI-enabled security products (for example AI-based firewalls) that detect and respond to threats with reduced manual intervention.',
    ],
  },
];
