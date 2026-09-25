import { useState, useEffect } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import StudentTopbar from '@/features/student/components/layout/StudentTopbar';
import StudentSidebar from '@/features/student/components/layout/StudentSidebar';
import StudentBottomNav from '@/features/student/components/layout/StudentBottomNav';
import InstallBanner from '@/features/student/components/layout/InstallBanner';
import UsernameChangeModal from '@/features/student/components/UsernameChangeModal';
import ConsentBanner from '@/shared/components/ConsentBanner';
import { TerminalWrapper } from '@/shared/components/learning/TerminalWrapper';
import { SimulationProvider } from '@/features/student/components/simulations';
import NetworkBuilder from '@/features/student/components/tools/NetworkBuilder';
import { initPWA, tryAutoSubscribePush } from '@/features/student/services/pwa';
import type { TerminalContext } from '@/features/student/components/SimulatedTerminal/types';

const TOPBAR_H = 'pt-20 md:pt-24';

/**
 * AppShell — the student application shell (non-walkthrough pages).
 *
 * Desktop (lg+): persistent left Sidebar + fixed topbar for utilities/breadcrumbs.
 * Mobile: compact topbar + fixed bottom navigation (Home · Learn · Practice ·
 * Progress · Profile). Walkthrough routes (rooms, courses, labs) keep the full
 * shell — the sidebar rail is the single dashboard navigation.
 *
 * Shell behaviours: SimulationProvider, terminal/IDE/network window-event
 * triggers, Ctrl+` toggle and PWA init.
 */
const AppShell = () => {
  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const courseMatch = useMatch('/dashboard/courses/:courseId');
  const labMatch = useMatch('/dashboard/labs/:labType');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [networkVizOpen, setNetworkVizOpen] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(() => {
    try {
      return localStorage.getItem('qyvora:sidebar-collapsed') === '1';
    } catch {
      return false;
    }
  });

  const toggleRail = () =>
    setRailCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('qyvora:sidebar-collapsed', next ? '1' : '');
      } catch {
        /* storage unavailable */
      }
      return next;
    });

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
    const handler = () => setNetworkVizOpen(true);
    window.addEventListener('qyvora:open-network-visualizer', handler);
    return () => window.removeEventListener('qyvora:open-network-visualizer', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const terminalContext: TerminalContext = roomMatch
    ? { type: 'bootcamp', bootcampId: roomMatch.params.bootcampId, phaseId: roomMatch.params.phaseId, roomId: roomMatch.params.roomId }
    : roomMatchLegacy
    ? { type: 'bootcamp', bootcampId: roomMatchLegacy.params.bootcampId, phaseId: `phase${roomMatchLegacy.params.moduleId}`, roomId: roomMatchLegacy.params.roomId }
    : courseMatch
    ? { type: 'course', courseId: courseMatch.params.courseId }
    : labMatch
    ? { type: 'lab', labId: String(labMatch.params.labType || '') }
    : { type: 'dashboard' };

  // Walkthrough pages (rooms, courses, labs) keep the full shell — the
  // sidebar rail is the single navigation component on every dashboard page.
  const useRail = true;
  const railPad = railCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]';

  return (
    <SimulationProvider>
      <div className="bg-canvas min-h-dvh">
        <StudentTopbar railCollapsed={railCollapsed} />
        {useRail && <StudentSidebar collapsed={railCollapsed} onToggleCollapse={toggleRail} />}
        <div
          id="main-content"
          className={`${TOPBAR_H} md:pb-6 ${useRail ? 'transition-[padding-left] duration-[var(--dur-base)] ease-[var(--ease-smooth)]' : ''} ${railPad}`}
        >
          <Outlet />
        </div>
        {useRail && <StudentBottomNav />}
        <ConsentBanner />
        <InstallBanner />
        <UsernameChangeModal />

        {/* Full terminal modal — for standalone terminal access */}
        <TerminalWrapper
          open={terminalOpen}
          onOpenChange={setTerminalOpen}
          context={terminalContext}
          mode="modal"
        />

        <NetworkBuilder open={networkVizOpen} onOpenChange={setNetworkVizOpen} />
      </div>
    </SimulationProvider>
  );
};

export default AppShell;