import { useEffect } from 'react';
import { SimulationProvider } from '@/features/student/components/simulations';
import { TerminalWrapper } from '@/shared/components/learning/TerminalWrapper';

const TerminalToolPage = () => {
  useEffect(() => {
    document.title = 'Terminal — QYVORA Tools';
  }, []);

  return (
    <SimulationProvider>
      <div className="h-dvh w-screen overflow-hidden bg-[#0c0c0c]">
        <TerminalWrapper
          open
          onOpenChange={() => {}}
          context={{ type: 'dashboard' }}
          mode="raw"
        />
      </div>
    </SimulationProvider>
  );
};

export default TerminalToolPage;
