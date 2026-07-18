import { useEffect } from 'react';
import { SimulationProvider } from '@/features/student/components/simulations';
import NetworkBuilder from '@/features/student/components/tools/NetworkBuilder';

const NetworkVizToolPage = () => {
  useEffect(() => {
    document.title = 'Network Visualizer — QYVORA Tools';
  }, []);

  return (
    <SimulationProvider>
      <NetworkBuilder
        open={true}
        onOpenChange={() => window.close()}
        standalone
      />
    </SimulationProvider>
  );
};

export default NetworkVizToolPage;
