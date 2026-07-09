import type { CommandHandler } from '../../types';
import { findNode } from '../filesystem';

export const ping: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  const countFlag = args.indexOf('-c');
  const count = countFlag !== -1 ? parseInt(args[countFlag + 1]) || 4 : 4;
  if (targets.length === 0) return { output: '', error: 'ping: usage error: Destination address required', exitCode: 2 };
  const target = targets[0];
  const ip = target === 'localhost' || target === '127.0.0.1' ? '127.0.0.1'
    : target === state.hostname ? '10.0.0.42'
    : `${Math.floor(Math.random() * 223 + 1)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  const lines: string[] = [`PING ${target} (${ip}) 56(84) bytes of data.`];
  for (let i = 0; i < count; i++) {
    const ms = (Math.random() * 80 + 10).toFixed(2);
    const ttl = Math.floor(Math.random() * 30 + 55);
    lines.push(`64 bytes from ${ip}: icmp_seq=${i + 1} ttl=${ttl} time=${ms} ms`);
  }
  const rttMin = '12.34'; const rttAvg = '25.67'; const rttMax = '89.01';
  lines.push('');
  lines.push(`--- ${target} ping statistics ---`);
  lines.push(`${count} packets transmitted, ${count} received, 0% packet loss, time ${Math.floor(Math.random() * 1000 + 500)}ms`);
  lines.push(`rtt min/avg/max/mdev = ${rttMin}/${rttAvg}/${rttMax}/${(parseFloat(rttMax) - parseFloat(rttMin)).toFixed(2)} ms`);
  return { output: lines.join('\n'), exitCode: 0 };
};

export const curl: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-') && !a.startsWith('--'));
  const silent = args.includes('-s');
  const methodIdx = args.indexOf('-X');
  const method = methodIdx !== -1 ? args[methodIdx + 1] : 'GET';
  const dataIdx = args.indexOf('-d') !== -1 ? args.indexOf('-d') : args.indexOf('--data');
  const data = dataIdx !== -1 ? args[dataIdx + 1] : '';
  if (targets.length === 0) return { output: '', error: 'curl: try \'curl --help\' or \'curl --manual\' for more information', exitCode: 2 };
  const url = targets[0];
  if (method === 'POST' && data) {
    const parsed = JSON.parse(data.replace(/'/g, '"'));
    return {
      output: JSON.stringify({ success: true, data: parsed, id: Math.floor(Math.random() * 10000) }, null, 2),
      exitCode: 0,
    };
  }
  if (url.includes('api.github.com') || url.includes('github.com')) {
    return {
      output: JSON.stringify({
        current_user_url: 'https://api.github.com/user',
        current_user_authorizations_html_url: 'https://github.com/settings/connections/applications{/client_id}',
        authorizations_url: 'https://api.github.com/authorizations',
        code_search_url: 'https://api.github.com/search/code?q={query}{&page,per_page,sort,order}',
        repository_url: 'https://api.github.com/repos/{owner}/{repo}',
      }, null, 2),
      exitCode: 0,
    };
  }
  if (url.includes('ifconfig.me') || url.includes('api.ipify.org')) {
    return { output: `${Math.floor(Math.random() * 223 + 1)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`, exitCode: 0 };
  }
  if (url.includes('http://localhost') || url.includes('http://127.0.0.1')) {
    return {
      output: silent ? '' : `<html>\n<body>\n  <h1>QYVORA Local Server</h1>\n  <p>Status: Running</p>\n  <p>Port: ${url.split(':').pop()?.replace(/\D/g, '') || '80'}</p>\n</body>\n</html>`,
      exitCode: 0,
    };
  }
  return {
    output: silent ? '' : `<html>\n<head><title>${url.replace(/^https?:\/\//, '').split('/')[0]}</title></head>\n<body>\n  <h1>It works!</h1>\n  <p>Connection established successfully.</p>\n  <p>Server: nginx/1.24.0</p>\n  <p>Response: 200 OK</p>\n</body>\n</html>`,
    exitCode: 0,
  };
};

export const nmap: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  const verbose = args.includes('-v') || args.includes('-vv');
  const serviceScan = args.includes('-sV');
  const osDetect = args.includes('-O');
  const allPorts = args.includes('-p-');
  if (targets.length === 0) return { output: '', error: 'nmap: no target specified. Try --help for help.', exitCode: 1 };
  const target = targets[0];
  const openPorts = allPorts
    ? [
        { port: 22, service: 'ssh', version: 'OpenSSH 8.4p1 Debian 5' },
        { port: 80, service: 'http', version: 'nginx 1.24.0' },
        { port: 443, service: 'https', version: 'nginx 1.24.0' },
        { port: 8080, service: 'http-proxy', version: '' },
        { port: 3306, service: 'mysql', version: 'MySQL 8.0.35' },
        { port: 6379, service: 'redis', version: 'Redis 7.2.3' },
      ]
    : [
        { port: 22, service: 'ssh', version: 'OpenSSH 8.4p1 Debian 5' },
        { port: 80, service: 'http', version: 'nginx 1.24.0' },
        { port: 443, service: 'https', version: 'nginx 1.24.0' },
      ];
  const randomIp = `${Math.floor(Math.random() * 223 + 1)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  const lines: string[] = [
    '',
    `Starting Nmap 7.94SVN ( https://nmap.org ) at ${new Date().toLocaleString()}`,
    verbose ? 'NSE: Loaded 155 scripts for scanning.' : '',
    `Initiating Ping Scan at ${new Date().toLocaleTimeString()}`,
    `Completed Ping Scan at ${new Date().toLocaleTimeString()}, ${(Math.random() * 2 + 0.1).toFixed(2)}s elapsed`,
    `Initiating Parallel DNS resolution of ${Math.floor(Math.random() * 5) + 1} host${Math.floor(Math.random() * 5) + 1 === 1 ? '' : 's'}.`,
    verbose ? `DNS resolution of ${target} completed in ${(Math.random() * 0.5 + 0.1).toFixed(2)}s` : '',
    `Initiating SYN Stealth Scan at ${new Date().toLocaleTimeString()}`,
    ...(verbose ? [
      `Scanning ${target} [${allPorts ? '65535' : '1000'} ports]`,
      `Discovered open port ${openPorts[0].port}/${openPorts[0].service} on ${randomIp}`,
      `Discovered open port ${openPorts[1].port}/${openPorts[1].service} on ${randomIp}`,
      `Discovered open port ${openPorts[2].port}/${openPorts[2].service} on ${randomIp}`,
    ] : []),
    `Completed SYN Stealth Scan at ${new Date().toLocaleTimeString()}, ${(Math.random() * 10 + 2).toFixed(2)}s elapsed`,
    ...(serviceScan ? [
      `Initiating Service scan at ${new Date().toLocaleTimeString()}`,
      `Completed Service scan at ${new Date().toLocaleTimeString()}, ${(Math.random() * 20 + 5).toFixed(2)}s elapsed`,
    ] : []),
    ...(osDetect ? ['Initiating OS detection', 'Retrying OS detection', 'Retrying OS detection'] : []),
    '',
    `Nmap scan report for ${target} (${randomIp})`,
    `Host is up (${(Math.random() * 0.1 + 0.01).toFixed(3)}s latency).`,
    `Not shown: ${allPorts ? '65529' : '997'} closed tcp ports (reset)`,
    'PORT     STATE    SERVICE    VERSION',
    ...openPorts.map(p => `${String(p.port).padStart(5)}/${'tcp'.padEnd(4)} open     ${p.service.padEnd(10)} ${p.version}`),
    ...(serviceScan ? ['Service detection performed. Please report any incorrect results at https://nmap.org/submit/'] : []),
    ...(osDetect ? ['Device type: general purpose', 'Running: Linux 5.X|6.X', 'OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:linux:linux_kernel:6', 'OS details: Linux 5.10 - 6.5'] : []),
    `Nmap done: 1 IP address (1 host up) scanned in ${(Math.random() * 30 + 10).toFixed(2)} seconds`,
  ];
  return { output: lines.filter(Boolean).join('\n'), exitCode: 0, streamLines: lines.filter(Boolean) };
};

