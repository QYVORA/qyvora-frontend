export interface ToolReleaseNote {
  slug: string;
  version: string;
  releasedAt: string;
  highlights: string[];
}

/**
 * Release metadata for the QYVORA toolkit. Version tags and dates come from the
 * framework repositories; highlights summarise the top of each repository's
 * CHANGELOG. The changelog file stays the source of truth, so this page links to
 * it rather than duplicating the full entry.
 */
export const TOOL_RELEASE_NOTES: ToolReleaseNote[] = [
  {
    slug: 'anansi',
    version: 'v1.3.0',
    releasedAt: '2026-10-31',
    highlights: [
      'Interactive console with module context, history and tab completion.',
      '`capabilities` command with JSON/YAML output.',
      'Exploit-chain assembly ranks findings into kill paths.',
      'Unified version system across builds and releases.',
    ],
  },
  {
    slug: 'toha3ee',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      'New enumeration modules for SMTP, SNMP and LDAP.',
      'Live CVE lookups through the NVD REST API.',
      'OSINT expansion for ASN, Shodan and bucket checks.',
      'HTTP basic-auth credential spraying.',
    ],
  },
  {
    slug: 'shaka',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      '`capabilities` document with JSON/YAML output.',
      'ANSI colours are disabled when output is piped.',
      'Config and event errors no longer exit directly.',
    ],
  },
  {
    slug: 'nzinga',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      '430 human-centric username OSINT dork templates.',
      'Custom wordlist support for search sources.',
      'Extended target types including usernames.',
    ],
  },
  {
    slug: 'mansa',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      '`capabilities` document with JSON/YAML output.',
      'WLAN-005 aligned to the WPS checklist rule.',
      'Unified version system across builds and releases.',
    ],
  },
  {
    slug: 'aksum',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      'ELF identification: format, architecture, endianness, linking and PIE/NX.',
      'YAML and Markdown output across commands.',
      'Reduced weak-crypto false positives.',
    ],
  },
  {
    slug: 'sekhmet',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      'Full Markdown and HTML report output.',
      'Informational messages move to stderr for clean machine output.',
      '`capabilities` document with JSON/YAML output.',
    ],
  },
  {
    slug: 'jabari',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      '`capabilities` document with JSON/YAML output.',
      'ANSI colours are disabled when output is piped.',
      'Unified version system across builds and releases.',
    ],
  },
  {
    slug: 'amanirenas',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      'Shared tier grammar documented in root help.',
      'Event transport migrated to qyvora-events v0.2.0.',
    ],
  },
  {
    slug: 'imhotep',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      'Shared tier grammar documented in root help.',
      'Event transport migrated to qyvora-events v0.2.0.',
    ],
  },
  {
    slug: 'sundiata',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      'Shared tier grammar documented in root help.',
      'Event transport migrated to qyvora-events v0.2.0.',
    ],
  },
  {
    slug: 'timbuktu',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      'Shared tier grammar documented in root help.',
      'Event transport migrated to qyvora-events v0.2.0.',
    ],
  },
  {
    slug: 'kush',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      'Shared tier grammar documented in root help.',
      'Event transport migrated to qyvora-events v0.2.0.',
    ],
  },
  {
    slug: 'amina',
    version: 'v0.10.2',
    releasedAt: '2026-10-31',
    highlights: [
      'Shared tier grammar documented in root usage.',
      'SECURITY.md added.',
      'Event transport migrated to qyvora-events v0.2.0.',
    ],
  },
];
