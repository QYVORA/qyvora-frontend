import type { WebLabScenario } from './web-lab-types';

/**
 * Offensive Security Methodology (QOSE-M01) — engagement discipline lab.
 *
 * Scenarios cover the two flagship M01 guided exercises: confirming the
 * scope and rules of engagement against a signed document, and building an
 * attack-surface map with testable hypotheses before any exploitation.
 * Both are simulated walkthroughs; the verifiable flag is captured from the
 * live lab container, not from this file.
 */
export const METHODOLOGY_SCENARIOS: WebLabScenario[] = [
  {
    id: 'meth-scope-1',
    name: 'Rules of Engagement',
    description:
      'A client engagement starts before the first packet. Verify that your authorization, scope boundaries, and test window are documented in writing — then prove you stayed inside them.',
    module: 'QOSE-M01',
    category: 'methodology',
    technique: 'Scope discipline & authorization',
    url: 'http://lab-methodology:8080',
    endpoint: 'GET /engagement/scope',
    difficulty: 'beginner',
    cpReward: 150,
    estimatedMinutes: 30,
    objectives: [
      'Locate the signed rules-of-engagement document',
      'Confirm which hosts and test windows are in scope',
      'Identify the decoy host that is explicitly out of scope',
      'Capture the authorization flag from the engagement portal',
    ],
    hints: [
      'The portal serves the engagement documents under /engagement/scope.',
      'Scope is a set, not a suggestion — every in-scope asset should appear in the signed document.',
      'One host on the subnet looks tempting but is named in the out-of-scope list.',
    ],
    villain: {
      name: 'Dana Reyes',
      alias: 'In Scope Spirit',
      description:
        'A rushed consultant who treats the rules of engagement as a formality and starts scanning "while the paperwork catches up".',
    },
    narrative: `> **Valkyrie:** "Rules of Engagement is the first guided lab in QOSE-M01 because every technique you learn later is defined by what the engagement lets you touch. Authorization is not paperwork around the work — it *is* the work's boundary."

A rules-of-engagement (RoE) document answers four questions before testing begins: **who** authorized it, **what** assets are in scope, **when** testing is allowed, and **how** findings and emergencies are reported. A test that skips this step is indistinguishable from an attack — to the client, to their ISP, and to the law.

## Why This Keeps Happens

Real engagements drift: a subdomain appears in a scan, it *feels* related, so it gets tested. The scope list exists precisely to stop that feeling from making decisions. If it is not in the signed document, it is not yours to touch — no matter how vulnerable it looks.

## Attack Flow

\`[Signed RoE]\` --> \`[Read scope + test window]\` --> \`[Inventory live hosts]\` --> \`[Match each host to the document]\` --> \`[Flag the out-of-scope decoy]\` --> \`[Capture authorization flag]\`

Work the exercise against the live lab and submit the flag from the engagement portal.`,
    steps: [
      {
        id: 'meth-scope-1-step-0',
        instruction: 'Fetch the engagement scope document from the portal.',
        command: `curl -s http://lab-methodology:8080/engagement/scope | jq .`,
        output: `{
  "engagement": "ACME-2026-01",
  "authorized_by": "ciso@acme.example",
  "signed_at": "2026-09-30",
  "test_window": "Mon-Fri 09:00-18:00 UTC",
  "in_scope": ["10.40.0.0/24"],
  "out_of_scope": ["10.40.0.12/32 (vendor-staging)"],
  "prohibited": ["denial of service", "social engineering of staff"]
}`,
        explanation:
          'The document names you (or your team) as authorized testers, fixes the test window, and lists the scope as a CIDR set. Note the explicit exception: one /32 inside the range is carved out and prohibited. Scope is defined by the *intersection* of the document and reality — not by what your scanner can reach.',
        quiz: [
          {
            id: 'meth-scope-1-q0',
            question: 'Your scan discovers 10.40.0.12 is running an outdated service. What does the RoE say?',
            options: [
              'Test it — it is inside 10.40.0.0/24, so it is fair game',
              'Do not touch it — it is explicitly listed as out of scope',
              'Test it quietly outside the test window',
              'Ask the vendor for permission instead of the client',
            ],
            correctIndex: 1,
            explanation:
              'The out-of-scope list carves specific assets out of the broader range. Reachable ≠ in scope; the signed document wins.',
          },
        ],
      },
      {
        id: 'meth-scope-1-step-1',
        instruction: 'Inventory the hosts actually live on the subnet and reconcile them against the document.',
        command: `nmap -sn 10.40.0.0/24`,
        output: `Nmap scan report for 10.40.0.1 (gateway)
Host is up (0.0021s latency).
Nmap scan report for 10.40.0.10 (lab-methodology)
Host is up (0.0034s latency).
Nmap scan report for 10.40.0.12 (vendor-staging)
Host is up (0.0029s latency).
Nmap done: 256 IP addresses (3 hosts up) scanned.`,
        explanation:
          'Three live hosts, but the document only authorizes the range minus the vendor-staging carve-out. Reconciliation — reality matched against the signed scope — is the step most skipped engagements skip. Anything you cannot place inside the authorized set is either out of scope or a finding for the scoping meeting, not a target.',
        quiz: [
          {
            id: 'meth-scope-1-q1',
            question: 'Why reconcile scan results against the RoE before touching anything?',
            options: [
              'To make the scan slower and more accurate',
              'Because reachable assets are not automatically authorized assets',
              'Because nmap output is usually wrong',
              'To find more out-of-scope hosts to test',
            ],
            correctIndex: 1,
            explanation:
              'Reachability and authorization are different questions. The RoE defines what you may test; the scan only shows what exists.',
          },
        ],
      },
      {
        id: 'meth-scope-1-step-2',
        instruction:
          'Confirm the test window, then request the authorization flag from the engagement portal.',
        command: `curl -s -X POST http://lab-methodology:8080/engagement/authorize \\
  -H 'Content-Type: application/json' \\
  -d '{"engagement":"ACME-2026-01","in_scope":["10.40.0.10"],"excluded":["10.40.0.12"],"window_ok":true}'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'The portal verifies that your declared working set matches the signed document: every asset you claim to test must be inside the authorized range, every carve-out must be excluded, and the request must fall inside the test window. Submit the returned flag to prove scope discipline end to end.',
        hint: 'Send the POST only after your working set excludes the vendor-staging host.',
      },
    ],
  },
  {
    id: 'meth-surface-1',
    name: 'Attack Surface Mapping',
    description:
      'Before exploitation comes a map: which hosts exist, which services answer, and which hypotheses are worth a controlled test. Build the surface map and capture the flag the portal releases to testers who show their work.',
    module: 'QOSE-M01',
    category: 'methodology',
    technique: 'Attack surface mapping',
    url: 'http://lab-methodology:8080',
    endpoint: 'POST /engagement/surface-map',
    difficulty: 'beginner',
    cpReward: 150,
    estimatedMinutes: 35,
    objectives: [
      'Enumerate hosts and services across the lab subnet',
      'Rank findings into testable hypotheses',
      'Record the surface map in the engagement portal',
      'Capture the surface-mapping flag',
    ],
    hints: [
      'Start with discovery (-sn), then move to service/version detection on live hosts.',
      'A hypothesis is a claim you can test: "the anonymous FTP share allows writes", not "FTP might be risky".',
      'The portal accepts your map at POST /engagement/surface-map.',
    ],
    villain: {
      name: 'Dana Reyes',
      alias: 'Spray and Pray',
      description:
        'The same consultant, now running untargeted exploit chains against everything reachable because "it is faster than thinking".',
    },
    narrative: `> **Valkyrie:** "Attack Surface Mapping closes QOSE-M01. A professional tester produces a *map* before an exploit: hosts, services, versions, and ranked hypotheses. The map is what makes the rest of the engagement reproducible — and what tells the client what you actually looked at."

An attack surface is the sum of everything an attacker could reach: hosts, ports, services, versions, exposed data, and trust relationships. Mapping it turns an amorphous "we scanned them" into a decision document — what is in the environment, what matters most, and which claims to test first.

## Why This Keeps Happens

Exploits without a map produce lucky findings and unverifiable reports. The map is also your defensive artifact: when the client asks "did you touch X?", the surface map is the answer — evidence of coverage, not a memory.

## Attack Flow

\`[Host discovery]\` --> \`[Service/version detection]\` --> \`[Rank hypotheses]\` --> \`[Record map in portal]\` --> \`[Capture flag]\`

Work the technique against the live lab and submit the flag from the portal response.`,
    steps: [
      {
        id: 'meth-surface-1-step-0',
        instruction: 'Discover live hosts on the engagement subnet.',
        command: `nmap -sn 10.40.0.0/24`,
        output: `Nmap scan report for 10.40.0.1 (gateway)
Host is up (0.0021s latency).
Nmap scan report for 10.40.0.10 (lab-methodology)
Host is up (0.0034s latency).
Nmap scan report for 10.40.0.12 (vendor-staging)
Host is up (0.0029s latency).
Nmap done: 256 IP addresses (3 hosts up) scanned.`,
        explanation:
          'Discovery first: three live hosts, one of them the out-of-scope carve-out from the previous scenario. Every later finding hangs off this inventory — hosts you never discovered cannot be reasoned about, and hosts you discovered but never tested must be disclosed as untested.',
        quiz: [
          {
            id: 'meth-surface-1-q0',
            question: 'What is the correct first move in attack-surface mapping?',
            options: [
              'Run every exploit module you have',
              'Host discovery — establish what actually exists',
              'Crack the first password hash you find',
              'Write the report and backfill the scan later',
            ],
            correctIndex: 1,
            explanation:
              'Mapping starts with an inventory. Exploitation, cracking, and reporting all depend on knowing what is in scope and what is live.',
          },
        ],
      },
      {
        id: 'meth-surface-1-step-1',
        instruction: 'Run service and version detection against the in-scope host.',
        command: `nmap -sV -Pn 10.40.0.10`,
        output: `Nmap scan report for lab-methodology (10.40.0.10)
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 9.2p1 Debian-2
8080/tcp open  http     nginx 1.24.0`,
        explanation:
          'Two services with versions: SSH and a web portal on 8080. Version strings are hypothesis fuel — "nginx 1.24.0 on the engagement portal" suggests testing the application surface, while exposed SSH suggests key policy checks rather than brute force (which the RoE often prohibits). A good hypothesis names a service, a claim, and a safe test.',
        quiz: [
          {
            id: 'meth-surface-1-q1',
            question: 'Which of these is a well-formed hypothesis?',
            options: [
              'The network probably has issues',
              'SSH might be weak',
              'The engagement portal on TCP/8080 may expose engagement data to unauthenticated GET requests',
              'We should try SQL injection everywhere',
            ],
            correctIndex: 2,
            explanation:
              'A testable hypothesis names the asset, the protocol, and a specific claim that a controlled request can confirm or refute.',
          },
        ],
      },
      {
        id: 'meth-surface-1-step-2',
        instruction:
          'Record your surface map and ranked hypotheses with the engagement portal to claim the flag.',
        command: `curl -s -X POST http://lab-methodology:8080/engagement/surface-map \\
  -H 'Content-Type: application/json' \\
  -d '{"engagement":"ACME-2026-01","hosts":["10.40.0.10"],"services":["ssh/22","http/8080"],"hypotheses":["portal exposes engagement data unauthenticated"]}'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'The portal accepts a map only when it is structured: live hosts you are authorized to test, the services observed on them, and at least one hypothesis phrased as a checkable claim. Submit the returned flag to complete the M01 methodology lab.',
        hint: 'Your map must list services from the real scan output — guessable entries are rejected.',
      },
    ],
  },
];
