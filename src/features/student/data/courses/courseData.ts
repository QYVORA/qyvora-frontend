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
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><filter id="c-glow-green" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="c-term-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#15803d"/></linearGradient><pattern id="c-grid-green" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="0.8" fill="#4ade80" fill-opacity="0.05"/></pattern></defs><rect width="400" height="250" fill="#060907" rx="12"/><rect width="400" height="250" fill="url(#c-grid-green)" rx="12"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#0b100c" stroke="url(#c-term-grad)" stroke-width="1.5"/><rect x="20" y="20" width="360" height="34" rx="8" fill="#141c16"/><line x1="20" y1="54" x2="380" y2="54" stroke="#4ade80" stroke-width="1" opacity="0.2"/><circle cx="40" cy="37" r="4.5" fill="#ff5f57"/><circle cx="54" cy="37" r="4.5" fill="#ffbd2e"/><circle cx="68" cy="37" r="4.5" fill="#28c840"/><text x="110" y="42" fill="#4ade80" font-family="Courier New, Courier, monospace" font-size="12" font-weight="bold" opacity="0.8">bash - root@qyvora:~</text><g filter="url(#c-glow-green)"><text x="36" y="85" fill="#4ade80" font-family="Courier New, Courier, monospace" font-size="14" font-weight="bold">$ ls -la /secure/passwords</text><text x="36" y="110" fill="#86efac" font-family="Courier New, Courier, monospace" font-size="11" opacity="0.6">drwxr-x--- 2 root root 4096 Jul 12 .</text><text x="36" y="128" fill="#f87171" font-family="Courier New, Courier, monospace" font-size="11">-r-------- 1 root root  128 Jul 12 secret.db</text><text x="36" y="155" fill="#4ade80" font-family="Courier New, Courier, monospace" font-size="14" font-weight="bold">$ cat /secure/passwords/secret.db</text><text x="36" y="185" fill="#f87171" font-family="Courier New, Courier, monospace" font-size="14" font-weight="bold">[-] permission denied: root privileges required</text><rect x="36" y="196" width="9" height="15" fill="#4ade80" opacity="0.8"/></g></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><filter id="c-glow-blue" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="c-win-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00bcf2"/><stop offset="100%" stop-color="#0078d4"/></linearGradient><pattern id="c-grid-blue" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="0.8" fill="#00bcf2" fill-opacity="0.05"/></pattern></defs><rect width="400" height="250" fill="#030814" rx="12"/><rect width="400" height="250" fill="url(#c-grid-blue)" rx="12"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#061024" stroke="url(#c-win-grad)" stroke-width="1.5"/><rect x="20" y="20" width="360" height="34" rx="8" fill="#0b1e3f"/><line x1="20" y1="54" x2="380" y2="54" stroke="#00bcf2" stroke-width="1" opacity="0.2"/><path d="M35 30h4v4h-4zm5 0h4v4h-4zm-5 5h4v4h-4zm5 0h4v4h-4z" fill="#00bcf2" opacity="0.8"/><text x="52" y="42" fill="#00bcf2" font-family="Courier New, Courier, monospace" font-size="12" font-weight="bold" opacity="0.8">Administrator: Windows PowerShell</text><g filter="url(#c-glow-blue)"><text x="36" y="85" fill="#00bcf2" font-family="Courier New, Courier, monospace" font-size="14" font-weight="bold">PS C:\\&gt; ipconfig /all</text><text x="36" y="110" fill="#e0f7ff" font-family="Courier New, Courier, monospace" font-size="11" opacity="0.6">Ethernet adapter vEthernet (Default Switch):</text><text x="36" y="128" fill="#e0f7ff" font-family="Courier New, Courier, monospace" font-size="11" opacity="0.6">   IPv4 Address. . . . . . . . . . : 172.28.16.1</text><text x="36" y="155" fill="#00bcf2" font-family="Courier New, Courier, monospace" font-size="14" font-weight="bold">PS C:\\&gt; Get-Service WinRM</text><text x="36" y="180" fill="#f87171" font-family="Courier New, Courier, monospace" font-size="12" font-weight="bold">Status   Name               DisplayName</text><text x="36" y="198" fill="#4ade80" font-family="Courier New, Courier, monospace" font-size="12" font-weight="bold">Running  winrm              Windows Remote M...</text></g></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><filter id="c-glow-net" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="c-net-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient><pattern id="c-grid-net" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="#3b82f6" fill-opacity="0.08"/></pattern></defs><rect width="400" height="250" fill="#070c18" rx="12"/><rect width="400" height="250" fill="url(#c-grid-net)" rx="12"/><circle cx="200" cy="125" r="90" fill="none" stroke="#1d4ed8" stroke-width="1.5" stroke-opacity="0.2" stroke-dasharray="6 6"/><circle cx="200" cy="125" r="50" fill="none" stroke="#1d4ed8" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="4 4"/><g filter="url(#c-glow-net)"><circle cx="200" cy="125" r="22" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/><circle cx="200" cy="125" r="8" fill="#60a5fa"/><circle cx="100" cy="75" r="14" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/><circle cx="100" cy="75" r="4" fill="#a5b4fc"/><text x="80" y="52" fill="#a5b4fc" font-family="Courier New, Courier, monospace" font-size="11" font-weight="bold">Client-A</text><text x="75" y="103" fill="#6366f1" font-family="Courier New, Courier, monospace" font-size="9">10.0.0.4</text><circle cx="300" cy="75" r="14" fill="#022c22" stroke="#34d399" stroke-width="2"/><circle cx="300" cy="75" r="4" fill="#a7f3d0"/><text x="280" y="52" fill="#a7f3d0" font-family="Courier New, Courier, monospace" font-size="11" font-weight="bold">Server</text><text x="275" y="103" fill="#10b981" font-family="Courier New, Courier, monospace" font-size="9">10.0.0.25</text><circle cx="200" cy="200" r="14" fill="#78350f" stroke="#fbbf24" stroke-width="2"/><circle cx="200" cy="200" r="4" fill="#fef3c7"/><text x="180" y="224" fill="#fef3c7" font-family="Courier New, Courier, monospace" font-size="11" font-weight="bold">Gateway</text></g><line x1="112" y1="83" x2="182" y2="117" stroke="#818cf8" stroke-width="2" opacity="0.6"/><line x1="288" y1="83" x2="218" y2="117" stroke="#34d399" stroke-width="2" opacity="0.6"/><line x1="200" y1="139" x2="200" y2="186" stroke="#fbbf24" stroke-width="2" opacity="0.6"/><circle cx="140" cy="99" r="4.5" fill="#ffffff" filter="url(#c-glow-net)"/><circle cx="260" cy="99" r="4.5" fill="#ffffff" filter="url(#c-glow-net)"/></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><linearGradient id="c-py-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#fbbf24"/></linearGradient><filter id="c-glow-py" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="250" fill="#141414" rx="12"/><rect x="15" y="15" width="370" height="220" rx="8" fill="#1e1e1e" stroke="url(#c-py-grad)" stroke-width="1.5"/><rect x="15" y="15" width="60" height="220" rx="8" fill="#252526" opacity="0.9"/><rect x="25" y="35" width="40" height="6" rx="1" fill="#854d0e" opacity="0.5"/><rect x="25" y="50" width="30" height="6" rx="1" fill="#4b5563"/><rect x="25" y="62" width="35" height="6" rx="1" fill="#4b5563"/><rect x="75" y="15" width="100" height="24" fill="#1e1e1e"/><text x="85" y="31" fill="#a7f3d0" font-family="Courier New, Courier, monospace" font-size="11" font-weight="bold">scanner.py</text><line x1="75" y1="39" x2="385" y2="39" stroke="#333333" stroke-width="1"/><g font-family="Courier New, Courier, monospace" font-size="12" font-weight="bold"><text x="82" y="65" fill="#555555" font-size="11">1</text><text x="82" y="85" fill="#555555" font-size="11">2</text><text x="82" y="105" fill="#555555" font-size="11">3</text><text x="82" y="125" fill="#555555" font-size="11">4</text><text x="82" y="145" fill="#555555" font-size="11">5</text><text x="82" y="165" fill="#555555" font-size="11">6</text><text x="82" y="185" fill="#555555" font-size="11">7</text><text x="105" y="65" fill="#ce9178">import <tspan fill="#4ec9b0">socket</tspan></text><text x="105" y="85" fill="#ce9178">import <tspan fill="#4ec9b0">requests</tspan></text><text x="105" y="105" fill="#6a9955"># Target network scan</text><text x="105" y="125" fill="#c586c0">def <tspan fill="#dcdcaa">pwn_scan</tspan><tspan fill="#ffd700">(ip, port)</tspan>:</text><text x="125" y="145" fill="#9cdcfe">s = socket.socket<tspan fill="#ffd700">()</tspan></text><text x="125" y="165" fill="#c586c0">if <tspan fill="#9cdcfe">s.connect_ex((ip, port)) == 0</tspan>:</text><text x="145" y="185" fill="#ce9178">print<tspan fill="#ffd700">(f"Port {port} is OPEN!")</tspan></text></g><rect x="220" y="160" width="155" height="65" rx="6" fill="#0c0c0c" stroke="#333333" stroke-width="1"/><text x="228" y="178" fill="#4ade80" font-family="Courier New, Courier, monospace" font-size="10" font-weight="bold">$ python scanner.py</text><text x="228" y="195" fill="#fbbf24" font-family="Courier New, Courier, monospace" font-size="9" filter="url(#c-glow-py)">[+] Port 80 is OPEN!</text><text x="228" y="210" fill="#fbbf24" font-family="Courier New, Courier, monospace" font-size="9" filter="url(#c-glow-py)">[+] Port 443 is OPEN!</text></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><linearGradient id="c-git-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f05032"/><stop offset="100%" stop-color="#ffffff"/></linearGradient><filter id="c-glow-git" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="250" fill="#0f0e1c" rx="12"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#151428" stroke="#f05032" stroke-width="1.5"/><text x="35" y="44" fill="#f05032" font-family="Courier New, Courier, monospace" font-size="14" font-weight="bold">git branch --graph</text><line x1="20" y1="56" x2="380" y2="56" stroke="#f05032" stroke-width="1" opacity="0.3"/><path d="M80 180 V80" stroke="#10b981" stroke-width="4.5" stroke-linecap="round"/><path d="M80 140 C 130 140, 150 110, 150 80" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" fill="none"/><path d="M150 110 C 200 110, 220 90, 220 70" stroke="#a855f7" stroke-width="3" stroke-linecap="round" fill="none"/><g filter="url(#c-glow-git)"><circle cx="80" cy="180" r="7" fill="#10b981" stroke="#ffffff" stroke-width="1.5"/><circle cx="80" cy="140" r="7" fill="#10b981" stroke="#ffffff" stroke-width="1.5"/><circle cx="80" cy="80" r="7" fill="#10b981" stroke="#ffffff" stroke-width="1.5"/><circle cx="118" cy="128" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/><circle cx="150" cy="80" r="6" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/><circle cx="190" cy="100" r="5.5" fill="#a855f7" stroke="#ffffff" stroke-width="1.5"/></g><g font-family="Courier New, Courier, monospace" font-size="11" font-weight="bold"><text x="100" y="184" fill="#a5f3fc">init commit</text><text x="100" y="144" fill="#888888" opacity="0.6">commit [9c83a2]</text><text x="175" y="84" fill="#f59e0b">feat: add authentication</text><text x="210" y="104" fill="#a855f7">fix: hash bypass</text><text x="100" y="65" fill="#10b981">Merge pull request #1 from dev</text></g></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><linearGradient id="c-web-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#14142b"/><stop offset="100%" stop-color="#0b0b18"/></linearGradient><filter id="c-glow-web" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="250" fill="url(#c-web-bg)" rx="12"/><rect x="25" y="45" width="135" height="120" rx="8" fill="#191932" stroke="#3b82f6" stroke-width="1.5"/><rect x="25" y="45" width="135" height="22" rx="8" fill="#24244a"/><circle cx="37" cy="56" r="3" fill="#ff5f57"/><circle cx="47" cy="56" r="3" fill="#ffbd2e"/><circle cx="57" cy="56" r="3" fill="#28c840"/><text x="70" y="60" fill="#3b82f6" font-family="Courier New, Courier, monospace" font-size="9" font-weight="bold">localhost:3000</text><rect x="35" y="85" width="115" height="15" rx="3" fill="#131326"/><text x="40" y="96" fill="#888888" font-family="Courier New, Courier, monospace" font-size="8">Username: admin</text><rect x="35" y="110" width="115" height="15" rx="3" fill="#131326"/><text x="40" y="121" fill="#888888" font-family="Courier New, Courier, monospace" font-size="8">Password: ******</text><rect x="35" y="135" width="40" height="15" rx="3" fill="#3b82f6"/><text x="42" y="146" fill="#ffffff" font-family="Courier New, Courier, monospace" font-size="8" font-weight="bold">Login</text><rect x="240" y="45" width="135" height="120" rx="8" fill="#102a1e" stroke="#10b981" stroke-width="1.5"/><rect x="250" y="60" width="115" height="22" rx="4" fill="#081e14" stroke="#10b981" stroke-width="1"/><circle cx="260" cy="71" r="3" fill="#10b981" filter="url(#c-glow-web)"/><text x="272" y="74" fill="#10b981" font-family="Courier New, Courier, monospace" font-size="10" font-weight="bold">API - Active</text><rect x="250" y="92" width="115" height="22" rx="4" fill="#081e14" stroke="#10b981" stroke-width="1"/><circle cx="260" cy="103" r="3" fill="#10b981" filter="url(#c-glow-web)"/><text x="272" y="106" fill="#10b981" font-family="Courier New, Courier, monospace" font-size="10" font-weight="bold">DB - Online</text><g filter="url(#c-glow-web)"><line x1="170" y1="90" x2="230" y2="90" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="5 5"/><text x="180" y="82" fill="#fbbf24" font-family="Courier New, Courier, monospace" font-size="9" font-weight="bold">POST /login</text><line x1="230" y1="130" x2="170" y2="130" stroke="#10b981" stroke-width="2.5" stroke-dasharray="5 5"/><text x="180" y="122" fill="#10b981" font-family="Courier New, Courier, monospace" font-size="9" font-weight="bold">200 Session</text></g><text x="200" y="210" fill="#a5b4fc" font-family="Courier New, Courier, monospace" font-size="12" font-weight="bold" text-anchor="middle">HTTP Protocol / Session State Model</text></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><filter id="c-glow-rec" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="250" fill="#08080f" rx="12"/><circle cx="200" cy="125" r="90" stroke="#312e81" stroke-width="1.5" fill="none"/><circle cx="200" cy="125" r="60" stroke="#312e81" stroke-width="1" fill="none" stroke-dasharray="4 4"/><circle cx="200" cy="125" r="30" stroke="#312e81" stroke-width="1" fill="none"/><line x1="200" y1="125" x2="264" y2="61" stroke="#3b82f6" stroke-width="2.5" opacity="0.6" filter="url(#c-glow-rec)"/><g filter="url(#c-glow-rec)"><circle cx="200" cy="125" r="16" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/><text x="200" y="129" fill="#ffffff" font-family="Courier New, Courier, monospace" font-size="11" font-weight="bold" text-anchor="middle">TARGET</text><circle cx="120" cy="65" r="11" fill="#7c2d12" stroke="#ea580c" stroke-width="1.5"/><text x="120" y="50" fill="#ea580c" font-family="Courier New, Courier, monospace" font-size="10" font-weight="bold" text-anchor="middle">api</text><circle cx="280" cy="65" r="11" fill="#022c22" stroke="#10b981" stroke-width="1.5"/><text x="280" y="50" fill="#10b981" font-family="Courier New, Courier, monospace" font-size="10" font-weight="bold" text-anchor="middle">admin</text><circle cx="110" cy="175" r="11" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/><text x="110" y="196" fill="#818cf8" font-family="Courier New, Courier, monospace" font-size="10" font-weight="bold" text-anchor="middle">dev</text><circle cx="290" cy="175" r="11" fill="#0c4a6e" stroke="#0284c7" stroke-width="1.5"/><text x="290" y="196" fill="#0ea5e9" font-family="Courier New, Courier, monospace" font-size="10" font-weight="bold" text-anchor="middle">blog</text></g><line x1="184" y1="125" x2="131" y2="70" stroke="#888888" stroke-width="1" opacity="0.4" stroke-dasharray="2 2"/><line x1="216" y1="125" x2="269" y2="70" stroke="#888888" stroke-width="1" opacity="0.4" stroke-dasharray="2 2"/><line x1="184" y1="125" x2="121" y2="170" stroke="#888888" stroke-width="1" opacity="0.4" stroke-dasharray="2 2"/><line x1="216" y1="125" x2="279" y2="170" stroke="#888888" stroke-width="1" opacity="0.4" stroke-dasharray="2 2"/><text x="20" y="35" fill="#ea580c" font-family="Courier New, Courier, monospace" font-size="11" font-weight="bold" filter="url(#c-glow-rec)">SCANNING ACTIVE...</text></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><linearGradient id="c-burp-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff6600"/><stop offset="100%" stop-color="#ffb380"/></linearGradient><filter id="c-glow-burp" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="250" fill="#1c1a17" rx="12"/><rect x="15" y="15" width="370" height="220" rx="8" fill="#262522" stroke="url(#c-burp-grad)" stroke-width="1.5"/><rect x="15" y="15" width="370" height="26" fill="#363430" rx="8"/><g font-family="Courier New, Courier, monospace" font-size="10" font-weight="bold" fill="#bbbbbb"><text x="30" y="32">Dashboard</text><text x="105" y="32">Target</text><text x="160" y="32" fill="#ff6600" filter="url(#c-glow-burp)">Proxy</text><text x="210" y="32">Intruder</text><text x="280" y="32">Repeater</text></g><line x1="15" y1="41" x2="385" y2="41" stroke="#ff6600" stroke-width="1" opacity="0.3"/><rect x="25" y="48" width="350" height="22" fill="#1c1a17" rx="4"/><rect x="35" y="52" width="95" height="14" rx="3" fill="#b45309" stroke="#ff6600" stroke-width="1" filter="url(#c-glow-burp)"/><text x="42" y="62" fill="#ffffff" font-family="Courier New, Courier, monospace" font-size="9" font-weight="bold">Intercept is ON</text><text x="145" y="62" fill="#888888" font-family="Courier New, Courier, monospace" font-size="9">Forward</text><text x="205" y="62" fill="#888888" font-family="Courier New, Courier, monospace" font-size="9">Drop</text><g font-family="Courier New, Courier, monospace" font-size="11" font-weight="bold" fill="#ffb380"><text x="35" y="98">GET /admin/settings.php HTTP/1.1</text><text x="35" y="118" fill="#aaaaaa">Host: target.com</text><text x="35" y="138" fill="#aaaaaa">User-Agent: Mozilla/5.0 (X11; Linux x86_64)...</text><text x="35" y="158" fill="#aaaaaa">Cookie: session_id=<tspan fill="#ff6600">ADMIN_SECRET_JWT_TOKEN</tspan></text><text x="35" y="178" fill="#aaaaaa">Connection: close</text></g><rect x="180" y="148" width="165" height="15" fill="#ff6600" fillOpacity="0.1" stroke="#ff6600" strokeWidth="1" filter="url(#c-glow-burp)" rx="3"/><text x="350" y="215" fill="#ff6600" font-family="Courier New, Courier, monospace" font-size="10" font-weight="bold" text-anchor="end" filter="url(#c-glow-burp)">Proxy Traffic Intercepted</text></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><linearGradient id="c-sql-db" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#075985"/></linearGradient><filter id="c-glow-sql" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="250" fill="#050a14" rx="12"/><g filter="url(#c-glow-sql)"><ellipse cx="110" cy="70" rx="35" ry="11" fill="url(#c-sql-db)" stroke="#0ea5e9" stroke-width="1.5"/><path d="M75 70v22c0 6 15.6 11 35 11s35-5 35-11V70" fill="url(#c-sql-db)" stroke="#0ea5e9" stroke-width="1.5"/><ellipse cx="110" cy="92" rx="35" ry="11" fill="#0284c7" fillOpacity="0.2" stroke="#0ea5e9" stroke-width="1"/><ellipse cx="110" cy="114" rx="35" ry="11" fill="url(#c-sql-db)" stroke="#0ea5e9" stroke-width="1.5"/><path d="M75 114v22c0 6 15.6 11 35 11s35-5 35-11v-22" fill="url(#c-sql-db)" stroke="#0ea5e9" stroke-width="1.5"/><ellipse cx="110" cy="136" rx="35" ry="11" fill="#0284c7" fillOpacity="0.2" stroke="#0ea5e9" stroke-width="1"/><ellipse cx="110" cy="158" rx="35" ry="11" fill="url(#c-sql-db)" stroke="#0ea5e9" stroke-width="1.5"/><path d="M75 158v22c0 6 15.6 11 35 11s35-5 35-11v-22" fill="url(#c-sql-db)" stroke="#0ea5e9" stroke-width="1.5"/></g><path d="M340 120 H200" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" filter="url(#c-glow-sql)"/><polygon points="196,120 206,115 206,125" fill="#ef4444" filter="url(#c-glow-sql)"/><g font-family="Courier New, Courier, monospace" font-size="12" font-weight="bold"><text x="210" y="110" fill="#ef4444" filter="url(#c-glow-sql)">admin' OR '1'='1</text><text x="210" y="145" fill="#e2e8f0">SELECT * FROM users WHERE...</text></g><circle cx="110" cy="81" r="3" fill="#10b981"/><circle cx="110" cy="125" r="3" fill="#10b981"/><circle cx="110" cy="169" r="3" fill="#ef4444" filter="url(#c-glow-sql)"/><text x="200" y="215" fill="#ef4444" font-family="Courier New, Courier, monospace" font-size="13" font-weight="bold" text-anchor="middle" filter="url(#c-glow-sql)">DATABASE INJECTION BYPASS</text></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><filter id="c-glow-wifi" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="250" fill="#0d0803" rx="12"/><rect x="175" y="150" width="50" height="15" rx="3" fill="#3c2f2f" stroke="#fbbf24" stroke-width="1.5"/><line x1="200" y1="150" x2="200" y2="105" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/><g filter="url(#c-glow-wifi)" fill="none"><path d="M170 85a44 44 0 0160 0" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/><path d="M150 65a72 72 0 01100 0" stroke="#fb923c" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="6 4"/><path d="M130 45a100 100 0 01140 0" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></g><g stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.8"><rect x="75" y="125" width="22" height="40" rx="3" stroke="#a1a1aa"/><circle cx="86" cy="160" r="1.5" fill="#a1a1aa"/><rect x="290" y="125" width="45" height="30" rx="2" stroke="#a1a1aa"/><line x1="282" y1="155" x2="343" y2="155" stroke="#a1a1aa" stroke-width="2"/></g><g filter="url(#c-glow-wifi)"><rect x="135" y="180" width="130" height="18" rx="4" fill="#78350f" stroke="#f59e0b" stroke-width="1"/><text x="200" y="192" fill="#ffffff" font-family="Courier New, Courier, monospace" font-size="9" font-weight="bold" text-anchor="middle">WPA2 Handshake Captured</text></g></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><filter id="c-glow-nmap" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="250" fill="#040c06" rx="12"/><rect x="20" y="20" width="360" height="210" rx="8" fill="#0a170c" stroke="#10b981" stroke-width="1.5"/><rect x="20" y="20" width="360" height="34" rx="8" fill="#0d2413"/><line x1="20" y1="54" x2="380" y2="54" stroke="#10b981" stroke-width="1" opacity="0.2"/><circle cx="40" cy="37" r="4.5" fill="#ff5f57"/><circle cx="54" cy="37" r="4.5" fill="#ffbd2e"/><circle cx="68" cy="37" r="4.5" fill="#28c840"/><text x="110" y="42" fill="#10b981" font-family="Courier New, Courier, monospace" font-size="12" font-weight="bold" opacity="0.8">nmap -sV target.com</text><g font-family="Courier New, Courier, monospace" font-size="11" font-weight="bold" filter="url(#c-glow-nmap)"><text x="36" y="80" fill="#4ade80">Nmap scan report for 192.168.1.1</text><text x="36" y="102" fill="#86efac" font-size="10">PORT     STATE  SERVICE   VERSION</text><text x="36" y="120" fill="#888888" font-size="10" opacity="0.8">22/tcp   open   ssh       OpenSSH 8.9p1 Ubuntu</text><text x="36" y="136" fill="#888888" font-size="10" opacity="0.8">80/tcp   open   http      Apache httpd 2.4.52</text><text x="36" y="152" fill="#888888" font-size="10" opacity="0.8">443/tcp  open   ssl/http  Apache httpd 2.4.52</text><text x="36" y="168" fill="#f87171" font-size="10">8080/tcp open   http      Apache Tomcat/9.0.58</text><text x="36" y="195" fill="#4ade80">Nmap done: 1 IP address (1 host up) scanned</text></g></svg>`
    )}`,
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
    coverSvg: `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><defs><filter id="c-glow-wire" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="250" fill="#13141f" rx="12"/><rect x="15" y="15" width="370" height="220" rx="8" fill="#1e2030" stroke="#3b82f6" stroke-width="1.5"/><rect x="15" y="15" width="370" height="28" rx="8" fill="#2d3047"/><text x="30" y="33" fill="#818cf8" font-family="Courier New, Courier, monospace" font-size="12" font-weight="bold">Wireshark Network Analyzer</text><line x1="15" y1="43" x2="385" y2="43" stroke="#3b82f6" stroke-width="1" opacity="0.3"/><g font-family="Courier New, Courier, monospace" font-size="9" font-weight="bold" fill="#aaaaaa"><text x="25" y="56">No.</text><text x="50" y="56">Time</text><text x="90" y="56">Source</text><text x="175" y="56">Destination</text><text x="260" y="56">Protocol</text><text x="315" y="56">Info</text></g><line x1="15" y1="62" x2="385" y2="62" stroke="#333333" stroke-width="1"/><rect x="18" y="65" width="364" height="15" fill="#3b82f6" fillOpacity="0.1" rx="2"/><g font-family="Courier New, Courier, monospace" font-size="9" fill="#93c5fd"><text x="25" y="76">1</text><text x="50" y="76">0.000</text><text x="90" y="76">10.0.0.4</text><text x="175" y="76">192.168.1.1</text><text x="260" y="76" font-weight="bold">TCP</text><text x="315" y="76">49152 → 80 [SYN]</text></g><rect x="18" y="82" width="364" height="15" fill="#a855f7" fillOpacity="0.1" rx="2"/><g font-family="Courier New, Courier, monospace" font-size="9" fill="#c084fc"><text x="25" y="93">2</text><text x="50" y="93">0.005</text><text x="90" y="93">10.0.0.4</text><text x="175" y="93">8.8.8.8</text><text x="260" y="93" font-weight="bold">DNS</text><text x="315" y="93">Standard query A...</text></g><rect x="18" y="99" width="364" height="15" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="0.8" rx="2"/><g font-family="Courier New, Courier, monospace" font-size="9" fill="#34d399" font-weight="bold" filter="url(#c-glow-wire)"><text x="25" y="110">3</text><text x="50" y="110">0.024</text><text x="90" y="110">10.0.0.4</text><text x="175" y="110">192.168.1.1</text><text x="260" y="110">HTTP</text><text x="315" y="110">POST /login (cleartext)</text></g><rect x="20" y="125" width="360" height="95" rx="6" fill="#10111a" stroke="#333333" stroke-width="1"/><g font-family="Courier New, Courier, monospace" font-size="10" fill="#888888"><text x="30" y="142" fill="#34d399" font-weight="bold" filter="url(#c-glow-wire)">Hypertext Transfer Protocol (POST)</text><text x="30" y="158">  Host: vulnerable.com</text><text x="30" y="174" fill="#f87171" font-weight="bold">  Password: Sup3rS3cretP@ssword!</text><text x="30" y="195" font-size="8" fill="#555555">0000  50 4f 53 54 20 2f 6c 6f  67 69 6e 20 48 54 54 50   POST /lo gin HTTP</text><text x="30" y="206" font-size="8" fill="#555555">0010  2f 31 2e 31 0d 0a 48 6f  73 74 3a 20 76 75 6c 6e   /1.1..Ho st: vuln</text></g></svg>`
    )}`,
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
