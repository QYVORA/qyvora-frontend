import { Wifi } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { WIRELESS_SCENARIOS } from '@/features/student/data/simulations';

const WlanSecurityLab = () => (
  <WebLabPage
    labId="wlan-security"
    title="Wireless Security"
    accentWord="Lab"
    description="Discover access points, assess WLAN configuration, and capture handshakes inside the controlled lab. QOSE-M08 — Wireless Security."
    icon={<Wifi className="w-6 h-6" />}
    scenarios={WIRELESS_SCENARIOS}
    relatedLabId="wlan-security"
  />
);

export default WlanSecurityLab;
