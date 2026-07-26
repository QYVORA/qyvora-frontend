import type { Course, CourseCategory } from './types';

import { COURSE as linuxTerminal101 } from './courses/linux-terminal-101';
import { COURSE as windowsCmd101 } from './courses/windows-cmd-101';
import { COURSE as networking101 } from './courses/networking-101';
import { COURSE as pythonForHackers101 } from './courses/python-for-hackers-101';
import { COURSE as gitGithub101 } from './courses/git-github-101';
import { COURSE as webTechnologies101 } from './courses/web-technologies-101';
import { COURSE as webRecon101 } from './courses/web-recon-101';
import { COURSE as burpSuite101 } from './courses/burp-suite-101';
import { COURSE as sqlInjection101 } from './courses/sql-injection-101';
import { COURSE as wifiFundamentals101 } from './courses/wifi-fundamentals-101';
import { COURSE as nmap101 } from './courses/nmap-101';
import { COURSE as wireshark101 } from './courses/wireshark-101';

export const COURSE_CATEGORIES: CourseCategory[] = [
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Master the command line — the hacker\'s primary interface.',
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Understand how data moves across networks and the internet.',
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Learn to write code that automates, exploits, and defends.',
  },
  {
    id: 'web-security',
    name: 'Web Security',
    description: 'Explore how web technologies work and how to secure them.',
  },
  {
    id: 'wireless',
    name: 'Wireless Security',
    description: 'Understand wireless networks and their unique attack surface.',
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Get hands-on with the essential tools of the trade.',
  },
];

export const COURSES: Course[] = [
  linuxTerminal101,
  windowsCmd101,
  networking101,
  pythonForHackers101,
  gitGithub101,
  webTechnologies101,
  webRecon101,
  burpSuite101,
  sqlInjection101,
  wifiFundamentals101,
  nmap101,
  wireshark101,
];

export function getCoursesByCategory(categoryId: string): Course[] {
  return COURSES.filter((c) => c.categoryId === categoryId);
}

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getCategoryById(id: string): CourseCategory | undefined {
  return COURSE_CATEGORIES.find((c) => c.id === id);
}
