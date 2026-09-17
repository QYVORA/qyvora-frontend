import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useToast } from '../../../../core/contexts/ToastContext';
import api from '../../../../core/services/api';
import { Dialog, DialogContent } from '../../../../shared/components/ui/Dialog';
import Button from '../../../../shared/components/ui/Button';
import HandleSuggestions from '../../../../shared/components/HandleSuggestions';

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
      addToast("Profile updated!", 'success');
      onOpenChange(false);
    } catch (err: any) {
      addToast(err?.response?.data?.error || "Failed to update profile.", 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full bg-bg-card border border-border rounded-xl py-2.5 px-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-[border-color] duration-[var(--dur-base)] ease-[var(--ease-smooth)] font-mono';
  const labelCls = 'text-xs font-bold text-text-muted uppercase tracking-widest block mb-1.5';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={"Edit Profile"} maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4 -mt-2">
          <div>
            <label htmlFor="edit-display-name" className={labelCls}>{"Display Name"}</label>
            <input id="edit-display-name" value={form.name} onChange={set('name')} placeholder={"Enter your display name"} className={inputCls} />
          </div>
          <div>
            <label htmlFor="edit-handle" className={labelCls}>{"Operator Handle"}</label>
            <input id="edit-handle" value={form.hackerHandle} onChange={set('hackerHandle')} placeholder="kwame-operator" className={inputCls} />
            <div className="mt-2">
              <HandleSuggestions
                name={form.name}
                email=""
                onSelect={(handle) => setForm((f) => ({ ...f, hackerHandle: handle }))}
                selectedHandle={form.hackerHandle}
              />
            </div>
          </div>
          <div>
            <label htmlFor="edit-organization" className={labelCls}>{"Organization"}</label>
            <input id="edit-organization" value={form.organization} onChange={set('organization')} placeholder={"Your organization (optional)"} className={inputCls} />
          </div>
          <div>
            <label htmlFor="edit-bio" className={labelCls}>{"Bio"}</label>
            <textarea id="edit-bio"
              value={form.bio}
              onChange={set('bio')}
              rows={3}
              placeholder={"Tell us about yourself…"}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => onOpenChange(false)} className="flex-1 btn-secondary !py-2.5 text-xs">{"Cancel"}</button>
            <Button type="submit" loading={saving} className="flex-1 !py-2.5 !text-xs">
              {saving ? "Saving..." : <><Save className="w-3 h-3" /> {"Save Changes"}</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
