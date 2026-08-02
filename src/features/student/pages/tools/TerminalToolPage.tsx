import { SimulationProvider } from '@/features/student/components/simulations';
import { TerminalWrapper } from '@/shared/components/learning/TerminalWrapper';
import SEO from '@/shared/components/SEO';

const TerminalToolPage = () => (
  <>
    <SEO title="Terminal — QYVORA Tools" description="Full-screen terminal for CLI-based exercises and raw command execution." noindex />
    <SimulationProvider>
      <div className="h-dvh w-full overflow-hidden bg-[#0c0c0c]">
        <TerminalWrapper
          open
          onOpenChange={() => {}}
          context={{ type: 'dashboard' }}
          mode="raw"
        />
      </div>
    </SimulationProvider>
  </>
);

export default TerminalToolPage;
