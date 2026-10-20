import { Route } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { ATTACK_PATHS_SCENARIOS } from '@/features/student/data/simulations';

const AttackPathsLab = () => (
  <WebLabPage
    labId="attack-paths"
    title="Enterprise Attack Paths"
    accentWord="Lab"
    description="Roast Kerberos tickets and move laterally along a credential-reuse path to the objective. QOSE-M10 — Active Directory, Part 2."
    icon={<Route className="w-6 h-6" />}
    scenarios={ATTACK_PATHS_SCENARIOS}
    relatedLabId="attack-paths"
  />
);

export default AttackPathsLab;
