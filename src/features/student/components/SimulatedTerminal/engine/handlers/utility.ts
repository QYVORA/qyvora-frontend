import type { CommandHandler } from '../../types';
import { findNode } from '../filesystem';

export const clear: CommandHandler = (_args, _state) => {
  return { output: '', exitCode: 0, clearLine: true };
};

export const help: CommandHandler = (_args, _state) => {
  return {
    output: `QYVORA Simulated Terminal - Help
====================================

  NAVIGATION
    ls [path]              List directory contents
    cd [dir]               Change directory
    pwd                    Print current working directory
    tree [path]            Display directory tree

  FILE OPERATIONS
    cat <file>             Display file contents
    echo <text>            Print text
    touch <file>           Create empty file
    mkdir <dir>            Create directory
    rm [-rf] <path>        Remove files/directories
    cp <src> <dst>         Copy files
    mv <src> <dst>         Move/rename files
    chmod <mode> <file>    Change file permissions
    head [-n] <file>       Show first lines of file
    tail [-n] <file>       Show last lines of file
    wc <file>              Count lines, words, chars
    grep <pattern> <file>  Search file contents
    find <path> -name <p>  Find files
    sort <file>            Sort file contents
    less <file>            View file contents (paged)
    diff <f1> <f2>         Compare files
    ln -s <src> <dest>     Create symbolic link
    du [-h] <path>         Estimate file space usage
    df                     Disk free
    tar -c/x/t -f <a>      Archive utility
    zip <a> <files>        Compress files
    unzip <file>           Extract zip archive
    xxd <file>             Hex dump
    strings <file>         Extract printable strings
    file <file>            Determine file type
    md5sum/sha256sum       Compute file hashes
    awk '{print}' <file>   Text processing
    sed 's/old/new/'       Stream editor
    cut -f N -d D <file>   Column extraction
    uniq <file>            Remove duplicates
    tr <set1> <set2>       Translate characters

  SYSTEM INFO
    whoami                 Show current user
    id                     Show user identity
    uname [-a]             Show system info
    date                   Show date/time
    cal [month] [year]     Show calendar
    uptime                 Show system uptime
    hostname               Show system hostname
    env                    Show environment variables
    ps [aux]               List processes
    top                    Show process overview
    kill [-9] <pid>        Kill process
    sudo <cmd>             Execute as root
    free                   Memory usage
    lsof                   List open files
    crontab -l             List cron jobs
    service <name> <act>   Service management
    systemctl <cmd> <srv>  Systemd control
    chown <user> <file>    Change file owner
    umask                  File mode mask
    jobs                   List background jobs
    bg                     Resume job in background
    fg                     Resume job in foreground

  NETWORK
    ping [-c n] <host>     Ping a host
    curl <url>             HTTP request
    nmap [-sV] <target>    Port scanner
    netstat [-tuln]        Network connections
    ss [-tuln]             Socket statistics
    dig <domain>           DNS lookup
    whois <domain>         WHOIS lookup
    traceroute <host>      Trace route to host
    arp                    ARP table
    ip route               Routing table
    wget <url>             Download file
    scp <src> <dest>       Secure copy
    ssh [user@]host        SSH connection

  SECURITY TOOLS
    gobuster -u <url> -w <wordlist>   Directory brute-force
    hydra -l <user> -P <wordlist> <service>://<target>
                                      Password brute-force
    sqlmap -u <url>                    SQL injection scanner
    nikto -h <host>                    Web server scanner
    john <hashfile>                    Password cracker
    searchsploit <term>                Exploit search
    enum4linux <host>                  Windows/Samba enumeration
    smbclient -L <host>                SMB client
    crackmapexec <target>              Network exploitation tool
    hashcat -m <mode> <hashfile>       Hash cracking
    exiftool <file>                    Metadata viewer
    binwalk <file>                     Firmware analysis
    msfconsole                         Metasploit Framework

  DEVELOPMENT
    python3 <script>       Python interpreter
    node <script>          Node.js runtime
    git <command>          Git version control
    pip <command>          Python package manager
    apt <command>          Package manager
    npm <command>          Node package manager
    docker <command>       Container management
    tmux/screen <cmd>      Terminal multiplexer
    make                   Build tool
    gcc <file>             C compiler

  META
    clear                  Clear terminal
    help                   Show this help
    history [-c]           Show/clear command history
    alias [name=value]     Manage aliases
    export [VAR=value]     Set environment variable
    reset                  Reset terminal
    exit                   Close terminal

  QYVORA SPECIFIC
    qyvora-help            Show course-related commands

  KEYBOARD SHORTCUTS
    Ctrl+A/E               Jump to start/end of line
    Ctrl+U/K               Delete to start/end of line
    Ctrl+W                 Delete word before cursor
    Ctrl+L                 Clear screen
    Ctrl+C                 Cancel current input
    Ctrl+D                 Exit (on empty line)
    Ctrl+R                 Reverse-search history
    Tab                    Auto-complete files/paths
    Tab+Tab                Show all completions
    !!                     Repeat last command
    !n                     Repeat history entry n`,
    exitCode: 0,
  };
};

