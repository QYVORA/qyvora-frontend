export interface TeamSocials {
  youtube?: string;
  tiktok?: string;
  twitter?: string; // X
  github?: string;
  linkedin?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  handle?: string;
  role: string;
  bio: string;
  image: string;
  socials: TeamSocials;
}

export const teamData: TeamMember[] = [
  {
    id: 'CEO',
    name: 'wsuits6 | Alhassan Osman Wunpini',
    handle: 'wsuits6',
    role: 'CEO',
    bio: 'I dont follow paths I burn them then I write my own in code .',
    image: '/assets/team/wsuits6.png',
    socials: {
      youtube: 'https://www.youtube.com/@wsuits6',
      twitter: 'https://x.com/wsuits6',
      github: 'https://github.com/wsuits6',
      linkedin: 'https://www.linkedin.com/in/wsuits6/',
    },
  },
  {
    id: 'CFO',
    name: 'Seth Abbey',
    role: 'CFO',
    bio: 'Architecting the financial models that fuel offensive security innovation.',
    image: '/assets/team/seth_abbey.jpeg',
    socials: {},
  },
];
