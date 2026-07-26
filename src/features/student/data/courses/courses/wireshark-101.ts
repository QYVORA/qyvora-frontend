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
\`\`\``),

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
\`\`\``),

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
\`\`\``),

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
