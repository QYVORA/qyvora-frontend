import { useCallback, useState, useEffect } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import StudentTopbar from '@/features/student/components/layout/StudentTopbar';
import StudentSidebarRedesigned from '@/features/student/components/layout/StudentSidebarRedesigned';
import UsernameChangeModal from '@/features/student/components/UsernameChangeModal';
import ConsentBanner from '@/shared/components/ConsentBanner';
import { TerminalWrapper } from '@/shared/components/learning/TerminalWrapper';
import { SimulationProvider } from '@/features/student/components/simulations';
import NetworkBuilder from '@/features/student/components/tools/NetworkBuilder';
import PwaStatus from '@/shared/components/layout/PwaStatus';
import { tryAutoSubscribePush } from '@/core/services/pwa';
import { useLearningContext } from '@/core/hooks/useLearningContext';
import type { TerminalContext } from '@/features/student/components/SimulatedTerminal/types';

/**
 * AppShell — the student application shell.
 *
 * Desktop (lg+): persistent left Sidebar + optional topbar.
 * Learning pages (bootcamp rooms, courses, labs): sidebar-only navigation, no topbar.
 * Dashboard pages: sidebar + topbar with breadcrumbs and utilities.
 * Mobile (<lg): topbar with hamburger + full-screen overlay sidebar (no bottom nav).
 *
 * Shell behaviours: SimulationProvider, terminal/IDE/network window-event
 * triggers, Ctrl+` toggle, PWA status host and push subscription.
 */
const AppShell = () => {
  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const courseMatch = useMatch('/dashboard/courses/:courseId');
  const labMatch = useMatch('/dashboard/labs/:labType');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [networkVizOpen, setNetworkVizOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(() => {
    try {
      return localStorage.getItem('qyvora:sidebar-collapsed') === '1';
    } catch {
      return false;
    }
  });

  // Detect if we're on a learning page (bootcamp room, course lesson, lab)
  const learningContext = useLearningContext();
  const isLearningPage = Boolean(learningContext);

  const toggleRail = useCallback(
    () =>
      setRailCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('qyvora:sidebar-collapsed', next ? '1' : '');
        } catch {
          /* storage unavailable */
        }
        return next;
      }),
    [],
  );

  useEffect(() => {
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

  // Sidebar rail is present on all pages
  const useRail = true;
  const railPad = railCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]';
  
  // Learning pages don't have topbar, so no top padding needed
  const topbarPadding = isLearningPage ? '' : 'pt-20 md:pt-24';

  return (
    <SimulationProvider>
      <div className="bg-canvas min-h-dvh">
        {/* Topbar only on dashboard pages, not on learning pages */}
        {!isLearningPage && (
          <StudentTopbar 
            railCollapsed={railCollapsed}
            onMobileMenuOpen={() => setMobileSidebarOpen(true)}
          />
        )}
        
        {useRail && (
          <StudentSidebarRedesigned
            collapsed={railCollapsed}
            onToggleCollapse={toggleRail}
            isMobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
        )}
        <div
          id="main-content"
          className={`${topbarPadding} md:pb-6 ${useRail ? 'transition-[padding-left] duration-[var(--dur-base)] ease-[var(--ease-smooth)]' : ''} ${railPad}`}
        >
          <Outlet />
        </div>
        <ConsentBanner />
        <PwaStatus />
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