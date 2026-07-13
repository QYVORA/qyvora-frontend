/**
 * TOPIC MAP — Cross-Feature Linking
 * ==================================
 * Maps shared topics across Labs, Courses, and HPB rooms.
 * Used by RelatedContent to show "See Also" sections.
 */

export type ContentType = 'course' | 'lab' | 'hpb';

export interface ContentRef {
  type: ContentType;
  id: string;
  title: string;
  subtitle?: string;
  route: string;
  icon?: string;
  color?: string;
}

export interface Topic {
  id: string;
  label: string;
  icon: string;
  courses: string[];
  labs: string[];
  hpbRooms: Array<{ phaseId: string; roomId: string }>;
}

// ── Topic Definitions ─────────────────────────────────────────────────────────
export const TOPICS: Topic[] = [
  {
    id: 'terminal-linux',
    label: 'Linux Terminal',
    icon: '>_',
    courses: ['linux-terminal-101'],
    labs: ['privesc'],
    hpbRooms: [
      { phaseId: 'phase2', roomId: 'room1' },
      { phaseId: 'phase2', roomId: 'room2' },
      { phaseId: 'phase2', roomId: 'room3' },
    ],
  },
  {
    id: 'terminal-windows',
    label: 'Windows CMD',
    icon: 'C:\\',
    courses: ['windows-cmd-101'],
    labs: ['killchain'],
    hpbRooms: [
      { phaseId: 'phase2', roomId: 'room4' },
    ],
  },
  {
    id: 'networking',
    label: 'Networking',
    icon: 'net',
    courses: ['networking-101'],
    labs: ['traffic', 'proxy'],
    hpbRooms: [
      { phaseId: 'phase3', roomId: 'room1' },
      { phaseId: 'phase3', roomId: 'room2' },
    ],
  },
  {
    id: 'web-security',
    label: 'Web Security',
    icon: 'www',
    courses: ['web-technologies-101', 'web-recon-101', 'burp-suite-101'],
    labs: ['webapp', 'sqli', 'proxy'],
    hpbRooms: [
      { phaseId: 'phase4', roomId: 'room1' },
      { phaseId: 'phase4', roomId: 'room2' },
      { phaseId: 'phase4', roomId: 'room3' },
    ],
  },
  {
    id: 'sql-injection',
    label: 'SQL Injection',
    icon: '1=1',
    courses: ['sql-injection-101'],
    labs: ['sqli'],
    hpbRooms: [
      { phaseId: 'phase4', roomId: 'room2' },
    ],
  },
  {
    id: 'social-engineering',
    label: 'Social Engineering',
    icon: '@',
    courses: [],
    labs: ['phishing'],
    hpbRooms: [
      { phaseId: 'phase5', roomId: 'room1' },
      { phaseId: 'phase5', roomId: 'room2' },
    ],
  },
  {
    id: 'wireless',
    label: 'Wireless Security',
    icon: '~',
    courses: ['wifi-fundamentals-101'],
    labs: ['wireless'],
    hpbRooms: [
      { phaseId: 'phase3', roomId: 'room3' },
    ],
  },
  {
    id: 'osint',
    label: 'OSINT & Recon',
    icon: '*',
    courses: ['web-recon-101', 'nmap-101'],
    labs: ['osint'],
    hpbRooms: [
      { phaseId: 'phase1', roomId: 'room3' },
      { phaseId: 'phase3', roomId: 'room1' },
    ],
  },
  {
    id: 'passwords',
    label: 'Password Attacks',
    icon: '#',
    courses: ['linux-terminal-101'],
    labs: ['passwords'],
    hpbRooms: [
      { phaseId: 'phase4', roomId: 'room3' },
    ],
  },
  {
    id: 'tools',
    label: 'Security Tools',
    icon: '$',
    courses: ['burp-suite-101', 'nmap-101', 'wireshark-101'],
    labs: ['proxy', 'traffic', 'killchain'],
    hpbRooms: [
      { phaseId: 'phase3', roomId: 'room2' },
      { phaseId: 'phase4', roomId: 'room1' },
    ],
  },
  {
    id: 'programming',
    label: 'Programming',
    icon: '{}',
    courses: ['python-for-hackers-101', 'git-github-101'],
    labs: [],
    hpbRooms: [],
  },
  {
    id: 'mindset',
    label: 'Hacker Mindset',
    icon: '0x',
    courses: [],
    labs: ['killchain'],
    hpbRooms: [
      { phaseId: 'phase1', roomId: 'room1' },
      { phaseId: 'phase1', roomId: 'room2' },
    ],
  },
];

