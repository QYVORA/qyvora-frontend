export interface CommandPartExplanation {
  command: string;
  summary: string;
  flags: Array<{ flag: string; meaning: string }>;
}

export interface CommandExplanation {
  overview: string;
  parts: CommandPartExplanation[];
  caution?: string;
}

const COMMANDS: Record<string, string> = {
  apropos: 'Searches manual page summaries for a keyword.',
  arp: 'Shows or modifies the ARP cache.',
  clear: 'Clears the terminal screen.',
  date: 'Shows or sets the system date and time.',
  dmesg: 'Prints kernel ring-buffer messages.',
  dig: 'Queries DNS records.',
  docker: 'Manages containers and images.',
  getfacl: 'Shows access control lists for a file.',
  git: 'Runs version-control operations.',
  groups: 'Lists the groups a user belongs to.',
  host: 'Looks up DNS information for a hostname.',
  kubectl: 'Manages Kubernetes resources.',
  last: 'Shows recent login history.',
  ln: 'Creates hard or symbolic links.',
  lsof: 'Lists open files and the processes using them.',
  make: 'Runs build tasks from a Makefile.',
  nslookup: 'Queries DNS records interactively or directly.',
  npm: 'Manages Node.js packages and scripts.',
  popd: 'Returns to the previous directory on the directory stack.',
  pushd: 'Changes directory and saves the previous location on a stack.',
  python: 'Runs the Python interpreter.',
  python3: 'Runs the Python 3 interpreter.',
  route: 'Shows or changes the IP routing table.',
  setfacl: 'Sets access control lists on a file.',
  sleep: 'Waits for a specified amount of time.',
  stat: 'Shows detailed file metadata.',
  tcpdump: 'Captures and inspects network packets.',
  traceroute: 'Traces the network path to a host.',
  umask: 'Shows or sets default permissions for newly created files.',
  updatedb: 'Refreshes the locate database.',
  whatis: 'Shows a one-line description of a command.',
  whois: 'Looks up domain registration information.',
  w: 'Shows who is logged in and what they are doing.',
  alias: 'Creates or lists shortcuts for longer commands.',
  awk: 'Processes text field by field, often for filtering or reformatting output.',
  base64: 'Encodes or decodes data using Base64.',
  cat: 'Prints file contents to the terminal.',
  cd: 'Changes the current working directory.',
  chmod: 'Changes file or directory permissions.',
  chown: 'Changes the owner or group of a file.',
  cp: 'Copies files or directories.',
  crontab: 'Reads or edits scheduled cron jobs.',
  curl: 'Transfers data to or from a URL, commonly used to inspect HTTP services.',
  cut: 'Extracts selected columns or fields from text.',
  df: 'Reports free disk space on mounted filesystems.',
  dirb: 'Brute-forces web content and directory names.',
  echo: 'Prints text or variable values to standard output.',
  env: 'Prints environment variables or runs a command with a modified environment.',
  export: 'Marks a shell variable for child processes.',
  ffuf: 'Fuzzes web paths, parameters, or virtual hosts.',
  file: 'Identifies a file type from its contents.',
  find: 'Searches the filesystem using paths, names, types, permissions, or other tests.',
  free: 'Shows memory and swap usage.',
  gobuster: 'Enumerates web directories, files, DNS names, or virtual hosts.',
  grep: 'Searches text for lines matching a pattern.',
  gzip: 'Compresses files with gzip.',
  gunzip: 'Decompresses gzip files.',
  hashcat: 'Cracks password hashes using GPU or CPU acceleration.',
  head: 'Prints the first lines of a file.',
  history: 'Shows previously run shell commands.',
  hostname: 'Prints or sets the system hostname.',
  hydra: 'Performs online password attacks against supported login services.',
  id: 'Shows the current user and group identity.',
  ifconfig: 'Shows or configures legacy network interfaces.',
  ip: 'Shows or configures network interfaces, routes, and addresses.',
  john: 'Cracks password hashes with John the Ripper.',
  journalctl: 'Reads systemd journal logs.',
  kill: 'Sends a signal to a process, usually to stop it.',
  less: 'Views a file one screen at a time.',
  locate: 'Finds files using a prebuilt filesystem index.',
  ls: 'Lists files and directories.',
  man: 'Opens the manual page for a command.',
  mkdir: 'Creates directories.',
  more: 'Views a file one screen at a time with basic navigation.',
  mv: 'Moves or renames files and directories.',
  nc: 'Reads and writes network connections, often called netcat.',
  netstat: 'Shows network connections, routing tables, and interface statistics.',
  nikto: 'Scans web servers for common misconfigurations and vulnerabilities.',
  nmap: 'Scans hosts and services to discover open ports and versions.',
  openssl: 'Runs cryptographic operations such as inspecting certificates or hashing.',
  ping: 'Tests reachability by sending ICMP echo requests.',
  pkill: 'Sends a signal to processes matched by name or pattern.',
  ps: 'Lists running processes.',
  pwd: 'Prints the current working directory.',
  rm: 'Removes files or directories.',
  rmdir: 'Removes empty directories.',
  scp: 'Copies files securely over SSH.',
  sed: 'Edits or transforms text using stream rules.',
  sort: 'Sorts lines of text.',
  source: 'Runs commands from a file in the current shell.',
  sqlmap: 'Automates detection and exploitation of SQL injection.',
  ssh: 'Opens a secure shell session or runs a command on a remote host.',
  ss: 'Shows socket and network connection statistics.',
  strings: 'Extracts printable text from binary files.',
  sudo: 'Runs a command with elevated privileges.',
  su: 'Switches to another user account.',
  systemctl: 'Controls systemd services and system state.',
  tail: 'Prints the last lines of a file or follows new output.',
  tar: 'Creates, lists, or extracts archive files.',
  tee: 'Writes input to both standard output and a file.',
  top: 'Shows a live view of running processes and resource usage.',
  touch: 'Creates an empty file or updates a file timestamp.',
  tr: 'Translates or deletes characters in a stream.',
  uname: 'Prints system and kernel information.',
  uniq: 'Filters or counts repeated adjacent lines.',
  uptime: 'Shows how long the system has been running and its load average.',
  users: 'Lists users currently logged in.',
  watch: 'Runs a command repeatedly and displays the changing output.',
  wc: 'Counts lines, words, bytes, or characters.',
  wget: 'Downloads files from URLs.',
  which: 'Shows the path of an executable found in PATH.',
  who: 'Shows who is logged into the system.',
  whoami: 'Prints the current username.',
  xargs: 'Builds command lines from standard input.',
  xxd: 'Creates a hex dump or reverses a hex dump.',
  zcat: 'Prints the contents of compressed files.',
};

