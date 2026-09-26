/**
 * Documentation data index.
 *
 * Each tool page is a typed data file. This barrel is the only place that
 * imports them, so a missing or misnamed page fails at build time rather than
 * rendering an empty document.
 */

import type { ToolDoc } from './types';

import aksumDoc from './aksum';
import amanirenasDoc from './amanirenas';
import anansiDoc from './anansi';
import imhotepDoc from './imhotep';
import jabariDoc from './jabari';
import kushDoc from './kush';
import mansaDoc from './mansa';
import nzingaDoc from './nzinga';
import qyvoraCommonDoc from './qyvora-common';
import sekhmetDoc from './sekhmet';
import shakaDoc from './shaka';
import sundiataDoc from './sundiata';
import timbuktuDoc from './timbuktu';
import toha3eeDoc from './toha3ee';

export const TOOL_DOCS: Record<string, ToolDoc> = {
  aksum: aksumDoc,
  amanirenas: amanirenasDoc,
  anansi: anansiDoc,
  imhotep: imhotepDoc,
  jabari: jabariDoc,
  kush: kushDoc,
  mansa: mansaDoc,
  nzinga: nzingaDoc,
  'qyvora-common': qyvoraCommonDoc,
  sekhmet: sekhmetDoc,
  shaka: shakaDoc,
  sundiata: sundiataDoc,
  timbuktu: timbuktuDoc,
  toha3ee: toha3eeDoc,
};

/** The documentation for one tool, or `undefined` when a page is missing. */
export const getToolDoc = (slug: string): ToolDoc | undefined => TOOL_DOCS[slug];

export type { ToolDoc };
