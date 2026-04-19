import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield, Terminal, Monitor, Users, ShoppingBag, ArrowRight, Zap, Trophy, Youtube, Linkedin, Twitter, Mail, LayoutDashboard, MessageSquare } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';
import HackerGlobe from '../components/HackerGlobe';
import ScrollReveal from '../../../shared/components/ScrollReveal';
import StatCounter from '../../../shared/components/ui/StatCounter';
import BootcampCard from '../../student/components/BootcampCard';
import RoomCard from '../../student/components/RoomCard';
import { useAuth } from '../../../core/contexts/AuthContext';
import api from '../../../core/services/api';

interface BackendStats {
  stats?: {
    studentsCount?: number;
    learnersTrained?: number;
    bootcampsCount?: number;
    zeroDayProductsCount?: number;
    vulnerabilitiesIdentified?: number;
    pentestersActive?: number;
  };
}

interface Bootcamp {
  id: string;
  title: string;
  level?: string;
  duration?: string;
  priceLabel?: string;
  image?: string;
}

interface Room {
  id: string;
  slug?: string;
  title: string;
  level?: string;
  description?: string;
  coverImage?: string;
  logoUrl?: string;
}

interface LeaderboardEntry {
  id?: string;
  handle?: string;
  name?: string;
  totalXp?: number;
  rank?: string;
  avatarUrl?: string;
}

interface MarketplaceItem {
  id?: string;
  _id?: string;
  title: string;
  cpPrice?: number;
  coverUrl?: string;
}

const PHASE_IMGS = [
  '/images/Curriculum-images/phase1.webp',
  '/images/Curriculum-images/phase2.webp',
  '/images/Curriculum-images/phase3.webp',
  '/images/Curriculum-images/phase4.webp',
  '/images/Curriculum-images/phase5.webp',
];

const resolveImg = (value?: string, fallback = '') => {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (/^https?:\/\//i.test(src)) return src;
  const base = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/api\/?$/, '');
  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
};

