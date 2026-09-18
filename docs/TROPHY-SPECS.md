# Trophy Artwork Specs

Drop finished renders into `src/assets/trophies/<id>.webp` (512×512, WebP).
`TrophyCabinet` already prefers these assets and only falls back to the
branded SVG visuals (`BootcampBadge`, `CpLogo`, `CourseBadge`, `QyvoraMark`)
when a file is missing.

## Global constraints

- 512×512, background **transparent**, never a filled card.
- Palette: QYVORA brand only — near-black `#000000`/`#0b0b0b` greys for
  depth, single accent green `#06B66F`, highlights in off-white `#EEF0EE`.
  No other hues, no purple/indigo, no gradients other than accent-to-accent.
- Flat, crisp vector style (terminal-born iconography), 1.5–2px consistent
  stroke weight, sharp corners with slight (≤4px) radius.
- No text, no letters, no numbers in the artwork.
- The mark must read at 24px and at 96px — no fine detail smaller than 4px.

## Files

| Filename | Trophy | Concept |
|----------|--------|---------|
| `hpb-graduate.webp` | HPB Graduate | Bootcamp veteran — a terminal cursor fused with a graduation chevron, a solid accent-green bar under it. |
| `lab-master.webp` | Lab Master | A sealed vault badge; concentric lock rings with a single keyhole punched by a green bolt. |
| `lab-expert.webp` | Lab Expert | A shield split into a grid of four cells, three filled; one green cell lit. |
| `lab-operator.webp` | Lab Operator | Two crossed reticles/brackets forming a diamond; a green center dot. |
| `first-lab.webp` | First Lab | A single empty terminal bracket `[ ]` with one green input-caret inside. |
| `scholar.webp` | Scholar | Stack of three outlined books; the top book filled accent-green. |
| `course-graduate.webp` | Course Graduate | An outlined book with a checkmark cut through its cover in green. |
| `first-course.webp` | First Course | A single outlined book with one green page tab. |
| `rank.webp` | Progression rank | A chevron stack (three chevrons ascending); the top chevron filled green. |

## Generation prompt template

```
Flat vector badge icon for a dark terminal cybersecurity platform.
Minimal monoline, generous negative space, no background, no text.
Pawnship: two near-black greys (#0b0b0b / #050505) + one accent (#06B66F).
Square 512x512, crisp 1.5-2px strokes, 4px corner radius, consistent line weights.
[CONCEPT — from the table above]
```

`rank.webp` is the generic progression-rank mark; the frontend resolves any
`rank-<tierId>` trophy to it when a per-tier file does not exist.