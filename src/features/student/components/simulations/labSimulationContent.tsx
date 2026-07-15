import React from 'react';
import type { SimulationType } from './types';
import type {
  BrowserPage, SimEmail, SimPacket, SimFile, SimLogSource, SimLogEntry,
  HttpRequest, HttpResponse, SqlTable, ApiEndpoint, PasswordHash,
  TopologyNode, TopologyLink, OsintModule, TimelineEvent,
} from './types';

export type SimulationContent = { type: SimulationType; content: React.ReactNode };

// ── SQL Injection Lab ────────────────────────────────────────────────────────
export function createSqlInjectionSimulations(
  tables: SqlTable[],
  targetUrl: string,
): SimulationContent[] {
  return [
    {
      type: 'sql-console',
      content: React.createElement(
        // Lazy import to avoid circular deps — inline the component
        (() => {
          const { SqlConsole } = require('./SqlConsole');
          return SqlConsole;
        })(),
        {
          tables,
          predefinedQueries: [
            { query: `SELECT * FROM ${tables[0]?.name || 'users'} LIMIT 10;`, description: 'View all records' },
            { query: `SELECT column_name FROM information_schema.columns WHERE table_name='${tables[0]?.name || 'users'}';`, description: 'Enumerate columns' },
            { query: `' UNION SELECT NULL,NULL,NULL--`, description: 'Test UNION injection' },
          ],
        },
      ),
    },
    {
      type: 'browser',
      content: React.createElement(
        (() => {
          const { BrowserSimulation } = require('./BrowserSimulation');
          return BrowserSimulation;
        })(),
        {
          pages: [
            {
              url: targetUrl,
              title: 'Target Application',
              html: `<html><head><title>Target</title></head><body><h1>Login Form</h1><form method="POST"><input name="username" placeholder="Username"/><input name="password" type="password" placeholder="Password"/><button type="submit">Login</button></form><p class="hint" style="display:none">Hint: Try SQL injection in the username field</p></body></html>`,
              headers: { 'Content-Type': 'text/html', 'Server': 'nginx/1.24.0', 'X-Powered-By': 'PHP/8.2' },
              cookies: [],
            },
            {
              url: `${targetUrl}?error=1`,
              title: 'Error Page',
              html: `<html><head><title>Error</title></head><body><h1>Login Failed</h1><pre>SQL syntax error near '' LIMIT 1' at line 1</pre><p>Debug mode is enabled.</p></body></html>`,
              headers: { 'Content-Type': 'text/html', 'Server': 'nginx/1.24.0' },
              cookies: [],
            },
          ],
          defaultUrl: targetUrl,
        },
      ),
    },
  ];
}

// ── Web Exploitation Lab ─────────────────────────────────────────────────────
export function createWebExploitationSimulations(
  baseUrl: string,
): SimulationContent[] {
  return [
    {
      type: 'browser',
      content: React.createElement(
        (() => {
          const { BrowserSimulation } = require('./BrowserSimulation');
          return BrowserSimulation;
        })(),
        {
          pages: [
            {
              url: baseUrl,
              title: 'Vulnerable Web App',
              html: `<html><head><title>Corp Portal</title></head><body><h1>QYVORA Corp Portal</h1><nav><a href="${baseUrl}/login">Login</a> <a href="${baseUrl}/search">Search</a> <a href="${baseUrl}/admin">Admin</a></nav><p>Welcome to the corporate portal.</p></body></html>`,
              headers: { 'Content-Type': 'text/html', 'Server': 'Apache/2.4.52', 'X-Powered-By': 'Express' },
              cookies: [],
            },
            {
              url: `${baseUrl}/login`,
              title: 'Login',
              html: `<html><head><title>Login</title></head><body><h1>Login</h1><form method="POST"><input name="user"/><input name="pass" type="password"/><button>Login</button></form><p class="debug" style="color:red;display:none">DEBUG: SELECT * FROM users WHERE user='...' AND pass='...'</p></body></html>`,
              headers: { 'Content-Type': 'text/html' },
              cookies: [],
            },
            {
              url: `${baseUrl}/search`,
              title: 'Search',
              html: `<html><head><title>Search</title></head><body><h1>Search Employees</h1><input id="q" placeholder="Search..."/><div id="results"></div><script>document.getElementById('q').addEventListener('keyup',function(){document.getElementById('results').innerHTML='<p>Results for: '+this.value+'</p>';});</script></body></html>`,
              headers: { 'Content-Type': 'text/html' },
              cookies: [],
              hiddenElements: [{ type: 'comment', content: 'TODO: Sanitize user input', location: 'search.html' }],
            },
          ],
          defaultUrl: baseUrl,
        },
      ),
    },
    {
      type: 'http-inspector',
      content: React.createElement(
        (() => {
          const { HttpInspector } = require('./HttpInspector');
          return HttpInspector;
        })(),
        {
          requests: [
            makeHttpRequest('GET', `${baseUrl}/`, 200, 'text/html', '<html>...</html>'),
            makeHttpRequest('POST', `${baseUrl}/login`, 302, 'text/html', 'Redirect to /dashboard'),
            makeHttpRequest('GET', `${baseUrl}/admin`, 403, 'text/html', 'Forbidden'),
            makeHttpRequest('GET', `${baseUrl}/api/users`, 200, 'application/json', '{"users":[{"id":1,"name":"admin","role":"admin"}]}'),
          ],
        },
      ),
    },
  ];
}

