import React from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';

const Team: React.FC = () => {
  const members = [
    { name: 'Operations Lead', role: 'Leadership', specialty: 'Offensive Security Strategy', img: '/gallery/gallery-01.jpeg' },
    { name: 'Lead Instructor', role: 'Training', specialty: 'Hands-on Bootcamp Delivery', img: '/gallery/gallery-02.jpeg' },
    { name: 'Security Researcher', role: 'Research', specialty: 'Web & Infrastructure Testing', img: '/gallery/gallery-03.jpeg' },
    { name: 'Community Operations', role: 'Support', specialty: 'Learner Success and Support', img: '/gallery/gallery-04.jpeg' },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal className="mb-16">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">// THE OPERATORS</span>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6">Meet The Team</h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            The people building HSOCIETY and driving the offensive security community forward.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="card-hsociety group overflow-hidden">
                <div className="aspect-square overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-text-primary font-mono mb-1">{member.name}</h3>
                  <div className="text-accent text-[10px] font-bold uppercase tracking-widest mb-4">{member.role}</div>
                  <div className="p-3 bg-bg-card border border-border rounded text-xs text-text-muted">
                    <span className="text-accent font-bold">Specialty:</span> {member.specialty}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
