import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('lt-1', 'What is the Terminal?',
      `The terminal is a text-based interface where you control your computer by typing commands instead of clicking buttons. Think of it as the "real" way to talk to your machine — the GUI is just a friendly wrapper on top.

When you open a terminal, you'll see something like this:

\`\`\`bash
user@qyvora:~$
\`\`\`

This is the **shell prompt**. It tells you:
- **user** — your username
- **qyvora** — the computer's hostname  
- **~** — your current directory (home folder)
- **$** — indicates a regular user (root uses #)

Type your first command:

\`\`\`bash
echo "Hello, Hacker!"
\`\`\`

The \`echo\` command prints text back to you. This is your first step into the terminal.`,
      { hasTerminal: true, terminalCommands: ['echo "Hello, Hacker!"', 'whoami', 'pwd', 'ls'], terminalTitle: 'lesson-terminal' }),

    l('lt-2', 'Navigating the Filesystem',
      `Every file and folder on Linux lives under the root directory \`/\`. Think of it like an upside-down tree starting at \`/\`.

**pwd** — Print Working Directory. Shows where you are:

\`\`\`bash
pwd
# /home/user
\`\`\`

**ls** — List files in the current directory:

\`\`\`bash
ls
# Desktop  Documents  Downloads  Pictures
ls -la    # detailed view with hidden files
\`\`\`

The \`-la\` flag combines \`-l\` (long format) and \`-a\` (show hidden files). Hidden files start with a dot (\`.bashrc\`).

**cd** — Change Directory:

\`\`\`bash
cd Documents    # go into Documents folder
cd ..           # go up one level
cd ~            # go to home directory
cd /etc         # absolute path — go directly to /etc
\`\`\`

**Absolute paths** start with \`/\` (e.g., \`/home/user/Documents\`). **Relative paths** start from where you are (e.g., \`Documents\`).`),

    l('lt-3', 'Working with Files',
      `Creating, reading, and deleting files are the most common terminal tasks.

\`\`\`bash
# Create an empty file
touch notes.txt

# Create a directory
mkdir projects

# Create nested directories (parent dirs too)
mkdir -p projects/hacks/recon

# Copy a file
cp notes.txt projects/notes.txt

# Move (or rename) a file
mv notes.txt projects/old-notes.txt

# Delete a file (permanent — no trash!)
rm old-notes.txt

# Delete a directory and everything inside
rm -rf projects/

# View file contents
cat notes.txt

# Edit a file (nano is beginner-friendly)
nano notes.txt
\`\`\`

The \`rm -rf\` command is dangerous. \`-r\` means recursive (deletes folders), \`-f\` means force (no confirmation). Double-check before running it.`),

    l('lt-4', 'File Permissions',
      `Linux uses a permission system to control who can read, write, or execute files.

View permissions with \`ls -l\`:

\`\`\`bash
ls -l script.sh
# -rwxr--r--  1 user user  42 Jul  4 12:00 script.sh
\`\`\`

The first part \`-rwxr--r--\` breaks down as:
- **First char**: file type (\`-\` = file, \`d\` = directory)
- **Next 3**: owner permissions (\`rwx\` = read, write, execute)
- **Next 3**: group permissions (\`r--\` = read only)
- **Next 3**: everyone else (\`r--\` = read only)

Change permissions with \`chmod\`:

\`\`\`bash
# Add execute permission for the owner
chmod +x script.sh

# Set exact permissions: owner=rwx, group=rx, others=r
chmod 755 script.sh

# The numbers: r=4, w=2, x=1 → 7=rwx, 5=rx, 5=rx
\`\`\`

Change owner with \`chown\`:

\`\`\`bash
sudo chown root:root script.sh
# Changes owner to root, group to root
\`\`\``),

    l('lt-5', 'Pipes and Redirection',
      `Pipes and redirection let you chain commands together — this is where the terminal becomes powerful.

**Redirect output to a file** with \`>\`:

\`\`\`bash
echo "target.com" > targets.txt
# Writes "target.com" into targets.txt (overwrites!)

echo "example.com" >> targets.txt
# Appends "example.com" (doesn't overwrite)
\`\`\`

**Pipe** (\`|\`) sends output of one command as input to another:

\`\`\`bash
ls -la | grep ".txt"
# Lists only .txt files

cat targets.txt | sort | uniq
# Sorts and removes duplicates

ps aux | grep "nginx"
# Find running nginx processes
\`\`\`

**grep** searches for patterns:

\`\`\`bash
grep "error" /var/log/syslog
# Find all lines containing "error"

grep -i "warning" log.txt
# Case-insensitive search

grep -r "password" /etc/
# Recursively search a directory
\`\`\``),

    l('lt-6', 'Process Management',
      `Every running program is a **process**. You can view, prioritize, and kill them.

**ps** — snapshot of current processes:

\`\`\`bash
ps aux
# Shows all processes with user, CPU, memory

ps aux | grep ssh
# Find SSH-related processes
\`\`\`

**top** — live updating view of processes:

\`\`\`bash
top
# Press 'q' to quit
\`\`\`

**kill** — terminate a process by its PID:

\`\`\`bash
kill 1234          # gracefully stop PID 1234
kill -9 1234       # force kill (SIGKILL)
kill -15 1234      # terminate (SIGTERM)
\`\`\`

**Background and foreground jobs:**

\`\`\`bash
sleep 100 &        # run in background (gives you a job ID)
jobs               # list background jobs
fg %1              # bring job 1 to foreground
Ctrl+Z             # suspend current process
bg %1              # resume job 1 in background
\`\`\`

Understanding process management is crucial for controlling long-running tools like scanners and listeners.`,
      { hasQuiz: true, quiz: [
        { id: 'lt-6-q1', question: 'Which command shows a live-updating view of all running processes?', options: ['ps aux', 'top', 'jobs', 'kill'], correctIndex: 1, explanation: 'top shows a live, updating view of processes. ps aux provides a snapshot, not live updates.' },
        { id: 'lt-6-q2', question: 'What does `kill -9 1234` do?', options: ['Pauses process 1234', 'Gracefully stops process 1234', 'Force kills process 1234 (SIGKILL)', 'Moves process 1234 to background'], correctIndex: 2, explanation: 'kill -9 sends SIGKILL, which forcefully terminates the process immediately without cleanup.' },
        { id: 'lt-6-q3', question: 'How do you run a command in the background?', options: ['Use Ctrl+Z', 'Append `&` to the command', 'Use the `bg` command', 'Use `run --background`'], correctIndex: 1, explanation: 'Appending `&` to a command runs it in the background, giving you your prompt back immediately.' },
      ] }),

    l('lt-7', 'Archiving & Compression',
      `When working with multiple files — common in security toolkits and log archives — you need to bundle and compress them. Start with a single file, then build up to full directory archives.

**Compress a single file with gzip:**

\`\`\`bash
# Start small: compress one file
gzip notes.txt
# Result: notes.txt.gz (original file is removed)
# Decompress it back
gunzip notes.txt.gz
# Or use gzip -d
gzip -d notes.txt.gz
\`\`\`

**Work with gzip without decompressing:**

\`\`\`bash
# View compressed file content without extracting
zcat notes.txt.gz
# Search inside a compressed file
zgrep "password" notes.txt.gz
# Same as: gunzip -c notes.txt.gz | grep "password"
\`\`\`

**Tar: bundle files together (no compression yet):**

\`\`\`bash
# Create a tar archive (like a zip file without compression)
tar -cf archive.tar file1.txt file2.txt folder1/
# -c = create, -f = filename

# List contents of a tar
tar -tf archive.tar

# Extract a tar
tar -xf archive.tar
\`\`\`

**Combine tar with compression (the standard approach):**

\`\`\`bash
# Create a compressed archive (.tar.gz or .tgz)
tar -czf project.tar.gz folder1/ file1.txt
# -z = gzip compression

# Extract it
tar -xzf project.tar.gz

# Use bzip2 (better compression, slower)
tar -cjf project.tar.bz2 folder1/
# -j = bzip2

# Use xz (best compression, slowest)
tar -cJf project.tar.xz folder1/
# -J = xz
\`\`\`

**Working with zip files (cross-platform):**

\`\`\`bash
# Create a zip file
zip -r archive.zip folder1/

# Extract a zip file
unzip archive.zip

# List contents without extracting
unzip -l archive.zip

# Password-protect a zip (NOT secure, but common)
zip -e secure.zip secrets.txt
\`\`\`

**Real-world security scenarios:**

\`\`\`bash
# Back up log files before analysis
tar -czf logs-$(date +%F).tar.gz /var/log/

# Extract a tool you downloaded
tar -xzf nmap-script.tar.gz -C /opt/tools/

# Compress recon results for exfiltration
tar -czf recon-results.tar.gz ./recon/
gpg -c recon-results.tar.gz  # Encrypt with password
\`\`\`

The key progression: single file → archive → compressed archive → encrypted archive. Each step adds a layer of capability.`,
      { hasTerminal: true, terminalCommands: ['gzip --help', 'tar --help', 'tar -czf test.tar.gz .', 'tar -tzf test.tar.gz'], terminalTitle: 'lesson-terminal' }),

    l('lt-8', 'Text Editors & File Viewing',
      `Viewing and editing files is a daily task. Start with simple viewing, then move to editing.

**Viewing files (no editing, just looking):**

\`\`\`bash
# less — scroll through a file (press q to quit)
less /var/log/syslog

# head — see the first lines (default: 10)
head /etc/passwd
head -n 20 /etc/passwd    # First 20 lines

# tail — see the last lines
tail /var/log/auth.log
tail -f /var/log/auth.log  # Follow in real-time (Ctrl+C to stop)
tail -n 50 /var/log/syslog # Last 50 lines

# wc — word/line count
wc -l /etc/passwd   # Count lines
wc -w report.txt    # Count words
wc -c file.bin      # Count bytes
\`\`\`

**Nano — the beginner-friendly editor:**

\`\`\`bash
# Open a file (creates it if it doesn't exist)
nano notes.txt
\`\`\`

Inside nano:
- Type to edit
- \`Ctrl+O\` — save (WriteOut)
- \`Ctrl+X\` — exit
- \`Ctrl+W\` — search
- \`Ctrl+K\` — cut line, \`Ctrl+U\` — paste
- \`Alt+6\` — copy line

**Vim — the power editor (steeper learning curve, much faster):**

\`\`\`bash
# Open a file
vim notes.txt
\`\`\`

Vim modes (this is the key concept):
- \`Normal mode\` — default on open. Press \`Esc\` to return here.
- \`Insert mode\` — press \`i\` to start typing. Press \`Esc\` to leave.
- \`Command mode\` — press \`:\` to enter commands.

**Essential vim commands (normal mode):**
\`\`\`
i        — enter insert mode (start typing)
dd       — delete current line
yy       — copy (yank) current line
p        — paste below cursor
:w       — save file
:q       — quit
:wq      — save and quit
:q!      — quit without saving
/text    — search for "text"
n        — next search result
u        — undo
Ctrl+r   — redo
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. View a file
cat /etc/hostname

# 2. Scroll through a file
less /etc/hosts

# 3. Quick edit with nano
nano /tmp/targets.txt
# Type: scanme.nmap.org, then Ctrl+O, Enter, Ctrl+X

# 4. Power edit with vim (insert, edit, save, quit)
vim /tmp/notes.txt
# Press i → type → Esc → :wq → Enter
\`\`\`

Start with nano. Once you're comfortable, force yourself to use vim for a week. It will feel awkward at first, then incredibly powerful.`),

    l('lt-9', 'SSH & Remote Connections',
      `SSH (Secure Shell) lets you control remote computers securely. Start locally, then connect remotely.

**Check if SSH is installed:**
\`\`\`bash
ssh -V
# Output: OpenSSH_9.2p1 Debian-2, OpenSSL 3.0.9
\`\`\`

**Connect to a remote machine (build up the command):**
\`\`\`bash
# Simplest form — connect with default port (22)
ssh user@192.168.1.100

# Specify a different port
ssh -p 2222 user@192.168.1.100

# Run a single command remotely (then disconnect)
ssh user@192.168.1.100 "ls -la /var/www/"

# Run a command with full terminal allocation
ssh -t user@192.168.1.100 "sudo systemctl status apache2"
\`\`\`

**SSH keys — passwordless login:**
\`\`\`bash
# Generate a key pair (use empty passphrase for automation)
ssh-keygen -t ed25519 -f ~/.ssh/hacker_key

# Copy the public key to the remote server
ssh-copy-id -i ~/.ssh/hacker_key user@192.168.1.100

# Now connect without a password
ssh -i ~/.ssh/hacker_key user@192.168.1.100
\`\`\`

**SSH config file — shortcuts for frequent connections:**
\`\`\`bash
# Edit ~/.ssh/config
Host target
    HostName 192.168.1.100
    User root
    Port 22
    IdentityFile ~/.ssh/hacker_key

# Now just type:
ssh target
\`\`\`

**SSH port forwarding (tunneling):**
\`\`\`bash
# Local port forward: access remote service via local port
ssh -L 8080:localhost:80 user@target
# Now open http://localhost:8080 in your browser

# Dynamic port forward (SOCKS proxy)
ssh -D 1080 user@target
# Configure browser to use SOCKS proxy 127.0.0.1:1080
\`\`\`

**Copy files over SSH:**
\`\`\`bash
# Copy a file TO a remote server
scp localfile.txt user@192.168.1.100:/tmp/

# Copy a file FROM a remote server
scp user@192.168.1.100:/var/log/syslog ./remote-syslog

# Copy an entire directory
scp -r ./recon/ user@192.168.1.100:/home/user/recon/
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. Generate a key
ssh-keygen -t ed25519

# 2. Copy to remote
ssh-copy-id user@target

# 3. Connect and explore
ssh user@target "uname -a; df -h; who"

# 4. Set up config for quick access
echo "Host mytarget\n    HostName 192.168.1.100\n    User root" >> ~/.ssh/config
chmod 600 ~/.ssh/config
\`\`\`

**Important:** \`~/.ssh\` directory must have permissions \`700\`, and files inside must be \`600\`. SSH will refuse to work if permissions are too open.`),

    l('lt-10', 'Finding Things: Files & Commands',
      `Knowing how to find files, commands, and information is crucial. Start with simple lookups, then build to complex searches.

**Find where a command is located:**
\`\`\`bash
# which — show the path of a command
which nmap
# /usr/bin/nmap

which python3
# /usr/bin/python3

# whereis — find binary, source, and man page
whereis nmap
# nmap: /usr/bin/nmap /usr/share/nmap /usr/share/man/man1/nmap.1.gz
\`\`\`

**Find files by name (simple searches):**
\`\`\`bash
# locate — fast, uses a database
locate .bashrc
locate password.txt

# Update the database first
sudo updatedb

# locate is fast but might not have recent files
\`\`\`

**Find files by properties (powerful searches):**
\`\`\`bash
# find — searches the filesystem directly, slower but current

# By name (exact)
find /home -name "notes.txt"

# By name (case-insensitive)
find /home -iname "*.txt"

# By type
find / -type d -name "logs"     # directories
find / -type f -name "*.conf"   # files only
find / -type l                  # symbolic links

# By size
find / -size +100M              # larger than 100MB
find / -size -1k                # smaller than 1KB
find / -size +1G                # larger than 1GB
\`\`\`

**Find by time — crucial for forensics:**
\`\`\`bash
# Files modified in the last 10 minutes
find /var/log -mmin -10

# Files modified in the last 24 hours
find /home -mtime -1

# Files modified more than 30 days ago
find /tmp -mtime +30

# Find and delete old files
find /tmp -mtime +7 -delete
\`\`\`

**Find and execute commands on results:**
\`\`\`bash
# Find all .txt files and count lines in each
find /home -iname "*.txt" -exec wc -l {} \\;

# Find files with SUID bit set (privilege escalation!)
find / -perm -4000 -type f 2>/dev/null

# Find world-writable files
find / -perm -o+w -type f 2>/dev/null
\`\`\`

**Combine with grep for powerful searches:**
\`\`\`bash
# Find files containing a specific string
grep -r "password" /etc/

# Find only .conf files with "Listen" in them
grep -r "Listen" --include="*.conf" /etc/

# Find files with "secret" in the name, then search contents
find /home -iname "*secret*" -exec grep -l "password" {} \\;
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. Find your shell
which bash

# 2. Find all config files
find /etc -name "*.conf" | head -20

# 3. Find large files eating disk space
find / -size +500M -type f 2>/dev/null | sort -rn | head -10

# 4. Find recent changes in /etc
find /etc -mmin -60 -type f
\`\`\``),

    l('lt-11', 'Environment Variables & Shell Configuration',
      `Your shell environment is configured by variables. Understanding them lets you customize your terminal and automate tasks.

**View all environment variables:**
\`\`\`bash
# Print all environment variables
env

# Or with more control
printenv

# Filter a specific variable
printenv PATH
echo $PATH    # Same thing, shorter
\`\`\`

**Common environment variables:**
\`\`\`bash
echo $HOME     # Your home directory: /home/user
echo $USER     # Your username
echo $SHELL    # Your shell: /bin/bash
echo $PWD      # Current directory
echo $PATH     # Where the system looks for executables
echo $LANG     # Language/locale settings
echo $TERM     # Terminal type
\`\`\`

**Set and use variables:**
\`\`\`bash
# Set a variable (local to current shell)
TARGET="192.168.1.1"
echo $TARGET
ping -c 1 $TARGET

# Export a variable (available to child processes)
export TARGET="192.168.1.1"
./my-script.sh   # This script can use $TARGET

# Combine variables
HOST="scanme"
DOMAIN=".nmap.org"
TARGET="$HOST$DOMAIN"
echo $TARGET    # scanme.nmap.org
\`\`\`

**The PATH variable — where commands live:**
\`\`\`bash
# See your current PATH (colon-separated list)
echo $PATH
# /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# Add a directory to PATH (for your custom scripts)
export PATH=$PATH:$HOME/scripts

# Make this permanent by adding it to ~/.bashrc
echo 'export PATH=$PATH:$HOME/scripts' >> ~/.bashrc
\`\`\`

**Shell configuration files:**
\`\`\`bash
# ~/.bashrc — runs every time you open a new terminal
# ~/.bash_profile — runs for login shells
# ~/.bash_history — stores your command history

# See how many commands are stored
echo $HISTSIZE
echo $HISTFILESIZE

# See your history file location
echo $HISTFILE
# Usually: /home/user/.bash_history
\`\`\`

**Customize your prompt:**
\`\`\`bash
# Simple prompt customization
export PS1="\\u@\\h:\\w\\$ "
# \\u = user, \\h = hostname, \\w = full path

# Color prompt (for root)
export PS1="\\[\\e[31m\\]\\u@\\h\\[\\e[0m\\]:\\w\\$ "

# Make it permanent
echo 'export PS1="\\u@\\h:\\w\\$ "' >> ~/.bashrc
\`\`\`

**Aliases — shortcuts for long commands:**
\`\`\`bash
# Create temporary aliases
alias ll='ls -la --color=auto'
alias scan='nmap -sV -sC'
alias myip='curl -s ifconfig.me'

# See all aliases
alias

# Remove an alias
unalias ll

# Make aliases permanent
echo "alias ll='ls -la --color=auto'" >> ~/.bashrc
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. See your current PATH
echo $PATH | tr ':' '\\n'

# 2. Create a variable and use it
export TARGET="scanme.nmap.org"
echo "Scanning $TARGET"

# 3. Create a useful alias
alias ll='ls -la'
alias

# 4. Add to bashrc (try it)
echo 'alias ll="ls -la --color=auto"' >> ~/.bashrc && source ~/.bashrc
\`\`\``),

    l('lt-12', 'Disk Usage & System Management',
      `Understanding disk usage helps you find space hogs and manage system resources. Start simple, then drill down.

**Check disk space on mounted filesystems:**
\`\`\`bash
# df — disk free (human-readable)
df -h

# Output:
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/sda1       234G   56G  167G  26% /

# Show filesystem type
df -T

# Include pseudo filesystems
df -a
\`\`\`

**Check directory/file sizes:**
\`\`\`bash
# du — disk usage
du -sh /var/log      # Total size of a directory (-s = summary, -h = human)
# 1.2G    /var/log

du -sh *             # Size of every item in current directory
du -sh .[!.]* *      # Including hidden files

# Show largest subdirectories (sort by size)
du -sh /var/* | sort -rh | head -10

# Show size of each file in a directory
du -ah /var/log | sort -rh | head -10
\`\`\`

**Find what's eating disk space:**
\`\`\`bash
# The classic disk space investigation
df -h                         # Check overall usage
du -sh /* | sort -rh          # Largest top-level directories
du -sh /var/* | sort -rh      # Drill into /var
du -sh /var/log/* | sort -rh  # Drill into /var/log

# Find files larger than 1GB
find / -type f -size +1G -exec ls -lh {} \\; 2>/dev/null | sort -k5 -rh
\`\`\`

**Mount and unmount filesystems:**
\`\`\`bash
# List mounted filesystems
mount
df -h

# Mount a USB drive
sudo mount /dev/sdb1 /mnt/usb

# Unmount safely
sudo umount /mnt/usb

# Mount a disk image (like an ISO)
sudo mount -o loop disk-image.iso /mnt/iso
\`\`\`

**System information commands:**
\`\`\`bash
# uname — system info
uname -a           # All system info
uname -r           # Kernel release
uname -m           # Architecture (x86_64, aarch64)

# lsb_release — distribution info
lsb_release -a

# hostnamectl — full system info (systemd systems)
hostnamectl

# lscpu — CPU details
lscpu | grep "Model name"

# free — memory usage
free -h            # Human-readable
free -ht           # With totals
free -s 5          # Refresh every 5 seconds
\`\`\`

**Check system uptime and load:**
\`\`\`bash
# uptime — how long since last boot
uptime
# 14:32:11 up 3 days,  2:15,  2 users,  load average: 0.08, 0.03, 0.01

# The three numbers are load averages (1, 5, 15 minutes)
# Below 1.0 = healthy, above = busy

# dmesg — kernel messages
dmesg | tail -20   # Last 20 kernel messages
dmesg | grep -i error
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. Check overall disk usage
df -h

# 2. Find the top 5 largest directories in /var
du -sh /var/* | sort -rh | head -5

# 3. Check memory
free -h

# 4. Check system info
uname -a
hostnamectl
\`\`\`

This lesson wraps up the Linux Terminal 101 course. You now have the essential skills to navigate, manipulate, and manage a Linux system from the command line — the foundation of all offensive security work.`),
];

export const COURSE: Course = {
  id: 'linux-terminal-101',
  title: 'Linux Terminal 101',
  categoryId: 'terminal',
  description:
    'Learn to navigate, control, and exploit the Linux command line. No prior experience needed — start from scratch and gain real terminal skills.',
  overview:
    'The terminal is the hacker’s cockpit. This course teaches you to navigate the filesystem, manipulate files, manage processes, and chain commands together. Every lesson uses real commands you’d run on any Linux system.',
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
  lessons: LESSONS,
};
