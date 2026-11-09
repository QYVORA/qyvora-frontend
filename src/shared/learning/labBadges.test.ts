import { describe, expect, it } from 'vitest';
import { UNIFIED_LABS } from '@/features/student/data/labs/unified';
import { getLabBadgeAsset, LAB_BADGES } from './labBadges';

describe('official Lab badge registry', () => {
  it('maps every unified Lab to supplied artwork', () => {
    expect(LAB_BADGES).toHaveLength(25);
    expect(UNIFIED_LABS.map((lab) => lab.id).sort()).toEqual(
      LAB_BADGES.map((badge) => badge.id).sort(),
    );
    expect(LAB_BADGES.every((badge) => badge.image.endsWith('.png'))).toBe(true);
  });

  it('uses the single supplied SQL Injection badge for both related Labs', () => {
    expect(getLabBadgeAsset('sql-injection-101')?.image).toBe(getLabBadgeAsset('sqli')?.image);
  });
});
