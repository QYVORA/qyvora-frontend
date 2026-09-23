import wsuits6Img from '@/assets/team/wsuits6.webp';
import sopt4Img from '@/assets/team/sopt4.webp';
import rafiqImg from '@/assets/team/mohammed_rafiq.webp';
import ghostImg from '@/assets/quiteRoot/WhatsApp Image 2026-07-16 at 10.45.41 PM.webp';
import juniorPentesterImg from '@/assets/team/junior_pentester.webp';
import cyberX6Img from '@/assets/team/cyberX6.webp';
import karimHamidImg from '@/assets/team/karim_hamid.webp';

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
    id: 'cyberX6',
    name: 'CYBER_X6',
    role: 'Lead Penetration Tester',
    bio: 'Lead penetration tester focused on exploitation, attack paths, and real-world security research from Lagos.',
    profile: 'CYBER_X6 is the online alias of Peter O., QYVORA\'s Lead Penetration Tester. Based in Lagos, Nigeria, he works across penetration testing, exploit development, and security research — pressure-testing systems, tracing attack paths, and turning real findings into practical security improvements for QYVORA\'s engagements.',
    disciplines: ['Penetration testing', 'Exploit development', 'Security research'],
    location: 'Lagos, Nigeria',
    image: cyberX6Img,
    width: 720,
    height: 1080,
    socials: {
      github: 'https://github.com/The-cyberX6',
      linkedin: 'https://www.linkedin.com/in/The-cyberX6/',
      twitter: 'https://x.com/The_cyberX6',
    },
  },
  {
    id: 'abdulKarimHamid',
    name: 'Abdul Karim Hamid',
    role: 'Human Resources Manager',
    bio: 'Human resources lead keeping QYVORA\'s operator crew staffed, connected, and growing from Tamale.',
    profile: 'Abdul Karim Hamid is QYVORA\'s Human Resources Manager. Based in Tamale, he oversees the people side of the operation — hiring, culture, and keeping operators connected across the team as QYVORA expands its workforce across Ghana and Nigeria.',
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
  {
    id: 'juniorPentester',
    name: 'Abdul Rahman Peligah',
    handle: 'Abdul_Peligah',
    role: 'Junior Pentester',
    bio: 'Junior pentester cutting his teeth on capture-the-flag, web security, and bug reports alongside QYVORA\'s senior operators.',
    profile: 'Abdul Rahman Peligah is QYVORA\'s Junior Pentester. Still on the grind from the learner side, he is putting QYVORA\'s own bootcamp material to work — running labs, chasing flags, and growing into offensive security under the direct mentorship of the senior crew.',
    disciplines: ['Web security', 'Capture the flag', 'Bug hunting'],
    location: 'Tamale, Ghana',
    image: juniorPentesterImg,
    width: 960,
    height: 960,
    socials: {
      twitter: 'https://x.com/Abdul_Peligah',
      linkedin: 'https://www.linkedin.com/in/mahamud-abdul-rahaman/',
    },
  },
];
