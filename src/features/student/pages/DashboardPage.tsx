import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Shield, Terminal, ArrowRight, Wallet, ShoppingBag, BookOpen, Monitor } from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
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

const SkeletonRow = () => (
  <div className="p-4 bg-bg-card border border-border rounded-lg flex items-center gap-4 animate-pulse">
    <div className="w-16 h-12 rounded bg-accent-dim/30 flex-none" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-accent-dim/30 rounded w-3/4" />
      <div className="h-2 bg-accent-dim/20 rounded w-1/2" />
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="card-hsociety p-4 animate-pulse">
    <div className="w-full h-32 rounded bg-accent-dim/30 mb-4" />
    <div className="h-3 bg-accent-dim/30 rounded w-3/4 mb-2" />
    <div className="h-8 bg-accent-dim/20 rounded w-full mt-4" />
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [bootcamps, setBootcamps] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [overviewRes, bootcampsRes, roomsRes] = await Promise.all([
          api.get('/student/overview'),
          api.get('/public/bootcamps'),
          api.get('/student/rooms'),
        ]);
        if (!mounted) return;
        setOverview(overviewRes.data || null);
        setBootcamps(Array.isArray(bootcampsRes.data?.items) ? bootcampsRes.data.items : []);
        setRooms(Array.isArray(roomsRes.data?.items) ? roomsRes.data.items : []);
      } catch {
        // silently fall through — state stays at defaults
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const enrolledBootcamps = useMemo(() => {
    const moduleProgress = Array.isArray(overview?.modules) ? overview.modules : [];
    return bootcamps.slice(0, 2).map((item: any, index: number) => {
      const related = moduleProgress[index];
      return {
        id: item.id || String(index),
        title: item.title || 'Bootcamp Module',
        module: related?.title ? `Current: ${related.title}` : 'Not started',
        progress: `${Number(related?.progress || 0)}%`,
        img: resolveImg(item.image, '/images/Curriculum-images/phase1.webp'),
      };
    });
  }, [overview, bootcamps]);

  const recentRooms = useMemo(() => {
    return rooms.slice(0, 2).map((room: any) => ({
      id: room.id || room._id || '',
      slug: room.slug || '',
      title: room.title || 'Room',
      level: String(room.level || 'Medium'),
      completed: Boolean(room.completed),
      img: resolveImg(room.coverImage, '/gallery/gallery-05.jpeg'),
    }));
  }, [rooms]);

  const progressValue = overview?.snapshot?.find((item: any) => item?.id === 'progress')?.value || '0%';

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-8">

      {/* MISSION HEADER CARD */}
      <section className="mb-5 md:mb-8">
        <div className="relative p-5 md:p-10 bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-[0.05] pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-5 md:mb-8">
              <div>
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-accent font-mono flex items-center gap-3">
                  WELCOME BACK, {user?.username || '—'} <span className="w-2 h-6 md:h-8 bg-accent animate-pulse" />
                </h1>
              </div>
              <div className="flex gap-2 md:gap-3">
                <div className="px-3 py-1.5 bg-accent text-bg rounded font-bold text-xs">
                  🔥 {Number(overview?.xpSummary?.streakDays || 0)}-DAY STREAK
                </div>
                <div className="px-3 py-1.5 bg-bg border border-border rounded font-mono font-bold text-xs text-accent text-center min-w-[72px]">
                  {user?.cp?.toLocaleString() ?? 0} CP
                </div>
              </div>
            </div>
            <div className="max-w-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-text-primary uppercase tracking-tight">
                  Active: {overview?.progressMeta?.currentPhase?.title || 'No active bootcamp'}
                </span>
                <span className="text-xs text-text-muted hidden sm:block">
                  {overview?.progressMeta?.currentPhase?.roleTitle || ''}
                </span>
              </div>
              <div className="h-2 w-full bg-accent-dim rounded-full mb-4 md:mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: progressValue }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(136,173,124,0.5)]"
                />
              </div>
              <Link to="/bootcamps" className="btn-primary w-full md:w-auto inline-flex items-center justify-between gap-8">
                <span>CONTINUE LEARNING</span>
                <span className="text-[10px] opacity-70">{progressValue} COMPLETE</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STAT PILLS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-8">
        {[
          { label: 'Rank', value: user?.rank || '—', icon: Shield },
          { label: 'CP Balance', value: user?.cp?.toLocaleString() ?? '0', icon: Wallet },
          { label: 'Progress', value: progressValue, icon: Zap },
          { label: 'Status', value: overview?.bootcampStatus || 'not_enrolled', icon: Terminal },
        ].map((stat, idx) => (
          <div key={idx} className="p-3 md:p-4 bg-bg border border-border rounded-lg flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-md bg-accent-dim flex items-center justify-center text-accent flex-none">
              <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</span>
              <span className="text-sm md:text-lg font-bold text-text-primary truncate">{stat.value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-8">

        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-5 md:space-y-8">

          {/* Bootcamps */}
          <div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-text-primary flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent" /> ENROLLED BOOTCAMPS
              </h2>
              <Link to="/bootcamps" className="text-xs font-bold text-accent hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <><SkeletonRow /><SkeletonRow /></>
              ) : enrolledBootcamps.length === 0 ? (
                <div className="p-5 md:p-6 bg-bg-card border border-border rounded-lg text-center">
                  <p className="text-sm text-text-muted mb-3">No bootcamps enrolled yet.</p>
                  <Link to="/bootcamps" className="btn-primary text-xs !py-2 !px-4">Browse Bootcamps</Link>
                </div>
              ) : (
                enrolledBootcamps.map((item) => (
                  <Link to="/bootcamps" key={item.id} className="group p-3 md:p-4 bg-bg-card border border-border rounded-lg flex items-center justify-between transition-colors hover:bg-accent-dim/10 active:bg-accent-dim/20 block">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <img src={item.img} alt="" className="w-14 h-10 md:w-16 md:h-12 object-cover rounded border border-border flex-none" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate">{item.title}</h4>
                        <p className="text-xs text-text-muted truncate">{item.module}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 flex-none ml-2">
                      <div className="hidden sm:block">
                        <div className="text-[10px] font-bold text-text-muted uppercase text-right mb-1">PROG</div>
                        <div className="w-16 md:w-20 h-1 bg-bg rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: item.progress }} />
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Rooms */}
          <div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-bold text-text-primary flex items-center gap-2">
                <Monitor className="w-4 h-4 text-accent" /> RECENT ROOMS
              </h2>
              <Link to="/rooms" className="text-xs font-bold text-accent hover:underline">All Rooms →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {loading ? (
                <><SkeletonCard /><SkeletonCard /></>
              ) : recentRooms.length === 0 ? (
                <div className="sm:col-span-2 p-5 md:p-6 bg-bg-card border border-border rounded-lg text-center">
                  <p className="text-sm text-text-muted mb-3">No rooms available yet.</p>
                  <Link to="/rooms" className="btn-primary text-xs !py-2 !px-4">Browse Rooms</Link>
                </div>
              ) : (
                recentRooms.map((room) => (
                  <Link to="/rooms" key={room.id} className="card-hsociety p-4 block group">
                    <img src={room.img} alt="" className="w-full h-28 md:h-32 object-cover rounded mb-3 md:mb-4 grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{room.title}</h4>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-bg text-text-muted border border-border flex-none ml-2">{room.level}</span>
                    </div>
                    <div className={`w-full py-2 rounded font-bold text-[10px] uppercase text-center transition-colors ${
                      room.completed
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'bg-accent-dim text-accent border border-accent/20 hover:bg-accent/20'
                    }`}>
                      {room.completed ? '✓ Completed' : 'Enter Room'}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5 md:space-y-8">
          <div className="p-1 bg-bg border border-border rounded-lg space-y-1 overflow-hidden">
            {[
              { label: 'Wallet', sub: 'Manage your haul', icon: Wallet, path: '/wallet' },
              { label: 'Marketplace', sub: 'Burn points', icon: ShoppingBag, path: '/marketplace' },
              { label: 'Notifications', sub: 'Comms & alerts', icon: BookOpen, path: '/notifications' },
              { label: 'Settings', sub: 'Security & account', icon: Terminal, path: '/settings' },
            ].map((link, i) => (
              <Link to={link.path} key={i} className="w-full p-3 md:p-4 flex items-center justify-between group hover:bg-bg-card rounded transition-colors active:bg-bg-card">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded bg-accent-dim/50 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <link.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary">{link.label}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-tighter">{link.sub}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>

          <div className="card-hsociety p-5 md:p-6 border-accent/20">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" /> RANK PROGRESS
            </h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-accent">{user?.rank?.toUpperCase() || 'CANDIDATE'}</span>
              <span className="text-xs font-mono text-text-muted">NEXT</span>
            </div>
            <div className="h-1.5 w-full bg-accent-dim rounded-full mb-4">
              <div className="h-full bg-accent rounded-full" style={{ width: progressValue }} />
            </div>
            <p className="text-[10px] text-text-muted text-center italic">
              Complete modules and rooms to advance your rank.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
