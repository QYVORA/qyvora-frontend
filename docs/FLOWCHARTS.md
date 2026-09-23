# QYVORA Flow Diagrams

Shared diagram foundation for learning/docs content. One container, two
node-based diagrams. Never hand-roll a new SVG flow layout — compose on the
foundation.

## Components

### DiagramFrame

`src/shared/components/diagrams/DiagramFrame.tsx`

The single bordered container every diagram renders inside:

```tsx
<DiagramFrame className="...">…nodes/arrows…</DiagramFrame>
```

- Container: `rounded-xl border border-border/50 bg-bg-card p-4 md:p-5`
- Carries the `wc-diagram` width constraint class
- Content overflows horizontally (`overflow-x-auto`) instead of trapping page
  scroll — long flows scroll inside the frame

### FlowDiagram

`src/shared/components/diagrams/FlowDiagram.tsx`

Nodes + arrows, horizontal or vertical. Node/arrow data is plain objects:

```tsx
<FlowDiagram
  nodes={[
    { id: 'a', label: 'Discover', sublabel: 'recon', status: 'completed' },
    { id: 'b', label: 'Attack', status: 'active' },
    { id: 'c', label: 'Report', status: 'default' },
  ]}
  arrows={[{ from: 'a', to: 'b', label: 'auth', type: 'dashed' }]}
  direction="horizontal"
/>
```

**Status contract** (the only five visual states):

| status | token application |
|--------|-------------------|
| `default` | `border-border/40 bg-bg-elevated text-text-secondary` |
| `active` | `border-accent/60 bg-accent/10 text-accent` |
| `completed` | `border-success/60 bg-success/10 text-success` |
| `danger` | `border-danger/60 bg-danger/10 text-danger` |
| `warning` | `border-warning/60 bg-warning/10 text-warning` |
| `success` | `border-accent/60 bg-accent/10 text-accent` |

Never add new status hues — inconsistent flows (e.g. `bg-red-100` or
`from-indigo-400`) break the color contract. Arrows: `text-accent/40` line
with `text-accent/60` arrowhead; `type` may be `solid` | `dashed` | `dotted`.

### KillChainDiagram

`src/shared/components/diagrams/KillChainDiagram.tsx`

Sequential attack-chain visualization. Splits the kill chain into a phase
column (Recon, Weaponization, … ) with per-phase status coloring. Strictly for
security-education narrative; use `FlowDiagram` for generic process flows.

## Rules

- **One container**: diagrams go in `DiagramFrame` (which sets `wc-diagram`);
  don't wrap a diagram in extra bordered boxes (no cards in cards).
- **Statuses over colors**: keep flow meaning in the status tokens, not
  hardcoded Tailwind color classes.
- **Accent only for the flow line**: the connecting line is
  `text-accent/40`/`text-accent/60` regardless of node status.
- **Scrolling**: long horizontal flows scroll inside the frame; never let a
  diagram push page width (no giant inline SVG grids).

## Node glyph artwork

Node icons are small line-glyphs (lucide `Icon` nodes at `text-lg` or branded
SVG marks). For purpose-built glyph artwork, generate flat monoline assets at
64×64, transparent background, two near-black greys + the single accent
`#06B66F`, 1.5–2px strokes — the same constraints as `docs/TROPHY-SPECS.md`
global rules.