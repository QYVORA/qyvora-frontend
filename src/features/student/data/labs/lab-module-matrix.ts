/**
 * QOSE lab ↔ module matrix (EX-BC-005).
 *
 * Single source of truth mapping the QYVORA Attack Labs to the stable QOSE
 * module IDs `QOSE-M01` … `QOSE-M12` declared in
 * `qyvora-docs/07-products/qose/curriculum/QOSE-3-MONTH-CURRICULUM.md`.
 *
 * Two views are exported:
 *  - `LAB_CATALOGUE`  — one row per lab, classified by discipline
 *                       (ethical-hacking vs web-app) and track.
 *  - `LAB_MODULE_MATRIX` — one row per module, listing its labs and whether
 *                       the module has interactive lab cover.
 *
 * The Markdown mirror lives at
 * `qyvora-docs/07-products/qose/curriculum/QOSE-LAB-MATRIX.md` and must be
 * kept in sync with this file.
 */

export type LabTrack =
  | 'ethical-hacking'
  | 'web-app'
  | 'api'
  | 'automation'
  | 'infrastructure'
  | 'active-directory'
  | 'capstone';

export type LabDiscipline = 'ethical-hacking' | 'web-app';

export type LabStatus = 'live' | 'new';

export type ModuleCoverage = 'covered' | 'partial' | 'uncovered';

export interface LabCatalogueEntry {
  /** `id` used in `LABS` and the route `/dashboard/labs/<labId>`. */
  labId: string;
  title: string;
  /** Primary module this lab anchors to. */
  module: string;
  track: LabTrack;
  discipline: LabDiscipline;
  status: LabStatus;
}

export interface LabModuleEntry {
  module: string;
  week: string;
  title: string;
  track: LabTrack;
  /** Lab ids (see `LAB_CATALOGUE`) that cover this module. */
  labs: string[];
  coverage: ModuleCoverage;
  note?: string;
}

export const LAB_CATALOGUE: LabCatalogueEntry[] = [
  {
    labId: 'web-access-control',
    title: 'Broken Access Control',
    module: 'QOSE-M03',
    track: 'web-app',
    discipline: 'web-app',
    status: 'new',
  },
  {
    labId: 'api-security',
    title: 'API Security',
    module: 'QOSE-M05',
    track: 'api',
    discipline: 'web-app',
    status: 'new',
  },
  {
    labId: 'automation',
    title: 'Security Automation',
    module: 'QOSE-M11',
    track: 'automation',
    discipline: 'ethical-hacking',
    status: 'new',
  },
  {
    labId: 'sqli',
    title: 'SQL Injection',
    module: 'QOSE-M04',
    track: 'web-app',
    discipline: 'web-app',
    status: 'live',
  },
  {
    labId: 'osint',
    title: 'OSINT Recon',
    module: 'QOSE-M02',
    track: 'ethical-hacking',
    discipline: 'ethical-hacking',
    status: 'live',
  },
  {
    labId: 'privesc',
    title: 'Privilege Escalation',
    module: 'QOSE-M07',
    track: 'ethical-hacking',
    discipline: 'ethical-hacking',
    status: 'live',
  },
  {
    labId: 'passwords',
    title: 'Password Cracking',
    module: 'QOSE-M10',
    track: 'active-directory',
    discipline: 'ethical-hacking',
    status: 'live',
  },
  {
    labId: 'killchain',
    title: 'Kill Chain',
    module: 'QOSE-M12',
    track: 'capstone',
    discipline: 'ethical-hacking',
    status: 'live',
  },
];

export const LAB_MODULE_MATRIX: LabModuleEntry[] = [
  {
    module: 'QOSE-M01',
    week: 'Week 1',
    title: 'Offensive Security Methodology',
    track: 'ethical-hacking',
    labs: [],
    coverage: 'uncovered',
    note: 'Engagement-scoping and attack-surface mapping exercise; no interactive lab shipped yet.',
  },
  {
    module: 'QOSE-M02',
    week: 'Week 2',
    title: 'Professional Reconnaissance',
    track: 'ethical-hacking',
    labs: ['osint'],
    coverage: 'covered',
  },
  {
    module: 'QOSE-M03',
    week: 'Week 3',
    title: 'Web Application Security I',
    track: 'web-app',
    labs: ['web-access-control'],
    coverage: 'covered',
  },
  {
    module: 'QOSE-M04',
    week: 'Week 4',
    title: 'Web Application Security II',
    track: 'web-app',
    labs: ['sqli'],
    coverage: 'covered',
  },
  {
    module: 'QOSE-M05',
    week: 'Week 5',
    title: 'Advanced Web & API Security',
    track: 'api',
    labs: ['api-security'],
    coverage: 'covered',
  },
  {
    module: 'QOSE-M06',
    week: 'Week 6',
    title: 'Network Security',
    track: 'infrastructure',
    labs: [],
    coverage: 'uncovered',
    note: 'Network enumeration is taught in HPB phase 3 rooms; no standalone attack lab yet.',
  },
  {
    module: 'QOSE-M07',
    week: 'Week 7',
    title: 'Linux + Windows Security',
    track: 'ethical-hacking',
    labs: ['privesc'],
    coverage: 'covered',
  },
  {
    module: 'QOSE-M08',
    week: 'Week 8',
    title: 'Wireless Security',
    track: 'infrastructure',
    labs: [],
    coverage: 'uncovered',
    note: 'Wireless simulation is planned; exploitation stays inside the controlled lab.',
  },
  {
    module: 'QOSE-M09',
    week: 'Weeks 8b–9',
    title: 'Active Directory, Part 1: Foundations',
    track: 'active-directory',
    labs: [],
    coverage: 'uncovered',
    note: 'Domain enumeration / BloodHound mapping lab not yet shipped.',
  },
  {
    module: 'QOSE-M10',
    week: 'Week 10',
    title: 'Active Directory, Part 2 + Enterprise Attack Paths',
    track: 'active-directory',
    labs: ['passwords'],
    coverage: 'partial',
    note: 'NTLM credential attacks are covered; Kerberos/lateral-movement path lab not yet shipped.',
  },
  {
    module: 'QOSE-M11',
    week: 'Week 11',
    title: 'Offensive Security Automation',
    track: 'automation',
    labs: ['automation'],
    coverage: 'covered',
  },
  {
    module: 'QOSE-M12',
    week: 'Week 12',
    title: 'Advanced Security Exposure + Capstone',
    track: 'capstone',
    labs: ['killchain'],
    coverage: 'covered',
  },
];

export const getLabsForModule = (module: string): LabCatalogueEntry[] =>
  LAB_CATALOGUE.filter((entry) => entry.module === module);

export const getLabCoverage = (module: string): ModuleCoverage =>
  LAB_MODULE_MATRIX.find((entry) => entry.module === module)?.coverage ?? 'uncovered';
