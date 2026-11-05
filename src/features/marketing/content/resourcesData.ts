import { TOOLS, type ToolEntry } from '@/features/marketing/data/tools/registry';

export const CHEATSHEET_REPO = 'https://github.com/QYVORA/qyvora-cheatsheets';
const SHEET_BASE = `${CHEATSHEET_REPO}/blob/main`;

export interface CheatSheet {
  slug: string;
  title: string;
  description: string;
  href: string;
  docsPath?: string;
  logo?: string;
}

export interface CheatSheetGroup {
  id: string;
  title: string;
  description: string;
  sheets: CheatSheet[];
}

const toolBySlug = new Map(TOOLS.map((tool: ToolEntry) => [tool.slug, tool]));

const QYVORA_SLUGS = [
  'anansi',
  'toha3ee',
  'jabari',
  'aksum',
  'shaka',
  'nzinga',
  'mansa',
  'sekhmet',
  'amanirenas',
  'imhotep',
  'sundiata',
  'timbuktu',
  'kush',
] as const;

/**
 * QYVORA framework sheets are projected from the tool registry, so the name,
 * summary and docs link cannot drift from the tool page. The only hand-written
 * value is the Markdown path in the cheat-sheet repository.
 */
export const QYVORA_CHEATSHEETS: CheatSheet[] = QYVORA_SLUGS.flatMap((slug) => {
  const tool = toolBySlug.get(slug);
  if (!tool) return [];
  return [
    {
      slug,
      title: tool.displayName,
      description: tool.summary,
      href: `${SHEET_BASE}/qyvora/${slug}.md`,
      docsPath: tool.path,
      logo: tool.logo,
    },
  ];
});

export const POPULAR_CHEATSHEET_GROUPS: CheatSheetGroup[] = [
  {
    id: 'recon-osint',
    title: 'Recon & OSINT',
    description: 'Mapping a target before touching it.',
    sheets: [
      {
        slug: 'nmap',
        title: 'Nmap',
        description: 'Host discovery, port scanning, service and OS detection with the flags worth remembering.',
        href: `${SHEET_BASE}/recon/nmap.md`,
      },
      {
        slug: 'theharvester-sherlock',
        title: 'theHarvester & Sherlock',
        description: 'Email, domain and username collection for authorized reconnaissance.',
        href: `${SHEET_BASE}/osint/theharvester-sherlock.md`,
      },
    ],
  },
  {
    id: 'web',
    title: 'Web',
    description: 'The web attack surface, from proxy to injection.',
    sheets: [
      {
        slug: 'burp-suite',
        title: 'Burp Suite',
        description: 'Intercepting, repeating and scanning requests in an authorized web assessment.',
        href: `${SHEET_BASE}/web/burp-suite.md`,
      },
      {
        slug: 'ffuf',
        title: 'ffuf',
        description: 'Content discovery, parameter fuzzing and vhost enumeration.',
        href: `${SHEET_BASE}/web/ffuf.md`,
      },
      {
        slug: 'sqli',
        title: 'SQL Injection',
        description: 'Detection, confirmation and exploitation notes for SQL injection testing.',
        href: `${SHEET_BASE}/web/sqli-cheatsheet.md`,
      },
    ],
  },
  {
    id: 'network',
    title: 'Network',
    description: 'Traffic, services and local network assessment.',
    sheets: [
      {
        slug: 'netcat',
        title: 'Netcat',
        description: 'Listeners, transfers, shells and service probing with nc.',
        href: `${SHEET_BASE}/network/netcat.md`,
      },
      {
        slug: 'wireshark-tshark',
        title: 'Wireshark & tshark',
        description: 'Capture filters, display filters and command-line traffic analysis.',
        href: `${SHEET_BASE}/network/wireshark-tshark.md`,
      },
      {
        slug: 'bettercap',
        title: 'Bettercap',
        description: 'Network reconnaissance, ARP and MITM workflows inside an authorized scope.',
        href: `${SHEET_BASE}/network/bettercap.md`,
      },
    ],
  },
  {
    id: 'exploitation',
    title: 'Exploitation & passwords',
    description: 'Validated exploitation and credential attacks.',
    sheets: [
      {
        slug: 'metasploit',
        title: 'Metasploit',
        description: 'Modules, payloads, sessions and post-exploitation basics.',
        href: `${SHEET_BASE}/exploitation/metasploit.md`,
      },
      {
        slug: 'hashcat',
        title: 'Hashcat',
        description: 'Hash identification, attack modes and wordlist rules.',
        href: `${SHEET_BASE}/passwords/hashcat.md`,
      },
      {
        slug: 'hydra',
        title: 'Hydra',
        description: 'Authorized credential testing across common protocols.',
        href: `${SHEET_BASE}/passwords/hydra.md`,
      },
    ],
  },
  {
    id: 'post-ad',
    title: 'Post-exploitation & AD',
    description: 'Privilege escalation, lateral movement and directory attack paths.',
    sheets: [
      {
        slug: 'linux-privesc',
        title: 'Linux privilege escalation',
        description: 'Enumeration, permissions, services, cron and kernel checks.',
        href: `${SHEET_BASE}/post-exploitation/linux-privesc.md`,
      },
      {
        slug: 'netexec',
        title: 'NetExec',
        description: 'Protocol enumeration, authentication checks and command execution across a lab domain.',
        href: `${SHEET_BASE}/ad-windows/netexec.md`,
      },
      {
        slug: 'bloodhound',
        title: 'BloodHound',
        description: 'Collecting and querying Active Directory relationship data.',
        href: `${SHEET_BASE}/ad-windows/bloodhound.md`,
      },
      {
        slug: 'impacket',
        title: 'Impacket',
        description: 'Windows protocol scripts for authorized AD assessment.',
        href: `${SHEET_BASE}/ad-windows/impacket.md`,
      },
    ],
  },
  {
    id: 'reversing-wireless',
    title: 'Reversing & wireless',
    description: 'Binary analysis and WLAN assessment.',
    sheets: [
      {
        slug: 'gdb-pwndbg',
        title: 'GDB & pwndbg',
        description: 'Breakpoints, registers, memory and exploitation-oriented debugging.',
        href: `${SHEET_BASE}/reversing/gdb-pwndbg.md`,
      },
      {
        slug: 'aircrack-ng',
        title: 'Aircrack-ng',
        description: 'Monitor mode, capture and wireless assessment workflow.',
        href: `${SHEET_BASE}/wireless/aircrack-ng.md`,
      },
    ],
  },
  {
    id: 'general',
    title: 'General',
    description: 'The terminal habits that make everything else faster.',
    sheets: [
      {
        slug: 'tmux',
        title: 'tmux',
        description: 'Sessions, panes, windows and a practical working layout.',
        href: `${SHEET_BASE}/general/tmux.md`,
      },
      {
        slug: 'git',
        title: 'Git',
        description: 'Branching, history, recovery and the commands used every day.',
        href: `${SHEET_BASE}/general/git.md`,
      },
    ],
  },
];