// ── Static Content References ─────────────────────────────────────────────────
const COURSE_REFS: Record<string, ContentRef> = {
  'linux-terminal-101': { type: 'course', id: 'linux-terminal-101', title: 'Linux Terminal 101', subtitle: 'Master the command line', route: '/courses/linux-terminal-101', color: '#4ade80' },
  'windows-cmd-101': { type: 'course', id: 'windows-cmd-101', title: 'Windows CMD 101', subtitle: 'Windows command line', route: '/courses/windows-cmd-101', color: '#00bcf2' },
  'networking-101': { type: 'course', id: 'networking-101', title: 'Networking 101', subtitle: 'IP, ports, protocols', route: '/courses/networking-101', color: '#3b82f6' },
  'python-for-hackers-101': { type: 'course', id: 'python-for-hackers-101', title: 'Python for Hackers 101', subtitle: 'Security scripting', route: '/courses/python-for-hackers-101', color: '#fbbf24' },
  'git-github-101': { type: 'course', id: 'git-github-101', title: 'Git & GitHub 101', subtitle: 'Version control', route: '/courses/git-github-101', color: '#f05032' },
  'web-technologies-101': { type: 'course', id: 'web-technologies-101', title: 'Web Technologies 101', subtitle: 'HTTP, cookies, sessions', route: '/courses/web-technologies-101', color: '#6366f1' },
  'web-recon-101': { type: 'course', id: 'web-recon-101', title: 'Web Reconnaissance 101', subtitle: 'Subdomains & fingerprinting', route: '/courses/web-recon-101', color: '#8b5cf6' },
  'burp-suite-101': { type: 'course', id: 'burp-suite-101', title: 'Burp Suite 101', subtitle: 'Web app testing proxy', route: '/courses/burp-suite-101', color: '#ff6600' },
  'sql-injection-101': { type: 'course', id: 'sql-injection-101', title: 'SQL Injection 101', subtitle: 'Exploit databases', route: '/courses/sql-injection-101', color: '#0ea5e9' },
  'wifi-fundamentals-101': { type: 'course', id: 'wifi-fundamentals-101', title: 'Wi-Fi Fundamentals 101', subtitle: 'Wireless networks', route: '/courses/wifi-fundamentals-101', color: '#f59e0b' },
  'nmap-101': { type: 'course', id: 'nmap-101', title: 'Nmap 101', subtitle: 'Network scanning', route: '/courses/nmap-101', color: '#10b981' },
  'wireshark-101': { type: 'course', id: 'wireshark-101', title: 'Wireshark 101', subtitle: 'Packet analysis', route: '/courses/wireshark-101', color: '#3b82f6' },
};

const LAB_REFS: Record<string, ContentRef> = {
  privesc: { type: 'lab', id: 'privesc', title: 'Privilege Escalation', subtitle: 'Escalate to root', route: '/dashboard/labs/privesc', color: '#FBBF24' },
  passwords: { type: 'lab', id: 'passwords', title: 'Password Cracking', subtitle: 'Crack password hashes', route: '/dashboard/labs/passwords', color: '#F59E0B' },
  webapp: { type: 'lab', id: 'webapp', title: 'Web Exploitation', subtitle: 'Exploit web vulnerabilities', route: '/dashboard/labs/web-exploitation', color: '#EF4444' },
  sqli: { type: 'lab', id: 'sqli', title: 'SQL Injection', subtitle: 'Extract data via SQLi', route: '/dashboard/labs/sql-injection', color: '#06B66F' },
  phishing: { type: 'lab', id: 'phishing', title: 'Phishing Analysis', subtitle: 'Identify phishing campaigns', route: '/dashboard/labs/phishing', color: '#8B5CF6' },
  proxy: { type: 'lab', id: 'proxy', title: 'Web Proxy', subtitle: 'Intercept HTTP traffic', route: '/dashboard/labs/proxy', color: '#10B981' },
  traffic: { type: 'lab', id: 'traffic', title: 'Traffic Analysis', subtitle: 'Analyze network traffic', route: '/dashboard/labs/traffic', color: '#84CC16' },
  osint: { type: 'lab', id: 'osint', title: 'OSINT Recon', subtitle: 'Open source intelligence', route: '/dashboard/labs/osint', color: '#0EA5E9' },
  wireless: { type: 'lab', id: 'wireless', title: 'Wireless Security', subtitle: 'Crack wireless encryption', route: '/dashboard/labs/wireless', color: '#F59E0B' },
  killchain: { type: 'lab', id: 'killchain', title: 'Kill Chain', subtitle: 'Full pentest walkthrough', route: '/dashboard/labs/kill-chain', color: '#DC2626' },
};

