import { describe, it, expect } from 'vitest';
import {
  WEB_ACCESS_CONTROL_SCENARIOS,
  API_SECURITY_SCENARIOS,
  AUTOMATION_SCENARIOS,
} from '..';
import type { WebLabScenario } from '..';
import { LAB_CATALOGUE, LAB_MODULE_MATRIX } from '../../labs';

const ALL: WebLabScenario[] = [
  ...WEB_ACCESS_CONTROL_SCENARIOS,
  ...API_SECURITY_SCENARIOS,
  ...AUTOMATION_SCENARIOS,
];

const VALID_MODULES = LAB_MODULE_MATRIX.map((m) => m.module);

describe('QOSE web/application lab data', () => {
  it('is non-empty', () => {
    expect(WEB_ACCESS_CONTROL_SCENARIOS.length).toBeGreaterThan(0);
    expect(API_SECURITY_SCENARIOS.length).toBeGreaterThan(0);
    expect(AUTOMATION_SCENARIOS.length).toBeGreaterThan(0);
  });

  it('has unique scenario ids across all labs', () => {
    const ids = ALL.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('maps every scenario to a real QOSE module', () => {
    ALL.forEach((s) => {
      expect(VALID_MODULES).toContain(s.module);
    });
  });

  it('each scenario has the required authoring fields', () => {
    ALL.forEach((s) => {
      expect(s.id).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.technique).toBeTruthy();
      expect(s.url).toBeTruthy();
      expect(s.endpoint).toBeTruthy();
      expect(['beginner', 'intermediate', 'advanced']).toContain(s.difficulty);
      expect(s.cpReward).toBeGreaterThan(0);
      expect(s.estimatedMinutes).toBeGreaterThan(0);
      expect(s.objectives.length).toBeGreaterThan(0);
      expect(s.hints.length).toBeGreaterThan(0);
      expect(s.steps.length).toBeGreaterThan(0);
      expect(s.narrative).toBeTruthy();
    });
  });

  it('each step has an id, command, output and explanation', () => {
    ALL.forEach((s) => {
      s.steps.forEach((step) => {
        expect(step.id).toBeTruthy();
        expect(step.instruction).toBeTruthy();
        expect(step.command).toBeTruthy();
        expect(step.output).toBeTruthy();
        expect(step.explanation).toBeTruthy();
      });
    });
  });

  it('step ids follow the <scenarioId>-step-<n> convention used for progress keys', () => {
    ALL.forEach((s) => {
      s.steps.forEach((step, i) => {
        expect(step.id).toBe(`${s.id}-step-${i}`);
      });
    });
  });

  it('every quiz has a valid correctIndex', () => {
    ALL.forEach((s) => {
      s.steps.forEach((step) => {
        (step.quiz ?? []).forEach((q) => {
          expect(q.options.length).toBeGreaterThan(1);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(q.options.length);
        });
      });
    });
  });

  it('never embeds a plaintext flag in client data', () => {
    const serialized = JSON.stringify(ALL);
    expect(serialized).not.toMatch(/FLAG\{[^}]*\}/);
  });
});

describe('QOSE lab ↔ module matrix', () => {
  it('covers QOSE-M01 through QOSE-M12 exactly once', () => {
    const modules = LAB_MODULE_MATRIX.map((m) => m.module);
    const expected = Array.from({ length: 12 }, (_, i) => `QOSE-M${String(i + 1).padStart(2, '0')}`);
    expect(modules).toEqual(expected);
  });

  it('classifies every catalogue lab as ethical-hacking or web-app', () => {
    LAB_CATALOGUE.forEach((lab) => {
      expect(['ethical-hacking', 'web-app']).toContain(lab.discipline);
      expect(VALID_MODULES).toContain(lab.module);
    });
  });

  it('references only catalogue labs from the module matrix', () => {
    const labIds = new Set(LAB_CATALOGUE.map((l) => l.labId));
    LAB_MODULE_MATRIX.forEach((entry) => {
      entry.labs.forEach((id) => expect(labIds.has(id)).toBe(true));
      if (entry.coverage === 'covered') expect(entry.labs.length).toBeGreaterThan(0);
    });
  });

  it('registers a catalogue entry for each new lab', () => {
    const ids = LAB_CATALOGUE.map((l) => l.labId);
    expect(ids).toEqual(expect.arrayContaining(['web-access-control', 'api-security', 'automation']));
  });
});
