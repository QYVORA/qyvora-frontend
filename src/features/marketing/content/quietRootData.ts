/**
 * QuietRoot — QYVORA's technical team.
 *
 * Source of truth (QYVORA documentation):
 *   03-people/quiteroot/QUITEROOT-TEAM-STRUCTURE.md      QYVORA-QR-001  two teams, role placeholders, capability bars
 *   03-people/quiteroot/QUITEROOT-MEMBER-REGISTER.md     QYVORA-QR-002  live roster
 *   03-people/quiteroot/LEAD-PENETRATION-TESTER.md       QYVORA-PPL-006 Security Team delivery role record
 *   03-people/quiteroot/LEAD-PENETRATION-TESTER-ROLE.md  QYVORA-GOV-018 role framework
 *   03-people/quiteroot/JUNIOR-FRONTEND-DEVELOPER.md     QYVORA-PPL-007 Tech Team role record
 *   03-people/quiteroot/JUNIOR-FRONTEND-DEVELOPER-ROLE.md QYVORA-GOV-019 role framework
 *
 * Every role listed here is a documented QuietRoot role placeholder. `holder`
 * is non-null only where the documentation records a named holder; every other
 * role renders as an OPEN vacancy with an application CTA — never a stand-in
 * person. Role blurbs are the documented capability bars reworded for a public
 * audience; no biography is written where the documentation has none.
 *
 * `id` values reuse the documented role codes so the frontend and the
 * documentation stay traceable. They are internal identifiers and are not
 * rendered on the page.
 */

import quiterootTechLogo from '@/assets/quietRoot/quiteroot-tech-team.webp';
import quiterootSecurityLogo from '@/assets/quietRoot/quiteroot-security-team.webp';
import abdulRahmanPeligahImg from '@/assets/team/junior_pentester.webp';
import peterOriasotieImg from '@/assets/team/cyberX6.webp';

/** Both team logos ship as 1254x1254 transparent PNGs (webp twin, same canvas). */
const TEAM_LOGO_SIZE = { width: 1254, height: 1254 } as const;

export interface QuietRootHolder {
  /** Legal name as recorded in the people record. */
  name: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  location?: string;
  disciplines: string[];
  bio: string;
  /** Public profile links, keyed by platform (github, linkedin, twitter, ...). */
  socials?: Record<string, string | undefined>;
}

export interface QuietRootRole {
  /** Documented role code. Internal key only — never rendered. */
  id: string;
  title: string;
  /** Public wording of the documented capability bar. */
  summary: string;
  /** null means the role is an open vacancy. */
  holder: QuietRootHolder | null;
  /**
   * QRS-LPT (Senior Penetration Tester) is not open to applicants — the
   * documentation records a confirmed holder and closes the role to intake.
   */
  openToApplications?: boolean;
}

export interface QuietRootTeam {
  id: 'tech' | 'security';
  /** Official branch name, always written as one brand word: QuietRoot. */
  name: string;
  focus: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  roles: QuietRootRole[];
  /** Documented boundary note shown under the role grid. */
  note?: string;
}

