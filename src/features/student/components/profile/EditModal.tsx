import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '../../../../core/contexts/ToastContext';
import api from '../../../../core/services/api';
import { Dialog, DialogContent } from '../../../../shared/components/ui/Dialog';

interface EditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: { name: string; hackerHandle: string; bio: string; organization: string };
  onSaved: (data: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ open, onOpenChange, initial, onSaved }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial); }, [initial.name, initial.hackerHandle, initial.bio, initial.organization]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/profile', {
        name: form.name.trim(),
        hackerHandle: form.hackerHandle.trim(),
        bio: form.bio.trim(),
        organization: form.organization.trim(),
      });
      onSaved(res.data);
      addToast('Profile updated.', 'success');
      onOpenChange(false);
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Update failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full bg-bg border border-border rounded-lg py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all font-mono';
  const labelCls = 'text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1.5';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Edit Profile" maxWidth="max-w-md">
        <form onSubmit={handleSave} className="space-y-4 -mt-2">
          <div>
            <label className={labelCls}>Full Name</label>
            <input value={form.name} onChange={set('name')} placeholder="Kwame Mensah" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Operator Handle</label>
            <input value={form.hackerHandle} onChange={set('hackerHandle')} placeholder="kwame_operator" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Organization</label>
            <input value={form.organization} onChange={set('organization')} placeholder="Company / team" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Bio</label>
            <textarea
              value={form.bio}
              onChange={set('bio')}
              rows={3}
              placeholder="Short operator bio..."
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => onOpenChange(false)} className="flex-1 btn-secondary !py-2.5 text-xs">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary !py-2.5 text-xs flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</> : <><Save className="w-3 h-3" /> Save</>}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
