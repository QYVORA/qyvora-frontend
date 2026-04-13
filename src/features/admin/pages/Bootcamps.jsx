import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/core/contexts/ToastContext'
import { adminService } from '@/core/services'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { Button, Card, Input, Toggle } from '@/shared/components/ui'
import { clsx } from 'clsx'

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
          <Input
            label="Title"
            placeholder="Bootcamp title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <Input
            label="Level"
            placeholder="e.g. Beginner, Advanced"
            value={form.level}
            onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
          />
          <Input
            label="Duration"
            placeholder="e.g. 6 weeks"
            value={form.duration}
            onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
          />
          <Input
            label="Price Label"
            placeholder="e.g. Free, $299"
            value={form.priceLabel}
            onChange={(e) => setForm((prev) => ({ ...prev, priceLabel: e.target.value }))}
          />
          <div className="md:col-span-2 space-y-2">
            <label className="label">Cover Image</label>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <label className={clsx(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-semibold cursor-pointer transition-all duration-200',
                'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-accent/50 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]',
                uploadingImage && 'opacity-50 pointer-events-none'
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                    e.target.value = ''
                  }}
                />
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                disabled={uploadingImage || !form.image}
              >
                Clear
              </Button>
            </div>
            {form.image && (
              <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                <img src={resolveImageUrl(form.image)} alt="Bootcamp preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input-field min-h-[90px]"
              placeholder="Short description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Modules</p>
              <Button variant="secondary" size="sm" onClick={addModule}>Add Module</Button>
            </div>
            {(form.modules || []).length === 0 ? (
              <Card className="p-4 text-sm text-[var(--text-secondary)]">No modules yet.</Card>
            ) : (
              (form.modules || []).map((module, moduleIndex) => (
                <Card key={`${moduleIndex}`} className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      className="w-24"
                      type="number"
                      placeholder="ID"
                      value={module.moduleId || ''}
                      onChange={(e) => updateModule(moduleIndex, { moduleId: Number(e.target.value) })}
                    />
                    <Input
                      className="flex-1 min-w-[220px]"
                      placeholder="Module title"
                      value={module.title || ''}
                      onChange={(e) => updateModule(moduleIndex, { title: e.target.value })}
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeModule(moduleIndex)}>Remove</Button>
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
                      <Button variant="secondary" size="sm" onClick={() => addRoom(moduleIndex)}>Add Room</Button>
                    </div>
                    {(module.rooms || []).length === 0 ? (
                      <Card className="p-3 text-xs text-[var(--text-secondary)]">No rooms yet.</Card>
                    ) : (
                      (module.rooms || []).map((room, roomIndex) => (
                        <div key={`${moduleIndex}-${roomIndex}`} className="border border-[var(--border)] rounded-lg p-3 space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <Input
                              className="w-24"
                              type="number"
                              placeholder="ID"
                              value={room.roomId || ''}
                              onChange={(e) => updateRoom(moduleIndex, roomIndex, { roomId: Number(e.target.value) })}
                            />
                            <Input
                              className="flex-1 min-w-[200px]"
                              placeholder="Room title"
                              value={room.title || ''}
                              onChange={(e) => updateRoom(moduleIndex, roomIndex, { title: e.target.value })}
                            />
                            <Button variant="ghost" size="sm" onClick={() => removeRoom(moduleIndex, roomIndex)}>Remove</Button>
                          </div>
                          <textarea
                            className="input-field min-h-[70px]"
                            placeholder="Room overview"
                            value={room.overview || ''}
                            onChange={(e) => updateRoom(moduleIndex, roomIndex, { overview: e.target.value })}
                          />
                          <Input
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
            <div className="flex items-center gap-2">
              <Toggle checked={form.isActive} onChange={(val) => setForm((prev) => ({ ...prev, isActive: val }))} />
              <span className="text-sm text-[var(--text-secondary)]">Active</span>
            </div>
            <Input
              className="w-32"
              type="number"
              placeholder="Sort order"
              value={form.sortOrder}
              onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleSubmit}>
            {editingId ? 'Update Bootcamp' : 'Add Bootcamp'}
          </Button>
          {editingId && (
            <Button variant="ghost" onClick={resetForm}>Cancel Edit</Button>
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
                  <span className={`text-[10px] font-mono uppercase tracking-widest ${item.isActive ? 'text-accent' : 'text-[var(--text-primary)]'}`}>
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
                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                <Button variant="outline" size="sm" onClick={() => toggleActive(item.id)}>
                  {item.isActive ? 'Disable' : 'Enable'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
