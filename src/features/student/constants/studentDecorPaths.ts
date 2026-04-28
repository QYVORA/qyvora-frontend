/**
 * Add transparent PNG or WebP under `public/images/student/` using the filenames below.
 * `OptionalDecorImage` hides broken/missing assets — no placeholders needed in repo.
 *
 * Typical size: ~512×512 to 1024×1024, transparent background, soft cel-shaded “game UI” mascot.
 */
export const STUDENT_DECOR = {
  /** Dashboard hub card — bottom-right, friendly overlap ok */
  hubPanelMascot: '/images/student/hub-panel-mascot.png',
  /** Learn hub hero — right side, mid height */
  learnHubMascot: '/images/student/learn-hub-mascot.png',
  /** /bootcamps listing hero */
  bootcampListMascot: '/images/student/bootcamp-list-mascot.png',
  /** Course curriculum header + enroll gate */
  courseCurriculumMascot: '/images/student/course-curriculum-mascot.png',
  /** Wallet balance card — right side */
  walletMascot: '/images/student/wallet-economy-mascot.png',
} as const;
