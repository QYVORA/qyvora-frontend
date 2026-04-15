export function Spinner({ size = 32, className }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`spinner ${className || ''}`}
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 14)) }}
    />
  )
}
