import React, { useState } from 'react';
import Toggle from '@/shared/components/ui/Toggle';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';

export interface ProfileVisibilitySettings {
  githubPublic?: boolean;
  emailPublic?: boolean;
  activityPublic?: boolean;
}

interface ProfileVisibilityControlsProps {
  settings: ProfileVisibilitySettings;
  onChanged?: () => void;
  className?: string;
}

/**
 * ProfileVisibilityControls
 * Provides toggles for public profile privacy settings with server-side persistence.
 */
export const ProfileVisibilityControls: React.FC<ProfileVisibilityControlsProps> = ({
  settings,
  onChanged,
  className = '',
}) => {
  const { addToast } = useToast();
  const [current, setCurrent] = useState<ProfileVisibilitySettings>(settings);
  const [busy, setBusy] = useState(false);

  const handleToggle = async (key: keyof ProfileVisibilitySettings, val: boolean) => {
    setBusy(true);
    const updated = { ...current, [key]: val };
    setCurrent(updated);
    try {
      await api.put('/profile', updated);
      addToast('Profile privacy preferences updated.', 'success');
      onChanged?.();
    } catch {
      // Revert on error
      setCurrent(settings);
      addToast('Could not update profile visibility preferences.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      aria-label="Profile Visibility Preferences"
      className={`rounded-2xl border border-border bg-bg-card p-5 sm:p-6 ${className}`}
    >
      <div className="border-b border-border/50 pb-3">
        <h3 className="font-mono text-sm font-black uppercase tracking-wider text-text-primary">
          Public Profile Visibility
        </h3>
        <p className="mt-1 font-mono text-xs text-text-muted">
          Control which credentials and activity records appear on your shareable public profile.
        </p>
      </div>

      <div className="divide-y divide-border/40 pt-2">
        <div className="py-3">
          <Toggle
            label="Show GitHub on public profile"
            description="When enabled, your verified GitHub account is visible to other operators."
            checked={Boolean(current.githubPublic)}
            disabled={busy}
            onCheckedChange={(checked) => handleToggle('githubPublic', checked)}
          />
        </div>

        <div className="py-3">
          <Toggle
            label="Show email on public profile"
            description="Keep your contact email public for security research collaborations."
            checked={Boolean(current.emailPublic)}
            disabled={busy}
            onCheckedChange={(checked) => handleToggle('emailPublic', checked)}
          />
        </div>

        <div className="py-3">
          <Toggle
            label="Show activity heat map"
            description="Display your recent lab & course activity contributions publicly."
            checked={current.activityPublic !== false}
            disabled={busy}
            onCheckedChange={(checked) => handleToggle('activityPublic', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileVisibilityControls;
