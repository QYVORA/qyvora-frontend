'use strict';

const noArbitraryColor = require('./rules/no-arbitrary-color.cjs');
const noStatusPalette = require('./rules/no-status-palette.cjs');

module.exports = {
  rules: {
    'no-arbitrary-color': noArbitraryColor,
    'no-status-palette': noStatusPalette,
  },
};