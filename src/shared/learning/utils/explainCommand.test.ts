import { describe, expect, it } from 'vitest';
import { explainCommand } from './explainCommand';

describe('explainCommand', () => {
  it('explains a single command and its flags', () => {
    const result = explainCommand('ls -la /tmp');
    expect(result?.parts).toHaveLength(1);
    expect(result?.parts[0].summary).toMatch(/lists files/i);
    expect(result?.parts[0].flags.map((flag) => flag.flag)).toEqual(['-l', '-a']);
  });

  it('explains each side of a pipeline', () => {
    const result = explainCommand('cat access.log | grep "error"');
    expect(result?.parts.map((part) => part.command)).toEqual(['cat access.log', 'grep "error"']);
    expect(result?.overview).toMatch(/2 commands/i);
  });

  it('handles sudo and strips comments', () => {
    const result = explainCommand('# inspect services\nsudo nmap -sV 10.0.0.5');
    expect(result?.parts).toHaveLength(1);
    expect(result?.parts[0].summary).toMatch(/elevated privileges/i);
    expect(result?.parts[0].summary).toMatch(/scans hosts/i);
  });

  it('warns about destructive recursive deletes', () => {
    const result = explainCommand('rm -rf /tmp/staging');
    expect(result?.caution).toMatch(/deletes recursively/i);
  });

  it('uses command-specific flag meanings', () => {
    expect(explainCommand('tail -n 20 access.log')?.parts[0].flags).toEqual([
      { flag: '-n', meaning: 'print a number of lines' },
    ]);
    expect(explainCommand('find /var/log -mmin -10')?.parts[0].flags).toContainEqual({
      flag: '-mmin',
      meaning: 'match by minutes since modification',
    });
  });

  it('returns null when no command can be explained', () => {
    expect(explainCommand('qyvora connect ssh-basics')).toBeNull();
  });
});
