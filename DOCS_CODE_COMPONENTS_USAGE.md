# Documentation-Style Code Components Usage Guide

New code display components inspired by React Learn documentation for use in bootcamp rooms, course lessons, and lab walkthroughs.

## Components Overview

Three new components replace the standard `CodeBlock` and `CommandBlock` in learning content:

1. **`DocsCodeBlock`** - Multi-line code snippets (Python, JS, JSON, etc.)
2. **`DocsCommandBlock`** - Terminal commands with optional output
3. **`DocsInlineCode`** - Inline code mentions in prose

## Key Design Differences

### React Docs Style vs. Current CodeBlock

**Current Style:**
- Heavy dark background (`bg-bg`)
- Header bar with filename/badge/copy button
- Border around entire block
- Copy button in header

**New Docs Style:**
- Lighter elevated background (`bg-bg-elevated`)
- Cleaner, more open appearance
- Copy button inline (top-right corner)
- Better vertical spacing (`my-6`)
- Always uses `wc-code` or `wc-terminal` width constraints
- Subtle borders (`border-border/30`)

## Component API

### DocsCodeBlock

```tsx
import { DocsCodeBlock } from '@/shared/components/learning';

<DocsCodeBlock
  code={`function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");`}
  language="javascript"
  filename="greet.js" // optional
  showLineNumbers={false} // optional
  highlightLines={[2, 3]} // optional - array of line numbers
  className="" // optional
/>
```

**Props:**
- `code` (required): The code string to display
- `language`: `'bash' | 'python' | 'javascript' | 'typescript' | 'json' | 'text'` (default: `'text'`)
- `filename`: Optional filename shown in header
- `showLineNumbers`: Show line numbers in left gutter (default: `false`)
- `highlightLines`: Array of line numbers to highlight (1-indexed)
- `className`: Additional CSS classes

### DocsCommandBlock

```tsx
import { DocsCommandBlock } from '@/shared/components/learning';

<DocsCommandBlock
  command="npm install qyvora-toolkit"
  output="+ qyvora-toolkit@1.0.0
added 1 package"
  className=""
/>
```

**Props:**
- `command` (required): The terminal command
- `output`: Optional command output (displayed below command)
- `className`: Additional CSS classes

**Features:**
- Prominent `$` prompt in accent color
- Compact padding (`px-3 py-2`)
- Output is muted and indented
- Copy button copies only the command (not output)

### DocsInlineCode

```tsx
import { DocsInlineCode } from '@/shared/components/learning';

<p>
  Run <DocsInlineCode>npm start</DocsInlineCode> to launch the server.
</p>
```

**Props:**
- `children`: The inline code text
- `className`: Additional CSS classes

## Integration Examples

### Bootcamp Room Content

```tsx
// In BootcampRoomPage or room content renderer
import { DocsCodeBlock, DocsCommandBlock, DocsInlineCode } from '@/shared/components/learning';

<div className="space-y-6">
  <p className="text-sm md:text-base text-text-secondary font-mono leading-[2] mb-6">
    In this room, you'll learn how to use <DocsInlineCode>nmap</DocsInlineCode> for 
    network reconnaissance.
  </p>

  <DocsCommandBlock
    command="nmap -sV 192.168.1.1"
    output="Starting Nmap 7.94
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9
80/tcp   open  http    nginx 1.24.0"
  />

  <DocsCodeBlock
    code={`# Save results to file
nmap -sV 192.168.1.1 -oN scan_results.txt

# Scan multiple hosts
nmap -sV 192.168.1.1-10`}
    language="bash"
    filename="scan-commands.sh"
  />
</div>
```

### Course Lesson

```tsx
// In CoursePage lesson renderer
import { DocsCodeBlock } from '@/shared/components/learning';

<div className="space-y-6">
  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-5 text-accent">
    Python Functions
  </h3>

  <p className="text-sm md:text-base text-text-secondary font-mono leading-[2] mb-6">
    Functions are defined using the <DocsInlineCode>def</DocsInlineCode> keyword:
  </p>

  <DocsCodeBlock
    code={`def calculate_risk_score(vulnerabilities):
    """Calculate overall risk score from vulnerabilities."""
    score = 0
    for vuln in vulnerabilities:
        score += vuln.severity * vuln.likelihood
    return score

# Example usage
vulns = [
    Vulnerability(severity=8, likelihood=0.7),
    Vulnerability(severity=5, likelihood=0.3),
]

risk = calculate_risk_score(vulns)
print(f"Risk Score: {risk}")`}
    language="python"
    showLineNumbers={true}
    highlightLines={[1, 2, 3]}
  />
