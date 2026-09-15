/**
 * relatedTools.ts
 * Location: src/features/marketing/data/relatedTools.ts
 *
 * Sibling links for the open-source tool detail pages. Every tool page ends
 * with the same "Keep Reading" block pointing at the other tools, mirroring
 * the blog detail pattern.
 */

import type { TFunction } from 'i18next';
import type { RelatedItem } from '@/shared/components/RelatedContentSection';
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

interface ToolRef {
  path: string;
  titleKey: string;
  descKey: string;
  logo: string;
}

const TOOLS: ToolRef[] = [
  { path: '/anansi', titleKey: 'landing.anansi.title', descKey: 'landing.anansi.description', logo: anansiLogo },
  { path: '/toha3ee', titleKey: 'landing.toha3ee.title', descKey: 'landing.toha3ee.description', logo: toha3eeLogo },
  { path: '/shaka', titleKey: 'landing.shaka.title', descKey: 'landing.shaka.description', logo: shakaLogo },
  { path: '/nzinga', titleKey: 'landing.nzinga.title', descKey: 'landing.nzinga.description', logo: nzingaLogo },
  { path: '/jabari', titleKey: 'landing.jabari.title', descKey: 'landing.jabari.description', logo: jabariLogo },
  { path: '/aksum', titleKey: 'landing.aksum.title', descKey: 'landing.aksum.description', logo: aksumLogo },
  { path: '/sekhmet', titleKey: 'landing.sekhmet.title', descKey: 'landing.sekhmet.description', logo: sekhmetLogo },
  { path: '/mansa', titleKey: 'landing.mansa.title', descKey: 'landing.mansa.description', logo: mansaLogo },
  { path: '/amanirenas', titleKey: 'landing.amanirenas.title', descKey: 'landing.amanirenas.description', logo: amanirenasLogo },
  { path: '/sundiata', titleKey: 'landing.sundiata.title', descKey: 'landing.sundiata.description', logo: sundiataLogo },
  { path: '/timbuktu', titleKey: 'landing.timbuktu.title', descKey: 'landing.timbuktu.description', logo: timbuktuLogo },
  { path: '/kush', titleKey: 'landing.kush.title', descKey: 'landing.kush.description', logo: kushLogo },
  { path: '/imhotep', titleKey: 'landing.imhotep.title', descKey: 'landing.imhotep.description', logo: imhotepLogo },
];

export const getRelatedTools = (t: TFunction, excludePath: string): RelatedItem[] =>
  TOOLS.filter((tool) => tool.path !== excludePath).map((tool) => ({
    to: tool.path,
    title: t(tool.titleKey),
    subtitle: t(tool.descKey),
    badge: t('landing.tools.title'),
    image: tool.logo,
  }));

export interface ToolNeighbor {
  path: string;
  name: string;
  title: string;
  desc: string;
  logo: string;
}

const toolNameFromPath = (path: string): string => path.replace('/', '');

export const getToolNeighbors = (t: TFunction, currentPath: string): { prev?: ToolNeighbor; next?: ToolNeighbor } => {
  const idx = TOOLS.findIndex((tool) => tool.path === currentPath);
  if (idx === -1) return {};

  const toNeighbor = (tool: ToolRef): ToolNeighbor => ({
    path: tool.path,
    name: toolNameFromPath(tool.path),
    title: t(tool.titleKey),
    desc: t(tool.descKey),
    logo: tool.logo,
  });

  return {
    prev: idx > 0 ? toNeighbor(TOOLS[idx - 1]) : undefined,
    next: idx < TOOLS.length - 1 ? toNeighbor(TOOLS[idx + 1]) : undefined,
  };
};
