import type { CommandHandler } from '../../types';
import { findNode, updateNodeAtPath } from '../filesystem';
import { executeCommandInternal } from '../commands';
import { parseFlags } from './utils';

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
  if (args.length === 0) return { output: 'Linux', exitCode: 0 };
  const { flags } = parseFlags(args);
  const parts: string[] = [];
  if (flags.has('-s') || flags.has('-a')) parts.push('Linux');
  if (flags.has('-n') || flags.has('-a')) parts.push(state.hostname);
  if (flags.has('-r') || flags.has('-a')) parts.push('6.8.0-kali1-amd64');
  if (flags.has('-v') || flags.has('-a')) parts.push('#1 SMP PREEMPT_DYNAMIC');
  if (flags.has('-m') || flags.has('-a')) parts.push('x86_64');
  if (flags.has('-p') || flags.has('-a')) parts.push('x86_64');
  if (flags.has('-i') || flags.has('-a')) parts.push('x86_64');
  if (flags.has('-o') || flags.has('-a')) parts.push('GNU/Linux');
  if (parts.length === 0) parts.push('Linux');
  return { output: parts.join(' '), exitCode: 0 };
};

export const date: CommandHandler = (args, state) => {
  const now = new Date();
  if (args.includes('-u')) {
    return { output: now.toUTCString(), exitCode: 0 };
  }
  if (args.includes('-R')) {
    const rfc2822 = now.toUTCString().replace('GMT', '+0000');
    return { output: rfc2822, exitCode: 0 };
  }
  const formatArg = args.find(a => a.startsWith('+'));
  if (formatArg) {
    const format = formatArg.slice(1);
    const pad = (n: number) => String(n).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = format
      .replace(/%Y/g, String(now.getFullYear()))
      .replace(/%m/g, pad(now.getMonth() + 1))
      .replace(/%d/g, pad(now.getDate()))
      .replace(/%H/g, pad(now.getHours()))
      .replace(/%M/g, pad(now.getMinutes()))
      .replace(/%S/g, pad(now.getSeconds()))
      .replace(/%s/g, String(Math.floor(now.getTime() / 1000)))
      .replace(/%A/g, days[now.getDay()])
      .replace(/%B/g, monthsFull[now.getMonth()])
      .replace(/%b/g, months[now.getMonth()])
      .replace(/%p/g, now.getHours() >= 12 ? 'PM' : 'AM')
      .replace(/%I/g, pad(now.getHours() % 12 || 12))
      .replace(/%Z/g, 'UTC');
    return { output: result, exitCode: 0 };
  }
  if (args.includes('-d')) {
    const idx = args.indexOf('-d');
    const dateStr = args[idx + 1];
    return { output: `date: invalid date '${dateStr}'`, exitCode: 1 };
  }
  return { output: now.toString(), exitCode: 0 };
};

