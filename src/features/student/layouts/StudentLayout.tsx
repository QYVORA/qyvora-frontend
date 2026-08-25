import { useState, useEffect } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import StudentTopbar from '@/features/student/components/layout/StudentTopbar';
import InstallBanner from '@/features/student/components/layout/InstallBanner';
import UsernameChangeModal from '@/features/student/components/UsernameChangeModal';
import ConsentBanner from '@/shared/components/ConsentBanner';
import { TerminalWrapper } from '@/shared/components/learning/TerminalWrapper';
import { InternalTerminal } from '@/shared/components/walkthrough/InternalTerminal';
import { SimulationProvider } from '@/features/student/components/simulations';
import Ide from '@/features/student/components/tools/Ide';
import NetworkBuilder from '@/features/student/components/tools/NetworkBuilder';
import WalkthroughToolbar from '@/features/student/components/layout/WalkthroughToolbar';
import { initPWA, tryAutoSubscribePush } from '@/features/student/services/pwa';
import type { TerminalContext } from '@/features/student/components/SimulatedTerminal/types';
import type { IdeFile } from '@/features/student/components/tools/Ide';

const TOPBAR_H = 'pt-20 md:pt-24';

const StudentLayout = () => {
  const roomMatch = useMatch('/dashboard/bootcamps/:bootcampId/phases/:phaseId/rooms/:roomId');
  const roomMatchLegacy = useMatch('/dashboard/bootcamps/:bootcampId/modules/:moduleId/rooms/:roomId');
  const courseMatch = useMatch('/dashboard/courses/:courseId');
  const labMatch = useMatch('/dashboard/labs/:labType');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [ideOpen, setIdeOpen] = useState(false);
  const [networkVizOpen, setNetworkVizOpen] = useState(false);
  const [walkthroughTerminalOpen, setWalkthroughTerminalOpen] = useState(false);

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
    const handler = () => setWalkthroughTerminalOpen(true);
    window.addEventListener('qyvora:open-walkthrough-terminal', handler);
    return () => window.removeEventListener('qyvora:open-walkthrough-terminal', handler);
  }, []);

  useEffect(() => {
    const handler = () => setIdeOpen(true);
    window.addEventListener('qyvora:open-ide', handler);
    return () => window.removeEventListener('qyvora:open-ide', handler);
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
        setTerminalOpen(prev => !prev);
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

  // Determine if we're on a walkthrough page (rooms, courses, labs)
  const isWalkthroughPage = Boolean(roomMatch || roomMatchLegacy || courseMatch || labMatch);

  return (
    <SimulationProvider>
      <div className="bg-bg min-h-screen">
        <StudentTopbar />
        <div id="main-content" className={`${TOPBAR_H} md:pb-6`}>
          <Outlet />
        </div>
        <ConsentBanner />
        <InstallBanner />
        <UsernameChangeModal />

        {/* Walkthrough Toolbar — for courses/labs/bootcamp rooms */}
        {isWalkthroughPage && (
          <WalkthroughToolbar
            onOpenTerminal={() => setWalkthroughTerminalOpen(true)}
            onOpenIDE={() => setIdeOpen(true)}
            onOpenNetworkVisualizer={() => setNetworkVizOpen(true)}
            showTerminal={true}
            showIDE={Boolean(courseMatch)} // Only show IDE on course pages
            showNetworkVisualizer={false} // Can enable based on specific lessons
          />
        )}

        {/* Compact walkthrough terminal — for all walkthrough pages (desktop dock / mobile sheet) */}
        {isWalkthroughPage && (
          <InternalTerminal
            open={walkthroughTerminalOpen}
            onOpenChange={setWalkthroughTerminalOpen}
            context={terminalContext}
          />
        )}

        {/* Full terminal modal — for standalone terminal access */}
        <TerminalWrapper
          open={terminalOpen}
          onOpenChange={setTerminalOpen}
          context={terminalContext}
          mode="modal"
        />

        <Ide
          open={ideOpen}
          onOpenChange={setIdeOpen}
          title="Code Playground"
          terminalContext={terminalContext}
          files={[
            { id: 'main', name: 'main.py', language: 'python', content: 'print("Hello, World!")' },
            { id: 'script', name: 'script.sh', language: 'bash', content: 'echo "Hello from bash"' },
          ]}
        />

        <NetworkBuilder
          open={networkVizOpen}
          onOpenChange={setNetworkVizOpen}
        />
      </div>
    </SimulationProvider>
  );
};

export default StudentLayout;