export const history: CommandHandler = (args, state) => {
  if (args.includes('-c')) {
    return { output: '', exitCode: 0, stateOverride: { history: [] } as any };
  }
  if (state.history.length === 0) return { output: 'No command history.', exitCode: 0 };
  const lines = state.history.map((cmd, i) => `  ${i + 1}  ${cmd}`);
  return { output: lines.join('\n'), exitCode: 0 };
};

export const alias: CommandHandler = (args, state) => {
  if (args.length === 0) {
    const lines = Object.entries(state.aliases).map(([k, v]) => `alias ${k}='${v}'`);
    return { output: lines.join('\n'), exitCode: 0 };
  }
  const aliasDef = args[0];
  const eqIdx = aliasDef.indexOf('=');
  if (eqIdx === -1) {
    const value = state.aliases[aliasDef];
    return value
      ? { output: `alias ${aliasDef}='${value}'`, exitCode: 0 }
      : { output: '', error: `alias: ${aliasDef}: not found`, exitCode: 1 };
  }
  const name = aliasDef.slice(0, eqIdx);
  const value = aliasDef.slice(eqIdx + 1).replace(/^['"]|['"]$/g, '');
  return {
    output: '',
    exitCode: 0,
    stateOverride: { aliases: { ...state.aliases, [name]: value } },
  };
};

export const exportCmd: CommandHandler = (args, state) => {
  if (args.length === 0) {
    const lines = Object.entries(state.env).map(([k, v]) => `export ${k}="${v}"`);
    return { output: lines.join('\n'), exitCode: 0 };
  }
  const eqIdx = args[0].indexOf('=');
  if (eqIdx === -1) {
    return { output: '', error: `export: ${args[0]}: not a valid identifier`, exitCode: 1 };
  }
  const name = args[0].slice(0, eqIdx);
  const value = args[0].slice(eqIdx + 1).replace(/^['"]|['"]$/g, '');
  return {
    output: '',
    exitCode: 0,
    stateOverride: { env: { ...state.env, [name]: value } },
  };
};

export const exitCmd: CommandHandler = (_args, _state) => {
  return { output: 'exit', exitCode: 0, exit: true };
};

export const man: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: 'What manual page do you want?', exitCode: 1 };
  const cmd = args[0];
  const mans: Record<string, string> = {
    ls: `LS(1)                          User Commands                          LS(1)\n\nNAME\n       ls - list directory contents\n\nSYNOPSIS\n       ls [OPTION]... [FILE]...\n\nDESCRIPTION\n       List information about the FILEs (the current directory by default).\n       Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.\n\n       -a, --all\n              do not ignore entries starting with .\n\n       -l     use a long listing format\n\n       -h, --human-readable\n              with -l, print sizes in human readable format\n\nAUTHOR\n       Written by Richard M. Stallman and David MacKenzie.`,
    cat: `CAT(1)                          User Commands                          CAT(1)\n\nNAME\n       cat - concatenate files and print on the standard output\n\nSYNOPSIS\n       cat [OPTION]... [FILE]...\n\nDESCRIPTION\n       Concatenate FILE(s) to standard output.\n\n       With no FILE, or when FILE is -, read standard input.`,
    grep: `GREP(1)                        User Commands                        GREP(1)\n\nNAME\n       grep, egrep, fgrep - print lines that match patterns\n\nSYNOPSIS\n       grep [OPTION]... PATTERNS [FILE]...\n\nDESCRIPTION\n       grep searches for PATTERNS in each FILE.\n       PATTERNS is one or more patterns separated by newline characters,\n       and grep prints each line that matches a pattern.\n\n       -i, --ignore-case\n              Ignore case distinctions in patterns and input data.`,
    nmap: `NMAP(1)                        User Commands                        NMAP(1)\n\nNAME\n       nmap - Network exploration tool and security scanner\n\nSYNOPSIS\n       nmap [Scan Type...] [Options] {target specification}\n\nDESCRIPTION\n       Nmap ("Network Mapper") is a free and open source utility for network\n       discovery and security auditing.`,
  };
  const content = mans[cmd];
  if (!content) return { output: `No manual entry for ${cmd}`, exitCode: 16 };
  const outputLines = content.split('\n');
  if (outputLines.length > 30) {
    const display = outputLines.slice(0, 30);
    display.push('', `-- More --(${Math.min(30, outputLines.length)}%)`);
    return { output: display.join('\n'), exitCode: 0 };
  }
  return { output: content, exitCode: 0 };
};

export const which: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', exitCode: 0 };
  const binaryPaths: Record<string, string> = {
    ls: '/usr/bin/ls', cd: 'shell builtin', pwd: '/usr/bin/pwd',
    cat: '/usr/bin/cat', echo: 'shell builtin', grep: '/usr/bin/grep',
    nmap: '/usr/bin/nmap', curl: '/usr/bin/curl', ping: '/usr/bin/ping',
    python3: '/usr/bin/python3', python: '/usr/bin/python3',
    node: '/usr/bin/node', git: '/usr/bin/git', gobuster: '/usr/bin/gobuster',
    sqlmap: '/usr/bin/sqlmap', hydra: '/usr/bin/hydra', nikto: '/usr/bin/nikto',
    john: '/usr/sbin/john', whois: '/usr/bin/whois', dig: '/usr/bin/dig',
    netstat: '/usr/bin/netstat', ss: '/usr/bin/ss', ifconfig: '/usr/sbin/ifconfig',
    ip: '/usr/bin/ip', tcpdump: '/usr/bin/tcpdump',
    docker: '/usr/bin/docker', tmux: '/usr/bin/tmux', screen: '/usr/bin/screen',
    make: '/usr/bin/make', gcc: '/usr/bin/gcc',
  };
  return {
    output: args.map(cmd => {
      const path = binaryPaths[cmd];
      return path ? `${path}` : `which: no ${cmd} in (${state.env.PATH || '/usr/bin:/bin'})`;
    }).join('\n'),
    exitCode: 0,
  };
};

export const qyvoraHelp: CommandHandler = (_args, _state) => {
  return {
    output: `QYVORA Course-Specific Commands
====================================

  QUITE ROOT / HPB BOOTCAMP
    hpb-scan <target>      Run a simulated bootcamp vulnerability scan
    hpb-status             Show your current bootcamp phase progress
    hpb-tools              List tools being used in current phase
    recon <domain>         Simulated recon workflow for bootcamp targets

  COURSES
    course-status          Show enrolled courses and progress
    lesson-info            Show current lesson context and hints
    practice <topic>       Generate practice exercise output

  TERMINAL TUTORIAL
    tutorial-start         Start interactive terminal tutorial
    tutorial-next          Next tutorial step
    tutorial-reset         Reset tutorial

Type a command above to get simulated output relevant to your course.`,
    exitCode: 0,
  };
};

export const tutorialStart: CommandHandler = (args, state) => {
  const lines = [
    '╔══════════════════════════════════════════════════════════════╗',
    '║            QYVORA Terminal Tutorial - Step 1               ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
    'Welcome to the terminal! Let\'s start with the basics.',
    '',
    'Step 1: Try typing "ls" to list files in your current directory.',
    'Step 2: Try "pwd" to see where you are.',
    'Step 3: Try "cd Documents" then "pwd" to navigate.',
    '',
    'Tip: Use the Up/Down arrow keys to navigate command history.',
    '',
    'Type "tutorial-next" when you\'re ready for the next step.',
  ];
  return { output: lines.join('\n'), exitCode: 0 };
};

export const tutorialNext: CommandHandler = (args, state) => {
  const lines = [
    '╔══════════════════════════════════════════════════════════════╗',
    '║            QYVORA Terminal Tutorial - Step 2               ║',
    '╚══════════════════════════════════════════════════════════════╝',
    '',
    'Great! Now let\'s work with files.',
    '',
    'Step 1: Try "echo Hello, World!" to print text.',
    'Step 2: Try "echo Hello > hello.txt" to create a file.',
    'Step 3: Try "cat hello.txt" to read the file.',
    'Step 4: Try "ls -la" to see file details.',
    '',
    'Type "tutorial-next" for the next step.',
  ];
  return { output: lines.join('\n'), exitCode: 0 };
};

export const tutorialReset: CommandHandler = (args, state) => {
  return { output: 'Tutorial reset. Type "tutorial-start" to begin again.', exitCode: 0 };
};

export const reset: CommandHandler = (_args, _state) => {
  return { output: 'Terminal reset.', exitCode: 0, clearLine: true };
};
