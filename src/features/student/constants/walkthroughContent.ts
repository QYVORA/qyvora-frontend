/**
 * DEPRECATED — walkthroughContent.ts
 *
 * All walkthrough content has been migrated to bootcampConfig.ts.
 * This file is kept only to avoid breaking any residual imports.
 * Do NOT add new content here.
 *
 * Use BOOTCAMP_CONFIG from bootcampConfig.ts instead.
 */

export interface WalkthroughStep {
  instruction: string;
  image: string;
}

export interface RoomWalkthrough {
  walkthroughText: string;
  steps: WalkthroughStep[];
}

/** @deprecated Use buildStepImagePath from bootcampConfig.ts */
export function buildWalkthroughImagePath(
  _moduleId: string | number,
  _roomId: string | number,
  _image: string
): string {
  return '';
}

/** @deprecated Use BOOTCAMP_CONFIG from bootcampConfig.ts */
export const ROOM_WALKTHROUGHS: Record<string, RoomWalkthrough> = {};
