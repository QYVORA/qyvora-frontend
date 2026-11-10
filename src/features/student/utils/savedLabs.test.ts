import { beforeEach, describe, expect, it } from 'vitest';
import {
  getContentLabProgress,
  getRecentLabIds,
  markLabRecent,
  recordRecentLearningPath,
} from './savedLabs';

describe('savedLabs local data', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('distinguishes unknown course progress from a known zero', () => {
    expect(getContentLabProgress('course-a', 4)).toBeUndefined();

    localStorage.setItem('qyvora_course_progress_course-a', JSON.stringify({ completedLessons: [] }));
    expect(getContentLabProgress('course-a', 4)).toBe(0);

    localStorage.setItem('qyvora_course_progress_course-a', JSON.stringify({ completedLessons: ['1', '2', '3'] }));
    expect(getContentLabProgress('course-a', 4)).toBe(75);
  });

  it('moves a newly visited item to the front without dropping existing history', () => {
    localStorage.setItem('qyvora_recent_labs', JSON.stringify(['course-a', 'lab-b', 'course-a']));

    markLabRecent('lab-b');

    expect(getRecentLabIds()).toEqual(['lab-b', 'course-a']);
  });

  it('records course, practical Lab and bootcamp routes but not the catalogue route', () => {
    recordRecentLearningPath('/dashboard/courses/network-security');
    recordRecentLearningPath('/dashboard/labs/privesc');
    recordRecentLearningPath('/dashboard/bootcamps/bc_123/phases/phase1/rooms/room1');
    recordRecentLearningPath('/dashboard/labs');

    expect(getRecentLabIds()).toEqual([
      'bootcamp:bc_123',
      'privesc',
      'network-security',
    ]);
  });
});
