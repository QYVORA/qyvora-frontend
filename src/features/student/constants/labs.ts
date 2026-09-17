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
];

export const LABS_IDS = LABS.map(l => l.id) as readonly string[];
