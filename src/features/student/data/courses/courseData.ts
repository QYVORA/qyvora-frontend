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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#0a0e0a"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#1a1e1a" stroke="#4ade80" stroke-width="1"/><rect x="20" y="20" width="360" height="36" rx="8" fill="#2a2e2a"/><circle cx="40" cy="38" r="6" fill="#ff5f57"/><circle cx="60" cy="38" r="6" fill="#ffbd2e"/><circle cx="80" cy="38" r="6" fill="#28c840"/><text x="120" y="44" fill="#888" font-family="monospace" font-size="14">user@qyvora:~$</text><text x="30" y="90" fill="#4ade80" font-family="monospace" font-size="16">$ ls -la</text><text x="30" y="120" fill="#888" font-family="monospace" font-size="14">drwxr-xr-x  2 user user 4096 Jul  4 12:00 .</text><text x="30" y="140" fill="#888" font-family="monospace" font-size="14">drwxr-xr-x  5 user user 4096 Jul  4 12:00 ..</text><text x="30" y="160" fill="#fff" font-family="monospace" font-size="16">$ <tspan fill="#4ade80">cat</tspan> <tspan fill="#ffbd2e">secret.txt</tspan></text><text x="30" y="190" fill="#ff5f57" font-family="monospace" font-size="14">Access Denied</text><rect x="158" y="180" width="8" height="16" fill="#4ade80"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect></svg>`
    )}`,
    estimatedMinutes: 35,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#0a0e2a"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#1a1e3a" stroke="#00bcf2" stroke-width="1"/><rect x="20" y="20" width="360" height="36" rx="8" fill="#2a2e4a"/><text x="40" y="44" fill="#00bcf2" font-family="monospace" font-size="14">C:\\Users\\QYVORA&gt;</text><text x="30" y="90" fill="#fff" font-family="monospace" font-size="16">C:\\&gt; <tspan fill="#00bcf2">ipconfig</tspan></text><text x="30" y="120" fill="#888" font-family="monospace" font-size="13">IPv4 Address. . . . : 192.168.1.42</text><text x="30" y="140" fill="#888" font-family="monospace" font-size="13">Subnet Mask . . . . : 255.255.255.0</text><text x="30" y="160" fill="#fff" font-family="monospace" font-size="16">C:\\&gt; <tspan fill="#00bcf2">netstat -an</tspan></text><text x="30" y="185" fill="#ff5f57" font-family="monospace" font-size="13">TCP  0.0.0.0:445   LISTENING</text><rect x="220" y="175" width="8" height="16" fill="#00bcf2"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect></svg>`
    )}`,
    estimatedMinutes: 30,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#0a0e1a"/><circle cx="200" cy="125" r="90" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="6 4"/><circle cx="200" cy="125" r="45" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="200" cy="125" r="18" fill="#3b82f6" opacity="0.3"/><circle cx="200" cy="125" r="6" fill="#60a5fa"/><circle cx="120" cy="80" r="5" fill="#f59e0b"/><circle cx="280" cy="80" r="5" fill="#10b981"/><circle cx="120" cy="170" r="5" fill="#ef4444"/><circle cx="280" cy="170" r="5" fill="#8b5cf6"/><line x1="125" y1="80" x2="195" y2="120" stroke="#f59e0b" stroke-width="1.5" opacity="0.6"/><line x1="280" y1="80" x2="205" y2="120" stroke="#10b981" stroke-width="1.5" opacity="0.6"/><line x1="120" y1="170" x2="195" y2="130" stroke="#ef4444" stroke-width="1.5" opacity="0.6"/><line x1="280" y1="170" x2="205" y2="130" stroke="#8b5cf6" stroke-width="1.5" opacity="0.6"/><text x="80" y="50" fill="#888" font-family="monospace" font-size="10">Client</text><text x="260" y="50" fill="#888" font-family="monospace" font-size="10">Server</text><text x="140" y="230" fill="#3b82f6" font-family="monospace" font-size="11">10.0.0.0/24</text></svg>`
    )}`,
    estimatedMinutes: 40,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#1e1e1e"/><rect x="20" y="20" width="360" height="210" rx="6" fill="#2d2d2d"/><rect x="20" y="20" width="70" height="30" rx="6" fill="#3d3d3d"/><text x="28" y="40" fill="#888" font-family="monospace" font-size="11">exploit.py</text><text x="30" y="80" fill="#569cd6" font-family="monospace" font-size="13">import</text><text x="80" y="80" fill="#ce9178" font-family="monospace" font-size="13"> socket</text><text x="30" y="105" fill="#569cd6" font-family="monospace" font-size="13">import</text><text x="80" y="105" fill="#ce9178" font-family="monospace" font-size="13"> requests</text><text x="30" y="135" fill="#c586c0" font-family="monospace" font-size="13">def</text><text x="66" y="135" fill="#dcdcaa" font-family="monospace" font-size="13">scan_port</text><text x="156" y="135" fill="#d4d4d4" font-family="monospace" font-size="13">(host, port):</text><text x="50" y="160" fill="#d4d4d4" font-family="monospace" font-size="13">s = socket.socket()</text><text x="50" y="180" fill="#d4d4d4" font-family="monospace" font-size="13">result = s.connect_ex(</text><text x="50" y="195" fill="#d4d4d4" font-family="monospace" font-size="13">    (host, port))</text><text x="50" y="215" fill="#6a9955" font-family="monospace" font-size="13"># Port scanner ready</text></svg>`
    )}`,
    estimatedMinutes: 50,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#1a1a2e"/><rect x="30" y="40" width="340" height="170" rx="8" fill="#16213e" stroke="#f0f6fc" stroke-width="1"/><circle cx="65" cy="70" r="8" fill="#f0f6fc" opacity="0.2"/><text x="80" y="75" fill="#f0f6fc" font-family="monospace" font-size="12" font-weight="bold">main</text><text x="120" y="75" fill="#888" font-family="monospace" font-size="10">Updated README.md</text><line x1="65" y1="110" x2="65" y2="160" stroke="#f0f6fc" stroke-width="2" opacity="0.3"/><circle cx="65" cy="110" r="6" fill="#f0f6fc"/><text x="80" y="114" fill="#f0f6fc" font-family="monospace" font-size="11">feat: add scanner module</text><circle cx="65" cy="140" r="5" fill="#f0f6fc" opacity="0.5"/><text x="80" y="144" fill="#888" font-family="monospace" font-size="11">fix: handle edge case</text><circle cx="65" cy="160" r="5" fill="#f0f6fc" opacity="0.5"/><text x="80" y="164" fill="#888" font-family="monospace" font-size="11">docs: update usage</text><line x1="65" y1="160" x2="160" y2="160" stroke="#f0f6fc" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.5"/><circle cx="160" cy="160" r="5" fill="#2ea043"/><text x="175" y="164" fill="#2ea043" font-family="monospace" font-size="11">feature-branch</text></svg>`
    )}`,
    estimatedMinutes: 35,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#1a1a2e"/><rect x="30" y="60" width="140" height="100" rx="10" fill="#16213e" stroke="#3b82f6" stroke-width="1.5"/><text x="55" y="100" fill="#3b82f6" font-family="monospace" font-size="10">GET</text><text x="88" y="100" fill="#f0f6fc" font-family="monospace" font-size="10">/login</text><text x="55" y="120" fill="#888" font-family="monospace" font-size="9">Host: example.com</text><text x="55" y="135" fill="#888" font-family="monospace" font-size="9">Cookie: session=abc</text><text x="230" y="60" width="140" height="100" rx="10" fill="#16213e" stroke="#10b981" stroke-width="1.5"/><text x="255" y="100" fill="#10b981" font-family="monospace" font-size="10">200 OK</text><text x="255" y="120" fill="#888" font-family="monospace" font-size="9">Content-Type: text/html</text><text x="255" y="135" fill="#888" font-family="monospace" font-size="9">Set-Cookie: session=xyz</text><line x1="170" y1="110" x2="230" y2="110" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 3"/><text x="185" y="105" fill="#f59e0b" font-family="monospace" font-size="9">HTTP</text></svg>`
    )}`,
    estimatedMinutes: 35,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#0a0e1a"/><circle cx="200" cy="100" r="35" fill="none" stroke="#3b82f6" stroke-width="2"/><text x="180" y="105" fill="#3b82f6" font-family="monospace" font-size="16">?</text><circle cx="120" cy="60" r="12" fill="none" stroke="#f59e0b" stroke-width="1.5"/><text x="116" y="65" fill="#f59e0b" font-family="monospace" font-size="10">api</text><circle cx="280" cy="60" r="12" fill="none" stroke="#f59e0b" stroke-width="1.5"/><text x="266" y="65" fill="#f59e0b" font-family="monospace" font-size="10">admin</text><circle cx="80" cy="140" r="12" fill="none" stroke="#f59e0b" stroke-width="1.5"/><text x="68" y="145" fill="#f59e0b" font-family="monospace" font-size="10">dev</text><circle cx="320" cy="140" r="12" fill="none" stroke="#f59e0b" stroke-width="1.5"/><text x="300" y="145" fill="#f59e0b" font-family="monospace" font-size="10">blog</text><circle cx="200" cy="190" r="12" fill="none" stroke="#f59e0b" stroke-width="1.5"/><text x="186" y="195" fill="#f59e0b" font-family="monospace" font-size="10">cdn</text><line x1="140" y1="95" x2="125" y2="70" stroke="#888" stroke-width="1" opacity="0.4"/><line x1="260" y1="95" x2="275" y2="70" stroke="#888" stroke-width="1" opacity="0.4"/><line x1="170" y1="120" x2="90" y2="135" stroke="#888" stroke-width="1" opacity="0.4"/><line x1="230" y1="120" x2="310" y2="135" stroke="#888" stroke-width="1" opacity="0.4"/><line x1="200" y1="135" x2="200" y2="180" stroke="#888" stroke-width="1" opacity="0.4"/></svg>`
    )}`,
    estimatedMinutes: 40,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#1e1e1e"/><rect x="20" y="40" width="220" height="170" rx="4" fill="#2d2d2d" stroke="#ff8c00" stroke-width="1"/><text x="30" y="65" fill="#ff8c00" font-family="monospace" font-size="11" font-weight="bold">Proxy</text><rect x="30" y="75" width="200" height="25" fill="#3d3d3d" rx="2"/><text x="35" y="92" fill="#888" font-family="monospace" font-size="10">GET /admin HTTP/1.1</text><rect x="30" y="105" width="200" height="25" fill="#3d3d3d" rx="2"/><text x="35" y="122" fill="#ce9178" font-family="monospace" font-size="10">Host: target.com</text><rect x="30" y="135" width="200" height="25" fill="#3d3d3d" rx="2"/><text x="35" y="152" fill="#6a9955" font-family="monospace" font-size="10">Cookie: session=...</text><rect x="260" y="40" width="120" height="80" rx="4" fill="#2d2d2d" stroke="#ff8c00" stroke-width="1"/><text x="270" y="65" fill="#ff8c00" font-family="monospace" font-size="11" font-weight="bold">Repeater</text><text x="270" y="90" fill="#888" font-family="monospace" font-size="10">Send ▸</text><text x="270" y="108" fill="#fff" font-family="monospace" font-size="10">200 OK</text><rect x="260" y="130" width="120" height="80" rx="4" fill="#2d2d2d" stroke="#ff8c00" stroke-width="1"/><text x="270" y="155" fill="#ff8c00" font-family="monospace" font-size="11" font-weight="bold">Intruder</text><text x="270" y="180" fill="#888" font-family="monospace" font-size="10">Positions: 1</text></svg>`
    )}`,
    estimatedMinutes: 45,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#0a0e1a"/><rect x="30" y="40" width="340" height="170" rx="8" fill="#1a1e2e" stroke="#ef4444" stroke-width="1.5"/><text x="50" y="80" fill="#569cd6" font-family="monospace" font-size="13">SELECT</text><text x="120" y="80" fill="#d4d4d4" font-family="monospace" font-size="13">* FROM users</text><text x="50" y="105" fill="#569cd6" font-family="monospace" font-size="13">WHERE</text><text x="110" y="105" fill="#d4d4d4" font-family="monospace" font-size="13">username = </text><text x="200" y="105" fill="#ce9178" font-family="monospace" font-size="13">'admin'</text><text x="50" y="130" fill="#569cd6" font-family="monospace" font-size="13">AND</text><text x="96" y="130" fill="#d4d4d4" font-family="monospace" font-size="13">password = </text><text x="178" y="130" fill="#ce9178" font-family="monospace" font-size="13">'</text><text x="188" y="130" fill="#ef4444" font-family="monospace" font-size="13">' OR '1'='1</text><text x="300" y="130" fill="#ce9178" font-family="monospace" font-size="13">'</text><text x="50" y="165" fill="#6a9955" font-family="monospace" font-size="12">-- Bypasses authentication entirely</text><rect x="188" y="118" width="112" height="20" fill="#ef4444" opacity="0.15" rx="3"/><text x="50" y="195" fill="#ef4444" font-family="monospace" font-size="14" font-weight="bold">INJECTION DETECTED</text></svg>`
    )}`,
    estimatedMinutes: 50,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#0a0e1a"/><circle cx="200" cy="130" r="20" fill="none" stroke="#888" stroke-width="1.5"/><path d="M155 100 Q200 60 245 100" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.5"/><path d="M120 80 Q200 20 280 80" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.3"/><path d="M85 60 Q200 -20 315 60" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.15"/><rect x="165" y="160" width="70" height="25" rx="4" fill="#1a1e2e" stroke="#f59e0b" stroke-width="1"/><text x="175" y="177" fill="#f59e0b" font-family="monospace" font-size="10">AP</text><line x1="140" y1="85" x2="175" y2="160" stroke="#888" stroke-width="1" opacity="0.3"/><line x1="260" y1="85" x2="225" y2="160" stroke="#888" stroke-width="1" opacity="0.3"/><text x="50" y="230" fill="#888" font-family="monospace" font-size="10">2.4 GHz</text><text x="280" y="230" fill="#888" font-family="monospace" font-size="10">5 GHz</text></svg>`
    )}`,
    estimatedMinutes: 35,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#0a0e0a"/><rect x="20" y="20" width="360" height="210" rx="6" fill="#1a1e1a" stroke="#4ade80" stroke-width="1"/><text x="30" y="55" fill="#888" font-family="monospace" font-size="11">$ nmap -sV 192.168.1.0/24</text><text x="30" y="80" fill="#4ade80" font-family="monospace" font-size="11">Nmap scan report for 192.168.1.1</text><text x="30" y="100" fill="#888" font-family="monospace" font-size="10">22/tcp  open  ssh     OpenSSH 8.9p1</text><text x="30" y="120" fill="#888" font-family="monospace" font-size="10">80/tcp  open  http    Apache 2.4.57</text><text x="30" y="140" fill="#888" font-family="monospace" font-size="10">443/tcp open  https   Apache 2.4.57</text><text x="30" y="160" fill="#888" font-family="monospace" font-size="10">8080/tcp open http-proxy</text><text x="30" y="185" fill="#4ade80" font-family="monospace" font-size="11">Nmap done: 256 hosts scanned</text><rect x="380" y="175" width="8" height="16" fill="#4ade80"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect></svg>`
    )}`,
    estimatedMinutes: 40,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="#1e1e2e"/><rect x="20" y="20" width="360" height="210" rx="6" fill="#2d2d3e"/><text x="30" y="50" fill="#888" font-family="monospace" font-size="10">No.  Time    Source          Dest            Protocol</text><rect x="30" y="55" width="340" height="1" fill="#3d3d5e"/><text x="30" y="70" fill="#fff" font-family="monospace" font-size="10">1  0.000   10.0.0.1        192.168.1.1     TCP</text><text x="30" y="85" fill="#888" font-family="monospace" font-size="10">2  0.002   192.168.1.1     10.0.0.1        TCP</text><text x="30" y="100" fill="#3b82f6" font-family="monospace" font-size="10">3  0.005   10.0.0.1        192.168.1.1     HTTP</text><rect x="30" y="110" width="340" height="40" fill="#3d3d5e" rx="3"/><text x="35" y="125" fill="#ce9178" font-family="monospace" font-size="10">GET /secret HTTP/1.1</text><text x="35" y="140" fill="#ce9178" font-family="monospace" font-size="10">Host: vulnerable.com</text><text x="30" y="170" fill="#6a9955" font-family="monospace" font-size="10">Frame 3: 342 bytes on wire</text><rect x="340" y="195" width="8" height="16" fill="#3b82f6"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect></svg>`
    )}`,
    estimatedMinutes: 45,
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
