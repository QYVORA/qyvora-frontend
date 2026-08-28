import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('lt-1', 'What is the Terminal?',
      `The terminal is a text-based interface where you control your computer by typing commands instead of clicking buttons. Think of it as the "real" way to talk to your machine, the GUI is just a friendly wrapper on top.

> **Why this matters for hacking:** Every server, firewall, and IoT device runs some form of command-line interface. When you compromise a machine, the terminal is your cockpit. You won't have a mouse or a desktop, just a blinking cursor and a shell prompt. The faster you can navigate this environment, the more effective you'll be.

When you open a terminal, you'll see something like this:

\`\`\`bash
user@qyvora:~$
\`\`\`

This is the **shell prompt**. It tells you:
- **user**: your username
- **qyvora**: the computer's hostname  
- **~**: your current directory (home folder)
- **$**: indicates a regular user (root uses #)

Type your first command:

\`\`\`bash
echo "Hello, Hacker!"
\`\`\`

The \`echo\` command prints text back to you. Use it to confirm the shell is working, inspect variables (\`echo $HOME\`), or write data into files (\`echo "data" > file.txt\`).

**Try it yourself:** Run \`whoami\` to see your username, then \`pwd\` to see where you are, and finally \`ls\` to see what's in your current directory. This is the reconnaissance triad of any terminal session.`,
      { hasTerminal: true, terminalCommands: ['echo "Hello, Hacker!"', 'whoami', 'pwd', 'ls', 'echo $SHELL'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-1-q1', question: 'What does the `$` symbol in a shell prompt indicate?', options: ['Root user', 'Regular user', 'Sudo mode', 'Remote session'], correctIndex: 1, explanation: '`$` indicates a regular user prompt; root uses `#`.' },
        { id: 'lt-1-q2', question: 'Which command prints text to confirm the shell is working?', options: ['print', 'echo', 'display', 'write'], correctIndex: 1, explanation: '`echo` outputs the text you pass to it, making it ideal for testing the shell.' },
        { id: 'lt-1-q3', question: 'Which command shows your current working directory?', options: ['whoami', 'pwd', 'ls', 'cd'], correctIndex: 1, explanation: '`pwd` stands for "Print Working Directory" and shows your current location.' },
      ] }),

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

> **Why this matters for hacking:** During a penetration test, the first thing you do on a compromised server is orient yourself. \`pwd\` tells you where you landed, \`ls\` tells you what's nearby, and \`cd\` lets you explore. Key directories to know:
> - \`/etc\`, configuration files (passwords, service configs)
> - \`/var/log\`, log files (auth attempts, errors)
> - \`/tmp\`, world-writable, great for staging exploits
> - \`/home\`, user data directories
> - \`/root\`, the all-powerful admin's home

**cd** — Change Directory:

\`\`\`bash
cd Documents    # go into Documents folder
cd ..           # go up one level
cd ~            # go to home directory
cd /etc         # absolute path, go directly to /etc
\`\`\`

**Absolute paths** start with \`/\` (e.g., \`/home/user/Documents\`). **Relative paths** start from where you are (e.g., \`Documents\`).

**Mini-challenge:** Navigate to \`/etc\` and list its contents. Can you find \`passwd\`? Now navigate to \`/var/log\` and look for log files. Practice moving between directories quickly — you'll do this hundreds of times in real engagements.`,
      { hasQuiz: true, quiz: [
        { id: 'lt-2-q1', question: 'What does `ls -la` show?', options: ['All files including hidden ones in long format', 'Only hidden files', 'Directory tree structure', 'Running processes'], correctIndex: 0, explanation: '`-l` enables long format and `-a` shows hidden files (those starting with a dot).' },
        { id: 'lt-2-q2', question: 'Which directory is world-writable and commonly used for staging exploits?', options: ['/etc', '/var/log', '/tmp', '/home'], correctIndex: 2, explanation: '`/tmp` is world-writable by design, making it a common place to stage tools and payloads.' },
        { id: 'lt-2-q3', question: 'What is the difference between an absolute and a relative path?', options: ['Absolute starts with `/`, relative starts from your current directory', 'Relative starts with `/`, absolute uses backslashes', 'There is no difference', 'Absolute paths only work on Windows'], correctIndex: 0, explanation: 'Absolute paths start from the root `/`, while relative paths resolve from your current working directory.' },
      ] }),

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

