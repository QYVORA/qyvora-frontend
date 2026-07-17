import blogHackerProtocol from '@/assets/blog/hacker-protocol-bootcamp.webp';
import blogAnansiCli from '@/assets/blog/anansi-cli.webp';
import blogAfricaEcosystem from '@/assets/blog/africa-cybersecurity-ecosystem.webp';
import blogAttackersDiscover from '@/assets/blog/attackers-discover-companies.webp';
import blogAfricaNeeds from '@/assets/blog/africa-needs-professionals.webp';
import blogMappingSurfaces from '@/assets/blog/mapping-attack-surfaces.webp';
import blogFutureCybersecurity from '@/assets/blog/future-cybersecurity-africa.webp';
import blogCaseStudyCover from '@/assets/blog/01-hpb-2026-online-class-screenshot.webp';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  image: string;
  author: { name: string; handle: string };
  date: string;
  readTime: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'hacker-protocol-book',
    slug: 'hacker-protocol-book',
    title: 'Hacker Protocol Bootcamp — 2026 Cohort',
    subtitle: 'Building Africa\'s Cybersecurity Pipeline From the Ground Up',
    excerpt: 'How we designed a bootcamp that turns curious minds into offensive security operators — one phase at a time.',
    image: blogHackerProtocol,
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-06-20',
    readTime: '8 min read',
    tags: ['Cybersecurity', 'Education', 'Africa'],
  },
  {
    id: 'anansi-cli',
    slug: 'anansi-cli',
    title: 'Anansi CLI: Attack Surface Intelligence from the Terminal',
    subtitle: 'Why we built a no-nonsense, single-binary recon engine for operators who hate bloat.',
    excerpt: 'A philosophy-driven walkthrough of the Anansi CLI — what it does, why it exists, and how to wield it.',
    image: blogAnansiCli,
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-06-20',
    readTime: '8 min read',
    tags: ['Tooling', 'Recon', 'CLI'],
  },
  {
    id: 'africa-cybersecurity-ecosystem',
    slug: 'africa-cybersecurity-ecosystem',
    title: 'Building Africa\'s Cybersecurity Ecosystem: Why QYVORA Exists',
    subtitle: 'The vision behind Africa\'s first dedicated offensive security ecosystem.',
    excerpt: 'Why we are building a homegrown offensive security company for the African context — from education to tooling to services.',
    image: blogAfricaEcosystem,
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-06-21',
    readTime: '7 min read',
    tags: ['Vision', 'Africa', 'Cybersecurity'],
  },
  {
    id: 'attackers-discover-companies',
    slug: 'attackers-discover-companies',
    title: 'How Attackers Actually Discover Companies on the Internet',
    subtitle: 'The six-phase reconnaissance pipeline and what it means for your organisation.',
    excerpt: 'Learn how attackers map your attack surface using CT logs, DNS brute-force, and automated discovery — and how to defend against it.',
    image: blogAttackersDiscover,
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-06-22',
    readTime: '8 min read',
    tags: ['Recon', 'Attack Surface', 'Security'],
  },
  {
    id: 'africa-needs-cybersecurity-professionals',
    slug: 'africa-needs-cybersecurity-professionals',
    title: 'Why Africa Needs 100,000 More Cybersecurity Professionals',
    subtitle: 'The talent gap is growing — here is how we close it.',
    excerpt: 'Africa faces a critical cybersecurity talent shortage. We break down the numbers and the pathway to closing the gap.',
    image: blogAfricaNeeds,
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-06-23',
    readTime: '7 min read',
    tags: ['Talent', 'Education', 'Africa'],
  },
  {
    id: 'mapping-attack-surfaces',
    slug: 'mapping-attack-surfaces',
    title: 'What We Learned From Mapping Real-World Attack Surfaces',
    subtitle: 'Common patterns, recurring findings, and structural weaknesses from hundreds of assessments.',
    excerpt: 'Real findings from real attack surface assessments — shadow assets, exposed secrets, and misconfigurations we see everywhere.',
    image: blogMappingSurfaces,
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-06-24',
    readTime: '8 min read',
    tags: ['Research', 'Attack Surface', 'Findings'],
  },
  {
    id: 'future-cybersecurity-africa',
    slug: 'future-cybersecurity-africa',
    title: 'The Future of Cybersecurity in Africa: AI, Talent, and Innovation',
    subtitle: 'Where African cybersecurity is heading — and how to prepare.',
    excerpt: 'AI, automation, and Africa\'s unique opportunity to leapfrog legacy security models into a more resilient future.',
    image: blogFutureCybersecurity,
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-06-25',
    readTime: '7 min read',
    tags: ['Future', 'AI', 'Innovation'],
  },
  {
    id: 'hpb-2026-cohort-case-study',
    slug: 'hpb-2026-cohort-case-study',
    title: 'HPB 2026 Cohort — Case Study',
    subtitle: 'From Training to Team Building: The Hacker Protocol Bootcamp Story',
    excerpt: 'How the HPB 2026 Cohort produced a COO, formed the QuiteRoot tech team, and proved Africa\'s talent pipeline works.',
    image: blogCaseStudyCover,
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-07-10',
    readTime: '10 min read',
    tags: ['Case Study', 'Bootcamp', 'Africa', 'Cybersecurity'],
  },
];
