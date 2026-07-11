import { Link } from 'react-router-dom';
import {
  FlaskConical, Shield, Key, Globe, Database, Mail,
  Network, Activity, Search, Wifi, Target,
  ArrowRight,
} from 'lucide-react';
import SEO from '@/shared/components/SEO';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Shield, Key, Globe, Database, Mail, Network, Activity, Search, Wifi, Target,
};

const LABS = [
  { id: 'privesc', title: 'Privilege Escalation', description: 'Escalate from user to root using Linux misconfigurations', icon: 'Shield', difficulty: 'beginner-advanced', category: 'privilege-escalation', cpReward: '50-400', route: '/dashboard/labs/privesc', skills: ['Linux', 'SUID', 'Sudo', 'Capabilities'] },
  { id: 'passwords', title: 'Password Cracking', description: 'Extract and crack password hashes using John and Hashcat', icon: 'Key', difficulty: 'beginner-advanced', category: 'password-cracking', cpReward: '100-300', route: '/dashboard/labs/passwords', skills: ['Hashing', 'John', 'Hashcat', '/etc/shadow'] },
  { id: 'webapp', title: 'Web Exploitation', description: 'Find and exploit vulnerabilities in a simulated web application', icon: 'Globe', difficulty: 'beginner-advanced', category: 'web-exploitation', cpReward: '100-400', route: '/dashboard/labs/web-exploitation', skills: ['XSS', 'CSRF', 'IDOR', 'SQLi'] },
  { id: 'sqli', title: 'SQL Injection', description: 'Master SQL injection techniques from union-based to blind', icon: 'Database', difficulty: 'beginner-advanced', category: 'sql-injection', cpReward: '200-400', route: '/dashboard/labs/sql-injection', skills: ['UNION', 'Blind', 'Error-based', 'Second-Order'] },
  { id: 'phishing', title: 'Phishing Analysis', description: 'Identify phishing emails and social engineering tactics', icon: 'Mail', difficulty: 'beginner-advanced', category: 'social-engineering', cpReward: '150-400', route: '/dashboard/labs/phishing', skills: ['Email Headers', 'URL Analysis', 'Social Engineering'] },
  { id: 'proxy', title: 'Web Proxy', description: 'Intercept and modify HTTP requests like Burp Suite', icon: 'Network', difficulty: 'beginner-advanced', category: 'proxy-traffic', cpReward: '150-400', route: '/dashboard/labs/proxy', skills: ['HTTP', 'Interception', 'Tampering', 'Session'] },
  { id: 'traffic', title: 'Traffic Analysis', description: 'Analyze packet captures for suspicious activity', icon: 'Activity', difficulty: 'beginner-advanced', category: 'network-analysis', cpReward: '150-400', route: '/dashboard/labs/traffic', skills: ['Wireshark', 'DNS', 'ARP', 'C2 Detection'] },
  { id: 'osint', title: 'OSINT Recon', description: 'Gather intelligence using open-source tools', icon: 'Search', difficulty: 'beginner-advanced', category: 'osint', cpReward: '150-400', route: '/dashboard/labs/osint', skills: ['WHOIS', 'DNS', 'Social Media', 'Breaches'] },
  { id: 'wireless', title: 'Wireless Security', description: 'Crack WiFi passwords and detect rogue access points', icon: 'Wifi', difficulty: 'beginner-advanced', category: 'wireless', cpReward: '200-400', route: '/dashboard/labs/wireless', skills: ['WPA2', 'WEP', 'Evil Twin', 'Aircrack'] },
  { id: 'killchain', title: 'Kill Chain', description: 'Execute a full penetration test from recon to exfiltration', icon: 'Target', difficulty: 'intermediate-advanced', category: 'kill-chain', cpReward: '500-600', route: '/dashboard/labs/kill-chain', skills: ['Full Chain', 'Recon', 'Exploit', 'Exfil'] },
];

const LabCard = ({ lab }: { lab: typeof LABS[number] }) => {
  const Icon = ICON_MAP[lab.icon] || Shield;

  return (
    <Link
      to={lab.route}
      className="group flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
          {lab.title}
        </h3>
      </div>

      <p className="text-xs text-text-muted/70 font-mono leading-relaxed mb-4 flex-1 line-clamp-2">
        {lab.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {lab.skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/20">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
            {lab.difficulty}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">
            {lab.cpReward} CP
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
      </div>
    </Link>
  );
};

const LabsPage = () => {
  return (
    <div className="bg-bg min-h-full">
      <SEO title="Attack Labs" description="Hands-on offensive security simulations on QYVORA." />

      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
              <FlaskConical className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
              Attack <span className="text-accent">Labs</span>
            </h1>
          </div>
          <p className="text-sm text-text-muted font-mono">
            Hands-on offensive security simulations
          </p>
        </div>

        {/* Lab cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LABS.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabsPage;
