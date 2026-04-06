import { useEffect, useRef, useState } from 'react'
import { ShoppingBag, X, Eye, Star, UploadCloud, ToggleLeft, BadgeCheck, BadgeX } from 'lucide-react'
import { Badge, Button, Card, Input, Select, Skeleton } from '@/shared/components/ui'
import { useToast } from '@/core/contexts/ToastContext'
import { adminService } from '@/core/services'

export default function AdminMarketplace() {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    cpPrice: '',
    type: 'pdf',
    sortOrder: '0',
    isActive: true,
    isFree: false,
    coverUrl: '',
  })
  const fileRef = useRef()
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await adminService.getCPProducts()
        if (!mounted) return
        setAllItems(res.data?.items || [])
      } catch {
        setAllItems([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const reject = (id, name) => {
    adminService.deleteCPProduct(id)
      .then(() => {
        setAllItems(prev => prev.filter(i => i._id !== id))
        toast({ type: 'warning', message: `"${name}" has been removed.` })
      })
      .catch(() => toast({ type: 'error', message: 'Failed to remove item.' }))
  }

  const handleFileSelect = (e) => {
    const next = e.target.files?.[0]
    if (!next) return
    setFile(next)
  }

  const handleCreate = async () => {
    if (!form.title.trim()) {
      toast({ type: 'error', message: 'Title is required.' })
      return
    }
    if (!file) {
      toast({ type: 'error', message: 'Please upload a PDF file.' })
      return
    }
    const price = form.isFree ? 0 : Number(form.cpPrice || 0)
    if (Number.isNaN(price) || price < 0) {
      toast({ type: 'error', message: 'CP price must be 0 or higher.' })
      return
    }

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const uploadRes = await adminService.uploadCPProduct(fd)
      const fileId = uploadRes.data?.fileId
      const fileName = uploadRes.data?.originalName || ''
      const fileSize = uploadRes.data?.size || 0
      const fileMime = uploadRes.data?.mime || ''
      if (!fileId) {
        throw new Error('Upload failed')
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        cpPrice: price,
        coverUrl: form.coverUrl.trim(),
        productUrl: '',
        fileId,
        fileName,
        fileSize,
        fileMime,
        type: form.type || 'pdf',
        sortOrder: Number(form.sortOrder || 0),
        isActive: Boolean(form.isActive),
      }

      const created = await adminService.createCPProduct(payload)
      const newItem = created.data
      setAllItems(prev => {
        const next = [newItem, ...prev]
        return next.sort((a, b) => {
          const orderDiff = Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
          if (orderDiff !== 0) return orderDiff
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        })
      })
      setForm({
        title: '',
        description: '',
        cpPrice: '',
        type: 'pdf',
        sortOrder: '0',
        isActive: true,
        isFree: false,
        coverUrl: '',
      })
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      toast({ type: 'success', title: 'CP Product created', message: `"${newItem.title}" is now live.` })
    } catch {
      toast({ type: 'error', message: 'Failed to create CP product.' })
    } finally {
      setUploading(false)
    }
  }

  const approvedItems = allItems

  const updateItem = (id, updates) => {
    adminService.updateCPProduct(id, updates)
      .then((res) => {
        const next = res.data
        setAllItems(prev => prev.map(item => (item._id === id ? next : item)))
        toast({ type: 'success', message: 'Product updated.' })
      })
      .catch(() => toast({ type: 'error', message: 'Failed to update product.' }))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <p className="font-mono text-accent text-xs uppercase tracking-widest mb-1">// marketplace control</p>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Marketplace</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Review, approve, and remove marketplace listings.</p>
      </div>

      <Card>
        <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
          <UploadCloud size={16} className="text-accent" /> Create CP Product
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Title"
            placeholder="Zero-Day Playbook"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          />
          <Input
            label="CP Price"
            placeholder="250"
            type="number"
            min="0"
            value={form.cpPrice}
            onChange={(e) => setForm(prev => ({ ...prev, cpPrice: e.target.value }))}
            disabled={form.isFree}
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
            options={[
              { label: 'PDF', value: 'pdf' },
              { label: 'Playbook', value: 'playbook' },
              { label: 'Framework', value: 'framework' },
              { label: 'Exploit', value: 'exploit' },
              { label: 'General', value: 'general' },
            ]}
          />
          <Input
            label="Sort Order"
            placeholder="0"
            type="number"
            min="0"
            value={form.sortOrder}
            onChange={(e) => setForm(prev => ({ ...prev, sortOrder: e.target.value }))}
          />
        </div>
        <div className="mt-4">
          <label className="label">Description</label>
          <textarea
            className="input-field min-h-[96px]"
            placeholder="Short description for the marketplace."
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Cover Image URL (optional)"
            placeholder="https://..."
            value={form.coverUrl}
            onChange={(e) => setForm(prev => ({ ...prev, coverUrl: e.target.value }))}
          />
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1">
            <label className="label">PDF File</label>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent/15 file:text-accent hover:file:bg-accent/25"
            />
            {file && <p className="text-xs text-[var(--text-muted)] mt-2">Selected: {file.name}</p>}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(e) => {
                  const checked = e.target.checked
                  setForm(prev => ({
                    ...prev,
                    isFree: checked,
                    cpPrice: checked ? '0' : prev.cpPrice,
                  }))
                }}
              />
              Free
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              Active
            </label>
            <Button variant="primary" onClick={handleCreate} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Create Product'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Active listings */}
      <Card>
        <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
          <ShoppingBag size={16} className="text-accent" /> Active Listings ({approvedItems.length})
        </h3>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3 border-b border-[var(--border)] last:border-0">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="text-left p-3">Item</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Rating</th>
                  <th className="text-left p-3">Downloads</th>
                  <th className="text-left p-3">Seller</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {approvedItems.map(item => (
                  <tr key={item._id || item.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--text-primary)] max-w-[180px] truncate">{item.title}</p>
                      </div>
                    </td>
                    <td className="p-3"><Badge variant="default">{item.type || 'General'}</Badge></td>
                    <td className="p-3 font-mono text-sm text-accent">
                      {Number(item.cpPrice || 0) === 0 ? 'Free' : `${item.cpPrice} CP`}
                    </td>
                    <td className="p-3 text-sm text-[var(--text-secondary)] flex items-center gap-1">
                      <Star size={12} className="text-accent" />—
                    </td>
                    <td className="p-3 text-sm text-[var(--text-secondary)] font-mono">—</td>
                    <td className="p-3 text-sm text-[var(--text-muted)] font-mono">{item.createdBy || '—'}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={item.isActive ? BadgeCheck : BadgeX}
                          onClick={() => updateItem(item._id || item.id, { isActive: !item.isActive })}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={ToggleLeft}
                          onClick={() => updateItem(item._id || item.id, { cpPrice: 0 })}
                          disabled={Number(item.cpPrice || 0) === 0}
                        >
                          Make Free
                        </Button>
                        <Button variant="ghost" size="sm" icon={Eye}>View</Button>
                        <Button variant="danger" size="sm" icon={X} onClick={() => reject(item._id || item.id, item.title)}>Remove</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