export const netstat: CommandHandler = (args, state) => {
  const listening = args.includes('-l') || args.includes('-ln') || args.includes('-tln') || args.includes('-tuln');
  const numeric = args.includes('-n') || args.includes('-ln') || args.includes('-tln') || args.includes('-tuln');
  const tcp = args.includes('-t') || args.includes('-tln') || args.includes('-tuln');
  const udp = args.includes('-u') || args.includes('-tuln');
  const header = 'Active Internet connections (only servers)';
  const subHeader = 'Proto Recv-Q Send-Q Local Address           Foreign Address         State';
  const connections: { proto: string; recv: number; send: number; local: string; foreign: string; state: string }[] = [];
  if (tcp || (!tcp && !udp)) {
    connections.push(
      { proto: 'tcp', recv: 0, send: 0, local: `${numeric ? '0.0.0.0' : 'localhost'}:22`, foreign: '0.0.0.0:*', state: listening ? 'LISTEN' : 'ESTABLISHED' },
      { proto: 'tcp', recv: 0, send: 0, local: `${numeric ? '0.0.0.0' : 'localhost'}:80`, foreign: '0.0.0.0:*', state: listening ? 'LISTEN' : 'ESTABLISHED' },
      { proto: 'tcp', recv: 0, send: 0, local: `${numeric ? '127.0.0.1' : 'localhost'}:5432`, foreign: '0.0.0.0:*', state: listening ? 'LISTEN' : 'ESTABLISHED' },
      { proto: 'tcp6', recv: 0, send: 0, local: `[::]:22`, foreign: '[::]:*', state: listening ? 'LISTEN' : 'ESTABLISHED' },
      { proto: 'tcp6', recv: 0, send: 0, local: `[::]:80`, foreign: '[::]:*', state: listening ? 'LISTEN' : 'ESTABLISHED' },
    );
  }
  if (udp || (!tcp && !udp)) {
    connections.push(
      { proto: 'udp', recv: 0, send: 0, local: '0.0.0.0:68', foreign: '0.0.0.0:*', state: '' },
      { proto: 'udp', recv: 0, send: 0, local: '0.0.0.0:5353', foreign: '0.0.0.0:*', state: '' },
    );
  }
  const lines = [header, '', subHeader];
  connections.forEach(c => {
    const state = c.state ? c.state.padStart(11) : '';
    lines.push(`${c.proto.padEnd(6)} ${String(c.recv).padStart(6)} ${String(c.send).padStart(6)} ${c.local.padEnd(22)} ${c.foreign.padEnd(22)} ${state}`);
  });
  if (args.includes('-i')) {
    lines.push('', 'Kernel Interface table', 'Iface      MTU    RX-OK RX-ERR RX-DRP RX-OVR    TX-OK TX-ERR TX-DRP TX-OVR Flg');
    lines.push('eth0     1500  123456      0      0      0    98765      0      0      0 BMRU');
    lines.push('lo      65536   98765      0      0      0    98765      0      0      0 LRU');
  }
  return { output: lines.join('\n'), exitCode: 0 };
};

