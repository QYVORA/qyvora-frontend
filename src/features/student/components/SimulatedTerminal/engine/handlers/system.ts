import type { CommandHandler } from '../../types';
import { findNode } from '../filesystem';

export const whoami: CommandHandler = (_args, state) => {
  return { output: state.user, exitCode: 0 };
};

export const id: CommandHandler = (_args, state) => {
  return {
    output: `uid=1001(${state.user}) gid=1001(${state.user}) groups=1001(${state.user}),27(sudo)`,
    exitCode: 0,
  };
};

export const uname: CommandHandler = (args, state) => {
  if (args.includes('-a')) {
    return { output: `Linux ${state.hostname} 6.8.0-kali1-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`, exitCode: 0 };
  }
  return { output: 'Linux', exitCode: 0 };
};

export const date: CommandHandler = (args, state) => {
  const now = new Date();
  if (args.includes('-u')) {
    return { output: now.toUTCString(), exitCode: 0 };
  }
  return { output: now.toString(), exitCode: 0 };
};

export const cal: CommandHandler = (args, state) => {
  const now = new Date();
  const year = args.length > 0 ? parseInt(args[args.length - 1]) || now.getFullYear() : now.getFullYear();
  const month = args.length > 1 ? parseInt(args[0]) || now.getMonth() + 1 : now.getMonth() + 1;
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const header = `    ${monthNames[month - 1]} ${year}`;
  const weekDays = 'Su Mo Tu We Th Fr Sa';
  const lines: string[] = [header, weekDays];
  let currentLine = '   '.repeat(startDay);
  for (let d = 1; d <= daysInMonth; d++) {
    currentLine += String(d).padStart(2) + ' ';
    if ((startDay + d) % 7 === 0 || d === daysInMonth) {
      lines.push(currentLine);
      currentLine = '';
    }
  }
  return { output: lines.join('\n'), exitCode: 0 };
};

export const uptime: CommandHandler = (_args, _state) => {
  const hours = Math.floor(Math.random() * 48) + 2;
  const minutes = Math.floor(Math.random() * 60);
  const users = Math.floor(Math.random() * 3) + 1;
  const load = (Math.random() * 2 + 0.1).toFixed(2);
  return {
    output: ` ${String(hours).padStart(2)}:${String(minutes).padStart(2)} up ${hours >= 24 ? `${Math.floor(hours / 24)} days, ` : ''}${hours % 24}:${String(minutes).padStart(2)},  ${users} ${users === 1 ? 'user' : 'users'},  load average: ${load}, ${(parseFloat(load) + 0.1).toFixed(2)}, ${(parseFloat(load) + 0.2).toFixed(2)}`,
    exitCode: 0,
  };
};

export const hostname: CommandHandler = (_args, state) => {
  return { output: state.hostname, exitCode: 0 };
};

export const env: CommandHandler = (_args, state) => {
  const lines = Object.entries(state.env).map(([k, v]) => `${k}=${v}`);
  return { output: lines.join('\n'), exitCode: 0 };
};

export const ps: CommandHandler = (args, state) => {
  const processes = [
    { pid: 1, ppid: 0, cpu: 0.0, mem: 0.1, cmd: 'init', user: 'root' },
    { pid: 42, ppid: 1, cpu: 0.0, mem: 0.3, cmd: 'systemd-journald', user: 'root' },
    { pid: 89, ppid: 1, cpu: 0.1, mem: 1.2, cmd: 'systemd-logind', user: 'root' },
    { pid: 124, ppid: 1, cpu: 0.0, mem: 0.4, cmd: 'cron', user: 'root' },
    { pid: 156, ppid: 1, cpu: 0.2, mem: 2.1, cmd: 'NetworkManager', user: 'root' },
    { pid: 203, ppid: 1, cpu: 0.0, mem: 0.8, cmd: 'sshd', user: 'root' },
    { pid: 387, ppid: 203, cpu: 0.0, mem: 0.5, cmd: 'sshd: kali', user: 'root' },
    { pid: 388, ppid: 387, cpu: 0.1, mem: 0.6, cmd: 'bash', user: 'kali' },
    { pid: 391, ppid: 388, cpu: 0.0, mem: 0.3, cmd: 'ps', user: 'kali' },
  ];
  const showAll = args.includes('-a') || args.includes('aux');
  const filtered = showAll ? processes : processes.filter(p => p.user === state.user);
  if (args.includes('aux') || args.includes('-ef')) {
    const header = `USER         PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND`;
    const lines = filtered.map(p =>
      `${p.user.padEnd(10)} ${String(p.pid).padStart(5)} ${p.cpu.toFixed(1).padStart(4)} ${p.mem.toFixed(1).padStart(4)}  12345   678 ${'pts/0'}  ${'S+'}   ${'12:34'}  ${'0:00.1'} ${p.cmd}`
    );
    return { output: [header, ...lines].join('\n'), exitCode: 0 };
  }
  const header = `  PID TTY          TIME CMD`;
  const lines = filtered.map(p => `${String(p.pid).padStart(5)} pts/0    00:00:00 ${p.cmd}`);
  return { output: [header, ...lines].join('\n'), exitCode: 0 };
};

