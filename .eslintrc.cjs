const QYVORA_COLOR_EXCEPTIONS = [
  // 1. HpbAvatar illustration files — ~3000 hex values are vector art, not tokens
  'src/shared/components/HpbAvatar.tsx',
  'src/shared/components/hpb/',

  // 2. Terminal / IDE mock colors
  'src/features/marketing/components/landing/LandingSimulationsSection.tsx',
  'src/features/student/pages/tools/TerminalToolPage.tsx',
  'src/shared/components/courses/CodePlayground.tsx',

  // 3. Syntax highlighting (CodeBlock / Ide / IdeBlock)
  'src/shared/components/CodeBlock.tsx',
  'src/shared/components/blog/IdeBlock.tsx',
  'src/features/student/components/tools/Ide.tsx',

  // 4. Brand / social icon colors (ShareProfile)
  'src/shared/components/ShareProfile.tsx',

  // 5. Data-layer semantic color maps
  'src/features/student/constants/labs.ts',
  'src/features/student/constants/bootcampStructure.ts',
  'src/shared/components/diagrams/KillChainDiagram.tsx',
  'src/features/student/components/tools/network/LinkStateIndicator.tsx',
  'src/features/student/components/tools/NetworkBuilder.tsx',
  'src/features/admin/components/cp-analytics/CpAnalytics.tsx',
  'src/features/admin/components/CpAnalytics.tsx',

  // AGENTS.md documented hex exception
  'src/shared/constants/topicMap.ts',
];

// GitHub language-color application (e.g. text-[#00ADD8] on repo cards).
// Except these from the arbitrary-color rule only — their status-palette usage
// is real UI drift and stays flagged for the call-site sweep.
const QYVORA_GITHUB_LANGUAGE_COLOR_PATH = [
  'src/features/marketing/pages/public/JabariPage.tsx',
  'src/features/marketing/pages/public/AksumPage.tsx',
  'src/features/marketing/pages/public/AnansiPage.tsx',
  'src/features/marketing/pages/public/ShakaPage.tsx',
  'src/features/marketing/pages/public/Toha3eePage.tsx',
  'src/features/marketing/pages/public/NzingaPage.tsx',
];

module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  ignorePatterns: ['public/sw.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'qyvora-local'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prefer-const': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'qyvora-local/no-arbitrary-color': [
      'error',
      { allow: [...QYVORA_COLOR_EXCEPTIONS, ...QYVORA_GITHUB_LANGUAGE_COLOR_PATH] },
    ],
    'qyvora-local/no-status-palette': ['error', { allow: QYVORA_COLOR_EXCEPTIONS }],
  },
};