// ── Phishing Lab ─────────────────────────────────────────────────────────────
export function createPhishingSimulations(
  emails: Array<{
    id: string; from: string; fromName: string; to: string; subject: string;
    body: string; isPhishing: boolean;
    indicators?: Array<{ type: string; description: string; severity: string; location: string }>;
    receivedAt: string;
    headers?: Array<{ key: string; value: string }>;
    attachments?: Array<{ name: string; size: string; mimeType: string }>;
    links?: Array<{ display: string; actual: string }>;
  }>,
): SimulationContent[] {
  const simEmails: SimEmail[] = emails.map(e => ({
    id: e.id,
    from: e.from,
    fromName: e.fromName,
    to: e.to,
    subject: e.subject,
    body: e.body,
    isPhishing: e.isPhishing,
    indicators: (e.indicators || []).map(ind => ({
      type: ind.type,
      description: ind.description,
      severity: ind.severity as 'low' | 'medium' | 'high',
      location: ind.location,
    })),
    receivedAt: e.receivedAt,
    headers: e.headers || [
      { key: 'From', value: `${e.fromName} <${e.from}>` },
      { key: 'To', value: e.to },
      { key: 'Subject', value: e.subject },
      { key: 'Date', value: e.receivedAt },
      { key: 'Message-ID', value: `<${e.id}@mail.qyvora.local>` },
    ],
    attachments: e.attachments,
  }));

  return [
    {
      type: 'email-client',
      content: React.createElement(
        (() => {
          const { EmailClient } = require('./EmailClient');
          return EmailClient;
        })(),
        { emails: simEmails },
      ),
    },
  ];
}

// ── Password Cracking Lab ────────────────────────────────────────────────────
export function createPasswordSimulations(
  hashContent: string,
  hashType: string,
  wordlist: string[],
): SimulationContent[] {
  const hashes: PasswordHash[] = hashContent.split('\n').filter(Boolean).map(h => ({
    hash: h.trim(),
    algorithm: hashType,
  }));

  return [
    {
      type: 'password-cracker',
      content: React.createElement(
        (() => {
          const { PasswordCracker } = require('./PasswordCracker');
          return PasswordCracker;
        })(),
        { hashes, wordlist },
      ),
    },
    {
      type: 'file-explorer',
      content: React.createElement(
        (() => {
          const { FileExplorer } = require('./FileExplorer');
          return FileExplorer;
        })(),
        {
          files: [
            { name: 'hashes.txt', type: 'file' as const, size: hashContent.length, modified: '2024-01-15', permissions: '-rw-r--r--', content: hashContent, mimeType: 'text/plain' },
            { name: 'rockyou.txt', type: 'file' as const, size: 139920860, modified: '2023-10-01', permissions: '-rw-r--r--', mimeType: 'text/plain' },
            { name: 'shadow.bak', type: 'file' as const, size: 1247, modified: '2024-01-10', permissions: '-rw-r-----', content: 'root:$6$rounds=656000$...:19000:0:99999:7:::\nkali:$6$rounds=656000$...:19000:0:99999:7:::', mimeType: 'text/plain' },
          ],
        },
      ),
    },
  ];
}

