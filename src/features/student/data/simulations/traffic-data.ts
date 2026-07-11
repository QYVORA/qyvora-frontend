export interface PcapPacket {
  number: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  srcPort?: number;
  dstPort?: number;
  flags?: string;
  payload?: string;
}

export interface TrafficTask {
  question: string;
  hint: string;
  answer: string;
}

export interface TrafficFilter {
  filter: string;
  description: string;
}

export interface TrafficChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  packets: PcapPacket[];
  analysisTasks: TrafficTask[];
  filterCommands: TrafficFilter[];
  cpReward: number;
}

export const TRAFFIC_CHALLENGES: TrafficChallenge[] = [
  {
    id: 'pcap-password-1',
    title: 'Cleartext Password Sniff',
    description: 'Analyze a packet capture to find credentials transmitted in cleartext.',
    difficulty: 'beginner',
    packets: [
      { number: 1, time: '00:00:00.000', source: '10.0.0.42', destination: '10.0.0.50', protocol: 'TCP', length: 74, info: 'SYN', dstPort: 80, flags: 'SYN' },
      { number: 2, time: '00:00:00.001', source: '10.0.0.50', destination: '10.0.0.42', protocol: 'TCP', length: 74, info: 'SYN, ACK', srcPort: 80, flags: 'SYN,ACK' },
      { number: 3, time: '00:00:00.002', source: '10.0.0.42', destination: '10.0.0.50', protocol: 'TCP', length: 66, info: 'ACK', dstPort: 80, flags: 'ACK' },
      { number: 4, time: '00:00:00.050', source: '10.0.0.42', destination: '10.0.0.50', protocol: 'HTTP', length: 312, info: 'GET / HTTP/1.1', dstPort: 80 },
      { number: 5, time: '00:00:00.120', source: '10.0.0.50', destination: '10.0.0.42', protocol: 'HTTP', length: 1542, info: 'HTTP/1.1 200 OK (text/html)', srcPort: 80 },
      { number: 6, time: '00:00:00.150', source: '10.0.0.42', destination: '10.0.0.50', protocol: 'HTTP', length: 287, info: 'GET /css/style.css HTTP/1.1', dstPort: 80 },
      { number: 7, time: '00:00:00.200', source: '10.0.0.50', destination: '10.0.0.42', protocol: 'HTTP', length: 892, info: 'HTTP/1.1 200 OK (text/css)', srcPort: 80 },
      { number: 8, time: '00:00:01.500', source: '10.0.0.42', destination: '10.0.0.50', protocol: 'HTTP', length: 356, info: 'POST /api/login HTTP/1.1', dstPort: 80, payload: 'username=admin&password=Sup3rS3cret!2024' },
      { number: 9, time: '00:00:01.600', source: '10.0.0.50', destination: '10.0.0.42', protocol: 'HTTP', length: 234, info: 'HTTP/1.1 200 OK (application/json)', srcPort: 80 },
      { number: 10, time: '00:00:02.000', source: '10.0.0.42', destination: '10.0.0.50', protocol: 'HTTP', length: 298, info: 'GET /dashboard HTTP/1.1', dstPort: 80 },
      { number: 11, time: '00:00:02.100', source: '10.0.0.50', destination: '10.0.0.42', protocol: 'HTTP', length: 2456, info: 'HTTP/1.1 200 OK (text/html)', srcPort: 80 },
      { number: 12, time: '00:00:05.000', source: '10.0.0.42', destination: '10.0.0.50', protocol: 'HTTP', length: 312, info: 'GET /api/user/profile HTTP/1.1', dstPort: 80 },
      { number: 13, time: '00:00:05.100', source: '10.0.0.50', destination: '10.0.0.42', protocol: 'HTTP', length: 189, info: 'HTTP/1.1 200 OK (application/json)', srcPort: 80 },
      { number: 14, time: '00:00:10.000', source: '10.0.0.42', destination: '10.0.0.50', protocol: 'TCP', length: 66, info: 'FIN, ACK', flags: 'FIN,ACK' },
      { number: 15, time: '00:00:10.001', source: '10.0.0.50', destination: '10.0.0.42', protocol: 'TCP', length: 66, info: 'FIN, ACK', flags: 'FIN,ACK' },
    ],
    analysisTasks: [
      { question: 'What protocol is being used for the login?', hint: 'Look at packet 8', answer: 'HTTP (cleartext)' },
      { question: 'What credentials were transmitted?', hint: 'Examine the POST body in packet 8', answer: 'admin:Sup3rS3cret!2024' },
      { question: 'Why is this a security issue?', hint: 'Consider the protocol being used', answer: 'HTTP transmits data in cleartext' },
    ],
    filterCommands: [
      { filter: 'http.request.method == "POST"', description: 'Show only HTTP POST requests' },
      { filter: 'http.request.uri contains "login"', description: 'Show requests to login endpoint' },
    ],
    cpReward: 150,
  },
  {
    id: 'pcap-dns-1',
    title: 'DNS Tunneling Detection',
    description: 'Identify DNS tunneling used for data exfiltration.',
    difficulty: 'intermediate',
    packets: [
      { number: 1, time: '00:00:00.000', source: '10.0.0.42', destination: '10.0.0.2', protocol: 'DNS', length: 78, info: 'Standard query A www.google.com', dstPort: 53 },
      { number: 2, time: '00:00:00.010', source: '10.0.0.2', destination: '10.0.0.42', protocol: 'DNS', length: 94, info: 'Standard query response A 142.250.80.4', srcPort: 53 },
      { number: 3, time: '00:00:01.000', source: '10.0.0.42', destination: '10.0.0.2', protocol: 'DNS', length: 128, info: 'Standard query A aGVsbG8gd29ybGQ.evil-domain.com', dstPort: 53 },
      { number: 4, time: '00:00:01.010', source: '10.0.0.2', destination: '8.8.8.8', protocol: 'DNS', length: 128, info: 'Standard query A aGVsbG8gd29ybGQ.evil-domain.com', dstPort: 53 },
      { number: 5, time: '00:00:01.050', source: '8.8.8.8', destination: '10.0.0.2', protocol: 'DNS', length: 144, info: 'Standard query response A 198.51.100.1', srcPort: 53 },
      { number: 6, time: '00:00:01.060', source: '10.0.0.2', destination: '10.0.0.42', protocol: 'DNS', length: 144, info: 'Standard query response A 198.51.100.1', srcPort: 53 },
      { number: 7, time: '00:00:02.000', source: '10.0.0.42', destination: '10.0.0.2', protocol: 'DNS', length: 156, info: 'Standard query A cGFzc3dvcmQxMjM.evil-domain.com', dstPort: 53 },
      { number: 8, time: '00:00:02.010', source: '10.0.0.2', destination: '10.0.0.42', protocol: 'DNS', length: 172, info: 'Standard query response A 198.51.100.1', srcPort: 53 },
      { number: 9, time: '00:00:03.000', source: '10.0.0.42', destination: '10.0.0.2', protocol: 'DNS', length: 142, info: 'Standard query A YWRtaW5AYWVvbGNvcnAuaW8.evil-domain.com', dstPort: 53 },
      { number: 10, time: '00:00:03.010', source: '10.0.0.2', destination: '10.0.0.42', protocol: 'DNS', length: 158, info: 'Standard query response A 198.51.100.1', srcPort: 53 },
    ],
    analysisTasks: [
      { question: 'Which DNS queries have unusually long subdomains?', hint: 'Compare query lengths', answer: 'Queries with base64-encoded subdomains (packets 3,7,9)' },
      { question: 'What encoding is being used for the data?', hint: 'The subdomain looks like base64', answer: 'Base64 encoding' },
      { question: 'What data is being exfiltrated?', hint: 'Decode the base64 subdomains', answer: 'hello world, password123, admin@novacorp.io' },
    ],
    filterCommands: [
      { filter: 'dns.qry.name.len > 50', description: 'Show DNS queries with long names' },
      { filter: 'dns', description: 'Show all DNS traffic' },
    ],
    cpReward: 300,
  },
  {
    id: 'pcap-arp-1',
    title: 'ARP Spoofing Detection',
    description: 'Detect ARP spoofing attack on the local network.',
    difficulty: 'intermediate',
    packets: [
      { number: 1, time: '00:00:00.000', source: '10.0.0.1', destination: '10.0.0.42', protocol: 'ARP', length: 42, info: 'Who has 10.0.0.42? Tell 10.0.0.1' },
      { number: 2, time: '00:00:00.001', source: '10.0.0.42', destination: '10.0.0.1', protocol: 'ARP', length: 42, info: '10.0.0.42 is at 08:00:27:4e:66:a1' },
      { number: 3, time: '00:00:05.000', source: '10.0.0.99', destination: '10.0.0.255', protocol: 'ARP', length: 42, info: 'Who has 10.0.0.1? Tell 10.0.0.99 (Gratuitous ARP)' },
      { number: 4, time: '00:00:05.500', source: '10.0.0.99', destination: '10.0.0.255', protocol: 'ARP', length: 42, info: '10.0.0.1 is at aa:bb:cc:dd:ee:ff (Gratuitous ARP)' },
      { number: 5, time: '00:00:06.000', source: '10.0.0.99', destination: '10.0.0.255', protocol: 'ARP', length: 42, info: 'Who has 10.0.0.1? Tell 10.0.0.99' },
      { number: 6, time: '00:00:06.500', source: '10.0.0.99', destination: '10.0.0.255', protocol: 'ARP', length: 42, info: '10.0.0.1 is at aa:bb:cc:dd:ee:ff' },
      { number: 7, time: '00:00:07.000', source: '10.0.0.99', destination: '10.0.0.255', protocol: 'ARP', length: 42, info: 'Who has 10.0.0.42? Tell 10.0.0.99' },
      { number: 8, time: '00:00:07.500', source: '10.0.0.99', destination: '10.0.0.255', protocol: 'ARP', length: 42, info: '10.0.0.42 is at aa:bb:cc:dd:ee:ff' },
      { number: 9, time: '00:00:10.000', source: '10.0.0.42', destination: '10.0.0.50', protocol: 'TCP', length: 74, info: 'SYN → 10.0.0.50:80', dstPort: 80, flags: 'SYN' },
      { number: 10, time: '00:00:10.100', source: '10.0.0.50', destination: '10.0.0.99', protocol: 'TCP', length: 74, info: 'SYN,ACK ← 10.0.0.50:80 (to wrong MAC)', srcPort: 80, flags: 'SYN,ACK' },
      { number: 11, time: '00:00:10.500', source: '10.0.0.99', destination: '10.0.0.255', protocol: 'ARP', length: 42, info: 'Who has 10.0.0.1? Tell 10.0.0.99 (ARP flood)' },
      { number: 12, time: '00:00:11.000', source: '10.0.0.99', destination: '10.0.0.255', protocol: 'ARP', length: 42, info: 'Who has 10.0.0.42? Tell 10.0.0.99 (ARP flood)' },
    ],
    analysisTasks: [
      { question: 'Which MAC address is performing the ARP attack?', hint: 'Look at the gratuitous ARP packets', answer: 'aa:bb:cc:dd:ee:ff (from 10.0.0.99)' },
      { question: 'What type of ARP attack is this?', hint: 'Multiple targets are being poisoned', answer: 'ARP spoofing/poisoning (Man-in-the-Middle)' },
      { question: 'What evidence shows the attack is successful?', hint: 'Look at packet 10', answer: 'TCP response goes to wrong MAC address' },
    ],
    filterCommands: [
      { filter: 'arp', description: 'Show all ARP traffic' },
      { filter: 'arp.opcode == 2', description: 'Show ARP replies only' },
    ],
    cpReward: 300,
  },
  {
    id: 'pcap-c2-1',
    title: 'C2 Beacon Detection',
    description: 'Identify command-and-control beaconing behavior in network traffic.',
    difficulty: 'advanced',
    packets: [
      { number: 1, time: '00:00:00.000', source: '10.0.0.42', destination: '185.234.72.10', protocol: 'HTTP', length: 256, info: 'GET /api/check?id=desktop01 HTTP/1.1', dstPort: 80 },
      { number: 2, time: '00:00:00.100', source: '185.234.72.10', destination: '10.0.0.42', protocol: 'HTTP', length: 128, info: 'HTTP/1.1 200 OK', srcPort: 80 },
      { number: 3, time: '00:00:60.000', source: '10.0.0.42', destination: '185.234.72.10', protocol: 'HTTP', length: 268, info: 'GET /api/check?id=desktop01&status=active HTTP/1.1', dstPort: 80 },
      { number: 4, time: '00:00:60.100', source: '185.234.72.10', destination: '10.0.0.42', protocol: 'HTTP', length: 142, info: 'HTTP/1.1 200 OK', srcPort: 80 },
      { number: 5, time: '00:01:00.000', source: '10.0.0.42', destination: '185.234.72.10', protocol: 'HTTP', length: 256, info: 'GET /api/check?id=desktop01 HTTP/1.1', dstPort: 80 },
      { number: 6, time: '00:01:00.080', source: '185.234.72.10', destination: '10.0.0.42', protocol: 'HTTP', length: 128, info: 'HTTP/1.1 200 OK', srcPort: 80 },
      { number: 7, time: '00:01:20.000', source: '10.0.0.42', destination: '185.234.72.10', protocol: 'HTTP', length: 312, info: 'POST /api/report HTTP/1.1 (data exfil)', dstPort: 80 },
      { number: 8, time: '00:01:20.100', source: '185.234.72.10', destination: '10.0.0.42', protocol: 'HTTP', length: 128, info: 'HTTP/1.1 200 OK', srcPort: 80 },
      { number: 9, time: '00:02:00.000', source: '10.0.0.42', destination: '185.234.72.10', protocol: 'HTTP', length: 256, info: 'GET /api/check?id=desktop01 HTTP/1.1', dstPort: 80 },
      { number: 10, time: '00:02:00.090', source: '185.234.72.10', destination: '10.0.0.42', protocol: 'HTTP', length: 128, info: 'HTTP/1.1 200 OK', srcPort: 80 },
      { number: 11, time: '00:02:40.000', source: '10.0.0.42', destination: '185.234.72.10', protocol: 'HTTP', length: 298, info: 'POST /api/report HTTP/1.1', dstPort: 80 },
      { number: 12, time: '00:02:40.080', source: '185.234.72.10', destination: '10.0.0.42', protocol: 'HTTP', length: 128, info: 'HTTP/1.1 200 OK', srcPort: 80 },
      { number: 13, time: '00:03:00.000', source: '10.0.0.42', destination: '185.234.72.10', protocol: 'HTTP', length: 256, info: 'GET /api/check?id=desktop01 HTTP/1.1', dstPort: 80 },
      { number: 14, time: '00:03:00.095', source: '185.234.72.10', destination: '10.0.0.42', protocol: 'HTTP', length: 128, info: 'HTTP/1.1 200 OK', srcPort: 80 },
      { number: 15, time: '00:03:40.000', source: '10.0.0.42', destination: '185.234.72.10', protocol: 'HTTP', length: 324, info: 'POST /api/report HTTP/1.1', dstPort: 80 },
    ],
    analysisTasks: [
      { question: 'What is the beaconing interval?', hint: 'Measure time between GET requests', answer: '60 seconds (regular interval)' },
      { question: 'What external IP is being contacted?', hint: 'Look at the destination IP', answer: '185.234.72.10' },
      { question: 'What data is being exfiltrated?', hint: 'Look at the POST requests', answer: 'Data sent via POST to /api/report' },
    ],
    filterCommands: [
      { filter: 'ip.dst == 185.234.72.10', description: 'Show traffic to C2 server' },
      { filter: 'http.request.method == "POST"', description: 'Show POST requests (exfil)' },
    ],
    cpReward: 400,
  },
];