</div>
```

### Lab Walkthrough

```tsx
// In lab step content (via WalkthroughLayout)
import { DocsCommandBlock, DocsInlineCode } from '@/shared/components/learning';

<div className="space-y-6">
  <p className="text-sm md:text-base text-text-secondary font-mono leading-[2] mb-6">
    First, connect to the target using <DocsInlineCode>ssh</DocsInlineCode>:
  </p>

  <DocsCommandBlock
    command="ssh user@target.qyvora.lab"
  />

  <p className="text-sm md:text-base text-text-secondary font-mono leading-[2] mb-6">
    Once connected, enumerate the system:
  </p>

  <DocsCommandBlock
    command="ls -la /home/user"
    output="drwxr-xr-x  5 user user 4096 Jan 15 10:30 .
drwxr-xr-x  3 root root 4096 Jan 10 08:00 ..
-rw-r--r--  1 user user  220 Jan 10 08:00 .bash_logout
-rw-r--r--  1 user user 3526 Jan 10 08:00 .bashrc"
  />
</div>
```

## Migration Guide

### From Current CodeBlock

**Before:**
```tsx
<CodeBlock
  code="nmap -sV 192.168.1.1"
  lang="sh"
  badge="shell"
  copyable={true}
  className="my-4"
/>
```

**After:**
```tsx
<DocsCommandBlock
  command="nmap -sV 192.168.1.1"
  className="my-6"
/>
```

### From Current Inline Code

**Before:**
```tsx
<code className="bg-accent/10 px-1 py-0.5 rounded font-mono text-sm">
  npm start
</code>
```

**After:**
```tsx
<DocsInlineCode>npm start</DocsInlineCode>
```

## Accessibility

All components follow QYVORA accessibility standards:

- **Copy buttons**: `min-h-[44px]` on mobile, `min-h-[32px]` on desktop
- **ARIA labels**: "Copy code" / "Copy command" with "Copied!" feedback
- **Focus states**: Visible outline ring (`ring-accent/50`)
- **Keyboard navigation**: Full keyboard support

## Responsive Behavior

- **Copy buttons**: Hidden on mobile (show on hover/focus), always visible on desktop (`md:opacity-100`)
- **Touch targets**: 44px minimum on mobile for accessibility
- **Width constraints**: Uses `wc-code` / `wc-terminal` classes
- **Overflow**: Horizontal scroll for long code lines

## When to Use Each Component

| Component | Use Case |
|-----------|----------|
| `DocsCodeBlock` | Multi-line code snippets (Python scripts, configs, JSON) |
| `DocsCommandBlock` | Single terminal commands or command + output |
| `DocsInlineCode` | Code mentions in prose (variables, commands, functions) |
| `CodeBlock` (original) | Legacy IDE simulations, syntax-highlighted examples needing full tokenizer |

## Design Tokens Used

- Background: `bg-bg-elevated` (lifted surface)
- Border: `border-border/30` (subtle)
- Text: `text-text-primary` (commands), `text-text-secondary` (code), `text-text-muted` (output)
- Accent: `text-accent` (prompts, inline code, highlights)
- Spacing: `rounded-2xl` (consistent with QYVORA cards)
- Width: `wc-code` / `wc-terminal` (never `max-w-*`)

## Testing Checklist

Before deploying new code components:

- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Copy button works on desktop
- [ ] Copy button appears on mobile hover/focus
- [ ] Touch targets meet 44px minimum on mobile
- [ ] Code wraps or scrolls appropriately
- [ ] Inline code doesn't break line height
- [ ] Commands display prominent `$` prompt
- [ ] Output is visually distinct from command
- [ ] `wc-code` / `wc-terminal` width applied correctly

## Examples in Production

Once integrated, check these pages to see the new components in action:

- Bootcamp room: `/dashboard/bootcamps/bc_1775270338500/phases/phase1/rooms/room1`
- Course lesson: `/dashboard/courses/python-basics?lesson=0`
- Lab walkthrough: `/dashboard/labs/network-recon`

---

**Note:** These components are specifically designed for learning content. For IDE simulations, terminal mocks, and syntax-highlighted code examples, continue using the original `CodeBlock` component with full tokenization.
