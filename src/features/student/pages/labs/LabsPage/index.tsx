import { useState, useMemo } from 'react';
import { FlaskConical, Search } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import LabCard from './LabCard';

const LABS = [
  {
    id: 'privesc',
    title: 'Privilege Escalation',
    description: 'Escalate permissions and gain root access on vulnerable systems',
    difficulty: 'beginner-advanced',
    cpReward: '50-400',
    route: '/dashboard/labs/privesc',
    accentColor: '#FBBF24',
  },
  {
    id: 'passwords',
    title: 'Password Cracking',
    description: 'Crack password hashes using brute-force and dictionary attacks',
    difficulty: 'beginner-advanced',
    cpReward: '100-300',
    route: '/dashboard/labs/passwords',
    accentColor: '#F59E0B',
  },
  {
    id: 'webapp',
    title: 'Web Exploitation',
    description: 'Exploit web application vulnerabilities and misconfigurations',
    difficulty: 'beginner-advanced',
    cpReward: '100-400',
    route: '/dashboard/labs/web-exploitation',
    accentColor: '#EF4444',
  },
  {
    id: 'sqli',
    title: 'SQL Injection',
    description: 'Extract data through SQL injection attacks on databases',
    difficulty: 'beginner-advanced',
    cpReward: '200-400',
    route: '/dashboard/labs/sql-injection',
    accentColor: '#06B66F',
  },
  {
    id: 'phishing',
    title: 'Phishing Analysis',
    description: 'Identify and analyze phishing campaigns and social engineering',
    difficulty: 'beginner-advanced',
    cpReward: '150-400',
    route: '/dashboard/labs/phishing',
    accentColor: '#8B5CF6',
  },
  {
    id: 'proxy',
    title: 'Web Proxy',
    description: 'Intercept and manipulate HTTP traffic using proxy tools',
    difficulty: 'beginner-advanced',
    cpReward: '150-400',
    route: '/dashboard/labs/proxy',
    accentColor: '#10B981',
  },
  {
    id: 'traffic',
    title: 'Traffic Analysis',
    description: 'Analyze network traffic patterns and detect suspicious activity',
    difficulty: 'beginner-advanced',
    cpReward: '150-400',
    route: '/dashboard/labs/traffic',
    accentColor: '#84CC16',
  },
  {
    id: 'osint',
    title: 'OSINT Recon',
    description: 'Gather intelligence using open source investigation techniques',
    difficulty: 'beginner-advanced',
    cpReward: '150-400',
    route: '/dashboard/labs/osint',
    accentColor: '#0EA5E9',
  },
  {
    id: 'wireless',
    title: 'Wireless Security',
    description: 'Test wireless network security and crack encryption protocols',
    difficulty: 'beginner-advanced',
    cpReward: '200-400',
    route: '/dashboard/labs/wireless',
    accentColor: '#F59E0B',
  },
  {
    id: 'killchain',
    title: 'Kill Chain',
    description: 'Execute a full penetration test from recon to exploitation',
    difficulty: 'intermediate-advanced',
    cpReward: '500-600',
    route: '/dashboard/labs/kill-chain',
    accentColor: '#DC2626',
  },
];

const LabsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLabs = useMemo(() => {
    if (!searchQuery) return LABS;
    const q = searchQuery.toLowerCase();
    return LABS.filter(
      (lab) =>
        lab.title.toLowerCase().includes(q) ||
        lab.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Attack Labs" description="Hands-on offensive security simulations on QYVORA." />
      <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
            Attack <span className="text-accent">Labs</span>
          </h1>
        </div>
        <p className="text-sm text-text-muted font-mono mb-6">Hands-on offensive security simulations</p>

        <div className="border-t border-border/30 mb-6" />

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search labs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary focus:border-accent outline-none font-mono text-sm transition-colors"
            />
          </div>
        </div>

        {filteredLabs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-text-muted mb-4" />
            <h3 className="text-lg font-black text-text-primary mb-2">No labs found</h3>
            <p className="text-sm text-text-muted">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredLabs.map((lab) => (
              <LabCard key={lab.id} {...lab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabsPage;