# Delete a file (permanent, no trash!)
rm old-notes.txt

# Delete a directory and everything inside
rm -rf projects/

# View file contents
cat notes.txt

# Edit a file (nano is beginner-friendly)
nano notes.txt
\`\`\`

The \`rm -rf\` command is dangerous. \`-r\` means recursive (deletes folders), \`-f\` means force (no confirmation). Double-check before running it.

> **Why this matters for hacking:** In real engagements, you'll create directory structures for each target (recon/ scans/ exploits/ loot/). \`mkdir -p\` creates the whole tree at once. \`cp\` and \`mv\` move your tools around. And when you're cleaning up after an engagement, \`rm -rf\` wipes your tracks, but use it carefully; one wrong \`rm -rf /\` and the system is gone.

**Mini-challenge:** Create a recon directory structure: \`mkdir -p ~/recon/{scans,exploits,loot,notes}\`. Then create a target file with \`echo "target.com" > ~/recon/notes/targets.txt\`. Verify with \`ls -R ~/recon\`.`,
      { hasTerminal: true, terminalCommands: ['mkdir -p ~/recon/{scans,exploits,loot,notes}', 'echo "target.com" > ~/recon/notes/targets.txt', 'ls -R ~/recon'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-3-q1', question: 'What does `rm -rf` do?', options: ['Force-deletes files and directories recursively', 'Renames a file', 'Moves files to trash', 'Creates a backup'], correctIndex: 0, explanation: '`-r` means recursive (deletes folders) and `-f` means force (no confirmation). Use with extreme caution.' },
        { id: 'lt-3-q2', question: 'What does `mkdir -p` do?', options: ['Creates nested directories including parent directories', 'Creates an empty file', 'Sets directory permissions', 'Lists directory tree'], correctIndex: 0, explanation: '`-p` creates parent directories as needed, so `mkdir -p a/b/c` creates the entire path.' },
        { id: 'lt-3-q3', question: 'How do you rename a file using the terminal?', options: ['mv old.txt new.txt', 'rename old.txt new.txt', 'cp old.txt new.txt', 'ren old.txt new.txt'], correctIndex: 0, explanation: '`mv` (move) is also used to rename files — moving a file to a new name in the same directory.' },
      ] }),

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
\`\`\`

> **Why this matters for hacking:** Permission misconfigurations are a top-5 attack vector. World-writable files let any user modify them. Files owned by root with the **SUID bit** set (like \`/usr/bin/passwd\`) run with the owner's privileges when executed, and if you find a custom SUID binary, you can often escalate to root. The \`/etc/shadow\` file must be readable only by root; if it's world-readable, you can steal password hashes.

**Mini-challenge:** Find all SUID binaries on the system: \`find / -perm -4000 -type f 2>/dev/null\`. These are potential privilege escalation vectors. Then find all world-writable files in \`/tmp\`: \`find /tmp -perm -o+w -type f\`. Both are common first steps in Linux privilege escalation.`,
      { hasTerminal: true, terminalCommands: ['find / -perm -4000 -type f 2>/dev/null | head -10', 'find /tmp -perm -o+w -type f 2>/dev/null', 'ls -la /etc/shadow 2>/dev/null || echo "No access, correct!"'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-4-q1', question: 'In the permission string `-rwxr--r--`, what permissions do "others" have?', options: ['Read only', 'Read and write', 'Read, write, and execute', 'No permissions'], correctIndex: 0, explanation: 'The last three characters represent others: `r--` means read-only.' },
        { id: 'lt-4-q2', question: 'What does `chmod 755` set?', options: ['Owner=rwx, group=rx, others=rx', 'All users get rwx', 'Owner=rwx, others=none', 'Read-only for all'], correctIndex: 0, explanation: '7=rwx (4+2+1), 5=rx (4+0+1), 5=rx (4+0+1).' },
        { id: 'lt-4-q3', question: 'What is a SUID binary?', options: ['A binary that runs with the owner\'s privileges', 'A binary that always runs as root', 'A binary with no permissions', 'A shell script file'], correctIndex: 0, explanation: 'SUID (Set User ID) causes a binary to execute with the file owner\'s privileges, not the running user\'s.' },
      ] }),

    l('lt-5', 'Pipes and Redirection',
      `Pipes and redirection let you chain commands together, this is where the terminal becomes powerful.

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

# Show context around matches
grep -B 3 -A 2 "Failed" /var/log/auth.log
# 3 lines Before, 2 lines After each match
\`\`\`

> **Why this matters for hacking:** Pipes are the glue of the Linux command line. In a real engagement, you'll chain tools together constantly: \`nmap scan results | grep "open" | cut -d' ' -f1\` extracts open ports; \`cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn\` finds the most frequent IP visitors. Mastering command chaining turns you from a button-clicker into an operator.

**Mini-challenge:** Count how many unique IPs have tried to authenticate on your system: \`cat /var/log/auth.log 2>/dev/null | grep "Failed password" | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -5\`. This is the exact same pattern SOC analysts use to detect brute-force attacks.`,
      { hasTerminal: true, terminalCommands: ['ls -la | grep ".txt"', 'echo -e "error: timeout\\nwarning: disk\\nerror: crash" > /tmp/test.log && cat /tmp/test.log | grep "error"'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-5-q1', question: 'What is the difference between `>` and `>>`?', options: ['`>` overwrites, `>>` appends', '`>` appends, `>>` overwrites', 'Both overwrite the file', 'Both append to the file'], correctIndex: 0, explanation: '`>` truncates and overwrites the file; `>>` appends to the end without overwriting.' },
        { id: 'lt-5-q2', question: 'What does `grep -r` do?', options: ['Recursively searches directories for a pattern', 'Reverses the output order', 'Runs a command repeatedly', 'Removes matching lines'], correctIndex: 0, explanation: '`-r` makes grep search all files in a directory recursively.' },
        { id: 'lt-5-q3', question: 'How do you count unique IP addresses from an auth log?', options: ['Pipe through `sort | uniq -c`', 'Use `count --unique`', 'Use `grep -c`', 'Use `wc -l`'], correctIndex: 0, explanation: '`sort | uniq -c` sorts lines and counts consecutive duplicates, giving you a frequency count.' },
      ] }),

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