export const top: CommandHandler = (args, state) => {
  const load = (Math.random() * 2 + 0.5).toFixed(2);
  const tasks = Math.floor(Math.random() * 20) + 30;
  const running = Math.floor(Math.random() * 3) + 1;
  const sleeping = tasks - running - 2;
  return {
    output: `top - ${new Date().toLocaleTimeString()} up ${Math.floor(Math.random() * 48)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')},  1 user,  load average: ${load}, ${(parseFloat(load) + 0.1).toFixed(2)}, ${(parseFloat(load) + 0.2).toFixed(2)}\nTasks: ${tasks} total, ${running} running, ${sleeping} sleeping, 0 stopped, 0 zombie\n%Cpu(s): ${(Math.random() * 20).toFixed(1)} us, ${(Math.random() * 5).toFixed(1)} sy,  0.0 ni, ${(Math.random() * 80 + 10).toFixed(1)} id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st\nMiB Mem :   7956.8 total,    ${(Math.random() * 2000 + 500).toFixed(1)} free,    ${(Math.random() * 2000 + 1000).toFixed(1)} used,    ${(Math.random() * 1000 + 200).toFixed(1)} buff/cache\nMiB Swap:   2048.0 total,    ${(Math.random() * 1000 + 500).toFixed(1)} free,    ${(Math.random() * 500 + 50).toFixed(1)} used.    ${(Math.random() * 1000 + 2000).toFixed(1)} avail Mem`,
    exitCode: 0,
  };
};

export const kill: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ...', exitCode: 2 };
  const signal = args[0].startsWith('-') ? args[0].slice(1) : 'TERM';
  const pids = args.filter(a => !a.startsWith('-'));
  if (pids.length === 0) return { output: '', error: 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ...', exitCode: 2 };
  return { output: '', exitCode: 0 };
};

export const sudo: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'usage: sudo -h | -K | -k | -V\nusage: sudo -v [-AknS] [-g group] [-h host] [-p prompt] [-u user]\nusage: sudo -l [-AknS] [-g group] [-h host] [-p prompt] [-U user] [-u user]\n            [command]\nusage: sudo [-AbknS] [-r role] [-t type] [-C num] [-g group] [-h host] [-p prompt]\n            [-T timeout] [-u user] [VAR=value] [-i|-s] [<command>]\nusage: sudo -e [-AknS] [-r role] [-t type] [-C num] [-g group] [-h host] [-p prompt]\n            [-u user] file ...', exitCode: 1 };
  if (!state.isRoot) {
    return { output: '', error: `[sudo] password for ${state.user}:\nsorry, try again.\nsudo: 1 incorrect password attempt`, exitCode: 1 };
  }
  return { output: '', exitCode: 0 };
};

export const free: CommandHandler = (_args, _state) => {
  return {
    output: '               total        used        free      shared  buff/cache   available\nMem:           7956        3456        1234         567        3266        4500\nSwap:          2048         345        1703',
    exitCode: 0,
  };
};

