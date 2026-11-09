/**
 * Centralized official Lab badge registry.
 *
 * The supplied artwork in `core/COURSE-BADGES/` and `core/LAB-BADGES/` is the
 * single, official QYVORA badge collection. Directory names reflected the
 * previous organisational grouping only; every image is now mapped to its
 * canonical Lab id and used as that Lab's permanent badge identity.
 *
 * Rules:
 * - One registry for both content Labs (former courses) and hands-on Labs.
 * - Never regenerate, redraw or substitute this artwork.
 * - The same image is used in the catalogue, the Lab page, completion awards
 *   and the learner's earned-badge collection.
 */
import adEnum from '@/assets/badges/ad-enum.png';
import apiSecurity from '@/assets/badges/api-security.png';
import attackPaths from '@/assets/badges/attack-paths.png';
import automation from '@/assets/badges/automation.png';
import burpSuite101 from '@/assets/badges/burp-suite-101.png';
import gitGithub101 from '@/assets/badges/git-github-101.png';
import killChain from '@/assets/badges/kill-chain.png';
import linuxTerminal101 from '@/assets/badges/linux-terminal-101.png';
import methodology from '@/assets/badges/methodology.png';
import networking101 from '@/assets/badges/networking-101.png';
import networkSecurity from '@/assets/badges/network-security.png';
import nmap101 from '@/assets/badges/nmap-101.png';
import osint from '@/assets/badges/osint.png';
import passwords from '@/assets/badges/passwords.png';
import privesc from '@/assets/badges/privesc.png';
import pythonForHackers101 from '@/assets/badges/python-for-hackers-101.png';
import sqlInjection from '@/assets/badges/sql-injection.png';
import webAccessControl from '@/assets/badges/web-access-control.png';
import webRecon101 from '@/assets/badges/web-recon-101.png';
import webTechnologies101 from '@/assets/badges/web-technologies-101.png';
import wifiFundamentals101 from '@/assets/badges/wifi-fundamentals-101.png';
import windowsCmd101 from '@/assets/badges/windows-cmd-101.png';
import wireshark101 from '@/assets/badges/wireshark-101.png';
import wlanSecurity from '@/assets/badges/wlan-security.png';

export type LabBadgeKind = 'content' | 'hands-on';

export interface LabBadgeAsset {
  /** Canonical Lab id (matches `UnifiedLab.id`). */
  id: string;
  /** Human-readable Lab title. */
  title: string;
  /** Official badge artwork. */
  image: string;
  kind: LabBadgeKind;
}

/**
 * Content Labs (former courses).
 *
 * `sql-injection-101` shares the official SQL Injection artwork with the
 * hands-on `sqli` Lab: the supplied collection contains one SQL Injection badge
 * and both Labs represent the same subject.
 */
const CONTENT_BADGES: LabBadgeAsset[] = [
  { id: 'burp-suite-101', title: 'Burp Suite 101', image: burpSuite101, kind: 'content' },
  { id: 'git-github-101', title: 'Git & GitHub 101', image: gitGithub101, kind: 'content' },
  { id: 'linux-terminal-101', title: 'Linux Terminal 101', image: linuxTerminal101, kind: 'content' },
  { id: 'networking-101', title: 'Networking 101', image: networking101, kind: 'content' },
  { id: 'nmap-101', title: 'Nmap 101', image: nmap101, kind: 'content' },
  { id: 'python-for-hackers-101', title: 'Python for Hackers 101', image: pythonForHackers101, kind: 'content' },
  { id: 'sql-injection-101', title: 'SQL Injection 101', image: sqlInjection, kind: 'content' },
  { id: 'web-recon-101', title: 'Web Reconnaissance 101', image: webRecon101, kind: 'content' },
  { id: 'web-technologies-101', title: 'Web Technologies 101', image: webTechnologies101, kind: 'content' },
  { id: 'wifi-fundamentals-101', title: 'Wi-Fi Fundamentals 101', image: wifiFundamentals101, kind: 'content' },
  { id: 'windows-cmd-101', title: 'Windows CMD 101', image: windowsCmd101, kind: 'content' },
  { id: 'wireshark-101', title: 'Wireshark 101', image: wireshark101, kind: 'content' },
];

/** Hands-on Labs (former labs/rooms). */
const HANDS_ON_BADGES: LabBadgeAsset[] = [
  { id: 'privesc', title: 'Privilege Escalation', image: privesc, kind: 'hands-on' },
  { id: 'passwords', title: 'Password Cracking', image: passwords, kind: 'hands-on' },
  { id: 'sqli', title: 'SQL Injection', image: sqlInjection, kind: 'hands-on' },
  { id: 'osint', title: 'OSINT Recon', image: osint, kind: 'hands-on' },
  { id: 'killchain', title: 'Kill Chain', image: killChain, kind: 'hands-on' },
  { id: 'web-access-control', title: 'Broken Access Control', image: webAccessControl, kind: 'hands-on' },
  { id: 'api-security', title: 'API Security', image: apiSecurity, kind: 'hands-on' },
  { id: 'automation', title: 'Security Automation', image: automation, kind: 'hands-on' },
  { id: 'methodology', title: 'Engagement Methodology', image: methodology, kind: 'hands-on' },
  { id: 'network-security', title: 'Network Security', image: networkSecurity, kind: 'hands-on' },
  { id: 'wlan-security', title: 'Wireless Security', image: wlanSecurity, kind: 'hands-on' },
  { id: 'ad-enum', title: 'AD Enumeration', image: adEnum, kind: 'hands-on' },
  { id: 'attack-paths', title: 'Enterprise Attack Paths', image: attackPaths, kind: 'hands-on' },
];

export const LAB_BADGES: LabBadgeAsset[] = [...CONTENT_BADGES, ...HANDS_ON_BADGES];

const badgeById = new Map(LAB_BADGES.map((badge) => [badge.id, badge]));

export const getLabBadgeAsset = (labId: string): LabBadgeAsset | undefined =>
  badgeById.get(labId);

export const getLabBadgeImage = (labId: string): string | undefined =>
  badgeById.get(labId)?.image;

/** Safe lookup for Lab ids that do not have an official badge yet. */
export const LAB_BADGE_IDS = LAB_BADGES.map((badge) => badge.id);
