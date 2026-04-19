import React from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import ReconGlobe from '../components/ReconGlobe';
import { Terminal, Shield } from 'lucide-react';

interface ToolPageProps {
  title: string;
  subtitle: string;
  kicker: string;
  description: string;
  hasGlobe?: boolean;
}

const ToolPage: React.FC<ToolPageProps> = ({ title, subtitle, kicker, description, hasGlobe }) => {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{kicker}</span>
            <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 leading-tight">{title}</h1>
            <p className="text-text-secondary text-lg mb-8">{subtitle}</p>
            <p className="text-text-muted mb-12 leading-relaxed">{description}</p>
          </ScrollReveal>

          {hasGlobe ? (
            <ScrollReveal delay={0.2} className="relative h-[400px] md:h-[600px] overflow-hidden">
               <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
               <ReconGlobe />
               <div className="absolute bottom-4 left-4 p-4 bg-bg/80 backdrop-blur-md border border-border rounded-lg max-w-xs">
                 <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">LIVE_RECON_FEED</div>
                 <div className="font-mono text-[9px] text-text-muted">
                   {`[+] SCANNING NODE: 192.168.1.104\n[+] PORT 8080: OPEN\n[+] FINGERPRINTING...`}
                 </div>
               </div>
            </ScrollReveal>
          ) : (
             <ScrollReveal delay={0.2} className="card-hsociety p-12 aspect-square flex flex-col items-center justify-center text-center">
               <Shield className="w-24 h-24 text-accent/20 mb-8" />
               <h3 className="text-xl font-bold text-text-primary mb-4">RESTRICTED ACCESS</h3>
               <p className="text-sm text-text-muted mb-8 max-w-xs mx-auto">This tool requires a valid Operator Rank and Active Session to utilise in the labs.</p>
               <button className="btn-primary !py-2.5">Establish Session</button>
             </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolPage;
