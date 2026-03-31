import { clsx } from 'clsx'

export function Avatar({ username, size = 'md' }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }
  const letter = (username || '?')[0].toUpperCase()
  return (
    <div className={clsx('rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-mono font-bold text-accent shrink-0', sizes[size])}>
      {letter}
    </div>
  )
}
