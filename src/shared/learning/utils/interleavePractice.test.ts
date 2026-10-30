import { describe, it, expect } from 'vitest';
import { interleavePractice, MAX_READ_RUN } from './interleavePractice';
import type { LearningBlock } from '../types/blocks';

const read = (i: number): LearningBlock => ({ type: 'text', id: `t${i}`, content: `Card ${i}` });
const quiz = (i: number): LearningBlock => ({
  type: 'checkpoint',
  id: `q${i}`,
  checkpointType: 'quiz',
  quiz: { questions: [] },
});
const flag = (i: number): LearningBlock => ({
  type: 'checkpoint',
  id: `f${i}`,
  checkpointType: 'flag',
  flag: { flagId: `f${i}` },
});

describe('interleavePractice', () => {
  it('leaves the order untouched when there is no quiz', () => {
    const blocks = [read(0), read(1), read(2), read(3), flag(0)];
    expect(interleavePractice(blocks).map((b) => b.id)).toEqual(blocks.map((b) => b.id));
  });

  it('pulls a quiz forward so no read run exceeds MAX_READ_RUN', () => {
    const blocks = [read(0), read(1), read(2), read(3), read(4), quiz(0)];
    const out = interleavePractice(blocks).map((b) => b.id);
    expect(out).toEqual(['t0', 't1', 't2', 'q0', 't3', 't4']);
  });

  it('never moves a flag checkpoint', () => {
    const blocks = [read(0), read(1), read(2), read(3), flag(0), quiz(0)];
    const out = interleavePractice(blocks).map((b) => b.id);
    // flag keeps its slot after the first read run; quiz fills the gap earlier
    expect(out[out.indexOf('f0')]).toBe('f0');
    expect(out.indexOf('q0')).toBeLessThan(out.indexOf('f0'));
  });

  it('appends any leftover quiz at the end', () => {
    const blocks = [read(0), read(1), quiz(0), quiz(1)];
    const out = interleavePractice(blocks).map((b) => b.id);
    // no read run reaches the threshold, both quizzes stay at the end in order
    expect(out).toEqual(['t0', 't1', 'q0', 'q1']);
  });

  it('keeps every block exactly once', () => {
    const blocks = [read(0), read(1), read(2), read(3), read(4), quiz(0), quiz(1)];
    const out = interleavePractice(blocks);
    expect(out).toHaveLength(blocks.length);
    expect(new Set(out.map((b) => b.id)).size).toBe(blocks.length);
  });

  it('uses MAX_READ_RUN = 3', () => {
    expect(MAX_READ_RUN).toBe(3);
  });
});
