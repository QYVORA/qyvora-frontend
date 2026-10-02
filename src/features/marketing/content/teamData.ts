import wsuits6Img from '@/assets/team/wsuits6.webp';
import sopt4Img from '@/assets/team/sopt4.webp';
import ghostImg from '@/assets/quiteRoot/WhatsApp Image 2026-07-16 at 10.45.41 PM.webp';
import karimHamidImg from '@/assets/team/karim_hamid.webp';

/**
 * QYVORA leadership — the four officer roles only: Founder/CEO, COO, CMO, HRM.
 *
 * QuietRoot is QYVORA's technical community and is a separate structure, not
 * leadership. Its members are placed by assessed capability rather than by
 * officer appointment, so they are published on /quiteroot with the roles the
 * QuietRoot documentation defines — see `quietRootData.ts`.
 */
export interface TeamSocials {
  youtube?: string;
  tiktok?: string;
  twitter?: string; // X
  github?: string;
  linkedin?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  handle?: string;
  role: string;
  bio: string;
  profile: string;
  disciplines: string[];
  location?: string;
  image: string;
  width: number;
  height: number;
  socials: TeamSocials;
}

export const teamData: TeamMember[] = [
  {
    id: 'wsuits6',
    name: 'wsuits6',
    handle: 'wsuits6',
    role: 'CEO',
    bio: 'Ethical hacker, systems builder, and QYVORA founder shaping security-first technology from Ghana.',
    profile: 'Wsuits6 is the online alias of Alhassan Osman Wunpini, also known as Osman Alhassan. As CEO of QYVORA and Wsuits Industries, he works at the intersection of ethical hacking, systems coding, red-team thinking, and security psychology, building practical projects and communities around a more resilient digital future.',
    disciplines: ['Red teaming', 'Systems coding', 'Security psychology'],
    location: 'Ghana',
    image: wsuits6Img,
    width: 1024,
    height: 1024,
    socials: {
      youtube: 'https://www.youtube.com/@wsuits6',
      twitter: 'https://x.com/qyvorasec',
      github: 'https://github.com/wsuits6',
      linkedin: 'https://www.linkedin.com/in/wsuits6/',
    },
  },
  {
    id: 'sopt4',
    name: 'sopt4',
    role: 'COO',
    bio: 'Software engineer and graphic designer focused on polished interfaces, interaction, and web development.',
    profile: 'sopt4 is a software engineer, graphic designer, and web developer who brings visual clarity to technical work. His focus is creating good-looking, interactive digital experiences that feel considered from the first screen to the final detail, helping QYVORA turn ambitious ideas into approachable products.',
    disciplines: ['Software engineering', 'UI design', 'Web development'],
    image: sopt4Img,
    width: 1254,
    height: 1254,
    socials: {
      youtube: 'https://www.youtube.com/@sethabbey-u2c',
      github: 'https://github.com/sethabbey987',
      linkedin: 'https://www.linkedin.com/in/seth-abbey-599029379/',
      twitter: 'https://x.com/qyvorasec',
    },
  },
  {
    id: 'ghostVenom',
    name: 'Ghost Venom',
    role: 'Chief Marketing Officer',
    bio: 'Nigerian ethical hacker, penetration tester, content creator, and QYVORA community manager.',
    profile: 'Ghost Venom is a passionate ethical hacker and penetration tester from Nigeria. Alongside creating cybersecurity content, he manages the QYVORA community, making security knowledge more accessible, encouraging responsible practice, and helping operators learn together in public.',
    disciplines: ['Penetration testing', 'Security content', 'Community building'],
    location: 'Nigeria',
    image: ghostImg,
    width: 1254,
    height: 1254,
    socials: {
      linkedin: 'https://www.linkedin.com/in/ghost-malware-222ab4285/',
    },
  },
  {
    id: 'abdulKarimHamid',
    name: 'Abdul Karim Hamid',
    role: 'Human Resources Manager',
    bio: 'Human resources lead keeping QYVORA\'s operator crew staffed, connected, and growing from Tamale.',
    profile: 'Abdul Karim Hamid is QYVORA\'s Human Resources Manager. Based in Tamale, he oversees the people side of the operation: hiring, culture, and keeping operators connected across the team as QYVORA expands its workforce across Ghana and Nigeria.',
    disciplines: ['Human resources', 'People operations', 'Team building'],
    location: 'Tamale, Ghana',
    image: karimHamidImg,
    width: 560,
    height: 560,
    socials: {
      linkedin: 'https://gh.linkedin.com/in/karim-hamid-659345384',
      instagram: 'https://www.instagram.com/hybrid_hamid',
    },
  },
];
