import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/core/contexts/ToastContext'
import { ContentHeader } from '@/features/admin/components/content/ContentHeader'
import { ContentUploadForm } from '@/features/admin/components/content/ContentUploadForm'
import { ContentList } from '@/features/admin/components/content/ContentList'
import { adminService } from '@/core/services'
import { Card, Skeleton } from '@/shared/components/ui'

export default function AdminContent() {
  const [files, setFiles] = useState([])
  const [form, setForm] = useState({ title: '', phase: '1', type: 'PDF', description: '' })
  const [uploading, setUploading] = useState(false)
  const [content, setContent] = useState([])
  const [rawContent, setRawContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const fileRef = useRef()
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await adminService.getContent()
        if (!mounted) return
        setRawContent(res.data || null)
        const freeResources = res.data?.learn?.freeResources || []
        setContent(freeResources.map((item, index) => ({
          id: item.id || String(index + 1),
          name: item.title || 'Untitled',
          phase: '—',
          type: item.type || 'link',
          size: '—',
          uploaded: res.data?.updatedAt ? new Date(res.data.updatedAt).toLocaleDateString() : '—',
          status: 'published',
          url: item.url || '',
          description: item.description || '',
        })))
      } catch {
        setContent([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...dropped])
  }

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files)
    setFiles(prev => [...prev, ...selected])
  }

  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleUpload = async () => {
    if (!form.title) { toast({ type: 'error', message: 'Title is required' }); return }
    setUploading(true)
    try {
      let uploadedUrl = ''
      if (files.length > 0) {
        const fd = new FormData()
        fd.append('file', files[0])
        const uploadRes = await adminService.uploadFreeResource(fd)
        uploadedUrl = uploadRes.data?.file?.url || uploadRes.data?.url || ''
      }

      const newResource = {
        id: `res_${Date.now()}`,
        title: form.title,
        description: form.description || '',
        url: uploadedUrl,
        type: form.type.toLowerCase(),
      }

      const nextContent = {
        ...(rawContent || {}),
        learn: {
          ...(rawContent?.learn || {}),
          freeResources: [newResource, ...(rawContent?.learn?.freeResources || [])],
        },
      }

      const res = await adminService.updateContent(nextContent)
      setRawContent(res.data || nextContent)
      const freeResources = res.data?.learn?.freeResources || nextContent.learn.freeResources || []
      setContent(freeResources.map((item, index) => ({
        id: item.id || String(index + 1),
        name: item.title || 'Untitled',
        phase: '—',
        type: item.type || 'link',
        size: '—',
        uploaded: res.data?.updatedAt ? new Date(res.data.updatedAt).toLocaleDateString() : '—',
        status: 'published',
        url: item.url || '',
        description: item.description || '',
      })))

      setForm({ title: '', phase: '1', type: 'PDF', description: '' })
      setFiles([])
      toast({ type: 'success', title: 'Content published!', message: `"${newResource.title}" is now live.` })
    } catch {
      toast({ type: 'error', message: 'Upload failed.' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    const current = rawContent?.learn?.freeResources || []
    const next = current.filter((item, index) => (item.id || String(index + 1)) !== id)
    try {
      const res = await adminService.updateContent({
        ...(rawContent || {}),
        learn: { ...(rawContent?.learn || {}), freeResources: next },
      })
      setRawContent(res.data || null)
      const freeResources = res.data?.learn?.freeResources || next
      setContent(freeResources.map((item, index) => ({
        id: item.id || String(index + 1),
        name: item.title || 'Untitled',
        phase: '—',
        type: item.type || 'link',
        size: '—',
        uploaded: res.data?.updatedAt ? new Date(res.data.updatedAt).toLocaleDateString() : '—',
        status: 'published',
        url: item.url || '',
        description: item.description || '',
      })))
      toast({ type: 'info', message: 'Content removed.' })
    } catch {
      toast({ type: 'error', message: 'Failed to remove content.' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <ContentHeader />
      <ContentUploadForm
        form={form}
        onChangeForm={setForm}
        files={files}
        onDrop={handleDrop}
        onFileSelect={handleFileSelect}
        onRemoveFile={removeFile}
        onUpload={handleUpload}
        uploading={uploading}
        fileRef={fileRef}
      />
      {loading ? (
        <Card>
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl border border-[var(--border)]">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <ContentList content={content} onDelete={handleDelete} />
      )}
    </div>
  )
}
