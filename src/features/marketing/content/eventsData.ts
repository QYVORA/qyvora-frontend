import flyerSrc from '@/assets/events/pound-the-calabash.webp';

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  platform: string;
  flyerUrl: string;
  isActive: boolean;
  meetLink?: string;
}

export const EVENTS: EventData[] = [
  {
    id: 'evt_001',
    title: 'Pound the Calabash',
    description:
      'A 2-hour live ethical hacking session. Join us for an intense, hands-on offensive security challenge where you will attack a live target in real time.',
    date: '2026-07-04',
    time: '10:00 AM GMT',
    platform: 'Google Meet',
    flyerUrl: flyerSrc,
    isActive: true,
  },
];

export function getActiveEvents(): EventData[] {
  return EVENTS.filter((e) => e.isActive);
}

export function getEventById(id: string): EventData | undefined {
  return EVENTS.find((e) => e.id === id);
}
