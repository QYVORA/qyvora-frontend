import { clsx } from 'clsx'

export function Logo({ size = 'md', scale = 1, offsetY = 0, className }) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-18',
  }
  const transform = scale !== 1 || offsetY !== 0 ? `translateY(${offsetY}px) scale(${scale})` : undefined
  return (
    <img
      src="/HSOCIETY_LOGO.webp"
      alt="HSOCIETY"
      className={clsx('inline-block w-auto object-contain object-center select-none', sizes[size] || sizes.md, className)}
      loading="lazy"
      decoding="async"
      style={transform ? { transform, transformOrigin: 'center center' } : undefined}
    />
  )
}
