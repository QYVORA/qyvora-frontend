/**
 * QYVORA Bootcamps — public programme data.
 *
 * Source of truth (QYVORA documentation):
 *   07-products/hacker-protocol-bootcamp/HACKER-PROTOCOL-BOOTCAMP.md  HPB programme blueprint
 *   07-products/hacker-protocol-bootcamp/STUDENT-HANDBOOK.md            HPB handbook
 *   07-products/offensive-security-engineer-bootcamp/QOSE-MASTER-PLAN.md  QOSE curriculum
 *   07-products/offensive-security-engineer-bootcamp/QOSE-PAID-BOOTCAMP-PLAN.md  QOSE tuition & delivery
 *
 * Logos are the official supplied assets, imported unmodified. The build's
 * webp plugin generates a lossless-alpha webp twin of each PNG.
 *
 * ── WhatsApp configuration ──────────────────────────────────────────────────
 * Every WhatsApp link used by the bootcamp surfaces is configured here. Each
 * value can be overridden at build time with a Vite env var, so a link change
 * never requires a code edit:
 *
 *   VITE_BOOTCAMP_WHATSAPP_URL   generic fallback for any bootcamp CTA
 *   VITE_HPB_WHATSAPP_URL       Hacker Protocol Bootcamp group invite
 *   VITE_QOSE_WHATSAPP_URL      Offensive Security Engineer Bootcamp group invite
 *
 * The values below are the links configured for each programme.
 */

import hpbLogo from '@/assets/bootcamp/HPB-logo.webp';
import qoseLogo from '@/assets/bootcamp/QOSE-Logo.webp';
import { BOOTCAMP_CONFIG } from '@/features/student/constants/bootcampStructure';

const envUrl = (value: unknown): string | undefined => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed.length > 0 ? trimmed : undefined;
};

/** Company-wide community channel, already configured in SITE_CONFIG.contact. */
const COMPANY_WHATSAPP_FALLBACK = 'https://whatsapp.com/channel/0029Vb8Aw6L5EjxzLY6L2m1V';

export const BOOTCAMP_WHATSAPP_URLS = {
  /** Generic fallback used when a programme has no group invite configured. */
  get fallback(): string {
    return envUrl(import.meta.env.VITE_BOOTCAMP_WHATSAPP_URL) ?? COMPANY_WHATSAPP_FALLBACK;
  },
  /** Hacker Protocol Bootcamp community group invite. */
  get hpb(): string {
    return envUrl(import.meta.env.VITE_HPB_WHATSAPP_URL) ?? 'https://chat.whatsapp.com/JpWNj3yy1TKGBoRjm6zksp';
  },
  /** Offensive Security Engineer Bootcamp community group invite. */
  get qose(): string {
    return envUrl(import.meta.env.VITE_QOSE_WHATSAPP_URL) ?? 'https://chat.whatsapp.com/I1latZPWXdlIWk6IJTLUKW';
  },
} as const;

export type BootcampStatus = 'open' | 'pre-registration';

export interface BootcampFact {
  label: string;
  value: string;
}

export interface BootcampPhase {
  title: string;
  summary: string;
}

export interface Bootcamp {
  id: 'hpb' | 'qose';
  /** Official programme name. */
  name: string;
  /** Short expansion used in headings and metadata. */
  acronym: string;
  path: string;
  tagline: string;
  overview: string;
  audience: string;
  status: BootcampStatus;
  statusLabel: string;
  statusNote: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  logoAlt: string;
  facts: BootcampFact[];
  covers: string[];
  phases: BootcampPhase[];
  ethics: string[];
  whatsappUrl: string;
  /** Primary CTA label. Pre-registration programmes open the access modal. */
  ctaLabel: string;
}

const LOGO_SIZE = { width: 1254, height: 1254 } as const;

/**
 * HPB structure counts are derived from the live curriculum in
 * `bootcampStructure.ts` — the same data the student dashboard renders — so the
 * marketing page can never advertise a room count the curriculum disagrees with.
 * (The HPB blueprint document still says 18 rooms against 19 in the curriculum;
 * the curriculum is what a student actually gets, so the curriculum wins here.)
 */
const HPB_PHASES = BOOTCAMP_CONFIG.phases ?? [];
const HPB_ROOM_COUNT = HPB_PHASES.reduce(
  (total, phase) => total + (phase.rooms?.length ?? 0),
  0,
);

const ETHICS_COMMON = [
  'Learning, research, practice environments, educational labs and CTF challenges.',
  'No unauthorized testing, no attacks against real systems, no illegal activity.',
];