export const dig: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('+'));
  const short = args.includes('+short');
  if (targets.length === 0) return { output: '', error: 'dig: no query specified', exitCode: 9 };
  const domain = targets[0];
  const type = targets[1] || 'A';
  if (domain === 'localhost' || domain === '127.0.0.1') {
    return { output: short ? '127.0.0.1' : `; <<>> DiG 9.18.24 <<>> localhost\n;; global options: +cmd\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: ${Math.floor(Math.random() * 60000)}\n;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1\n\n;; QUESTION SECTION:\n;localhost.\t\t\tIN\tA\n\n;; ANSWER SECTION:\nlocalhost.\t\t86400\tIN\tA\t127.0.0.1\n\n;; Query time: ${Math.floor(Math.random() * 50 + 1)} msec\n;; SERVER: 8.8.8.8#53(8.8.8.8)\n;; WHEN: ${new Date().toString()}\n;; MSG SIZE  rcvd: ${Math.floor(Math.random() * 50 + 40)}`, exitCode: 0 };
  }
  const ip = `${Math.floor(Math.random() * 223 + 1)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  if (short) return { output: ip, exitCode: 0 };
  return {
    output: `; <<>> DiG 9.18.24-1-Debian <<>> ${domain}\n;; global options: +cmd\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: ${Math.floor(Math.random() * 60000)}\n;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1\n\n;; QUESTION SECTION:\n;${domain}.\t\t\tIN\t${type}\n\n;; ANSWER SECTION:\n${domain}.\t\t86400\tIN\t${type}\t${ip}\n\n;; Query time: ${Math.floor(Math.random() * 100 + 10)} msec\n;; SERVER: 8.8.8.8#53(8.8.8.8)\n;; WHEN: ${new Date().toString()}\n;; MSG SIZE  rcvd: ${Math.floor(Math.random() * 100 + 50)}`,
    exitCode: 0,
  };
};

