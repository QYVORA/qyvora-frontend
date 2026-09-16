import { SimulationProvider } from '@/features/student/components/simulations';
import { TerminalWrapper } from '@/shared/components/learning/TerminalWrapper';
import ImmersiveToolShell from '@/shared/components/tools/ImmersiveToolShell';
import SEO from '@/shared/components/SEO';

const TerminalToolPage = () => (
  <>
    <SEO title="Terminal | QYVORA Tools" description="Full-screen terminal for CLI-based exercises and raw command execution." noindex />
    <SimulationProvider>
      <ImmersiveToolShell
        title="Terminal"
        scope="Standalone terminal"
        exitTo="/dashboard"
        exitLabel="Back"
      >
        <div className="h-full w-full">
          <TerminalWrapper
            open
            onOpenChange={() => {}}
            context={{ type: 'dashboard' }}
            mode="raw"
          />
        </div>
      </ImmersiveToolShell>
    </SimulationProvider>
  </>
);

export default TerminalToolPage;
