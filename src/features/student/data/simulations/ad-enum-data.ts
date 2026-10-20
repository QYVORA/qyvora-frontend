import type { WebLabScenario } from './web-lab-types';

/**
 * Active Directory, Part 1: Foundations (QOSE-M09) — domain enumeration lab.
 *
 * Scenarios cover the two flagship M09 guided labs: anonymous LDAP
 * directory enumeration, and BloodHound graph collection to chart the
 * domain's attack paths. Both are simulated walkthroughs against the lab
 * domain controller; the verifiable flag is captured from the live lab
 * container, not from this file.
 */
export const AD_ENUM_SCENARIOS: WebLabScenario[] = [
  {
    id: 'ad-ldap-1',
    name: 'Anonymous LDAP Bind',
    description:
      'The lab domain controller answers LDAP binds without credentials. Enumerate users, groups, and the accounts that never change passwords — then capture the flag the directory exposes to unauthenticated readers.',
    module: 'QOSE-M09',
    category: 'ad-enum',
    technique: 'LDAP enumeration',
    url: 'http://lab-ad-enum:8080',
    endpoint: 'TCP/389 ldap',
    difficulty: 'intermediate',
    cpReward: 200,
    estimatedMinutes: 45,
    objectives: [
      'Bind to the directory without credentials',
      'Enumerate user and group objects',
      'Spot stale and privileged accounts in the results',
      'Capture the flag from the directory response',
    ],
    hints: [
      'An anonymous bind tests whether the server allows unauthenticated queries at all.',
      'Filter for objects of class user; the privileged accounts carry descriptive fields.',
      'The portal on TCP/8080 records enumeration results for the exercise.',
    ],
    villain: {
      name: 'Curtis Odum',
      alias: 'Legacy Bind',
      description:
        'A domain administrator who disabled "secure LDAP only" during a migration weekend in 2023 and never restored the setting.',
    },
    narrative: `> **Valkyrie:** "Active Directory Part 1 opens with the cheapest recon there is: LDAP. The directory exists to answer questions — who exists, what they belong to, which machines they touch. When a domain controller accepts unauthenticated binds, every question an attacker wants is available before a single credential is used."

LDAP is the address book of the Windows domain. A bind establishes who you are; some servers still allow *anonymous* binds, where "who you are" is nobody — and queries still succeed. From there, user objects (sAMAccountName, description, memberOf), groups, SPNs, and machine accounts paint a map of the environment: joinable groups, stale accounts, and where privilege concentrates.

## Why This Keeps Happens

Anonymous binds were normal in early Active Directory deployments and many networks never revisited them. The directory also leaks through *authenticated* low-privilege queries — a domain user can read most of it by default. Enumeration is not a breach; it is the protocol working. Hardening (anonymous access off, tiered read permissions) is what changes the answer.

## Attack Flow

\`[Anonymous bind to TCP/389]\` --> \`[Query users/groups]\` --> \`[Highlight privileged + stale accounts]\` --> \`[Record findings in portal]\` --> \`[Capture flag]\`

Work the technique against the lab domain controller and submit the flag from the directory.`,
    steps: [
      {
        id: 'ad-ldap-1-step-0',
        instruction: 'Attempt an anonymous bind and confirm what the directory allows.',
        command: `ldapsearch -x -H ldap://lab-ad-enum -b "" -s base namingContexts`,
        output: `# extended LDIF
#
dn: namingContexts
namingContexts: DC=corp,DC=qyvora,DC=lab
namingContexts: CN=Configuration,DC=corp,DC=qyvora,DC=lab

# search result: success (0)
# anonymous bind accepted`,
        explanation:
          'The server answered a query with no credentials and disclosed its naming contexts — the roots of everything it holds. That single response tells you enumeration will work and gives you the base DN for every filter that follows. A hardened directory refuses the bind or returns nothing without credentials.',
        quiz: [
          {
            id: 'ad-ldap-1-q0',
            question: 'What does an accepted anonymous bind indicate?',
            options: [
              'The directory is encrypted',
              'Unauthenticated clients can query directory contents',
              'The domain controller is offline',
              'LDAP cannot leak data',
            ],
            correctIndex: 1,
            explanation:
              'Anonymous bind acceptance means no authentication gate exists for reads — every subsequent query inherits that exposure.',
          },
        ],
      },
      {
        id: 'ad-ldap-1-step-1',
        instruction: 'Enumerate user objects and inspect their attributes for privileged and stale accounts.',
        command: `ldapsearch -x -H ldap://lab-ad-enum -b "DC=corp,DC=qyvora,DC=lab" \\
  "(objectClass=user)" sAMAccountName description memberOf lastLogon`,
        output: `dn: CN=svc-backup,CN=Users,DC=corp,DC=qyvora,DC=lab
sAMAccountName: svc-backup
description: Backup service account - password never expires
memberOf: CN=Domain Admins,CN=Users,DC=corp,DC=qyvora,DC=lab
lastLogon: 133849248000000000

dn: CN=jmartin,CN=Users,DC=corp,DC=qyvora,DC=lab
sAMAccountName: jmartin
description: Left the company 2025-11
memberOf: CN=Remote Desktop Users,CN=Users,DC=corp,DC=qyvora,DC=lab`,
        explanation:
          'The directory just told you the two accounts that matter most: a service account inside **Domain Admins** with a non-expiring password, and a disabled-in-principle account belonging to someone who left. Both descriptions are self-incriminating because humans write them for other admins — and LDAP delivers them to anyone who can read.',
        quiz: [
          {
            id: 'ad-ldap-1-q1',
            question: 'Why are description fields valuable during LDAP enumeration?',
            options: [
              'They contain password hashes',
              'Administrators document account purpose and rotation status there in free text',
              'They are required by the LDAP schema',
              'They reveal group policy passwords',
            ],
            correctIndex: 1,
            explanation:
              'Descriptions are unstructured admin notes — "password never expires", "left the company" — exactly the operational context an attacker ranks targets by.',
          },
        ],
      },
      {
        id: 'ad-ldap-1-step-2',
        instruction: 'Record your directory findings with the lab portal to capture the flag.',
        command: `curl -s -X POST http://lab-ad-enum:8080/enum/record \\
  -H 'Content-Type: application/json' \\
  -d '{"base_dn":"DC=corp,DC=qyvora,DC=lab","bind":"anonymous","users":247,"notable":["svc-backup in Domain Admins","stale jmartin account"]}'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'The portal accepts an enumeration record only when it reflects the real directory: the naming context you bound to, object counts, and at least one notable finding drawn from attributes you actually read. Submit the returned flag to complete the M09 LDAP scenario.',
        hint: 'The notable findings must come from the attributes returned in step 1.',
      },
    ],
  },
  {
    id: 'ad-bloodhound-1',
    name: 'Charting the Domain',
    description:
      'Point BloodHound collection at the lab domain, ingest the results, and read the graph it builds: shortest paths from a low-privilege foothold to domain administrative control.',
    module: 'QOSE-M09',
    category: 'ad-enum',
    technique: 'BloodHound graph collection',
    url: 'http://lab-ad-enum:8080',
    endpoint: 'POST /graph/path',
    difficulty: 'intermediate',
    cpReward: 250,
    estimatedMinutes: 50,
    objectives: [
      'Run a BloodHound collection against the lab domain',
      'Ingest the collected data and locate your foothold node',
      'Query the shortest path to Domain Admins',
      'Capture the flag from the graph analysis portal',
    ],
    hints: [
      'Use the collection with your current low-privilege context — no local admin needed for the default path.',
      'In BloodHound, search for your foothold user and run "Shortest Path to Domain Admins".',
      'The portal verifies your path description at POST /graph/path.',
    ],
    villain: {
      name: 'Curtis Odum',
      alias: 'Group Nesting',
      description:
        'A domain administrator who built access "temporarily" by nesting groups four levels deep — and lost track of what that granted.',
    },
    narrative: `> **Valkyrie:** "Charting the Domain is the second M09 exercise. BloodHound turns thousands of LDAP and ACL relationships into a graph and answers the only question that matters: *from where I sit, what is the shortest chain of relationships to Domain Admins?* Enumerating objects is data; the graph is a plan."

Active Directory privilege is relational: group membership, ACL grants, session history, service principal names, delegation. Each edge is legitimate on its own — an admin who needs backup access, a group nested into another group for a project. The graph exists because humans cannot hold those chains in their heads, and because attackers reason in chains, not in objects.

## Why This Keeps Happens

Access is granted forward and rarely revoked backward. Group nesting, "Domain Admins on this one server" exceptions, and forgotten service accounts accumulate into paths nobody designed. The collection itself is mostly *reads* — the same queries any authenticated user can make — which is why graphable exposure is the default, not an edge case.

## Attack Flow

\`[Authenticated collection]\` --> \`[Ingest graph]\` --> \`[Locate foothold node]\` --> \`[Shortest path to Domain Admins]\` --> \`[Capture flag]\`

Work the technique against the lab domain and submit the flag with your path description.`,
    steps: [
      {
        id: 'ad-bloodhound-1-step-0',
        instruction: 'Run a BloodHound collection using your current domain context.',
        command: `bloodhound-ce -d corp.qyvora.lab -c All --zip collected.zip`,
        output: `INFO: Resolved collection methods: Group, Session, LoggedOn, Trusts, ACL, Container, RDP, Object, PSRemote
INFO: Using DNS suffix corp.qyvora.lab
INFO: Found AD CS
INFO: Starting LDAP collection against DC=corp,DC=qyvora,DC=lab
INFO: Enumerated 247 users, 38 groups, 61 computers, 4 OUs
INFO: Collection completed in 43s -> collected.zip`,
        explanation:
          'One command produced a complete picture: users, groups, computers, ACLs, sessions, and trust data — all from queries your low-privilege account is *permitted* to make. The zip is raw relationship data; the graph appears when it is ingested.',
        quiz: [
          {
            id: 'ad-bloodhound-1-q0',
            question: 'What makes BloodHound collection possible for a standard domain user?',
            options: [
              'It exploits the DC to read the database',
              'AD grants authenticated users broad read access to directory relationships by default',
              'It requires Domain Admin rights to run',
              'It reads the NTDS.dit file directly',
            ],
            correctIndex: 1,
            explanation:
              'Default AD permissions let authenticated users read most objects and their relationships — the collection is protocol-conformant reads, not exploitation.',
          },
        ],
      },
      {
        id: 'ad-bloodhound-1-step-1',
        instruction: 'Ingest the data and query the shortest path from your foothold to Domain Admins.',
        command: `bloodhound-ui --query "MATCH p = shortestPath((u:User {name:'JMARTIN@CORP.QYVORA.LAB'})-[*1..]->(g:Group {name:'DOMAIN ADMINS@CORP.QYVORA.LAB'})) RETURN p"`,
        output: `Path found (3 hops):
  JMARTIN
    -> MemberOf: REMOTE-DESKTOP-USERS
    -> CanRDP: WS-FINANCE
    -> HasSession: SVC-BACKUP (logged on)
    -> MemberOf: DOMAIN-ADMINS
Edge count: 3 relationships, 4 nodes`,
        explanation:
          'The graph found what object-by-object reading almost never does: `jmartin` — the stale account from the LDAP scenario — reaches Domain Admins through three legitimate relationships. RDP rights on one workstation, a service account with an active session on it, and that service account\'s privileged group membership. Every edge was granted for a reason; the path was not.',
        quiz: [
          {
            id: 'ad-bloodhound-1-q1',
            question: 'Why does the graph find this path when humans miss it?',
            options: [
              'The graph has access to hidden data',
              'Each edge was granted individually for a legitimate reason — the composition is what nobody reviewed',
              'Humans cannot read LDAP output',
              'BloodHound guesses missing edges',
            ],
            correctIndex: 1,
            explanation:
              'Privilege accumulation is emergent: correct local decisions compose into unintended global paths, which is exactly what graph analysis surfaces.',
          },
        ],
      },
      {
        id: 'ad-bloodhound-1-step-2',
        instruction: 'Submit your path description to the analysis portal to capture the flag.',
        command: `curl -s -X POST http://lab-ad-enum:8080/graph/path \\
  -H 'Content-Type: application/json' \\
  -d '{"start":"JMARTIN@CORP.QYVORA.LAB","end":"DOMAIN ADMINS@CORP.QYVORA.LAB","hops":3,"via":["REMOTE-DESKTOP-USERS","WS-FINANCE","SVC-BACKUP"]}'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'The portal validates your submitted path against the lab graph — start node, end node, and the intermediate relationships must match real edges. Submit the returned flag to complete the M09 BloodHound scenario; M10 picks up where this path ends: exploiting the chain.',
        hint: 'The intermediate groups/hosts must be exactly the ones your query returned.',
      },
    ],
  },
];
