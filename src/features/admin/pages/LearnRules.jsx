import { useEffect, useMemo, useState } from 'react'
import { Edit3, Save, Trash2, RefreshCcw } from 'lucide-react'
import { Button, Card, Input, Skeleton, Toggle } from '@/shared/components/ui'
import { adminService } from '@/core/services'
import { useToast } from '@/core/contexts/ToastContext'

const emptyForm = {
  name: '',
  key: '',
  description: '',
  points: '0',
  unit: 'CP',
  isActive: true,
  sortOrder: '0',
}

export default function LearnRules() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(emptyForm)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await adminService.getLearnRules()
        if (!mounted) return
        setRules(res.data?.items || [])
      } catch {
        if (mounted) setRules([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const sortedRules = useMemo(() => rules.slice().sort((a, b) => {
    const orderDiff = Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
    if (orderDiff !== 0) return orderDiff
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  }), [rules])

  const resetForm = () => {
    setEditingId('')
    setForm(emptyForm)
  }

  const buildPayload = () => ({
    name: form.name.trim(),
    key: form.key.trim(),
    description: form.description.trim(),
    points: Number(form.points || 0),
    unit: form.unit.trim() || 'CP',
    isActive: Boolean(form.isActive),
    sortOrder: Number(form.sortOrder || 0),
  })

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ type: 'error', message: 'Rule name is required.' })
      return
    }
    setSaving(true)
    try {
      const payload = buildPayload()
      if (editingId) {
        const res = await adminService.updateLearnRule(editingId, payload)
        setRules((prev) => prev.map((rule) => (rule._id === editingId ? res.data : rule)))
        toast({ type: 'success', message: 'Rule updated.' })
      } else {
        const res = await adminService.createLearnRule(payload)
        setRules((prev) => [res.data, ...prev])
        toast({ type: 'success', message: 'Rule created.' })
      }
      resetForm()
    } catch (err) {
      toast({ type: 'error', message: err?.response?.data?.error || 'Failed to save rule.' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (rule) => {
    setEditingId(rule._id)
    setForm({
      name: rule.name || '',
      key: rule.key || '',
      description: rule.description || '',
      points: String(rule.points || 0),
      unit: rule.unit || 'CP',
      isActive: rule.isActive !== false,
      sortOrder: String(rule.sortOrder || 0),
    })
  }

  const handleDelete = async (ruleId) => {
    try {
      await adminService.deleteLearnRule(ruleId)
      setRules((prev) => prev.filter((rule) => rule._id !== ruleId))
      toast({ type: 'warning', message: 'Rule deleted.' })
    } catch {
      toast({ type: 'error', message: 'Failed to delete rule.' })
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Learn Rules</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage the learning rules and points definitions used across the platform.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">
            {editingId ? 'Edit Rule' : 'Create Rule'}
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
          <Input label="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <Input label="Key" value={form.key} onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))} />
          <Input label="Points" type="number" value={form.points} onChange={(e) => setForm((prev) => ({ ...prev, points: e.target.value }))} />
          <Input label="Unit" value={form.unit} onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))} />
          <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))} />
          <div className="flex items-center gap-2">
            <Toggle checked={form.isActive} onChange={(val) => setForm((prev) => ({ ...prev, isActive: val }))} />
            <span className="text-sm text-[var(--text-secondary)]">Active</span>
          </div>
          <div className="md:col-span-2">
            <label className="label">Description</label>
            <textarea
              className="input-field min-h-[120px]"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">Existing Rules</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6 space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </Card>
            ))}
          </div>
        ) : sortedRules.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">No rules yet.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedRules.map((rule) => (
              <Card key={rule._id} className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{rule.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{rule.key}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(rule)}>
                      <Edit3 size={14} />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(rule._id)}>
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{rule.description || 'No description.'}</p>
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-muted)]">
                  <span className="px-2 py-1 rounded-full border border-[var(--border)]">{rule.points || 0} {rule.unit || 'CP'}</span>
                  <span className={`px-2 py-1 rounded-full border text-[10px] uppercase tracking-[0.2em] font-mono ${
                    rule.isActive ? 'border-accent/50 bg-accent/10 text-accent' : 'border-[var(--border)] text-[var(--text-muted)]'
                  }`}>
                    {rule.isActive ? '● Active' : '○ Hidden'}
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
