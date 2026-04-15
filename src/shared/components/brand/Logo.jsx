import { clsx } from 'clsx'

// The HSOCIETY logo PNG has a transparent background with the wordmark
// centered in a large canvas — we need a tall enough container so the
// actual text is legible, and object-contain keeps the aspect ratio.
export function Logo({ size = 'md', className }) {
  const sizes = {
    sm:  'h-10',   // ~40px — sidebars, small contexts
    md:  'h-14',   // ~56px — standard nav
    nav: 'h-20',   // ~80px — public navbar (accounts for canvas padding)
    lg:  'h-20',   // ~80px — auth pages
    xl:  'h-28',   // ~112px — login side panel
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
