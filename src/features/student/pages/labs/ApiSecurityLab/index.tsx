import { Braces } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { API_SECURITY_SCENARIOS } from '@/features/student/data/simulations';

const ApiSecurityLab = () => (
  <WebLabPage
    labId="api-security"
    title="API Security"
    accentWord="Lab"
    description="Forge JWTs and pivot through SSRF to break API authorisation. QOSE-M05 — Advanced Web & API Security."
    icon={<Braces className="w-6 h-6" />}
    scenarios={API_SECURITY_SCENARIOS}
    relatedLabId="api-security"
  />
);

export default ApiSecurityLab;
