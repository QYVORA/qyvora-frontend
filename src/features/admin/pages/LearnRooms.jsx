import { useEffect, useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { Plus, Trash2, Edit3, Save, RefreshCcw } from 'lucide-react'
import { Button, Card, Input, Skeleton, Toggle } from '@/shared/components/ui'
import { adminService } from '@/core/services'
import { resolveImageUrl } from '@/shared/utils/resolveImageUrl'
import { useToast } from '@/core/contexts/ToastContext'

const emptySection = () => ({
  sectionId: '',
  title: '',
  markdown: '',
  sortOrder: 0,
})

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  level: 'Beginner',
  tags: '',
  coverImage: '',
  logoUrl: '',
  accentColor: '',
  estimatedMinutes: '',
  isActive: true,
  sortOrder: '0',
  sections: [emptySection()],
}

export default function LearnRooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await adminService.getRooms()
        if (!mounted) return
        setRooms(res.data?.items || [])
      } catch {
        if (mounted) setRooms([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const sortedRooms = useMemo(() => rooms.slice().sort((a, b) => {
    const orderDiff = Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
    if (orderDiff !== 0) return orderDiff
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  }), [rooms])

  const setSection = (index, updates) => {
    setForm((prev) => {
      const nextSections = prev.sections.map((section, i) => (i === index ? { ...section, ...updates } : section))
      return { ...prev, sections: nextSections }
    })
  }

  const addSection = () => {
    setForm((prev) => ({ ...prev, sections: [...prev.sections, emptySection()] }))
  }

  const removeSection = (index) => {
    setForm((prev) => {
      const next = prev.sections.filter((_, i) => i !== index)
      return { ...prev, sections: next.length ? next : [emptySection()] }
    })
  }

  const resetForm = () => {
    setEditingId('')
    setForm(emptyForm)
  }

  const buildPayload = () => ({
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    level: form.level.trim(),
    tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    coverImage: form.coverImage.trim(),
    logoUrl: form.logoUrl.trim(),
    accentColor: form.accentColor.trim(),
    estimatedMinutes: Number(form.estimatedMinutes || 0),
    isActive: Boolean(form.isActive),
    sortOrder: Number(form.sortOrder || 0),
    sections: form.sections.map((section, index) => ({
      sectionId: section.sectionId.trim() || `section-${index + 1}`,
      title: section.title.trim() || `Section ${index + 1}`,
      markdown: section.markdown || '',
      sortOrder: Number(section.sortOrder || index),
    })),
  })

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ type: 'error', message: 'Room title is required.' })
      return
    }
    setSaving(true)
    try {
      const payload = buildPayload()
      if (editingId) {
        const res = await adminService.updateRoom(editingId, payload)
        setRooms((prev) => prev.map((room) => (room._id === editingId ? res.data : room)))
        toast({ type: 'success', message: 'Room updated.' })
      } else {
        const res = await adminService.createRoom(payload)
        setRooms((prev) => [res.data, ...prev])
        toast({ type: 'success', message: 'Room created.' })
      }
      resetForm()
    } catch (err) {
      toast({ type: 'error', message: err?.response?.data?.error || 'Failed to save room.' })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file, field) => {
    if (!file) return
    const setUploading = field === 'coverImage' ? setUploadingCover : setUploadingLogo
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      const res = await adminService.uploadRoomImage(formData)
      const url = res.data?.url || ''
      if (!url) throw new Error('Upload failed')
      setForm((prev) => ({ ...prev, [field]: url }))
      toast({ type: 'success', message: 'Image uploaded.' })
    } catch {
      toast({ type: 'error', message: 'Failed to upload image.' })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (room) => {
    setEditingId(room._id)
    setForm({
      title: room.title || '',
      slug: room.slug || '',
      description: room.description || '',
      level: room.level || 'Beginner',
      tags: Array.isArray(room.tags) ? room.tags.join(', ') : '',
      coverImage: room.coverImage || '',
      logoUrl: room.logoUrl || '',
      accentColor: room.accentColor || '',
      estimatedMinutes: room.estimatedMinutes || '',
      isActive: room.isActive !== false,
      sortOrder: String(room.sortOrder || 0),
      sections: Array.isArray(room.sections) && room.sections.length
        ? room.sections.map((section) => ({
          sectionId: section.sectionId || '',
          title: section.title || '',
          markdown: section.markdown || '',
          sortOrder: section.sortOrder || 0,
        }))
        : [emptySection()],
    })
  }

  const handleDelete = async (roomId) => {
    try {
      await adminService.deleteRoom(roomId)
      setRooms((prev) => prev.filter((room) => room._id !== roomId))
      toast({ type: 'warning', message: 'Room deleted.' })
    } catch {
      toast({ type: 'error', message: 'Failed to delete room.' })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Learn Rooms</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Create rooms with markdown sections and upload branding assets.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">
            {editingId ? 'Edit Room' : 'Create Room'}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <RefreshCcw size={14} />
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              <Save size={14} />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} />
          <Input label="Level" value={form.level} onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))} />
          <Input label="Estimated Minutes" type="number" value={form.estimatedMinutes} onChange={(e) => setForm((prev) => ({ ...prev, estimatedMinutes: e.target.value }))} />
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} className="md:col-span-2" />
          <div className="md:col-span-2 space-y-2">
            <label className="label">Cover Image</label>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <label className={clsx(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-semibold cursor-pointer transition-all duration-200',
                'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-accent/50 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]',
                uploadingCover && 'opacity-50 pointer-events-none'
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {uploadingCover ? 'Uploading...' : 'Upload Cover Image'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'coverImage')
                    e.target.value = ''
                  }}
                />
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setForm((prev) => ({ ...prev, coverImage: '' }))}
                disabled={uploadingCover || !form.coverImage}
              >
                Clear
              </Button>
            </div>
            {form.coverImage && (
              <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                <img src={resolveImageUrl(form.coverImage)} alt="Cover preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="label">Logo Image</label>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <label className={clsx(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-semibold cursor-pointer transition-all duration-200',
                'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-accent/50 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]',
                uploadingLogo && 'opacity-50 pointer-events-none'
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'logoUrl')
                    e.target.value = ''
                  }}
                />
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setForm((prev) => ({ ...prev, logoUrl: '' }))}
                disabled={uploadingLogo || !form.logoUrl}
              >
                Clear
              </Button>
            </div>
            {form.logoUrl && (
              <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                <img src={resolveImageUrl(form.logoUrl)} alt="Logo preview" className="w-full h-32 object-contain bg-white" />
              </div>
            )}
          </div>
          <Input label="Accent Color" value={form.accentColor} onChange={(e) => setForm((prev) => ({ ...prev, accentColor: e.target.value }))} />
          <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))} />
          <div className="flex items-center gap-2">
            <Toggle checked={form.isActive} onChange={(val) => setForm((prev) => ({ ...prev, isActive: val }))} />
            <span className="text-sm text-[var(--text-secondary)]">Active</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">Sections</h3>
            <Button variant="ghost" size="sm" onClick={addSection}>
              <Plus size={14} />
              Add Section
            </Button>
          </div>
          {form.sections.map((section, index) => (
            <Card key={`section-${index}`} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">Section {index + 1}</p>
                <Button variant="ghost" size="sm" onClick={() => removeSection(index)}>
                  <Trash2 size={14} />
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input label="Section ID" value={section.sectionId} onChange={(e) => setSection(index, { sectionId: e.target.value })} />
                <Input label="Title" value={section.title} onChange={(e) => setSection(index, { title: e.target.value })} className="md:col-span-2" />
                <Input label="Sort Order" type="number" value={section.sortOrder} onChange={(e) => setSection(index, { sortOrder: e.target.value })} />
              </div>
              <div>
                <label className="label">Markdown Content</label>
                <textarea
                  className="input-field min-h-[140px]"
                  value={section.markdown}
                  onChange={(e) => setSection(index, { markdown: e.target.value })}
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Existing Rooms</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </Card>
            ))}
          </div>
        ) : sortedRooms.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">No rooms yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedRooms.map((room) => (
              <Card key={room._id} className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{room.title}</h3>
                    <p className="text-xs text-[var(--text-muted)]">/{room.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(room)}>
                      <Edit3 size={14} />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(room._id)}>
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{room.description || 'No description.'}</p>
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-muted)]">
                  <span className="px-2 py-1 rounded-full border border-[var(--border)]">{room.level || 'Beginner'}</span>
                  <span className="px-2 py-1 rounded-full border border-[var(--border)]">Sections: {room.sections?.length || 0}</span>
                  <span className={clsx(
                    'px-2 py-1 rounded-full border text-[10px] uppercase tracking-[0.2em] font-mono',
                    room.isActive
                      ? 'border-accent/50 bg-accent/10 text-accent'
                      : 'border-[var(--border)] text-[var(--text-muted)]'
                  )}>
                    {room.isActive ? '● Active' : '○ Hidden'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