export const whois: CommandHandler = (args, state) => {
  if (args.length === 0) return { output: '', error: 'whois: no query specified', exitCode: 1 };
  const domain = args[0];
  const tld = domain.split('.').pop() || 'com';
  return {
    output: `Domain Name: ${domain}\nRegistry Domain ID: ${Math.floor(Math.random() * 1000000000)}_DOMAIN_COM\nRegistrar WHOIS Server: whois.${tld == 'com' ? 'verisign-grs.com' : 'registry.' + tld}\nRegistrar URL: https://www.namecheap.com\nUpdated Date: ${new Date(Date.now() - Math.floor(Math.random() * 365 * 86400000)).toISOString()}\nCreation Date: ${new Date(Date.now() - Math.floor(Math.random() * 5 * 365 * 86400000)).toISOString()}\nRegistry Expiry Date: ${new Date(Date.now() + Math.floor(Math.random() * 365 * 86400000)).toISOString()}\nName Server: NS1.DIGITALOCEAN.COM\nName Server: NS2.DIGITALOCEAN.COM\nDNSSEC: unsigned\n\n>>> Last update of WHOIS database: ${new Date().toISOString()} <<<`,
    exitCode: 0,
  };
};

export const ss: CommandHandler = (args, state) => {
  const listening = args.includes('-l') || args.includes('-tln');
  const tcp = args.includes('-t') || args.includes('-tln');
  const udp = args.includes('-u') || args.includes('-uln');
  const numeric = args.includes('-n') || args.includes('-tln') || args.includes('-uln');
  const all = args.includes('-a');
  const lines: string[] = ['State        Recv-Q        Send-Q               Local Address:Port               Peer Address:Port        Process'];
  const states = listening ? ['LISTEN'] : (all ? ['LISTEN', 'ESTAB', 'TIME-WAIT'] : ['ESTAB']);
  if (tcp || (!tcp && !udp)) {
    states.forEach(s => {
      lines.push(`${s.padEnd(12)} 0             0                      ${numeric ? '0.0.0.0' : 'localhost'}:22               ${numeric ? '0.0.0.0' : 'localhost'}:*              users:(("sshd",pid=203,fd=3))`);
      lines.push(`${s.padEnd(12)} 0             0                      ${numeric ? '0.0.0.0' : 'localhost'}:80               ${numeric ? '0.0.0.0' : 'localhost'}:*              users:(("nginx",pid=156,fd=6))`);
      if (all) {
        lines.push(`${s.padEnd(12)} 0             0                       ${numeric ? '0.0.0.0' : 'localhost'}:5432             ${numeric ? '0.0.0.0' : 'localhost'}:*              users:(("postgres",pid=203,fd=7))`);
      }
    });
    if (!listening) {
      lines.push(`ESTAB       0             0                       ${numeric ? '10.0.0.42' : 'kali'}:22          ${numeric ? '192.168.1.100' : 'student.home'}:45123              users:(("sshd",pid=387,fd=4))`);
    }
  }
  if (udp) {
    lines.push(`UNCONN      0             0                     0.0.0.0:68              0.0.0.0:*`);
  }
  return { output: lines.join('\n'), exitCode: 0 };
};

export const traceroute: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length === 0) return { output: '', error: 'traceroute: missing host', exitCode: 1 };
  const target = targets[0];
  const hops = [
    { hop: 1, ip: '192.168.1.1', rtt: '1.234 ms', host: 'router.local' },
    { hop: 2, ip: '10.0.0.1', rtt: '3.456 ms', host: 'gateway.isp.net' },
    { hop: 3, ip: '72.14.237.1', rtt: '12.345 ms', host: 'core1.isp.net' },
    { hop: 4, ip: '216.58.192.1', rtt: '23.456 ms', host: 'edge01.google.com' },
    { hop: 5, ip: '142.250.64.1', rtt: '24.567 ms', host: 'google-1.google.com' },
    { hop: 6, ip: '142.250.64.200', rtt: '25.678 ms', host: target },
  ];
  const lines = [`traceroute to ${target} (${hops[hops.length - 1].ip}), ${hops.length} hops max, 60 byte packets`];
  hops.forEach(h => {
    lines.push(` ${h.hop}  ${h.host} (${h.ip})  ${h.rtt}  ${(parseFloat(h.rtt) * 0.9).toFixed(3)} ms  ${(parseFloat(h.rtt) * 1.1).toFixed(3)} ms`);
  });
  return { output: lines.join('\n'), exitCode: 0 };
};

export const arp: CommandHandler = (_args, _state) => {
  return {
    output: 'Address                  HWtype  HWaddress           Flags Mask            Iface\n192.168.1.1              ether   00:50:56:00:00:01   C                     eth0\n10.0.0.1                 ether   00:50:56:00:00:02   C                     eth0\n172.16.0.1               ether   00:50:56:00:00:03   C                     eth0',
    exitCode: 0,
  };
};

