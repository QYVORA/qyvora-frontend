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

Scripting turns manual tasks into automated workflows — a core skill for any Windows operator.`, { hasQuiz: true }),
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

Practice on \`scanme.nmap.org\` (a legal test target provided by the Nmap project).`, { hasQuiz: true }),
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

      { hasQuiz: true }),
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

Git and GitHub are essential tools for any developer or hacker. Every security tool, exploit, and framework lives on GitHub.`, { hasQuiz: true }),
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

**API keys** and tokens are how services authenticate API requests. If you find an exposed API key in JavaScript code or network traffic, you can impersonate that user.`, { hasQuiz: true }),
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

Save everything in a structured format. Documentation is as important as discovery.`, { hasQuiz: true }),
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

The more you practice with Burp, the more patterns you'll recognize in web applications.`, { hasQuiz: true }),
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

SQL injection is preventable. Every modern programming language supports parameterized queries. There is never a valid reason to concatenate user input into SQL queries.`, { hasQuiz: true }),
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

Many organizations also deploy **wireless intrusion detection systems (WIDS)** to detect rogue access points and deauthentication attacks.`, { hasQuiz: true }),
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

NSE makes Nmap infinitely extensible. The community has written hundreds of scripts covering everything from HTTP to databases to industrial control systems.`, { hasQuiz: true }),
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

The best way to learn is to practice: download public packet captures from malware-traffic-analysis.net and try to identify the malicious traffic yourself.`, { hasQuiz: true }),
  ],
};
