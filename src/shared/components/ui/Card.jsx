import { clsx } from 'clsx'

export function Card({ children, className, hover, glow, ...props }) {
  return (
    <div
      className={clsx(
        'card p-6',
        hover && 'card-hover cursor-pointer',
        glow && 'shadow-lg shadow-accent/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