export const ipRoute: CommandHandler = (_args, _state) => {
  return {
    output: 'default via 192.168.1.1 dev eth0 proto dhcp metric 100\n10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.42 metric 100\n172.16.0.0/24 dev eth1 proto kernel scope link src 172.16.0.42 metric 101\n192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100',
    exitCode: 0,
  };
};

export const wget: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length === 0) return { output: '', error: 'wget: missing URL', exitCode: 1 };
  const url = targets[0];
  const filename = url.split('/').pop() || 'index.html';
  const size = Math.floor(Math.random() * 5000 + 500);
  return {
    output: `--${new Date().toISOString()}--  ${url}\nResolving ${url.replace(/^https?:\/\//, '').split('/')[0]}... ${Math.floor(Math.random() * 223 + 1)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}\nConnecting to ${url.replace(/^https?:\/\//, '').split('/')[0]}:${url.startsWith('https') ? '443' : '80'}... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: ${size} [${url.includes('.html') ? 'text/html' : 'application/octet-stream'}]\nSaving to: '${filename}'\n\n${filename}              100%[=================================================================================================================>]  ${(size / 1024).toFixed(1)}K  --.-KB/s    in 0s\n\n${new Date().toISOString()} (${(size / 1024 / 0.5).toFixed(1)} MB/s) - '${filename}' saved [${size}/${size}]`,
    exitCode: 0,
  };
};

export const scp: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length < 2) return { output: '', error: 'scp: missing destination', exitCode: 1 };
  const src = targets[0];
  const dest = targets[1];
  if (src.includes('@') || dest.includes('@')) {
    return {
      output: `The authenticity of host '${dest.includes('@') ? dest.split('@')[1]?.split(':')[0] || 'remote' : src.split('@')[1]?.split(':')[0] || 'remote'}' can't be established.\nED25519 key fingerprint is SHA256:${Math.random().toString(36).slice(2, 10)}...\nAre you sure you want to continue connecting (yes/no/[fingerprint])? yes\nWarning: Permanently added '${dest.includes('@') ? dest.split('@')[1]?.split(':')[0] || 'remote' : src.split('@')[1]?.split(':')[0] || 'remote'}' (ED25519) to the list of known hosts.\nkali@remote's password: \n${src.includes(':') ? src.split(':')[1] : src}                                                   100%  ${Math.floor(Math.random() * 500 + 50)}KB  ${Math.floor(Math.random() * 10 + 1)}.${Math.floor(Math.random() * 9)}MB/s   00:00`,
      exitCode: 0,
    };
  }
  return { output: `scp: ${src}: No such file or directory`, exitCode: 1 };
};

export const ssh: CommandHandler = (args, state) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length === 0) return { output: '', error: 'usage: ssh [-v] [-p port] [-l login] [user@]hostname [command]', exitCode: 1 };
  const target = targets[0];
  const verbose = args.includes('-v');
  const lines: string[] = [];
  if (verbose) {
    lines.push('OpenSSH_9.3p1 Debian-1, OpenSSL 3.0.11 19 Sep 2023');
    lines.push('debug1: Reading configuration data /etc/ssh/ssh_config');
    lines.push('debug1: Connecting to ' + target + ' [' + Math.floor(Math.random() * 223 + 1) + '.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256) + '] port 22.');
    lines.push('debug1: Connection established.');
    lines.push('debug1: identity file /home/kali/.ssh/id_rsa type 0');
    lines.push('debug1: Local version string SSH-2.0-OpenSSH_9.3p1 Debian-1');
  }
  lines.push('The authenticity of host \'' + target + ' (' + Math.floor(Math.random() * 223 + 1) + '.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256) + ')\' can\'t be established.');
  lines.push('ED25519 key fingerprint is SHA256:' + Math.random().toString(36).slice(2, 10) + '...');
  lines.push('This host key is known by the following other names/addresses:');
  lines.push('    ~/.ssh/known_hosts contains a matching key');
  if (!verbose) lines.push('Are you sure you want to continue connecting (yes/no/[fingerprint])?');
  lines.push('Warning: Permanently added \'' + target + '\' (ED25519) to the list of known hosts.');
  lines.push('kali@' + target.split('@').pop() + '\'s password:');
  lines.push('');
  lines.push('Connection closed by remote host.');
  return { output: lines.join('\n'), exitCode: 0 };
};
