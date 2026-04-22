import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import BootcampCard from '../../../student/components/BootcampCard';
import type { BootcampLevel } from '../../../student/components/BootcampCard';
import { PHASE_IMGS, type Bootcamp } from './types';
import { resolveImg } from './helpers';

interface BootcampsSectionProps {
  bootcamps: Bootcamp[];
}

const BOOTCAMP_LEVELS: BootcampLevel[] = ['Novice', 'Operator', 'Specialist', 'Elite'];

const normalizeBootcampLevel = (level?: string): BootcampLevel =>
  BOOTCAMP_LEVELS.includes(level as BootcampLevel) ? (level as BootcampLevel) : 'Operator';

const BootcampsSection: React.FC<BootcampsSectionProps> = ({ bootcamps }) => (
  <section className="py-16 md:py-24 bg-bg-card border-y border-border relative overflow-hidden">
    <img
      src="/images/section-backgrounds/offsec-grid-background.png"
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-[0.14] md:opacity-[0.18] pointer-events-none"
    />
    <div className="absolute inset-0 bg-bg/35 pointer-events-none" />
    <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4">
        <ScrollReveal>
          <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// ARSENAL</span>
          <h2 className="text-3xl md:text-4xl text-text-primary font-bold">Bootcamps Built For Operators</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <Link to="/bootcamps" className="flex items-center gap-2 text-accent text-sm font-bold border-b border-accent/30 pb-1 hover:border-accent group w-fit">
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </div>
      {bootcamps.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card-hsociety overflow-hidden animate-pulse">
              <div className="aspect-video bg-accent-dim/30" />
              <div className="p-6 space-y-3">
                <div className="h-3 bg-accent-dim/30 rounded w-1/4" />
                <div className="h-4 bg-accent-dim/30 rounded w-3/4" />
                <div className="h-3 bg-accent-dim/20 rounded w-1/2" />
                <div className="h-10 bg-accent-dim/20 rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {bootcamps.slice(0, 3).map((bc, i) => (
            <ScrollReveal key={bc.id} delay={i * 0.1}>
              <BootcampCard
                image={resolveImg(bc.image, PHASE_IMGS[i % PHASE_IMGS.length])}
                level={normalizeBootcampLevel(bc.level)}
                title={bc.title}
                duration={bc.duration || ''}
                price={bc.priceLabel || 'Free'}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default BootcampsSection;
