import { Palette, Bell, BookOpen, Shield, Trash2, type LucideIcon } from 'lucide-react';

export type SettingsSectionId = 'appearance' | 'notifications' | 'learning' | 'security' | 'account';

export interface SettingsSectionConfig {
  id: SettingsSectionId;
  path: string;
  icon: LucideIcon;
  label: string;
}

export const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
  { id: 'appearance', path: '/dashboard/settings/appearance', icon: Palette, label: 'Appearance' },
  { id: 'notifications', path: '/dashboard/settings/notifications', icon: Bell, label: 'Notifications' },
  { id: 'learning', path: '/dashboard/settings/learning', icon: BookOpen, label: 'Learning' },
  { id: 'security', path: '/dashboard/settings/security', icon: Shield, label: 'Security' },
  { id: 'account', path: '/dashboard/settings/account', icon: Trash2, label: 'Account' },
];

export function isSettingsPath(pathname: string): boolean {
  return pathname === '/dashboard/settings' || pathname.startsWith('/dashboard/settings/');
}
