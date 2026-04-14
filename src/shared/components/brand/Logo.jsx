import { clsx } from 'clsx'

export function Logo({ size = 'md', className }) {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  }
  return (
    <img
      src="/HSOCIETY_LOGO.webp"
      alt="HSOCIETY"
      className={clsx('inline-block w-auto object-contain select-none', sizes[size] || sizes.md, className)}
      loading="eager"
      decoding="async"
    />
  )
}
