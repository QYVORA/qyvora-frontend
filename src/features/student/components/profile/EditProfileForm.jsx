import { Edit3, Save, User, Shield } from 'lucide-react'
import { Button, Card, Input } from '@/shared/components/ui'

export function EditProfileForm({ form, onChange, onSave }) {
  return (
    <Card className="animate-slide-up">
      <h3 className="font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2">
        <Edit3 size={16} className="text-accent" /> Edit Profile
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Input
          label="Display Name"
          icon={User}
          value={form.name}
          onChange={e => onChange({ ...form, name: e.target.value })}
        />
        <Input
          label="Handle"
          icon={Shield}
          value={form.hackerHandle}
          onChange={e => onChange({ ...form, hackerHandle: e.target.value })}
        />
      </div>
      <Button variant="primary" icon={Save} onClick={onSave}>Save Changes</Button>
    </Card>
  )
}
