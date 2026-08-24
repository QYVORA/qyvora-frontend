import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
      backLabel={t('student.bootcampRoom.backToCurriculum')}
      mobileOpen={mobileOpen}
      onMobileClose={onMobileClose}
      title={t('student.bootcampRoom.sidebar.roomNavigator')}
      subtitle={t('student.bootcampRoom.sidebar.curriculum')}
    />
  );
};

export default RoomSidebar;
