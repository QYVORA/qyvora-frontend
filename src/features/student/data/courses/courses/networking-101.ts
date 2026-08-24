import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('net-1', 'What is a Network?',
      `A **network** is two or more computers connected together to share data. The **internet** is just a massive network of networks, millions of smaller networks linked together across the globe.

Think of a network like a postal system. Each house (computer) has an address, and mail (data) travels between houses through a series of roads and post offices (routers and switches). Just like you need an address to receive mail, every device on a network needs an identifier so other devices know where to send data.

Every device on a network has an **IP address**, like a street address for your computer. IP addresses look like this:

\`\`\`
192.168.1.42
\`\`\`

There are two main types:
- **Public IP**: your address on the internet, assigned by your ISP, unique worldwide. When you visit a website, the server sees your public IP. Think of it as your home's address visible to the entire world.
- **Private IP**: your address on your local network (e.g., 192.168.x.x, 10.x.x.x). Every device in your house shares one public IP but each has its own private IP. It's like an apartment number inside a building, only people inside the building know which unit is which.

Private IPs are not routable on the internet. Your router translates between private IPs (inside your network) and your public IP (outside) using a technique called NAT (Network Address Translation). This is why your phone and laptop can both browse the web at the same time through a single internet connection.

Why do hackers need to understand networking? Because every attack travels over a network. To intercept traffic, you need to understand how data moves. To scan targets, you need to know about IP ranges and ports. To exploit services, you need to understand which ports are open and what protocols they speak. Networking is the foundation of everything in cybersecurity.

A **port** is like a door on a computer. Each service listens on a specific port: imagine an office building where different departments have different room numbers. Port 80 is the "web department," port 22 is the "remote access department," and so on. When you connect to a server, you're not just connecting to the IP: you're connecting to a specific port where a specific service is waiting:
- Port 80 → HTTP (websites, the unencrypted web)
- Port 443 → HTTPS (secure websites, encrypted web traffic)
- Port 22 → SSH (remote login, how admins manage servers)
- Port 53 → DNS (domain resolution, translating names to IPs)
- Port 21 → FTP (file transfers)
- Port 3306 → MySQL (database access)

\`\`\`bash
# See your own IP address on Linux/Mac
ip addr show

# See your public IP (requires internet)
curl ifconfig.me
\`\`\``),

    l('net-2', 'The OSI Model',
      `The **OSI model** breaks network communication into 7 layers. Think of it like sending a package through a postal system, each layer handles a specific part of the journey:

1. **Physical (Layer 1)**: the actual cables, radio waves, and electrical signals. This is the road your mail truck drives on. If you unplug an Ethernet cable, you've broken Layer 1. Think fiber optic cables, Wi-Fi signals, and the physical hardware that carries bits as electrical pulses or light.

2. **Data Link (Layer 2)**. MAC addresses, switches, Ethernet, Wi-Fi. This is like the local post office that knows which house on the street gets the mail. MAC addresses are unique hardware identifiers burned into your network card. Switches use MAC addresses to deliver frames to the right device on a local network.

3. **Network (Layer 3)** - IP addresses and routing. This is the highway system that figures out the best route between cities. Your internet router operates here, deciding whether to send data to another device on your LAN or out to the internet. IP addresses live here, and so do routing protocols.

4. **Transport (Layer 4)** - TCP/UDP ports. This is like the shipping method, registered mail (TCP, reliable, tracked) or regular mail (UDP, fast but no guarantee of delivery). TCP guarantees data arrives intact and in order. UDP is faster but doesn't check. Ports tell the computer which application should receive the data, like which department in the office building opens the envelope.

5. **Session (Layer 5)**: manages connections between apps. This is like the conversation protocol between sender and receiver, "I'll talk, then you talk, then we'll hang up." It establishes, maintains, and terminates sessions. Think of it as the etiquette layer that keeps a conversation flowing smoothly.

6. **Presentation (Layer 6)**: translates data formats, handles encryption and compression. This is like the translator and packer, converting languages (data formats), compressing items to fit in a smaller box, and encrypting the contents so only the recipient can read them. SSL/TLS encryption happens conceptually at this layer.

7. **Application (Layer 7)**: what you interact with: HTTP, DNS, SSH, SMTP. This is the letter itself, the actual message you're sending. Web browsers, email clients, and terminal applications all operate here.

Why does this matter for security? Different attacks target different layers:
- **Layer 2**: MAC flooding, ARP spoofing, VLAN hopping, attacks on local network hardware
- **Layer 3**: IP spoofing, ICMP floods, routing manipulation, attacks on the addressing system
- **Layer 4**: SYN floods, port scanning, TCP hijacking, attacks on connections and ports
- **Layer 7**: SQL injection, XSS, HTTP floods, attacks on the application itself

When someone says "layer 7 attack," they mean attacking the application level (like HTTP), not the network level. Understanding the OSI model helps you identify where an attack is happening and which tools to use at each layer.

The practical layers you need to remember most:
- **Layer 2 (Data Link)**. MAC addresses and local switching
- **Layer 3 (Network)** - IP addresses and routing
- **Layer 4 (Transport)** - TCP/UDP and ports
- **Layer 7 (Application)**: the protocols you use daily

Each layer adds its own header to the data as it travels down, like nesting envelopes inside envelopes. The receiving end strips them off layer by layer to reconstruct the original message.`),

    l('net-3', 'TCP/IP & UDP',
      `**TCP** and **UDP** are the two main transport protocols. They sit on top of IP.

**TCP (Transmission Control Protocol)** is reliable. It establishes a connection (called a "three-way handshake") before sending data and retransmits lost packets.

\`\`\`
1. SYN  → "Hey, can we talk?"
2. SYN-ACK → "Sure, I'm listening."
3. ACK  → "Great, let's talk."
        → Data flows...
4. FIN  → "Goodbye."
\`\`\`

TCP is used for: web (HTTP), email (SMTP), SSH, file transfers (FTP).

**UDP (User Datagram Protocol)** is fast but unreliable. It sends data without checking if it arrived. Like shouting across a room — you hope they heard you.

UDP is used for: video streaming, DNS queries, VoIP, online gaming.

\`\`\`bash
# Check which ports are listening on your machine
            netstat -tlnp   # TCP ports
netstat -ulnp   # UDP ports
\`\`\`

> **Why this matters for hacking:** The TCP three-way handshake (SYN → SYN-ACK → ACK) is the foundation of reliable network communication, and the basis for SYN flooding as a DoS attack. Understanding TCP flags lets you interpret packet captures, configure firewalls, and craft custom packets. UDP's connectionless nature makes it ideal for DNS and VoIP but also makes it spoofable. In port scanning, the difference between a SYN scan (\`-sS\`, stealthy, half-open) and a TCP connect scan (\`-sT\`, complete handshake, logged) is critical for evasion.

**Mini-challenge:** Run \`ping -c 4 google.com\` to see round-trip times, then \`traceroute -n google.com | head -10\` to see the path. Each hop is a router forwarding your packets — visualizing this path is essential for understanding network topology and identifying where slowdowns or blocks occur.`),

    l('net-4', 'DNS Explained',
      `**DNS (Domain Name System)** translates human-readable domain names into IP addresses. When you type \`google.com\`, DNS finds the IP address so your computer knows where to connect.

Think of it as the phonebook of the internet.

\`\`\`bash
# Find the IP address of a domain
nslookup google.com

# Or use dig (more detailed)
dig google.com

# Short output
dig google.com +short
\`\`\`

\`\`\`
nslookup google.com
Server:  192.168.1.1
Address: 192.168.1.1#53

Non-authoritative answer:
Name:    google.com
Address: 142.250.80.46
\`\`\`

DNS uses UDP on port 53. The query goes to your configured DNS server (usually your router or an ISP), which finds the answer by asking other DNS servers.

> **Why this matters for hacking:** DNS is the backbone of internet navigation, and a frequent attack vector. DNS poisoning redirects users to malicious sites. DNS tunneling exfiltrates data by encoding it in subdomain queries. Zone transfers (\`dig axfr\`) reveal every DNS record for a domain if misconfigured, a goldmine for recon. The \`dig any\` query returns all record types, often revealing subdomains and services not otherwise visible.

**Mini-challenge:** Run \`dig google.com ANY +short\` to see all DNS record types for a domain. Then \`dig google.com MX +short\` to find mail servers. Finally \`dig axfr @ns1.google.com google.com\` (this will fail — Google blocks zone transfers). Understanding which queries succeed vs fail teaches you DNS security posture.

**Common DNS records:**
- **A**: maps domain to IPv4 address
- **AAAA**: maps domain to IPv6 address
- **MX**: mail server for the domain
- **CNAME**: alias from one domain to another

\`\`\`bash
# Check mail servers
nslookup -type=MX gmail.com

# Check all record types
dig any google.com
\`\`\``),

    l('net-5', 'HTTP & HTTPS',
      `**HTTP** is the protocol your browser uses to talk to websites. It's a request-response protocol.

A typical HTTP request looks like:

\`\`\`http
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
\`\`\`

The server responds:

\`\`\`http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<html>...
\`\`\`

**HTTP Methods:**
- **GET**: retrieve data (most common)
- **POST**: send data (forms, login)
- **PUT**: update data
- **DELETE**: remove data

**Status Codes:**
- **200** - OK (success)
- **301/302** - Redirect
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Server Error

**HTTPS** is HTTP over SSL/TLS. It encrypts the entire conversation so nobody in the middle can read it.

\`\`\`bash
# See HTTP headers with curl
curl -I https://example.com

# See full response
            curl -v https://example.com
\`\`\`

> **Why this matters for hacking:** HTTP headers reveal server information (Apache vs Nginx, PHP version, cookies), which guides your attack strategy. Status codes tell you what's accessible - 200 (OK), 403 (forbidden but exists), 404 (not found), 500 (server error). The \`Host\` header is used for virtual hosting, modifying it can access different sites on the same server. Understanding HTTPS (TLS handshake, certificate validation) is essential for intercepting encrypted traffic, a core skill in penetration testing.

**Mini-challenge:** Run \`curl -I https://example.com\` to see response headers. Identify the server type, content type, and any security headers. Then \`curl -v https://example.com 2>&1 | grep -iE "ssl|tls|certificate"\` to examine the TLS handshake details — you'll see the certificate chain and cipher negotiation.`),

    l('net-6', 'Troubleshooting Tools',
      `The best way to learn networking is by doing. Here are the essential troubleshooting tools.

\`\`\`bash
# ping, check if a host is reachable
ping -c 4 google.com
\`\`\`

\`\`\`
PING google.com (142.250.80.46) 56(84) bytes of data.
64 bytes from 142.250.80.46: icmp_seq=1 ttl=118 time=12.3 ms
64 bytes from 142.250.80.46: icmp_seq=2 ttl=118 time=11.8 ms
\`\`\`

The \`time\` shows latency in milliseconds. Lower is faster.

\`\`\`bash
# traceroute, see every hop to a destination
traceroute google.com
\`\`\`

Each line is a router your packets pass through. If it stops at a certain hop, that's where the problem is.

\`\`\`bash
# curl, the Swiss Army knife of HTTP
curl https://api.github.com/users/octocat
curl -o page.html https://example.com    # save to file
curl -X POST -d "user=admin&pass=test" https://example.com/login
\`\`\`

\`\`\`bash
# nmap (if installed), scan a host for open ports
nmap -p 22,80,443 scanme.nmap.org
\`\`\`

> **Why this matters for hacking:** Ping, traceroute, curl, and nmap are the essential four tools every hacker must know. Ping tells you if a host is alive (\`-c\` limits packets). Traceroute maps the network path and reveals routers. Curl is your HTTP Swiss Army knife for testing endpoints, headers, and methods. Nmap discovers open ports and services. Together, they form the foundation of network reconnaissance, the first phase of any penetration test.

**Mini-challenge:** Run the complete recon sequence on scanme.nmap.org: \`ping -c 2 scanme.nmap.org && traceroute -n scanme.nmap.org | tail -5 && curl -I scanme.nmap.org 2>/dev/null\`. This single command chain covers host discovery, path mapping, and service identification — the three pillars of network recon.

Practice on \`scanme.nmap.org\` (a legal test target provided by the Nmap project).`, { hasQuiz: true, quiz: [
        { id: 'net-6-q1', question: 'What does the `-c` flag do in the ping command?', options: ['Set packet size', 'Specify count of pings', 'Set timeout', 'Enable flood mode'], correctIndex: 1, explanation: 'ping -c N sends N packets and stops. Without -c, ping runs forever on Linux.' },
        { id: 'net-6-q2', question: 'What command shows the route packets take to a destination?', options: ['ping', 'traceroute', 'netstat', 'curl'], correctIndex: 1, explanation: 'traceroute shows every hop (router) between you and the destination.' },
        { id: 'net-6-q3', question: 'How do you see only response headers with curl?', options: ['curl -v', 'curl -I', 'curl -O', 'curl -L'], correctIndex: 1, explanation: 'curl -I sends a HEAD request and shows only the response headers, useful for fingerprinting.' },
      ] }),

    l('net-7', 'Subnetting & CIDR',
      `Subnetting divides a network into smaller pieces. Understanding it helps you scan efficiently and understand network architecture.

**IP addresses and subnet masks:**
\`\`\`
IP:     192.168.1.0
Mask:   255.255.255.0   (/24 in CIDR notation)
        ^^^^^^^^ ^^^^^^^^ ^^^^^^^^ ^^^^^^^^
Network portion  |  Host portion

/24 = 255.255.255.0 = 256 addresses (254 usable)
\`\`\`

**CIDR notation — from /0 to /32:**
\`\`\`bash
# Common CIDR ranges
# /8   = 255.0.0.0       = 16,777,214 hosts
# /16  = 255.255.0.0     = 65,534 hosts
# /24  = 255.255.255.0   = 254 hosts
# /25  = 255.255.255.128 = 126 hosts
# /26  = 255.255.255.192 = 62 hosts
# /27  = 255.255.255.224 = 30 hosts
# /28  = 255.255.255.240 = 14 hosts
# /29  = 255.255.255.248 = 6 hosts
# /30  = 255.255.255.252 = 2 hosts (point-to-point link)

# Calculate: 2^(32-CIDR) - 2 = usable hosts
# /24: 2^(32-24) - 2 = 2^8 - 2 = 254
# /28: 2^(32-28) - 2 = 2^4 - 2 = 14
\`\`\`

**Subnetting in practice:**
\`\`\`bash
# Example: 192.168.1.0/24 split into 4 subnets
# Subnet A: 192.168.1.0/26   (192.168.1.1 - 192.168.1.62)
# Subnet B: 192.168.1.64/26  (192.168.1.65 - 192.168.1.126)
# Subnet C: 192.168.1.128/26 (192.168.1.129 - 192.168.1.190)
# Subnet D: 192.168.1.192/26 (192.168.1.193 - 192.168.1.254)
\`\`\`

**Network address vs broadcast address:**
\`\`\`
Network:   192.168.1.0    (first address, not assignable)
Usable:    192.168.1.1 - 192.168.1.254
Broadcast: 192.168.1.255  (last address, not assignable)
\`\`\`

**Quick subnet calculations with tools:**
\`\`\`bash
# Using ipcalc or sipcalc
ipcalc 192.168.1.0/24

# Output:
# Address:   192.168.1.0
# Netmask:   255.255.255.0 = 24
# Wildcard:  0.0.0.255
# Network:   192.168.1.0/24
# HostMin:   192.168.1.1
# HostMax:   192.168.1.254
# Broadcast: 192.168.1.255
# Hosts/Net: 254

# Scan a specific subnet
nmap -sn 192.168.1.0/24
\`\`\`

**Private IP ranges (RFC 1918):**
\`\`\`
10.0.0.0/8      - Large internal networks
172.16.0.0/12   - AWS default VPC
192.168.0.0/16  - Home/Small office
\`\`\`

**Quick mental shortcuts:**
\`\`\`
/24 = 256 addresses (last octet = 0-255)
/25 = 128 addresses (last octet split: 0-127, 128-255)
/26 = 64 addresses  (4 subnets)
/27 = 32 addresses  (8 subnets)
/28 = 16 addresses  (16 subnets)
\`\`\`

> **Why this matters for hacking:** Subnetting knowledge directly impacts scanning efficiency. A /24 (254 hosts) can be scanned quickly with \`nmap -sn 192.168.1.0/24\`. But scanning a /16 (65,534 hosts) requires strategic targeting. Understanding CIDR tells you how many IPs are in a range, what addresses are reserved, and how networks are segmented. In CTFs, finding a /32 (single host) or /30 (2 hosts) tells you something about the network architecture, these are often point-to-point links or specific targets.

**Mini-challenge:** Run \`ipcalc 192.168.1.0/24\` (install with \`sudo apt install ipcalc\`) to see subnet breakdown. If unavailable, compute manually: a /24 has 254 usable hosts (256 - 2). For /28: 16 addresses - 2 (network + broadcast) = 14 usable. Practice converting between CIDR and decimal subnet masks — \`/24 = 255.255.255.0\`, \`/16 = 255.255.0.0\`, \`/8 = 255.0.0.0\`. This mental math saves time during scans.`),

    l('net-8', 'DHCP & NAT',
      `DHCP assigns IP addresses automatically. NAT allows many devices to share one public IP.

**DHCP — Dynamic Host Configuration Protocol:**
\`\`\`bash
# The DORA process:
# Discover, "Anyone out there? I need an IP!"
# Offer   , "Use 192.168.1.42" (from DHCP server)
# Request , "I'll take 192.168.1.42"
# Ack     , "Confirmed, you have it for 24 hours"

# See your DHCP lease info (Linux)
cat /var/lib/dhcp/dhclient.leases

# Force a new DHCP lease
sudo dhclient -r    # Release current lease
sudo dhclient       # Request new lease

# See DHCP server info (from your router)
ip route | grep default
# The gateway is typically your DHCP server
\`\`\`

**Check DHCP info on different OS:**
\`\`\`bash
# Linux: check DHCP-assigned IP
ip addr show
ip route show

# Windows equivalent:
# ipconfig /all    (shows DHCP server, lease time)
# ipconfig /renew  (request new lease)
\`\`\`

**NAT — Network Address Translation:**
\`\`\`bash
# NAT types (important for penetration testing):
# Full Cone NAT    - Any external host can reach you
# Restricted Cone  - Only hosts you contacted can reach you
# Port Restricted  - Only hosts+ports you contacted
# Symmetric NAT    - Each connection gets a different mapping

# See your public IP (what the internet sees)
curl -s ifconfig.me
curl -s icanhazip.com

# See your private IP
hostname -I   # Linux
# ipconfig     # Windows
\`\`\`

> **Why this matters for hacking:** DHCP and NAT are fundamental to how networks operate, and both have security implications. A rogue DHCP server can hijack all traffic on a network (DHCP spoofing). NAT obscures internal IP structures, which is why internal recon often starts with identifying the local subnet. Port forwarding through NAT enables external access to internal services, a common misconfiguration. The \`dhclient -r\` command releases your lease, which can be useful when changing networks or troubleshooting.

**Mini-challenge:** Run \`hostname -I\` to see your private IP, then \`curl -s ifconfig.me\` to see your public IP. Compare them — they should differ. Then \`ip route | grep default\` to see your gateway (typically your router's IP). This reveals your network's NAT architecture: private IP → router → public IP.

**Check NAT and connection tracking:**
\`\`\`bash
# Linux: see NAT table (iptables)
sudo iptables -t nat -L -n

# See connection tracking table
sudo conntrack -L | head -20

# Common ports and their NAT behavior:
# HTTP (80) , typically NAT-friendly
# DNS (53)   - UDP, works through NAT
# FTP (21)  , problematic with NAT (needs passive mode)
# SIP (5060), often broken by NAT
\`\`\`

**Port forwarding through NAT:**
\`\`\`bash
# To make a local service accessible from the internet:
# 1. Set a static internal IP for your machine
# 2. On your router, forward external port → internal IP:port
# Example: Forward port 8080 → 192.168.1.10:80 (web server)

# Test if a port is reachable from outside
# (run this from a machine OUTSIDE your network)
nmap -p 8080 <your-public-ip>
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. Check your private and public IP
hostname -I
curl -s ifconfig.me

# 2. Check your default gateway and DHCP server
ip route | grep default
cat /var/lib/dhcp/dhclient.leases 2>/dev/null | tail -10

# 3. Release and renew your IP
sudo dhclient -v -r
sudo dhclient -v
\`\`\``),

    l('net-9', 'Network Security Basics',
      `Understanding firewalls, VPNs, and security concepts is essential for both offense and defense.

**Firewalls — what they block and allow:**
\`\`\`bash
# Check if a firewall is active (Linux)
sudo ufw status
sudo iptables -L -n -v

# Common firewall rules:
# Default: DROP (deny all, allow specific)
# Default: ACCEPT (allow all, deny specific)

# Test if a port is filtered by a firewall
nmap -p 22 scanme.nmap.org
# "filtered" = firewall is blocking

# Common firewall behaviors:
# DROP   : packet disappears (no response) - stealth
# REJECT : packet returns "connection refused"
# LOG    : packet is logged but allowed/blocked
\`\`\`

**VPN — Virtual Private Network:**
\`\`\`bash
# VPNs create an encrypted tunnel between two points
# Types:
# OpenVPN   , open source, most flexible
# WireGuard , newer, faster, simpler
# IPsec     , older standard, built into many OS
# PPTP      : old, broken, never use

# Check if a VPN is active
ip addr show tun0   # OpenVPN creates tun0
ip addr show wg0    # WireGuard creates wg0

# Your public IP should change when VPN is active
curl -s ifconfig.me
# (Compare with and without VPN)
\`\`\`

**TLS/SSL — encryption for the web:**
\`\`\`bash
# Check if a site uses valid TLS
curl -v https://example.com 2>&1 | grep "SSL connection"

# Check certificate details
openssl s_client -connect example.com:443 < /dev/null 2>/dev/null | openssl x509 -text | head -20

# Check supported TLS versions
nmap --script ssl-enum-ciphers -p 443 example.com
\`\`\`

**Common network attacks (know your adversary):**
\`\`\`bash
# ARP spoofing, intercept traffic on local network
# arpspoof -i eth0 -t 192.168.1.1 192.168.1.100

# DNS spoofing, redirect traffic to fake sites
# dnsspoof -i eth0 -f hosts.txt

# MAC flooding, overflow switch memory
# macof -i eth0

# SYN flood, denial of service
# hping3 -S --flood -V <target>
\`\`\`

**Quick security checks:**
\`\`\`bash
# Check listening ports (what's exposed?)
ss -tulnp

# Check who's connected to your machine
ss -atnp | grep ESTAB

# Check DNS settings (are you being redirected?)
cat /etc/resolv.conf
dig +short google.com

# Check ARP table (any suspicious entries?)
ip neighbor show
\`\`\`

**Practical progression:**
\`\`\`bash
# 1. Check what ports are listening on your machine
ss -tulnp

# 2. Check your public IP
curl -s ifconfig.me

# 3. Check a site's TLS certificate
openssl s_client -connect example.com:443 < /dev/null 2>/dev/null | openssl x509 -text | grep "Subject:"

# 4. Scan for vulnerabilities in a router
            nmap -sV --script vuln 192.168.1.1
\`\`\`

> **Why this matters for hacking:** Firewalls are the first line of defense, understanding their behavior determines your attack approach. A "filtered" port (DROP) tells you a firewall exists. A "closed" port (REJECT) tells you the service isn't running. VPNs encrypt traffic and change your apparent location, essential for operational security. TLS certificate inspection reveals domain ownership, expiration, and issuing authority, useful for identifying phishing sites. The \`ss -tulnp\` command shows every listening service, critical for identifying exposed services on a system.

**Mini-challenge:** Check your firewall: \`sudo ufw status 2>/dev/null || echo "ufw not installed"\`. Then inspect your TLS connections: \`openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -noout -subject -dates\`. This shows the certificate subject (who it's issued to) and validity dates — essential for verifying TLS configuration.`),
];

export const COURSE: Course = {
  id: 'networking-101',
  title: 'Networking 101',
  categoryId: 'networking',
  description:
    'Understand how computers communicate. Learn IP addresses, ports, protocols, and how data travels across the internet.',
  overview:
    'Every hack begins with a network connection. This course breaks down TCP/IP, DNS, HTTP, and how packets flow. No networking background required, we start from the absolute basics.',
  estimatedMinutes: 60,
  cpCost: 100,
  learningObjectives: [
      'Explain how data is broken into packets and routed across networks',
      'Understand IP addresses, subnets, ports, and the OSI model',
      'Describe how DNS resolves domain names to IP addresses',
      'Use tools like ping, traceroute, and nslookup to inspect network paths',
  ],
  skillLevel: 'beginner',
  prerequisites: ["linux-terminal-101"],
  popular: true,
  lessons: LESSONS,
};
