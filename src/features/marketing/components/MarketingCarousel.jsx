import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Target, ShoppingBag, Users, Zap } from 'lucide-react'

const SLIDES = [
  {
    id: 'bootcamps',
    kicker: '// structured learning',
    title: 'Operator Bootcamps',
    desc: 'Phase-based offensive security tracks built for real-world mastery. From recon to zero-day.',
    cta: 'View Bootcamps',
    href: '/#bootcamps',
    section: 'bootcamps',
    icon: BookOpen,
    img: '/images/Curriculum-images/phase1.webp',
    accent: '#88AD7C',
  },
  {
    id: 'rooms',
    kicker: '// self-paced labs',
    title: 'Hands-On Rooms',
    desc: 'Standalone labs you can complete at your own pace. No prerequisites. Just connect and hack.',
    cta: 'Explore Rooms',
    href: '/#rooms',
    section: 'rooms',
    icon: Target,
    img: '/images/how-it-works-section/Pentesters-Active.webp',
    accent: '#88AD7C',
  },
  {
    id: 'marketplace',
    kicker: '// zero-day market',
    title: 'CP Marketplace',
    desc: 'Earn CP by training. Spend it on real offensive security tools, playbooks, and exploit research.',
    cta: 'Open Market',
    href: '/#marketplace',
    section: 'marketplace',
    icon: ShoppingBag,
    img: '/images/cp-card-background/zeroday-maket-background.webp',
    accent: '#88AD7C',
  },
  {
    id: 'community',
    kicker: '// operator network',
    title: 'Join the Community',
    desc: 'Train alongside hundreds of operators. Share findings, compete on the leaderboard, level up together.',
    cta: 'Start Training',
    href: '/register',
    icon: Users,
    img: '/images/how-it-works-section/Learners-Trained.webp',
    accent: '#88AD7C',
  },
  {
    id: 'services',
    kicker: '// for organisations',
    title: 'Offensive Security Services',
    desc: 'Penetration testing, web app audits, and corporate security training. Scoped and priced individually.',
    cta: 'View Services',
    href: '/services',
    icon: Zap,
    img: '/images/how-it-works-section/Engagements-4Completed.webp',
    accent: '#88AD7C',
  },
]

const INTERVAL = 4500

export function MarketingCarousel() {
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState(null)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef(null)

  const goTo = (idx) => {
    if (animating || idx === active) return
    setPrev(active)
    setActive(idx)
    setAnimating(true)
    setTimeout(() => { setPrev(null); setAnimating(false) }, 600)
  }

  const next = () => goTo((active + 1) % SLIDES.length)

  useEffect(() => {
    timerRef.current = setInterval(next, INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [active, animating])

  const slide = SLIDES[active]

  return (
    <section className="relative border-t border-[var(--border)] overflow-hidden bg-[var(--bg-primary)]">
      {/* Main slide area */}
      <div className="relative h-[420px] sm:h-[480px] overflow-hidden">

        {/* Background images — crossfade */}
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 1 : 0 }}
          >
            <img
              src={s.img}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.25) saturate(1.1)' }}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            zIndex: 2,
          }}
        />

        {/* Accent glow */}
        <div
          className="absolute bottom-0 left-0 w-96 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(136,173,124,0.12), transparent 70%)', zIndex: 2 }}
        />

        {/* Slide content */}
        <div className="absolute inset-0 flex items-end z-10">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
            <div
              key={active}
              className="flex flex-col gap-4 max-w-2xl"
              style={{ animation: 'carousel-in 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-accent/40 bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <slide.icon size={15} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">{slide.kicker}</span>
              </div>

              <h2 className="font-mono font-black text-3xl sm:text-5xl text-white leading-tight">
                {slide.title}
              </h2>

              <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-lg">
                {slide.desc}
              </p>

              <div className="pt-2">
                {slide.section ? (
                  <a
                    href={slide.href}
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById(slide.section)
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                    className="btn-primary inline-flex items-center gap-2 text-sm group"
                  >
                    {slide.cta}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <Link to={slide.href} className="btn-primary inline-flex items-center gap-2 text-sm group">
                    {slide.cta}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--border)] z-10">
          <div
            key={active}
            className="h-full bg-accent"
            style={{ animation: `progress-fill ${INTERVAL}ms linear both` }}
          />
        </div>
      </div>

      {/* Slide tabs */}
      <div className="border-t border-[var(--border)] grid grid-cols-5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            className={`flex flex-col items-start gap-1 px-3 sm:px-5 py-3 sm:py-4 border-r border-[var(--border)] last:border-r-0 transition-colors duration-200 text-left ${
              i === active
                ? 'bg-accent/8 border-b-2 border-b-accent'
                : 'hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <s.icon size={13} className={i === active ? 'text-accent' : 'text-[var(--text-muted)]'} />
            <span className={`font-mono text-[10px] sm:text-xs uppercase tracking-widest leading-tight hidden sm:block ${i === active ? 'text-accent' : 'text-[var(--text-muted)]'}`}>
              {s.title.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes carousel-in {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes progress-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  )
}
