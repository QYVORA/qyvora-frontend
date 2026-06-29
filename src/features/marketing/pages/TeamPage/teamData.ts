import wsuits6Img from '../../../../assets/team/wsuits6.jpg';
import sopt4Img from '../../../../assets/team/sopt4.jpeg';

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
      twitter: 'https://x.com/qyvorasec',
      github: 'https://github.com/wsuits6',
      linkedin: 'https://www.linkedin.com/in/wsuits6/',
    },
  },
  {
    id: 'sopt4',
    name: 'sopt4',
    role: 'COO',
    bio: "I don't break systems, i find the flaws so others don't",
    image: sopt4Img,
    socials: {
      youtube: 'https://www.youtube.com/@sethabbey-u2c',
      github: 'https://github.com/sethabbey987',
      linkedin: 'https://www.linkedin.com/in/seth-abbey-599029379/',
      twitter: 'https://x.com/qyvorasec',
    },
  },
];