> **Why this matters for hacking:** During a penetration test, you'll run multiple tools simultaneously, a port scan in one terminal, a directory brute-forcer in another, a reverse shell listener in a third. You need \`bg\`, \`fg\`, and \`jobs\` to juggle them. \`kill -9\` is the nuclear option for killing hung exploits. And when you find a suspicious process on a compromised machine, \`ps aux | grep -i crypto\` might reveal a miner eating CPU.

Understanding process management is crucial for controlling long-running tools like scanners and listeners.`,
      { hasQuiz: true, quiz: [
        { id: 'lt-6-q1', question: 'Which command shows a live-updating view of all running processes?', options: ['ps aux', 'top', 'jobs', 'kill'], correctIndex: 1, explanation: 'top shows a live, updating view of processes. ps aux provides a snapshot, not live updates.' },
        { id: 'lt-6-q2', question: 'What does `kill -9 1234` do?', options: ['Pauses process 1234', 'Gracefully stops process 1234', 'Force kills process 1234 (SIGKILL)', 'Moves process 1234 to background'], correctIndex: 2, explanation: 'kill -9 sends SIGKILL, which forcefully terminates the process immediately without cleanup.' },
        { id: 'lt-6-q3', question: 'How do you run a command in the background?', options: ['Use Ctrl+Z', 'Append `&` to the command', 'Use the `bg` command', 'Use `run --background`'], correctIndex: 1, explanation: 'Appending `&` to a command runs it in the background, giving you your prompt back immediately.' },
      ] }),

    l('lt-7', 'Archiving & Compression',
      `When working with multiple files: common in security toolkits and log archives, you need to bundle and compress them. Start with a single file, then build up to full directory archives.

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

