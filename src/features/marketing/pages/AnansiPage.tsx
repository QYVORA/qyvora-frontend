import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Download, Shield, Zap, Search, Globe, Lock, FileCode, AlertTriangle } from 'lucide-react';
import AdinkraBackground from '../../../shared/components/backgrounds/AdinkraBackground';

const AnansiASCIIArt = `
              ;                  &              
            ;;                    ;&            
           ;;;                    ;;;           
      ;    ;;;                    ;;;    ;      
      ;;;  ;;;        ;   ;;      ;;;   ;;;     
      ;;;;  ;;;;   ;;; && ;;;   ;;;;   ;;;;     
       ;;;;   ;;;; ;;;;;;;;;; ;;;;    ;;;;      
        ;;;;;;;;; ;;;;;;;;;;;;;;;; ;;;;;;;;;    
            &;;;;;;;;;;;;$x;;;;;;;;;;;;         
           ;;;;;;;;;;&&&+++&&&;;;;;;;;;;;       
      ;;;;;;;;;  ;;;&&+&&&&&+&&;;;  ;;;;;;;;;;  
      ;;;&    ;; ;;;&+&&&&&&&+&&;;; ;;    &;;;  
      ;;;   ;;;;  ;;;&&+&&&&&&+&;;; ;;;;   ;;;  
      ;;;   ;;;   ;;;;&&++&++++&&;;  ;;;   ;;;  
       ;;   ;;;    ;;;;;;;;;;;&&&&;  ;;;   ;;   
       ;;   ;;;      ;;;;;;;;;;;;;;  ;;;   ;;   
        ;   ;;;        ;;;;;;;;;;    ;;;   ;    
            &;;           ;;;;       ;;&        
              ;;           ;;       ;;;          
                ;                 ;             `;

const PHASES = [
  { id: '01', name: 'DISCOVERY', icon: Search, desc: 'Subdomains via crt.sh CT logs + DNS brute-force' },
  { id: '02', name: 'PROBE', icon: Globe, desc: 'Live HTTP/HTTPS hosts, status codes, and titles' },
  { id: '03', name: 'TLS', icon: Lock, desc: 'Certificate analysis, SANs, and protocol audit' },
  { id: '04', name: 'HEADERS', icon: Shield, desc: 'Security headers and CORS misconfigurations' },
  { id: '05', name: 'PATHS', icon: FileCode, desc: 'Exposed files (.env, .git), admin panels, and backups' },
  { id: '06', name: 'TAKEOVER', icon: AlertTriangle, desc: 'Dangling CNAME detection for cloud services' },
];

const AnansiPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-bg text-text pt-32 pb-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* ── Background ──────────────────────────────────────────────────── */}
      <AdinkraBackground opacity={0.15} includeGradients={true} includeDotGrid={true} />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-[1.2] space-y-10"
        >
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-blue-400/10 border border-blue-400/20 rounded-lg"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
              </span>
              <span className="text-blue-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                Available Now // v1.0.0
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-[1.05]">
              ANANSI <span className="text-blue-400">CLI</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl font-mono leading-relaxed">
              Terminal-first attack surface intelligence engine. Built for speed, portability, and raw technical signal.
            </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
            <a 
              href="#install" 
              className="group relative bg-accent text-bg px-10 py-5 rounded-xl font-black uppercase tracking-[0.15em] text-sm hover:brightness-110 transition-all flex items-center gap-3 overflow-hidden shadow-[0_0_20px_rgba(96,165,250,0.3)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <Download className="w-5 h-5 relative z-10" /> 
              <span className="relative z-10">Get Binary</span>
            </a>
            <a 
              href="https://github.com/QYVORA/qyvora-anansi-cli" 
              target="_blank" 
              rel="noreferrer"
              className="border border-border bg-bg-card/30 px-10 py-5 rounded-xl font-black uppercase tracking-[0.15em] text-sm hover:bg-bg-card/50 transition-all flex items-center gap-3"
            >
              <Zap className="w-5 h-5" /> View Source
            </a>
            </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex-1 hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-blue-400/5 blur-[100px] rounded-full" />
              <pre className="relative z-10 text-[11px] leading-[1.1] text-blue-400 font-mono select-none drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
                {AnansiASCIIArt}
              </pre>
            </motion.div>
            </div>

            {/* ── Terminal Box Section ────────────────────────────────────────── */}
            <div id="install" className="relative z-10 max-w-5xl mx-auto mt-48 space-y-16">
            <div className="text-center space-y-6">
            <h3 className="text-4xl font-black uppercase tracking-tight">Instant Deployment</h3>
            <p className="text-text-secondary font-mono max-w-2xl mx-auto text-lg leading-relaxed">
            Zero dependencies. Zero configuration. Single binary. 
            Reconnaissance that fits in your pocket.
            </p>
            </div>

            <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#050505] border border-border/50 rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
            >
            <div className="bg-bg-card/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between">
            <div className="flex gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-xs font-mono text-text-muted tracking-[0.2em] uppercase font-bold">
              operator@qyvora:~
            </div>
            <div className="w-10" />
            </div>
            <div className="p-8 md:p-12 font-mono text-sm md:text-lg space-y-10 overflow-x-auto">
              <div className="space-y-4">
                <div className="text-blue-400/40 font-bold uppercase tracking-[0.2em] text-xs"># Step 01: Download for Linux (AMD64)</div>
                <div className="flex gap-4 items-start group">
                  <span className="text-blue-400 font-bold mt-1">$</span>
                  <code className="text-text-primary whitespace-nowrap bg-bg-card/30 p-2 rounded-lg group-hover:text-blue-400 transition-colors">
                    curl -L https://github.com/QYVORA/qyvora-anansi-cli/releases/latest/download/anansi-linux-amd64 -o anansi
                  </code>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-blue-400/40 font-bold uppercase tracking-[0.2em] text-xs"># Step 02: Make Executable & Install</div>
                <div className="flex gap-4 items-start group">
                  <span className="text-blue-400 font-bold mt-1">$</span>
                  <code className="text-text-primary whitespace-nowrap bg-bg-card/30 p-2 rounded-lg group-hover:text-blue-400 transition-colors">
                    chmod +x anansi && sudo mv anansi /usr/local/bin/
                  </code>
                </div>
              </div>

              <div className="pt-8 space-y-4 border-t border-border/20">
                <div className="text-blue-400/40 font-bold uppercase tracking-[0.2em] text-xs"># Step 03: Run Initial Scan</div>
                <div className="flex gap-4 items-start group">
                  <span className="text-blue-400 font-bold mt-1">$</span>
                  <code className="text-text-primary group-hover:text-blue-400 transition-colors">anansi target.com --deep</code>
                </div>
              </div>
            </div>
            </motion.div>
            </div>

            {/* ── Features Grid ────────────────────────────────────────────────── */}
            <div className="relative z-10 max-w-7xl mx-auto mt-56 space-y-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
               <h2 className="text-blue-400 font-mono text-sm tracking-[0.3em] uppercase">
                // THE PIPELINE
              </h2>
              <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tight">Engineered for Precision</h3>
              <p className="text-text-secondary font-mono max-w-2xl text-lg leading-relaxed">
                Anansi executes a comprehensive six-phase reconnaissance lifecycle, extracting critical technical data without the noise.
              </p>
            </div>
            <div className="text-9xl font-black text-blue-400/5 select-none hidden lg:block tracking-tighter">
              RECON
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PHASES.map((phase, idx) => (
            <motion.div 
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, borderColor: 'var(--color-accent)' }}
              className="p-10 border border-border bg-bg-card/10 backdrop-blur-sm rounded-2xl hover:bg-bg-card/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <phase.icon className="w-24 h-24" />
              </div>

              <div className="flex items-start justify-between mb-10">
                <div className="p-4 bg-blue-400/5 rounded-xl group-hover:bg-blue-400/10 transition-colors border border-blue-400/10 group-hover:border-blue-400/30">
                  <phase.icon className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-sm font-mono text-blue-400/40 font-bold tracking-[0.3em] uppercase">
                  Phase {phase.id}
                </span>
              </div>

              <h4 className="text-2xl font-black uppercase tracking-widest mb-6 group-hover:text-blue-400 transition-colors">{phase.name}</h4>
              <p className="text-text-secondary font-mono text-base leading-relaxed">
                {phase.desc}
              </p>
            </motion.div>
            ))}
            </div>
            </div>

            {/* ── Call to Action ───────────────────────────────────────────────── */}
            <div className="relative z-10 max-w-4xl mx-auto mt-64 text-center space-y-16 py-32 border-t border-border/20">
            <div className="space-y-8">
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Own the Perimeter</h3>
            <p className="text-xl text-text-secondary font-mono max-w-2xl mx-auto leading-relaxed">
            No web UI. No cloud account. No API keys. 
            Just high-signal intelligence delivered straight to your terminal.
            </p>
            </div>

        <div className="flex flex-col items-center gap-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <pre className="relative z-10 text-[8px] md:text-[12px] leading-tight text-blue-400/40 font-mono select-none transition-all duration-700 group-hover:text-blue-400/80 group-hover:scale-105">
              {AnansiASCIIArt}
            </pre>
          </div>

          <a 
            href="https://github.com/QYVORA/qyvora-anansi-cli"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-4 text-blue-400 font-black uppercase tracking-[0.4em] text-sm hover:gap-6 transition-all"
          >
            Explore the Repository <Zap className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnansiPage;

