import { Network } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { NETWORK_SECURITY_SCENARIOS } from '@/features/student/data/simulations';

const NetworkSecurityLab = () => (
  <WebLabPage
    labId="network-security"
    title="Network Security"
    accentWord="Lab"
    description="Enumerate services and analyse captured traffic across a segmented internal network. QOSE-M06 — Network Security."
    icon={<Network className="w-6 h-6" />}
    scenarios={NETWORK_SECURITY_SCENARIOS}
    relatedLabId="network-security"
  />
);

export default NetworkSecurityLab;
