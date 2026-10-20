import type { WebLabScenario } from './web-lab-types';

/**
 * Network Security (QOSE-M06) — internal network attack lab.
 *
 * Scenarios cover the two flagship M06 guided labs: service enumeration
 * across a segmented internal network (SMB/FTP/SSH discovery with anonymous
 * access), and cleartext credential recovery from captured traffic. Both are
 * simulated walkthroughs; the verifiable flag is captured from the live lab
 * container, not from this file.
 */
export const NETWORK_SECURITY_SCENARIOS: WebLabScenario[] = [
  {
    id: 'net-svc-1',
    name: 'Service Enumeration',
    description:
      'You have landed inside a segmented internal network. Enumerate what is actually running, find the file server with anonymous access, and capture the flag hidden on the share.',
    module: 'QOSE-M06',
    category: 'network-security',
    technique: 'Network service enumeration',
    url: 'http://lab-network-security:8080',
    endpoint: 'TCP/445 smb, TCP/21 ftp',
    difficulty: 'intermediate',
    cpReward: 200,
    estimatedMinutes: 45,
    objectives: [
      'Discover live hosts on the internal subnet',
      'Detect services and versions on each host',
      'Find and connect to an anonymously accessible service',
      'Capture the flag from the exposed share',
    ],
    hints: [
      'Begin with host discovery across 10.50.0.0/24, then run service detection on everything live.',
      'The file server accepts SMB and FTP — anonymous logins are the first thing to test.',
      'Once connected, list the share contents before downloading anything.',
    ],
    villain: {
      name: 'Ronnie Baptiste',
      alias: 'Default Shares',
      description:
        'A systems administrator who joined the file server to the domain "temporarily" and left guest access enabled on two shares ever since.',
    },
    narrative: `> **Valkyrie:** "Network Security opens with what attackers actually do first inside a network: not exploitation — *enumeration*. Which hosts are alive, which services answer, which of them accept unauthenticated access. Most internal breaches begin with a share nobody meant to expose."

Service enumeration turns an IP range into a target list. Every open port is a claim about what the host does; every version banner is a claim about how it behaves. Anonymous and guest access — SMB shares, FTP servers, unprotected APIs — remain among the most common ways internal networks fall, because they are configuration debt, not software bugs.

## Why This Keeps Happens

Internal networks are hardened at the perimeter and neglected inside. Shares are created for a migration and never retired, service accounts keep default groups, and "everyone already knows it is there" keeps findings off the report. From the outside, the attacker's only job is to look.

## Attack Flow

\`[Host discovery]\` --> \`[Service/version detection]\` --> \`[Identify anonymous-access services]\` --> \`[Connect and list]\` --> \`[Capture flag from the share]\`

Work the technique against the live lab and submit the flag from the SMB share.`,
    steps: [
      {
        id: 'net-svc-1-step-0',
        instruction: 'Discover the live hosts on the internal segment.',
        command: `nmap -sn 10.50.0.0/24`,
        output: `Nmap scan report for 10.50.0.1 (gateway)
Host is up (0.0019s latency).
Nmap scan report for 10.50.0.10 (lab-network-security)
Host is up (0.0026s latency).
Nmap scan report for 10.50.0.20 (target-pc)
Host is up (0.0041s latency).
Nmap done: 256 IP addresses (3 hosts up) scanned.`,
        explanation:
          'Three live hosts: the gateway, a file server, and a workstation. Host discovery is cheap and defines the blast radius of everything that follows — services you never found can never be enumerated, misconfigured or otherwise.',
        quiz: [
          {
            id: 'net-svc-1-q0',
            question: 'Why start internal assessment with host discovery rather than exploitation?',
            options: [
              'Exploitation does not work inside networks',
              'You must know what exists before you can reason about what it exposes',
              'Discovery automatically patches the hosts',
              'Scanners refuse to run after exploitation',
            ],
            correctIndex: 1,
            explanation:
              'Enumeration builds the inventory; findings, risk, and coverage claims all derive from it. Exploitation first means guessing blind.',
          },
        ],
      },
      {
        id: 'net-svc-1-step-1',
        instruction: 'Run service and version detection across every live host.',
        command: `nmap -sV -Pn 10.50.0.0/24`,
        output: `Nmap scan report for lab-network-security (10.50.0.10)
PORT   STATE SERVICE       VERSION
21/tcp open  ftp           vsftpd 3.0.5
22/tcp open  ssh           OpenSSH 9.2p1
445/tcp open  microsoft-ds Samba 4.17.7

Nmap scan report for target-pc (10.50.0.20)
PORT     STATE SERVICE
445/tcp  open  microsoft-ds
3389/tcp open  ms-wbt-server`,
        explanation:
          'The file server exposes FTP and SMB — both protocols with long histories of anonymous and null-session access — plus SSH. The workstation shares SMB and RDP. Version banners (vsftpd 3.0.5, Samba 4.17.7) give you patch posture, but the first test is never a CVE: it is whether the services answer unauthenticated requests at all.',
        quiz: [
          {
            id: 'net-svc-1-q1',
            question: 'What should you test first on a freshly discovered SMB service?',
            options: [
              'A kernel exploit',
              'Null/anonymous access — list what is reachable without credentials',
              'Brute-force every account',
              'Drop the service offline',
            ],
            correctIndex: 1,
            explanation:
              'Configuration flaws come before memory corruption: anonymous access, null sessions, and guest-readable shares are the cheapest findings and the most common ones.',
          },
        ],
      },
      {
        id: 'net-svc-1-step-2',
        instruction: 'Connect to the anonymous share, list it, and capture the flag file.',
        command: `smbclient -N -L //10.50.0.10 && smbclient -N //10.50.0.10/flags -c 'ls; get FLAG.txt'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'No credentials were needed: the share allows guest access and exposes a flag file to anyone who can reach TCP/445. Anonymous SMB is not a vulnerability in the software — it is a configuration decision that outlived its justification. Submit the captured flag to complete the M06 enumeration scenario.',
        hint: 'The -N flag tells smbclient to attempt the connection with no credentials.',
      },
    ],
  },
  {
    id: 'net-traffic-1',
    name: 'Cleartext in the Wire',
    description:
      'A packet capture from the segment is on your workstation. Analyse the traffic, recover the credentials a legacy protocol transmitted in cleartext, and use them to capture the flag.',
    module: 'QOSE-M06',
    category: 'network-security',
    technique: 'Traffic analysis',
    url: 'http://lab-network-security:8080',
    endpoint: 'TCP/21 ftp',
    difficulty: 'intermediate',
    cpReward: 150,
    estimatedMinutes: 40,
    objectives: [
      'Load the capture and profile its protocols',
      'Follow the stream of a cleartext authentication exchange',
      'Extract the transmitted credentials',
      'Authenticate with them and capture the flag',
    ],
    hints: [
      'Open capture.pcapng in Wireshark and look at the protocol hierarchy first.',
      'FTP commands (USER/PASS) are plain text — follow the TCP stream of the control connection.',
      'The recovered account can authenticate to the same file server over FTP.',
    ],
    villain: {
      name: 'Ronnie Baptiste',
      alias: 'Plaintext Pete',
      description:
        'The same administrator who keeps a legacy FTP service alive because one old deployment script "still needs it".',
    },
    narrative: `> **Valkyrie:** "Cleartext in the Wire is the M06 traffic-analysis exercise. The lesson is not that FTP is old — it is that any protocol without transport encryption puts every credential it carries on the wire for anyone with a capture. Wireshark turns that exposure into a finding you can prove."

Legacy protocols — FTP, Telnet, HTTP Basic, SNMPv1/v2c, LDAP simple bind — transmit secrets in ways a passive observer can read. In an engagement, a packet capture is often worth more than an exploit: sessions, credentials, and internal hostnames fall out of it without ever touching the target actively.

## Why This Keeps Happens

Old protocols survive because something depends on them, and encryption gets deferred as "migration work". Meanwhile every scan of the segment records the same credentials, and the capture becomes a durable secret — anyone who ever saved the pcap holds them.

## Attack Flow

\`[Load capture]\` --> \`[Profile protocols]\` --> \`[Follow cleartext auth stream]\` --> \`[Extract credentials]\` --> \`[Authenticate, capture flag]\`

Work the technique against the live lab and submit the flag from the FTP response.`,
    steps: [
      {
        id: 'net-traffic-1-step-0',
        instruction: 'Profile the capture: what protocols are present, and which carry credentials?',
        command: `tshark -r capture.pcapng -q -z io,phs`,
        output: `Protocol Hierarchy Statistics
  eth                                    frames:412
    ip                                   frames:412
      tcp                                frames:408
        ftp                              frames:46
          ftp-request                     frames:21
          ftp-response                    frames:25
        http                             frames:18
      udp                                frames:4
        dns                              frames:4`,
        explanation:
          'The capture is dominated by TCP with a clear FTP conversation: request and response frames are dissected as their own protocols. FTP is cleartext by design — USER and PASS commands appear verbatim. The protocol hierarchy tells you where to look before you scroll through a single frame.',
        quiz: [
          {
            id: 'net-traffic-1-q0',
            question: 'Why does FTP credential recovery need no decryption?',
            options: [
              'FTP uses a broken cipher that Wireshark cracks',
              'FTP transmits commands and responses as cleartext — nothing to decrypt',
              'The capture includes the server key log',
              'FTP credentials are always public',
            ],
            correctIndex: 1,
            explanation:
              'FTP has no transport encryption at all: USER/PASS travel as plain TCP payload, so reading them is dissection, not cryptanalysis.',
          },
        ],
      },
      {
        id: 'net-traffic-1-step-1',
        instruction: 'Follow the FTP control stream and extract the authentication exchange.',
        command: `tshark -r capture.pcapng -Y 'ftp.request.command==USER || ftp.request.command==PASS' -T fields -e ftp.request.command -e ftp.request.arg`,
        output: `USER	anonymous
PASS	anonymous@
USER	deploy
PASS	summer-2019!`,
        explanation:
          'Two logins in the clear: a harmless anonymous probe and a real account — `deploy` with a reused personal password. That second exchange is a credential found without ever contacting the target, and it is the kind of secret that also tends to be reused across the estate.',
        quiz: [
          {
            id: 'net-traffic-1-q1',
            question: 'What makes the deploy account the valuable finding here?',
            options: [
              'It belongs to the administrator',
              'It is a real credential transmitted in cleartext, reusable elsewhere',
              'It appears twice in the capture',
              'Anonymous logins are illegal',
            ],
            correctIndex: 1,
            explanation:
              'Cleartext transmission makes the credential recoverable by anyone with the capture — and credentials are usually reused, so one capture can unlock more than one service.',
          },
        ],
      },
      {
        id: 'net-traffic-1-step-2',
        instruction: 'Authenticate to the FTP service with the recovered account and capture the flag.',
        command: `ftp deploy:summer-2019!@10.50.0.10 -c 'ls; get FLAG.txt'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'The recovered credential opens the restricted FTP directory that anonymous access could not reach, and the flag file is waiting inside. Submit it to complete the M06 traffic-analysis scenario — and remember the fix side: transport encryption (FTPS/SFTP) and credential rotation after any cleartext exposure.',
        hint: 'The account recovered from the capture is not the anonymous one.',
      },
    ],
  },
];
