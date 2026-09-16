import { SimulationProvider } from '@/features/student/components/simulations';
import NetworkBuilder from '@/features/student/components/tools/NetworkBuilder';
import ImmersiveToolShell from '@/shared/components/tools/ImmersiveToolShell';
import SEO from '@/shared/components/SEO';

const NetworkVizToolPage = () => (
  <>
    <SEO title="Network Visualizer | QYVORA Tools" description="Interactive network topology visualizer for mapping and analyzing network infrastructure." noindex />
    <SimulationProvider>
      <ImmersiveToolShell
        title="Network Visualizer"
        scope="Standalone tool"
        exitTo="/dashboard"
        exitLabel="Back"
      >
        <NetworkBuilder
          open={true}
          onOpenChange={() => window.close()}
          standalone
        />
      </ImmersiveToolShell>
    </SimulationProvider>
  </>
);

export default NetworkVizToolPage;
