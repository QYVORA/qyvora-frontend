export function SectionHeader({ kicker, title, subtitle, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center'
  return (
    <div className={alignClass}>
      {kicker && <p className="font-mono text-accent text-sm uppercase tracking-widest mb-3">{kicker}</p>}
      {title && <h2 className="section-title">{title}</h2>}
      {subtitle && <p className="section-sub mx-auto">{subtitle}</p>}
    </div>
  )
}
