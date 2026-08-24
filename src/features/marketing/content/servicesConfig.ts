import type { LucideIcon } from 'lucide-react';
import { Shield, ShieldCheck, GraduationCap } from 'lucide-react';

export interface ServiceDeliverable {
  label: string;
  desc: string;
}

export interface ServiceConfig {
  id: string;
  key: string;
  path: string;
  title: string;
  accentWord?: string;
  badge: string;
  icon: LucideIcon;
  overview: string;
  price: string;
  priceLocal: string;
  priceNote?: string;
  scope: string;
  included: string[];
  benefits: string[];
  deliverables: ServiceDeliverable[];
  featured?: boolean;
  highlight?: string;
}

/**
 * Single source of truth for QYVORA enterprise services.
 * Drives both the Services page sections and the dedicated service pages.
 */
export const SERVICES: ServiceConfig[] = [
  {
    id: 'basic',
    key: 'basic',
    path: '/services/basic-web-application-pentest',
    title: 'Basic Web Application Penetration Testing',
    accentWord: 'Testing',
    badge: 'Essential',
    icon: Shield,
    overview:
      'A focused assessment of your application\u2019s most critical pages: fast, thorough, and built around the OWASP Top 10.',
    price: '$300 - $500 USD',
    priceLocal: 'GH\u20B54,000 - GH\u20B57,000',
    scope: 'Up to 5 application pages/endpoints.',
    included: [
      'OWASP Top 10 assessment',
      'Authentication testing',
      'Basic SQL Injection testing',
      'Cross-Site Scripting (XSS) testing',
      'Session management testing',
    ],
    benefits: [
      'Ideal entry point for small applications and MVPs',
      'Manual + automated analysis of every in-scope endpoint',
      'Clear, prioritized findings tied to real business risk',
      'No checkbox audit: real exploitation with practical fixes',
    ],
    deliverables: [
      {
        label: 'Executive summary',
        desc: 'A plain-language overview of your overall security posture and what it means for the business.',
      },
      {
        label: 'Technical findings',
        desc: 'Every confirmed vulnerability documented with reproducible steps.',
      },
      {
        label: 'Risk ratings',
        desc: 'Severity ratings that let you triage what to fix first.',
      },
      {
        label: 'Evidence',
        desc: 'Screenshots and request/response proof where appropriate.',
      },
      {
        label: 'Remediation recommendations',
        desc: 'Clear, practical guidance for fixing each finding.',
      },
    ],
  },
  {
    id: 'standard',
    key: 'standard',
    path: '/services/standard-web-application-pentest',
    title: 'Standard Web Application Penetration Testing',
    accentWord: 'Testing',
    badge: 'Comprehensive',
    icon: ShieldCheck,
    overview:
      'A deep, full-application assessment covering authentication, authorization, business logic, and everything in between.',
    price: '$600 - $1,000 USD',
    priceLocal: 'GH\u20B58,000 - GH\u20B514,000',
    scope: 'Comprehensive assessment covering the entire application.',
    included: [
      'Authentication testing',
      'Authorization and role testing',
      'Business logic testing',
      'IDOR testing',
      'File upload security testing',
      'JWT security analysis',
      'Session security testing',
      'Rate limiting checks',
    ],
    benefits: [
      'Full application coverage: no endpoint left out of scope',
      'Deep-dive into authorization, business logic, and file handling',
      'Actionable findings mapped to remediation priority',
      'One free retest after vulnerabilities have been remediated',
    ],
    highlight:
      'Includes one free retest after your team remediates the reported vulnerabilities.',
    deliverables: [
      {
        label: 'Executive summary',
        desc: 'A plain-language overview of your overall security posture and what it means for the business.',
      },
      {
        label: 'Technical findings',
        desc: 'Every confirmed vulnerability documented with reproducible steps and full technical detail.',
      },
      {
        label: 'Risk ratings',
        desc: 'Severity ratings that let you triage what to fix first.',
      },
      {
        label: 'Evidence',
        desc: 'Screenshots and request/response proof where appropriate.',
      },
      {
        label: 'Remediation recommendations',
        desc: 'Detailed remediation guidance for each finding.',
      },
      {
        label: 'Free retest',
        desc: 'One free re-assessment after remediation to verify every fix.',
      },
    ],
    featured: true,
  },
  {
    id: 'bootcamp',
    key: 'bootcamp',
    path: '/services/employee-cybersecurity-bootcamp',
    title: 'Employee Cybersecurity Bootcamp',
    accentWord: 'Bootcamp',
    badge: 'Training',
    icon: GraduationCap,
    overview:
      'Build a security-aware workforce with hands-on training your employees will actually retain.',
    price: 'Custom quotation',
    priceLocal: 'Depends on organization size & scope',
    priceNote:
      'No fixed price: the quotation depends on organization size, employee count, training requirements, and engagement scope. Contact us for a custom quotation.',
    scope: 'Tailored to your organization size, employee count, and training requirements.',
    included: [
      'Understanding cybersecurity risks',
      'Physical security awareness',
      'Social engineering',
      'Phishing awareness',
      'Employee-targeted attacks',
      'Safe workplace security practices',
      'Security awareness fundamentals',
      'Basic incident response awareness',
    ],
    benefits: [
      'A security-aware workforce: your employees become your first line of defense',
      'Practical, scenario-based training instead of slideware',
      'Curriculum tailored to your industry and risk profile',
      'Hands-on drills and simulations employees will remember',
    ],
    deliverables: [
      {
        label: 'Tailored curriculum',
        desc: 'Training designed around your organization\u2019s actual risk profile.',
      },
      {
        label: 'Hands-on sessions',
        desc: 'Live drills covering phishing, social engineering, and incident response.',
      },
      {
        label: 'Employee engagement tracking',
        desc: 'Visibility into participation and learning outcomes.',
      },
      {
        label: 'Post-training guidance',
        desc: 'Practical workplace security practices your team can apply immediately.',
      },
    ],
  },
];

export const PENTEST_PHILOSOPHY = {
  heading: 'Why We Test',
  body: 'We do not perform penetration tests to check a box or generate revenue. The objective is to identify real vulnerabilities, help you strengthen your security posture, and deliver meaningful security improvements. Client satisfaction matters, but the focus is thorough, high-quality assessments that uncover genuine weaknesses with practical remediation guidance.',
};

export const REQUEST_ASSESSMENT_LABEL = 'Request an Assessment';
export const LEARN_MORE_LABEL = 'Learn More';
