import { BrainCircuit, Shield, UserCheck, Wrench } from 'lucide-react';

export interface MarketingService {
  title: string;
  category: string;
  icon: typeof Shield;
  img: string;
  tagline: string;
  bullet: string[];
}

export const MARKETING_SERVICES: MarketingService[] = [
  {
    title: 'Corporate Security Assessments',
    category: 'STAGE 04 // REVENUE ENGINE',
    icon: Shield,
    img: '/images/services/corporate-security-assessment.png',
    tagline: 'Find the gaps before attackers do.',
    bullet: [
      'Full-scope security audits for businesses and organisations.',
      'Vulnerability identification across networks, apps, and infrastructure.',
      'Detailed findings report with remediation roadmap.',
    ],
  },
  {
    title: 'Employee Security Training',
    category: 'FOR COMPANY TEAMS',
    icon: UserCheck,
    img: '/images/services/employee-security-training.png',
    tagline: 'Your people are your first line of defence.',
    bullet: [
      'Security awareness workshops for non-technical staff.',
      'Covers phishing, device hygiene, and safe work practices.',
      'Tailored to your team size and threat environment.',
    ],
  },
  {
    title: 'Proprietary Security Tooling',
    category: 'HSOCIETY OFFSEC PRODUCT',
    icon: Wrench,
    img: '/images/services/proprietary-security-tooling.png',
    tagline: 'Tools built by operators, for operators.',
    bullet: [
      'In-house cybersecurity tools built for real-world use.',
      'Subscription access for security teams and professionals.',
      'Continuously updated based on active threat intelligence.',
    ],
  },
  {
    title: 'AI-Integrated Security Solutions',
    category: 'AUTOMATED DEFENSE',
    icon: BrainCircuit,
    img: '/images/services/ai-integrated-solutions.png',
    tagline: 'Intelligent systems that respond at machine speed.',
    bullet: [
      'AI-powered threat detection and automated response systems.',
      'Reduces manual intervention and analyst fatigue.',
      'Integrates with existing security infrastructure.',
    ],
  },
];
