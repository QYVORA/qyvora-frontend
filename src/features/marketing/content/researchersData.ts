import giantImg from '@/assets/quiteRoot/711f362b-0f9e-4030-8602-640d4626e903.webp';
import awalImg from '@/assets/quiteRoot/197788-entenda-a-importancia-do-suporte-tecnico-para-software-financeiro.jpg';
import zeroImg from '@/assets/quiteRoot/WhatsApp Image 2026-07-09 at 9.23.16 PM.webp';
import ghostImg from '@/assets/quiteRoot/WhatsApp Image 2026-07-16 at 10.45.41 PM.jpeg';

export interface Researcher {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const researchersData: Researcher[] = [
  {
    id: 'r1',
    name: 'Awalle Grammator',
    role: 'Graphic designer',
    bio: "I'm a creative graphic designer with a passion for turning ideas into visually compelling designs that connect with audiences.",
    image: awalImg,
  },
  {
    id: 'r2',
    name: 'L. Giant',
    role: 'Software Engineer',
    bio: 'Specialises in software development and automation for detection engineering.',
    image: giantImg,
  },
  {
    id: 'r3',
    name: 'Zero Mind',
    role: 'Security Researcher',
    bio: 'I help Qyvora identify and understand security vulnerabilities through hands-on research and web application testing.',
    image: zeroImg,
  },
  {
    id: 'r4',
    name: 'Ghost Venom',
    role: 'Penetration Tester',
    bio: 'I am curious to know how things work in building my skills in cybersecurity,',
    image: ghostImg,
  },
];

export default researchersData;