export const lsof: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  const list = [
    { cmd: 'sshd', pid: 203, user: 'root', fd: '3u', type: 'IPv4', device: '0xffff', size: '0t0', node: 'TCP', name: '*:22 (LISTEN)' },
    { cmd: 'nginx', pid: 156, user: 'www-data', fd: '6u', type: 'IPv4', device: '0xffff', size: '0t0', node: 'TCP', name: '*:80 (LISTEN)' },
    { cmd: 'bash', pid: 388, user: 'kali', fd: '0u', type: 'CHR', device: '136,0', size: '0t0', node: '136', name: '/dev/pts/0' },
    { cmd: 'bash', pid: 388, user: 'kali', fd: '1u', type: 'CHR', device: '136,0', size: '0t0', node: '136', name: '/dev/pts/0' },
    { cmd: 'bash', pid: 388, user: 'kali', fd: '2u', type: 'CHR', device: '136,0', size: '0t0', node: '136', name: '/dev/pts/0' },
  ];
  const filtered = targets.length > 0 ? list.filter(l => l.name.includes(targets[0]) || l.cmd === targets[0]) : list;
  const header = 'COMMAND    PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME';
  const lines = filtered.map(l =>
    `${l.cmd.padEnd(9)} ${String(l.pid).padStart(5)} ${l.user.padEnd(7)} ${l.fd.padEnd(4)} ${l.type.padEnd(5)} ${l.device.padEnd(7)} ${l.size.padEnd(8)} ${l.node.padEnd(5)} ${l.name}`
  );
  return { output: [header, ...lines].join('\n'), exitCode: 0 };
};

export const crontab: CommandHandler = (args, state) => {
  if (args[0] === '-l') {
    return {
      output: '# Edit this file to introduce tasks to be run by cron.\n#\n# m h  dom mon dow   command\n  */5 *  *   *   *    /usr/bin/check-updates\n  0   2  *   *   1    /usr/bin/security-scan\n  30  8  *   *   *    /home/kali/scripts/backup.sh\n  0   0  1   *   *    /usr/bin/logrotate',
      exitCode: 0,
    };
  }
  if (args[0] === '-e') {
    return { output: 'crontab: installing new crontab', exitCode: 0 };
  }
  if (args[0] === '-r') {
    return { output: 'crontab: removing crontab', exitCode: 0 };
  }
  return { output: 'crontab: usage: crontab [-u user] [-l | -e | -r]', exitCode: 1 };
};

const FAKE_SERVICES: Record<string, { status: string; enabled: boolean }> = {
  ssh: { status: 'active (running)', enabled: true },
  nginx: { status: 'active (running)', enabled: true },
  mysql: { status: 'active (running)', enabled: true },
  postgresql: { status: 'inactive (dead)', enabled: false },
  docker: { status: 'active (running)', enabled: true },
  cron: { status: 'active (running)', enabled: true },
  'systemd-journald': { status: 'active (running)', enabled: true },
  NetworkManager: { status: 'active (running)', enabled: true },
};

export const service: CommandHandler = (args, state) => {
  if (args.length < 2) return { output: '', error: 'Usage: service <name> <start|stop|restart|status>', exitCode: 1 };
  const name = args[0];
  const action = args[1];
  const svc = FAKE_SERVICES[name];
  if (!svc) return { output: '', error: `service: unknown service: ${name}`, exitCode: 1 };
  if (action === 'status') {
    return { output: `● ${name}.service - ${name} daemon\n   Loaded: loaded (/lib/systemd/system/${name}.service; ${svc.enabled ? 'enabled' : 'disabled'})\n   Active: ${svc.status}\n     Docs: man:${name}(8)`, exitCode: 0 };
  }
  if (action === 'start' || action === 'restart') {
    return { output: ` * ${action}ing ${name} [ OK ]`, exitCode: 0 };
  }
  if (action === 'stop') {
    return { output: ` * Stopping ${name} [ OK ]`, exitCode: 0 };
  }
  return { output: '', error: `service: unknown action: ${action}`, exitCode: 1 };
};

