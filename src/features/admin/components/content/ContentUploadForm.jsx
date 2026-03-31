import { Upload, FileText, Plus, X } from 'lucide-react'
import { Card, Button, Input, Select } from '@/shared/components/ui'

export function ContentUploadForm({
  form,
  onChangeForm,
  files,
  onDrop,
  onFileSelect,
  onRemoveFile,
  onUpload,
  uploading,
  fileRef,
}) {
  return (
    <Card>
      <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
        <Plus size={16} className="text-accent" /> New Content
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Input
          label="Content Title"
          placeholder="Phase 1 - OSINT Masterclass"
          value={form.title}
          onChange={e => onChangeForm({ ...form, title: e.target.value })}
        />
        <Select
          label="Phase (optional)"
          value={form.phase}
          onChange={e => onChangeForm({ ...form, phase: e.target.value })}
          options={[
            { value: '', label: 'No phase' },
            ...[1,2,3,4,5].map(n => ({ value: String(n), label: `Phase ${n}` })),
          ]}
        />
        <Select
          label="Content Type"
          value={form.type}
          onChange={e => onChangeForm({ ...form, type: e.target.value })}
          options={['PDF', 'Video', 'Slides', 'Lab', 'Quiz'].map(t => ({ value: t, label: t }))}
        />
        <div>
          <label className="label">Description (optional)</label>
          <textarea
            className="input-field resize-none h-[46px]"
            placeholder="Brief description..."
            value={form.description}
            onChange={e => onChangeForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current.click()}
        className="border-2 border-dashed border-[var(--border)] hover:border-accent/40 rounded-xl p-8 text-center cursor-pointer transition-colors group mb-4"
      >
        <Upload size={28} className="text-[var(--text-muted)] group-hover:text-accent mx-auto mb-3 transition-colors" />
        <p className="text-sm text-[var(--text-secondary)]">Drag & drop files here, or <span className="text-accent">browse</span></p>
        <p className="text-xs text-[var(--text-muted)] mt-1">PDF, MP4, PPTX — max 50MB</p>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={onFileSelect} accept=".pdf,.mp4,.pptx,.zip" />
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mb-4">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <FileText size={16} className="text-accent shrink-0" />
              <span className="text-sm text-[var(--text-primary)] flex-1 truncate">{f.name}</span>
              <span className="text-xs text-[var(--text-muted)] font-mono">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              <button onClick={() => onRemoveFile(i)} className="text-[var(--text-muted)] hover:text-red-400 transition-colors">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button variant="primary" loading={uploading} onClick={onUpload}>
        {!uploading && <Upload size={15} />}
        {uploading ? 'Uploading...' : 'Publish Content'}
      </Button>
    </Card>
  )
}
