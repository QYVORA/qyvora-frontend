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

// TiTi SVG — realistic robot/AI assistant design
function TiTiFace({ emotion, lookX, lookY, size = 60 }) {
  const ex = Math.max(-3, Math.min(3, lookX * 4))
  const ey = Math.max(-2, Math.min(2, lookY * 3))

  const acc = '#88AD7C'
  const accDim = 'rgba(136,173,124,0.3)'
  const bg = '#0a0f0a'
  const panel = '#111a11'
  const screenBg = '#050d05'

  // Eye glow intensity by emotion
  const eyeGlow = {
    idle: 0.7, suspicious: 0.5, excited: 1, thinking: 0.6, watching: 0.9, spooked: 1,
  }[emotion] ?? 0.7

  const eyeH = { idle: 8, suspicious: 4, excited: 9, thinking: 7, watching: 9, spooked: 9 }[emotion] ?? 8

  return (
    <svg width={size} height={size} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-strong">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2a1a" />
          <stop offset="100%" stopColor="#0a0f0a" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1f0d" />
          <stop offset="100%" stopColor="#050d05" />
        </linearGradient>
      </defs>

      {/* Antenna */}
      <line x1="30" y1="1" x2="30" y2="9" stroke={acc} strokeWidth="1.2" opacity="0.8" />
      <circle cx="30" cy="1" r="1.8" fill={acc} filter="url(#glow)" />
      {/* Antenna side arms */}
      <line x1="26" y1="5" x2="30" y2="5" stroke={accDim} strokeWidth="0.8" />
      <line x1="30" y1="5" x2="34" y2="5" stroke={accDim} strokeWidth="0.8" />
      <circle cx="25" cy="5" r="1.2" fill={accDim} />
      <circle cx="35" cy="5" r="1.2" fill={accDim} />

      {/* Head body */}
      <rect x="6" y="9" width="48" height="44" rx="4" fill="url(#bodyGrad)" stroke={acc} strokeWidth="1" opacity="0.9" />

      {/* Inner panel / screen area */}
      <rect x="10" y="13" width="40" height="36" rx="2" fill="url(#screenGrad)" stroke={accDim} strokeWidth="0.8" />

      {/* Corner screws */}
      {[[11.5,14.5],[48.5,14.5],[11.5,47.5],[48.5,47.5]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="1.2" fill="none" stroke={accDim} strokeWidth="0.8" />
      ))}

      {/* Eyes — hexagonal scanners */}
      {[18, 42].map((cx, i) => (
        <g key={i} transform={`translate(${cx + ex}, ${26 + ey})`}>
          {/* Outer hex ring */}
          <polygon
            points="0,-10 8.66,-5 8.66,5 0,10 -8.66,5 -8.66,-5"
            fill="none"
            stroke={acc}
            strokeWidth="0.8"
            opacity="0.4"
            transform="scale(0.9)"
          />
          {/* Eye screen */}
          <rect x="-7" y={-eyeH / 2} width="14" height={eyeH} rx="1.5"
            fill={screenBg} stroke={acc} strokeWidth="0.8" />
          {/* Iris glow */}
          <rect x="-5" y={-eyeH / 2 + 1} width="10" height={eyeH - 2} rx="1"
            fill={acc} opacity={eyeGlow * 0.25} />
          {/* Pupil — vertical bar */}
          <rect x="-1.5" y={-eyeH / 2 + 1} width="3" height={eyeH - 2} rx="0.8"
            fill={acc} opacity={eyeGlow} filter="url(#glow)" />
          {/* Scan line */}
          <line x1="-6" y1="0" x2="6" y2="0" stroke={acc} strokeWidth="0.5" opacity="0.4" />
        </g>
      ))}

      {/* Nose — small sensor dot */}
      <circle cx="30" cy="34" r="1.5" fill={acc} opacity="0.5" />
      <circle cx="30" cy="34" r="0.7" fill={acc} filter="url(#glow)" />

      {/* Mouth — LED bar display */}
      <rect x="16" y="39" width="28" height="5" rx="1" fill={screenBg} stroke={accDim} strokeWidth="0.7" />
      {emotion === 'idle' && (
        <rect x="18" y="40.5" width="24" height="2" rx="0.5" fill={acc} opacity="0.5" />
      )}
      {emotion === 'excited' && (
        <>
          {[0,4,8,12,16,20].map(x => (
            <rect key={x} x={18+x} y="40" width="3" height="3" rx="0.3" fill={acc} opacity="0.8" filter="url(#glow)" />
          ))}
        </>
      )}
      {emotion === 'suspicious' && (
        <rect x="18" y="41" width="24" height="1.5" rx="0.5" fill={acc} opacity="0.4" />
      )}
      {emotion === 'thinking' && (
        <>
          {[0,6,12,18].map(x => (
            <rect key={x} x={18+x} y="40.5" width="4" height="2" rx="0.3" fill={acc} opacity={0.3 + (x/18)*0.5} />
          ))}
        </>
      )}
      {emotion === 'watching' && (
        <>
          <rect x="18" y="40.5" width="24" height="2" rx="0.5" fill={acc} opacity="0.7" filter="url(#glow)" />
        </>
      )}
      {emotion === 'spooked' && (
        <>
          {[0,8,16].map(x => (
            <rect key={x} x={18+x} y="39.5" width="5" height="4" rx="0.5" fill={acc} opacity="0.9" filter="url(#glow-strong)" />
          ))}
        </>
      )}

      {/* Status LED — top right */}
      <circle cx="46" cy="15" r="2" fill={emotion === 'spooked' ? '#f87171' : acc}
        opacity={emotion === 'excited' ? 1 : 0.7} filter="url(#glow)" />

      {/* Side vents */}
      {[16,20,24].map(y => (
        <line key={y} x1="6" y1={y} x2="9" y2={y} stroke={accDim} strokeWidth="0.8" />
      ))}
      {[16,20,24].map(y => (
        <line key={y} x1="51" y1={y} x2="54" y2={y} stroke={accDim} strokeWidth="0.8" />
      ))}
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
        <TiTiFace emotion={emotion} lookX={lookDir.x} lookY={lookDir.y} size={60} />
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
