import { describe, it, expect } from 'vitest';
import {
  parseMarkdownToBlocks,
  chunkMarkdown,
  splitProse,
  plainMarkdown,
  MAX_PROSE_PER_CARD,
} from './markdownChunker';

describe('plainMarkdown', () => {
  it('strips bold, italic, inline code and links', () => {
    expect(plainMarkdown('**bold** and *italic* and `code` and [label](https://x)')).toBe(
      'bold and italic and code and label',
    );
  });

  it('collapses whitespace', () => {
    expect(plainMarkdown('  a\n\n   b ')).toBe('a b');
  });
});

describe('splitProse', () => {
  it('keeps short paragraphs as-is', () => {
    expect(splitProse('Short paragraph here.')).toEqual(['Short paragraph here.']);
  });

  it('splits long paragraphs at sentence boundaries under the cap', () => {
    const long = 'One. '.repeat(120);
    const chunks = splitProse(long);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(MAX_PROSE_PER_CARD * 1.5);
  });

  it('never coalesces prose into a wall of text', () => {
    const md = Array.from(
      { length: 30 },
      (_, i) => `Sentence number ${i} adds a little more detail to the paragraph.`,
    ).join(' ');
    const blocks = parseMarkdownToBlocks(md, 'wall');
    const texts = blocks.filter((b) => b.type === 'text');
    expect(texts.length).toBeGreaterThan(1);
    for (const b of texts) {
      if (b.type === 'text') expect(b.content.length).toBeLessThanOrEqual(MAX_PROSE_PER_CARD * 1.5);
    }
  });
});

describe('parseMarkdownToBlocks', () => {
  it('turns a dense markdown step into multiple semantic cards', () => {
    const md = [
      '## Reconnaissance',
      '',
      'Start with a quick scan of the target.',
      '',
      '> Why this matters: you cannot attack what you cannot see.',
      '',
      '```bash',
      'nmap -sV target',
      '```',
      '',
      '- Always scan open ports',
      '- Never skip version detection',
      '',
      '1. Run nmap',
      '2. Record the results',
    ].join('\n');

    const blocks = parseMarkdownToBlocks(md, 'step-0');
    const types = blocks.map((b) => b.type);
    expect(types).toContain('text');
    expect(types).toContain('concept');
    expect(types).toContain('code');
    expect(types).toContain('recall');
    expect(types).toContain('do');

    const concept = blocks.find((b) => b.type === 'concept');
    expect(concept?.type === 'concept' ? concept.importance : null).toBe('core');

    const code = blocks.find((b) => b.type === 'code');
    expect(code?.type === 'code' ? code.language : null).toBe('bash');
  });

  it('uses the nearest heading as the following card title', () => {
    const blocks = parseMarkdownToBlocks('## The Mission Card\n\n> Persistent access is key.', 's1');
    const concept = blocks.find((b) => b.type === 'concept');
    expect(concept?.type === 'concept' ? concept.title : null).toBe('The Mission Card');
  });

  it('returns an empty list for empty input', () => {
    expect(parseMarkdownToBlocks('', 'e')).toEqual([]);
  });
});

describe('chunkMarkdown', () => {
  it('caps the number of cards produced', () => {
    const md = Array.from({ length: 30 }, (_, i) => `Paragraph number ${i} with some filler words here.`).join('\n\n');
    const blocks = chunkMarkdown(md, 'capped', 6);
    expect(blocks.length).toBeLessThanOrEqual(6);
    expect(blocks.filter((b) => b.type === 'text').length).toBeGreaterThan(0);
  });
});