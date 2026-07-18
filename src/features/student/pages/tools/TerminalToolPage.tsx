import { useEffect } from 'react';
import { SimulationProvider } from '@/features/student/components/simulations';
import { TerminalShell } from '@/features/student/components/SimulatedTerminal/TerminalShell';

const TerminalToolPage = () => {
  useEffect(() => {
    document.title = 'Terminal — QYVORA Tools';
  }, []);

  return (
    <SimulationProvider>
      <div className="h-screen w-screen overflow-hidden bg-[#0c0c0c]">
        <TerminalShell context={{ type: 'dashboard' }} />
      </div>
    </SimulationProvider>
  );
};

export default TerminalToolPage;
