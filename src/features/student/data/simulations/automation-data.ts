import type { WebLabScenario } from './web-lab-types';

/**
 * Offensive Security Automation (QOSE-M11) — tooling lab.
 *
 * Scenarios cover the two M11 engineering projects that students must ship:
 * a Python port scanner and a Bash HTTP enumerator. The point is engineering
 * discipline — build a small, reliable tool, then use it against a target.
 * Flags are captured from the live lab container, not from this file.
 */
export const AUTOMATION_SCENARIOS: WebLabScenario[] = [
  {
    id: 'auto-portscanner-1',
    name: 'Python Port Scanner',
    description:
      'Write a small concurrent TCP port scanner in Python, run it against the target, and use the open ports to find the service that carries the flag.',
    module: 'QOSE-M11',
    category: 'automation',
    technique: 'Python · sockets',
    url: 'http://lab-automation:2200',
    endpoint: 'TCP connect scan (target 10.10.0.10)',
    difficulty: 'beginner',
    cpReward: 150,
    estimatedMinutes: 60,
    objectives: [
      'Write a Python TCP connect scanner',
      'Scan the target range concurrently',
      'Identify the service behind the unusual high port',
      'Capture the flag from the service banner',
    ],
    hints: [
      'A connect scan is just `socket.connect_ex` and a timeout.',
      'Use `concurrent.futures.ThreadPoolExecutor` so the scan does not take a minute.',
      'One of the open ports is not a standard service — read its banner.',
    ],
    villain: {
      name: 'The Ops Team',
      alias: 'Manual Mode',
      description:
        'An operations team that has never automated a single check and insists that "a technician will run through the list by hand".',
    },
    narrative: `> **Valkyrie:** "Automation is the difference between an analyst and a technician. A technician runs one command and waits. An analyst writes the command once and lets it run across the whole range. This module is not a programming course — it is about making your offensive work faster and more reliable."

A **port scanner** is the canonical first tool. It teaches the loop every automation project shares: take input, do a network operation, collect the result, format it for a human. Write it once in Python and you will reuse the pattern for enumerators, collectors and report generators.

## Why a Connect Scan First

A plain TCP connect scan is slow but correct — it completes the three-way handshake and tells you exactly what a normal client would see. Concurrency fixes the slowness. Start correct, then make it fast; not the other way round.

## Attack Flow

\`[Build scanner]\` --> \`[Thread pool over ports]\` --> \`[Collect open ports]\` --> \`[Banner grab]\` --> \`[Capture flag]\`

Build the tool, run it against the live lab, and submit the flag from the service banner.`,
    steps: [
      {
        id: 'auto-portscanner-1-step-0',
        instruction: 'Write and run the scanner against the lab target.',
        command: `cat > scan.py <<'PY'
import socket
from concurrent.futures import ThreadPoolExecutor

def scan(host, port, timeout=0.5):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)
        if s.connect_ex((host, port)) == 0:
            return port
    return None

HOST = "10.10.0.10"
with ThreadPoolExecutor(max_workers=100) as pool:
    open_ports = [p for p in pool.map(lambda p: scan(HOST, p), range(1, 1025)) if p]
print("open:", open_ports)
PY
python3 scan.py`,
        output: `open: [22, 80, 2200]`,
        explanation:
          'The scanner found SSH (22), HTTP (80) and an unusual service on **2200**. The concurrency keeps a 1024-port sweep under a few seconds. Notice the tool prints a clean, parseable result — that discipline is what lets you chain it into later stages.',
        quiz: [
          {
            id: 'auto-portscanner-1-q0',
            question: 'Why is a TCP connect scan a reasonable first tool to build?',
            options: [
              'It is the fastest possible scan',
              'It is simple and unambiguous — it completes the handshake exactly like a normal client',
              'It evades all firewalls',
              'It does not require a network connection',
            ],
            correctIndex: 1,
            explanation:
              'A connect scan is easy to reason about and gives ground truth. Optimisation and stealth can follow once correctness is established.',
          },
        ],
      },
      {
        id: 'auto-portscanner-1-step-1',
        instruction: 'Grab the banner from the unknown high port.',
        command: `python3 - <<'PY'
import socket
s = socket.create_connection(("10.10.0.10", 2200), timeout=2)
s.sendall(b"\\n")
print(s.recv(256).decode(errors="replace"))
s.close()
PY`,
        output: `AUTOMATION-SVC/1.0 ready
flag: <redacted — returned by the live lab>`,
        explanation:
          'The service on port 2200 greets every connection with a banner that includes the lab flag. Banner grabbing is the natural second half of a scanner: open ports are only interesting once you know what answers on them. The live container returns the real flag; it is redacted here so no flag ships in the frontend.',
        quiz: [
          {
            id: 'auto-portscanner-1-q1',
            question: 'What is the main engineering lesson of this lab?',
            options: [
              'Port scanning is illegal',
              'Automate the boring work once, then reuse it reliably',
              'Python is faster than Bash',
              'Banners are always truthful',
            ],
            correctIndex: 1,
            explanation:
              'The M11 goal is offensive engineering: write a small, reliable tool once and reuse it, rather than repeating manual steps.',
          },
        ],
      },
      {
        id: 'auto-portscanner-1-step-2',
        instruction: 'Submit the flag from the service banner.',
        command: `python3 - <<'PY'
# The banner above is what the live lab returns.
# Copy the flag value and submit it below.
PY`,
        output: `automation/port-scanner — flag captured`,
        explanation:
          'Submitting the flag verifies you built a working scanner and reached the service. The flag lives server-side; the client never sees its value.',
      },
    ],
  },
  {
    id: 'auto-httpenum-1',
    name: 'Bash HTTP Enumerator',
    description:
      'Build a Bash wrapper around a wordlist to enumerate paths on the target web server, find the hidden admin directory, and capture the flag.',
    module: 'QOSE-M11',
    category: 'automation',
    technique: 'Bash · pipelines',
    url: 'http://lab-automation:2200',
    endpoint: 'GET http://10.10.0.10/<path>',
    difficulty: 'beginner',
    cpReward: 150,
    estimatedMinutes: 50,
    objectives: [
      'Build an HTTP enumeration loop in Bash',
      'Drive it from a wordlist',
      'Find the hidden administration path',
      'Capture the flag from the hidden endpoint',
    ],
    hints: [
      'A loop plus `curl -s -o /dev/null -w "%{http_code}"` is enough to enumerate.',
      'Filter for a 200 among the 404s instead of reading every line.',
      'The hidden path is an admin console — read its body, not just its status.',
    ],
    villain: {
      name: 'The Ops Team',
      alias: 'Manual Mode',
      description:
        'The same team that browses every URL by hand and wonders why enumeration takes all afternoon.',
    },
    narrative: `> **Valkyrie:** "The second automation project is a Bash HTTP enumerator. Bash is already on every target and every workstation, and pipes make it trivial to turn a wordlist into a sweep. The lesson is the same as with Python: write it once, run it everywhere."

An **HTTP enumerator** loops over a wordlist, requests each candidate path, and reports the interesting ones. It is the bread and butter of web reconnaissance and it is only about twenty lines.

## Why Bash

Python gives you structure and libraries; Bash gives you ubiquity and composability. A one-liner loop with \`curl\` and \`grep\` is often the fastest path to an answer. Knowing both lets you pick the right tool for the job.

## Attack Flow

\`[Wordlist]\` --> \`[Loop + curl status codes]\` --> \`[Filter 200s]\` --> \`[Read admin path]\` --> \`[Capture flag]\`

Build the enumerator, run it against the live lab, and submit the flag from the hidden console.`,
    steps: [
      {
        id: 'auto-httpenum-1-step-0',
        instruction: 'Enumerate the path wordlist against the target.',
        command: `cat > words.txt <<'EOF'
admin
backup
console
login
robots.txt
server-status
EOF

while read -r p; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://10.10.0.10/$p")
  [ "$code" = "200" ] && echo "200 /$p"
done < words.txt`,
        output: `200 /admin
200 /robots.txt`,
        explanation:
          'The loop requests each candidate and prints only the 200s. Two paths stand out: `robots.txt` (always worth reading — it often lists paths the author wanted to hide) and `/admin`. Filtering instead of dumping every status code is what makes the output useful.',
        quiz: [
          {
            id: 'auto-httpenum-1-q0',
            question: 'Why filter for 200 responses instead of printing every status code?',
            options: [
              'To hide errors from the operator',
              'To surface the paths that actually exist so the result is usable',
              'Because curl cannot print 404s',
              'To make the script shorter',
            ],
            correctIndex: 1,
            explanation:
              'The enumerator\'s output must be directly actionable. Reporting only interesting responses is a core automation-design decision.',
          },
        ],
      },
      {
        id: 'auto-httpenum-1-step-1',
        instruction: 'Read the hidden administration path.',
        command: `curl -s 'http://10.10.0.10/admin'`,
        output: `<!doctype html>
<h1>Automation Lab Console</h1>
<p>flag: <redacted — returned by the live lab></p>`,
        explanation:
          'The `/admin` console is reachable without authentication and prints the lab flag in its body. The live container returns the real value; it is redacted here so no flag ships in the frontend. Copy the flag and submit it below.',
        quiz: [
          {
            id: 'auto-httpenum-1-q1',
            question: 'What did the enumerator actually change about this discovery?',
            options: [
              'It guessed the password',
              'It replaced a manual browse with a repeatable, wordlist-driven sweep',
              'It exploited the server',
              'It blocked the login page',
            ],
            correctIndex: 1,
            explanation:
              'No exploit was needed — the path was simply hidden. Automation turned a tedious manual search into a repeatable check.',
          },
        ],
      },
      {
        id: 'auto-httpenum-1-step-2',
        instruction: 'Submit the flag from the admin console.',
        command: `# The /admin body above is what the live lab returns.
# Copy the flag value and submit it below.`,
        output: `automation/http-enum — flag captured`,
        explanation:
          'Submitting the flag verifies the enumerator works and reached the hidden path. As always, the flag is verified server-side.',
      },
    ],
  },
];
