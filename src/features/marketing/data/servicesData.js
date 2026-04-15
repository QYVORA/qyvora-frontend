import { Bug, GraduationCap, Globe, Shield, Users } from 'lucide-react'

export const SERVICES = [
  {
    icon: Shield,
    title: 'Penetration Testing',
    tag: 'For Organisations',
    img: '/images/how-it-works-section/Engagements-4Completed.webp',
    desc: 'Full-scope attack simulation against your infrastructure and applications.',
    description:
      'Full-scope penetration tests conducted by certified offensive security professionals. We simulate real-world attacks against your infrastructure, applications, and people to identify vulnerabilities before adversaries do.',
    bullets: [
      'Network and infrastructure penetration testing',
      'Internal and external attack simulation',
      'Detailed findings report with remediation guidance',
      'Executive summary for leadership',
      'Re-test included after remediation',
    ],
  },
  {
    icon: Globe,
    title: 'Web Application Security Audit',
    tag: 'For Organisations',
    img: '/images/how-it-works-section/Findings-Identified.webp',
    desc: 'OWASP Top 10 and beyond. APIs, auth, business logic, and more.',
    description:
      'Comprehensive security assessment of your web applications covering OWASP Top 10 and beyond. We test authentication, authorisation, injection flaws, business logic, and API security.',
    bullets: [
      'OWASP Top 10 full coverage',
      'API and authentication testing',
      'Business logic vulnerability analysis',
      'Source code review (optional)',
      'Severity-rated findings with proof-of-concept',
    ],
  },
  {
    icon: Bug,
    title: 'Vulnerability Assessment',
    tag: 'For Organisations',
    img: '/images/how-it-works-section/Pentesters-Active.webp',
    desc: 'Risk-rated inventory of weaknesses across your attack surface.',
    description:
      'Systematic identification and prioritisation of security weaknesses across your attack surface. Ideal for organisations that need a clear picture of their risk posture without a full penetration test.',
    bullets: [
      'Automated and manual scanning',
      'Risk-rated vulnerability inventory',
      'Prioritised remediation roadmap',
      'Compliance-ready reporting',
    ],
  },
  {
    icon: Users,
    title: 'Employee Security Training',
    tag: 'For Teams',
    img: '/images/how-it-works-section/Learners-Trained.webp',
    desc: 'Hands-on labs and workshops for technical teams.',
    description:
      'Hands-on offensive security training for your technical teams. We run structured bootcamps and workshops that teach your developers, IT staff, and security teams to think like attackers.',
    bullets: [
      'Custom curriculum for your team skill level',
      'Hands-on labs and real-world scenarios',
      'Phishing simulation and awareness training',
      'Secure development practices for developers',
      'Ongoing access to HSOCIETY platform',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Corporate Security Bootcamp',
    tag: 'For Teams',
    img: '/images/Curriculum-images/phase1.webp',
    desc: 'Structured multi-week offensive security programme for organisations.',
    description:
      'Structured multi-week offensive security bootcamp delivered to your organisation. Teams go from fundamentals to advanced techniques through guided modules, live sessions, and supervised engagements.',
    bullets: [
      'Beginner to advanced tracks available',
      'Live instructor-led sessions',
      'CTF challenges and supervised engagements',
      'Certificates of completion',
      'Post-training support',
    ],
  },
]

export const CONTACT_REASONS = [
  'Penetration Testing',
  'Web Application Security Audit',
  'Employee Security Training',
  'Corporate Security Bootcamp',
  'Bootcamp Enrollment',
  'General Inquiry',
]
