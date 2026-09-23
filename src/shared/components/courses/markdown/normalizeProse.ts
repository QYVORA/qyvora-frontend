// Prose normalisation for QYVORA learning Markdown.
//
// Lab narratives are authored with rich structure: `##`/`###` headings, `>`
// Valkyrie blockquote dialogue, and fenced command blocks. Course and Bootcamp
// lessons historically used flatter prose (long paragraphs with `**bold**`
// lead-ins and plain `Valkyrie:` dialogue). To bring every surface up to the
// same standard — without touching the already-clean Lab data or the shared
// renderer grammar — this normaliser upgrades that flat prose into the same
// headings/blockquotes the renderer already styles beautifully.
//
// Safe, targeted transforms (all idempotent against content that already uses
// the Labs form; plain paragraphs and inline bold are preserved):
//
//   1. `Valkyrie: "…"` / `Valkyrie "…"` dialogue ->  `> **Valkyrie:** "…"`
//   2. Standalone `**Label:**`-style heading lines   ->  `### Label`
//   3. Leading `**Label:**` heading + paragraph text ->  `### Label` + paragraph
//   4. Code fences keep their language (line numbers only when a language is set)

const BOLD_PHRASE = /^\s*\*\*(.+?)\*\*/;
const BOLD_ONLY_HEADING = /^\s*\*\*(.+?)\*\*:?\s*$/;
// Valkyrie dialogue — matches `Valkyrie: "..."` or a bare
// `Valkyrie "..."`/`Valkyrie:` opening, at the start of the line.
const DIALOGUE = /^\s*(Valkyrie|Valkyria|Valkyrie AI)(?::|,)?\s+"(.*)"/;

function normalizeProseLine(line: string): string {
  const trimmed = line.trim();
  if (!trimmed) return line;

  // 1. Already a blockquote / heading / other block construct? Leave untouched.
  if (trimmed.startsWith('>') || trimmed.startsWith('#') || trimmed.startsWith('|')) return line;
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) return line;

  // 2. Dialogue -> blockquote (matching the Labs `> **Valkyrie:**` pattern)
  const dialogue = trimmed.match(DIALOGUE);
  if (dialogue) {
    const speaker = dialogue[1];
    const quote = dialogue[2];
    return `> **${speaker}:** "${quote}"`;
  }

  // 3. Standalone bold heading line: `**Label:**` with no trailing prose
  const standalone = trimmed.match(BOLD_ONLY_HEADING);
  if (standalone && standalone[1].trim().length > 0 && standalone[1].trim().length <= 60) {
    return `### ${standalone[1].trim().replace(/[:\-—–]+$/, '').trim()}`;
  }

  // 4. Leading bold heading + paragraph: `**Core Fields:** the following…`
  //    Convert the leading short bold label into a `###` heading, keep the rest.
  const lead = trimmed.match(BOLD_PHRASE);
  if (lead) {
    const label = lead[1].trim();
    if (label.length > 0 && label.length <= 40 && /[:\-—-]?\s+/.test(trimmed.slice(lead[0].length))) {
      const rest = trimmed.slice(lead[0].length).replace(/^\s*[:：\-—–·]\s*/, '').trim();
      if (rest) {
        return `### ${label.replace(/[:：\-—–]+$/, '').trim()}\n\n${rest}`;
      }
      return `### ${label.replace(/[:：\-—–]+$/, '').trim()}`;
    }
  }

  return line;
}

export function normalizeProse(input: string): string {
  // Guard against fence-stripping: only operate line-by-line outside fenced blocks
  const lines = input.split('\n');
  const out: string[] = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) { out.push(line); continue; }

    out.push(normalizeProseLine(line));
  }
  return out.join('\n');
}