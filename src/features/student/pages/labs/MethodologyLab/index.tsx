import { Scale } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { METHODOLOGY_SCENARIOS } from '@/features/student/data/simulations';

const MethodologyLab = () => (
  <WebLabPage
    labId="methodology"
    title="Engagement Methodology"
    accentWord="Lab"
    description="Verify scope authorization and build an attack-surface map the way a real assessment demands. QOSE-M01 — Offensive Security Methodology."
    icon={<Scale className="w-6 h-6" />}
    scenarios={METHODOLOGY_SCENARIOS}
    relatedLabId="methodology"
  />
);

export default MethodologyLab;
