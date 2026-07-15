import { useState } from 'react';
import { Search, Globe, Hash, User, Image, Calendar, Database } from 'lucide-react';
import type { OsintModule } from './types';

interface OsintDashboardProps {
  modules: OsintModule[];
}

const MODULE_ICONS: Record<string, typeof Globe> = {
  whois: Globe, dns: Database, metadata: Hash, social: User, images: Image, search: Search, timeline: Calendar,
};

export function OsintDashboard({ modules }: OsintDashboardProps) {
  const [activeModule, setActiveModule] = useState(modules[0]?.id || '');
  const [queries, setQueries] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    modules.forEach(m => { if (m.result) init[m.id] = m.result; });
    return init;
  });
  const [searching, setSearching] = useState(false);

  const current = modules.find(m => m.id === activeModule);
  const Icon = MODULE_ICONS[current?.type || 'search'] || Search;

  const handleSearch = () => {
    if (!current) return;
    const q = queries[current.id] || '';
    if (!q.trim()) return;
    setSearching(true);
    setTimeout(() => {
      const simulatedResult = generateResult(current.type, q, current);
      setResults(prev => ({ ...prev, [current.id]: simulatedResult }));
      setSearching(false);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">OSINT Dashboard</p>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Module Tabs */}
        <div className="w-[160px] border-r border-border/20 overflow-auto shrink-0 py-1">
          {modules.map(m => {
            const MIcon = MODULE_ICONS[m.type] || Search;
            return (
              <button key={m.id} onClick={() => setActiveModule(m.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                  activeModule === m.id ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-white/5'
                }`}>
                <MIcon size={12} />
                <span className="text-[10px] font-mono">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Module Content */}
        {current && (
          <div className="flex-1 min-w-0 flex flex-col p-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon size={16} className="text-accent" />
              <h3 className="text-sm font-bold text-text-primary">{current.label}</h3>
            </div>

            {/* Query Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={queries[current.id] || ''}
                onChange={e => setQueries(prev => ({ ...prev, [current.id]: e.target.value }))}
                placeholder={`Enter ${current.type} query...`}
                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-border/30 text-[11px] font-mono text-text-primary outline-none focus:border-accent/50"
              />
              <button onClick={handleSearch} disabled={searching}
                className="px-3 py-2 rounded-lg bg-accent/10 border border-accent/30 text-[9px] font-black uppercase tracking-wider text-accent disabled:opacity-50">
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Result */}
            <div className="flex-1 overflow-auto bg-black/40 rounded-lg p-3">
              {results[current.id] ? (
                <pre className="text-[10px] font-mono text-text-muted whitespace-pre-wrap">{results[current.id]}</pre>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted/50 text-[10px] font-mono">
                  Enter a query and click Search
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function generateResult(type: string, query: string, module: OsintModule): string {
  const q = query.toLowerCase().replace(/\s/g, '');
  switch (type) {
    case 'whois':
      return `Domain: ${q}\nRegistrar: Namecheap Inc.\nCreated: 2019-03-15\nExpires: 2025-03-15\nUpdated: 2024-01-10\n\nName Servers:\n  ns1.digitalocean.com\n  ns2.digitalocean.com\n\nStatus: clientTransferProhibited\nRegistrant: REDACTED FOR PRIVACY`;
    case 'dns':
      return `A Records:\n  ${q} -> 104.21.45.67\n  ${q} -> 104.21.46.67\n\nMX Records:\n  mail.${q} -> 10.0.0.50 (priority 10)\n\nTXT Records:\n  "v=spf1 include:_spf.google.com ~all"\n  "google-site-verification=abc123"\n\nNS Records:\n  ns1.digitalocean.com\n  ns2.digitalocean.com\n\nCNAME: (none)`;
    case 'metadata':
      return query.toLowerCase().includes('image') || query.toLowerCase().includes('photo')
        ? `EXIF Data:\n  Camera: Canon EOS R5\n  Date: 2024-01-15 14:32:05\n  GPS: 37.7749° N, 122.4194° W\n  Software: Adobe Photoshop 25.4\n  Resolution: 8192 x 5464\n  Color Space: sRGB\n  \nWarning: GPS coordinates embedded in image`
        : 'No metadata available. Provide an image URL or filename to analyze.';
    case 'social':
      return `LinkedIn: ${query || module.query} Corp\n  - 500+ employees\n  - Founded 2015\n  - HQ: San Francisco, CA\n\nTwitter: @${q}\n  - 12.4K followers\n  - Joined Mar 2015\n  - Bio: "Innovation starts here"\n\nGitHub: github.com/${q}\n  - 47 repositories\n  - 312 followers\n  - Top languages: JavaScript, Python\n\nKey Personnel:\n  - CTO: j.doe@${q} (GitHub: janedoe)`;
    case 'search':
      return `Results for "${query}":\n\n1. ${query} — Official Website\n   https://www.${q}.com\n   Corporate website for ${query} Inc.\n\n2. ${query} on LinkedIn\n   https://linkedin.com/company/${q}\n   ${query} Corp | 500+ employees\n\n3. ${query} - Wikipedia\n   https://en.wikipedia.org/wiki/${q}\n   Overview and history of ${query}.\n\n4. Jobs at ${query}\n   https://glassdoor.com/${q}-jobs\n   23 open positions found.\n\n5. ${query} GitHub\n   https://github.com/${q}\n   Open source projects and contributions.`;
    default:
      return module.result || 'No results found.';
  }
}
