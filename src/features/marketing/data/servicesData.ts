export interface Service {
  title: string;
  category: string;
  bullets: string[];
  img: string;
}

export const SERVICES: Service[] = [
  {
    title: 'Penetration Testing',
    category: 'FOR ORGANISATIONS',
    bullets: [
      'Network and infrastructure penetration testing',
      'Internal and external attack simulation',
      'Detailed findings report with remediation guidance',
    ],
    img: '/images/how-it-works-section/Engagements-4Completed.webp',
  },
  {
    title: 'Web Application Security Audit',
    category: 'FOR ORGANISATIONS',
    bullets: [
      'OWASP Top 10 full coverage',
      'API and authentication testing',
      'Business logic vulnerability analysis',
    ],
    img: '/images/how-it-works-section/Findings-Identified.webp',
  },
  {
    title: 'Vulnerability Assessment',
    category: 'FOR ORGANISATIONS',
    bullets: [
      'Automated and manual scanning',
      'Risk-rated vulnerability inventory',
      'Prioritised remediation roadmap',
    ],
    img: '/images/how-it-works-section/Pentesters-Active.webp',
  },
];
