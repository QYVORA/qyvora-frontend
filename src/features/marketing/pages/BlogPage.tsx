import React from 'react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const posts = [
    { title: 'OWASP Top 10 Testing Workflow for Modern Apps', date: '2026-04-12', author: 'HSOCIETY OFFSEC', category: 'Web Security', img: '/gallery/gallery-01.jpeg', excerpt: 'A practical walkthrough for validating authentication, authorization, injection, and business-logic controls during an application security audit.' },
    { title: 'Building Structured Bootcamp Learning Paths', date: '2026-04-05', author: 'HSOCIETY OFFSEC', category: 'Training', img: '/gallery/gallery-02.jpeg', excerpt: 'How phased curriculum design helps learners move from fundamentals to validated hands-on offensive security capability.' },
    { title: 'From Vulnerability Assessment to Remediation Plan', date: '2026-03-28', author: 'HSOCIETY OFFSEC', category: 'Operations', img: '/gallery/gallery-03.jpeg', excerpt: 'Converting findings into a risk-prioritised remediation roadmap that engineering and leadership teams can execute quickly.' },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <ScrollReveal className="mb-16">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">// RESEARCH</span>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6">Operator Intel</h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Deep dives into offensive techniques, findings, and tradecraft from our researchers.
          </p>
        </ScrollReveal>

        <div className="space-y-12">
          {posts.map((post, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="card-hsociety overflow-hidden flex flex-col md:flex-row gap-0 md:gap-8 hover:glow-shadow transition-all group">
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                </div>
                <div className="md:w-2/3 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">
                    <span className="px-2 py-0.5 border border-accent/20 bg-accent-dim text-accent rounded-sm">{post.category}</span>
                    <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</div>
                    <div className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</div>
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-accent transition-colors underline decoration-transparent group-hover:decoration-accent/30 underline-offset-4">
                    {post.title}
                  </h2>
                  <p className="text-text-muted text-sm mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <button className="flex items-center gap-2 text-accent text-sm font-bold hover:gap-3 transition-all">
                    Read Intel <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
