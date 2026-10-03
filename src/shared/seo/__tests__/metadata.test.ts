import { describe, it, expect } from 'vitest';
import { canonicalUrl, pageTitle } from '../metadata';
import { SITE_NAME, SITE_URL } from '../schema';

const HOME_TITLE = `${SITE_NAME} | Africa's Offensive Security Platform`;

describe('pageTitle', () => {
  it('falls back to the homepage title when no title is given', () => {
    expect(pageTitle()).toBe(HOME_TITLE);
    expect(pageTitle('')).toBe(HOME_TITLE);
  });

  it('appends the brand to a bare page title', () => {
    expect(pageTitle('Learn')).toBe(`Learn | ${SITE_NAME}`);
  });

  it('is idempotent for titles that already carry the brand', () => {
    // Several marketing pages reuse one string for both the visible heading and
    // the <SEO> prop, so it arrives pre-suffixed. Re-suffixing would render
    // "Learn | QYVORA | QYVORA".
    expect(pageTitle('Learn | QYVORA')).toBe(`Learn | ${SITE_NAME}`);
    expect(pageTitle('Services - QYVORA')).toBe(`Services | ${SITE_NAME}`);
    expect(pageTitle('Zero Day Market — QYVORA')).toBe(`Zero Day Market | ${SITE_NAME}`);
  });

  it('is stable when applied twice', () => {
    for (const raw of ['Learn', 'Learn | QYVORA', 'Tools | QYVORA', 'Blogs - QYVORA']) {
      expect(pageTitle(pageTitle(raw))).toBe(pageTitle(raw));
    }
  });

  it('treats a brand-only title as the homepage title', () => {
    expect(pageTitle(SITE_NAME)).toBe(HOME_TITLE);
    expect(pageTitle('QYVORA |')).toBe(HOME_TITLE);
  });

  it('does not strip a trailing word that merely starts with the brand', () => {
    expect(pageTitle('Terminal | QYVORA Tools')).toBe(`Terminal | QYVORA Tools | ${SITE_NAME}`);
  });
});

describe('canonicalUrl', () => {
  it('builds absolute URLs on the canonical origin', () => {
    expect(canonicalUrl('/')).toBe(`${SITE_URL}/`);
    expect(canonicalUrl('/anansi')).toBe(`${SITE_URL}/anansi`);
  });

  it('normalises paths without a leading slash', () => {
    expect(canonicalUrl('learn')).toBe(`${SITE_URL}/learn`);
  });

  it('collapses trailing slashes so each route has one canonical form', () => {
    expect(canonicalUrl('/leaderboard/')).toBe(`${SITE_URL}/leaderboard`);
    expect(canonicalUrl('/leaderboard/all//')).toBe(`${SITE_URL}/leaderboard/all`);
  });

  it('keeps the root slash intact', () => {
    expect(canonicalUrl('/')).toBe(`${SITE_URL}/`);
  });

  it('passes absolute URLs through untouched', () => {
    expect(canonicalUrl('https://qyvora.org/anansi')).toBe('https://qyvora.org/anansi');
  });
});