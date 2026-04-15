const DEFAULT_SEED = 'anonymous'

const PALETTE = {
  background: ['#070B09', '#0A0F0C', '#0B120F'],
  hood: ['#0E1510', '#121A14', '#0B1410', '#141C16'],
  mask: ['#1A1F1C', '#151A17', '#1F2421', '#121714'],
  accent: ['#88AD7C', '#7CFF7A', '#A6FF8A', '#93E985'],
  accentDim: ['#4C6F55', '#3D5944', '#5B7F5B'],
}

const fmt = (value) => Number(value.toFixed(2))

const hashSeed = (seed) => {
  const str = String(seed || DEFAULT_SEED)
  let hash = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const mulberry32 = (seed) => {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (rng, list) => list[Math.floor(rng() * list.length)]

export const buildHackerMaskIdenticonSvg = (seed) => {
  const rng = mulberry32(hashSeed(seed))
  const bg = pick(rng, PALETTE.background)
  const hood = pick(rng, PALETTE.hood)
  const hoodShadow = pick(rng, PALETTE.hood)
  const mask = pick(rng, PALETTE.mask)
  const maskShadow = pick(rng, PALETTE.mask)
  const accent = pick(rng, PALETTE.accent)
  const accentDim = pick(rng, PALETTE.accentDim)

  const center = 60
  const hoodTop = fmt(14 + rng() * 8)
  const hoodBottom = fmt(106 - rng() * 4)
  const hoodWidth = fmt(96 + rng() * 8)
  const hoodTopWidth = fmt(hoodWidth * (0.5 + rng() * 0.12))
  const hoodInset = fmt(10 + rng() * 6)

  const maskTop = fmt(46 + rng() * 6)
  const maskBottom = fmt(90 + rng() * 8)
  const maskWidth = fmt(52 + rng() * 12)
  const chinWidth = fmt(maskWidth * (0.52 + rng() * 0.18))

  const eyeY = fmt(maskTop + 12 + rng() * 8)
  const eyeOffsetX = fmt(14 + rng() * 6)
  const eyeWidth = fmt(10 + rng() * 7)
  const eyeHeight = fmt(3 + rng() * 4)
  const eyeStyle = Math.floor(rng() * 3)

  const cheekY = fmt(eyeY + 9 + rng() * 6)
  const cheekWidth = fmt(10 + rng() * 6)
  const cheekOffsetX = fmt(18 + rng() * 6)

  const hoodLeft = fmt(center - hoodWidth / 2)
  const hoodRight = fmt(center + hoodWidth / 2)
  const hoodTopLeft = fmt(center - hoodTopWidth / 2)
  const hoodTopRight = fmt(center + hoodTopWidth / 2)

  const maskLeft = fmt(center - maskWidth / 2)
  const maskRight = fmt(center + maskWidth / 2)
  const chinLeft = fmt(center - chinWidth / 2)
  const chinRight = fmt(center + chinWidth / 2)

  const hoodPath = `M${hoodLeft} ${hoodBottom} L${hoodTopLeft} ${hoodTop} L${hoodTopRight} ${hoodTop} L${hoodRight} ${hoodBottom} Z`
  const hoodInnerPath = `M${hoodLeft + hoodInset} ${hoodBottom - 8} L${hoodTopLeft + hoodInset} ${hoodTop + 10} L${hoodTopRight - hoodInset} ${hoodTop + 10} L${hoodRight - hoodInset} ${hoodBottom - 8} Z`
  const maskPath = `M${maskLeft} ${maskTop} L${chinLeft} ${maskBottom} L${chinRight} ${maskBottom} L${maskRight} ${maskTop} Z`

  const noseTop = fmt(maskTop + 8 + rng() * 6)
  const noseWidth = fmt(8 + rng() * 6)
  const nosePath = `M${center - noseWidth / 2} ${noseTop} L${center} ${noseTop + 10} L${center + noseWidth / 2} ${noseTop} Z`

  const eyeShapes = () => {
    if (eyeStyle === 0) {
      return `
        <rect x="${fmt(center - eyeOffsetX - eyeWidth / 2)}" y="${fmt(eyeY - eyeHeight / 2)}" width="${eyeWidth}" height="${eyeHeight}" rx="${fmt(eyeHeight / 2)}" />
        <rect x="${fmt(center + eyeOffsetX - eyeWidth / 2)}" y="${fmt(eyeY - eyeHeight / 2)}" width="${eyeWidth}" height="${eyeHeight}" rx="${fmt(eyeHeight / 2)}" />
      `
    }
    if (eyeStyle === 1) {
      const ex = fmt(center - eyeOffsetX)
      const ey = fmt(eyeY)
      const w = fmt(eyeWidth * 0.7)
      const h = fmt(eyeHeight * 1.2)
      return `
        <polygon points="${fmt(ex - w)} ${ey} ${ex} ${fmt(ey - h)} ${fmt(ex + w)} ${ey} ${ex} ${fmt(ey + h)}" />
        <polygon points="${fmt(center + eyeOffsetX - w)} ${ey} ${fmt(center + eyeOffsetX)} ${fmt(ey - h)} ${fmt(center + eyeOffsetX + w)} ${ey} ${fmt(center + eyeOffsetX)} ${fmt(ey + h)}" />
      `
    }
    return `
      <ellipse cx="${fmt(center - eyeOffsetX)}" cy="${eyeY}" rx="${fmt(eyeWidth / 2.1)}" ry="${fmt(eyeHeight * 0.8)}" />
      <ellipse cx="${fmt(center + eyeOffsetX)}" cy="${eyeY}" rx="${fmt(eyeWidth / 2.1)}" ry="${fmt(eyeHeight * 0.8)}" />
    `
  }

  const cheekLines = `
    <rect x="${fmt(center - cheekOffsetX - cheekWidth)}" y="${cheekY}" width="${cheekWidth}" height="2" rx="1" />
    <rect x="${fmt(center + cheekOffsetX)}" y="${cheekY}" width="${cheekWidth}" height="2" rx="1" />
  `

  const browY = fmt(maskTop + 4 + rng() * 3)
  const browWidth = fmt(14 + rng() * 6)
  const browHeight = fmt(2 + rng() * 1.5)
  const browOffset = fmt(16 + rng() * 4)
  const browLines = `
    <rect x="${fmt(center - browOffset - browWidth)}" y="${browY}" width="${browWidth}" height="${browHeight}" rx="1" />
    <rect x="${fmt(center + browOffset)}" y="${browY}" width="${browWidth}" height="${browHeight}" rx="1" />
  `

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-hidden="true">
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="120" height="120" rx="20" fill="${bg}" />
    <path d="${hoodPath}" fill="${hood}" />
    <path d="${hoodInnerPath}" fill="${hoodShadow}" opacity="0.45" />
    <path d="${maskPath}" fill="${mask}" stroke="${accentDim}" stroke-width="1.2" />
    <path d="${nosePath}" fill="${maskShadow}" opacity="0.65" />
    <g fill="${accent}" filter="url(#glow)">
      ${eyeShapes()}
    </g>
    <g fill="${accentDim}" opacity="0.85">
      ${browLines}
      ${cheekLines}
    </g>
    <path d="M${fmt(maskLeft + 6)} ${fmt(maskBottom - 10)} H${fmt(maskRight - 6)}" stroke="${accentDim}" stroke-width="1.2" opacity="0.7" />
  </svg>
  `

  return svg.replace(/\s+/g, ' ').trim()
}

export const buildHackerMaskIdenticonDataUri = (seed) => {
  const svg = buildHackerMaskIdenticonSvg(seed)
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const resolveAvatarSeed = (identity = {}) => {
  const value = (
    identity.name ||
    identity.hackerHandle ||
    identity.handle ||
    identity.email ||
    identity.username ||
    identity.id ||
    identity._id ||
    identity.seed
  )
  return String(value || DEFAULT_SEED)
}