export const BOOTCAMPS: Record<Bootcamp['id'], Bootcamp> = {
  hpb: {
    id: 'hpb',
    name: 'Hacker Protocol Bootcamp',
    acronym: 'HPB',
    path: '/hpb',
    tagline: 'Beginner cybersecurity training that builds thinkers before operators.',
    overview:
      'A beginner-focused cybersecurity training programme that teaches participants to think like security professionals through structured learning, practical exercises and guided problem solving. HPB is built on one principle: understand systems before learning tools.',
    audience:
      'Beginners and early-stage learners with no prior security background. No tool experience is assumed — the programme starts from how systems, networks and web technologies actually work.',
    status: 'open',
    statusLabel: 'Open for enrollment',
    statusNote:
      'HPB is running. Enrollment is available and the curriculum is live.',
    logo: hpbLogo,
    logoWidth: LOGO_SIZE.width,
    logoHeight: LOGO_SIZE.height,
    logoAlt: 'Hacker Protocol Bootcamp logo',
    facts: [
      { label: 'Level', value: 'Beginner' },
      { label: 'Duration', value: '6 weeks' },
      { label: 'Cost', value: 'Free' },
      { label: 'Format', value: 'Live sessions · labs · assignments · CTF' },
      { label: 'Structure', value: `${HPB_PHASES.length} modules · ${HPB_ROOM_COUNT} rooms` },
    ],
    covers: [
      'Cybersecurity fundamentals and security thinking',
      'Observation skills, problem solving and analytical reasoning',
      'Computer networking, DNS, IP addressing and reconnaissance',
      'Linux and terminal mastery',
      'Web and backend systems — HTTP, authentication and APIs',
      'Psychology and social engineering',
    ],
    phases: [
      {
        title: 'The Hacker Mindset & Learning Path',
        summary:
          'Cybersecurity fundamentals, security thinking, observation skills, problem solving, analytical reasoning and learning methodology.',
      },
      {
        title: 'Computer Networking Foundations',
        summary:
          'Internet fundamentals, DNS, IP addressing, network communication, service discovery and basic reconnaissance with the terminal, browser devtools and Nmap.',
      },
      {
        title: 'Linux & Terminal Mastery',
        summary:
          'File systems, user management, permissions, processes and command-line navigation — cd, ls, cat, chmod and ps.',
      },
      {
        title: 'Web & Backend Systems',
        summary:
          'HTTP fundamentals, requests and responses, authentication concepts, APIs, backend architecture and web debugging using browser developer tools.',
      },
      {
        title: 'Psychology & Social Engineering',
        summary:
          'Human behaviour, influence techniques, decision making, security awareness and ethical responsibility.',
      },
    ],
    ethics: ETHICS_COMMON,
    whatsappUrl: BOOTCAMP_WHATSAPP_URLS.hpb,
    ctaLabel: 'Enroll now',
  },
  qose: {
    id: 'qose',
    name: 'Offensive Security Engineer Bootcamp',
    acronym: 'QOSE',
    path: '/qose',
    tagline: 'Twelve weeks from certified foundation to structured, authorized assessment work.',
    overview:
      'A practical-first offensive security programme that turns Hacker Protocol Bootcamp graduates into entry-level offensive-security practitioners capable of conducting structured, authorized security assessments. QOSE is not HPB 2.0 — it begins where HPB ends, with one premise: you know the tools, now learn how to conduct an engagement.',
    audience:
      'Learners who have completed the Hacker Protocol Bootcamp or hold equivalent grounding in the Linux terminal, networking, scripting, reconnaissance, web security, OSINT and basic privilege escalation. Delivery is online, on Kali Linux with VMs and containerized labs.',
    status: 'pre-registration',
    statusLabel: 'Pre-registration — preparing for launch',
    statusNote:
      'QOSE is being prepared for launch. Enrollment is not open yet, so registration is being handled through the QOSE community group until the cohort opens.',
    logo: qoseLogo,
    logoWidth: LOGO_SIZE.width,
    logoHeight: LOGO_SIZE.height,
    logoAlt: 'QYVORA Offensive Security Engineer Bootcamp logo',
    facts: [
      { label: 'Duration', value: '12 weeks' },
      { label: 'Delivery', value: 'Online' },
      { label: 'Teaching model', value: 'Practical-first' },
      { label: 'Prerequisite', value: 'Hacker Protocol Bootcamp' },
      { label: 'Environment', value: 'Kali Linux · VMs · containerized labs' },
    ],
    covers: [
      'Offensive security operations — engagement lifecycle, scope, authorization and rules of engagement',
      'Professional reconnaissance and attack-surface mapping',
      'Web application security',
      'Network and systems security',
      'Enterprise security',
      'Offensive security engineering',
      'Advanced security exposure, ending in a capstone and a professional report',
    ],
    phases: [
      {
        title: 'Entering the Profession',
        summary:
          'Offensive-security methodology, the engagement lifecycle, scope and rules of engagement, attack-surface mapping, evidence and reporting.',
      },
      {
        title: 'Web Application Security',
        summary:
          'The OWASP-aligned web attack surface, validation, exploitation and reporting against an authorized target.',
      },
      {
        title: 'Network & Systems',
        summary:
          'Network- and host-level assessment: enumeration, service analysis, exploitation and privilege escalation within scope.',
      },
      {
        title: 'Enterprise Security',
        summary:
          'Active Directory and enterprise identity exposure, credential attacks and lateral movement inside a lab environment.',
      },
      {
        title: 'Offensive Security Engineering',
        summary:
          'Turning assessment findings into tooling, automation and repeatable method.',
      },
      {
        title: 'Advanced Security Exposure',
        summary:
          'Advanced offensive exposure, culminating in the QOSE capstone and a professional security report.',
      },
    ],
    ethics: ETHICS_COMMON,
    whatsappUrl: BOOTCAMP_WHATSAPP_URLS.qose,
    ctaLabel: 'Join the QOSE group',
  },
};

export const BOOTCAMP_LIST: Bootcamp[] = [BOOTCAMPS.hpb, BOOTCAMPS.qose];