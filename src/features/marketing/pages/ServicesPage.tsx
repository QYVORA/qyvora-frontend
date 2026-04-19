import React from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { Shield, Zap, Users, Mail, MessageSquare } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    { title: 'Penetration Testing', category: 'FOR ORGANISATIONS', icon: Shield, img: '/images/how-it-works-section/Engagements-4Completed.webp', bullet: ['Network and infrastructure penetration testing', 'Internal and external attack simulation', 'Detailed findings report with remediation guidance'] },
    { title: 'Web Application Security Audit', category: 'FOR ORGANISATIONS', icon: Users, img: '/images/how-it-works-section/Findings-Identified.webp', bullet: ['OWASP Top 10 full coverage', 'API and authentication testing', 'Business logic vulnerability analysis'] },
    { title: 'Vulnerability Assessment', category: 'FOR ORGANISATIONS', icon: Zap, img: '/images/how-it-works-section/Pentesters-Active.webp', bullet: ['Automated and manual scanning', 'Risk-rated vulnerability inventory', 'Prioritised remediation roadmap'] },
    { title: 'Corporate Security Bootcamp', category: 'FOR TEAMS', icon: Shield, img: '/images/Curriculum-images/phase1.webp', bullet: ['Beginner to advanced tracks available', 'Live instructor-led sessions', 'CTF challenges and supervised engagements'] },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">// OPERATIONS</span>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6">B2B Security Services</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Beyond training, we deliver professional offensive security services to organisations across Africa and beyond.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((serv, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div className="card-hsociety overflow-hidden flex flex-col h-full group">
                <div className="h-40 overflow-hidden">
                  <img src={serv.img} alt="" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all" />
                </div>
                <div className="p-6">
                  <span className="text-[9px] font-bold text-accent border border-accent/20 rounded px-1.5 py-0.5 mb-3 block w-fit">{serv.category}</span>
                  <h3 className="text-lg font-bold text-text-primary mb-4">{serv.title}</h3>
                  <ul className="space-y-2 mb-6">
                    {serv.bullet.map((b, i) => (
                      <li key={i} className="text-xs text-text-muted flex items-center gap-2">
                        <div className="w-1 h-1 bg-accent/30 rounded-full" /> {b}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full btn-secondary !py-2 !text-[10px]">Get a Quote</button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="card-hsociety p-12 text-center bg-accent-dim/10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Request Operational Support</h2>
          <p className="text-text-muted mb-8 max-w-lg mx-auto">Our security desk is ready to triage your requirements. Reach out for a confidential briefing.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button className="btn-primary flex items-center gap-2"><MessageSquare className="w-4 h-4" /> WhatsApp</button>
            <button className="btn-secondary flex items-center gap-2"><Mail className="w-4 h-4" /> Email us</button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Services;
