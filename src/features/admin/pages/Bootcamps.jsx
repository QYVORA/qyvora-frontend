import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/core/contexts/ToastContext'
import { adminService } from '@/core/services'
import { API_ORIGIN } from '@/core/services/api'
import { Card } from '@/shared/components/ui'

const emptyForm = {
  title: '',
  description: '',
  level: '',
  duration: '',
  priceLabel: '',
  image: '',
  modules: [],
  isActive: true,
  sortOrder: 0,
}

export default function AdminBootcamps() {
  const { toast } = useToast()
  const [form, setForm] = useState(emptyForm)
  const [bootcamps, setBootcamps] = useState([])
  const [rawContent, setRawContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const resolveImageUrl = (value) => {
    const src = String(value || '').trim()
    if (!src) return ''
    if (src.startsWith('data:')) return src
    if (/^https?:\/\//i.test(src)) return src
    if (src.startsWith('//')) return `${window.location.protocol}${src}`
    if (src.startsWith('/')) return `${API_ORIGIN}${src}`
    return `${API_ORIGIN}/${src.replace(/^\/+/, '')}`
  }

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

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId('')
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast({ type: 'error', message: 'Bootcamp title is required.' })
      return
    }
    if (!form.image.trim()) {
      toast({ type: 'error', message: 'Bootcamp image is required.' })
      return
    }
    const payload = {
      id: editingId || `bc_${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      level: form.level.trim(),
      duration: form.duration.trim(),
      priceLabel: form.priceLabel.trim(),
      image: form.image.trim(),
      isActive: form.isActive !== false,
      sortOrder: Number(form.sortOrder || 0),
      quizAccessUserIds: editingId
        ? (bootcamps.find((item) => item.id === editingId)?.quizAccessUserIds || [])
        : [],
      modules: Array.isArray(form.modules) ? form.modules : [],
    }

    const next = editingId
      ? bootcamps.map((item) => (item.id === editingId ? payload : item))
      : [payload, ...bootcamps]
    try {
      await updateBootcamps(next)
      resetForm()
      toast({ type: 'success', message: editingId ? 'Bootcamp updated.' : 'Bootcamp added.' })
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

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      description: item.description || '',
      level: item.level || '',
      duration: item.duration || '',
      priceLabel: item.priceLabel || '',
      image: item.image || '',
      modules: Array.isArray(item.modules) ? item.modules : [],
      isActive: item.isActive !== false,
      sortOrder: Number(item.sortOrder || 0),
    })
  }

  const addModule = () => {
    setForm((prev) => {
      const nextId = (prev.modules?.length || 0) + 1
      return {
        ...prev,
        modules: [
          ...(prev.modules || []),
          {
            moduleId: nextId,
            title: '',
            description: '',
            rooms: [],
          },
        ],
      }
    })
  }

  const updateModule = (index, updates) => {
    setForm((prev) => ({
      ...prev,
      modules: (prev.modules || []).map((mod, idx) => (idx === index ? { ...mod, ...updates } : mod)),
    }))
  }

  const removeModule = (index) => {
    setForm((prev) => ({
      ...prev,
      modules: (prev.modules || []).filter((_, idx) => idx !== index),
    }))
  }

  const addRoom = (moduleIndex) => {
    setForm((prev) => {
      const next = [...(prev.modules || [])]
      const target = next[moduleIndex]
      if (!target) return prev
      const nextRoomId = (target.rooms?.length || 0) + 1
      const rooms = [
        ...(target.rooms || []),
        { roomId: nextRoomId, title: '', overview: '', bullets: [] },
      ]
      next[moduleIndex] = { ...target, rooms }
      return { ...prev, modules: next }
    })
  }

  const updateRoom = (moduleIndex, roomIndex, updates) => {
    setForm((prev) => {
      const next = [...(prev.modules || [])]
      const target = next[moduleIndex]
      if (!target) return prev
      const rooms = (target.rooms || []).map((room, idx) => (idx === roomIndex ? { ...room, ...updates } : room))
      next[moduleIndex] = { ...target, rooms }
      return { ...prev, modules: next }
    })
  }

  const removeRoom = (moduleIndex, roomIndex) => {
    setForm((prev) => {
      const next = [...(prev.modules || [])]
      const target = next[moduleIndex]
      if (!target) return prev
      const rooms = (target.rooms || []).filter((_, idx) => idx !== roomIndex)
      next[moduleIndex] = { ...target, rooms }
      return { ...prev, modules: next }
    })
  }

  const handleImageUpload = async (file) => {
    if (!file) return
    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('file', file)
      const res = await adminService.uploadBootcampImage(formData)
      const url = res.data?.url || ''
      if (!url) throw new Error('Upload failed')
      setForm((prev) => ({ ...prev, image: url }))
      toast({ type: 'success', message: 'Image uploaded.' })
    } catch {
      toast({ type: 'error', message: 'Failed to upload image.' })
    } finally {
      setUploadingImage(false)
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
          <div className="md:col-span-2 space-y-2">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input
                className="input-field flex-1"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                  e.target.value = ''
                }}
              />
              <button
                type="button"
                className="btn-secondary px-4 py-2"
                onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                disabled={uploadingImage}
              >
                Clear Image
              </button>
            </div>
            <input
              className="input-field"
              placeholder="Uploaded image URL"
              value={form.image}
              readOnly
            />
            {form.image && (
              <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                <img src={resolveImageUrl(form.image)} alt="Bootcamp preview" className="w-full h-48 object-cover" />
              </div>
            )}
            {uploadingImage && (
              <p className="text-xs text-[var(--text-secondary)]">Uploading image...</p>
            )}
          </div>
          <textarea
            className="input-field md:col-span-2 min-h-[90px]"
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Modules</p>
              <button className="btn-secondary px-4 py-2" onClick={addModule}>Add Module</button>
            </div>
            {(form.modules || []).length === 0 ? (
              <Card className="p-4 text-sm text-[var(--text-secondary)]">No modules yet.</Card>
            ) : (
              (form.modules || []).map((module, moduleIndex) => (
                <Card key={`${moduleIndex}`} className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      className="input-field w-24"
                      type="number"
                      placeholder="ID"
                      value={module.moduleId || ''}
                      onChange={(e) => updateModule(moduleIndex, { moduleId: Number(e.target.value) })}
                    />
                    <input
                      className="input-field flex-1 min-w-[220px]"
                      placeholder="Module title"
                      value={module.title || ''}
                      onChange={(e) => updateModule(moduleIndex, { title: e.target.value })}
                    />
                    <button className="btn-ghost px-3 py-2 text-red-400" onClick={() => removeModule(moduleIndex)}>
                      Remove
                    </button>
                  </div>
                  <textarea
                    className="input-field min-h-[80px]"
                    placeholder="Module description"
                    value={module.description || ''}
                    onChange={(e) => updateModule(moduleIndex, { description: e.target.value })}
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">Rooms</p>
                      <button className="btn-secondary px-3 py-1.5" onClick={() => addRoom(moduleIndex)}>Add Room</button>
                    </div>
                    {(module.rooms || []).length === 0 ? (
                      <Card className="p-3 text-xs text-[var(--text-secondary)]">No rooms yet.</Card>
                    ) : (
                      (module.rooms || []).map((room, roomIndex) => (
                        <div key={`${moduleIndex}-${roomIndex}`} className="border border-[var(--border)] rounded-lg p-3 space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <input
                              className="input-field w-24"
                              type="number"
                              placeholder="ID"
                              value={room.roomId || ''}
                              onChange={(e) => updateRoom(moduleIndex, roomIndex, { roomId: Number(e.target.value) })}
                            />
                            <input
                              className="input-field flex-1 min-w-[200px]"
                              placeholder="Room title"
                              value={room.title || ''}
                              onChange={(e) => updateRoom(moduleIndex, roomIndex, { title: e.target.value })}
                            />
                            <button className="btn-ghost px-3 py-1.5 text-red-400" onClick={() => removeRoom(moduleIndex, roomIndex)}>
                              Remove
                            </button>
                          </div>
                          <textarea
                            className="input-field min-h-[70px]"
                            placeholder="Room overview"
                            value={room.overview || ''}
                            onChange={(e) => updateRoom(moduleIndex, roomIndex, { overview: e.target.value })}
                          />
                          <input
                            className="input-field"
                            placeholder="Room bullets (comma separated)"
                            value={(room.bullets || []).join(', ')}
                            onChange={(e) => updateRoom(moduleIndex, roomIndex, {
                              bullets: e.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                            })}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
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
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary px-5 py-2.5" onClick={handleSubmit}>
            {editingId ? 'Update Bootcamp' : 'Add Bootcamp'}
          </button>
          {editingId && (
            <button className="btn-ghost px-5 py-2.5" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
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
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                    {(item.modules || []).length} modules
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
                <button className="btn-ghost px-4 py-2" onClick={() => handleEdit(item)}>
                  Edit
                </button>
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
