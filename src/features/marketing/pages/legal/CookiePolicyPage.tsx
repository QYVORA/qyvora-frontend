import React from 'react';
import SEO from '@/shared/components/SEO';
import CookiePreferencesButton from '@/shared/components/ui/CookiePreferencesButton';
import LegalDocumentPage from './LegalDocumentPage';
import { cookiePolicy } from './content/cookiePolicy';

const CookiePolicyPage: React.FC = () => (
  <>
    <SEO
      title="Cookie Policy | QYVORA"
      description="The cookies and browser storage QYVORA uses, why we use them, and how you can change your choices at any time."
      breadcrumbName="Cookie Policy"
    />
    <LegalDocumentPage
      doc={cookiePolicy}
      actions={<CookiePreferencesButton />}
      related={[
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
      ]}
    />
  </>
);

export default CookiePolicyPage;