// ── OSINT Lab ────────────────────────────────────────────────────────────────
export function createOsintSimulations(
  targetName: string,
  skills: string[],
): SimulationContent[] {
  const modules: OsintModule[] = [
    { id: 'whois', type: 'whois', label: 'WHOIS Lookup', query: targetName.toLowerCase().replace(/\s/g, '') + '.com', result: `Domain: ${targetName.toLowerCase().replace(/\s/g, '')}.com\nRegistrar: Namecheap\nCreated: 2019-03-15\nExpires: 2025-03-15\nName Servers: ns1.digitalocean.com, ns2.digitalocean.com` },
    { id: 'dns', type: 'dns', label: 'DNS Records', query: targetName.toLowerCase().replace(/\s/g, '') + '.com', result: `A: 104.21.45.67\nMX: mail.${targetName.toLowerCase().replace(/\s/g, '')}.com\nTXT: "v=spf1 include:_spf.google.com ~all"\nNS: ns1.digitalocean.com` },
    { id: 'metadata', type: 'metadata', label: 'Metadata Analysis', result: 'No metadata available. Upload a file or provide an image URL.' },
    { id: 'social', type: 'social', label: 'Social Profiles', query: targetName, result: `LinkedIn: ${targetName} Corp (500+ employees)\nTwitter: @${targetName.toLowerCase().replace(/\s/g, '')}\nGitHub: github.com/${targetName.toLowerCase().replace(/\s/g, '')}` },
    { id: 'search', type: 'search', label: 'Web Search', query: `"${targetName}" site:linkedin.com`, result: `Found 12 results for "${targetName}" on LinkedIn` },
  ];

  return [
    {
      type: 'osint-dashboard',
      content: React.createElement(
        (() => {
          const { OsintDashboard } = require('./OsintDashboard');
          return OsintDashboard;
        })(),
        { modules },
      ),
    },
    {
      type: 'browser',
      content: React.createElement(
        (() => {
          const { BrowserSimulation } = require('./BrowserSimulation');
          return BrowserSimulation;
        })(),
        {
          pages: [
            {
              url: `https://www.${targetName.toLowerCase().replace(/\s/g, '')}.com`,
              title: `${targetName} - Official Website`,
              html: `<html><head><title>${targetName}</title></head><body><h1>${targetName}</h1><p>Corporate website</p><a href="/about">About</a> <a href="/careers">Careers</a> <a href="/contact">Contact</a></body></html>`,
              headers: { 'Content-Type': 'text/html', 'Server': 'cloudflare' },
              cookies: [],
            },
          ],
          defaultUrl: `https://www.${targetName.toLowerCase().replace(/\s/g, '')}.com`,
        },
      ),
    },
  ];
}

// ── Traffic Analysis Lab ─────────────────────────────────────────────────────
export function createTrafficSimulations(
  packets: Array<{
    number: number; time: string; source: string; destination: string;
    protocol: string; length: number; info: string; flags?: string;
    payload?: string;
  }>,
): SimulationContent[] {
  const simPackets: SimPacket[] = packets.map(p => ({
    number: p.number,
    time: p.time,
    source: p.source,
    destination: p.destination,
    protocol: p.protocol,
    length: p.length,
    info: p.info,
    flags: p.flags,
    payload: p.payload,
  }));

  return [
    {
      type: 'packet-viewer',
      content: React.createElement(
        (() => {
          const { PacketViewer } = require('./PacketViewer');
          return PacketViewer;
        })(),
        { packets: simPackets },
      ),
    },
    {
      type: 'log-viewer',
      content: React.createElement(
        (() => {
          const { LogViewer } = require('./LogViewer');
          return LogViewer;
        })(),
        {
          sources: [
            {
              id: 'capture',
              label: 'Packet Capture',
              entries: packets.slice(0, 20).map(p => ({
                timestamp: p.time,
                level: 'info' as const,
                source: p.source,
                message: `${p.protocol} ${p.info}`,
              })),
            },
          ],
        },
      ),
    },
  ];
}

// ── Proxy Lab ────────────────────────────────────────────────────────────────
export function createProxySimulations(
  requests: Array<{
    id: string; method: string; url: string; path: string;
    headers: Record<string, string>; body?: string;
    response: { statusCode: number; headers: Record<string, string>; body: string };
  }>,
): SimulationContent[] {
  const simRequests: HttpRequest[] = requests.map(r => ({
    id: r.id,
    method: r.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: r.url,
    headers: r.headers,
    body: r.body,
    response: {
      statusCode: r.response.statusCode,
      statusText: r.response.statusCode < 400 ? 'OK' : 'Error',
      headers: r.response.headers,
      body: r.response.body,
      timing: Math.floor(Math.random() * 200 + 50),
    },
  }));

  return [
    {
      type: 'http-inspector',
      content: React.createElement(
        (() => {
          const { HttpInspector } = require('./HttpInspector');
          return HttpInspector;
        })(),
        { requests: simRequests },
      ),
    },
  ];
}

