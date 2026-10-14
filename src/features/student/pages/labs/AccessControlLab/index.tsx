import { KeyRound } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { WEB_ACCESS_CONTROL_SCENARIOS } from '@/features/student/data/simulations';

const AccessControlLab = () => (
  <WebLabPage
    labId="web-access-control"
    title="Broken Access Control"
    accentWord="Lab"
    description="Exploit IDOR and BOLA access-control flaws to read data that belongs to another user. QOSE-M03 — Web Application Security I."
    icon={<KeyRound className="w-6 h-6" />}
    scenarios={WEB_ACCESS_CONTROL_SCENARIOS}
    relatedLabId="web-access-control"
  />
);

export default AccessControlLab;