const COMMAND_FLAGS: Record<string, Record<string, string>> = {
  ls: {
    '-a': 'show hidden entries too',
    '-A': 'show almost all entries',
    '-h': 'use human-readable sizes',
    '-l': 'use the long listing format',
    '-R': 'recurse into subdirectories',
    '-t': 'sort by modification time',
    '-r': 'reverse the sort order',
    '-S': 'sort by file size',
  },
  cat: {
    '-A': 'show non-printing and line-ending characters',
    '-b': 'number non-blank lines',
    '-e': 'show line endings',
    '-n': 'number every output line',
  },
  head: {
    '-c': 'print a number of bytes',
    '-n': 'print a number of lines',
  },
  tail: {
    '-c': 'print a number of bytes',
    '-f': 'follow new output as it is written',
    '-n': 'print a number of lines',
  },
  grep: {
    '-c': 'count matching lines',
    '-C': 'show context lines around a match',
    '-E': 'use extended regular expressions',
    '-i': 'ignore case',
    '-n': 'show line numbers',
    '-o': 'print only the matching part',
    '-r': 'search directories recursively',
    '-R': 'search directories recursively, following links',
    '-v': 'invert the match',
  },
  find: {
    '-exec': 'run a command for each match',
    '-group': 'match files by group',
    '-maxdepth': 'limit directory depth',
    '-mmin': 'match by minutes since modification',
    '-mtime': 'match by days since modification',
    '-name': 'match a file name pattern',
    '-perm': 'match permission bits',
    '-size': 'match a file size',
    '-type': 'match a file type',
    '-user': 'match files by owner',
  },
  rm: {
    '-f': 'force removal without prompts',
    '-i': 'prompt before each removal',
    '-r': 'remove directories recursively',
    '-R': 'remove directories recursively',
    '-v': 'show what is being removed',
  },
  mkdir: {
    '-m': 'set the new directory mode',
    '-p': 'create parent directories as needed',
    '-v': 'show each created directory',
  },
  chmod: {
    '-R': 'apply permissions recursively',
    '-v': 'show each change',
  },
  chown: {
    '-R': 'apply ownership recursively',
    '-v': 'show each change',
  },
  tar: {
    '-c': 'create an archive',
    '-f': 'specify the archive file',
    '-j': 'use bzip2 compression',
    '-t': 'list archive contents',
    '-v': 'show processed files',
    '-x': 'extract an archive',
    '-z': 'use gzip compression',
  },
  gzip: {
    '-d': 'decompress',
    '-k': 'keep the original file',
    '-r': 'compress directories recursively',
    '-v': 'show compression details',
  },
  ssh: {
    '-i': 'use a specific identity file',
    '-L': 'create a local port forward',
    '-N': 'do not run a remote command',
    '-p': 'connect to a specific port',
    '-T': 'disable pseudo-terminal allocation',
    '-v': 'show verbose connection details',
  },
  scp: {
    '-i': 'use a specific identity file',
    '-P': 'connect to a specific port',
    '-r': 'copy directories recursively',
  },
  curl: {
    '-I': 'fetch headers only',
    '-k': 'skip TLS certificate verification',
    '-L': 'follow redirects',
    '-o': 'write output to a file',
    '-s': 'run silently',
    '-X': 'set the HTTP method',
  },
  nmap: {
    '-A': 'enable aggressive service and OS detection',
    '-oN': 'write normal output to a file',
    '-p': 'select ports to scan',
    '-Pn': 'skip host discovery',
    '-sC': 'run default NSE scripts',
    '-sV': 'detect service versions',
    '-T': 'set timing template',
    '-v': 'show verbose output',
  },
  netstat: {
    '-l': 'show listening sockets',
    '-n': 'show numeric addresses',
    '-p': 'show the owning process',
    '-t': 'show TCP sockets',
    '-u': 'show UDP sockets',
  },
  ss: {
    '-l': 'show listening sockets',
    '-n': 'show numeric addresses',
    '-p': 'show the owning process',
    '-t': 'show TCP sockets',
    '-u': 'show UDP sockets',
  },
  sort: {
    '-k': 'sort by a key field',
    '-n': 'sort numerically',
    '-r': 'reverse the order',
    '-t': 'set the field separator',
    '-u': 'remove duplicate lines',
  },
  uniq: {
    '-c': 'prefix lines with counts',
    '-d': 'show only repeated lines',
    '-u': 'show only unique lines',
  },
  cut: {
    '-c': 'select characters',
    '-d': 'set the field delimiter',
    '-f': 'select fields',
  },
  tr: {
    '-d': 'delete characters',
    '-s': 'squeeze repeated characters',
  },
  wc: {
    '-c': 'count bytes',
    '-l': 'count lines',
    '-m': 'count characters',
    '-w': 'count words',
  },
  ps: {
    '-e': 'show every process',
    '-f': 'use full-format output',
    '-u': 'select by user',
  },
  ping: {
    '-c': 'stop after a number of packets',
    '-i': 'set the interval between packets',
    '-s': 'set the packet size',
  },
  sudo: {
    '-l': 'list allowed commands',
    '-u': 'run as a specific user',
  },
  su: {
    '-c': 'pass a command to the target user shell',
  },
  journalctl: {
    '-f': 'follow new log entries',
    '-n': 'show a number of recent entries',
    '-u': 'filter by systemd unit',
  },
  hashcat: {
    '-a': 'select the attack mode',
    '-m': 'select the hash type',
    '-o': 'write recovered hashes to a file',
  },
  hydra: {
    '-f': 'stop after the first valid login',
    '-l': 'set a single login name',
    '-P': 'set a password wordlist',
    '-p': 'set a single password',
    '-t': 'set parallel tasks',
  },
  sqlmap: {
    '-u': 'set the target URL',
  },
  ffuf: {
    '-H': 'add a request header',
    '-mc': 'match specific status codes',
    '-u': 'set the target URL',
    '-w': 'set the wordlist',
  },
  ln: {
    '-s': 'create a symbolic link',
  },
  stat: {
    '-c': 'use a custom output format',
  },
  gobuster: {
    '-u': 'set the target URL',
    '-w': 'set the wordlist',
  },
};