export const systemctl: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'Usage: systemctl [OPTIONS...] {COMMAND}', exitCode: 1 };
  if (args[0] === 'status' && args[1]) {
    const name = args[1];
    const svc = FAKE_SERVICES[name];
    if (!svc) return { output: '', error: `Unit ${name}.service could not be found.`, exitCode: 1 };
    return { output: `● ${name}.service - ${name} daemon\n   Loaded: loaded (/lib/systemd/system/${name}.service; ${svc.enabled ? 'enabled' : 'disabled'}; vendor preset: enabled)\n   Active: ${svc.status} since ${new Date().toLocaleString()}; 1 day ago\n     Docs: man:${name}(8)\n   Main PID: ${Math.floor(Math.random() * 10000 + 100)} (${name})\n    Tasks: ${Math.floor(Math.random() * 10 + 2)} (limit: 2345)\n   Memory: ${Math.floor(Math.random() * 100 + 10)}.0M\n      CPU: ${Math.floor(Math.random() * 60 + 1)}s`, exitCode: 0 };
  }
  if (args[0] === 'start' && args[1]) return { output: '', exitCode: 0 };
  if (args[0] === 'stop' && args[1]) return { output: '', exitCode: 0 };
  if (args[0] === 'restart' && args[1]) return { output: '', exitCode: 0 };
  if (args[0] === 'enable' && args[1]) return { output: `Created symlink /etc/systemd/system/multi-user.target.wants/${args[1]}.service → /lib/systemd/system/${args[1]}.service.`, exitCode: 0 };
  if (args[0] === 'disable' && args[1]) return { output: `Removed symlink /etc/systemd/system/multi-user.target.wants/${args[1]}.service.`, exitCode: 0 };
  if (args[0] === 'list-units' || args[0] === '--type=service') {
    const header = '  UNIT                      LOAD   ACTIVE SUB     DESCRIPTION';
    const lines = Object.entries(FAKE_SERVICES).map(([name, svc]) =>
      `● ${name}.service            loaded ${svc.status.padEnd(20)} ${name} daemon`
    );
    return { output: [header, ...lines].join('\n'), exitCode: 0 };
  }
  return { output: '', error: `Unknown command verb ${args[0]}.`, exitCode: 1 };
};

export const chown: CommandHandler = (args, state) => {
  if (args.length < 2) return { output: '', error: 'chown: missing operand', exitCode: 1 };
  const ownerSpec = args[0];
  const filepath = args[1];
  const node = findNode(state.root, filepath, state.cwd, state.home);
  if (!node) return { output: '', error: `chown: cannot access '${filepath}': No such file or directory`, exitCode: 1 };
  const [owner, group] = ownerSpec.includes(':') ? ownerSpec.split(':') : [ownerSpec, undefined];
  if (owner) node.owner = owner;
  if (group) node.group = group;
  return { output: '', exitCode: 0 };
};

export const umask: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '0022', exitCode: 0 };
  return { output: '', exitCode: 0 };
};

let jobCounter = 0;
const JOB_STORE: Record<number, { cmd: string; status: string }> = {};

export const jobs: CommandHandler = (_args, _state) => {
  const entries = Object.entries(JOB_STORE);
  if (entries.length === 0) return { output: 'No jobs running.', exitCode: 0 };
  return {
    output: entries.map(([id, job]) => `[${id}]  ${job.status.padEnd(12)} ${job.cmd}`).join('\n'),
    exitCode: 0,
  };
};

export const bg: CommandHandler = (args, _state) => {
  const jobId = args[0] ? parseInt(args[0].replace(/[%\[\]]/g, '')) : null;
  if (jobId !== null && JOB_STORE[jobId]) {
    JOB_STORE[jobId].status = 'running';
    return { output: `[${jobId}] ${JOB_STORE[jobId].cmd} &`, exitCode: 0 };
  }
  const lastId = Math.max(...Object.keys(JOB_STORE).map(Number), 0);
  if (lastId > 0) {
    JOB_STORE[lastId].status = 'running';
    return { output: `[${lastId}] ${JOB_STORE[lastId].cmd} &`, exitCode: 0 };
  }
  return { output: 'bg: no current job', exitCode: 1 };
};

export const fg: CommandHandler = (args, _state) => {
  const jobId = args[0] ? parseInt(args[0].replace(/[%\[\]]/g, '')) : null;
  if (jobId !== null && JOB_STORE[jobId]) {
    JOB_STORE[jobId].status = 'foreground';
    return { output: JOB_STORE[jobId].cmd, exitCode: 0 };
  }
  const lastId = Math.max(...Object.keys(JOB_STORE).map(Number), 0);
  if (lastId > 0) {
    JOB_STORE[lastId].status = 'foreground';
    return { output: JOB_STORE[lastId].cmd, exitCode: 0 };
  }
  return { output: 'fg: no current job', exitCode: 1 };
};
