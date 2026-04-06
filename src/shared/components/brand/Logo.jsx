import { clsx } from 'clsx'

export function Logo({ size = 'md', scale = 1, offsetY = 0, className }) {
  const sizes = {
    sm: 'h-5',
    md: 'h-7',
    lg: 'h-10',
    xl: 'h-14',
  }
  const transform = scale !== 1 || offsetY !== 0 ? `translateY(${offsetY}px) scale(${scale})` : undefined
  return (
    <img
      src="/HSOCIETY_LOGO.png"
      alt="HSOCIETY"
      className={clsx('inline-block w-auto object-contain select-none', sizes[size] || sizes.md, className)}
      loading="lazy"
      decoding="async"
      style={transform ? { transform, transformOrigin: 'left center' } : undefined}
    />
  )
}
