import { describe, it, expect, vi } from 'vitest';
import SettingsPage from '../SettingsPage';

describe('SettingsPage', () => {
  it('exports the SettingsPage component', () => {
    expect(SettingsPage).toBeDefined();
    expect(typeof SettingsPage).toBe('function');
  });
});

