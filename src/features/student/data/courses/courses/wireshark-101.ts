import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('ws-1', 'What is Wireshark?',
      `**Wireshark** is the world's most popular network protocol analyzer. It captures packets in real time and displays them in human-readable form.

Think of it as a microscope for your network traffic. Every packet traveling in or out of your computer can be inspected.

\`\`\`bash
# Install Wireshark
sudo apt install wireshark

# Add your user to the wireshark group (to capture without root)
sudo usermod -aG wireshark $USER
# Log out and back in for this to take effect
\`\`\`

**Wireshark's main interface:**
1. **Packet List** — summary of captured packets (time, source, dest, protocol, info)
2. **Packet Details** — decoded protocol information for the selected packet
3. **Packet Bytes** — raw hex and ASCII of the packet

When you first open Wireshark, it shows a list of network interfaces. Choose the one you want to capture from (likely \`eth0\` for wired or \`wlan0\` for Wi-Fi).

\`\`\`bash
# Command-line version for remote/headless capture
            tshark -i eth0 -c 100    # Capture 100 packets
\`\`\`

> **Why this matters for hacking:** Wireshark is the foundation of network forensics. Every security analyst needs to understand packet capture — it's how you detect data exfiltration, C2 beaconing, DNS tunneling, and ARP spoofing. When an incident occurs, the packet capture is the definitive record of what happened. In CTF challenges, pcap analysis is a common skill tested during forensics challenges.

**Mini-challenge:** Run \`ping -c 4 scanme.nmap.org && tshark -i any -c 10 -w /tmp/test.pcap 2>/dev/null; tshark -r /tmp/test.pcap 2>/dev/null | head -5\` to capture and analyze your first packets. If tshark is not available, install with \`sudo apt install tshark\`.`),

    l('ws-2', 'Capturing Traffic',
      `**Capturing** is the process of recording network packets as they pass through an interface.

\`\`\`bash
# List available interfaces
tshark -D

# Start capturing on an interface
tshark -i eth0

# Capture with a file output (stop at 1000 packets or 10MB)
tshark -i eth0 -c 1000 -w capture.pcapng

# Read a saved capture
tshark -r capture.pcapng
\`\`\`

In the Wireshark GUI:
1. Click the blue shark fin icon to start capturing
2. Click the red square to stop
3. File → Save to save the capture

**Important concepts:**

**Promiscuous mode** — captured packets not just to/from your machine, but ALL packets the network interface sees. This is how Wireshark sees other devices' traffic on a hub or unswitched network.

**Monitor mode** (Wi-Fi) — captures wireless packets without associating with a network. This allows you to see all Wi-Fi traffic in range.

\`\`\`bash
# Capture in monitor mode (requires special setup)
sudo airmon-ng start wlan0
sudo tshark -i wlan0mon
\`\`\`

> **Why this matters for hacking:** Capture strategy determines what evidence you collect. Promiscuous mode lets you see all traffic on a network segment (hub or ARP-spoofed). Monitor mode on Wi-Fi captures packets from all nearby access points — essential for wireless security assessments. When investigating an incident, capture from the most strategic point (edge router, DMZ switch, or endpoint) based on the type of traffic you need to observe. Always capture to a file with rotation (\`-b filesize:10000 -b files:5\`) to avoid filling the disk.

**Mini-challenge:** Run \`tshark -D\` to list available interfaces. Then \`tshark -i any -c 50 -w /tmp/capture.pcapng\` and generate some traffic (\`curl https://example.com\`). Read the file with \`tshark -r /tmp/capture.pcapng | head -10\`. This is the exact workflow for collecting evidence during an investigation.

**Best practice:** Save your captures (\`.pcapng\` files) so you can analyze them later without needing to re-capture.`),

    l('ws-3', 'Display Filters',
      `In a busy network, thousands of packets fly by every second. **Display filters** let you focus on exactly what you need.

\`\`\`bash
# In Wireshark, type these into the filter bar at the top
# Or use tshark with -Y

# Show only HTTP traffic
http

# Show traffic to/from a specific IP
ip.addr == 192.168.1.1

# Show traffic on a specific port
tcp.port == 443

# Show only DNS queries
dns

# Show only TCP SYN packets
tcp.flags.syn == 1 and tcp.flags.ack == 0

# Combine filters
ip.addr == 10.0.0.1 and http
\`\`\`

\`\`\`bash
# tshark equivalents
tshark -r capture.pcapng -Y "http"
tshark -r capture.pcapng -Y "ip.addr == 192.168.1.1"
\`\`\`

**Useful filter examples:**

\`\`\`
# Exclude broadcast/multicast noise
!broadcast and !multicast

# Find large packets (useful for file transfers)
frame.len > 1000

# Find login credentials (HTTP basic auth)
http.authorization

# Find POST requests with form data
http.request.method == POST

# Find HTTP traffic from a specific host
http.host == example.com

# Find failed SSH logins
ssh.failed_authentication
\`\`\`

> **Why this matters for hacking:** Display filters turn a wall of noise into actionable intelligence. On a typical network capture, 90% of traffic is background noise (broadcasts, ARP, mDNS). Filters like \`!broadcast and !multicast\` remove noise. Protocol-specific filters (\`http\`, \`dns\`, \`tls\`) isolate only what you care about. The \`frame contains "password"\` filter is a quick way to find plaintext credentials. Combining filters with boolean operators (\`and\`, \`or\`, \`not\`) enables precise forensic queries.

**Mini-challenge:** Run \`tshark -r /tmp/capture.pcapng -Y "http" 2>/dev/null | head -10\` to filter HTTP traffic from your test capture. Then \`tshark -r /tmp/capture.pcapng -Y "dns" 2>/dev/null | head -10\` to see DNS queries. Practice combining filters like \`tshark -r /tmp/capture.pcapng -Y "ip.addr != 127.0.0.1" 2>/dev/null | head -5\`.

Wireshark highlights matching packets in green. The filter expression is evaluated for each packet — if it's true, the packet is shown.`),

    l('ws-4', 'Following Streams',
      `**Following a TCP stream** reconstructs the entire conversation between two hosts. Instead of seeing individual packets, you see the complete data exchange.

In Wireshark GUI:
1. Right-click any packet in a TCP conversation
2. Follow → TCP Stream
3. The entire conversation appears in a new window

\`\`\`bash
# tshark equivalent — extract TCP stream data
tshark -r capture.pcapng -z follow,tcp,ascii,0
# The 0 is the stream index
\`\`\`

**What following a stream reveals:**

\`\`\`http
GET /login HTTP/1.1
Host: example.com
Cookie: session=abc123

HTTP/1.1 200 OK
Content-Type: text/html

<html>
<form action="/login" method="POST">
  <input name="username">
  <input name="password" type="password">
</form>
</html>
\`\`\`

You can reconstruct entire HTTP requests and responses, FTP file transfers, SMTP emails, and more.

**HTTP Stream example:**
\`\`\`http
GET /secret.txt HTTP/1.1
Host: internal-server.local

HTTP/1.1 200 OK
Content-Type: text/plain

FLAG{network_traffic_is_not_private}
\`\`\`

**HTTP/2 streams** work differently — use "Follow → HTTP/2 Stream" instead.

> **Why this matters for hacking:** Following TCP streams is one of the most powerful Wireshark features for security analysis. When investigating a breach, reconstructing the TCP stream shows you exactly what data was exchanged — including credentials, session tokens, and file contents sent in plaintext. HTTP streams reveal login forms, API responses, and hidden endpoints. In CTFs, following streams often reveals flags transmitted in network conversations that would be invisible looking at individual packets.

**Mini-challenge:** Generate HTTP traffic with \`curl -v http://example.com\` while capturing (\`tshark -i any -c 100 -w /tmp/http.pcapng\`). Then use the filter approach: \`tshark -r /tmp/http.pcapng -Y "tcp.stream eq 0" -z follow,tcp,ascii,0 2>/dev/null | head -30\` to reconstruct the first TCP conversation. This is how forensic analysts extract evidence from captures.

Following streams is how you find passwords, API keys, and sensitive data transmitted in plaintext. If you find HTTPS traffic, it will be encrypted and unreadable (unless you've configured Wireshark with the SSL/TLS keys).`),

    l('ws-5', 'Analyzing HTTP Traffic',
      `HTTP is the most common unencrypted protocol you'll encounter. Here's how to analyze it in Wireshark.

**Identify HTTP traffic:**
\`\`\`
# Filter: show only HTTP requests
http.request

# Show HTTP responses
http.response

# Show a specific request method
http.request.method == GET
http.request.method == POST
\`\`\`

**Inspect a GET request:**
\`\`\`http
GET /products?id=42 HTTP/1.1
Host: shop.example.com
User-Agent: Mozilla/5.0
Accept: text/html
Cookie: session=eyJ1c2VyIjoiYWRtaW4ifQ==
\`\`\`

The \`Cookie\` header contains a Base64-encoded JSON blob. Decode it:

\`\`\`bash
echo "eyJ1c2VyIjoiYWRtaW4ifQ==" | base64 -d
# {"user":"admin"}
\`\`\`

**Inspect a POST request (login form):**
\`\`\`http
POST /login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=admin&password=secret123
\`\`\`

Plaintext credentials in the request body. This is why HTTPS exists.

**Statistic tools in Wireshark:**
- Statistics → HTTP → Requests — see all URLs requested
- Statistics → HTTP → Load Distribution — which servers get the most traffic
- Statistics → Protocol Hierarchy — see which protocols use the most bandwidth

\`\`\`bash
# tshark HTTP analysis
tshark -r capture.pcapng -Y "http.request" -T fields \\
            -e http.host -e http.request.uri -e http.request.method
\`\`\`

> **Why this matters for hacking:** HTTP analysis in Wireshark is essential for finding plaintext credentials, session tokens, and sensitive data. The \`http.authorization\` filter catches Basic Auth credentials (Base64-encoded but easily decoded). The \`http.request.method == POST\` filter catches form submissions that often contain passwords. In bug bounty hunting, examining HTTP traffic through Wireshark (or Burp) reveals API endpoints, authentication mechanisms, and hidden functionality not visible in the browser's DevTools.

**Mini-challenge:** Run \`curl --user admin:secret123 http://httpbin.org/basic-auth/admin/secret123\` while capturing (\`tshark -i any -c 50 -w /tmp/auth.pcapng\`). Then find the credentials: \`tshark -r /tmp/auth.pcapng -Y "http.authorization" -T fields -e http.authorization 2>/dev/null\`. Decode the Base64 with \`echo "<value>" | base64 -d\` — you'll see \`admin:secret123\`. This is how attackers harvest credentials from network traffic.

This extracts the host, URI, and method from every HTTP request in the capture.`),

    l('ws-6', 'Identifying Malicious Traffic',
      `Wireshark is an essential tool for network forensics. Here are patterns to look for.

**1. Unusual outbound connections:**

\`\`\`bash
# Filter for traffic to suspicious destinations
ip.dst != 192.168.0.0/16 and ip.dst != 10.0.0.0/8 and tcp.port == 4444
\`\`\`

Port 4444 is commonly used by Metasploit reverse shells.

**2. Beaconing (C2 traffic):**
Beaconing is regular, periodic traffic to a command-and-control server.

\`\`\`
# Look for traffic with consistent timing
# Filter by destination IP, then check "Time" column
# Regular intervals (every 60 seconds) = beaconing
\`\`\`

**3. DNS tunneling:**
\`\`\`
# Filter for DNS queries with unusually long hostnames
dns.qry.name.len > 50

# Or base64-encoded subdomains
dns.qry.name matches "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"
\`\`\`

**4. Port scanning:**
\`\`\`
# Many SYN packets to different ports from one IP
tcp.flags.syn == 1 and tcp.flags.ack == 0 and !icmp
# Group by destination port — many different ports = scanning
\`\`\`

**5. Large data exfiltration:**
\`\`\`
# Unusually large outbound packets
ip.dst != 192.168.0.0/16 and frame.len > 1500

# Or large DNS responses
dns and dns.len > 200
\`\`\`

**6. ARP spoofing:**
\`\`\`
# Multiple IPs mapping to the same MAC address
arp.duplicate-address-detected
\`\`\`

**Always correlate** suspicious traffic with other evidence. A single strange packet doesn't confirm an attack, but patterns of unusual behavior are worth investigating.

> **Why this matters for hacking:** Malicious traffic identification is the core skill for blue team analysts. Beaconing traffic to C2 servers is the most common indicator of compromise — regular HTTP/HTTPS requests at consistent intervals (every 60 seconds) to a suspicious domain. DNS tunneling encodes data in subdomain queries (\`base64data.evil.com\`) and bypasses most firewalls. ARP spoofing detection (\`arp.duplicate-address-detected\`) catches man-in-the-middle attacks. In incident response, these Wireshark filters are the first tools you reach for.

**Mini-challenge:** Practice identifying malicious patterns by creating test traffic: run \`while true; do curl -s http://example.com > /dev/null; sleep 2; done\` in background, capture for 10 seconds, then look for regular timing patterns in the packet list. Use \`tshark\` to filter traffic to that destination and observe the consistent intervals — this is exactly what beaconing looks like.

The best way to learn is to practice: download public packet captures from malware-traffic-analysis.net and try to identify the malicious traffic yourself.`, { hasQuiz: true, quiz: [
        { id: 'ws-6-q1', question: 'What does beaconing traffic typically look like in Wireshark?', options: ['Random bursts of packets', 'Regular periodic connections at consistent intervals', 'Large single transfers', 'Encrypted HTTPS traffic'], correctIndex: 1, explanation: 'Beaconing is characterized by regular, periodic connections to a C2 server — often every 60 seconds or at another consistent interval.' },
        { id: 'ws-6-q2', question: 'Which Wireshark filter detects DNS tunneling?', options: ['dns.qry.name.len > 50', 'dns.flags == 1', 'udp.port == 53', 'ip.proto == 17'], correctIndex: 0, explanation: 'DNS tunneling often uses very long subdomains to encode data. Filtering for query names longer than 50 characters is a good starting point.' },
      ] }),

    l('ws-7', 'TShark: Command-Line Wireshark',
      `TShark is the terminal version of Wireshark. It's essential for scripting, remote capture, and automated analysis.

**Basic captures:**
\`\`\`bash
# Capture live (like tcpdump but with Wireshark's protocol parsers)
sudo tshark -i eth0

# Capture with a display filter
sudo tshark -i eth0 -f "port 80"

# Capture N packets then stop
sudo tshark -i eth0 -c 100

# Write to file
sudo tshark -i eth0 -w capture.pcapng

# Read a capture file
tshark -r capture.pcapng
\`\`\`

**Filtering with TShark:**
\`\`\`bash
# Apply display filter (like Wireshark GUI)
tshark -r capture.pcapng -Y "http.request"

# Show specific fields (much cleaner output)
tshark -r capture.pcapng -Y "http" -T fields \
  -e http.host -e http.request.uri -e http.response.code

# CSV output (for spreadsheets/reports)
tshark -r capture.pcapng -T fields -E separator=, \
  -e frame.time -e ip.src -e ip.dst -e tcp.port
\`\`\`

**Statistics and analysis:**
\`\`\`bash
# Protocol hierarchy
tshark -r capture.pcapng -z io,phs

# Top talkers
tshark -r capture.pcapng -z ip_hosts,tree

# HTTP requests summary
tshark -r capture.pcapng -z http,tree

# Endpoints
tshark -r capture.pcapng -z endpoints,ip

# Expert info
tshark -r capture.pcapng -z expert
\`\`\`

**Automated analysis scripts:**
\`\`\`bash
#!/bin/bash
# analyze.sh — quick triage of a pcap
PCAP="$1"

echo "=== Protocol Hierarchy ==="
tshark -r "$PCAP" -z io,phs 2>/dev/null | head -30

echo "=== Top IPs ==="
tshark -r "$PCAP" -z ip_hosts,tree 2>/dev/null | head -20

echo "=== DNS Queries ==="
tshark -r "$PCAP" -Y "dns.flags.response == 0" -T fields \
  -e dns.qry.name 2>/dev/null | sort | uniq -c | sort -rn | head -10

echo "=== HTTP Hosts ==="
tshark -r "$PCAP" -Y "http.request" -T fields \
  -e http.host 2>/dev/null | sort | uniq -c | sort -rn | head -10

echo "=== Suspicious Ports ==="
tshark -r "$PCAP" -T fields -e tcp.dstport 2>/dev/null | \
            sort | uniq -c | sort -rn | head -10
\`\`\`

> **Why this matters for hacking:** TShark is essential for automated forensics at scale. When analyzing a compromised server remotely (no GUI available), TShark is your only option. The \`-T fields\` flag extracts structured data (hosts, URIs, ports) for feeding into other tools (Splunk, custom scripts, spreadsheets). The \`-z io,phs\` (protocol hierarchy) gives a quick overview of what protocols are present — the starting point for any pcap triage. In incident response, a TShark analysis script can triage a 1GB pcap in seconds.

**Mini-challenge:** Run the full triage script against your /tmp/capture.pcapng: \`tshark -r /tmp/capture.pcapng -z io,phs 2>/dev/null\`. This prints the protocol hierarchy — the first step in any pcap analysis. Look for unexpected protocols like FTP, Telnet, or SMB on unusual ports.`),

    l('ws-8', 'TLS Decryption & Advanced Analysis',
      `Wireshark can decrypt TLS traffic if you have the private key or session keys.

**Using SSLKEYLOGFILE (browser-based):**
\`\`\`bash
# Set environment variable before starting browser
export SSLKEYLOGFILE=/tmp/keys.log
firefox &

# Or chromium
export SSLKEYLOGFILE=/tmp/keys.log
chromium-browser &
\`\`\`

**Configure Wireshark:**
\`\`\`
Edit → Preferences → Protocols → TLS
(R)TLS Keys File: /tmp/keys.log
(Pre)-Master-Secret log filename
\`\`\`

**TShark with key log:**
\`\`\`bash
tshark -r capture.pcapng -o tls.keylog_file:/tmp/keys.log \
  -Y "tls" -T fields -e tls.handshake.type -e tls.handshake.ciphersuite
\`\`\`

**Decrypting with a server private key:**
\`\`\`bash
# Only works for RSA key exchange (not ECDHE — most modern TLS)
# Wireshark: Edit → Preferences → Protocols → TLS → RSA key file
# Format: ip,port,protocol,keyfile
# 10.0.0.1,443,tcp,/path/to/private.key
\`\`\`

**What you can see after decryption:**
\`\`\`bash
# Full HTTP/2 request and response
tshark -r decrypted.pcapng -Y "http2"
# Application data
tshark -r decrypted.pcapng -Y "tls.application_data"
\`\`\`

**VoIP analysis:**
\`\`\`bash
# SIP calls
tshark -r capture.pcapng -Y "sip" -T fields -e sip.from -e sip.to

# RTP streams (play back audio)
tshark -r capture.pcapng -Y "rtp"

# In Wireshark GUI: Telephony → VoIP Calls → Play Streams
\`\`\`

**ICMP analysis for network troubleshooting:**
\`\`\`bash
# Ping requests and responses
tshark -r capture.pcapng -Y "icmp" -T fields \
  -e icmp.type -e icmp.seq -e ip.src -e ip.dst
# Type 0 = echo reply, Type 8 = echo request

# TTL analysis (detect routing loops)
            tshark -r capture.pcapng -Y "icmp" -T fields -e ip.ttl
\`\`\`

> **Why this matters for hacking:** TLS decryption transforms encrypted traffic back into plaintext for analysis. The \`SSLKEYLOGFILE\` environment variable is the easiest method — Firefox and Chrome both support it. This is critical for debugging HTTPS applications and investigating encrypted malware C2 traffic. With the session keys, you can see every request, response, header, and body that would otherwise be opaque. In penetration testing, configuring TLS decryption lets you analyze how an application behaves over HTTPS, revealing API calls and authentication flows that are invisible in encrypted form.

**Mini-challenge:** Set \`export SSLKEYLOGFILE=/tmp/keys.log\`, then run \`curl -o /dev/null -s https://example.com\`. Check if the key file was written: \`cat /tmp/keys.log 2>/dev/null | head -5\`. Modern Firefox/Chrome browsers also support this for all HTTPS traffic — one of the most useful debugging techniques for security testing.`),

    l('ws-9', 'Forensic Analysis & Custom Filters',
      `Advanced Wireshark techniques for deep packet investigation.

**Building complex display filters:**
\`\`\`bash
# Find all HTTP POST requests to /login
http.request.method == POST && http.request.uri contains "/login"

# Find packets with "admin" in the payload
frame contains "admin"

# Find traffic between specific hosts
ip.addr == 192.168.1.100 && tcp.port == 443

# Exclude common noise (broadcast, multicast, DHCP)
!icmp && !arp && !dhcp && !(udp.port == 1900)

# Find retransmissions (network problems)
tcp.analysis.retransmission

# Find zero-window events (receiver can't keep up)
tcp.analysis.zero_window
\`\`\`

**Saving and managing filters:**
\`\`\`
# In Wireshark GUI:
# Capture Filters: Capture → Capture Filters → New
# Display Filters: Analyze → Display Filters → New

# Filter files are stored in:
~/.config/wireshark/dfilters    # Display filters
~/.config/wireshark/cfilters    # Capture filters
\`\`\`

**Using coloring rules for quick triage:**
\`\`\`
# In Wireshark: View → Coloring Rules → New
# Common rules:
# - TCP RST: red background (errors)
# - HTTP 4xx/5xx: yellow background (server issues)
# - DNS: light blue (background traffic)
# - TLS Handshake: green (encrypted session setup)
\`\`\`

**Packet export and carving:**
\`\`\`bash
# Export specific packets
tshark -r capture.pcapng -Y "http.request.uri contains /malware.exe" \
  -w extracted.pcapng

# Follow TCP stream and save raw data
tshark -r capture.pcapng -z follow,tcp,ascii,0

# Export objects (HTTP files, SMB files)
# Wireshark: File → Export Objects → HTTP/SMB/...

# Carve files from pcap with foremost
foremost -t png -i capture.pcapng
\`\`\`

**Full forensic triage workflow:**
\`\`\`bash
#!/bin/bash
# forensic-triage.sh — automate pcap analysis

PCAP="$1"
OUTDIR="forensic-output-$(date +%s)"
mkdir -p "$OUTDIR"

echo "[1/5] Protocol hierarchy"
tshark -r "$PCAP" -z io,phs > "$OUTDIR/protocols.txt"

echo "[2/5] Extract all HTTP objects"
tshark -r "$PCAP" --export-objects "http,$OUTDIR/http-objects"

echo "[3/5] Find DNS queries to known bad domains"
tshark -r "$PCAP" -Y "dns.flags.response == 0" -T fields \
  -e dns.qry.name > "$OUTDIR/dns-queries.txt"

echo "[4/5] TLS certificate analysis"
tshark -r "$PCAP" -Y "tls.handshake.certificate" -T fields \
  -e tls.handshake.certificate > "$OUTDIR/certs.bin"

echo "[5/5] Extract credentials from protocols"
tshark -r "$PCAP" -Y "ftp.request.command == USER || ftp.request.command == PASS" \
  -T fields -e ftp.request.arg > "$OUTDIR/ftp-creds.txt"

echo "Done — output in $OUTDIR/"
\`\`\`

Mastering these advanced techniques separates script kiddies from real security analysts. Practice on public packet captures from malware-traffic-analysis.net and the Wireshark sample captures page.`, { hasQuiz: true, quiz: [
        { id: 'ws-9-q1', question: 'How can you decrypt TLS traffic in Wireshark from a browser session?', options: ['Use the server\'s private key', 'Set SSLKEYLOGFILE before starting the browser', 'Use an intercepting proxy', 'It\'s impossible'], correctIndex: 1, explanation: 'Firefox and Chrome support SSLKEYLOGFILE environment variable, which writes session keys that Wireshark can use for decryption.' },
        { id: 'ws-9-q2', question: 'Which Wireshark filter shows TCP retransmissions?', options: ['tcp.flags.syn == 1', 'tcp.analysis.retransmission', 'tcp.window_size == 0', 'tcp.stream eq 0'], correctIndex: 1, explanation: 'tcp.analysis.retransmission is an expert-info filter that highlights packets that had to be retransmitted, indicating network issues.' },
      ] }),
];

export const COURSE: Course = {
  id: 'wireshark-101',
  title: 'Wireshark 101',
  categoryId: 'tools',
  description:
    'See every packet on the wire. Learn to capture, filter, and analyze network traffic like a forensics expert.',
  overview:
    'Wireshark lets you see exactly what’s happening on a network. This course teaches you to capture live traffic, apply display and capture filters, follow TCP streams, and identify malicious patterns in packet captures.',
  estimatedMinutes: 65,
  cpCost: 75,
  learningObjectives: [
      'Capture live network traffic with Wireshark',
      'Apply display filters to isolate specific protocols and hosts',
      'Follow TCP streams to reconstruct conversations',
      'Identify common malicious traffic patterns in packet captures',
  ],
  skillLevel: 'intermediate',
  prerequisites: ["networking-101"],
  lessons: LESSONS,
};