// ── Wireless Lab ─────────────────────────────────────────────────────────────
export function createWirelessSimulations(
  accessPoints: Array<{
    bssid: string; ssid: string; channel: number; signal: number;
    encryption: string; cipher: string; authentication: string;
  }>,
): SimulationContent[] {
  const nodes: TopologyNode[] = accessPoints.map((ap, i) => ({
    id: ap.bssid,
    label: ap.ssid || 'Hidden',
    type: 'router' as const,
    ip: `192.168.${i + 1}.1`,
    x: 100 + i * 120,
    y: 100 + (i % 2) * 60,
    discovered: true,
  }));

  const links: TopologyLink[] = accessPoints.slice(1).map((ap, i) => ({
    from: accessPoints[0].bssid,
    to: ap.bssid,
    discovered: true,
  }));

  return [
    {
      type: 'network-topology',
      content: React.createElement(
        (() => {
          const { NetworkTopology } = require('./NetworkTopology');
          return NetworkTopology;
        })(),
        { nodes, links },
      ),
    },
    {
      type: 'packet-viewer',
      content: React.createElement(
        (() => {
          const { PacketViewer } = require('./PacketViewer');
          return PacketViewer;
        })(),
        {
          packets: [
            { number: 1, time: '00:00:01', source: accessPoints[0]?.bssid || 'AA:BB:CC:DD:EE:FF', destination: 'FF:FF:FF:FF:FF:FF', protocol: '802.11', length: 256, info: 'Beacon frame', flags: 'Beacon' },
            { number: 2, time: '00:00:02', source: '11:22:33:44:55:66', destination: accessPoints[0]?.bssid || 'AA:BB:CC:DD:EE:FF', protocol: '802.11', length: 128, info: 'Probe Request', flags: 'Probe' },
            { number: 3, time: '00:00:03', source: accessPoints[0]?.bssid || 'AA:BB:CC:DD:EE:FF', destination: '11:22:33:44:55:66', protocol: '802.11', length: 192, info: 'Probe Response', flags: 'Probe' },
          ],
        },
      ),
    },
  ];
}

// ── Kill Chain Lab ───────────────────────────────────────────────────────────
export function createKillChainSimulations(
  phases: Array<{ name: string; commands: Array<{ command: string; output: string }> }>,
): SimulationContent[] {
  const allEvents: TimelineEvent[] = phases.flatMap((phase, pi) =>
    phase.commands.map((cmd, ci) => ({
      id: `kc-${pi}-${ci}`,
      timestamp: `2024-01-15T${String(10 + pi).padStart(2, '0')}:${String(ci * 5).padStart(2, '0')}:00Z`,
      title: `${phase.name}: ${cmd.command.split(' ')[0]}`,
      description: cmd.output.slice(0, 200),
      category: (['network', 'process', 'file', 'auth', 'dns', 'email'] as const)[pi % 6],
      severity: (['low', 'medium', 'high', 'critical'] as const)[Math.min(pi, 3)],
    })),
  );

  return [
    {
      type: 'timeline-investigation',
      content: React.createElement(
        (() => {
          const { TimelineInvestigation } = require('./TimelineInvestigation');
          return TimelineInvestigation;
        })(),
        { events: allEvents },
      ),
    },
    {
      type: 'network-topology',
      content: React.createElement(
        (() => {
          const { NetworkTopology } = require('./NetworkTopology');
          return NetworkTopology;
        })(),
        {
          nodes: [
            { id: 'attacker', label: 'Attacker', type: 'workstation' as const, x: 50, y: 150, discovered: true },
            { id: 'target', label: 'Target Server', type: 'server' as const, x: 350, y: 150, discovered: true },
            { id: 'firewall', label: 'Firewall', type: 'firewall' as const, x: 200, y: 50, discovered: true },
            { id: 'db', label: 'Database', type: 'server' as const, x: 350, y: 250, discovered: false },
          ],
          links: [
            { from: 'attacker', to: 'firewall', label: 'recon', discovered: true },
            { from: 'firewall', to: 'target', label: 'exploit', discovered: true },
            { from: 'target', to: 'db', label: 'pivot', discovered: false },
          ],
        },
      ),
    },
    {
      type: 'log-viewer',
      content: React.createElement(
        (() => {
          const { LogViewer } = require('./LogViewer');
          return LogViewer;
        })(),
        {
          sources: [
            {
              id: 'auth',
              label: 'Auth Log',
              entries: [
                { timestamp: '2024-01-15 10:00:01', level: 'info' as const, source: 'sshd', message: 'Accepted password for kali from 10.0.0.42' },
                { timestamp: '2024-01-15 10:05:23', level: 'warn' as const, source: 'sudo', message: 'kali : TTY=pts/0 ; PWD=/home/kali ; USER=root ; COMMAND=/usr/bin/apt update' },
                { timestamp: '2024-01-15 10:12:45', level: 'error' as const, source: 'kernel', message: 'UFW BLOCK IN=eth0 SRC=10.0.0.42 DST=10.0.0.10 PROTO=TCP DPT=4444' },
              ],
            },
            {
              id: 'web',
              label: 'Web Server',
              entries: [
                { timestamp: '2024-01-15 10:02:15', level: 'info' as const, source: 'nginx', message: 'GET /login HTTP/1.1 200 1234' },
                { timestamp: "2024-01-15 10:03:22", level: 'warn' as const, source: 'nginx', message: "POST /login HTTP/1.1 302 - ' OR 1=1--" },
                { timestamp: '2024-01-15 10:08:01', level: 'error' as const, source: 'nginx', message: 'GET /admin HTTP/1.1 403 512' },
              ],
            },
          ],
        },
      ),
    },
  ];
}

