import React from 'react';
import {
  LinuxTerminal101Icon,
  WindowsCmd101Icon,
  Networking101Icon,
  Nmap101Icon,
  Wireshark101Icon,
  PythonForHackers101Icon,
  GitGithub101Icon,
  SqlInjection101Icon,
  WebRecon101Icon,
  WebTechnologies101Icon,
  WifiFundamentals101Icon,
  BurpSuite101Icon,
} from '@/shared/components/icons/course-icons';

type BadgeIcon = React.ComponentType<{ className?: string }>;

interface CourseIconConfig {
  icon: BadgeIcon;
  label: string;
}

export const COURSE_ICON_MAP: Record<string, CourseIconConfig> = {
  'linux-terminal-101':      { icon: LinuxTerminal101Icon, label: '101' },
  'windows-cmd-101':         { icon: WindowsCmd101Icon, label: 'CMD' },
  'networking-101':          { icon: Networking101Icon, label: '101' },
  'python-for-hackers-101':  { icon: PythonForHackers101Icon, label: '101' },
  'git-github-101':          { icon: GitGithub101Icon, label: '101' },
  'web-technologies-101':    { icon: WebTechnologies101Icon, label: '101' },
  'web-recon-101':           { icon: WebRecon101Icon, label: '101' },
  'burp-suite-101':          { icon: BurpSuite101Icon, label: '101' },
  'sql-injection-101':       { icon: SqlInjection101Icon, label: '101' },
  'wifi-fundamentals-101':   { icon: WifiFundamentals101Icon, label: '101' },
  'nmap-101':                { icon: Nmap101Icon, label: '101' },
  'wireshark-101':           { icon: Wireshark101Icon, label: '101' },
};

export function getCourseIconConfig(courseId: string): CourseIconConfig | undefined {
  return COURSE_ICON_MAP[courseId];
}
