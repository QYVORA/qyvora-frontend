import React from 'react';
import ScrollReveal from '../../../../shared/components/ScrollReveal';
import RoomCard from '../../../student/components/RoomCard';
import type { Room } from './types';
import { resolveImg } from './helpers';

interface RoomsSectionProps {
  rooms: Room[];
}

const RoomsSection: React.FC<RoomsSectionProps> = ({ rooms }) => (
  <section className="py-16 md:py-24 bg-bg">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <ScrollReveal className="text-center mb-10 md:mb-16">
        <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// TRAINING GROUNDS</span>
        <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">Self-Paced Rooms</h2>
        <p className="text-text-muted text-sm md:text-base">Real environments. Real techniques. No hand-holding.</p>
      </ScrollReveal>
      {rooms.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card-hsociety overflow-hidden animate-pulse">
              <div className="aspect-video bg-accent-dim/30" />
              <div className="p-6 space-y-3">
                <div className="h-3 bg-accent-dim/30 rounded w-1/3" />
                <div className="h-4 bg-accent-dim/30 rounded w-2/3" />
                <div className="h-3 bg-accent-dim/20 rounded w-full" />
                <div className="h-10 bg-accent-dim/20 rounded w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {rooms.slice(0, 4).map((room, i) => (
            <ScrollReveal key={room.id} delay={i * 0.1}>
              <RoomCard
                image={resolveImg(room.coverImage, `/gallery/gallery-0${(i % 6) + 1}.jpeg`)}
                logo={resolveImg(room.logoUrl, '/HSOCIETY-H-LOGO.png')}
                title={room.title}
                level={room.level || 'Beginner'}
                description={room.description || 'Hands-on offensive security lab.'}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default RoomsSection;

