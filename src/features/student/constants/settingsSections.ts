import { Palette, Bell, BookOpen, Shield, Trash2, type LucideIcon } from 'lucide-react';

export type SettingsSectionId = 'appearance' | 'notifications' | 'learning' | 'security' | 'account';

export interface SettingsSectionConfig {
  id: SettingsSectionId;
  path: string;
  icon: LucideIcon;
  labelKey: string;
}

export const SETTINGS_SECTIONS: SettingsSectionConfig[] = [
  { id: 'appearance', path: '/dashboard/settings/appearance', icon: Palette, labelKey: 'student.settings.tabs.appearance' },
  { id: 'notifications', path: '/dashboard/settings/notifications', icon: Bell, labelKey: 'student.settings.tabs.notifications' },
  { id: 'learning', path: '/dashboard/settings/learning', icon: BookOpen, labelKey: 'student.settings.tabs.learning' },
  { id: 'security', path: '/dashboard/settings/security', icon: Shield, labelKey: 'student.settings.tabs.security' },
  { id: 'account', path: '/dashboard/settings/account', icon: Trash2, labelKey: 'student.settings.tabs.account' },
];

export function isSettingsPath(pathname: string): boolean {
  return pathname === '/dashboard/settings' || pathname.startsWith('/dashboard/settings/');
}
