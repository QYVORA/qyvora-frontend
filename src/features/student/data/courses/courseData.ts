import type { Course, CourseCategory } from './types';
import { ALL_LESSONS } from './lessons';

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
  {
    id: 'linux-terminal-101',
    title: 'Linux Terminal 101',
    categoryId: 'terminal',
    description:
      'Learn to navigate, control, and exploit the Linux command line. No prior experience needed — start from scratch and gain real terminal skills.',
    overview:
      'The terminal is the hacker\'s cockpit. This course teaches you to navigate the filesystem, manipulate files, manage processes, and chain commands together. Every lesson uses real commands you\'d run on any Linux system.',
    estimatedMinutes: 70,
    cpCost: 75,
    learningObjectives: [
      'Navigate the Linux filesystem using cd, ls, and pwd',
      'Create, read, update, and delete files and directories',
      'Understand file permissions and ownership',
      'Use pipes, redirects, and command chaining',
    ],
    skillLevel: 'beginner',
    popular: true,
    lessons: ALL_LESSONS['linux-terminal-101'],
  },
  {
    id: 'windows-cmd-101',
    title: 'Windows CMD 101',
    categoryId: 'terminal',
    description:
      'Master the Windows Command Prompt and PowerShell. Essential for any hacker targeting Windows environments.',
    overview:
      'Windows is everywhere — in enterprises, government, and home networks. This course teaches you to navigate Windows from the command line, manage files, inspect network configurations, and automate tasks.',
    estimatedMinutes: 50,
    cpCost: 50,
    learningObjectives: [
      'Navigate Windows directories with CMD and PowerShell',
      'Manage files, users, and processes from the command line',
      'Inspect network configuration (ipconfig, netstat)',
      'Write basic batch and PowerShell scripts',
    ],
    skillLevel: 'beginner',
    lessons: ALL_LESSONS['windows-cmd-101'],
  },
  {
    id: 'networking-101',
    title: 'Networking 101',
    categoryId: 'networking',
    description:
      'Understand how computers communicate. Learn IP addresses, ports, protocols, and how data travels across the internet.',
    overview:
      'Every hack begins with a network connection. This course breaks down TCP/IP, DNS, HTTP, and how packets flow. No networking background required — we start from the absolute basics.',
    estimatedMinutes: 60,
    cpCost: 100,
    learningObjectives: [
      'Explain how data is broken into packets and routed across networks',
      'Understand IP addresses, subnets, ports, and the OSI model',
      'Describe how DNS resolves domain names to IP addresses',
      'Use tools like ping, traceroute, and nslookup to inspect network paths',
    ],
    skillLevel: 'beginner',
    prerequisites: ['linux-terminal-101'],
    popular: true,
    lessons: ALL_LESSONS['networking-101'],
  },
  {
    id: 'python-for-hackers-101',
    title: 'Python for Hackers 101',
    categoryId: 'programming',
    description:
      'Learn Python from scratch with a security-focused mindset. Write scripts that scan, scrape, and exploit.',
    overview:
      'Python is the most versatile language in security. This course teaches you the fundamentals — variables, loops, functions, and libraries — through the lens of real hacking tools and techniques.',
    estimatedMinutes: 85,
    cpCost: 100,
    learningObjectives: [
      'Write Python scripts using variables, conditionals, and loops',
      'Work with strings, lists, and dictionaries for data handling',
      'Use the requests and socket libraries for network tasks',
      'Build a simple port scanner and HTTP request tool',
    ],
    skillLevel: 'beginner',
    popular: true,
    lessons: ALL_LESSONS['python-for-hackers-101'],
  },
  {
    id: 'git-github-101',
    title: 'Git & GitHub 101',
    categoryId: 'programming',
    description:
      'Version control every hacker needs. Learn Git fundamentals and collaborate on GitHub like a pro.',
    overview:
      'Every serious project uses Git. This course teaches you to track changes, branch, merge, and collaborate on GitHub. You\'ll learn the commands that power open-source and professional security tools.',
    estimatedMinutes: 55,
    cpCost: 75,
    learningObjectives: [
      'Initialize a Git repository and track changes with commits',
      'Create, switch, and merge branches',
      'Push and pull from GitHub repositories',
      'Collaborate using pull requests and forks',
    ],
    skillLevel: 'beginner',
    lessons: ALL_LESSONS['git-github-101'],
  },
  {
    id: 'web-technologies-101',
    title: 'Web Technologies 101',
    categoryId: 'web-security',
    description:
      'How the web works under the hood. HTTP, cookies, sessions, APIs — the foundation of every web attack.',
    overview:
      'Before you can break web apps, you need to understand how they\'re built. This course covers HTTP requests and responses, HTML forms, cookies, sessions, REST APIs, and the browser security model.',
    estimatedMinutes: 55,
    cpCost: 75,
    learningObjectives: [
      'Understand HTTP methods, status codes, and headers',
      'Explain how cookies and sessions maintain state',
      'Describe how browsers enforce the Same-Origin Policy',
      'Identify the components of a URL and a REST API request',
    ],
    skillLevel: 'beginner',
    prerequisites: ['networking-101'],
    lessons: ALL_LESSONS['web-technologies-101'],
  },
  {
    id: 'web-recon-101',
    title: 'Web Reconnaissance 101',
    categoryId: 'web-security',
    description:
      'Gather intelligence on web targets. Learn subdomain enumeration, directory brute-forcing, and fingerprinting.',
    overview:
      'Reconnaissance is 80% of hacking. This course teaches you to discover subdomains, identify technologies, find hidden directories, and map out a target\'s attack surface using free tools.',
    estimatedMinutes: 55,
    cpCost: 75,
    learningObjectives: [
      'Use tools like Sublist3r and Amass for subdomain enumeration',
      'Perform directory brute-forcing with ffuf and dirb',
      'Fingerprint web technologies using WhatWeb and Wappalyzer',
      'Map out a target\'s attack surface from reconnaissance data',
    ],
    skillLevel: 'intermediate',
    prerequisites: ['web-technologies-101'],
    popular: true,
    lessons: ALL_LESSONS['web-recon-101'],
  },
  {
    id: 'burp-suite-101',
    title: 'Burp Suite 101',
    categoryId: 'tools',
    description:
      'The industry standard for web application security testing. Learn to intercept, modify, and replay HTTP traffic.',
    overview:
      'Burp Suite is the Swiss Army knife of web security testing. This course teaches you to set up the proxy, intercept requests, use Repeater and Intruder, and analyze web traffic like a professional penetration tester.',
    estimatedMinutes: 65,
    cpCost: 100,
    learningObjectives: [
      'Configure Burp Suite as an intercepting proxy',
      'Intercept, inspect, and modify HTTP requests in real time',
      'Use Repeater to manually craft and resend requests',
      'Use Intruder to automate parameter fuzzing and brute-force attacks',
    ],
    skillLevel: 'intermediate',
    prerequisites: ['web-technologies-101'],
    lessons: ALL_LESSONS['burp-suite-101'],
  },
  {
    id: 'sql-injection-101',
    title: 'SQL Injection 101',
    categoryId: 'web-security',
    description:
      'The most infamous web vulnerability. Learn to find, exploit, and prevent SQL injection attacks.',
    overview:
      'SQL injection has been the #1 web vulnerability for two decades. This course teaches you how databases work, how SQL queries are constructed, and how attackers inject malicious SQL to extract data, bypass auth, and compromise systems.',
    estimatedMinutes: 85,
    cpCost: 100,
    learningObjectives: [
      'Understand how SQL databases store and retrieve data',
      'Identify SQL injection points in web applications',
      'Exploit SQLi to bypass authentication and extract data',
      'Apply parameterized queries and prepared statements as defenses',
    ],
    skillLevel: 'intermediate',
    prerequisites: ['web-technologies-101'],
    popular: true,
    lessons: ALL_LESSONS['sql-injection-101'],
  },
  {
    id: 'wifi-fundamentals-101',
    title: 'Wi-Fi Fundamentals 101',
    categoryId: 'wireless',
    description:
      'Understand wireless networks from the radio waves up. Learn about encryption, authentication, and common attacks.',
    overview:
      'Wireless networks are everywhere and often the weakest link. This course covers how Wi-Fi works, the difference between 2.4 GHz and 5 GHz, WPA2/WPA3 encryption, and the basics of wireless reconnaissance and attacks.',
    estimatedMinutes: 55,
    cpCost: 75,
    learningObjectives: [
      'Explain how Wi-Fi uses radio frequencies to transmit data',
      'Understand the difference between 2.4 GHz and 5 GHz bands',
      'Describe WPA2 and WPA3 encryption mechanisms',
      'Identify common wireless attack vectors and mitigations',
    ],
    skillLevel: 'beginner',
    lessons: ALL_LESSONS['wifi-fundamentals-101'],
  },
  {
    id: 'nmap-101',
    title: 'Nmap 101',
    categoryId: 'tools',
    description:
      'The network mapper every hacker must master. Learn to scan hosts, discover services, and fingerprint operating systems.',
    overview:
      'Nmap is the most widely used network discovery tool in security. This course teaches you to scan networks, detect open ports, identify running services, and fingerprint operating systems — the essential first step in any network assessment.',
    estimatedMinutes: 60,
    cpCost: 75,
    learningObjectives: [
      'Perform basic and advanced scans with Nmap',
      'Detect open ports and identify running services',
      'Fingerprint operating systems remotely',
      'Write NSE scripts for automated reconnaissance',
    ],
    skillLevel: 'beginner',
    prerequisites: ['networking-101'],
    popular: true,
    lessons: ALL_LESSONS['nmap-101'],
  },
  {
    id: 'wireshark-101',
    title: 'Wireshark 101',
    categoryId: 'tools',
    description:
      'See every packet on the wire. Learn to capture, filter, and analyze network traffic like a forensics expert.',
    overview:
      'Wireshark lets you see exactly what\'s happening on a network. This course teaches you to capture live traffic, apply display and capture filters, follow TCP streams, and identify malicious patterns in packet captures.',
    estimatedMinutes: 65,
    cpCost: 75,
    learningObjectives: [
      'Capture live network traffic with Wireshark',
      'Apply display filters to isolate specific protocols and hosts',
      'Follow TCP streams to reconstruct conversations',
      'Identify common malicious traffic patterns in packet captures',
    ],
    skillLevel: 'intermediate',
    prerequisites: ['networking-101'],
    lessons: ALL_LESSONS['wireshark-101'],
  },
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
