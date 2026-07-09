import type { CommandHandler } from '../../types';

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
    { pid: 387, ppid: 203, cpu: 0.0, mem: 0.5, cmd: 'sshd: qyvora-student', user: 'root' },
    { pid: 388, ppid: 387, cpu: 0.1, mem: 0.6, cmd: 'bash', user: 'qyvora-student' },
    { pid: 391, ppid: 388, cpu: 0.0, mem: 0.3, cmd: 'ps', user: 'qyvora-student' },
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