const HPB_ROOM_REFS: Record<string, ContentRef> = {
  'phase1:room1': { type: 'hpb', id: 'phase1:room1', title: 'Introduction to Offensive Security', subtitle: 'Hacker Mindset', route: '/dashboard/bootcamps/hpb/phases/phase1/rooms/room1', color: '#06B66F' },
  'phase1:room2': { type: 'hpb', id: 'phase1:room2', title: 'Legal & Ethical Framework', subtitle: 'Hacker Mindset', route: '/dashboard/bootcamps/hpb/phases/phase1/rooms/room2', color: '#06B66F' },
  'phase1:room3': { type: 'hpb', id: 'phase1:room3', title: 'Setting Up Your Lab', subtitle: 'Hacker Mindset', route: '/dashboard/bootcamps/hpb/phases/phase1/rooms/room3', color: '#06B66F' },
  'phase2:room1': { type: 'hpb', id: 'phase2:room1', title: 'Linux Fundamentals', subtitle: 'Linux Essentials', route: '/dashboard/bootcamps/hpb/phases/phase2/rooms/room1', color: '#60A5FA' },
  'phase2:room2': { type: 'hpb', id: 'phase2:room2', title: 'File System Navigation', subtitle: 'Linux Essentials', route: '/dashboard/bootcamps/hpb/phases/phase2/rooms/room2', color: '#60A5FA' },
  'phase2:room3': { type: 'hpb', id: 'phase2:room3', title: 'Process Management', subtitle: 'Linux Essentials', route: '/dashboard/bootcamps/hpb/phases/phase2/rooms/room3', color: '#60A5FA' },
  'phase2:room4': { type: 'hpb', id: 'phase2:room4', title: 'Windows Command Line', subtitle: 'Windows Essentials', route: '/dashboard/bootcamps/hpb/phases/phase2/rooms/room4', color: '#60A5FA' },
  'phase3:room1': { type: 'hpb', id: 'phase3:room1', title: 'Network Fundamentals', subtitle: 'Networking', route: '/dashboard/bootcamps/hpb/phases/phase3/rooms/room1', color: '#A78BFA' },
  'phase3:room2': { type: 'hpb', id: 'phase3:room2', title: 'Network Scanning', subtitle: 'Networking', route: '/dashboard/bootcamps/hpb/phases/phase3/rooms/room2', color: '#A78BFA' },
  'phase3:room3': { type: 'hpb', id: 'phase3:room3', title: 'Wireless Security', subtitle: 'Wireless', route: '/dashboard/bootcamps/hpb/phases/phase3/rooms/room3', color: '#A78BFA' },
  'phase4:room1': { type: 'hpb', id: 'phase4:room1', title: 'Web App Security', subtitle: 'Web Hacking', route: '/dashboard/bootcamps/hpb/phases/phase4/rooms/room1', color: '#F59E0B' },
  'phase4:room2': { type: 'hpb', id: 'phase4:room2', title: 'SQL Injection', subtitle: 'Web Hacking', route: '/dashboard/bootcamps/hpb/phases/phase4/rooms/room2', color: '#F59E0B' },
  'phase4:room3': { type: 'hpb', id: 'phase4:room3', title: 'Password Attacks', subtitle: 'Web Hacking', route: '/dashboard/bootcamps/hpb/phases/phase4/rooms/room3', color: '#F59E0B' },
  'phase5:room1': { type: 'hpb', id: 'phase5:room1', title: 'Social Engineering', subtitle: 'Social', route: '/dashboard/bootcamps/hpb/phases/phase5/rooms/room1', color: '#EF4444' },
  'phase5:room2': { type: 'hpb', id: 'phase5:room2', title: 'Phishing Campaigns', subtitle: 'Social', route: '/dashboard/bootcamps/hpb/phases/phase5/rooms/room2', color: '#EF4444' },
};

// ── Helper Functions ──────────────────────────────────────────────────────────

function getTopicsForCourse(courseId: string): Topic[] {
  return TOPICS.filter((t) => t.courses.includes(courseId));
}

function getTopicsForLab(labId: string): Topic[] {
  return TOPICS.filter((t) => t.labs.includes(labId));
}

function getTopicsForHpbRoom(phaseId: string, roomId: string): Topic[] {
  return TOPICS.filter((t) =>
    t.hpbRooms.some((r) => r.phaseId === phaseId && r.roomId === roomId)
  );
}

function getRelatedCourses(courseId: string): ContentRef[] {
  const topics = getTopicsForCourse(courseId);
  const seen = new Set<string>([courseId]);
  const results: ContentRef[] = [];
  for (const topic of topics) {
    for (const id of topic.courses) {
      if (!seen.has(id) && COURSE_REFS[id]) {
        seen.add(id);
        results.push(COURSE_REFS[id]);
      }
    }
  }
  return results;
}

function getRelatedLabs(labId: string): ContentRef[] {
  const topics = getTopicsForLab(labId);
  const seen = new Set<string>([labId]);
  const results: ContentRef[] = [];
  for (const topic of topics) {
    for (const id of topic.labs) {
      if (!seen.has(id) && LAB_REFS[id]) {
        seen.add(id);
        results.push(LAB_REFS[id]);
      }
    }
  }
  return results;
}

