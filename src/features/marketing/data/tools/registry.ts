/**
 * Canonical registry for the QYVORA open-source toolkit.
 *
 * This is the single source of truth for tool identity. The docs sidebar, the
 * docs index page, the prev/next pager, the footer tool list and the site
 * navigation all read from here — nothing keeps its own copy of the tool list.
 *
 * Facts are taken from the repositories themselves (`go.mod`, `LICENSE`,
 * `Makefile`, `install.sh`), not from marketing copy.
 */

import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';
import shakaLogo from '@/assets/shaka/shaka-main-logo.webp';
import nzingaLogo from '@/assets/nzinga/nzinga-main-logo.webp';
import jabariLogo from '@/assets/jabari/jabari-main-logo.webp';
import aksumLogo from '@/assets/aksum/aksum-main-logo.webp';
import sekhmetLogo from '@/assets/sekhmet/sekhmet-main-logo.webp';
import mansaLogo from '@/assets/mansa/mansa-main-logo.webp';
import amanirenasLogo from '@/assets/amanirenas/amanirenas-main-logo.webp';
import sundiataLogo from '@/assets/sundiata/sundiata-main-logo.webp';
import timbuktuLogo from '@/assets/timbuktu/timbuktu-main-logo.webp';
import kushLogo from '@/assets/kush/kush-main-logo.webp';
import imhotepLogo from '@/assets/imhotep/imhotep-main-logo.webp';

export type ToolDomain =
  | 'web-osint'
  | 'network-directory'
  | 'binary-fuzzing'
  | 'mobile'
  | 'infrastructure'
  | 'shared';

export const TOOL_DOMAIN_LABELS: Record<ToolDomain, string> = {
  'web-osint': 'Web & OSINT',
  'network-directory': 'Network & Directory',
  'binary-fuzzing': 'Binary & Fuzzing',
  mobile: 'Mobile',
  infrastructure: 'Infrastructure',
  shared: 'Shared',
};

/** Domain display order for the sidebar. */
export const TOOL_DOMAIN_ORDER: ToolDomain[] = [
  'web-osint',
  'network-directory',
  'binary-fuzzing',
  'mobile',
  'infrastructure',
  'shared',
];

export interface ToolEntry {
  /** URL segment and doc-data key, e.g. `kush` for `/kush`. */
  slug: string;
  /** Human-facing name as used in the registry (`kush`). */
  name: string;
  /** Uppercase name for headings and badges. */
  displayName: string;
  /** Public docs route. */
  path: string;
  /** One-line description, used in the index and in sidebar search. */
  summary: string;
  domain: ToolDomain;
  github: string;
  /** `owner/repo` — also the release source for the install modal. */
  repo: string;
  /**
   * Default branch, used to build source links. It is not uniform across the
   * toolkit: SHAKA is published from `master`, everything else from `main`.
   */
  defaultBranch: string;
  /** Go module path from `go.mod`. */
  module: string;
  /** Go directive from `go.mod`. */
  goVersion: string;
  /** SPDX id, or `null` when no license text is committed. */
  license: string | null;
  /** Installed binary name. Libraries have none. */
  binary: string | null;
  /** Build entrypoint, repo-relative. */
  entrypoint: string;
  /** True when the repo ships a root `install.sh` one-liner installer. */
  hasInstaller: boolean;
  /** True when the tool runs a deterministic offline simulation (`--sim`). */
  hasSim: boolean;
  logo?: string;
}

