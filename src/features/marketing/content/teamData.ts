import wsuits6Img from '@/assets/team/wsuits6.webp';
import sopt4Img from '@/assets/team/sopt4.webp';
import rafiqImg from '@/assets/team/mohammed_rafiq.webp';
import ghostImg from '@/assets/quiteRoot/WhatsApp Image 2026-07-16 at 10.45.41 PM.webp';

export interface TeamSocials {
  youtube?: string;
  tiktok?: string;
  twitter?: string; // X
  github?: string;
  linkedin?: string;
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
    profile: 'Wsuits6 is the online alias of Alhassan Osman Wunpini, also known as Osman Alhassan. As CEO of QYVORA and Wsuits Industries, he works at the intersection of ethical hacking, systems coding, red-team thinking, and security psychology—building practical projects and communities around a more resilient digital future.',
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
    id: 'mohammedRafiq',
    name: 'Mohammed Rafiq',
    role: 'CFO',
    bio: 'Computer hardware engineer, IT graduate, and hands-on troubleshooter based in Tamale.',
    profile: 'Sulemana Mohammed Rafiq is a professional computer hardware engineer and troubleshooter with a BTech in Information Technology. He is the Managing Director of Conda Computers in Tamale, bringing practical technical leadership, diagnostics expertise, and a grounded understanding of the hardware that keeps people connected.',
    disciplines: ['Hardware engineering', 'IT troubleshooting', 'Technical operations'],
    location: 'Tamale, Ghana',
    image: rafiqImg,
    width: 1080,
    height: 1080,
    socials: {
      twitter: 'https://x.com/nyabubiyoona1?s=11',
      facebook: 'https://www.facebook.com/share/1E1NGivdg1/?mibextid=wwXIfr',
      website: 'https://msiieautel.com/reg?code=y64x7d',
    },
  },
  {
    id: 'ghostVenom',
    name: 'Ghost Venom',
    role: 'Chief Marketing Officer',
    bio: 'Nigerian ethical hacker, penetration tester, content creator, and QYVORA community manager.',
    profile: 'Ghost Venom is a passionate ethical hacker and penetration tester from Nigeria. Alongside creating cybersecurity content, he manages the QYVORA community—making security knowledge more accessible, encouraging responsible practice, and helping operators learn together in public.',
    disciplines: ['Penetration testing', 'Security content', 'Community building'],
    location: 'Nigeria',
    image: ghostImg,
    width: 1254,
    height: 1254,
    socials: {
      linkedin: 'https://www.linkedin.com/in/ghost-malware-222ab4285/',
    },
  },
];
