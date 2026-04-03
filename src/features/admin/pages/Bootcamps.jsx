import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/core/contexts/ToastContext'
import { adminService } from '@/core/services'
import { Card } from '@/shared/components/ui'

const emptyForm = {
  title: '',
  description: '',
  level: '',
  duration: '',
  priceLabel: '',
  image: '',
  isActive: true,
  sortOrder: 0,
}

export default function AdminBootcamps() {
  const { toast } = useToast()
  const [form, setForm] = useState(emptyForm)
  const [bootcamps, setBootcamps] = useState([])
  const [rawContent, setRawContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await adminService.getContent()
        if (!mounted) return
        setRawContent(res.data || null)
        setBootcamps(res.data?.learn?.bootcamps || [])
      } catch {
        if (!mounted) return
        setBootcamps([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const sortedBootcamps = useMemo(
    () => [...bootcamps].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)),
    [bootcamps]
  )

  const updateBootcamps = async (next) => {
    const payload = {
      ...(rawContent || {}),
      learn: {
        ...(rawContent?.learn || {}),
        bootcamps: next,
      },
    }
    const res = await adminService.updateContent(payload)
    setRawContent(res.data || payload)
    setBootcamps(res.data?.learn?.bootcamps || next)
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast({ type: 'error', message: 'Bootcamp title is required.' })
      return
    }
    const next = [
      {
        id: `bc_${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        level: form.level.trim(),
        duration: form.duration.trim(),
        priceLabel: form.priceLabel.trim(),
        image: form.image.trim(),
        isActive: form.isActive !== false,
        sortOrder: Number(form.sortOrder || 0),
        quizAccessUserIds: [],
      },
      ...bootcamps,
    ]
    try {
      await updateBootcamps(next)
      setForm(emptyForm)
      toast({ type: 'success', message: 'Bootcamp added.' })
    } catch {
      toast({ type: 'error', message: 'Failed to save bootcamp.' })
    }
  }

  const handleDelete = async (id) => {
    const next = bootcamps.filter((item) => item.id !== id)
    try {
      await updateBootcamps(next)
      toast({ type: 'info', message: 'Bootcamp removed.' })
    } catch {
      toast({ type: 'error', message: 'Failed to delete bootcamp.' })
    }
  }

  const toggleActive = async (id) => {
    const next = bootcamps.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    try {
      await updateBootcamps(next)
      toast({ type: 'success', message: 'Bootcamp updated.' })
    } catch {
      toast({ type: 'error', message: 'Failed to update bootcamp.' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// bootcamps</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Bootcamps</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Add and manage bootcamp cards shown to students.</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input-field"
            placeholder="Bootcamp title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <input
            className="input-field"
            placeholder="Level (e.g. Beginner, Advanced)"
            value={form.level}
            onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
          />
          <input
            className="input-field"
            placeholder="Duration (e.g. 6 weeks)"
            value={form.duration}
            onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
          />
          <input
            className="input-field"
            placeholder="Price label (e.g. Free, $299)"
            value={form.priceLabel}
            onChange={(e) => setForm((prev) => ({ ...prev, priceLabel: e.target.value }))}
          />
          <input
            className="input-field md:col-span-2"
            placeholder="Cover image URL"
            value={form.image}
            onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
          />
          <textarea
            className="input-field md:col-span-2 min-h-[90px]"
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              />
              Active
            </label>
            <input
              className="input-field w-32"
              type="number"
              placeholder="Sort"
              value={form.sortOrder}
              onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
            />
          </div>
        </div>
        <button className="btn-primary px-5 py-2.5" onClick={handleSubmit}>Add Bootcamp</button>
      </Card>

      <div className="space-y-3">
        {loading ? (
          <Card className="p-6 text-sm text-[var(--text-secondary)]">Loading bootcamps...</Card>
        ) : sortedBootcamps.length === 0 ? (
          <Card className="p-6 text-sm text-[var(--text-secondary)]">No bootcamps yet.</Card>
        ) : (
          sortedBootcamps.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{item.title}</h3>
                  <span className={`text-[10px] font-mono uppercase tracking-widest ${item.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {item.isActive ? 'active' : 'hidden'}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{item.description || 'No description.'}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-mono">
                  {item.level && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.level}</span>}
                  {item.duration && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.duration}</span>}
                  {item.priceLabel && <span className="px-2.5 py-1 rounded-full border border-[var(--border)]">{item.priceLabel}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button className="btn-secondary px-4 py-2" onClick={() => toggleActive(item.id)}>
                  {item.isActive ? 'Disable' : 'Enable'}
                </button>
                <button className="btn-ghost px-4 py-2 text-red-400 hover:text-red-300" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
