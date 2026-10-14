import { Terminal } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { AUTOMATION_SCENARIOS } from '@/features/student/data/simulations';

const AutomationLab = () => (
  <WebLabPage
    labId="automation"
    title="Security Automation"
    accentWord="Lab"
    description="Build a Python port scanner and a Bash HTTP enumerator, then run them. QOSE-M11 — Offensive Security Automation."
    icon={<Terminal className="w-6 h-6" />}
    scenarios={AUTOMATION_SCENARIOS}
    relatedLabId="automation"
  />
);

export default AutomationLab;
