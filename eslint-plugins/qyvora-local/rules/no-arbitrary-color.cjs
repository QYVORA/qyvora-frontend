'use strict';

const { ARBITRARY_COLOR, allStringChunks, findTokens, isAllowed } = require('./helpers.cjs');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban arbitrary-value color utilities (bg-[#...], text-[rgb(...)], border-[...], shadows with raw rgba) outside documented exception files. Colors must come from the @theme tokens in src/styles/index.css.',
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
      arbitraryColor:
        'Arbitrary color value `{{ token }}` bypasses the @theme tokens in src/styles/index.css. Use token utilities (text-accent, text-text-primary, bg-danger, etc.) or the documented exception paths.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    if (isAllowed(context.getFilename(), options)) return {};

    return {
      Program() {
        for (const { text, line } of allStringChunks(context)) {
          for (const hit of findTokens(text, ARBITRARY_COLOR)) {
            context.report({
              loc: { line, column: 0 },
              messageId: 'arbitraryColor',
              data: { token: hit.matched.trim().replace(/^['"`]+/, '') },
            });
          }
        }
      },
    };
  },
};