'use strict';

const { allStringChunks, findTokens } = require('./helpers.cjs');

/**
 * Files migrated to the App UI System v2. The rule only guards these so the
 * legacy public site and not-yet-migrated student screens can be swept in
 * later without a repo-wide failure.
 */
const TARGET_FILES = [
  'src/features/admin/layouts/AdminLayout.tsx',
  'src/features/marketing/pages/PublicProfilePage.tsx',
  'src/features/student/components/StudentSkeletons.tsx',
  'src/features/student/components/dashboard/DashboardHero.tsx',
  'src/features/student/components/dashboard/MyLearningCard.tsx',
  'src/features/student/components/dashboard/NewLabsCard.tsx',
  'src/features/student/components/dashboard/TopOperatorsCard.tsx',
  'src/features/student/components/dashboard/WeekActivity.tsx',
  'src/features/student/components/dashboard/WeeklyMissionCard.tsx',
  'src/features/student/components/dashboard/YourStatsCard.tsx',
  'src/features/student/components/layout/StudentDesktopTopbar.tsx',
  'src/features/student/components/layout/StudentSidebar.tsx',
  'src/features/student/components/layout/StudentSidebarRedesigned.tsx',
  'src/features/student/layouts/AppShell.tsx',
  'src/features/student/pages/BootcampRoomPage/index.tsx',
  'src/features/student/pages/CourseLessonPage/index.tsx',
  'src/features/student/pages/ProfilePage.tsx',
  'src/features/student/pages/SettingsPage.tsx',
  'src/features/student/pages/UiKitPage.tsx',
  'src/shared/components/layout/PageBody.tsx',
  'src/shared/components/learning/LearningAccordion.tsx',
  'src/shared/components/learning/LearningCard.tsx',
  'src/shared/components/learning/LearningCatalogue.tsx',
  'src/shared/components/learning/LearningCurriculumTree.tsx',
  'src/shared/components/learning/LearningFilterStrip.tsx',
  'src/shared/components/learning/LearningTaskAccordion.tsx',
  'src/shared/components/learning/LearningWorkspaceShell.tsx',
  'src/shared/components/learning/StepNumberHeader.tsx',
  'src/shared/components/profile/AchievementDetails.tsx',
  'src/shared/components/profile/AchievementsSection.tsx',
  'src/shared/components/profile/ActivityTimeline.tsx',
  'src/shared/components/profile/CertificatesModule.tsx',
  'src/shared/components/profile/ContributionCalendar.tsx',
  'src/shared/components/profile/CoursesModule.tsx',
  'src/shared/components/profile/GithubConnectionCard.tsx',
  'src/shared/components/profile/LabsModule.tsx',
  'src/shared/components/profile/ModuleHeader.tsx',
  'src/shared/components/profile/PortfolioLink.tsx',
  'src/shared/components/profile/ProfileCPBalance.tsx',
  'src/shared/components/profile/ProfileEmptyState.tsx',
  'src/shared/components/profile/ProfileIdentityBlock.tsx',
  'src/shared/components/profile/ProfileMetricsStrip.tsx',
  'src/shared/components/profile/ProfileRank.tsx',
  'src/shared/components/profile/ProfileVisibilityControls.tsx',
  'src/shared/components/profile/RankInsignia.tsx',
  'src/shared/components/profile/SocialAccountConnection.tsx',
  'src/shared/components/profile/SocialLinks.tsx',
  'src/shared/components/profile/TrophyCabinet.tsx',
  'src/shared/components/ui/Avatar.tsx',
  'src/shared/components/ui/Badge.tsx',
  'src/shared/components/ui/Breadcrumb.tsx',
  'src/shared/components/ui/Button.tsx',
  'src/shared/components/ui/Card.tsx',
  'src/shared/components/ui/Field.tsx',
  'src/shared/components/ui/Input.tsx',
  'src/shared/components/ui/Menu.tsx',
  'src/shared/components/ui/OptionTile.tsx',
  'src/shared/components/ui/Progress.tsx',
  'src/shared/components/ui/RuleHeading.tsx',
  'src/shared/components/ui/SectionCard.tsx',
  'src/shared/components/ui/SegmentedTabs.tsx',
  'src/shared/components/ui/Select.tsx',
  'src/shared/components/ui/StatStrip.tsx',
  'src/shared/components/ui/Switch.tsx',
  'src/shared/components/ui/Textarea.tsx',
  'src/shared/components/ui/Toggle.tsx',
  'src/shared/components/ui/UnderlineTabs.tsx',
  'src/shared/components/walkthrough/StepParts.tsx',
  'src/shared/components/walkthrough/WalkthroughLayout.tsx',
  'src/shared/components/walkthrough/WalkthroughStep.tsx',
  'src/shared/learning/components/CardDeckSurface.tsx',
];

const LEGACY_STYLE = /\b(?:font-display|font-black|tracking-widest|shadow-lg|shadow-2xl|rounded-3xl)\b/g;

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban legacy display type and heavy chrome in files migrated to App UI System v2: no font-display, font-black, tracking-widest, shadow-lg/shadow-2xl or rounded-3xl. Use the scoped app tokens and primitives instead.',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      legacyStyle:
        'Legacy App UI v1 class `{{ token }}` in a migrated file. Use the v2 type scale and flat surfaces (see docs/APP-UI-SYSTEM.md).',
    },
  },

  create(context) {
    const rel = context.getFilename().replace(/\\/g, '/');
    if (!TARGET_FILES.some((file) => rel.endsWith(file))) return {};

    const options = context.options[0] || {};
    const allow = Array.isArray(options.allow) ? options.allow : [];
    if (allow.some((p) => rel.endsWith(p))) return {};

    return {
      Program() {
        for (const { text, line } of allStringChunks(context)) {
          for (const hit of findTokens(text, LEGACY_STYLE)) {
            context.report({
              loc: { line, column: 0 },
              messageId: 'legacyStyle',
              data: { token: hit.matched.trim() },
            });
          }
        }
      },
    };
  },
};
