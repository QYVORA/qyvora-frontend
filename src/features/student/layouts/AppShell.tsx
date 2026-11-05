import { useCallback, useState, useEffect } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import StudentDesktopTopbar from '@/features/student/components/layout/StudentDesktopTopbar';
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
 * Desktop (lg+): Horizontal topbar navigation (TryHackMe-style)
 * - All pages show the horizontal topbar with primary navigation
 * - No left sidebar on desktop
 * - Full-width content area
 * 
 * Mobile (<lg): Topbar with hamburger + full-screen overlay sidebar
 * - Hamburger menu opens full-screen mobile sidebar
 * - Sidebar has collapsible sections for Practice, Compete, Develop
 * 
 * Learning pages (bootcamp rooms, courses, labs): 
 * - Desktop: horizontal topbar navigation
 * - Mobile: sidebar-only navigation (no topbar)
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

  // Detect if we're on a learning page (bootcamp room, course lesson, lab)
  const learningContext = useLearningContext();
  const isLearningPage = Boolean(learningContext);

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

  // All pages have topbar on desktop (lg+), mobile has hamburger that opens sidebar
  // Desktop: no sidebar, horizontal topbar navigation
  // Mobile: overlay sidebar, topbar with hamburger (except on learning pages where sidebar is primary)
  const topbarPadding = 'pt-20 md:pt-24';

  return (
    <SimulationProvider>
      <div className="bg-canvas min-h-dvh">
        {/* Desktop Topbar - Always visible on desktop (lg+), hidden on mobile learning pages */}
        <div className={isLearningPage ? 'hidden lg:block' : ''}>
          <StudentDesktopTopbar onMobileMenuOpen={() => setMobileSidebarOpen(true)} />
        </div>
        
        {/* Mobile Sidebar - Only visible when open on mobile (<lg) */}
        <StudentSidebarRedesigned
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        
        <div
          id="main-content"
          className={topbarPadding}
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