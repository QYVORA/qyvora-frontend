# Learning Content Standard

Rules for writing lesson, lab, and bootcamp card content. The chunker in
`markdownChunker.ts` turns this Markdown into cards — write for the learner.

## One idea at a time

- Each card teaches one idea. Keep prose under ~700 characters; the chunker
  splits longer paragraphs at sentence boundaries.
- Never split a list lead-in. A paragraph ending in `:` stays with its list.
- New or abstract ideas get a plain-English lead-in:
  `> **In plain English**: ...`. Use it sparingly — the first time a concept
  appears.

## Code and commands

- Always fence code with a language: `bash`, `python`, `http`, `sql`, `text`.
- Show short, runnable examples. One fence = one Copy button.
- Teaching a script? Add a `breakdown` fence right after it: one line range per
  part, each with a title, `what`, and `why`.
- Commands are not output. Put the command in a `bash` fence and the result in a
  separate `text` fence. Never paste the `$` prompt — it is stripped for you.

## Lists

- Numbered lists become a **task** only when they read as actions (run, open,
  click) or the heading says step/try/lab. Otherwise they stay a key-point list.
- Glossary-style items (`**Term**: definition`) render as a definition list.
- Keep each item to one short sentence.

## Diagrams

- Add a `diagram` fence with an `id` from `src/shared/learning/diagrams/library.ts`
  and a one-line `caption`. One diagram per concept, at the top level of a card.
- Never hand-draw ASCII diagrams when a library diagram exists.

## Voice

- Short sentences, active voice, second person. Explain *why* before *how*.
- Use tokens (`text-accent`, `text-text-muted`), never raw hex values.
