import { useEffect, useState } from 'react';
import { useAuth } from '@/core/contexts/AuthContext';
import { credentialProgram, getUserCredentials } from '@/core/services/credentials';
import CertificateClaimCard from '@/shared/components/certificates/CertificateClaimCard';

/**
 * CertificateClaimBanner — dashboard notice for legacy bootcamp completers who
 * finished the Hacker Protocol Bootcamp before credentials were issued.
 *
 * Shown only when the learner is marked as bootcamp-completed AND does not yet
 * hold an HPB credential. Renders nothing while loading or on failure so the
 * dashboard never flashes a claim prompt for a learner who already has their
 * certificate. Links to the certificates page, which performs the idempotent
 * backfill claim — this banner never issues a credential itself.
 */
const CertificateClaimBanner: React.FC = () => {
  const { user } = useAuth();
  const [eligible, setEligible] = useState(false);

  useEffect(() => {
    if (user?.bootcampStatus !== 'completed' || !user?.uid) {
      setEligible(false);
      return;
    }

    let mounted = true;
    getUserCredentials(user.uid)
      .then((list) => {
        if (!mounted) return;
        setEligible(!list.some((c) => credentialProgram(c.programName) === 'HPB'));
      })
      .catch(() => {
        if (mounted) setEligible(false);
      });

    return () => {
      mounted = false;
    };
  }, [user?.uid, user?.bootcampStatus]);

  if (!eligible) return null;

  return <CertificateClaimCard to="/dashboard/certificates" />;
};

export default CertificateClaimBanner;
