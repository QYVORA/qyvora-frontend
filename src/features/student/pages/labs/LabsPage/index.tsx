import { useState, useMemo } from 'react';
import { FlaskConical, Search } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import LabCard from './LabCard';
import { LearningOverviewCard, LearningFilterStrip } from '@/features/student/components/learning';

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
  const [activeFilter, setActiveFilter] = useState('all');

  const difficultyFilters = useMemo(() => {
    const difficulties = new Set(LABS.map((lab) => {
      const parts = lab.difficulty.split('-');
      return parts[0];
    }));
    return [
      { id: 'all', label: 'All Labs', count: LABS.length },
      ...Array.from(difficulties).sort().map((d) => ({
        id: d,
        label: d.charAt(0).toUpperCase() + d.slice(1),
        count: LABS.filter((lab) => lab.difficulty.startsWith(d)).length,
      })),
    ];
  }, []);

  const filteredLabs = useMemo(() => {
    let result = [...LABS];

    if (activeFilter !== 'all') {
      result = result.filter((lab) => lab.difficulty.startsWith(activeFilter));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (lab) =>
          lab.title.toLowerCase().includes(q) ||
          lab.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, activeFilter]);

  const totalCpMin = LABS.reduce((sum, lab) => sum + parseInt(lab.cpReward.split('-')[0]), 0);
  const totalCpMax = LABS.reduce((sum, lab) => sum + parseInt(lab.cpReward.split('-')[1]), 0);

  return (
    <div className="bg-bg min-h-full">
      <SEO title="Attack Labs" description="Hands-on offensive security simulations on QYVORA." />
      <div className=" px-4 md:px-12 lg:px-16 pt-8 pb-20 lg:pb-24 space-y-8">

        <LearningOverviewCard
          icon={<FlaskConical className="w-6 h-6 text-bg" />}
          title="Attack Labs"
          description="Hands-on offensive security simulations. Practice real-world attack techniques in isolated environments."
          stats={[
            { label: 'Labs', value: LABS.length },
            { label: 'CP Range', value: `${totalCpMin}-${totalCpMax}` },
          ]}
          action={{
            label: 'Start First Lab',
            to: LABS[0]?.route,
          }}
        />

        <LearningFilterStrip
          filters={difficultyFilters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search labs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg border border-border rounded-xl py-3 pl-11 pr-4 text-text-primary focus:border-accent outline-none font-mono text-sm transition-colors"
          />
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