> **Why this matters for hacking:** When you exfiltrate data from a compromised host, you'll compress it first to reduce transfer time and network noise. Multiple small files (credentials, config snippets, database dumps) become one tidy archive. Encrypting before exfiltration buys you time if the transfer is monitored. On the flip side, defenders use these same tools to archive evidence for forensic analysis.

The key progression: single file → archive → compressed archive → encrypted archive. Each step adds a layer of capability.`,
      { hasTerminal: true, terminalCommands: ['gzip --help', 'tar --help', 'tar -czf test.tar.gz .', 'tar -tzf test.tar.gz'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-7-q1', question: 'What flag combination creates a `.tar.gz` archive?', options: ['-czf', '-xzf', '-cjf', '-cf'], correctIndex: 0, explanation: '`-c` creates, `-z` uses gzip compression, `-f` specifies the filename.' },
        { id: 'lt-7-q2', question: 'What does `zcat` do?', options: ['Views compressed file content without extracting', 'Compresses a file with gzip', 'Creates a tar archive', 'Extracts a .tar.gz file'], correctIndex: 0, explanation: '`zcat` reads a gzipped file and outputs its content to stdout without decompressing to disk.' },
        { id: 'lt-7-q3', question: 'What compression does the `-j` flag in tar use?', options: ['bzip2', 'gzip', 'xz', 'ZIP'], correctIndex: 0, explanation: '`-j` uses bzip2, which offers better compression than gzip but is slower.' },
      ] }),

    l('lt-8', 'Text Editors & File Viewing',
      `Viewing and editing files is a daily task. Start with simple viewing, then move to editing.

**Viewing files (no editing, just looking):**

