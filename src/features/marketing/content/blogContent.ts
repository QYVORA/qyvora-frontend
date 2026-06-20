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
    image: '/assets/bootcamp/hpb-cover.webp',
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
    image: '/anansi-main-logo.webp',
    author: { name: 'WSUITS6', handle: 'Alhassan Osman Wunpini' },
    date: '2026-06-20',
    readTime: '8 min read',
    tags: ['Tooling', 'Recon', 'CLI'],
  },
];
