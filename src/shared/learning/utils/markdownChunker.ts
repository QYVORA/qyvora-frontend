/**
 * MARKDOWN CHUNKER
 * ================
 * Converts legacy Markdown instruction text into semantic learning blocks,
 * one block per deck card, so dense walls-of-text become digestible cards.
 *
 * Heuristics (in document order):
 *   - Headings start a new section; the next emitted block inherits it as a title.
 *   - Blockquotes become Concept cards ("Why This Matters" when flagged as such).
 *   - Fenced code blocks become Code cards.
 *   - Bullet lists become Recall cards; numbered lists become Do cards.
 *   - Prose is split into readable Text cards; the first card of a section
 *     carries its heading (hard cap per card ~320 chars).
 *
 * Deterministic and dependency-free — safe to unit test.
 */

import type {
  LearningBlock,
  TextBlock,
  ConceptBlock,
  CodeBlock,
  CommandBlock,
  RecallBlock,
  DoBlock,
} from '../types/blocks';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Strip basic Markdown markers (bold/italic/code/links) to plain text. */
export function plainMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // images -> alt
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> label
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1') // inline code
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1') // bold+italic
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/^>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const MAX_PROSE_PER_CARD = 320;

/** Split a paragraph into sentence groups each under the prose cap. */
export function splitProse(text: string, max = MAX_PROSE_PER_CARD): string[] {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  const sentences = cleaned.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) ?? [cleaned];
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}`.trim() : sentence.trim();
    if (candidate.length <= max || !current) {
      current = candidate;
    } else {
      chunks.push(current);
      current = sentence.trim();
    }
    if (current.length > max * 1.5) {
      chunks.push(current);
      current = '';
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// ── Segment model ────────────────────────────────────────────────────────────

type Segment =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'blockquote'; text: string }
  | { kind: 'code'; lang: string; code: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'hr' }
  | { kind: 'para'; text: string };

const CODE_FENCE = /^```([^\s`]*)/;
const HEADING = /^(#{1,4})\s+(.+)$/;
// Bootcamp/course copy often uses a standalone bold line as a sub-heading.
const BOLD_HEADING = /^\s*\*\*(.+?)\*\*:?\s*$/;
const BLOCKQUOTE = /^\s*>\s?(.*)$/;
const HR = /^\s*([-*_])\1{2,}\s*$/;
const UNORDERED = /^\s*[-*+]\s+(.+)$/;
const ORDERED = /^\s*\d+[.)]\s+(.+)$/;

function tokenize(markdown: string): Segment[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const segments: Segment[] = [];
  let paras: string[] = [];
  let bq: string[] = [];
  let listItems: string[] = [];
  let listOrdered = false;
  let inList = false;

  const flushPara = () => {
    if (paras.length > 0) {
      const text = paras.join(' ').trim();
      if (text) segments.push({ kind: 'para', text });
      paras = [];
    }
  };
  const flushQuote = () => {
    if (bq.length > 0) {
      segments.push({ kind: 'blockquote', text: bq.join(' ').trim() });
      bq = [];
    }
  };
  const flushList = () => {
    if (listItems.length > 0) {
      segments.push({ kind: 'list', ordered: listOrdered, items: [...listItems] });
      listItems = [];
    }
    inList = false;
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block (spanning multiple lines)
    const fenceMatch = line.match(CODE_FENCE);
    if (fenceMatch) {
      flushPara(); flushQuote(); flushList();
      const lang = fenceMatch[1] || '';
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // consume closing fence (or EOF)
      segments.push({ kind: 'code', lang, code: codeLines.join('\n').trim() });
      continue;
    }

    const headingMatch = line.match(HEADING);
    if (headingMatch) {
      flushPara(); flushQuote(); flushList();
      segments.push({ kind: 'heading', level: headingMatch[1].length, text: cleanHeading(headingMatch[2]) });
      i += 1;
      continue;
    }

    const boldHeadingMatch = line.match(BOLD_HEADING);
    if (boldHeadingMatch) {
      flushPara(); flushQuote(); flushList();
      segments.push({ kind: 'heading', level: 3, text: cleanHeading(boldHeadingMatch[1]) });
      i += 1;
      continue;
    }

    if (line.match(BLOCKQUOTE)) {
      flushPara(); flushList();
      bq.push(line.replace(BLOCKQUOTE, '$1'));
      i += 1;
      continue;
    }

    const uMatch = line.match(UNORDERED);
    const oMatch = line.match(ORDERED);
    if (uMatch || oMatch) {
      flushPara(); flushQuote();
      const ordered = Boolean(oMatch);
      if (inList && ordered !== listOrdered) flushList();
      const item = (oMatch ? oMatch[1] : uMatch![1]).replace(/\s+/g, ' ').trim();
      if (!inList) {
        listOrdered = ordered;
        inList = true;
      }
      listItems.push(item);
      i += 1;
      continue;
    }

    if (line.match(HR)) {
      flushPara(); flushQuote(); flushList();
      segments.push({ kind: 'hr' });
      i += 1;
      continue;
    }

    // Blank line ends a paragraph
    if (/^\s*$/.test(line)) {
      flushPara();
      i += 1;
      continue;
    }

    // Regular prose line — accumulate (Markdown line breaks reflow to spaces)
    paras.push(line.trim());
    i += 1;
  }

  flushPara(); flushQuote(); flushList();
  return segments;
}

// ── Assembly ─────────────────────────────────────────────────────────────────

function isWhyQuote(text: string): boolean {
  return /why this matters|^why\b/i.test(plainMarkdown(text));
}

function cleanHeading(text: string): string {
  return plainMarkdown(text).replace(/[:：]\s*$/, '').trim();
}

export type ShellKind = 'bash' | 'cmd' | 'powershell';

const SHELL_LANGUAGES: Record<string, ShellKind> = {
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  console: 'bash',
  terminal: 'bash',
  cmd: 'cmd',
  batch: 'cmd',
  bat: 'cmd',
  powershell: 'powershell',
  ps: 'powershell',
  ps1: 'powershell',
};

/** Map a fence language to a shell family, or null when it is not a shell. */
export function shellKindFor(lang: string | undefined): ShellKind | null {
  if (!lang) return null;
  return SHELL_LANGUAGES[lang.trim().toLowerCase()] ?? null;
}

const BASH_PROMPT = /^\s*\$\s/;
const BASH_ROOT_PROMPT = /^\s*#\s/;
const CMD_PROMPT = /^\s*[A-Za-z]:\\[^>]*>\s?/;
const PS_PROMPT = /^\s*PS\s+[A-Za-z]:\\[^>]*>\s?/;

/**
 * A shell fence is treated as a live terminal session when it is short, has no
 * shebang, and contains no multi-line control constructs (those are scripts,
 * not commands to run one by one).
 */
export function isTerminalSession(code: string, kind: ShellKind): boolean {
  const lines = code.split('\n').filter((l) => l.trim() !== '');
  if (lines.length === 0) return false;
  if (lines.length > 12) return false;
  if (/^\s*#!/.test(lines[0])) return false;
  if (lines.some((l) => /^\s*(if|for|while|function|case|do)\b/.test(l))) return false;
  if (lines.some((l) => /\b(then|do|done|fi|esac)\b\s*$/.test(l))) return false;
  // `#` is only a root prompt when the author also used an explicit `$` prompt.
  void kind;
  return true;
}

interface SessionEntry {
  command?: string;
  output?: string;
}

function isPromptLine(line: string, kind: ShellKind, hasDollar: boolean): boolean {
  if (kind === 'cmd') return CMD_PROMPT.test(line);
  if (kind === 'powershell') return PS_PROMPT.test(line);
  if (BASH_PROMPT.test(line)) return true;
  return hasDollar && BASH_ROOT_PROMPT.test(line);
}

function stripPrompt(line: string, kind: ShellKind): string {
  if (kind === 'cmd') return line.replace(CMD_PROMPT, '').trim();
  if (kind === 'powershell') return line.replace(PS_PROMPT, '').trim();
  return line.replace(/^\s*(\$|#)\s?/, '').trim();
}

export interface TerminalSession {
  command: string;
  output?: string;
  session: SessionEntry[];
}

/** Split a terminal fence into ordered command/output entries. */
export function parseTerminalSession(code: string, kind: ShellKind): TerminalSession {
  const lines = code.replace(/\s+$/, '').split('\n');
  const hasDollar = lines.some((l) => BASH_PROMPT.test(l));
  const usesPrompts = lines.some((l) => isPromptLine(l, kind, hasDollar));

  if (!usesPrompts) {
    const command = code.trim();
    return { command, session: [{ command }] };
  }

  const session: SessionEntry[] = [];
  let current: SessionEntry | null = null;

  for (const line of lines) {
    if (isPromptLine(line, kind, hasDollar)) {
      if (current && (current.command || current.output)) session.push(current);
      current = { command: stripPrompt(line, kind) };
    } else {
      if (!current) current = {};
      current.output = current.output ? `${current.output}\n${line}` : line;
    }
  }
  if (current && (current.command || current.output)) session.push(current);

  const commands = session
    .map((s) => s.command)
    .filter((c): c is string => Boolean(c && c.trim()));
  const outputs = session
    .map((s) => s.output)
    .filter((o): o is string => Boolean(o && o.trim()));

  return {
    command: commands.join('\n') || code.trim(),
    output: outputs.length ? outputs.join('\n') : undefined,
    session,
  };
}

export interface MarkdownToBlocksOptions {
  /**
   * Preserve paragraph-level prose instead of splitting it into short card
   * chunks. Used by continuous reading pages (course/lab/bootcamp articles).
   */
  continuous?: boolean;
}

export function markdownToBlocks(
  markdown: string,
  baseId: string,
  options: MarkdownToBlocksOptions = {},
): LearningBlock[] {
  const segments = tokenize(markdown);
  const blocks: LearningBlock[] = [];
  let sectionTitle: string | null = null;
  let index = 0;

  const nextId = (kind: string) => `${baseId}-${kind}-${index++}`;

  const pushText = (content: string) => {
    // In card mode every prose chunk becomes its own readable card. In
    // continuous mode prose stays at paragraph level so the page reads as an
    // article instead of a stack of cards. The first chunk of a section carries
    // the section heading so headings are never dropped.
    const chunks = options.continuous ? [content] : splitProse(content);
    for (const chunk of chunks) {
      const textBlock: TextBlock = { type: 'text', id: nextId('text'), content: chunk };
      if (sectionTitle) {
        textBlock.title = sectionTitle;
        sectionTitle = null;
      }
      blocks.push(textBlock);
    }
  };

  for (const segment of segments) {
    switch (segment.kind) {
      case 'heading': {
        sectionTitle = segment.text;
        break;
      }

      case 'blockquote': {
        const quote = segment.text.trim();
        if (!quote) break;
        const isWhy = isWhyQuote(quote);
        const concept: ConceptBlock = {
          type: 'concept',
          id: nextId('concept'),
          title: isWhy ? 'Why This Matters' : sectionTitle ?? 'Key Idea',
          content: quote,
          importance: isWhy ? 'core' : 'supporting',
        };
        blocks.push(concept);
        sectionTitle = null;
        break;
      }

      case 'code': {
        const lang = segment.lang || 'bash';
        const shell = shellKindFor(lang);
        if (shell && isTerminalSession(segment.code, shell)) {
          const parsed = parseTerminalSession(segment.code, shell);
          const command: CommandBlock = {
            type: 'command',
            id: nextId('command'),
            command: parsed.command,
            shell,
            output: parsed.output,
            session: parsed.session,
          };
          if (sectionTitle) command.title = sectionTitle;
          blocks.push(command);
          sectionTitle = null;
          break;
        }
        const code: CodeBlock = {
          type: 'code',
          id: nextId('code'),
          language: lang,
          code: segment.code,
        };
        if (sectionTitle) code.filename = sectionTitle;
        blocks.push(code);
        sectionTitle = null;
        break;
      }

      case 'list': {
        // Keep inline Markdown so bold, italics, and inline code survive inside
        // Recall/Do items; the block renderers use the rich prose component.
        const items = segment.items.map((s) => s.trim());
        if (segment.ordered) {
          const doBlock: DoBlock = {
            type: 'do',
            id: nextId('do'),
            title: sectionTitle ?? 'Try It',
            instructions: items,
          };
          blocks.push(doBlock);
        } else {
          const recall: RecallBlock = {
            type: 'recall',
            id: nextId('recall'),
            title: sectionTitle ?? (/remember|key|takeaway/i.test(sectionTitle ?? '') ? 'Remember' : 'Key Points'),
            points: items,
          };
          blocks.push(recall);
        }
        sectionTitle = null;
        break;
      }

      case 'para': {
        if (segment.text) pushText(segment.text);
        break;
      }

      case 'hr':
      default: {
        sectionTitle = null;
        break;
      }
    }
  }

  return blocks;
}

/**
 * Public chunker entry point (kept name-compatible with the Phase 2 stub).
 */
export function parseMarkdownToBlocks(
  markdown: string,
  baseId: string,
  options: MarkdownToBlocksOptions = {},
): LearningBlock[] {
  return markdownToBlocks(markdown, baseId, options);
}

/**
 * Chunk a lesson/step's Markdown and cap the number of cards so a single
 * step never grows into an unwieldy deck. Cards stay short; when the cap is
 * hit the deck simply ends (no coalescing into a wall of text).
 */
export function chunkMarkdown(markdown: string, baseId: string, maxBlocks = 40): LearningBlock[] {
  const blocks = parseMarkdownToBlocks(markdown, baseId);
  if (blocks.length <= maxBlocks) return blocks;
  return blocks.slice(0, Math.max(1, maxBlocks));
}