\`\`\`bash
# less, scroll through a file (press q to quit)
less /var/log/syslog

# head, see the first lines (default: 10)
head /etc/passwd
head -n 20 /etc/passwd    # First 20 lines

# tail, see the last lines
tail /var/log/auth.log
tail -f /var/log/auth.log  # Follow in real-time (Ctrl+C to stop)
tail -n 50 /var/log/syslog # Last 50 lines

# wc, word/line count
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
- \`Ctrl+O\`, save (WriteOut)
- \`Ctrl+X\`, exit
- \`Ctrl+W\`, search
- \`Ctrl+K\`: cut line, \`Ctrl+U\`, paste
- \`Alt+6\`, copy line

**Vim — the power editor (steeper learning curve, much faster):**

\`\`\`bash
# Open a file
vim notes.txt
\`\`\`

Vim modes (this is the key concept):
- \`Normal mode\`, default on open. Press \`Esc\` to return here.
- \`Insert mode\`, press \`i\` to start typing. Press \`Esc\` to leave.
- \`Command mode\`, press \`:\` to enter commands.

**Essential vim commands (normal mode):**
\`\`\`
i       , enter insert mode (start typing)
dd      , delete current line
yy      , copy (yank) current line
p       , paste below cursor
:w      , save file
:q      , quit
:wq     , save and quit
:q!     , quit without saving
/text   , search for "text"
n       , next search result
u       , undo
Ctrl+r  , redo
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

> **Why this matters for hacking:** On a compromised server, you rarely have a GUI editor. You'll view config files with \`less\` or \`cat\`, edit exploit scripts with \`vim\` or \`nano\`, and monitor log files in real-time with \`tail -f\`. \`less\` is especially powerful for scrolling through large files like multi-gigabyte access logs without loading them entirely into memory.

Start with nano. Once you're comfortable, force yourself to use vim for a week. It will feel awkward at first, then incredibly powerful.`,
      { hasTerminal: true, terminalCommands: ['head -20 /etc/passwd', 'tail -5 /etc/passwd', 'wc -l /etc/passwd', 'less --help | head -5'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-8-q1', question: 'In vim, how do you enter insert mode?', options: ['Press `i`', 'Press `:`', 'Press `Esc`', 'Press `dd`'], correctIndex: 0, explanation: 'Pressing `i` in normal mode switches vim to insert mode, allowing you to type text.' },
        { id: 'lt-8-q2', question: 'What does `tail -f` do?', options: ['Follows file output in real-time as new lines are added', 'Shows the first 10 lines', 'Counts the lines in a file', 'Opens the file for editing'], correctIndex: 0, explanation: '`-f` (follow) keeps reading and displaying new lines as they\'re appended to the file, perfect for monitoring logs.' },
        { id: 'lt-8-q3', question: 'What does `wc -l` count?', options: ['Lines in a file', 'Words in a file', 'Bytes in a file', 'Characters in a file'], correctIndex: 0, explanation: '`-l` tells `wc` (word count) to count lines instead of words or bytes.' },
      ] }),

    l('lt-9', 'SSH & Remote Connections',
      `SSH (Secure Shell) lets you control remote computers securely. Start locally, then connect remotely.

**Check if SSH is installed:**
\`\`\`bash
ssh -V
# Output: OpenSSH_9.2p1 Debian-2, OpenSSL 3.0.9
\`\`\`

**Connect to a remote machine (build up the command):**
\`\`\`bash
# Simplest form, connect with default port (22)
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

> **Why this matters for hacking:** SSH is the backbone of remote access in security work. You'll SSH into vulnerable machines to deploy exploits, set up port forwarding to access internal services through a compromised host ("pivoting"), and use SSH tunnels to bypass firewalls. \`ssh -L\` creates a tunnel from your machine to the target's network, you access \`localhost:8080\` on your box, and traffic flows through the SSH connection to the target's internal service. This is the single most important skill for network-based operations.

**Mini-challenge:** Add a config entry for a fictional target in \`~/.ssh/config\`: \`echo -e "Host vulnbox\\n    HostName 10.10.10.10\\n    User root" >> ~/.ssh/config && chmod 600 ~/.ssh/config\`. Practice connecting with \`ssh vulnbox\`. Understanding SSH configs saves you minutes of typing on every engagement.

**Important:** \`~/.ssh\` directory must have permissions \`700\`, and files inside must be \`600\`. SSH will refuse to work if permissions are too open.`,
      { hasTerminal: true, terminalCommands: ['ssh -V', 'man ssh_config | head -20'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-9-q1', question: 'What does `ssh -L 8080:localhost:80` do?', options: ['Creates a local port forward tunnel', 'Lists SSH key files', 'Logs into a remote machine', 'Disables SSH authentication'], correctIndex: 0, explanation: '`-L` sets up local port forwarding: local port 8080 tunnels to the remote host\'s localhost:80.' },
        { id: 'lt-9-q2', question: 'What permissions should the `~/.ssh` directory have?', options: ['700 (owner read/write/execute only)', '777 (everyone full access)', '644 (owner read/write, others read)', '600 (owner read/write only)'], correctIndex: 0, explanation: '`~/.ssh` must be 700; individual key files inside should be 600. SSH refuses to work with more open permissions.' },
        { id: 'lt-9-q3', question: 'What does `ssh-copy-id` do?', options: ['Copies your public key to a remote server', 'Copies a private key to remote', 'Creates an SSH tunnel', 'Lists files on a remote server'], correctIndex: 0, explanation: '`ssh-copy-id` installs your public key on the remote server\'s `~/.ssh/authorized_keys`, enabling passwordless login.' },
      ] }),

    l('lt-10', 'Finding Things: Files & Commands',
      `Knowing how to find files, commands, and information is crucial. Start with simple lookups, then build to complex searches.

**Find where a command is located:**
\`\`\`bash
# which, show the path of a command
which nmap
# /usr/bin/nmap

which python3
# /usr/bin/python3

# whereis, find binary, source, and man page
whereis nmap
# nmap: /usr/bin/nmap /usr/share/nmap /usr/share/man/man1/nmap.1.gz
\`\`\`

**Find files by name (simple searches):**
\`\`\`bash
# locate, fast, uses a database
locate .bashrc
locate password.txt

# Update the database first
sudo updatedb

# locate is fast but might not have recent files
\`\`\`

**Find files by properties (powerful searches):**
\`\`\`bash
# find, searches the filesystem directly, slower but current

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

> **Why this matters for hacking:** \`find\` is a post-exploitation workhorse. You'll use it to locate config files with hardcoded credentials, find writable directories for staging payloads, and discover SUID binaries for privilege escalation. The \`-exec\` flag lets you act on results immediately, like compressing all files over 100MB with one command. \`grep -r "password"\` across common config directories (\`/etc\`, \`/var/www\`, \`/home\`) is a standard first step after gaining access.

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
\`\`\`

**Mini-challenge:** Search for files containing "password" in \`/etc\`: \`grep -rl "password" /etc 2>/dev/null\`. Then find all files modified in the last 10 minutes in \`/tmp\`: \`find /tmp -mmin -10 -type f 2>/dev/null\`. These patterns are used daily in incident response and forensics.`,
      { hasTerminal: true, terminalCommands: ['which bash', 'find /etc -maxdepth 1 -name "*.conf" | head -10', 'grep --help | head -5'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-10-q1', question: 'What is the key difference between `locate` and `find`?', options: ['locate uses a pre-built database; find searches the filesystem in real time', 'locate is slower than find', 'find uses a database; locate searches live', 'They are identical in behavior'], correctIndex: 0, explanation: '`locate` queries an indexed database (fast but may be stale); `find` traverses the filesystem directly (slower but always current).' },
        { id: 'lt-10-q2', question: 'What does `find / -perm -4000 -type f` discover?', options: ['SUID binaries', 'Hidden files', 'Files larger than 4000 bytes', 'Recently modified files'], correctIndex: 0, explanation: '`-perm -4000` matches files with the SUID bit set, a common privilege escalation vector.' },
        { id: 'lt-10-q3', question: 'How do you search file contents recursively in `/etc`?', options: ['grep -r "pattern" /etc/', 'find -r "pattern" /etc/', 'locate -r "pattern" /etc/', 'search "pattern" /etc/'], correctIndex: 0, explanation: '`grep -r` recursively searches all files in the given directory for the specified pattern.' },
      ] }),

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
# ~/.bashrc, runs every time you open a new terminal
# ~/.bash_profile, runs for login shells
# ~/.bash_history, stores your command history

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

