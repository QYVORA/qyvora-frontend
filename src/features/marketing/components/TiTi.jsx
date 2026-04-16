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

// TiTi SVG face — matches the dark/accent brand
function TiTiFace({ emotion, lookX, lookY, size = 56 }) {
  // Eye offset based on cursor direction
  const ex = Math.max(-3, Math.min(3, lookX * 4))
  const ey = Math.max(-2, Math.min(2, lookY * 3))

  const eyeColor = '#88AD7C' // accent
  const faceColor = '#111'
  const borderColor = '#88AD7C'

  const mouthPath = {
    idle:       'M 20 38 Q 28 43 36 38',
    suspicious: 'M 20 40 Q 28 37 36 40',
    excited:    'M 18 36 Q 28 46 38 36',
    thinking:   'M 22 39 L 34 39',
    watching:   'M 20 38 Q 28 41 36 38',
    spooked:    'M 22 34 Q 28 44 34 34',
  }

  const eyeShape = {
    idle:       { ry: 5 },
    suspicious: { ry: 2.5 },
    excited:    { ry: 6 },
    thinking:   { ry: 4 },
    watching:   { ry: 6 },
    spooked:    { ry: 6 },
  }

  const { ry } = eyeShape[emotion] || eyeShape.idle

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <circle cx="28" cy="28" r="26" fill={faceColor} stroke={borderColor} strokeWidth="1.5" />

      {/* Antenna */}
      <line x1="28" y1="2" x2="28" y2="10" stroke={borderColor} strokeWidth="1.5" />
      <circle cx="28" cy="2" r="2" fill={eyeColor} />

      {/* Left eye white */}
      <ellipse cx={17 + ex} cy={22 + ey} rx="5" ry={ry} fill="rgba(255,255,255,0.9)" />
      {/* Left pupil */}
      <circle cx={17 + ex} cy={22 + ey} r="2.5" fill={eyeColor} />
      <circle cx={17.8 + ex} cy={21.2 + ey} r="0.8" fill="white" />

      {/* Right eye white */}
      <ellipse cx={39 + ex} cy={22 + ey} rx="5" ry={ry} fill="rgba(255,255,255,0.9)" />
      {/* Right pupil */}
      <circle cx={39 + ex} cy={22 + ey} r="2.5" fill={eyeColor} />
      <circle cx={39.8 + ex} cy={21.2 + ey} r="0.8" fill="white" />

      {/* Suspicious eyebrow */}
      {emotion === 'suspicious' && (
        <>
          <line x1="13" y1="15" x2="21" y2="17" stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="35" y1="17" x2="43" y2="15" stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {emotion === 'thinking' && (
        <line x1="13" y1="16" x2="21" y2="16" stroke={eyeColor} strokeWidth="1.5" strokeLinecap="round" />
      )}

      {/* Mouth */}
      <path d={mouthPath[emotion] || mouthPath.idle} stroke={eyeColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Blush on excited */}
      {emotion === 'excited' && (
        <>
          <ellipse cx="12" cy="30" rx="4" ry="2.5" fill="#f472b6" opacity="0.35" />
          <ellipse cx="44" cy="30" rx="4" ry="2.5" fill="#f472b6" opacity="0.35" />
        </>
      )}

      {/* Sweat on spooked */}
      {emotion === 'spooked' && (
        <ellipse cx="42" cy="18" rx="2" ry="3.5" fill="#60a5fa" opacity="0.6" />
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
        <TiTiFace emotion={emotion} lookX={lookDir.x} lookY={lookDir.y} size={56} />
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
