import wsuits6Img from '@/assets/team/wsuits6.webp';
import sopt4Img from '@/assets/team/sopt4.webp';
import rafiqImg from '@/assets/team/mohammed_rafiq.webp';
import ghostImg from '@/assets/quiteRoot/WhatsApp Image 2026-07-16 at 10.45.41 PM.jpeg';

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
  image: string;
  socials: TeamSocials;
}

export const teamData: TeamMember[] = [
  {
    id: 'wsuits6',
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
  {
    id: 'mohammedRafiq',
    name: 'Mohammed Rafiq',
    role: 'CFO',
    bio: "I don\u2019t protect assets\u2014I grow them wisely.",
    image: rafiqImg,
    socials: {
      twitter: 'https://x.com/nyabubiyoona1?s=11',
      facebook: 'https://www.facebook.com/share/1E1NGivdg1/?mibextid=wwXIfr',
      website: 'https://msiieautel.com/reg?code=y64x7d',
    },
  },
  {
    id: 'ghostVenom',
    name: 'Ghost Venom',
    role: 'CM',
    bio: 'I am curious to know how things work in building my skills in cybersecurity .',
    image: ghostImg,
    socials: {
      linkedin: 'https://www.linkedin.com/in/ghost-malware-222ab4285/',
    },
  },
];