// ── Privesc Lab ──────────────────────────────────────────────────────────────
export function createPrivescSimulations(
  filesystem: Record<string, string>,
): SimulationContent[] {
  const files: SimFile[] = Object.entries(filesystem).map(([path, content]) => {
    const parts = path.split('/');
    const name = parts[parts.length - 1];
    return {
      name,
      type: 'file' as const,
      size: content.length,
      modified: '2024-01-15',
      permissions: path.includes('/root/') ? '-rwxr-xr-x' : '-rw-r--r--',
      content,
      mimeType: 'text/plain',
    };
  });

  return [
    {
      type: 'file-explorer',
      content: React.createElement(
        (() => {
          const { FileExplorer } = require('./FileExplorer');
          return FileExplorer;
        })(),
        {
          files: [
            { name: 'home', type: 'dir' as const, size: 0, modified: '2024-01-15', permissions: 'drwxr-xr-x', children: files.slice(0, 5) },
            { name: 'etc', type: 'dir' as const, size: 0, modified: '2024-01-15', permissions: 'drwxr-xr-x', children: [
              { name: 'passwd', type: 'file' as const, size: 1247, modified: '2024-01-15', permissions: '-rw-r--r--', content: 'root:x:0:0:root:/root:/bin/bash\nkali:x:1000:1000:kali:/home/kali:/bin/bash', mimeType: 'text/plain' },
              { name: 'shadow.bak', type: 'file' as const, size: 892, modified: '2024-01-10', permissions: '-rw-r-----', content: 'root:$6$rounds=656000$...:19000:0:99999:7:::', mimeType: 'text/plain' },
            ] },
            { name: 'root', type: 'dir' as const, size: 0, modified: '2024-01-15', permissions: 'drwx------', children: [
              { name: 'flag.txt', type: 'file' as const, size: 34, modified: '2024-01-15', permissions: '-rwx------', content: 'FLAG{pr1v3sc_4cc3ss_gr4nt3d}', mimeType: 'text/plain' },
            ] },
          ],
        },
      ),
    },
    {
      type: 'log-viewer',
      content: React.createElement(
        (() => {
          const { LogViewer } = require('./LogViewer');
          return LogViewer;
        })(),
        {
          sources: [
            {
              id: 'auth',
              label: 'Auth Log',
              entries: [
                { timestamp: '2024-01-15 09:00:01', level: 'info' as const, source: 'sshd', message: 'Accepted password for trainee from 10.0.0.42' },
                { timestamp: '2024-01-15 09:05:23', level: 'warn' as const, source: 'sudo', message: 'trainee : TTY=pts/0 ; USER=root ; COMMAND=/usr/bin/find / -perm -4000' },
              ],
            },
          ],
        },
      ),
    },
  ];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function makeHttpRequest(
  method: string,
  url: string,
  statusCode: number,
  contentType: string,
  body: string,
): HttpRequest {
  return {
    id: `${method}-${url}-${Math.random().toString(36).slice(2, 6)}`,
    method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    url,
    headers: {
      'Host': new URL(url).host,
      'User-Agent': 'Mozilla/5.0 (Educational Lab)',
      'Accept': '*/*',
    },
    response: {
      statusCode,
      statusText: statusCode < 300 ? 'OK' : statusCode < 400 ? 'Redirect' : 'Error',
      headers: { 'Content-Type': contentType, 'Server': 'nginx/1.24.0' },
      body,
      timing: Math.floor(Math.random() * 200 + 50),
    },
  };
}
