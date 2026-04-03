import { clsx } from 'clsx'

export function Logo({ size = 'md', className }) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }
  return (
    <span className={clsx('font-display font-bold tracking-tight', sizes[size] || sizes.md, className)}>
      H<span className="text-accent">SOCIETY</span>
    </span>
  )
}
