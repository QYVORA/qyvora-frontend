/**
 * relatedTools.ts
 * Location: src/features/marketing/data/relatedTools.ts
 *
 * Sibling links for the open-source tool detail pages. Every tool page ends
 * with the same "Keep Reading" block pointing at the other tools, mirroring
 * the blog detail pattern.
 */

import type { RelatedItem } from '@/shared/components/RelatedContentSection';
import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';
import jabariLogo from '@/assets/jabari/jabari-main-logo.webp';
import aksumLogo from '@/assets/aksum/aksum-main-logo.webp';
import shakaLogo from '@/assets/shaka/shaka-main-logo.webp';
import nzingaLogo from '@/assets/nzinga/nzinga-main-logo.webp';
import sekhmetLogo from '@/assets/sekhmet/sekhmet-main-logo.webp';
import mansaLogo from '@/assets/mansa/mansa-main-logo.webp';
import amanirenasLogo from '@/assets/amanirenas/amanirenas-main-logo.webp';
import sundiataLogo from '@/assets/sundiata/sundiata-main-logo.webp';
import timbuktuLogo from '@/assets/timbuktu/timbuktu-main-logo.webp';
import kushLogo from '@/assets/kush/kush-main-logo.webp';
import imhotepLogo from '@/assets/imhotep/imhotep-main-logo.webp';

interface ToolRef {
  path: string;
  title: string;
  desc: string;
  logo: string;
}

const TOOLS: ToolRef[] = [
  { path: '/anansi', title: 'Anansi', desc: 'Terminal-first attack surface intelligence engine. Automate discovery, probing, and takeover detection.', logo: anansiLogo },
  { path: '/toha3ee', title: 'Toha3ee', desc: 'Local & network security assessment framework in Go: host and service discovery, enumeration, wireless and MITM capabilities from an interactive REPL.', logo: toha3eeLogo },
  { path: '/shaka', title: 'Shaka', desc: 'Windows & Active Directory security assessment framework in Go: domain discovery, object enumeration, graph-modeled privilege escalation, and evidence-driven reporting.', logo: shakaLogo },
  { path: '/nzinga', title: 'Nzinga', desc: 'Authorized open-source intelligence (OSINT) collection, cross-source correlation, and evidence-driven reporting in Go.', logo: nzingaLogo },
  { path: '/jabari', title: 'Jabari', desc: 'Android security assessment framework: authorized USB and network (ADB) targets, non-destructive rule engine and evidence-driven reporting.', logo: jabariLogo },
  { path: '/aksum', title: 'Aksum', desc: 'Binary security assessment & reverse-engineering platform in Go: identification, disassembly, function discovery, call graphs and evidence-backed findings.', logo: aksumLogo },
  { path: '/sekhmet', title: 'Sekhmet', desc: 'Baseline-aware, feedback-driven fuzzing & vulnerability discovery framework in Go: profile normal behaviour, adaptive mutation, SHA-256 crash dedup and delta minimization.', logo: sekhmetLogo },
  { path: '/mansa', title: 'Mansa', desc: 'Authorized wireless security assessment framework in Go: WLAN discovery, enumeration, MITM-range analysis, deterministic rule engine and transparent risk scoring.', logo: mansaLogo },
  { path: '/amanirenas', title: 'Amanirenas', desc: 'Offline iOS/Android app security assessment in Go: static analysis, hardcoded secrets, weak crypto, insecure endpoints, WebView posture and evidence-backed risk scoring.', logo: amanirenasLogo },
  { path: '/sundiata', title: 'Sundiata', desc: 'Identity & access security assessment for Active Directory in Go: identity discovery, account posture, password policies, sensitive memberships. Credentials are never stored or printed.', logo: sundiataLogo },
  { path: '/timbuktu', title: 'Timbuktu', desc: 'Incident response & digital forensics framework in Go: source integrity, artifact identification, filesystem lifecycle, memory postmortems, log analysis and evidence-backed timelines.', logo: timbuktuLogo },
  { path: '/kush', title: 'Kush', desc: 'Offline malware sample analysis framework in Go: hashing, metadata, static posture, strings, network indicators, IOC extraction and threat classification — without executing samples.', logo: kushLogo },
  { path: '/imhotep', title: 'Imhotep', desc: 'Offline cloud snapshot analysis framework in Go: IAM posture, storage exposure, network exposure, container posture, secret redaction and misconfiguration detection.', logo: imhotepLogo },
];

export const getRelatedTools = (excludePath: string): RelatedItem[] =>
  TOOLS.filter((tool) => tool.path !== excludePath).map((tool) => ({
    to: tool.path,
    title: tool.title,
    subtitle: tool.desc,
    badge: 'Open Source',
    image: tool.logo,
  }));

export interface ToolNeighbor {
  path: string;
  name: string;
  title: string;
  desc: string;
  logo: string;
}

const toolNameFromPath = (path: string): string => path.replace('/', '');

export const getToolNeighbors = (currentPath: string): { prev?: ToolNeighbor; next?: ToolNeighbor } => {
  const idx = TOOLS.findIndex((tool) => tool.path === currentPath);
  if (idx === -1) return {};

  const toNeighbor = (tool: ToolRef): ToolNeighbor => ({
    path: tool.path,
    name: toolNameFromPath(tool.path),
    title: tool.title,
    desc: tool.desc,
    logo: tool.logo,
  });

  return {
    prev: idx > 0 ? toNeighbor(TOOLS[idx - 1]) : undefined,
    next: idx < TOOLS.length - 1 ? toNeighbor(TOOLS[idx + 1]) : undefined,
  };
};
