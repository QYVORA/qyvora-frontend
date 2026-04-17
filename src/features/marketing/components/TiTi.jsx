import { useEffect, useRef, useState, useCallback } from 'react'

const MESSAGES = [
  { text: "psst... you scrolled past the good stuff 👀", delay: 0 },
  { text: "i see you hovering... suspicious 🤨", delay: 0 },
  { text: "did you know SQL injection is still #3? wild.", delay: 0 },
  { text: "train harder. the attacker already is.", delay: 0 },
  { text: "i'm watching your cursor rn 👁️", delay: 0 },
  { text: "bro just register already 💀", delay: 0 },
  { text: "OWASP A01 is literally just... check your URLs lol", delay: 0 },
  { text: "i'm not a bot. i'm TiTi. there's a difference.", delay: 0 },
  { text: "you've been on this page for a while... 👀", delay: 0 },
  { text: "CP doesn't stand for what you think it does here 😭", delay: 0 },
  { text: "zero-day market is open btw. just saying.", delay: 0 },
  { text: "i'm flying. you're scrolling. we're both busy.", delay: 0 },
  { text: "don't mind me, just patrolling the landing page 🛸", delay: 0 },
  { text: "your cursor moved. i noticed. 👁️👁️", delay: 0 },
  { text: "phase 01 starts with recon. so does TiTi.", delay: 0 },
]

const EMOTIONS = ['idle', 'suspicious', 'excited', 'thinking', 'watching', 'spooked']

// TiTi — simple ghost avatar (Kiro-style)
function TiTiFace({ emotion, lookX, lookY, size = 52 }) {
  const ex = Math.max(-2, Math.min(2, lookX * 3))
  const ey = Math.max(-1.5, Math.min(1.5, lookY * 2.5))
  const acc = '#88AD7C'

  // Eye shape by emotion
  const eyeRy = { idle: 3.5, suspicious: 1.5, excited: 4, thinking: 3, watching: 4, spooked: 4.5 }[emotion] ?? 3.5
  const mouthD = {
    idle:       `M 17 33 Q 22 37 27 33`,
    suspicious: `M 17 34 Q 22 32 27 34`,
    excited:    `M 15 32 Q 22 39 29 32`,
    thinking:   `M 18 33 L 26 33`,
    watching:   `M 17 33 Q 22 36 27 33`,
    spooked:    `M 19 31 Q 22 37 25 31`,
  }[emotion] ?? `M 17 33 Q 22 37 27 33`

  return (
    <svg width={size} height={size} viewBox="0 0 44 52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="titi-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ghost body — rounded top, wavy bottom */}
      <path
        d="M 4 20 C 4 8 40 8 40 20 L 40 40 Q 35 44 30 40 Q 27 36 22 40 Q 17 44 12 40 Q 8 36 4 40 Z"
        fill="#0f150f"
        stroke={acc}
        strokeWidth="1.2"
        opacity="0.95"
      />

      {/* Inner glow fill */}
      <path
        d="M 7 20 C 7 11 37 11 37 20 L 37 39 Q 33 42 29 39 Q 26 36 22 39 Q 18 42 15 39 Q 11 36 7 39 Z"
        fill="rgba(136,173,124,0.06)"
      />

      {/* Left eye */}
      <ellipse cx={14 + ex} cy={22 + ey} rx="4" ry={eyeRy}
        fill={acc} opacity="0.9" filter="url(#titi-glow)" />
      <ellipse cx={14.8 + ex} cy={21.2 + ey} rx="1.2" ry="1.2"
        fill="white" opacity="0.7" />

      {/* Right eye */}
      <ellipse cx={30 + ex} cy={22 + ey} rx="4" ry={eyeRy}
        fill={acc} opacity="0.9" filter="url(#titi-glow)" />
      <ellipse cx={30.8 + ex} cy={21.2 + ey} rx="1.2" ry="1.2"
        fill="white" opacity="0.7" />

      {/* Squint lines for suspicious */}
      {emotion === 'suspicious' && (
        <>
          <line x1="10" y1="18" x2="18" y2="19.5" stroke={acc} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
          <line x1="26" y1="19.5" x2="34" y2="18" stroke={acc} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        </>
      )}

      {/* Mouth */}
      <path d={mouthD} stroke={acc} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.85" />

      {/* Cheek blush — excited only */}
      {emotion === 'excited' && (
        <>
          <ellipse cx="9" cy="27" rx="3.5" ry="2" fill="#f472b6" opacity="0.25" />
          <ellipse cx="35" cy="27" rx="3.5" ry="2" fill="#f472b6" opacity="0.25" />
        </>
      )}

      {/* Spooked sweat drop */}
      {emotion === 'spooked' && (
        <ellipse cx="36" cy="15" rx="1.5" ry="2.5" fill="#60a5fa" opacity="0.55" />
      )}
    </svg>
  )
}