> **Why this matters for hacking:** PATH manipulation is a classic privilege escalation technique. If a directory in your PATH is world-writable (like \`/tmp\` added to PATH), you can place a malicious \`ls\` binary there, and when root runs \`ls\`, your code executes with root privileges. Always check \`echo $PATH | tr ':' '\\n'\` during a penetration test to look for writable directories. Aliases are also useful, create shortcuts for your most-used scanning commands.

**Mini-challenge:** Check your PATH for writable directories: \`for dir in $(echo $PATH | tr ':' ' '); do ls -ld "$dir" 2>/dev/null | grep -q "w" && echo "Writable: $dir"; done\`. This is a real privilege escalation check. Then create an alias called \`scan\` that runs \`nmap -sV -sC -p-\` and make it permanent by adding it to \`~/.bashrc\`.

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
\`\`\``,
      { hasTerminal: true, terminalCommands: ['echo $PATH | tr ":" "\\n"', 'export TARGET="scanme.nmap.org" && echo "Target: $TARGET"', 'alias ll="ls -la --color=auto" && alias'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-11-q1', question: 'What does the `$PATH` environment variable control?', options: ['Where the system looks for executable programs', 'The user\'s password hash', 'The home directory location', 'The shell version'], correctIndex: 0, explanation: '`$PATH` is a colon-separated list of directories the shell searches when you type a command name.' },
        { id: 'lt-11-q2', question: 'What is the difference between setting a variable and exporting it?', options: ['Exported variables are available to child processes', 'Exported variables are saved permanently', 'There is no difference', 'Exported variables are encrypted'], correctIndex: 0, explanation: 'A plain `VAR=value` is local to the current shell; `export VAR=value` passes it to any subprocesses (scripts, commands).' },
        { id: 'lt-11-q3', question: 'What does an alias do?', options: ['Creates a shortcut for a longer command', 'Exports a variable to child processes', 'Changes file permissions', 'Lists directory contents'], correctIndex: 0, explanation: 'An alias maps a short name to a longer command, e.g., `alias ll="ls -la"` runs `ls -la` when you type `ll`.' },
      ] }),

    l('lt-12', 'Disk Usage & System Management',
      `Understanding disk usage helps you find space hogs and manage system resources. Start simple, then drill down.

**Check disk space on mounted filesystems:**
\`\`\`bash
# df, disk free (human-readable)
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
# du, disk usage
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
# uname, system info
uname -a           # All system info
uname -r           # Kernel release
uname -m           # Architecture (x86_64, aarch64)

# lsb_release, distribution info
lsb_release -a

# hostnamectl, full system info (systemd systems)
hostnamectl

# lscpu - CPU details
lscpu | grep "Model name"

# free, memory usage
free -h            # Human-readable
free -ht           # With totals
free -s 5          # Refresh every 5 seconds
\`\`\`

**Check system uptime and load:**
\`\`\`bash
# uptime, how long since last boot
uptime
# 14:32:11 up 3 days,  2:15,  2 users,  load average: 0.08, 0.03, 0.01

# The three numbers are load averages (1, 5, 15 minutes)
# Below 1.0 = healthy, above = busy

# dmesg, kernel messages
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

> **Why this matters for hacking:** Before you deploy a tool or exfiltrate data, check available disk space with \`df -h\`. A full disk can crash tools and lose results. \`du -sh\` helps you find large log files that might be eating space. And \`uname -a\` reveals the kernel version, the first step in researching kernel exploits. Every operator runs \`uname -a\` and \`cat /etc/os-release\` within seconds of landing on a new box.

**Mini-challenge:** Run \`df -h\` to check disk usage, then \`free -h\` to see memory. Find the top 5 largest files in \`/var\` with \`du -sh /var/* | sort -rh | head -5\`. Finally, run \`uname -a\` and \`cat /etc/os-release\` to identify the system — exactly what you'd do in the first 30 seconds after gaining shell access.

This lesson wraps up the Linux Terminal 101 course. You now have the essential skills to navigate, manipulate, and manage a Linux system from the command line, the foundation of all offensive security work.`,
      { hasTerminal: true, terminalCommands: ['df -h', 'free -h', 'uname -a', 'cat /etc/os-release 2>/dev/null || cat /etc/*release 2>/dev/null | head -5'], terminalTitle: 'lesson-terminal', hasQuiz: true, quiz: [
        { id: 'lt-12-q1', question: 'What does `df -h` show?', options: ['Disk space on mounted filesystems in human-readable format', 'File differences between two directories', 'Running processes sorted by memory', 'Network interface configuration'], correctIndex: 0, explanation: '`df` (disk free) reports filesystem usage; `-h` makes sizes human-readable (GB, MB instead of blocks).' },
        { id: 'lt-12-q2', question: 'What information does `uname -a` reveal?', options: ['All system info including kernel version and architecture', 'Your current username', 'Disk usage statistics', 'IP address and network config'], correctIndex: 0, explanation: '`uname -a` prints kernel name, hostname, kernel release, kernel version, machine hardware, and OS.' },
        { id: 'lt-12-q3', question: 'In `uptime` output, what do the three load average numbers represent?', options: ['1-minute, 5-minute, and 15-minute load averages', 'CPU cores, memory, and disk', 'User count, process count, and thread count', 'Read, write, and execute operations'], correctIndex: 0, explanation: 'The three numbers are the average system load over the last 1, 5, and 15 minutes. Below 1.0 means the system is not overloaded.' },
      ] }),
];

export const COURSE: Course = {
  id: 'linux-terminal-101',
  title: 'Linux Terminal 101',
  categoryId: 'terminal',
  description:
    'Learn to navigate, control, and exploit the Linux command line. No prior experience needed, start from scratch and gain real terminal skills.',
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
