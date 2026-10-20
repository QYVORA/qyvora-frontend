import { FolderTree } from 'lucide-react';
import WebLabPage from '../WebLabPage';
import { AD_ENUM_SCENARIOS } from '@/features/student/data/simulations';

const AdEnumLab = () => (
  <WebLabPage
    labId="ad-enum"
    title="AD Enumeration"
    accentWord="Lab"
    description="Map a Windows domain over LDAP and chart attack paths with BloodHound. QOSE-M09 — Active Directory, Part 1."
    icon={<FolderTree className="w-6 h-6" />}
    scenarios={AD_ENUM_SCENARIOS}
    relatedLabId="ad-enum"
  />
);

export default AdEnumLab;
