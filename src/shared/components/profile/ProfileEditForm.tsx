import React, { useEffect, useState } from 'react';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { Dialog, DialogContent } from '@/shared/components/ui/Dialog';
import Button from '@/shared/components/ui/Button';
import HandleSuggestions from '@/shared/components/HandleSuggestions';
import { sanitizePortfolioUrl } from './PortfolioLink';

export interface ProfileEditInitialValues {
  name: string;
  hackerHandle: string;
  bio: string;
  organization: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  country?: string;
}

interface ProfileEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ProfileEditInitialValues;
  onSaved: (data: any) => void;
}

const normalizeUrlInput = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  open,
  onOpenChange,
  initial,
  onSaved,
}) => {
  const { addToast } = useToast();
  const [form, setForm] = useState<ProfileEditInitialValues>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [
    initial.name,
    initial.hackerHandle,
    initial.bio,
    initial.organization,
    initial.website,
    initial.github,
    initial.linkedin,
    initial.twitter,
    initial.country,
  ]);

  const handleChange = (field: keyof ProfileEditInitialValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Validate website scheme if provided
      let cleanWebsite = '';
      if (form.website && form.website.trim()) {
        const validated = sanitizePortfolioUrl(form.website);
        if (!validated) {
          addToast('Invalid portfolio URL. Please enter a valid website address.', 'error');
          setSaving(false);
          return;
        }
        cleanWebsite = validated;
      }

      const res = await api.put('/profile', {
        name: form.name.trim(),
        hackerHandle: form.hackerHandle.trim(),
        bio: form.bio.trim(),
        organization: form.organization.trim(),
        website: cleanWebsite,
        github: form.github ? normalizeUrlInput(form.github) : '',
        linkedin: form.linkedin ? normalizeUrlInput(form.linkedin) : '',
        twitter: form.twitter ? form.twitter.trim() : '',
        country: form.country ? form.country.trim() : '',
      });

      onSaved(res.data);
      addToast('Profile updated successfully.', 'success');
      onOpenChange(false);
    } catch (err: any) {
      addToast(err?.response?.data?.error || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full bg-bg-card border border-border rounded-xl py-3 px-4 text-sm font-mono text-text-primary placeholder:text-text-muted focus:border-accent outline-none transition-colors';
  const labelCls =
    'block mb-1.5 font-mono text-xs font-bold uppercase tracking-wider text-text-secondary';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Edit Operator Profile" maxWidth="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-name" className={labelCls}>
                Display Name
              </label>
              <input
                id="edit-name"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Operator Name"
                className={inputCls}
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="edit-handle" className={labelCls}>
                Username Handle
              </label>
              <input
                id="edit-handle"
                value={form.hackerHandle}
                onChange={handleChange('hackerHandle')}
                placeholder="operator-handle"
                className={inputCls}
                maxLength={60}
              />
              <div className="mt-2">
                <HandleSuggestions
                  name={form.name}
                  email=""
                  onSelect={(h) => setForm((prev) => ({ ...prev, hackerHandle: h }))}
                  selectedHandle={form.hackerHandle}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="edit-bio" className={labelCls}>
              Biography
            </label>
            <textarea
              id="edit-bio"
              rows={3}
              value={form.bio}
              onChange={handleChange('bio')}
              placeholder="Tell other operators about your cybersecurity experience, interests, or focus areas..."
              className={inputCls}
              maxLength={2000}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-org" className={labelCls}>
                Organization
              </label>
              <input
                id="edit-org"
                value={form.organization}
                onChange={handleChange('organization')}
                placeholder="Team, Company, or University"
                className={inputCls}
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="edit-country" className={labelCls}>
                Country / Location
              </label>
              <input
                id="edit-country"
                value={form.country || ''}
                onChange={handleChange('country')}
                placeholder="e.g. Ghana, Kenya, Nigeria"
                className={inputCls}
                maxLength={60}
              />
            </div>
          </div>

          <div className="border-t border-border/50 pt-4">
            <h4 className="mb-3 font-mono text-xs font-black uppercase tracking-wider text-text-primary">
              External Presence
            </h4>
            <div className="space-y-3">
              <div>
                <label htmlFor="edit-website" className={labelCls}>
                  Portfolio / Website URL
                </label>
                <input
                  id="edit-website"
                  value={form.website || ''}
                  onChange={handleChange('website')}
                  placeholder="https://yourportfolio.dev"
                  className={inputCls}
                  maxLength={200}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-twitter" className={labelCls}>
                    X (Twitter) Handle or URL
                  </label>
                  <input
                    id="edit-twitter"
                    value={form.twitter || ''}
                    onChange={handleChange('twitter')}
                    placeholder="@operator_x"
                    className={inputCls}
                    maxLength={200}
                  />
                </div>

                <div>
                  <label htmlFor="edit-linkedin" className={labelCls}>
                    LinkedIn URL
                  </label>
                  <input
                    id="edit-linkedin"
                    value={form.linkedin || ''}
                    onChange={handleChange('linkedin')}
                    placeholder="https://linkedin.com/in/..."
                    className={inputCls}
                    maxLength={200}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditForm;