export const TOOLS: ToolEntry[] = [
  {
    slug: 'anansi',
    name: 'anansi',
    displayName: 'ANANSI',
    path: '/anansi',
    summary: 'Attack surface intelligence for web targets: discovery, TLS, headers, paths, tech-stack, takeover and exploit-chain analysis.',
    domain: 'web-osint',
    github: 'https://github.com/QYVORA/qyvora-anansi',
    repo: 'QYVORA/qyvora-anansi',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-anansi',
    goVersion: '1.26.5',
    license: 'MIT',
    binary: 'anansi',
    entrypoint: 'main.go',
    hasInstaller: true,
    hasSim: false,
    logo: anansiLogo,
  },
  {
    slug: 'nzinga',
    name: 'nzinga',
    displayName: 'NZINGA',
    path: '/nzinga',
    summary: 'Authorized OSINT collection, cross-source correlation and evidence-backed reporting.',
    domain: 'web-osint',
    github: 'https://github.com/QYVORA/qyvora-nzinga',
    repo: 'QYVORA/qyvora-nzinga',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-nzinga',
    goVersion: '1.26.5',
    license: 'Apache-2.0',
    binary: 'nzinga',
    entrypoint: 'cmd/nzinga',
    hasInstaller: true,
    hasSim: true,
    logo: nzingaLogo,
  },
  {
    slug: 'toha3ee',
    name: 'toha3ee',
    displayName: 'TOHA3EE',
    path: '/toha3ee',
    summary: 'Local and network security assessment framework: 73 modules across recon, enumeration, MITM, wireless, switch-layer and post-exploitation.',
    domain: 'network-directory',
    github: 'https://github.com/QYVORA/qyvora-toha3ee',
    repo: 'QYVORA/qyvora-toha3ee',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-toha3ee',
    goVersion: '1.26.5',
    license: 'MIT',
    binary: 'toha3ee',
    entrypoint: 'cmd/toha3ee',
    hasInstaller: false,
    hasSim: false,
    logo: toha3eeLogo,
  },
  {
    slug: 'shaka',
    name: 'shaka',
    displayName: 'SHAKA',
    path: '/shaka',
    summary: 'Authorized Active Directory and Windows assessment: discovery, enumeration, evidence-derived graph correlation and trust analysis.',
    domain: 'network-directory',
    github: 'https://github.com/QYVORA/qyvora-shaka',
    repo: 'QYVORA/qyvora-shaka',
    defaultBranch: 'master',
    module: 'github.com/QYVORA/qyvora-shaka',
    goVersion: '1.26.5',
    license: 'Apache-2.0',
    binary: 'shaka',
    entrypoint: 'cmd/shaka',
    hasInstaller: true,
    hasSim: true,
    logo: shakaLogo,
  },
  {
    slug: 'mansa',
    name: 'mansa',
    displayName: 'MANSA',
    path: '/mansa',
    summary: 'Authorized wireless security assessment: WLAN discovery, AP enumeration, client observation and a 21-rule analysis engine.',
    domain: 'network-directory',
    github: 'https://github.com/QYVORA/qyvora-mansa',
    repo: 'QYVORA/qyvora-mansa',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-mansa',
    goVersion: '1.26.5',
    license: 'MIT',
    binary: 'mansa',
    entrypoint: 'main.go',
    hasInstaller: true,
    hasSim: true,
    logo: mansaLogo,
  },
  {
    slug: 'aksum',
    name: 'aksum',
    displayName: 'AKSUM',
    path: '/aksum',
    summary: 'Binary security assessment and reverse engineering: identification, disassembly, function discovery, call graphs and findings.',
    domain: 'binary-fuzzing',
    github: 'https://github.com/QYVORA/qyvora-aksum',
    repo: 'QYVORA/qyvora-aksum',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-aksum',
    goVersion: '1.26.5',
    license: 'MIT',
    binary: 'aksum',
    entrypoint: 'main.go',
    hasInstaller: true,
    hasSim: true,
    logo: aksumLogo,
  },
  {
    slug: 'kush',
    name: 'kush',
    displayName: 'KUSH',
    path: '/kush',
    summary: 'Offline malware sample analysis: hashes, metadata, static posture, strings, network indicators and IOC extraction.',
    domain: 'binary-fuzzing',
    github: 'https://github.com/QYVORA/qyvora-kush',
    repo: 'QYVORA/qyvora-kush',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-kush',
    goVersion: '1.26.5',
    license: null,
    binary: 'kush',
    entrypoint: 'cmd/kush',
    hasInstaller: false,
    hasSim: true,
    logo: kushLogo,
  },
  {
    slug: 'sekhmet',
    name: 'sekhmet',
    displayName: 'SEKHMET',
    path: '/sekhmet',
    summary: 'Baseline-aware fuzzing: profile normal behaviour, mutate a deduplicated corpus, classify crashes and replay them.',
    domain: 'binary-fuzzing',
    github: 'https://github.com/QYVORA/qyvora-Sekhmet',
    repo: 'QYVORA/qyvora-Sekhmet',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-Sekhmet',
    goVersion: '1.26.5',
    license: 'Apache-2.0',
    binary: 'sekhmet',
    entrypoint: 'cmd/sekhmet',
    hasInstaller: true,
    hasSim: true,
    logo: sekhmetLogo,
  },
  {
    slug: 'jabari',
    name: 'jabari',
    displayName: 'JABARI',
    path: '/jabari',
    summary: 'Android security assessment for USB and authorized network targets, plus offline APK static analysis.',
    domain: 'mobile',
    github: 'https://github.com/QYVORA/qyvora-jabari',
    repo: 'QYVORA/qyvora-jabari',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-jabari',
    goVersion: '1.26.5',
    license: 'Apache-2.0',
    binary: 'jabari',
    entrypoint: 'cmd/jabari',
    hasInstaller: true,
    hasSim: false,
    logo: jabariLogo,
  },
  {
    slug: 'amanirenas',
    name: 'amanirenas',
    displayName: 'AMANIRENAS',
    path: '/amanirenas',
    summary: 'Offline mobile app assessment: metadata, static posture, configuration, API and secret exposure, with no runtime execution.',
    domain: 'mobile',
    github: 'https://github.com/QYVORA/qyvora-amanirenas',
    repo: 'QYVORA/qyvora-amanirenas',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-amanirenas',
    goVersion: '1.26.5',
    license: null,
    binary: 'amanirenas',
    entrypoint: 'cmd/amanirenas',
    hasInstaller: false,
    hasSim: true,
    logo: amanirenasLogo,
  },
  {
    slug: 'imhotep',
    name: 'imhotep',
    displayName: 'IMHOTEP',
    path: '/imhotep',
    summary: 'Offline cloud snapshot analysis: IAM, storage, network, container and secret exposure from recorded snapshots.',
    domain: 'infrastructure',
    github: 'https://github.com/QYVORA/qyvora-imhotep',
    repo: 'QYVORA/qyvora-imhotep',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-imhotep',
    goVersion: '1.26.5',
    license: null,
    binary: 'imhotep',
    entrypoint: 'cmd/imhotep',
    hasInstaller: false,
    hasSim: true,
    logo: imhotepLogo,
  },
  {
    slug: 'sundiata',
    name: 'sundiata',
    displayName: 'SUNDIATA',
    path: '/sundiata',
    summary: 'Offline identity directory assessment: account posture, MFA, credential exposure, privilege mapping and attack paths.',
    domain: 'infrastructure',
    github: 'https://github.com/QYVORA/qyvora-sundiata',
    repo: 'QYVORA/qyvora-sundiata',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-sundiata',
    goVersion: '1.26.5',
    license: null,
    binary: 'sundiata',
    entrypoint: 'cmd/sundiata',
    hasInstaller: false,
    hasSim: true,
    logo: sundiataLogo,
  },
  {
    slug: 'timbuktu',
    name: 'timbuktu',
    displayName: 'TIMBUKTU',
    path: '/timbuktu',
    summary: 'Incident response and digital forensics on offline case files: integrity, artifacts, memory, logs, timelines and IOCs.',
    domain: 'infrastructure',
    github: 'https://github.com/QYVORA/qyvora-timbuktu',
    repo: 'QYVORA/qyvora-timbuktu',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-timbuktu',
    goVersion: '1.26.5',
    license: null,
    binary: 'timbuktu',
    entrypoint: 'cmd/timbuktu',
    hasInstaller: false,
    hasSim: true,
    logo: timbuktuLogo,
  },
  {
    slug: 'qyvora-common',
    name: 'qyvora-common',
    displayName: 'QYVORA-COMMON',
    path: '/qyvora-common',
    summary: 'The shared contract and conformance suite every QYVORA framework is built against.',
    domain: 'shared',
    github: 'https://github.com/QYVORA/qyvora-common',
    repo: 'QYVORA/qyvora-common',
    defaultBranch: 'main',
    module: 'github.com/QYVORA/qyvora-common',
    goVersion: '1.26',
    license: null,
    binary: null,
    entrypoint: 'contract/contract.go',
    hasInstaller: false,
    hasSim: false,
  },
];

export const getTool = (slug: string): ToolEntry | undefined =>
  TOOLS.find((tool) => tool.slug === slug);

/** Registry lookup that throws on an unknown slug — for doc data files. */
export const getToolOrThrow = (slug: string): ToolEntry => {
  const tool = getTool(slug);
  if (!tool) throw new Error(`Unknown tool slug: ${slug}`);
  return tool;
};

export const getToolByPath = (path: string): ToolEntry | undefined =>
  TOOLS.find((tool) => tool.path === path);

export const getToolsByDomain = (domain: ToolDomain): ToolEntry[] =>
  TOOLS.filter((tool) => tool.domain === domain);

/** Builds a deep link to a file inside a tool's repository. */
export const repoFileUrl = (tool: ToolEntry, path: string): string =>
  `${tool.github}/blob/${tool.defaultBranch}/${path.replace(/^\/+/, '')}`;

/** Builds a deep link to a directory inside a tool's repository. */
export const repoDirUrl = (tool: ToolEntry, path: string): string =>
  `${tool.github}/tree/${tool.defaultBranch}/${path.replace(/^\/+/, '')}`;
