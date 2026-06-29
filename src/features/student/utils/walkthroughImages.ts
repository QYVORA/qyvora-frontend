const images = import.meta.glob('/src/assets/walkthrough/**/*.webp', {
  eager: true,
  query: '?url',
}) as Record<string, string>;

export function getWalkthroughImage(phaseId: string, roomId: string, stepFilename: string): string {
  if (
    stepFilename.startsWith('http://') ||
    stepFilename.startsWith('https://') ||
    stepFilename.startsWith('/')
  ) {
    return stepFilename;
  }

  const phaseMatch = phaseId.match(/\d+/);
  const roomMatch = roomId.match(/\d+/);
  const phaseNum = phaseMatch ? Number(phaseMatch[0]) : 0;
  const roomNum = roomMatch ? Number(roomMatch[0]) : 0;
  const phaseDir = `phase-${String(phaseNum).padStart(2, '0')}`;
  const roomDir = `room-${String(roomNum).padStart(2, '0')}`;

  const normalized = stepFilename.trim().toLowerCase().replace(/_/g, '-');
  const withStepPrefix = normalized.startsWith('step-')
    ? normalized
    : normalized.replace(/^(\d+)/, (m) => `step-${m.padStart(2, '0')}`);

  const key = `/src/assets/walkthrough/hpb/${phaseDir}/${roomDir}/${withStepPrefix}`;
  return (images[key] as string) || '';
}

export function getRoomCoverImage(roomId: number): string {
  const phase = String(Math.floor(roomId / 100)).padStart(2, '0');
  const room = String(roomId % 100).padStart(2, '0');
  return getWalkthroughImage(`phase${phase}`, `room${room}`, 'step-01.webp');
}
