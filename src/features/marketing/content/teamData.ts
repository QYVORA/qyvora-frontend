import wsuits6Img from '../../../assets/team/wsuits6.png';
import sethAbbeyImg from '../../../assets/team/seth_abbey.webp';

export interface TeamSocials {
  youtube?: string;
  tiktok?: string;
  twitter?: string; // X
  github?: string;
  linkedin?: string;
  instagram?: string;
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
    name: 'wsuits6',
    handle: 'wsuits6',
    role: 'CEO',
    bio: 'I dont follow paths I burn them then I write my own in code .',
    image: wsuits6Img,
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
    bio: 'Attackers only need that 1 blind spot, find it first',
    image: sethAbbeyImg,
    socials: {
      youtube: 'https://www.youtube.com/@sethabbey-u2c',
      github: 'https://github.com/sethabbey987',
      linkedin: 'https://www.linkedin.com/in/seth-abbey-599029379/',
      twitter: 'https://x.com/sethabbey328208',
    },
  },
];