function stripComment(line: string): string {
  return line.replace(/\s+#.*$/, '').trim();
}

function splitSegments(line: string): string[] {
  return line
    .split(/\s*(?:&&|\|\||\||;)\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function explainFlags(commandName: string, tokens: string[]): Array<{ flag: string; meaning: string }> {
  const found: Array<{ flag: string; meaning: string }> = [];
  const seen = new Set<string>();
  const available = COMMAND_FLAGS[commandName] ?? {};

  const add = (flag: string) => {
    const meaning = available[flag];
    if (!meaning || seen.has(flag)) return;
    seen.add(flag);
    found.push({ flag, meaning });
  };

  for (const token of tokens) {
    if (token === '2>/dev/null' || token === '>/dev/null') {
      if (!seen.has('2>/dev/null')) {
        seen.add('2>/dev/null');
        found.push({ flag: '2>/dev/null', meaning: 'discard error output' });
      }
      continue;
    }
    if (!token.startsWith('-') || token === '-') continue;
    const flag = token.startsWith('--') ? token.split('=')[0] : token;
    if (available[flag]) {
      add(flag);
      continue;
    }
    if (/^-[A-Za-z]{2,}$/.test(flag)) {
      for (const char of flag.slice(1)) add(`-${char}`);
    }
  }

  return found;
}

function detectCaution(command: string): string | undefined {
  if (/\brm\s+-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*\b/.test(command) || /\brm\s+-[a-zA-Z]*f[a-zA-Z]*r[a-zA-Z]*\b/.test(command)) {
    return 'rm -rf deletes recursively without confirmation. Verify the path before running it.';
  }
  if (/\bchmod\s+777\b/.test(command)) {
    return 'chmod 777 gives every user read, write, and execute access. Use the least privilege needed.';
  }
  if (/\bcurl\b[^\n|]*\|\s*(?:ba)?sh\b/.test(command)) {
    return 'Piping a remote script directly into a shell runs untrusted code. Download and inspect it first.';
  }
  if (/\bdd\s+if=/.test(command)) {
    return 'dd writes raw data and can overwrite disks. Double-check the input and output targets.';
  }
  return undefined;
}

export function explainCommand(command: string): CommandExplanation | null {
  const parts: CommandPartExplanation[] = [];
  const lines = command
    .split('\n')
    .map(stripComment)
    .filter((line) => line && !line.startsWith('#'));

  for (const line of lines) {
    const cleanLine = line.replace(/^\$\s*/, '');
    for (const segment of splitSegments(cleanLine)) {
      const tokens = segment.split(/\s+/).filter(Boolean);
      while (tokens[0] && /^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[0])) tokens.shift();
      if (!tokens[0]) continue;

      const rawCommand = tokens[0].replace(/^.*\//, '');
      const isSudo = rawCommand === 'sudo' && tokens.length > 1;
      if (isSudo) tokens.shift();
      const commandName = tokens[0]?.replace(/^.*\//, '') ?? '';
      const summary = COMMANDS[commandName];
      if (!summary) continue;

      parts.push({
        command: segment,
        summary: isSudo ? `Runs ${commandName} with elevated privileges. ${summary}` : summary,
        flags: explainFlags(commandName, tokens.slice(1)),
      });
    }
  }

  if (parts.length === 0) return null;

  return {
    overview:
      parts.length === 1
        ? parts[0].summary
        : `This example runs ${parts.length} commands. Each part is explained below.`,
    parts,
    caution: detectCaution(command),
  };
}

export default explainCommand;
