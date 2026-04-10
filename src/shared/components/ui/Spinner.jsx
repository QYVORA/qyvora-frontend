export function Spinner({ size = 32, className }) {
  // Scale the H loader proportionally based on size prop
  const scale = (Number(size) || 32) / 32
  const width = Math.round(72 * scale)
  const height = Math.round(96 * scale)
  return (
    <div
      className={`h-loader ${className || ''}`}
      aria-label="Loading"
      style={{ width, height }}
    >
      <div className="h-leg h-leg-left"><div className="h-beam" /></div>
      <div className="h-crossbar"><div className="h-beam" /></div>
      <div className="h-leg h-leg-right"><div className="h-beam" /></div>
    </div>
  )
}
