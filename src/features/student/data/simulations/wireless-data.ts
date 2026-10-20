import type { WebLabScenario } from './web-lab-types';

/**
 * Wireless Security (QOSE-M08) — WLAN attack lab.
 *
 * Scenarios cover the two flagship M08 guided labs: access-point discovery
 * and configuration assessment inside the controlled lab, and 802.11
 * frame/handshake capture analysis. Exploitation stays inside the lab's own
 * simulated wireless segment. The verifiable flag is captured from the live
 * lab container, not from this file.
 */
export const WIRELESS_SCENARIOS: WebLabScenario[] = [
  {
    id: 'wire-ap-1',
    name: 'Access Point Discovery',
    description:
      'Survey the simulated WLAN segment: discover access points and clients, read their advertised configuration, and identify the weak PSK setup hiding the flag.',
    module: 'QOSE-M08',
    category: 'wlan-security',
    technique: 'WLAN discovery & configuration assessment',
    url: 'http://lab-wireless:8080',
    endpoint: 'GET /ap/config',
    difficulty: 'beginner',
    cpReward: 150,
    estimatedMinutes: 35,
    objectives: [
      'Enumerate access points and their advertised parameters',
      'Read beacon/probe data for security configuration',
      'Identify the weak pre-shared-key setup',
      'Capture the flag from the AP configuration portal',
    ],
    hints: [
      'Start with a scan of the wireless segment — every AP advertises itself in beacons.',
      'Security posture lives in the advertised parameters: cipher, AKM, band, and SSID policy.',
      'The AP configuration portal answers on TCP/8080.',
    ],
    villain: {
      name: 'Iris Kowalczyk',
      alias: 'PSK-for-All',
      description:
        'An office manager who set up the WLAN with a password written on the whiteboard and never rotated it when staff turned over.',
    },
    narrative: `> **Valkyrie:** "Wireless Security runs half a week in the curriculum, and this lab is its first exercise: before you capture anything, you *survey*. Every access point broadcasts its own configuration to anyone within radio range — encryption, key management, band, even whether WPS is on. Listening is not intrusion; it is the air interface working as designed."

Wireless discovery has no analog in wired networks: the medium advertises itself. Beacons and probe responses disclose SSID, BSSID, supported rates, cipher suites, and AKM modes. That advertisement is exactly how a security assessment starts — the same data an attacker uses, obtained passively.

## Why This Keeps Happens

PSK networks are shared secrets: every person, guest, and IoT device holds the full key. One weak or leaked passphrase compromises the whole segment, and rotating it means touching every device. Enterprises moved to 802.1X for this reason; smaller setups keep writing the PSK on whiteboards.

## Attack Flow

\`[Scan the WLAN segment]\` --> \`[Read advertised AP parameters]\` --> \`[Identify the weak-PSK AP]\` --> \`[Query the AP portal]\` --> \`[Capture flag]\`

Work the exercise inside the simulated wireless lab and submit the flag from the AP portal.`,
    steps: [
      {
        id: 'wire-ap-1-step-0',
        instruction: 'Survey the wireless segment and list the advertised access points.',
        command: `wlan-survey --interface wlan0 --lab-segment 10.60.0.0/24`,
        output: `BSSID             SSID              CH  AKM       CIPHER     SIGNAL
9c:b6:d0:10:60:01 corp-secure        6   SAE       CCMP       -38 dBm
9c:b6:d0:10:60:02 corp-guest         11  PSK       CCMP       -51 dBm
9c:b6:d0:10:60:03 acme-lab-legacy    1   PSK       TKIP/CCMP  -64 dBm`,
        explanation:
          'Three APs, each advertising its security mode. `corp-secure` uses SAE (WPA3), `corp-guest` uses WPA2-PSK, and `acme-lab-legacy` still offers TKIP — a cipher deprecated for over a decade. The survey alone already ranks your targets: legacy configuration is the hypothesis worth testing first.',
        quiz: [
          {
            id: 'wire-ap-1-q0',
            question: 'Why can a passive survey reveal security posture?',
            options: [
              'APs encrypt their configuration for analysts',
              'Beacons and probe responses advertise SSID, cipher, and AKM in cleartext by design',
              'The lab router logs everything publicly',
              'WPA3 hides all parameters',
            ],
            correctIndex: 1,
            explanation:
              'The 802.11 management frames that announce a network are unencrypted — discovery is reading the medium as specified.',
          },
        ],
      },
      {
        id: 'wire-ap-1-step-1',
        instruction: 'Assess the advertised parameters of the legacy access point.',
        command: `wlan-assess --bssid 9c:b6:d0:10:60:03`,
        output: `AP: acme-lab-legacy (9c:b6:d0:10:60:03)
  AKM:            PSK (WPA2-Personal)
  Cipher:         TKIP/CCMP mixed  [FAIL] TKIP deprecated (WPA2 v2.0)
  PMF:            optional        [WARN] Protected Mgmt Frames not required
  WPS:            enabled         [FAIL] registrar attack surface
  PSK policy:     shared across 34 devices [WARN]
  Verdict:        WEAK`,
        explanation:
          'Mixed TKIP/CCMP, optional management-frame protection, WPS enabled, and one PSK shared across 34 devices — four independent findings from advertised data alone, no frames injected. This is the assessment half of wireless security: the capture exercise that follows exploits exactly the configuration this report describes.',
        quiz: [
          {
            id: 'wire-ap-1-q1',
            question: 'Which finding here is most immediately dangerous?',
            options: [
              'The SSID is unremarkable',
              'TKIP mixed mode plus WPS enabled on a PSK network',
              'The signal is -64 dBm',
              'The channel is 1',
            ],
            correctIndex: 1,
            explanation:
              'TKIP is broken and WPS exposes an offline-guessable PIN path; together on a shared-PSK network they give multiple routes to the segment key.',
          },
        ],
      },
      {
        id: 'wire-ap-1-step-2',
        instruction: 'Query the AP configuration portal to capture the flag.',
        command: `curl -s 'http://lab-wireless:8080/ap/config?bssid=9c:b6:d0:10:60:03'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'The portal confirms the weak configuration and releases the flag to testers who identified the right AP from survey data alone. Submit it to complete the M08 discovery scenario — the fix side of this finding is WPA3/SAE, PMF required, WPS off, and per-device credentials via 802.1X.',
        hint: 'Query by the BSSID your assessment flagged as WEAK.',
      },
    ],
  },
  {
    id: 'wire-capture-1',
    name: 'Handshake Capture',
    description:
      'Capture the four-way handshake of the legacy WLAN, prove you can verify it against a candidate key, and capture the flag the lab releases to testers who demonstrate the risk.',
    module: 'QOSE-M08',
    category: 'wlan-security',
    technique: '802.11 frame capture',
    url: 'http://lab-wireless:8080',
    endpoint: 'POST /handshake/verify',
    difficulty: 'intermediate',
    cpReward: 200,
    estimatedMinutes: 45,
    objectives: [
      'Capture the 802.11 four-way handshake for the target BSSID',
      'Identify the handshake messages and what each proves',
      'Verify a candidate PSK against the captured handshake',
      'Capture the verification flag',
    ],
    hints: [
      'Monitor-mode capture with a filter on the target BSSID — the handshake follows any client re-association.',
      'The four messages (M1–M4) carry the nonces and the encrypted proof of the PSK.',
      'The lab portal verifies your demonstration at POST /handshake/verify.',
    ],
    villain: {
      name: 'Iris Kowalczyk',
      alias: 'PSK-for-All',
      description:
        'The same manager whose whiteboard password has now been on the air for nineteen months — long enough for anyone in range to have recorded it.',
    },
    narrative: `> **Valkyrie:** "Handshake Capture is the second M08 exercise. The four-way handshake is where a PSK network *proves* knowledge of the key without transmitting it — and where a passive recorder gets everything needed to verify guesses offline. The handshake is a test vector that never expires."

When a client joins a WPA2-PSK network, AP and client exchange four EAPOL messages: fresh nonces on both sides (ANonce, SNonce), a Message Integrity Code, and an encrypted confirmation. With the capture in hand, anyone can derive the PTK from candidate passphrase + nonces and check the MIC — guessing happens offline, at dictionary speed, without touching the AP again.

## Why This Keeps Happens

The capture is passive and legal on your own networks: monitoring frames requires no interaction with the AP. Weak PSKs then fall to offline cracking because the protocol *design* makes verification cheap for everyone — that is the trade PSK networks make. Rotation or per-user 802.1X are the fixes; length alone only raises the guess count.

## Attack Flow

\`[Monitor-mode capture]\` --> \`[Client re-association triggers M1-M4]\` --> \`[Store handshake]\` --> \`[Verify candidate PSK offline]\` --> \`[Capture flag]\`

Work the technique against the simulated WLAN and submit the flag from the verification portal.`,
    steps: [
      {
        id: 'wire-capture-1-step-0',
        instruction: 'Capture the four-way handshake for the legacy BSSID in monitor mode.',
        command: `wlan-capture --iface wlan0mon --bssid 9c:b6:d0:10:60:03 --write handshakes.pcap`,
        output: `[*] monitoring channel 1 for 9c:b6:d0:10:60:03 ...
[+] beacon frame captured (acme-lab-legacy)
[+] probe request/response pair captured
[+] EAPOL M1 (ANonce set)
[+] EAPOL M2 (SNonce + MIC)
[+] EAPOL M3 (ANonce confirm)
[+] EAPOL M4 (MIC)
[+] 4-way handshake complete -> handshakes.pcap`,
        explanation:
          'All four EAPOL messages are in the capture: M1/M3 carry the AP nonce, M2/M4 carry the client nonce and integrity codes. The handshake is complete — you never authenticated, never associated, and never sent anything the AP would log as a connection attempt.',
        quiz: [
          {
            id: 'wire-capture-1-q0',
            question: 'What does a completed four-way handshake give a passive attacker?',
            options: [
              'The PSK in plaintext',
              'Nonces and MICs sufficient to verify PSK guesses offline',
              'The AP administrative password',
              'Nothing usable without a live connection',
            ],
            correctIndex: 1,
            explanation:
              'The handshake does not reveal the key — it reveals enough material to *test* candidate keys offline at dictionary speed, which is fatal for weak passphrases.',
          },
        ],
      },
      {
        id: 'wire-capture-1-step-1',
        instruction: 'Verify a candidate PSK against the captured handshake.',
        command: `wlan-verify --pcap handshakes.pcap --bssid 9c:b6:d0:10:60:03 --wordlist lab-wordlist.txt`,
        output: `[*] testing 500 candidate keys ...
[+] MATCH: 'summer-2019!' derives PTK whose MIC matches EAPOL M2
[*] verified in 1.8s — offline, no AP contact
[!] note: rotation would invalidate this capture but not copies held elsewhere`,
        explanation:
          'One candidate key reproduces the MIC in the captured M2 — the PSK is confirmed without a single frame sent to the AP. This is the whole risk of PSK networks in one line: the verification loop is offline, silent, and repeatable against every historical capture an adversary holds.',
        quiz: [
          {
            id: 'wire-capture-1-q1',
            question: 'How does the AP detect that its PSK is being cracked offline?',
            options: [
              'It logs each guess automatically',
              'It cannot — verification never touches the AP',
              'Rate limiting stops dictionary attacks',
              'WPA2 MICs alert the administrator',
            ],
            correctIndex: 1,
            explanation:
              'Offline verification uses only the captured frames; the AP is never contacted, so it has nothing to observe or rate-limit.',
          },
        ],
      },
      {
        id: 'wire-capture-1-step-2',
        instruction: 'Submit the verified handshake demonstration to the lab portal for the flag.',
        command: `curl -s -X POST http://lab-wireless:8080/handshake/verify \\
  -H 'Content-Type: application/json' \\
  -d '{"bssid":"9c:b6:d0:10:60:03","eapol_messages":4,"verified":true}'`,
        output: `<redacted — captured from the lab target and submitted to the platform for verification>`,
        explanation:
          'The portal releases the flag to testers who demonstrate a complete, verified handshake capture — proof you understood the mechanism, not just the tool invocation. Submit it to complete the M08 wireless lab.',
        hint: 'Your demonstration must report all four EAPOL messages as captured.',
      },
    ],
  },
];