export function TiTi() {
  const [pos, setPos] = useState({ x: 120, y: 300 })
  const [vel, setVel] = useState({ x: 0.6, y: 0.4 })
  const [emotion, setEmotion] = useState('idle')
  const [message, setMessage] = useState(null)
  const [lookDir, setLookDir] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(true)
  const [flipped, setFlipped] = useState(false)

  const posRef = useRef(pos)
  const velRef = useRef(vel)
  const frameRef = useRef(null)
  const msgTimerRef = useRef(null)
  const emotionTimerRef = useRef(null)
  const cursorRef = useRef({ x: 0, y: 0 })

  posRef.current = pos
  velRef.current = vel

  // Track cursor
  useEffect(() => {
    const onMove = (e) => { cursorRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Float animation
  useEffect(() => {
    const SIZE = 60
    const animate = () => {
      setPos((prev) => {
        const maxX = window.innerWidth - SIZE - 16
        const maxY = window.innerHeight - SIZE - 16
        let nx = prev.x + velRef.current.x
        let ny = prev.y + velRef.current.y
        let nvx = velRef.current.x
        let nvy = velRef.current.y

        if (nx <= 16 || nx >= maxX) { nvx = -nvx; nx = Math.max(16, Math.min(maxX, nx)) }
        if (ny <= 16 || ny >= maxY) { nvy = -nvy; ny = Math.max(16, Math.min(maxY, ny)) }

        velRef.current = { x: nvx, y: nvy }
        setFlipped(nvx < 0)
        return { x: nx, y: ny }
      })

      // Look toward cursor
      setLookDir(() => {
        const dx = cursorRef.current.x - posRef.current.x - 28
        const dy = cursorRef.current.y - posRef.current.y - 28
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 5) return { x: 0, y: 0 }
        return { x: dx / dist, y: dy / dist }
      })

      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  // Random emotion changes
  useEffect(() => {
    const changeEmotion = () => {
      const e = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)]
      setEmotion(e)
      emotionTimerRef.current = setTimeout(changeEmotion, 3000 + Math.random() * 5000)
    }
    emotionTimerRef.current = setTimeout(changeEmotion, 4000)
    return () => clearTimeout(emotionTimerRef.current)
  }, [])

  // Random messages
  const showMessage = useCallback(() => {
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    setMessage(msg.text)
    clearTimeout(msgTimerRef.current)
    msgTimerRef.current = setTimeout(() => {
      setMessage(null)
      msgTimerRef.current = setTimeout(showMessage, 8000 + Math.random() * 12000)
    }, 3500)
  }, [])

  useEffect(() => {
    msgTimerRef.current = setTimeout(showMessage, 5000)
    return () => clearTimeout(msgTimerRef.current)
  }, [showMessage])

  // Spook when cursor gets close
  useEffect(() => {
    const check = setInterval(() => {
      const dx = cursorRef.current.x - posRef.current.x
      const dy = cursorRef.current.y - posRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 80) {
        setEmotion('spooked')
        // Flee
        velRef.current = {
          x: (posRef.current.x - cursorRef.current.x) / dist * 2.5,
          y: (posRef.current.y - cursorRef.current.y) / dist * 2.5,
        }
      }
    }, 200)
    return () => clearInterval(check)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed z-[999] pointer-events-none select-none"
      style={{ left: pos.x, top: pos.y, transform: `scaleX(${flipped ? -1 : 1})` }}
      aria-hidden="true"
    >
      {/* Speech bubble */}
      {message && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ transform: `translateX(-50%) scaleX(${flipped ? -1 : 1})`, minWidth: 160, maxWidth: 220 }}
        >
          <div
            className="relative px-3 py-2 rounded-xl text-xs font-mono text-[var(--text-primary)] leading-snug text-center"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(136,173,124,0.4)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            {message}
            {/* Tail */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-3 h-3"
              style={{
                background: 'var(--bg-card)',
                borderRight: '1px solid rgba(136,173,124,0.4)',
                borderBottom: '1px solid rgba(136,173,124,0.4)',
                transform: 'translateX(-50%) rotate(45deg)',
              }}
            />
          </div>
        </div>
      )}

      {/* Avatar */}
      <div style={{ filter: 'drop-shadow(0 4px 12px rgba(136,173,124,0.3))' }}>
        <TiTiFace emotion={emotion} lookX={lookDir.x} lookY={lookDir.y} size={52} />
      </div>

      {/* Name tag */}
      <div
        className="text-center font-mono text-[9px] uppercase tracking-widest mt-0.5"
        style={{ color: '#88AD7C', opacity: 0.7 }}
      >
        TiTi
      </div>
    </div>
  )
}
