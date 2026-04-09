import { useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { buildHackerMaskIdenticonDataUri, resolveAvatarSeed } from '@/shared/utils/hackerMaskIdenticon'

export function Avatar({ username, size = 'md', src = '', seed }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }
  const [hasError, setHasError] = useState(false)
  const seedValue = seed || resolveAvatarSeed({ username })
  const identicon = useMemo(() => buildHackerMaskIdenticonDataUri(seedValue), [seedValue])
  const resolvedSrc = src && !hasError ? src : identicon
  const altText = username ? `${username} avatar` : 'Operator avatar'
  return (
    <div className={clsx('rounded-full bg-black/40 border border-accent/30 flex items-center justify-center font-mono font-bold text-accent shrink-0 overflow-hidden', sizes[size])}>
      <img
        src={resolvedSrc}
        alt={altText}
        loading="lazy"
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  )
}
