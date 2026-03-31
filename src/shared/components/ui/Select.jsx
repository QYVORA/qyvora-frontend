export function Select({ label, options, className, ...props }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      <select className="input-field appearance-none" {...props}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
