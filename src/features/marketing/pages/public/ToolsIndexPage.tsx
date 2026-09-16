import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import PageHeader from '@/shared/components/ui/PageHeader';
import ScrollReveal from '@/shared/components/ScrollReveal';
import SEO from '@/shared/components/SEO';

import anansiLogo from '@/assets/anansi/anansi-main-logo.webp';
import toha3eeLogo from '@/assets/toha3ee/toha3ee-main-logo.webp';
import jabariLogo from '@/assets/jabari/jabari-main-logo.webp';
import aksumLogo from '@/assets/aksum/aksum-main-logo.webp';
import shakaLogo from '@/assets/shaka/shaka-main-logo.webp';
import nzingaLogo from '@/assets/nzinga/nzinga-main-logo.webp';
import sekhmetLogo from '@/assets/sekhmet/sekhmet-main-logo.webp';
import mansaLogo from '@/assets/mansa/mansa-main-logo.webp';
import amanirenasLogo from '@/assets/amanirenas/amanirenas-main-logo.webp';
import sundiataLogo from '@/assets/sundiata/sundiata-main-logo.webp';
import timbuktuLogo from '@/assets/timbuktu/timbuktu-main-logo.webp';
import kushLogo from '@/assets/kush/kush-main-logo.webp';
import imhotepLogo from '@/assets/imhotep/imhotep-main-logo.webp';

interface ToolEntry {
  path: string;
  name: string;
  logo: string;
  titleKey: string;
  descKey: string;
}

const TOOLS: ToolEntry[] = [
  { path: '/anansi', name: 'anansi', logo: anansiLogo, titleKey: 'landing.anansi.title', descKey: 'landing.anansi.description' },
  { path: '/toha3ee', name: 'toha3ee', logo: toha3eeLogo, titleKey: 'landing.toha3ee.title', descKey: 'landing.toha3ee.description' },
  { path: '/shaka', name: 'shaka', logo: shakaLogo, titleKey: 'landing.shaka.title', descKey: 'landing.shaka.description' },
  { path: '/nzinga', name: 'nzinga', logo: nzingaLogo, titleKey: 'landing.nzinga.title', descKey: 'landing.nzinga.description' },
  { path: '/jabari', name: 'jabari', logo: jabariLogo, titleKey: 'landing.jabari.title', descKey: 'landing.jabari.description' },
  { path: '/aksum', name: 'aksum', logo: aksumLogo, titleKey: 'landing.aksum.title', descKey: 'landing.aksum.description' },
  { path: '/sekhmet', name: 'sekhmet', logo: sekhmetLogo, titleKey: 'landing.sekhmet.title', descKey: 'landing.sekhmet.description' },
  { path: '/mansa', name: 'mansa', logo: mansaLogo, titleKey: 'landing.mansa.title', descKey: 'landing.mansa.description' },
  { path: '/amanirenas', name: 'amanirenas', logo: amanirenasLogo, titleKey: 'landing.amanirenas.title', descKey: 'landing.amanirenas.description' },
  { path: '/sundiata', name: 'sundiata', logo: sundiataLogo, titleKey: 'landing.sundiata.title', descKey: 'landing.sundiata.description' },
  { path: '/timbuktu', name: 'timbuktu', logo: timbuktuLogo, titleKey: 'landing.timbuktu.title', descKey: 'landing.timbuktu.description' },
  { path: '/kush', name: 'kush', logo: kushLogo, titleKey: 'landing.kush.title', descKey: 'landing.kush.description' },
  { path: '/imhotep', name: 'imhotep', logo: imhotepLogo, titleKey: 'landing.imhotep.title', descKey: 'landing.imhotep.description' },
];

/**
 * ToolsIndexPage — calm index of the open-source tool docs. One compact card
 * per tool, whole card links to the documentation page.
 */
const ToolsIndexPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-canvas">
      <SEO
        title={t('toolsIndex.seo.title', 'Tools | QYVORA')}
        description={t('toolsIndex.seo.description', 'Open-source offensive security tools, documented for operators.')}
      />
      <div className="w-full px-3 pb-20 pt-24 md:px-4 md:pb-24 md:pt-28 lg:px-6 lg:pt-32">
        <PageHeader
          kicker={t('toolsIndex.kicker', 'Open-source tooling')}
          title={t('toolsIndex.title', 'Combat-ready tools, documented for operators.')}
          description={t('toolsIndex.description', 'Thirteen offensive security tools built by the QuiteRoot collective. Each tool has full documentation, install guides, and walkthroughs.')}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <ScrollReveal key={tool.path} delay={(i % 3) * 80}>
              <Card to={tool.path} interactive className="flex min-h-[180px] flex-col gap-4 p-6">
                <img
                  src={tool.logo}
                  alt={t(tool.titleKey)}
                  className="h-12 w-12 shrink-0 rounded-lg border border-border-subtle object-contain p-1.5"
                />
                <div className="flex-1">
                  <h3 className="type-h3 font-black uppercase tracking-tight text-text-primary">
                    {t(tool.titleKey)}
                  </h3>
                  <p className="type-body-sm mt-2 line-clamp-3">{t(tool.descKey)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="type-meta text-text-tertiary">{tool.name}</span>
                  <span className="flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-accent">
                    {t('toolsIndex.docs', 'Docs')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsIndexPage;