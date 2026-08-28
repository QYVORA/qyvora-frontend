'use strict';

const { STATUS_PALETTE, allStringChunks, findTokens, isAllowed } = require('./helpers.cjs');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban raw Tailwind palette classes used for status/difficulty semantics (red-400, green-400, yellow-400, blue-400, sky-400, amber-400, emerald-*) outside documented exception paths. Use the semantic tokens instead (text-danger, text-success, text-warning, text-info, text-difficulty-*).',
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
      paletteColor:
        'Palette class `{{ token }}` bypasses the semantic status/difficulty tokens. Use text-danger / text-success / text-warning / text-info / text-difficulty-* (from --color-* in src/styles/index.css).',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    if (isAllowed(context.getFilename(), options)) return {};

    return {
      Program() {
        for (const { text, line } of allStringChunks(context)) {
          for (const hit of findTokens(text, STATUS_PALETTE)) {
            context.report({
              loc: { line, column: 0 },
              messageId: 'paletteColor',
              data: { token: hit.matched.trim() },
            });
          }
        }
      },
    };
  },
};