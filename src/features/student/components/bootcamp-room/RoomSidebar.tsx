import { WalkthroughSidebar } from '@/shared/components/walkthrough/WalkthroughSidebar';
import type { BootcampPhase } from '../../constants/bootcampConfig';

interface Props {
  phases: BootcampPhase[];
  activePhaseId: string;
  activeRoomId: string;
  completedRooms: Set<string>;
  lockedRooms: Set<string>;
  bootcampId: string;
  onNavigate: (phaseId: string, roomId: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const RoomSidebar: React.FC<Props> = ({
  phases, activePhaseId, activeRoomId,
  completedRooms, lockedRooms, bootcampId,
  onNavigate, mobileOpen, onMobileClose,
}) => {

  const sections = phases.map((phase) => ({
    label: `${phase.codename} | ${phase.title}`,
    items: phase.rooms.map((room) => {
      const key = `${phase.id}:${room.id}`;
      return {
        id: key,
        title: room.title,
        isActive: phase.id === activePhaseId && room.id === activeRoomId,
        isCompleted: completedRooms.has(key),
        isLocked: lockedRooms.has(key),
        onClick: () => onNavigate(phase.id, room.id),
      };
    }),
  }));

  return (
    <WalkthroughSidebar
      sections={sections}
      backHref={`/dashboard/bootcamps/${bootcampId}`}
      backLabel={"Back to Curriculum"}
      mobileOpen={mobileOpen}
      onMobileClose={onMobileClose}
      title={"Room Navigator"}
      subtitle={"Curriculum"}
    />
  );
};

export default RoomSidebar;
