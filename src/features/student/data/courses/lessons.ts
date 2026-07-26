import { LESSONS as linuxTerminal101 } from './courses/linux-terminal-101';
import { LESSONS as windowsCmd101 } from './courses/windows-cmd-101';
import { LESSONS as networking101 } from './courses/networking-101';
import { LESSONS as pythonForHackers101 } from './courses/python-for-hackers-101';
import { LESSONS as gitGithub101 } from './courses/git-github-101';
import { LESSONS as webTechnologies101 } from './courses/web-technologies-101';
import { LESSONS as webRecon101 } from './courses/web-recon-101';
import { LESSONS as burpSuite101 } from './courses/burp-suite-101';
import { LESSONS as sqlInjection101 } from './courses/sql-injection-101';
import { LESSONS as wifiFundamentals101 } from './courses/wifi-fundamentals-101';
import { LESSONS as nmap101 } from './courses/nmap-101';
import { LESSONS as wireshark101 } from './courses/wireshark-101';
import type { Lesson } from './types';

export const ALL_LESSONS: Record<string, Lesson[]> = {
  'linux-terminal-101': linuxTerminal101,
  'windows-cmd-101': windowsCmd101,
  'networking-101': networking101,
  'python-for-hackers-101': pythonForHackers101,
  'git-github-101': gitGithub101,
  'web-technologies-101': webTechnologies101,
  'web-recon-101': webRecon101,
  'burp-suite-101': burpSuite101,
  'sql-injection-101': sqlInjection101,
  'wifi-fundamentals-101': wifiFundamentals101,
  'nmap-101': nmap101,
  'wireshark-101': wireshark101,
};