export const cal: CommandHandler = (args, state) => {
  const now = new Date();
  const year = args.length > 0 ? parseInt(args[args.length - 1]) || now.getFullYear() : now.getFullYear();
  const month = args.length > 1 ? parseInt(args[0]) || now.getMonth() + 1 : now.getMonth() + 1;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  function renderMonth(y: number, m: number): string[] {
    const firstDay = new Date(y, m - 1, 1);
    const lastDay = new Date(y, m, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    const header = `    ${monthNames[m - 1]} ${y}`;
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
    return lines;
  }

  if (args.includes('-3')) {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const prevCal = renderMonth(prevYear, prevMonth);
    const curCal = renderMonth(year, month);
    const nextCal = renderMonth(nextYear, nextMonth);
    const maxLen = Math.max(prevCal.length, curCal.length, nextCal.length);
    const combined: string[] = [];
    for (let i = 0; i < maxLen; i++) {
      combined.push(
        (prevCal[i] || '').padEnd(22) +
        (curCal[i] || '').padEnd(22) +
        (nextCal[i] || '')
      );
    }
    return { output: combined.join('\n'), exitCode: 0 };
  }

  return { output: renderMonth(year, month).join('\n'), exitCode: 0 };
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
  let signal = 'TERM';
  let pidArgs = args;
  if (args[0].startsWith('-') && !args[0].match(/^-?\d+$/)) {
    signal = args[0].slice(1);
    pidArgs = args.slice(1);
  }
  if (pidArgs.length === 0) return { output: '', error: 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ...', exitCode: 2 };
  const processes: Record<number, { cmd: string; killed: boolean }> = {
    1: { cmd: 'init', killed: false },
    42: { cmd: 'systemd-journald', killed: false },
    89: { cmd: 'systemd-logind', killed: false },
    124: { cmd: 'cron', killed: false },
    156: { cmd: 'NetworkManager', killed: false },
    203: { cmd: 'sshd', killed: false },
  };
  const results: string[] = [];
  for (const pidStr of pidArgs) {
    const pid = parseInt(pidStr.replace('%', ''));
    if (isNaN(pid)) {
      results.push(`-bash: kill: (${pidStr}) - No such process`);
      continue;
    }
    if (pid === 1) {
      results.push(`-bash: kill: (${pid}) - Operation not permitted`);
      continue;
    }
    if (!processes[pid]) {
      results.push(`-bash: kill: (${pid}) - No such process`);
      continue;
    }
    results.push(``);
  }
  return { output: results.join('\n'), exitCode: 0 };
};

export const sudo: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'usage: sudo -h | -K | -k | -V\nusage: sudo -v [-AknS] [-g group] [-h host] [-p prompt] [-u user]\nusage: sudo -l [-AknS] [-g group] [-h host] [-p prompt] [-U user] [-u user]\n            [command]\nusage: sudo [-AbknS] [-r role] [-t type] [-C num] [-g group] [-h host] [-p prompt]\n            [-T timeout] [-u user] [VAR=value] [-i|-s] [<command>]\nusage: sudo -e [-AknS] [-r role] [-t type] [-C num] [-g group] [-h host] [-p prompt]\n            [-u user] file ...', exitCode: 1 };
  
  const sudoArgs = args.filter(a => !a.startsWith('-'));
  const command = sudoArgs.join(' ');
  
  if (!command) return { output: '', exitCode: 0 };

  const rootState = { ...state, isRoot: true };
  const result = executeCommandInternal(command, rootState);
  
  return {
    output: result.output,
    error: result.error,
    exitCode: result.exitCode,
    stateOverride: { isRoot: false },
  };
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
  const updated = updateNodeAtPath(state.root, filepath, state.cwd, state.home, (n) => ({
    ...n,
    owner: owner || n.owner,
    group: group || n.group,
  }));
  return { output: '', exitCode: 0, stateOverride: { root: updated } };
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
  const jobId = args[0] ? parseInt(args[0].replace(/[%[\]]/g, '')) : null;
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
  const jobId = args[0] ? parseInt(args[0].replace(/[%[\]]/g, '')) : null;
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

export const journalctl: CommandHandler = (args, state) => {
  const lines = [
    `-- Logs begin at ${new Date().toUTCString()}. --`,
    `Jul 16 10:00:01 ${state.hostname} systemd[1]: Started Daily apt activities.`,
    `Jul 16 10:00:01 ${state.hostname} CRON[1234]: (root) CMD (test -x /usr/sbin/anacron && ... )`,
    `Jul 16 10:05:12 ${state.hostname} kernel: [12345.678] audit: type=1400 msg=apparmor="ALLOWED" ...`,
    `Jul 16 10:10:00 ${state.hostname} sshd[5678]: Accepted publickey for kali from 10.0.0.1`,
    `Jul 16 10:15:30 ${state.hostname} NetworkManager[890]: <info> ...`,
    `Jul 16 10:20:00 ${state.hostname} systemd[1]: Starting Cleanup Directories...`,
    `Jul 16 10:25:00 ${state.hostname} kernel: [13000.123] audit: type=1400 msg=apparmor="STATUS" ...`,
    `Jul 16 10:30:00 ${state.hostname} CRON[9999]: (kali) CMD (cd / && run-parts --report ...)`,
    `Jul 16 10:35:00 ${state.hostname} sshd[1111]: pam_unix(sshd:session): session opened for user kali`,
  ];
  if (args.includes('-n')) {
    const idx = args.indexOf('-n');
    const n = parseInt(args[idx + 1]) || 10;
    return { output: lines.slice(-n).join('\n'), exitCode: 0 };
  }
  if (args.includes('--no-pager') || args.includes('-e')) {
    return { output: lines.join('\n'), exitCode: 0 };
  }
  return { output: lines.slice(-20).join('\n'), exitCode: 0 };
};

export const dmesg: CommandHandler = (_args, _state) => {
  return {
    output: `[    0.000000] Linux version 6.8.0-kali1-amd64 (devel@kali.org) (gcc-13 (Debian 13.2.0-5) 13.2.0)
[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.8.0-kali1-amd64
[    0.000000] BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable
[    0.000000] tsc: Fast TSC calibration using PMI
[    0.000000] e820: update [mem 0x000000000009fbff-0x000000000009ffff] usable ==> reserved
[    1.234567] audit: type=1400 audit(1234567890.123:1): apparmor="STATUS" profile="unconfined"
[    2.345678] EXT4-fs (sda1): mounted filesystem with ordered data mode
[    3.456789] systemd[1]: Starting Journal Service...
[    4.567890] input: AT Translated Set 2 keyboard as /devices/platform/i8042/serio0/input/input0`,
    exitCode: 0,
  };
};

export const who: CommandHandler = (_args, _state) => {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return {
    output: `kali     pts/0        ${now.toISOString().split('T')[0]} ${time} (10.0.0.1)`,
    exitCode: 0,
  };
};

export const wCmd: CommandHandler = (_args, _state) => {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return {
    output: ` ${time} up 2 days, 14:23,  1 user,  load average: 0.12, 0.08, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
kali     pts/0    10.0.0.1         ${time}   0.00s  0.12s  0.01s w`,
    exitCode: 0,
  };
};

export const last: CommandHandler = (_args, _state) => {
  return {
    output: `kali     pts/0        10.0.0.1    Wed Jul 16 10:00   still logged in
kali     pts/0        10.0.0.1    Tue Jul 15 09:30 - 18:45  (09:15)
reboot   system boot  6.8.0-kali1    Wed Jul 16 09:00   still running

wtmp begins Sat Jul  1 00:00:01 2023`,
    exitCode: 0,
  };
};

export const groups: CommandHandler = (args, state) => {
  const user = args[0] || state.user;
  return { output: `${user} : ${user} sudo cdrom floppy dip video plugdev netdev`, exitCode: 0 };
};

export const useradd: CommandHandler = (args, state) => {
  const { positional } = parseFlags(args);
  if (positional.length === 0) return { output: '', error: 'useradd: missing operand', exitCode: 1 };
  return { output: '', exitCode: 0 };
};

export const usermod: CommandHandler = (args, state) => {
  const { positional } = parseFlags(args);
  if (positional.length < 2) return { output: '', error: 'usermod: option -aG requires a group and a user', exitCode: 1 };
  return { output: '', exitCode: 0 };
};

export const userdel: CommandHandler = (args, state) => {
  const { positional } = parseFlags(args);
  if (positional.length === 0) return { output: '', error: 'userdel: missing operand', exitCode: 1 };
  return { output: `userdel: user '${positional[0]}' does not exist`, exitCode: 6 };
};

export const passwd: CommandHandler = (args, state) => {
  const user = args[0] || state.user;
  return { output: `passwd: password updated successfully`, exitCode: 0 };
};
