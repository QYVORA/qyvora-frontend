import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { LAB_ICONS } from './LabIcons';

const LABS = [
  { id: 'privesc', title: 'Privilege Escalation', difficulty: 'beginner-advanced', cpReward: '50-400', route: '/dashboard/labs/privesc' },
  { id: 'passwords', title: 'Password Cracking', difficulty: 'beginner-advanced', cpReward: '100-300', route: '/dashboard/labs/passwords' },
  { id: 'webapp', title: 'Web Exploitation', difficulty: 'beginner-advanced', cpReward: '100-400', route: '/dashboard/labs/web-exploitation' },
  { id: 'sqli', title: 'SQL Injection', difficulty: 'beginner-advanced', cpReward: '200-400', route: '/dashboard/labs/sql-injection' },
  { id: 'phishing', title: 'Phishing Analysis', difficulty: 'beginner-advanced', cpReward: '150-400', route: '/dashboard/labs/phishing' },
  { id: 'proxy', title: 'Web Proxy', difficulty: 'beginner-advanced', cpReward: '150-400', route: '/dashboard/labs/proxy' },
  { id: 'traffic', title: 'Traffic Analysis', difficulty: 'beginner-advanced', cpReward: '150-400', route: '/dashboard/labs/traffic' },
  { id: 'osint', title: 'OSINT Recon', difficulty: 'beginner-advanced', cpReward: '150-400', route: '/dashboard/labs/osint' },
  { id: 'wireless', title: 'Wireless Security', difficulty: 'beginner-advanced', cpReward: '200-400', route: '/dashboard/labs/wireless' },
  { id: 'killchain', title: 'Kill Chain', difficulty: 'intermediate-advanced', cpReward: '500-600', route: '/dashboard/labs/kill-chain' },
];

const LabsPage = () => (
  <div className="bg-bg min-h-full">
    <SEO title="Attack Labs" description="Hands-on offensive security simulations on QYVORA." />
    <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
          <FlaskConical className="w-6 h-6 text-accent" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
          Attack <span className="text-accent">Labs</span>
        </h1>
      </div>
      <p className="text-sm text-text-muted font-mono mb-8">Hands-on offensive security simulations</p>
      <div className="border-t border-border/30 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-12 gap-y-10">
        {LABS.map((lab) => {
          const Icon = LAB_ICONS[lab.id] || LAB_ICONS.privesc;
          return (
            <Link
              key={lab.id}
              to={lab.route}
              className="group flex flex-col items-center gap-3 py-6 px-6 rounded-2xl transition-all duration-200"
            >
              <div className="text-accent transition-transform duration-200 group-hover:scale-105">
                <Icon className="w-44 h-44 md:w-48 md:h-48" />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors text-center leading-snug">
                  {lab.title}
                </h3>
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">
                  {lab.difficulty}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                  {lab.cpReward} CP
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);

export default LabsPage;
