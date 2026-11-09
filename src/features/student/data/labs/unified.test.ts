import { describe, expect, it } from 'vitest';
import type { BootcampConfig } from '@/features/student/constants/bootcampStructure';
import { buildBootcampRoomLabs } from './unified';

const config: BootcampConfig = {
  id: 'hpb',
  title: 'Hacker Protocol Bootcamp',
  phases: [
    {
      id: 'phase1',
      title: 'Hacker Mindset',
      codename: 'PHASE 1',
      rooms: [
        {
          id: 'room1',
          title: 'Intro to Security',
          overview: 'Learn the fundamentals.',
          estimatedMinutes: 20,
          steps: [{ title: 'Start', instruction: 'Begin here.', image: null }],
        },
        {
          id: 'room2',
          title: 'Ethics',
          overview: 'Work responsibly.',
          estimatedMinutes: 15,
          steps: [{ title: 'Rules', instruction: 'Stay in scope.', image: null }],
        },
      ],
    },
  ],
};

describe('buildBootcampRoomLabs', () => {
  it('creates direct room destinations and carries access, completion, and CP metadata', () => {
    const labs = buildBootcampRoomLabs(config, 'bc_hpb', {
      modules: [
        {
          moduleId: 1,
          locked: false,
          rooms: [
            {
              title: 'Intro to Security',
              locked: false,
              completed: true,
              cpReward: 250,
            },
            { title: 'Ethics', locked: true, completed: false, cpReward: 150 },
          ],
        },
      ],
    });

    expect(labs).toHaveLength(2);
    expect(labs[0]).toMatchObject({
      id: 'hpb:phase1:room1',
      route: '/dashboard/bootcamps/bc_hpb/phases/phase1/rooms/room1',
      isLocked: false,
      isCompleted: true,
      cpReward: '250',
      phaseTitle: 'Hacker Mindset',
    });
    expect(labs[1]).toMatchObject({
      route: '/dashboard/bootcamps/bc_hpb/phases/phase1/rooms/room2',
      isLocked: true,
      isCompleted: false,
      cpReward: '150',
    });
  });

  it('fails closed when access data is not available', () => {
    const labs = buildBootcampRoomLabs(config, 'bc_hpb');

    expect(labs.every((lab) => lab.isLocked)).toBe(true);
    expect(labs.every((lab) => lab.isCompleted === false)).toBe(true);
  });
});
