/**
 * Content model for the tool documentation pages.
 *
 * Every doc page is a plain data structure: an ordered list of sections, each
 * holding a list of typed blocks. `ToolDocView` renders the blocks, so all 14
 * tool pages share one presentation path and stay visually consistent.
 *
 * Blocks are deliberately document primitives — prose, code, commands, tables,
 * lists, notes. There are no decorative "card" blocks: docs pages read as a
 * document, not as a landing page.
 */

export type DocCodeLang = 'go' | 'sh' | 'json' | 'text';

export interface DocProseBlock {
  kind: 'prose';
  text: string;
}

export interface DocSubheadingBlock {
  kind: 'subheading';
  text: string;
}

/** Source snippet. `path` is repo-relative and drives the "view on GitHub" link. */
export interface DocCodeBlock {
  kind: 'code';
  code: string;
  lang?: DocCodeLang;
  filename?: string;
  path?: string;
  caption?: string;
  maxHeight?: string;
}

/** A single copyable shell command. */
export interface DocCommandBlock {
  kind: 'command';
  command: string;
  note?: string;
}

/** A short list of related commands, copied as one block. */
export interface DocCommandsBlock {
  kind: 'commands';
  title?: string;
  items: { command: string; note?: string }[];
}

export interface DocTableBlock {
  kind: 'table';
  caption?: string;
  columns: { key: string; label: string; mono?: boolean }[];
  rows: Record<string, string>[];
}

export interface DocNoteBlock {
  kind: 'note';
  variant?: 'warning' | 'info';
  title?: string;
  text: string;
}

export interface DocListBlock {
  kind: 'list';
  ordered?: boolean;
  items: string[];
}

/** Key/value facts rendered as a definition grid (version, license, entrypoint). */
export interface DocFactsBlock {
  kind: 'facts';
  title?: string;
  items: { label: string; value: string; mono?: boolean }[];
}

/** Term/description pairs — for CLI flags and configuration keys. */
export interface DocDefinitionsBlock {
  kind: 'definitions';
  items: { term: string; detail: string }[];
}

/** Ordered pipeline stages. Rendered as a numbered list, never as a card grid. */
export interface DocStagesBlock {
  kind: 'stages';
  items: { name: string; detail: string; emits?: string }[];
}

export interface DocLinksBlock {
  kind: 'links';
  items: { label: string; href: string; note?: string; showHref?: boolean }[];
}

export type DocBlock =
  | DocProseBlock
  | DocSubheadingBlock
  | DocCodeBlock
  | DocCommandBlock
  | DocCommandsBlock
  | DocTableBlock
  | DocNoteBlock
  | DocListBlock
  | DocFactsBlock
  | DocDefinitionsBlock
  | DocStagesBlock
  | DocLinksBlock;

export interface ToolDocSection {
  /** Anchor id — also the sidebar entry for this section. */
  id: string;
  label: string;
  kicker?: string;
  title: string;
  description?: string;
  blocks: DocBlock[];
}

export interface ToolDoc {
  /** Must match a `slug` in the tool registry. */
  slug: string;
  seoTitle: string;
  seoDescription: string;
  /** One paragraph rendered directly under the h1. */
  summary: string;
  sections: ToolDocSection[];
}
