import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trophy } from 'lucide-react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import { resolveImg } from './helpers';
import type { MarketplaceItem } from './types';

interface EconomySectionProps {
  totalCp: number;
  marketItems: MarketplaceItem[];
}

const EconomySection: React.FC<EconomySectionProps> = ({ totalCp, marketItems }) => (
  <section className="py-16 md:py-24 bg-bg relative isolate">
    <img
      src="/images/section-backgrounds/offsec-grid-background.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-[0.16] md:opacity-[0.2] pointer-events-none"
    />
    <div className="absolute inset-0 bg-bg/38 pointer-events-none" />
    <div className="absolute inset-0 scanlines opacity-[0.02] pointer-events-none" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
        <div className="lg:col-span-5">
          <ScrollReveal>
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE ECONOMY</span>
            <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-5">Zero-Day Market</h2>
            <p className="text-text-secondary text-sm md:text-base mb-6 leading-relaxed">Earn Cyber Points (CP) by completing bootcamps and challenges. Use CP in the marketplace and track your progress on the leaderboard.</p>
            <ul className="flex flex-col space-y-3 mb-8">
              {['Complete bootcamps to earn CP', 'Finish challenges to earn more CP', 'Build your rank on the leaderboard', 'Spend CP in the marketplace'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-text-primary font-medium text-sm"><div className="w-2 h-2 rounded-full bg-accent flex-none" /> {item}</li>
              ))}
            </ul>
            <div className="p-4 md:p-5 bg-accent-dim border border-accent/20 rounded-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><ShoppingBag className="w-20 h-20" /></div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">OPERATOR_WALLET</div>
              <div className="text-2xl md:text-3xl font-bold text-accent font-mono mb-3">{totalCp.toLocaleString()} CP</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40"><Trophy className="w-4 h-4 text-accent" /></div>
                <div>
                  <div className="text-[10px] font-bold text-text-primary uppercase">Community CP Pool</div>
                  <div className="w-24 h-1.5 bg-bg rounded-full mt-1 overflow-hidden"><div className="w-[70%] h-full bg-accent" /></div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {marketItems.length === 0 ? (
            [0, 1, 2, 3].map((i) => (
              <div key={i} className="card-hsociety p-3 md:p-4 animate-pulse">
                <div className="w-full h-24 md:h-32 rounded bg-accent-dim/30 mb-3" />
                <div className="h-3 bg-accent-dim/30 rounded w-3/4 mb-2" />
                <div className="h-6 bg-accent-dim/20 rounded w-1/3 mt-auto" />
              </div>
            ))
          ) : (
            marketItems.slice(0, 4).map((prod, idx) => (
              <ScrollReveal key={prod._id || prod.id || idx} delay={idx * 0.1}>
                <div className="card-hsociety p-3 md:p-4 flex flex-col h-full">
                  <img src={resolveImg(prod.coverUrl, '/images/how-it-works-section/Engagements-4Completed.webp')} alt="" className="w-full h-24 md:h-32 object-cover rounded mb-3" />
                  <h4 className="text-xs md:text-sm font-bold text-text-primary mb-2 line-clamp-1">{prod.title}</h4>
                  <div className="mt-auto flex flex-col gap-2">
                    <span className="text-xs font-mono text-accent py-0.5 px-2 bg-accent-dim border border-accent/20 rounded w-fit">
                      {prod.cpPrice ?? 0} CP
                    </span>
                    <Link to="/marketplace" className="w-full py-2 bg-accent text-bg font-bold text-[10px] uppercase tracking-tighter rounded hover:brightness-110 text-center block">Buy with CP</Link>
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </div>
  </section>
);

export default EconomySection;
