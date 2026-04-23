import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Trophy, ShoppingBag, Shield } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import CpLogo from '../../../shared/components/CpLogo';

const CyberPointsPage: React.FC = () => (
  <div className="pt-28 pb-20 min-h-screen bg-bg">
    <div className="max-w-6xl mx-auto px-4 md:px-8">
      <ScrollReveal className="mb-10">
        <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 block">// CYBER POINTS</span>
        <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-4 inline-flex items-center gap-3">What Is <CpLogo className="w-10 h-10 md:w-12 md:h-12" /> ?</h1>
        <p className="text-text-secondary max-w-3xl text-sm md:text-base">
          Cyber Points is the operational value system inside HSOCIETY. You earn <CpLogo className="w-4 h-4 mx-1" /> by learning and proving skills,
          then spend <CpLogo className="w-4 h-4 mx-1" /> in the Zero-Day Market to unlock resources.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-10">
        <ScrollReveal className="lg:col-span-5">
          <div className="card-hsociety p-6 md:p-8 h-full flex items-center justify-center">
            <img
              src="/images/cp-images/CYBER_POINTS_LOGO.png"
              alt="Cyber Points logo"
              className="w-56 h-56 md:w-72 md:h-72 object-contain"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-7">
          <div className="card-hsociety p-6 md:p-8 h-full">
            <h2 className="text-2xl font-black text-text-primary mb-4 inline-flex items-center gap-2">How To Earn <CpLogo className="w-6 h-6" /></h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-bg border border-border">
                <BookOpen className="w-4 h-4 text-accent mt-0.5 flex-none" />
                <div>
                  <p className="text-sm font-bold text-text-primary">Complete Bootcamp Rooms</p>
                  <p className="text-xs text-text-muted">Progress through modules and finish room tasks to earn <CpLogo className="w-3.5 h-3.5 mx-1" />.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-bg border border-border">
                <Shield className="w-4 h-4 text-accent mt-0.5 flex-none" />
                <div>
                  <p className="text-sm font-bold text-text-primary">Finish Module Challenges</p>
                  <p className="text-xs text-text-muted">Complete module objectives and CTF milestones for higher rewards.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-bg border border-border">
                <Trophy className="w-4 h-4 text-accent mt-0.5 flex-none" />
                <div>
                  <p className="text-sm font-bold text-text-primary">Climb the Leaderboard</p>
                  <p className="text-xs text-text-muted">Consistent activity and completions grow your <CpLogo className="w-3.5 h-3.5 mx-1" /> and rank visibility.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <div className="card-hsociety p-6 md:p-8">
          <h3 className="text-xl font-black text-text-primary mb-3 inline-flex items-center gap-2">How To Use <CpLogo className="w-5 h-5" /></h3>
          <p className="text-sm text-text-secondary mb-6">
            Use earned <CpLogo className="w-4 h-4 mx-1" /> in the Zero-Day Market to purchase access to tools, resources, and operator assets.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/bootcamps" className="btn-secondary !py-2.5 text-xs inline-flex items-center justify-center gap-2">
              <BookOpen className="w-3.5 h-3.5" /> Start Training
            </Link>
            <Link to="/zero-day-market" className="btn-primary !py-2.5 text-xs inline-flex items-center justify-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5" /> Open Market <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </div>
);

export default CyberPointsPage;