const Landing: React.FC = () => {
  const { user } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const [terminalText, setTerminalText] = useState('');
  const fullText = '[ SYSTEM ONLINE ] // OFFENSIVE SECURITY | AFRICA // BOOTCAMPS + SERVICES + COMMUNITY';

  const [stats, setStats] = useState<BackendStats | null>(null);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [marketItems, setMarketItems] = useState<MarketplaceItem[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/public/landing-stats').catch(() => null),
      api.get('/public/bootcamps').catch(() => null),
      api.get('/public/rooms').catch(() => null),
      api.get('/public/leaderboard').catch(() => null),
      api.get('/public/cp-products').catch(() => null),
    ]).then(([statsRes, bootcampsRes, roomsRes, leaderboardRes, marketRes]) => {
      if (!mounted) return;
      if (statsRes?.data) setStats(statsRes.data);
      if (bootcampsRes?.data?.items) setBootcamps(bootcampsRes.data.items);
      if (roomsRes?.data?.items) setRooms(roomsRes.data.items);
      if (leaderboardRes?.data?.leaderboard) setLeaderboard(leaderboardRes.data.leaderboard);
      if (marketRes?.data?.items) setMarketItems(marketRes.data.items);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTerminalText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) setTimeout(() => { i = 0; }, 2000);
    }, 50);
    return () => clearInterval(iv);
  }, []);

  const totalCp = leaderboard.reduce((acc, e) => acc + Number(e.totalXp || 0), 0);

  const heroStats = [
    { label: 'Trained Operators', value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained ?? 0, suffix: '+' },
    { label: 'Bootcamps Live', value: stats?.stats?.bootcampsCount ?? 0, suffix: '' },
    { label: 'Zero-Day Products', value: stats?.stats?.zeroDayProductsCount ?? 0, suffix: '+' },
    { label: 'Validated Findings', value: stats?.stats?.vulnerabilitiesIdentified ?? 0, suffix: '' },
  ];

  return (
    <div className="relative">

      {/* ── 1. HERO ── */}
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden scanlines">
        <div className="absolute inset-0 bg-bg z-0" />
        <div className="absolute inset-0 dot-grid opacity-30 z-0" />
        <HeroCanvas />
        <div className="absolute inset-0 bg-radial-vignette opacity-60 z-10" />
        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-30 min-h-screen max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center pt-24 pb-36">
          <div className="flex flex-col items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="mb-5 px-3 py-1 border border-border bg-accent-dim rounded-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">AFRICA'S OFFENSIVE SECURITY PLATFORM</span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] mb-5">
              <motion.span className="inline-block">
                {'Train Like a Hacker.'.split(' ').map((w, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }} className="inline-block mr-2 md:mr-3">{w}</motion.span>
                ))}
              </motion.span>
              <br />
              <motion.span className="inline-block">
                {'Become a Hacker.'.split(' ').map((w, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }} className="inline-block mr-2 md:mr-3">{w}</motion.span>
                ))}
              </motion.span>
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }}
              className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mb-7">
              An offensive security company operating at the intersection of education and execution, focused on building a strong cybersecurity ecosystem in Africa.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.5 }}
              className="flex flex-row items-center gap-3 mb-8">
              {user ? (
                <Link to="/dashboard" className="btn-primary flex items-center gap-2 !px-6 text-sm"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-sm !px-6">Start Training</Link>
                  <Link to="/login" className="btn-secondary text-sm !px-6">Log In</Link>
                </>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.8 }}
              className="font-mono text-[9px] md:text-[10px] text-accent tracking-tighter w-full max-w-lg overflow-hidden whitespace-nowrap">
              {terminalText}<span className="animate-blink italic">_</span>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:flex relative h-[500px] items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
            <div className="w-full h-full"><HackerGlobe /></div>
            <div className="absolute top-8 right-6 px-2 py-1 bg-bg/70 border border-accent/20 rounded text-[8px] font-mono text-accent uppercase tracking-widest">SAT-02 // ORBIT</div>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-full border-t border-border bg-bg/60 backdrop-blur-sm z-30 py-4 md:py-5">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {heroStats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-accent font-mono"><StatCounter end={s.value} suffix={s.suffix} /></div>
                <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. HOW IT WORKS ── */}
      <section className="py-16 md:py-24 bg-bg relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-10 md:mb-20">
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE PROCESS</span>
            <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">How The Loop Works</h2>
            <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">Create your operator account, complete phased bootcamp modules, validate skills in challenges, earn CP, and unlock the Zero-Day Market.</p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10 md:mb-20">
            {[{ title: 'JOIN', desc: 'Create your operator account.' }, { title: 'TRAIN', desc: 'Complete phased bootcamp modules.' }, { title: 'VALIDATE', desc: 'Prove skills in live challenges.' }, { title: 'EARN', desc: 'Collect CP for your progress.' }, { title: 'UNLOCK', desc: 'Access the Zero-Day Market.' }].map((step, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1} className="relative group text-left">
                <div className="text-4xl md:text-5xl font-extrabold text-accent/20 font-mono mb-3 group-hover:text-accent transition-colors">0{idx + 1}</div>
                <h3 className="text-base md:text-xl font-bold text-text-primary mb-2 uppercase tracking-tighter">{step.title}</h3>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed">{step.desc}</p>
                {idx < 4 && <div className="hidden md:block absolute top-10 -right-4 text-accent/30 text-xl font-bold">{'→'}</div>}
              </ScrollReveal>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {[
              { label: 'Active Operators', value: stats?.stats?.pentestersActive ?? 0, icon: Users, img: '/images/how-it-works-section/Pentesters-Active.webp', suffix: '+' },
              { label: 'Bootcamps Live', value: stats?.stats?.bootcampsCount ?? 0, icon: Monitor, img: '/images/how-it-works-section/Learners-Trained.webp', suffix: '' },
              { label: 'Validated Findings', value: stats?.stats?.vulnerabilitiesIdentified ?? 0, icon: Shield, img: '/images/how-it-works-section/Engagements-4Completed.webp', suffix: '' },
              { label: 'Trained Operators', value: stats?.stats?.studentsCount ?? stats?.stats?.learnersTrained ?? 0, icon: Zap, img: '/images/how-it-works-section/Findings-Identified.webp', suffix: '+' },
              { label: 'CP Distributed', value: Math.round(totalCp / 1000), icon: ShoppingBag, img: '/images/cp-card-background/zeroday-maket-background.webp', suffix: 'K+' },
            ].map((card, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05} className="relative h-40 md:h-48 rounded-lg overflow-hidden group">
                <img src={card.img} alt="" className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="text-xl md:text-2xl font-bold text-accent font-mono"><StatCounter end={card.value} suffix={card.suffix} /></div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-text-muted uppercase tracking-widest mt-0.5"><card.icon className="w-3 h-3" /> {card.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. BOOTCAMPS — real data ── */}
      <section className="py-16 md:py-24 bg-bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
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
                    level={bc.level || 'Operator'}
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

      {/* ── 4. ROOMS — real data ── */}
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

      {/* ── 5. MARKETPLACE — real data ── */}
      <section className="py-16 md:py-24 bg-bg relative isolate">
        <div className="absolute inset-0 scanlines opacity-[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="lg:col-span-5">
              <ScrollReveal>
                <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE ECONOMY</span>
                <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-5">Zero-Day Market</h2>
                <p className="text-text-secondary text-sm md:text-base mb-6 leading-relaxed">Earn Cyber Points (CP) by completing challenges and bootcamps. Spend your haul on high-end operator tools, bypass scripts, and limited edition credentials.</p>
                <ul className="flex flex-col space-y-3 mb-8">
                  {['Curated Exploit Payloads', 'Hardened Field Playbooks', 'Exclusive HSOCIETY Merch', 'Private Lab Environments'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-primary font-medium text-sm"><div className="w-2 h-2 rounded-full bg-accent flex-none" /> {item}</li>
                  ))}
                </ul>
                <div className="p-5 bg-accent-dim border border-accent/20 rounded-lg relative overflow-hidden group">
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
            <div className="lg:col-span-7 grid grid-cols-2 gap-3 md:gap-4">
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
                        <span className="text-xs font-mono text-accent py-0.5 px-2 bg-accent-dim border border-accent/20 rounded w-fit">{prod.cpPrice ?? 0} CP</span>
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

      {/* ── 6. LEADERBOARD — real data ── */}
      <section className="py-16 md:py-24 bg-bg-card border-y border-border relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 md:mb-16 gap-4">
            <ScrollReveal>
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// THE BOARD</span>
              <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">Top Operators</h2>
              <Link to="/leaderboard" className="text-xs font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-2">Hall of Shadows <ArrowRight className="w-4 h-4" /></Link>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="text-left md:text-right">
                <div className="text-3xl md:text-4xl font-bold text-accent font-mono"><StatCounter end={totalCp} suffix="" /></div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted">Total Community CP Earned</div>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.3} className="overflow-x-auto border border-border rounded-lg bg-bg">
            <div className="min-w-[520px]">
              <div className="grid grid-cols-5 p-3 md:p-4 border-b border-border bg-accent-dim/5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                <div>Rank</div><div className="col-span-2">Operator</div><div>Role</div><div className="text-right">CP</div>
              </div>
              {(leaderboard.length > 0 ? leaderboard : []).slice(0, 5).map((u, idx) => {
                const podium = ['#FFD700', '#C0C0C0', '#CD7F32'];
                const color = idx < 3 ? podium[idx] : undefined;
                const handle = u.handle || u.name || 'Anonymous';
                return (
                  <div key={u.id || idx} className="grid grid-cols-5 p-3 md:p-4 border-b border-border/50 items-center hover:bg-accent-dim/5 transition-colors">
                    <div><span className="text-base md:text-xl font-bold font-mono" style={{ color: color || 'var(--text-muted)' }}>#{idx + 1}</span></div>
                    <div className="col-span-2 flex items-center gap-2 md:gap-3">
                      {u.avatarUrl
                        ? <img src={resolveImg(u.avatarUrl)} alt="" className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-border flex-none" />
                        : <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-border bg-accent-dim flex items-center justify-center flex-none text-accent text-xs font-bold">{handle[0]?.toUpperCase()}</div>
                      }
                      <span className="font-mono text-text-primary text-xs md:text-sm font-medium truncate">{handle}</span>
                    </div>
                    <div className="font-mono text-text-secondary text-xs md:text-sm">{u.rank || 'Operator'}</div>
                    <div className="text-right font-mono font-bold text-accent text-xs md:text-sm">{Number(u.totalXp || 0).toLocaleString()}</div>
                  </div>
                );
              })}
              {leaderboard.length === 0 && (
                <div className="p-6 text-center text-text-muted text-sm">No operators on the board yet.</div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 7. SERVICES ── */}
      <section className="py-16 md:py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-10 md:mb-16">
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// OPERATIONS</span>
            <h2 className="text-3xl md:text-4xl text-text-primary font-bold mb-3">Security Services</h2>
            <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto">Beyond training, we deliver professional offensive security services to organisations across Africa and beyond.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            {[
              { title: 'Penetration Testing', category: 'FOR ORGANISATIONS', icon: Shield, img: '/images/how-it-works-section/Engagements-4Completed.webp', bullet: ['Network and infrastructure penetration testing', 'Internal and external attack simulation', 'Detailed findings report with remediation guidance'] },
              { title: 'Web Application Security Audit', category: 'FOR ORGANISATIONS', icon: Users, img: '/images/how-it-works-section/Findings-Identified.webp', bullet: ['OWASP Top 10 full coverage', 'API and authentication testing', 'Business logic vulnerability analysis'] },
              { title: 'Vulnerability Assessment', category: 'FOR ORGANISATIONS', icon: Zap, img: '/images/how-it-works-section/Pentesters-Active.webp', bullet: ['Automated and manual scanning', 'Risk-rated vulnerability inventory', 'Prioritised remediation roadmap'] },
            ].map((serv, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="card-hsociety overflow-hidden flex flex-col h-full group">
                  <div className="h-40 md:h-48 overflow-hidden"><img src={serv.img} alt="" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" /></div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <span className="text-[10px] font-bold text-accent border border-accent/30 rounded px-2 py-0.5 w-fit mb-3">{serv.category}</span>
                    <h3 className="text-lg md:text-xl font-bold text-text-primary mb-3">{serv.title}</h3>
                    <ul className="flex flex-col space-y-2 mb-6">
                      {serv.bullet.map((b, i) => (<li key={i} className="text-sm text-text-secondary flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent/40 rounded-full flex-none" /> {b}</li>))}
                    </ul>
                    <Link to="/contact" className="mt-auto btn-secondary !py-2.5 !px-5 text-xs text-center block">Get a Quote</Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="card-hsociety p-6 md:p-12 text-center bg-accent-dim/10">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">Not sure which service fits?</h3>
            <p className="text-text-muted text-sm mb-6 max-w-lg mx-auto">Our strategic advisory team can map our capabilities to your threat model.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5" target="_blank" rel="noreferrer" className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-sm"><MessageSquare className="w-4 h-4" /> Message on WhatsApp</a>
              <a href="mailto:info@hsociety.io" className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2 text-sm"><Mail className="w-4 h-4" /> Email Security Desk</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 8. SOCIAL ── */}
      <section className="py-16 md:py-24 bg-bg border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal className="text-center mb-10 md:mb-14">
            <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em] mb-3 block">// SIGNAL</span>
            <h2 className="text-3xl md:text-4xl text-text-primary font-bold">Find Us Online</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8">
            {[
              { label: 'Follow on X', handle: '@hsocietyoffsec', desc: 'Ops updates, alerts, and announcements.', icon: Twitter, action: 'Follow', href: 'https://x.com/hsocietyoffsec' },
              { label: 'Connect on LinkedIn', handle: 'HSOCIETY OFFSEC', desc: 'Company updates and operator wins.', icon: Linkedin, action: 'Connect', href: 'https://www.linkedin.com/company/hsociety-offsec/' },
              { label: 'Watch on YouTube', handle: 'HSOCIETY OFFSEC', desc: 'Tutorials, walkthroughs, and operator content.', icon: Youtube, action: 'Subscribe', href: 'https://youtube.com/@hsocietyoffsec' },
            ].map((social, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="card-hsociety p-6 md:p-8 flex flex-col h-full group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-bg border border-border flex items-center justify-center mb-4 md:mb-6 group-hover:border-accent group-hover:text-accent transition-all">
                    <social.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">{social.label}</span>
                  <h4 className="text-base md:text-lg font-bold text-text-primary mb-2 font-mono">{social.handle}</h4>
                  <p className="text-xs md:text-sm text-text-muted mb-6">{social.desc}</p>
                  <a href={social.href} target="_blank" rel="noreferrer" className="mt-auto flex items-center gap-2 text-accent text-sm font-bold border-b border-accent/20 pb-1 w-fit hover:border-accent transition-all group/btn">
                    {social.action} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ── */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-bg scanlines">
        <div className="absolute inset-0 z-0">
          <img src="/images/cta-setion-background/cta-background.webp" alt="" className="w-full h-full object-cover grayscale opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <ScrollReveal>
            <motion.div animate={{ opacity: [0.5, 1, 0.5], filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'] }} transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-5 px-4 py-1.5 border border-accent bg-accent-dim text-accent rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(136,173,124,0.3)]">
              ENROLLMENT OPEN
            </motion.div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
              Ready to <span className="text-accent underline decoration-accent/30 underline-offset-8">Operate?</span>
            </h2>
            <p className="text-text-secondary text-sm md:text-lg mb-10 max-w-2xl mx-auto">Join operators training in offensive security. No experience required, just commitment.</p>
            <div className="flex items-center justify-center">
              {user ? (
                <Link to="/dashboard" className="btn-primary !px-10 !py-4 text-sm flex items-center gap-3"><LayoutDashboard className="w-5 h-5" /> Go to Dashboard</Link>
              ) : (
                <Link to="/register" className="btn-primary !px-10 !py-4 text-sm">Start Training →</Link>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
};

export default Landing;
