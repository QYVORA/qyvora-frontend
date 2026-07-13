import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Zap } from 'lucide-react';

const LABS = [
  { id: 'privesc', title: 'Privilege Escalation', desc: 'Escalate permissions and gain root access through misconfigs, kernel exploits, and SUID binaries', cp: '50-400 CP', color: '#FBBF24' },
  { id: 'passwords', title: 'Password Cracking', desc: 'Crack hashes using brute-force, dictionary attacks, and rule-based generation', cp: '100-300 CP', color: '#F59E0B' },
  { id: 'webapp', title: 'Web Exploitation', desc: 'Exploit XSS, SSRF, deserialization, and access control flaws in modern web apps', cp: '100-400 CP', color: '#EF4444' },
  { id: 'sqli', title: 'SQL Injection', desc: 'Extract databases through union-based, blind, and time-based injection vectors', cp: '200-400 CP', color: '#06B66F' },
  { id: 'phishing', title: 'Phishing Analysis', desc: 'Identify phishing kits, analyze email headers, and trace social engineering campaigns', cp: '150-400 CP', color: '#8B5CF6' },
  { id: 'proxy', title: 'Web Proxy', desc: 'Intercept, modify, and replay HTTP traffic using Burp Suite and mitmproxy', cp: '150-400 CP', color: '#10B981' },
  { id: 'traffic', title: 'Traffic Analysis', desc: 'Analyze PCAP files, detect anomalies, and reconstruct sessions from network captures', cp: '150-400 CP', color: '#84CC16' },
  { id: 'osint', title: 'OSINT Recon', desc: 'Gather intelligence from public sources, breach databases, and map attack surfaces', cp: '150-400 CP', color: '#0EA5E9' },
  { id: 'wireless', title: 'Wireless Security', desc: 'Test WPA2 handshakes, rogue APs, and deauthentication vulnerabilities', cp: '200-400 CP', color: '#F59E0B' },
  { id: 'killchain', title: 'Kill Chain', desc: 'Full pentest from recon to exploitation — chain every skill into a complete attack narrative', cp: '500-600 CP', color: '#DC2626' },
];

const VISIBLE = 5;
const CYCLE_MS = 3500;

const LandingLabsSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [order, setOrder] = useState(() => LABS.map((_, i) => i));
  const [featuredSlot, setFeaturedSlot] = useState(0);

  const advance = useCallback(() => {
    setOrder((prev) => {
      const next = [...prev];
      const first = next.shift()!;
      next.push(first);
      return next;
    });
    setFeaturedSlot((s) => (s + 1) % VISIBLE);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(advance, CYCLE_MS);
    return () => clearInterval(id);
  }, [advance, shouldReduceMotion]);

  const visible = order.slice(0, VISIBLE);

  return (
    <div className="bg-accent" data-nav-invert>
      <div className="w-full px-4 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
        <div className="w-full lg:max-w-6xl lg:mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-bg/20 bg-bg/10 text-[10px] font-black uppercase tracking-[0.25em] text-bg mb-3">
              <Zap className="h-3 w-3" /> Live Environments
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-bg tracking-tighter leading-none mb-2">
              Attack <span className="text-bg/70">Labs</span>
            </h2>
            <p className="text-xs md:text-sm text-bg/60 leading-relaxed max-w-xl">
              10 sandboxed environments. Real tools, real vulnerabilities, real exploits.
            </p>
          </motion.div>

          {/* Unified grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3">
            {visible.map((labIdx, slot) => {
              const lab = LABS[labIdx];
              const isFeatured = slot === featuredSlot;
              return (
                <motion.div
                  key={labIdx}
                  layout
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={isFeatured ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
                >
                  <Link
                    to="/dashboard/labs"
                    className="group relative block rounded-2xl border border-border/20 bg-bg/90 transition-all duration-300 hover:border-accent/30 overflow-hidden h-full"
                  >
                    {isFeatured ? (
                      <div className="relative p-5 sm:p-6 flex flex-col h-full">
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-1/3 translate-x-1/3" style={{ background: lab.color }} />
                        <div className="relative flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${lab.color}25` }}>
                              <span className="text-lg font-black" style={{ color: lab.color }}>{String(labIdx + 1).padStart(2, '0')}</span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: lab.color, borderColor: `${lab.color}40`, background: `${lab.color}15` }}>
                              {lab.cp}
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-text-primary tracking-tighter leading-none mb-2">
                            {lab.title}
                          </h3>
                          <p className="text-xs md:text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                            {lab.desc}
                          </p>
                          <div className="mt-auto flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-[9px] font-black uppercase tracking-widest text-bg transition-all group-hover:gap-2.5">
                              <Zap className="w-3 h-3" />
                              Launch Lab
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 sm:p-4 flex flex-col h-full">
                        <div className="w-full h-0.5 rounded-full mb-2 opacity-40" style={{ background: `linear-gradient(90deg, ${lab.color}, transparent)` }} />
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${lab.color}20` }}>
                            <span className="text-[9px] font-black" style={{ color: lab.color }}>{String(labIdx + 1).padStart(2, '0')}</span>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full" style={{ color: lab.color, background: `${lab.color}15` }}>
                            {lab.cp}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-black text-text-primary mb-0.5 tracking-tight group-hover/card:text-accent transition-colors leading-snug">
                          {lab.title}
                        </h3>
                        <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2 flex-1">
                          {lab.desc}
                        </p>
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5"
          >
            <Link
              to="/dashboard/labs"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-bg/60 hover:text-bg transition-colors"
            >
              View All Labs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingLabsSection;