function getRelatedHpbRooms(phaseId: string, roomId: string): ContentRef[] {
  const topics = getTopicsForHpbRoom(phaseId, roomId);
  const key = `${phaseId}:${roomId}`;
  const seen = new Set<string>([key]);
  const results: ContentRef[] = [];
  for (const topic of topics) {
    for (const room of topic.hpbRooms) {
      const rkey = `${room.phaseId}:${room.roomId}`;
      if (!seen.has(rkey) && HPB_ROOM_REFS[rkey]) {
        seen.add(rkey);
        results.push(HPB_ROOM_REFS[rkey]);
      }
    }
  }
  return results;
}

function getRelatedContentForCourse(courseId: string): { labs: ContentRef[]; hpbRooms: ContentRef[]; courses: ContentRef[] } {
  const topics = getTopicsForCourse(courseId);
  const labIds = new Set<string>([courseId]);
  const hpbKeys = new Set<string>();
  const courseIds = new Set<string>([courseId]);
  const labs: ContentRef[] = [];
  const hpbRooms: ContentRef[] = [];
  const courses: ContentRef[] = [];

  for (const topic of topics) {
    for (const id of topic.courses) {
      if (!courseIds.has(id) && COURSE_REFS[id]) {
        courseIds.add(id);
        courses.push(COURSE_REFS[id]);
      }
    }
    for (const id of topic.labs) {
      if (!labIds.has(id) && LAB_REFS[id]) {
        labIds.add(id);
        labs.push(LAB_REFS[id]);
      }
    }
    for (const room of topic.hpbRooms) {
      const key = `${room.phaseId}:${room.roomId}`;
      if (!hpbKeys.has(key) && HPB_ROOM_REFS[key]) {
        hpbKeys.add(key);
        hpbRooms.push(HPB_ROOM_REFS[key]);
      }
    }
  }
  return { labs, hpbRooms, courses };
}

function getRelatedContentForLab(labId: string): { courses: ContentRef[]; hpbRooms: ContentRef[]; labs: ContentRef[] } {
  const topics = getTopicsForLab(labId);
  const courseIds = new Set<string>();
  const hpbKeys = new Set<string>();
  const labIds = new Set<string>([labId]);
  const courses: ContentRef[] = [];
  const hpbRooms: ContentRef[] = [];
  const labs: ContentRef[] = [];

  for (const topic of topics) {
    for (const id of topic.courses) {
      if (!courseIds.has(id) && COURSE_REFS[id]) {
        courseIds.add(id);
        courses.push(COURSE_REFS[id]);
      }
    }
    for (const room of topic.hpbRooms) {
      const key = `${room.phaseId}:${room.roomId}`;
      if (!hpbKeys.has(key) && HPB_ROOM_REFS[key]) {
        hpbKeys.add(key);
        hpbRooms.push(HPB_ROOM_REFS[key]);
      }
    }
    for (const id of topic.labs) {
      if (!labIds.has(id) && LAB_REFS[id]) {
        labIds.add(id);
        labs.push(LAB_REFS[id]);
      }
    }
  }
  return { courses, hpbRooms, labs };
}

function getRelatedContentForHpbRoom(phaseId: string, roomId: string): { courses: ContentRef[]; labs: ContentRef[]; hpbRooms: ContentRef[] } {
  const topics = getTopicsForHpbRoom(phaseId, roomId);
  const courseIds = new Set<string>();
  const labIds = new Set<string>();
  const hpbKeys = new Set<string>([`${phaseId}:${roomId}`]);
  const courses: ContentRef[] = [];
  const labs: ContentRef[] = [];
  const hpbRooms: ContentRef[] = [];

  for (const topic of topics) {
    for (const id of topic.courses) {
      if (!courseIds.has(id) && COURSE_REFS[id]) {
        courseIds.add(id);
        courses.push(COURSE_REFS[id]);
      }
    }
    for (const id of topic.labs) {
      if (!labIds.has(id) && LAB_REFS[id]) {
        labIds.add(id);
        labs.push(LAB_REFS[id]);
      }
    }
    for (const room of topic.hpbRooms) {
      const key = `${room.phaseId}:${room.roomId}`;
      if (!hpbKeys.has(key) && HPB_ROOM_REFS[key]) {
        hpbKeys.add(key);
        hpbRooms.push(HPB_ROOM_REFS[key]);
      }
    }
  }
  return { courses, labs, hpbRooms };
}

export {
  COURSE_REFS,
  LAB_REFS,
  HPB_ROOM_REFS,
  getRelatedContentForCourse,
  getRelatedContentForLab,
  getRelatedContentForHpbRoom,
};
