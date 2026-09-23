// This file is the backwards-compatible public entry point for the QYVORA
// learning Markdown renderer. The implementation lives in the focused
// `markdown/` modules (renderer, sanitisation, tokeniser, normaliser,
// typography, fenced-code, inline-code) so the shared surface can grow without
// a monolithic file.
export { default } from './markdown/CodeBlockRenderer';
export { EducationalMarkdownRenderer, isSafeUrl } from './markdown/CodeBlockRenderer';