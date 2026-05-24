export const ROOM_QUIZ_BANK = {
  // Phase 1: Hacker Mindset
  '1:1': [
    { id: 'q1', text: 'What is the main difference between offensive and defensive security?', options: ['Offensive attacks systems; defensive protects them', 'Offensive uses firewalls; defensive uses exploits', 'They are the same thing', 'Offensive is illegal; defensive is legal'], correctIndex: 0 },
    { id: 'q2', text: 'Which of the following best describes a penetration tester?', options: ['Someone who breaks into systems without permission', 'An authorised professional who simulates attacks to find weaknesses', 'A developer who writes security software', 'A network administrator'], correctIndex: 1 },
    { id: 'q3', text: 'What does the HSOCIETY operating model focus on?', options: ['Only selling security tools', 'Education, execution, and community', 'Government contracts only', 'Defensive security only'], correctIndex: 1 },
  ],
  '1:2': [
    { id: 'q1', text: 'Which trait is most central to the hacker mindset?', options: ['Speed', 'Curiosity and creative problem solving', 'Memorising tool syntax', 'Following instructions exactly'], correctIndex: 1 },
    { id: 'q2', text: 'What separates a skilled hacker from someone who just runs tools?', options: ['Having more tools', 'Understanding how and why systems work', 'Working faster', 'Using the latest exploits'], correctIndex: 1 },
    { id: 'q3', text: 'Lateral thinking in hacking means:', options: ['Moving sideways through a network', 'Approaching problems from unexpected angles', 'Using multiple tools at once', 'Thinking about lateral movement attacks'], correctIndex: 1 },
  ],
  '1:3': [
    { id: 'q1', text: 'Why is written authorisation critical before a penetration test?', options: ['It makes the test more expensive', 'It defines scope and provides legal protection', 'It is optional for experienced testers', 'It is only needed for government targets'], correctIndex: 1 },
    { id: 'q2', text: 'What is responsible disclosure?', options: ['Disclosing vulnerabilities publicly without notifying the vendor', 'Reporting vulnerabilities to the affected organisation before public disclosure', 'Selling vulnerabilities to the highest bidder', 'Keeping vulnerabilities secret forever'], correctIndex: 1 },
    { id: 'q3', text: 'What does "scope" mean in a penetration test?', options: ['The size of the target organisation', 'The specific systems and boundaries the tester is authorised to test', 'The number of vulnerabilities found', 'The duration of the engagement'], correctIndex: 1 },
  ],
  // Phase 2: Linux Foundations
  '2:1': [
    { id: 'q1', text: 'What does the command "ls -la" do?', options: ['Lists only hidden files', 'Lists all files including hidden ones with detailed info', 'Deletes all files', 'Creates a new directory'], correctIndex: 1 },
    { id: 'q2', text: 'In the permission string "-rwxr-xr-x", what can the "world" (others) do?', options: ['Read, write, and execute', 'Read and execute only', 'Write only', 'Nothing'], correctIndex: 1 },
    { id: 'q3', text: 'Which command shows your current working directory?', options: ['cd', 'ls', 'pwd', 'whoami'], correctIndex: 2 },
  ],
  '2:2': [
    { id: 'q1', text: 'What does the "id" command show?', options: ['The system ID', 'Your current user, UID, and group memberships', 'The IP address', 'Running processes'], correctIndex: 1 },
    { id: 'q2', text: 'Why is /etc/passwd important to an attacker?', options: ['It contains encrypted passwords', 'It lists user accounts and their home directories', 'It stores firewall rules', 'It contains network configuration'], correctIndex: 1 },
    { id: 'q3', text: 'What does "sudo -l" show?', options: ['All logged-in users', 'Commands your user can run with elevated privileges', 'System logs', 'Network interfaces'], correctIndex: 1 },
  ],
  '2:3': [
    { id: 'q1', text: 'What does "ps aux" display?', options: ['Disk usage', 'All running processes with details', 'Network connections', 'User accounts'], correctIndex: 1 },
    { id: 'q2', text: 'What is the difference between SIGTERM (15) and SIGKILL (9)?', options: ['They are identical', 'SIGTERM asks the process to stop gracefully; SIGKILL forces immediate termination', 'SIGKILL is safer', 'SIGTERM is faster'], correctIndex: 1 },
    { id: 'q3', text: 'Which command lists all listening ports and their processes?', options: ['ps aux', 'ls -la', 'ss -tulnp', 'cat /etc/hosts'], correctIndex: 2 },
  ],
  '2:4': [
    { id: 'q1', text: 'What must the first line of a bash script contain?', options: ['#!/bin/bash', '# bash script', 'bash start', 'run bash'], correctIndex: 0 },
    { id: 'q2', text: 'In a bash script, how do you reference the first argument passed to the script?', options: ['$0', '$1', '$arg', '#1'], correctIndex: 1 },
    { id: 'q3', text: 'What does "chmod +x script.sh" do?', options: ['Deletes the script', 'Makes the script executable', 'Copies the script', 'Runs the script'], correctIndex: 1 },
  ],
  // Phase 3: Networking
  '3:1': [
    { id: 'q1', text: 'How many layers does the OSI model have?', options: ['4', '5', '7', '9'], correctIndex: 2 },
    { id: 'q2', text: 'What is the correct sequence of the TCP three-way handshake?', options: ['ACK → SYN → SYN-ACK', 'SYN → SYN-ACK → ACK', 'SYN-ACK → SYN → ACK', 'ACK → ACK → SYN'], correctIndex: 1 },
    { id: 'q3', text: 'When would an attacker prefer UDP over TCP?', options: ['When reliability is needed', 'For speed-sensitive attacks like DNS amplification where no handshake is required', 'UDP is never preferred', 'When encryption is needed'], correctIndex: 1 },
  ],
  '3:2': [
    { id: 'q1', text: 'What does a DNS A record store?', options: ['Mail server address', 'IPv4 address for a domain', 'Text information', 'Alias for another domain'], correctIndex: 1 },
    { id: 'q2', text: 'Which HTTP method is typically used to submit form data?', options: ['GET', 'DELETE', 'POST', 'OPTIONS'], correctIndex: 2 },
    { id: 'q3', text: 'What default port does SSH run on?', options: ['21', '22', '23', '80'], correctIndex: 1 },
  ],
  '3:3': [
    { id: 'q1', text: 'What does "nmap -sV" do?', options: ['Scans for open ports only', 'Detects service versions on open ports', 'Performs OS detection', 'Runs all NSE scripts'], correctIndex: 1 },
    { id: 'q2', text: 'Why does version information matter to an attacker?', options: ['It looks impressive in reports', 'It allows searching for known vulnerabilities in specific versions', 'It is required by law', 'It speeds up the scan'], correctIndex: 1 },
    { id: 'q3', text: 'What flag enables OS detection in nmap?', options: ['-sV', '-sC', '-O', '-A'], correctIndex: 2 },
  ],
  '3:4': [
    { id: 'q1', text: 'What Wireshark display filter shows only HTTP traffic?', options: ['tcp', 'http', 'port 80', 'web'], correctIndex: 1 },
    { id: 'q2', text: 'What does "Follow TCP Stream" in Wireshark allow you to do?', options: ['Speed up the capture', 'Read the full request and response as plain text', 'Filter by IP address', 'Export packets'], correctIndex: 1 },
    { id: 'q3', text: 'What type of data is visible in unencrypted HTTP traffic captured with Wireshark?', options: ['Nothing — HTTP is always encrypted', 'Credentials, cookies, and request/response bodies in plain text', 'Only IP addresses', 'Only port numbers'], correctIndex: 1 },
  ],
  // Phase 4: Web & Backend Systems
  '4:1': [
    { id: 'q1', text: 'Which DevTools tab shows all HTTP requests made by a page?', options: ['Console', 'Sources', 'Network', 'Application'], correctIndex: 2 },
    { id: 'q2', text: 'Where in DevTools can you inspect cookies for a site?', options: ['Network → Headers', 'Application → Cookies', 'Console', 'Sources'], correctIndex: 1 },
    { id: 'q3', text: 'What information in response headers can reveal the server technology?', options: ['Content-Length', 'Server and X-Powered-By headers', 'Accept-Encoding', 'Cache-Control'], correctIndex: 1 },
  ],
  '4:2': [
    { id: 'q1', text: 'What is the #1 vulnerability in the OWASP Top 10?', options: ['SQL Injection', 'Broken Access Control', 'XSS', 'CSRF'], correctIndex: 1 },
    { id: 'q2', text: 'What does "Cryptographic Failures" refer to in the OWASP Top 10?', options: ['Weak or missing encryption of sensitive data', 'Slow encryption algorithms', 'Using too many certificates', 'Broken login forms'], correctIndex: 0 },
    { id: 'q3', text: 'Which OWASP category covers SQL injection?', options: ['Broken Access Control', 'Security Misconfiguration', 'Injection', 'Insecure Design'], correctIndex: 2 },
  ],
  '4:3': [
    { id: 'q1', text: 'What does entering a single quote ( \' ) in a login field test for?', options: ['XSS vulnerability', 'SQL injection vulnerability', 'CSRF vulnerability', 'Authentication bypass'], correctIndex: 1 },
    { id: 'q2', text: 'What does the payload "admin\'--" attempt to do in a login form?', options: ['Create a new admin account', 'Comment out the password check in the SQL query', 'Crash the database', 'Encrypt the password'], correctIndex: 1 },
    { id: 'q3', text: 'What does sqlmap do?', options: ['Scans for open ports', 'Automates detection and exploitation of SQL injection vulnerabilities', 'Captures network traffic', 'Brute forces passwords'], correctIndex: 1 },
  ],
  '4:4': [
    { id: 'q1', text: 'What is a reflected XSS attack?', options: ['A script stored in the database', 'A script injected via URL or input that is immediately reflected back in the response', 'A script in a CSS file', 'A server-side script'], correctIndex: 1 },
    { id: 'q2', text: 'What is the key difference between stored and reflected XSS?', options: ['Stored XSS is less dangerous', 'Stored XSS persists in the database and affects all users who view the page', 'Reflected XSS affects more users', 'There is no difference'], correctIndex: 1 },
    { id: 'q3', text: 'What does a CSRF attack exploit?', options: ['SQL injection', 'The trust a web application has in an authenticated user\'s browser', 'Weak passwords', 'Unencrypted traffic'], correctIndex: 1 },
  ],
  '4:5': [
    { id: 'q1', text: 'What is a brute force attack on a login form?', options: ['Guessing one password very carefully', 'Systematically trying many passwords until one works', 'Bypassing the login form entirely', 'Stealing the session cookie'], correctIndex: 1 },
    { id: 'q2', text: 'What is session fixation?', options: ['Fixing a broken session', 'Forcing a user to use a session ID chosen by the attacker', 'Extending a session timeout', 'Encrypting a session token'], correctIndex: 1 },
    { id: 'q3', text: 'What should happen to a session token when a user logs out?', options: ['It should be reused for the next login', 'It should be invalidated server-side immediately', 'It should be stored in localStorage', 'Nothing — it expires on its own'], correctIndex: 1 },
  ],
  // Phase 5: Social Engineering
  '5:1': [
    { id: 'q1', text: 'Which psychological trigger is most commonly used in phishing emails?', options: ['Humour', 'Urgency and fear', 'Curiosity about sports', 'Nostalgia'], correctIndex: 1 },
    { id: 'q2', text: 'What is pretexting in social engineering?', options: ['Writing a pretext for a report', 'Creating a believable false scenario to manipulate a target', 'Sending a phishing email', 'Cloning a badge'], correctIndex: 1 },
    { id: 'q3', text: 'What is a lookalike domain used for in phishing?', options: ['Improving SEO', 'Tricking users into thinking they are on a legitimate site', 'Hosting legitimate content', 'Bypassing firewalls'], correctIndex: 1 },
  ],
  '5:2': [
    { id: 'q1', text: 'What does OSINT stand for?', options: ['Online Security Intelligence Network Tool', 'Open Source Intelligence', 'Operational Security Internal Network Testing', 'Offensive Security Intelligence Technique'], correctIndex: 1 },
    { id: 'q2', text: 'What does the Google dork "site:example.com filetype:pdf" find?', options: ['All pages on example.com', 'PDF files hosted on example.com', 'Images on example.com', 'Admin pages on example.com'], correctIndex: 1 },
    { id: 'q3', text: 'Why is LinkedIn useful for OSINT on a target organisation?', options: ['It has no useful information', 'It reveals employee names, roles, and technologies used', 'It is only useful for job searching', 'It blocks OSINT tools'], correctIndex: 1 },
  ],
  '5:3': [
    { id: 'q1', text: 'What is tailgating in physical security?', options: ['Following someone\'s car', 'Gaining unauthorised physical access by following an authorised person through a secured door', 'Cloning an RFID badge', 'Dumpster diving'], correctIndex: 1 },
    { id: 'q2', text: 'What is dumpster diving in the context of security?', options: ['A network attack', 'Searching through discarded materials for sensitive information', 'A type of phishing', 'Physical badge cloning'], correctIndex: 1 },
    { id: 'q3', text: 'What technology do RFID badge cloning attacks target?', options: ['Biometric fingerprint scanners', 'Contactless access cards using radio frequency', 'PIN pad entry systems', 'CCTV cameras'], correctIndex: 1 },
  ],
};

export const FALLBACK_QUESTIONS = [
  { id: 'q1', text: 'What is the primary mindset of an ethical hacker?', options: ['Break everything without limits', 'Think like an attacker while respecting boundaries', 'Ignore rules to find vulnerabilities', 'Automate all security work'], correctIndex: 1 },
  { id: 'q2', text: 'What is the most important first step when learning a new hacking topic?', options: ['Memorize every tool command', 'Run tools blindly until something works', 'Understand the underlying system and threat model', 'Skip basics and jump into advanced exploits'], correctIndex: 2 },
];