export const QUIETROOT_TEAMS: QuietRootTeam[] = [
  {
    id: 'tech',
    name: 'QuietRoot Tech Team',
    focus:
      'Building and maintaining QYVORA’s products, platform and interfaces — the development and design branch.',
    logo: quiterootTechLogo,
    logoWidth: TEAM_LOGO_SIZE.width,
    logoHeight: TEAM_LOGO_SIZE.height,
    roles: [
      {
        id: 'QRT-FE',
        title: 'Junior Frontend Developer',
        summary:
          'Shipped frontend work reviewed by QYVORA — implemented interfaces, fixed defects, built pages and components.',
        holder: {
          name: 'Abdul Rahman Peligah',
          image: abdulRahmanPeligahImg,
          imageWidth: 960,
          imageHeight: 960,
          location: 'Tamale, Ghana',
          disciplines: ['Web security', 'Capture the flag', 'Bug hunting'],
          bio: 'Junior frontend developer learning on the job — labs, capture-the-flag and bug reports alongside QYVORA’s senior engineers.',
          socials: {
            twitter: 'https://x.com/Abdul_Peligah',
            linkedin: 'https://www.linkedin.com/in/mahamud-abdul-rahaman/',
          },
        },
      },
      {
        id: 'QRT-SFE',
        title: 'Senior Frontend Developer',
        summary:
          'Frontend ownership rather than execution — architecture decisions on the interface layer, code review of other contributors’ frontend work, and accountability for the frontend workstream.',
        holder: null,
      },
      {
        id: 'QRT-BE-JR',
        title: 'Junior Backend Developer',
        summary:
          'Shipped backend work — APIs, services, data modelling and error handling.',
        holder: null,
      },
      {
        id: 'QRT-BE-SR',
        title: 'Senior Backend Developer',
        summary:
          'Backend ownership rather than execution — service and data-model decisions, review of other contributors’ backend work, and accountability for the backend workstream.',
        holder: null,
      },
      {
        id: 'QRT-FS',
        title: 'Full-Stack Developer',
        summary:
          'Demonstrated end-to-end delivery — frontend and backend — with something running.',
        holder: null,
      },
      {
        id: 'QRT-UX',
        title: 'UI/UX Designer',
        summary:
          'Interface and experience design with a rationale — information architecture, user flows, accessible components, design system work.',
        holder: null,
      },
      {
        id: 'QRT-BD',
        title: 'Graphic & Brand Designer',
        summary:
          'Visual and brand work — identity application, assets, type and colour systems, web implementation of the design.',
        holder: null,
      },
    ],
  },
  {
    id: 'security',
    name: 'QuietRoot Security Team',
    focus:
      'QYVORA’s offensive-security tooling, research and authorized security work — the cybersecurity branch.',
    logo: quiterootSecurityLogo,
    logoWidth: TEAM_LOGO_SIZE.width,
    logoHeight: TEAM_LOGO_SIZE.height,
    roles: [
      {
        id: 'QRS-LPT',
        title: 'Senior Penetration Tester',
        summary:
          'Client-facing offensive security delivery — scoping, rules of engagement, evidence, professional reporting and remediation guidance.',
        holder: {
          name: 'Peter Oriasotie',
          image: peterOriasotieImg,
          imageWidth: 720,
          imageHeight: 1080,
          location: 'Lagos, Nigeria',
          disciplines: ['Penetration testing', 'Exploit development', 'Security research'],
          bio: 'Senior penetration tester focused on exploitation, attack paths, and real-world security research from Lagos.',
          socials: {
            github: 'https://github.com/The-cyberX6',
            linkedin: 'https://www.linkedin.com/in/The-cyberX6/',
            twitter: 'https://x.com/The_cyberX6',
          },
        },
        openToApplications: false,
      },
      {
        id: 'QRS-JPT',
        title: 'Junior Penetration Tester',
        summary:
          'Documented offensive practice inside a lawful scope — lab work, capture-the-flag, structured write-ups and bug reports through an authorized channel. A supervised contributor track, with no client delivery.',
        holder: null,
      },
      {
        id: 'QRS-SR',
        title: 'Security Researcher',
        summary:
          'Original research with a documented method and finding — vulnerability analysis, technique research, or defensive analysis of a system.',
        holder: null,
      },
      {
        id: 'QRS-OSE',
        title: 'Offensive Security Engineer',
        summary:
          'Structured offensive security work — reconnaissance, attack-surface analysis, vulnerability validation and reporting — carried out only inside written authorization and agreed rules of engagement.',
        holder: null,
      },
      {
        id: 'QRS-STD',
        title: 'Security Tool Developer',
        summary:
          'Built tooling — a framework, scanner, parser or enumeration tool — with a test or conformance story.',
        holder: null,
      },
    ],
    note: 'No testing without written authorization. This applies to QuietRoot members exactly as it applies to client engagements.',
  },
];

/** Vacant roles a prospective member can actually apply for. */
export const QUIETROOT_OPEN_ROLES = QUIETROOT_TEAMS.flatMap((team) =>
  team.roles.filter((role) => role.holder === null),
);

export const QUIETROOT_ROLE_COUNT = QUIETROOT_TEAMS.reduce(
  (total, team) => total + team.roles.length,
  0,
);

export const QUIETROOT_TEAM_COUNT = QUIETROOT_TEAMS.length;