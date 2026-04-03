export function Spinner({ size = 32, className }) {
  const px = Number(size) || 32
  return (
    <div
      className={`border-2 border-accent border-t-transparent rounded-full animate-spin ${className || ''}`}
      style={{ width: px, height: px }}
    />
  )
}
