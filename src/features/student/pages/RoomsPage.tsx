import React, { useEffect, useState } from 'react';
import { Monitor, Clock } from 'lucide-react';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import api from '../../../core/services/api';

const resolveImg = (value?: string, fallback = '') => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  const apiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();

  if (src.startsWith('/uploads/')) {
    if (/^https?:\/\//i.test(apiBase)) {
      const origin = apiBase.replace(/\/api\/?$/, '');
      return `${origin}${src}`;
    }
    if (apiBase.startsWith('/api')) {
      return `/api${src}`;
    }
  }

  const base = apiBase.replace(/\/api\/?$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/student/rooms')
      .then((res) => { if (mounted) setRooms(Array.isArray(res.data?.items) ? res.data.items : []); })
      .catch(() => { if (mounted) setRooms([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-bg pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <ScrollReveal className="mb-10">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 block">// TRAINING GROUNDS</span>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3">Self-Paced Rooms</h1>
          <p className="text-text-secondary max-w-2xl">Real environments. Real techniques. No hand-holding.</p>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0,1,2,3,4,5].map((i) => (
              <div key={i} className="card-hsociety overflow-hidden animate-pulse">
                <div className="aspect-video bg-accent-dim/30" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-accent-dim/30 rounded w-1/3" />
                  <div className="h-4 bg-accent-dim/30 rounded w-2/3" />
                  <div className="h-9 bg-accent-dim/20 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-20 text-center">
            <Monitor className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
            <p className="text-text-muted text-sm">No rooms available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, i) => (
              <ScrollReveal key={room.id || i} delay={i * 0.06}>
                <div className="card-hsociety overflow-hidden flex flex-col group hover:border-accent/40 transition-all">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={resolveImg(room.coverImage, `/gallery/gallery-0${(i % 6) + 1}.jpeg`)}
                      alt={room.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    {room.logoUrl && (
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-bg border border-border p-1 flex items-center justify-center overflow-hidden">
                        <img src={resolveImg(room.logoUrl)} alt="" className="w-full h-full object-contain" />
                      </div>
                    )}
                    {room.completed && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-accent text-bg text-[9px] font-black uppercase rounded tracking-widest">
                        ✓ Done
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {room.level && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-accent-dim text-accent border border-accent/20">
                          {room.level}
                        </span>
                      )}
                      {room.estimatedMinutes > 0 && (
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {room.estimatedMinutes}m
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors mb-1">{room.title}</h3>
                    {room.description && (
                      <p className="text-[11px] text-text-muted line-clamp-2 mb-3">{room.description}</p>
                    )}
                    <div className={`mt-auto w-full py-2 rounded font-bold text-[10px] uppercase text-center transition-colors ${
                      room.completed
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'bg-accent-dim text-accent border border-accent/20 group-hover:bg-accent/20'
                    }`}>
                      {room.completed ? '✓ Completed' : 'Enter Room'}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
