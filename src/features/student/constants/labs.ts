export interface LabDef {
  id: string;
  route: string;
  accentColor: string;
  difficulty: string;
  cpReward: string;
  titleKey?: string;
}

export const LABS: LabDef[] = [
  { id: 'privesc', route: '/dashboard/labs/privesc', accentColor: '#FBBF24', difficulty: 'beginner-advanced', cpReward: '50-400', titleKey: 'student.labs.list.privesc.title' },
  { id: 'passwords', route: '/dashboard/labs/passwords', accentColor: '#F59E0B', difficulty: 'beginner-advanced', cpReward: '100-300', titleKey: 'student.labs.list.passwords.title' },
  { id: 'sqli', route: '/dashboard/labs/sql-injection', accentColor: '#06B66F', difficulty: 'beginner-advanced', cpReward: '200-400', titleKey: 'student.labs.list.sqli.title' },
  { id: 'osint', route: '/dashboard/labs/osint', accentColor: '#0EA5E9', difficulty: 'beginner-advanced', cpReward: '150-400', titleKey: 'student.labs.list.osint.title' },
  { id: 'killchain', route: '/dashboard/labs/kill-chain', accentColor: '#DC2626', difficulty: 'intermediate-advanced', cpReward: '500-600', titleKey: 'student.labs.list.killchain.title' },
];

export const LABS_IDS = LABS.map(l => l.id) as readonly string[];
