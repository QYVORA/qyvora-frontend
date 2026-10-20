export interface LabDef {
  id: string;
  route: string;
  accentColor: string;
  difficulty: string;
  cpReward: string;
  title: string;
  desc: string;
}

export const LABS: LabDef[] = [
  { id: 'privesc', route: '/dashboard/labs/privesc', accentColor: '#FBBF24', difficulty: 'beginner-advanced', cpReward: '50-400', title: 'Privilege Escalation', desc: 'Escalate permissions and gain root access on vulnerable systems' },
  { id: 'passwords', route: '/dashboard/labs/passwords', accentColor: '#F59E0B', difficulty: 'beginner-advanced', cpReward: '100-300', title: 'Password Cracking', desc: 'Crack password hashes using brute-force and dictionary attacks' },
  { id: 'sqli', route: '/dashboard/labs/sql-injection', accentColor: '#06B66F', difficulty: 'beginner-advanced', cpReward: '200-400', title: 'SQL Injection', desc: 'Extract data through SQL injection attacks on databases' },
  { id: 'osint', route: '/dashboard/labs/osint', accentColor: '#0EA5E9', difficulty: 'beginner-advanced', cpReward: '150-400', title: 'OSINT Recon', desc: 'Gather intelligence using open source investigation techniques' },
  { id: 'killchain', route: '/dashboard/labs/kill-chain', accentColor: '#DC2626', difficulty: 'intermediate-advanced', cpReward: '500-600', title: 'Kill Chain', desc: 'Execute a full penetration test from recon to exploitation' },
  { id: 'web-access-control', route: '/dashboard/labs/web-access-control', accentColor: '#06B66F', difficulty: 'beginner-intermediate', cpReward: '150-200', title: 'Broken Access Control', desc: 'Exploit IDOR and BOLA flaws to read other users\' data' },
  { id: 'api-security', route: '/dashboard/labs/api-security', accentColor: '#0EA5E9', difficulty: 'intermediate', cpReward: '200-250', title: 'API Security', desc: 'Forge JWTs and pivot through SSRF against modern APIs' },
  { id: 'automation', route: '/dashboard/labs/automation', accentColor: '#F59E0B', difficulty: 'beginner', cpReward: '150', title: 'Security Automation', desc: 'Build Python and Bash tooling to automate offensive work' },
  { id: 'methodology', route: '/dashboard/labs/methodology', accentColor: '#06B66F', difficulty: 'beginner', cpReward: '150', title: 'Engagement Methodology', desc: 'Verify scope authorization and map the attack surface' },
  { id: 'network-security', route: '/dashboard/labs/network-security', accentColor: '#3b82f6', difficulty: 'intermediate', cpReward: '150-200', title: 'Network Security', desc: 'Enumerate services and analyse traffic on internal networks' },
  { id: 'wlan-security', route: '/dashboard/labs/wlan-security', accentColor: '#F59E0B', difficulty: 'beginner-intermediate', cpReward: '150-200', title: 'Wireless Security', desc: 'Survey access points and capture WLAN handshakes in the lab' },
  { id: 'ad-enum', route: '/dashboard/labs/ad-enum', accentColor: '#0EA5E9', difficulty: 'intermediate', cpReward: '200-250', title: 'AD Enumeration', desc: 'Map a Windows domain over LDAP and BloodHound' },
  { id: 'attack-paths', route: '/dashboard/labs/attack-paths', accentColor: '#DC2626', difficulty: 'advanced', cpReward: '200-250', title: 'Enterprise Attack Paths', desc: 'Roast Kerberos tickets and move laterally to the objective' },
];

export const LABS_IDS = LABS.map(l => l.id) as readonly string[];
