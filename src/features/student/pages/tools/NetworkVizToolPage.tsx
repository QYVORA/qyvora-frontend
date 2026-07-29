import { SimulationProvider } from '@/features/student/components/simulations';
import NetworkBuilder from '@/features/student/components/tools/NetworkBuilder';
import SEO from '@/shared/components/SEO';

const NetworkVizToolPage = () => (
  <>
    <SEO title="Network Visualizer — QYVORA Tools" description="Interactive network topology visualizer for mapping and analyzing network infrastructure." noindex />
    <SimulationProvider>
      <NetworkBuilder
        open={true}
        onOpenChange={() => window.close()}
        standalone
      />
    </SimulationProvider>
  </>
);

export default NetworkVizToolPage;
