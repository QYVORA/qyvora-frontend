'use strict';

const noArbitraryColor = require('./rules/no-arbitrary-color.cjs');
const noStatusPalette = require('./rules/no-status-palette.cjs');
const noLegacyAppStyle = require('./rules/no-legacy-app-style.cjs');

module.exports = {
  rules: {
    'no-arbitrary-color': noArbitraryColor,
    'no-status-palette': noStatusPalette,
    'no-legacy-app-style': noLegacyAppStyle,
  },
};