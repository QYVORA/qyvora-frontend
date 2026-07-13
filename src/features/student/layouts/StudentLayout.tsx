import { useState, useEffect } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import StudentTopbar from '@/features/student/components/layout/StudentTopbar';
import InstallBanner from '@/features/student/components/layout/InstallBanner';
import UsernameChangeModal from '@/features/student/components/UsernameChangeModal';
import ConsentBanner from '@/shared/components/ConsentBanner';
import { SimulatedTerminal } from '@/features/student/components/SimulatedTerminal';
import { initPWA, tryAutoSubscribePush } from '@/features/student/services/pwa';

const TOPBAR_H = 'pt-20 md:pt-24';
const MOBILE_NAV_PB = 'pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pb-6';

const StudentLayout = () => {
  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const courseMatch = useMatch('/dashboard/courses/:courseId');
  const isRoomPage = Boolean(roomMatch || roomMatchLegacy || courseMatch);
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    initPWA();
    tryAutoSubscribePush();
  }, []);

  useEffect(() => {
    const handler = () => setTerminalOpen(true);
    window.addEventListener('qyvora:open-terminal', handler);
    return () => window.removeEventListener('qyvora:open-terminal', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="bg-bg min-h-screen">
      <StudentTopbar />
      <div id="main-content" className={`${TOPBAR_H} ${isRoomPage ? '' : MOBILE_NAV_PB}`}>
        <Outlet />
      </div>
      <ConsentBanner />
      <InstallBanner />
      <UsernameChangeModal />

      <SimulatedTerminal
        open={terminalOpen}
        onOpenChange={setTerminalOpen}
        context={{ type: 'dashboard' }}
        mode="modal"
      />
    </div>
  );
};

export default StudentLayout;
