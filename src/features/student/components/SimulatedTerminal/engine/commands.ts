import type { CommandHandler, TerminalState, CommandResult } from '../types';
import * as handlers from './handlers';
import { resolvePath, findNode } from './filesystem';

type StateOverride = Partial<Pick<TerminalState, 'cwd' | 'env' | 'aliases' | 'root' | 'isRoot'>>;

interface InternalCommandResult extends CommandResult {
  stateOverride?: StateOverride;
  clearLine?: boolean;
  exit?: boolean;
  interactive?: boolean;
}

const commandMap: Record<string, CommandHandler> = {
  ls: handlers.ls,
  cd: handlers.cd,
  pwd: handlers.pwd,
  tree: handlers.tree,
  cat: handlers.cat,
  echo: handlers.echo,
  touch: handlers.touch,
  mkdir: handlers.mkdir,
  rm: handlers.rm,
  cp: handlers.cp,
  mv: handlers.mv,
  chmod: handlers.chmod,
  head: handlers.head,
  tail: handlers.tail,
  wc: handlers.wc,
  grep: handlers.grep,
  find: handlers.find,
  sort: handlers.sort,
  whoami: handlers.whoami,
  id: handlers.id,
  uname: handlers.uname,
  date: handlers.date,
  cal: handlers.cal,
  uptime: handlers.uptime,
  hostname: handlers.hostname,
  env: handlers.env,
  ps: handlers.ps,
  top: handlers.top,
  kill: handlers.kill,
  sudo: handlers.sudo,
  ping: handlers.ping,
  curl: handlers.curl,
  nmap: handlers.nmap,
  netstat: handlers.netstat,
  dig: handlers.dig,
  whois: handlers.whois,
  ss: handlers.ss,
  gobuster: handlers.gobuster,
  hydra: handlers.hydra,
  sqlmap: handlers.sqlmap,
  nikto: handlers.nikto,
  john: handlers.john,
  python3: handlers.python3,
  python: handlers.python3,
  node: handlers.node,
  git: handlers.git,
  pip: handlers.pip,
  pip3: handlers.pip,
  apt: handlers.apt,
  npm: handlers.npm,
  clear: handlers.clear,
  help: handlers.help,
  history: handlers.history,
  alias: handlers.alias,
  export: handlers.exportCmd,
  exit: handlers.exitCmd,
  man: handlers.man,
  which: handlers.which,
  'qyvora-help': handlers.qyvoraHelp,
  'tutorial-start': handlers.tutorialStart,
  'tutorial-next': handlers.tutorialNext,
  'tutorial-reset': handlers.tutorialReset,
  ifconfig: (_args, _state) => {
    return {
      output: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 10.0.0.42  netmask 255.255.255.0  broadcast 10.0.0.255\n        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>\n        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)\n        RX packets 123456  bytes 98765432 (94.2 MiB)\n        TX packets 98765  bytes 6543210 (6.2 MiB)\n\nlo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n        inet 127.0.0.1  netmask 255.0.0.0\n        inet6 ::1  prefixlen 128  scopeid 0x10<host>\n        loop  txqueuelen 1000  (Local Loopback)\n        RX packets 98765  bytes 12345678 (11.8 MiB)\n        TX packets 98765  bytes 12345678 (11.8 MiB)',
      exitCode: 0,
    };
  },
  ip: (args, state) => {
    if (args.includes('a') || args.includes('addr')) {
      return {
        output: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n       valid_lft forever preferred_lft forever\n    inet6 ::1/128 scope host noprefixroute\n       valid_lft forever preferred_lft forever\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000\n    link/ether 08:00:27:4e:66:a1 brd ff:ff:ff:ff:ff:ff\n    inet 10.0.0.42/24 brd 10.0.0.255 scope global dynamic eth0\n       valid_lft 86342sec preferred_lft 86342sec\n    inet6 fe80::a00:27ff:fe4e:66a1/64 scope link noprefixroute\n       valid_lft forever preferred_lft forever',
        exitCode: 0,
      };
    }
    return { output: 'Usage: ip [OPTIONS] OBJECT {COMMAND}', exitCode: 1 };
  },
  tcpdump: (_args, _state) => {
    return {
      output: `tcpdump: verbose output suppressed, use -v[v]... for full protocol decode\nlistening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes\n${new Date().toLocaleTimeString()}  ARP, Request who-has 10.0.0.1 tell 10.0.0.42, length 46\n${new Date().toLocaleTimeString()}  ARP, Reply 10.0.0.1 is-at 00:50:56:00:00:01, length 28\n${new Date().toLocaleTimeString()}  IP 10.0.0.42.22 > 192.168.1.100.45123: Flags [P.], seq 123:456, ack 789, win 501, length 333\n${new Date().toLocaleTimeString()}  IP 192.168.1.100.45123 > 10.0.0.42.22: Flags [.], ack 456, win 4096, length 0`,
      exitCode: 0,
    };
  },
};

export function executeCommand(input: string, state: TerminalState): CommandResult & { _clearLine?: boolean; _exit?: boolean; _stateOverride?: StateOverride } {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  if (!cmd) return { output: '', exitCode: 0 };

  const handler = commandMap[cmd];
  if (!handler) {
    const name = cmd;
    if (name.startsWith('/')) {
      const resolved = resolvePath(name, state.cwd, state.home);
      const node = findNode(state.root, name, state.cwd, state.home);
      if (node && node.executable) {
        return { output: `bash: ${name}: cannot execute binary file: Exec format error`, exitCode: 126 };
      }
      if (node) return { output: `bash: ${name}: Is a directory`, exitCode: 126 };
    }
    return { output: '', error: `bash: ${cmd}: command not found`, exitCode: 127 };
  }

  const result = handler(args, state) as InternalCommandResult;
  return {
    output: result.output,
    error: result.error,
    exitCode: result.exitCode,
    _clearLine: result.clearLine,
    _exit: result.exit,
    _stateOverride: result.stateOverride,
  };
}
