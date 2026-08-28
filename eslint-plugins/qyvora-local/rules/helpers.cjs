'use strict';

/**
 * Shared helpers for the qyvora-local ESLint rules.
 *
 * The rules scan string literals / template-literal static chunks for the
 * flagged class tokens, and honor an allowlist of exception file paths
 * passed through rule options (`allow` array of path substrings that are
 * matched against the file path relative to the workspace root).
 */

const COLOR_PREFIXES =
  'bg|text|border|fill|stroke|ring|divide|from|via|to|caret|accent|decoration|outline|shadow|placeholder|selection|file';

// Arbitrary-value COLOR utilities only (e.g. bg-[#0a0a0a], text-[rgb(1,2,3)],
// shadow-[0_0_0_rgba(0,0,0,0.2)]). Size/spacing arbitrary values (e.g. text-[10px])
// are intentionally NOT matched — deferred until token names exist (Phase 3).
const ARBITRARY_COLOR = new RegExp(
  `(?:^|[\\s\\r\\n'"\`])` +
    `((?:[a-z]+:)*` +
    `(?:${COLOR_PREFIXES})` +
    `-\\[([^\\]\\s]*?)` +
    `(#[0-9a-fA-F]{3,8}|(?:rgba|rgb|hsla|hsl)\\([^\\]]*)\\)?)`,
  'g',
);

// Tailwind palette classes carrying status/difficulty semantics.
const STATUS_PALETTE = new RegExp(
  '\\b(?:[a-z]+:)*' +
    `(?:(?:text|bg|border|fill|stroke|ring|from|via|to|decoration|accent|shadow|outline)-(?:red|green|yellow|blue|sky|amber)-400` +
    `|(?:text|bg|border|fill|stroke|ring|from|via|to|decoration|accent|shadow|outline)-emerald-[0-9]{2,3}` +
    `|(?:red|green|yellow|blue|sky|amber)-400)` +
    `(?:\\/[^\\]\\s]+)?\\b`,
  'g',
);

function normalize(p) {
  return String(p || '').replace(/\\/g, '/');
}

/** File path relative to the workspace root (for matching allow substrings). */
function relPath(filename) {
  const norm = normalize(filename);
  const cwd = normalize(process.cwd());
  if (norm.startsWith(cwd + '/')) return norm.slice(cwd.length + 1);
  return norm;
}

function isAllowed(filename, options) {
  const allow = (options && options.allow) || [];
  if (!Array.isArray(allow) || allow.length === 0) return false;
  const rel = relPath(filename);
  return allow.some((p) => rel === p || rel.includes(p));
}

/** Yields { text, lineStart } for every static string inside a viewer file. */
function* stringChunks(context) {
  const sourceCode = context.getSourceCode();
  for (const token of sourceCode.ast.tokens) {
    // String literals AND JSX attribute values. The TS/JSX parser emits
    // className="..." values as 'JSXText' tokens (value includes the quotes),
    // not 'String' — skipping them would leave every JSX className unscanned.
    const isJsxText = token.type === 'JSXText';
    if (token.type !== 'String' && !isJsxText) continue;
    let raw = token.value;
    if (isJsxText) {
      raw = raw.replace(/^["']/, '').replace(/["']$/, '');
    }
    if (!raw || raw.length < 3) continue;
    yield { text: raw, line: token.loc.start.line };
  }
}

function* templateChunks(context) {
  const sourceCode = context.getSourceCode();
  const stack = [sourceCode.ast.body];
  const isNode = (v) => v && typeof v === 'object' && typeof v.type === 'string';
  while (stack.length > 0) {
    const nodes = stack.pop();
    for (const node of nodes) {
      if (!isNode(node)) continue;
      if (node.type === 'TemplateLiteral') {
        for (const quasi of node.quasis) {
          const text =
            quasi.value.cooked == null ? quasi.value.raw : quasi.value.cooked;
          if (text && text.length >= 3) {
            yield { text, line: quasi.loc.start.line };
          }
        }
      }
      if (node.type !== 'Literal') {
        for (const key of Object.keys(node)) {
          if (key === 'parent' || key === 'range' || key === 'loc') continue;
          const value = node[key];
          if (Array.isArray(value)) stack.push(value);
          else if (isNode(value)) stack.push([value]);
        }
      }
    }
  }
}

function* allStringChunks(context) {
  yield* stringChunks(context);
  yield* templateChunks(context);
}

function findTokens(text, re) {
  const hits = [];
  if (typeof text !== 'string') return hits;
  re.lastIndex = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    hits.push({ start: m.index, end: m.index + m[0].length, matched: m[0] });
  }
  return hits;
}

module.exports = {
  ARBITRARY_COLOR,
  STATUS_PALETTE,
  allStringChunks,
  findTokens,
  isAllowed,
};