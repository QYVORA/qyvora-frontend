import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import BootcampCard from '../../../student/components/BootcampCard';
import type { BootcampLevel } from '../../../student/components/BootcampCard';
import { PHASE_IMGS, type Bootcamp } from './types';
import { resolveImg } from './helpers';

interface BootcampsSectionProps {
  bootcamps: Bootcamp[];
  loading?: boolean;
}

const BOOTCAMP_LEVELS: BootcampLevel[] = ['Novice', 'Operator', 'Specialist', 'Elite'];

const normalizeBootcampLevel = (level?: string): BootcampLevel =>
  BOOTCAMP_LEVELS.includes(level as BootcampLevel) ? (level as BootcampLevel) : 'Operator';

const HPB_ID = 'bc_1775270338500';
const HPB_TITLE = 'Hacker Protocol Bootcamp';
const HPB_DESCRIPTION =
  'Hacker Protocol Bootcamp (HPB) teaches beginners to think like hackers — covering networking, Linux, web, and social engineering with hands-on labs and CTFs.';
const HPB_IMAGE = '/assets/bootcamp/hpb-cover.png';

const BootcampsSection: React.FC<BootcampsSectionProps> = ({ bootcamps, loading = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const displayed = bootcamps.slice(0, 3);

  return (
    <section className="py-20 md:py-32 bg-bg-card border-y border-border relative overflow-hidden has-bg-image">
      <img
        src="/assets/sections/backgrounds/employee-training-bg.png"
        alt=""
        className="section-bg-img absolute inset-0 w-full h-full object-cover opacity-[0.14] md:opacity-[0.18] pointer-events-none"
      />
      <div className="section-bg-overlay light-theme-hide-bg-overlay absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4">
          <ScrollReveal>
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// ARSENAL</span>
            <h2 className="text-3xl md:text-4xl text-text-primary font-bold">Bootcamps Built For Operators</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15} className="flex items-center gap-6">
            {/* Bootcamp operator illustration */}
            <img
              src="/assets/illustrations/bootcamp-operator.png"
              alt=""
              aria-hidden="true"
              className="hidden md:block w-20 h-20 object-contain opacity-80 drop-shadow-[0_0_20px_var(--color-accent-glow)] flex-none"
            />
            <Link
              to="/register"
              className="flex items-center gap-2 text-accent text-sm font-bold border-b border-accent/30 pb-1 hover:border-accent group w-fit transition-colors"
            >
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Skeleton */}
        {loading || bootcamps.length === 0 ? (
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
          <div className={`grid gap-6 md:gap-8 grid-cols-1 ${
            displayed.length === 1 ? 'sm:grid-cols-1 max-w-md' :
            displayed.length === 2 ? 'sm:grid-cols-2 max-w-2xl' :
            'sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {displayed.map((bc, i) => {
              const isHPB = bc.id === HPB_ID;
              const title = isHPB ? HPB_TITLE : bc.title;
              const description = isHPB ? HPB_DESCRIPTION : (bc.description || '');
              const image = resolveImg(isHPB ? HPB_IMAGE : bc.image, PHASE_IMGS[i % PHASE_IMGS.length]);
              return (
                <motion.div
                  key={bc.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                >
                  <BootcampCard
                    image={image}
                    level={normalizeBootcampLevel(bc.level)}
                    title={title}
                    description={description}
                    duration={bc.duration || ''}
                    price={bc.priceLabel || 'Free'}
                    href="/register"
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BootcampsSection;
