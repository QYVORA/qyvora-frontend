import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('wc-1', 'Command Prompt vs PowerShell',
      `Windows has two command-line interfaces: **Command Prompt (CMD)** and **PowerShell**. CMD is the traditional tool, while PowerShell is more modern and powerful. Understanding both is essential, the vast majority of enterprise environments run Windows, from corporate offices to government agencies. If you want to work in cybersecurity or IT, Windows command-line skills are non-negotiable.

**Why the command line matters for security:** GUIs are great for everyday tasks, but the command line gives you direct access to the operating system's internals. Many security tools, penetration testing frameworks, and automation scripts operate through the command line. When you're doing incident response or forensics, you often can't rely on a graphical interface — you need to know the commands by heart.

**Key differences from Linux:** If you've used Linux, you'll notice some important differences right away. Windows uses **drive letters** (like \`C:\`, \`D:\`) instead of a single root directory \`/\`. Paths use **backslashes** (\`\\\`) instead of forward slashes (\`/\`). For example, a file path on Windows looks like \`C:\\Users\\YourName\\Desktop\\file.txt\` while on Linux it would be \`/home/user/Desktop/file.txt\`.

Open CMD by pressing \`Win + R\`, typing \`cmd\`, and pressing Enter. You'll see:

\`\`\`cmd
C:\\Users\\YourName>
\`\`\`

This is the **command prompt**. It tells you:
- **C:**: the current drive (usually the system drive)
- **\\Users\\YourName**: your current directory (working folder)
- **>**: indicates the shell is waiting for your command

Try your first command:

\`\`\`cmd
echo Hello, Hacker!
\`\`\`

The \`echo\` command prints text back to you, it's the simplest way to verify that the command line is working. This is the Windows equivalent of the Linux terminal's first lesson.

**PowerShell** has a blue background and uses different commands (\`Get-ChildItem\` instead of \`dir\`). PowerShell is more powerful because it works with **objects** rather than plain text, making it easier to filter, sort, and process data programmatically. For this course, we'll focus on CMD since it's universal on Windows and provides the foundational skills you need before moving to PowerShell.`),

    l('wc-2', 'Navigation & File Management',
      `Navigating Windows from the command line is similar to Linux but uses different commands and path conventions. Before you can manage files, you need to understand the concept of a **working directory**, the folder you're currently "in" when you type a command. Every command you run operates relative to this directory unless you specify a full path.

**Why path separators matter:** One of the first things you'll notice is that Windows uses **backslashes** (\`\\\`) to separate directories in a path, while Linux uses **forward slashes** (\`/\`). This matters because using the wrong separator will break your commands. A Windows path looks like \`C:\\Users\\Admin\\Desktop\` while a Linux path looks like \`/home/admin/Desktop\`. Getting this wrong is one of the most common mistakes when switching between systems.

**Understanding drive letters:** Unlike Linux, which has a single root directory (\`/\`), Windows organizes storage into **drive letters** like \`C:\` (typically the system drive), \`D:\` (often a secondary data drive or optical drive), and so on. Each drive has its own directory tree. This is important for forensics and penetration testing because evidence or target files might be on different drives.

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

The \`dir\` command lists the contents of your current directory, it's the Windows equivalent of Linux's \`ls\`. The \`cd\` command changes your working directory, and \`cd ..\` moves up one level. The \`type\` command displays a file's contents, similar to \`cat\` on Linux.

Unlike Linux, Windows uses backslashes (\`\\\`) for paths and drive letters (\`C:\`, \`D:\`). Switching between drives requires a special command because each drive has its own current directory:

\`\`\`cmd
C:> D:          Switch to D: drive
C:> cd /D E:\\projects    Switch to a different drive and folder
\`\`\`

The \`/D\` flag with \`cd\` lets you switch both the drive and directory in one command. Without it, \`cd E:\\projects\` would change the directory on the current drive instead.`),

    l('wc-3', 'System Information',
      `Windows provides powerful commands to inspect system configuration. System reconnaissance: gathering information about a target system, is one of the first steps in both penetration testing and incident response. You need to know what you're working with before you can find vulnerabilities or investigate an breach.

**Why system information matters for security:** Knowing the operating system version tells you which exploits might work. Knowing the installed patches tells you which vulnerabilities have been fixed. Knowing the running processes reveals what software is active and potentially vulnerable. Knowing user accounts shows you who has access and what privilege levels exist. This information helps you understand the attack surface of a system.

\`\`\`cmd
systeminfo          Detailed system information (OS, RAM, BIOS)
\`\`\`

The \`systeminfo\` command is a goldmine of information. It shows your Windows version, installation date, available memory, network adapters, installed hotfixes (security patches), and BIOS version. Each piece of this tells you something important, for example, missing hotfixes indicate unpatched vulnerabilities.

\`\`\`cmd
tasklist            List all running processes
tasklist /SVC       Show services behind each process
\`\`\`

Running processes tell you what software is active on the system. The \`/SVC\` flag reveals which Windows services are hosted inside each process, this is useful for identifying suspicious processes that might be malware masquerading as legitimate services.

Stop a process:

\`\`\`cmd
taskkill /PID 1234        Stop by process ID
taskkill /IM notepad.exe  Stop by image name
\`\`\`

The \`/PID\` flag targets a process by its unique ID number, while \`/IM\` targets by the executable name. In incident response, you might use this to terminate a malicious process. In penetration testing, you might stop a security service temporarily.

\`\`\`cmd
whoami              Your current username
net user            List all user accounts on the system
hostname            The computer's network name
\`\`\`

These identity commands are critical. \`whoami\` shows your current user and privileges, this tells you what you can access. \`net user\` reveals all user accounts on the system, including hidden or administrative accounts that might indicate compromise. \`hostname\` identifies the machine on the network, which is essential when you're working across multiple systems.

These commands help you understand the Windows system you're working on, essential for both defense and offense.`),

    l('wc-4', 'Network Commands',
      `Windows has built-in network commands for troubleshooting and reconnaissance. Network reconnaissance is a critical skill in cybersecurity, it's how you discover what's on a network, how it's connected, and where potential vulnerabilities might exist.

**Why network reconnaissance matters:** Before you can test a system's security, you need to understand its network footprint. What IP address does it use? What ports are open? What services are running? What DNS servers does it use? These answers help you map out the attack surface and identify the best points of entry.

\`\`\`cmd
ipconfig            Show IP configuration
ipconfig /all       Detailed info (MAC address, DNS, DHCP)
\`\`\`

The \`ipconfig\` command shows your network interface details, your IP address, subnet mask, and default gateway. The \`/all\` flag adds your MAC address, DNS servers, and DHCP server information. This is your starting point for understanding your position on the network. The DNS server reveals where your domain queries go, and the DHCP server tells you which device分配s IP addresses on the network.

\`\`\`cmd
ping 8.8.8.8        Test connectivity to a host
ping -n 10 google.com    Send 10 pings
\`\`\`

The \`ping\` command tests whether a remote host is reachable by sending ICMP echo requests. The \`-n\` flag controls how many packets to send. In penetration testing, ping is used to determine which hosts are alive on a network before scanning them for open ports and services.

\`\`\`cmd
tracert google.com  Trace the route packets take
\`\`\`

The \`tracert\` command shows every router (hop) your packets pass through to reach a destination. Each hop reveals a network device along the path. This helps you understand the network topology and identify potential points where traffic could be intercepted or filtered.

Each hop shows a router along the path between you and the destination.

\`\`\`cmd
nslookup google.com     DNS lookup, find IP address of a domain
\`\`\`

The \`nslookup\` command queries DNS servers to translate domain names into IP addresses. This is essential for reconnaissance, you need to know a target's IP address before you can scan or attack it. It also reveals the DNS infrastructure, which can be a target itself.

\`\`\`cmd
netstat -an             Show all active network connections and listening ports
netstat -an | findstr "LISTEN"    Show only listening ports
netstat -an | findstr ":80"       Show connections on port 80
\`\`\`

The \`netstat\` command is one of the most important networking tools. It shows all active network connections and which ports are listening for incoming connections. Open ports indicate running services, and each service is a potential entry point. The \`-a\` flag shows all connections and listening ports, while \`-n\` displays addresses and port numbers in numeric format (faster and clearer than DNS names).

The \`| findstr\` command is CMD's equivalent of \`grep\`. It filters text output, letting you search for specific patterns in command results, an essential skill when dealing with large amounts of data.`),

    l('wc-5', 'Scripting Basics',
      `Batch files (.bat) let you chain multiple CMD commands into a reusable script. Automation is a core skill in cybersecurity, whether you're running a series of reconnaissance commands, deploying a tool across multiple machines, or creating a quick incident response checklist, scripting saves time and ensures consistency.

**Why automation matters in security:** When you're performing a penetration test or responding to an incident, you often need to run the same sequence of commands repeatedly. Writing them into a script ensures you don't forget a step, can reproduce your actions for documentation, and can execute them quickly under pressure.

**Understanding batch file structure:** A batch file is simply a text file with a \`.bat\` extension containing CMD commands that execute in order, line by line. The \`@echo off\` line at the top prevents the commands themselves from being printed — only the output shows. This makes the script output cleaner and easier to read.

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

Run it by double-clicking or typing \`scan.bat\` in CMD. The \`pause\` command at the end keeps the window open so you can read the output before it closes.

**PowerShell one-liners** are more powerful because PowerShell works with objects instead of text. This means you can filter, sort, and process data in ways that are impossible with plain text:

\`\`\`powershell
Get-Process | Where-Object CPU -gt 10
# List processes using more than 10% CPU

Test-Connection -Count 2 google.com
# PowerShell's version of ping

Get-Service | Where-Object Status -eq "Running"
# List all running services
\`\`\`

The pipe operator (\`|\`) sends the output of one command into the next, building complex operations from simple building blocks. This object-oriented approach is what makes PowerShell significantly more capable than CMD for complex automation tasks.

Scripting turns manual tasks into automated workflows, a core skill for any Windows operator.`, { hasQuiz: true, quiz: [
        { id: 'wc-5-q1', question: 'How do you create a reusable batch script on Windows?', options: ['Save commands in a .bat file', 'Save commands in a .exe file', 'Save commands in a .ps1 file', 'Save commands in a .cmd file'], correctIndex: 0, explanation: 'Batch files use the .bat extension and contain CMD commands that execute sequentially.' },
        { id: 'wc-5-q2', question: 'What is the PowerShell equivalent of `dir`?', options: ['ls', 'Get-ChildItem', 'List-Files', 'Show-Directory'], correctIndex: 1, explanation: 'PowerShell uses Get-ChildItem (or its aliases: ls, dir) to list directory contents.' },
        { id: 'wc-5-q3', question: 'How do you filter output in CMD?', options: ['grep', 'findstr', 'select-string', 'filter'], correctIndex: 1, explanation: 'CMD uses `findstr` to filter text output, similar to `grep` on Linux.' },
      ] }),

    l('wc-6', 'PowerShell Deep Dive',
      `PowerShell is far more powerful than CMD because it works with **objects** instead of plain text. When CMD gives you a line of text, PowerShell gives you a structured object with properties and methods that you can filter, sort, and manipulate programmatically. This makes PowerShell the preferred tool for system administration, automation, and security operations.

**When to use PowerShell vs CMD:** Use CMD for quick, simple commands where you just need text output. Use PowerShell when you need to process data — filtering lists, generating reports, or automating complex tasks. In security work, PowerShell is essential for log analysis, incident response, and building sophisticated tools.

**The basics — CMD compatibility:**
\`\`\`powershell
# These work in both CMD and PowerShell
dir
cd
echo "Hello"
\`\`\`

PowerShell maintains backward compatibility with many CMD commands, so your existing skills transfer directly.

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

The **Verb-Noun naming convention** is PowerShell's signature feature. Every cmdlet follows the pattern \`Verb-Noun\`, the verb tells you what action is being performed (Get, Set, Start, Stop), and the noun tells you what object it acts on (Process, Service, ChildItem). Once you learn this pattern, you can predict the name of commands you've never used before. For example, if you know \`Get-Service\` lists services, you can guess that \`Stop-Service\` stops them.

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

> **Why this matters for hacking:** PowerShell's object-oriented nature makes it far more powerful than CMD for security operations. Where CMD gives you text that you must parse with \`findstr\`, PowerShell gives you objects you can filter, sort, and export with built-in cmdlets. The \`Get-Process | Where-Object\` pattern is the equivalent of \`tasklist | findstr\` but with structured data, you can sort by memory, filter by CPU, and export to CSV or HTML for reports. The Remote PowerShell (\`Enter-PSSession\`) capability allows managing remote machines, which is essential for incident response across an enterprise network. Understanding PowerShell is a prerequisite for modern Windows security work.

**Mini-challenge:** (Conceptual — requires Windows.) The Verb-Noun naming convention (\`Get-Process\`, \`Stop-Service\`, \`Set-Location\`) lets you predict command names. Try: if \`Get-Service\` lists services and \`Stop-Service\` stops one, what do you think \`Start-Service\` does? This pattern recognition accelerates learning PowerShell. On Linux, install PowerShell Core: \`sudo apt install powershell\`.

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
      `Managing services and processes is critical for understanding what's running on a Windows system. Every program that executes on Windows is a process, and many of those processes are Windows services, background programs that start with the system and run without user interaction.

**Why understanding processes matters for security:** Malware often hides among legitimate processes or registers itself as a Windows service to maintain persistence — meaning it automatically restarts after a reboot. By understanding how processes and services work, you can identify suspicious activity, detect unauthorized software, and understand how an attacker might maintain access to a compromised system.

**Persistence mechanisms:** Attackers use several techniques to survive system reboots: registering malicious Windows services, creating scheduled tasks, modifying startup registry keys, and exploiting legitimate services by injecting code into them. Learning to audit services and processes is your first line of defense against these techniques.

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
> **Why this matters for hacking:** Process and service management is critical for identifying malicious activity. Suspicious processes often have unusual names, high CPU/memory usage, or are running from unexpected locations (e.g., \`C:\\Users\\Public\\\` instead of \`C:\\Program Files\\\`). The \`tasklist /SVC\` flag shows services hosted in each process, malware often runs as a service to maintain persistence. \`sc query\` lists all services; look for services with unusual names or descriptions. Scheduled tasks (\`schtasks\`) are another common persistence mechanism, attackers create tasks that run malicious scripts on a schedule or at login.

**Mini-challenge:** On Windows: \`tasklist /FI "MEMUSAGE gt 50000"\` finds processes using >50MB RAM. \`sc query state= running\` lists running services. \`schtasks /QUERY /FO LIST /V\` shows all scheduled tasks with detailed information. Practice filtering: \`schtasks /QUERY /FO TABLE | findstr "Daily"\` finds daily tasks.

            schtasks /QUERY /FO TABLE | findstr "Daily"
\`\`\``),

    l('wc-8', 'Registry & System Configuration',
      `The Windows Registry is a hierarchical database that stores configuration settings for the operating system, hardware, installed software, and user preferences. Understanding it is essential for both system configuration and digital forensics.

**Why the registry matters for forensics:** The registry records a massive amount of activity on a Windows system — what programs have been installed, what files have been opened, what USB devices have been connected, what network drives have been mapped, and what programs run automatically at startup. For a forensic investigator, the registry is one of the most valuable sources of evidence on a compromised system.

**Common attack vectors through the registry:** Attackers frequently abuse the registry to gain persistence (surviving reboots), escalate privileges, disable security features, and hide their activity. The \`Run\` and \`RunOnce\` keys are especially popular because any program listed there starts automatically when a user logs in. Attackers also modify file associations to launch malicious programs when you open common file types.

\`\`\`
HKEY_LOCAL_MACHINE (HKLM) - System-wide settings
HKEY_CURRENT_USER (HKCU) - Current user settings
HKEY_USERS (HKU)         - All user profiles
HKEY_CLASSES_ROOT (HKCR) - File associations
HKEY_CURRENT_CONFIG (HKCC) - Hardware profile
\`\`\`

Each hive contains a tree of keys and values, think of it like a file system where folders are keys and files are values.

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
\`\`\`
HKEY_LOCAL_MACHINE (HKLM) - System-wide settings
HKEY_CURRENT_USER (HKCU) - Current user settings
HKEY_USERS (HKU)         - All user profiles
HKEY_CLASSES_ROOT (HKCR) - File associations
HKEY_CURRENT_CONFIG (HKCC) - Hardware profile
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
# (GUI tool, boot options, services, startup)
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

> **Why this matters for hacking:** Windows Registry forensics is one of the most valuable skills in incident response. The \`Run\` keys (HKLM\\...\\Run, HKCU\\...\\Run) show startup programs, malware often adds itself here for persistence. The \`USBSTOR\` key lists every USB device ever connected, evidence of data exfiltration. The \`Uninstall\` key lists installed software, useful for identifying unauthorized tools. The \`RecentDocs\` key shows recently opened files. \`WMI\` queries (\`wmic os get Caption,Version\`) are powerful for system reconnaissance. Understanding these locations helps both attackers find persistence and defenders detect it.

**Mini-challenge:** (Conceptual — requires Windows.) On a Windows machine, run \`reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\` to see what starts automatically. Then \`wmic os get Caption,Version\` to see OS info. If you don't have Windows, study the command structure: \`reg query <key>\` queries registry, \`reg query <key> /s\` recurses subkeys, \`reg export <key> file.reg\` exports.

**Important note about WMIC:** Microsoft has deprecated the WMIC command-line tool in recent versions of Windows, and it may be removed entirely in future releases. However, it still works on most systems in use today, and you'll encounter it in existing scripts and documentation. For new work, Microsoft recommends using **PowerShell cmdlets** (like \`Get-CimInstance\`) or the **CIM cmdlets** which provide the same functionality in a modern, object-oriented way. In security contexts, WMIC is still valuable because many legacy systems and tools still use it, and understanding it helps you read older scripts and documentation.

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
];

export const COURSE: Course = {
  id: 'windows-cmd-101',
  title: 'Windows CMD 101',
  categoryId: 'terminal',
  description:
    'Master the Windows Command Prompt and PowerShell. Essential for any hacker targeting Windows environments.',
  overview:
    'Windows is everywhere, in enterprises, government, and home networks. This course teaches you to navigate Windows from the command line, manage files, inspect network configurations, and automate tasks.',
  estimatedMinutes: 50,
  cpCost: 50,
  learningObjectives: [
      'Navigate Windows directories with CMD and PowerShell',
      'Manage files, users, and processes from the command line',
      'Inspect network configuration (ipconfig, netstat)',
      'Write basic batch and PowerShell scripts',
  ],
  skillLevel: 'beginner',
  lessons: LESSONS,
};
