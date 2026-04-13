import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { copyText } from '@/shared/utils/clipboard'

export function MarkdownRenderer({ content = '' }) {
  const components = {
    // Headings
    h1: ({ children }) => <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mt-8 mb-4 leading-tight">{children}</h1>,
    h2: ({ children }) => <h2 className="font-display font-semibold text-xl text-[var(--text-primary)] mt-7 mb-3 leading-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mt-6 mb-2 leading-snug">{children}</h3>,
    h4: ({ children }) => <h4 className="font-semibold text-base text-[var(--text-primary)] mt-5 mb-2">{children}</h4>,
    h5: ({ children }) => <h5 className="font-semibold text-sm text-[var(--text-primary)] mt-4 mb-1">{children}</h5>,
    h6: ({ children }) => <h6 className="font-semibold text-xs uppercase tracking-widest text-[var(--text-muted)] mt-4 mb-1">{children}</h6>,

    // Paragraph
    p: ({ children }) => <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{children}</p>,

    // Lists
    ul: ({ children }) => <ul className="list-none pl-0 mb-4 space-y-1.5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-sm text-[var(--text-secondary)]">{children}</ol>,
    li: ({ children, ordered }) => (
      <li className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed">
        {!ordered && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
        <span>{children}</span>
      </li>
    ),

    // Inline
    strong: ({ children }) => <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>,
    em: ({ children }) => <em className="italic text-[var(--text-secondary)]">{children}</em>,
    del: ({ children }) => <del className="line-through text-[var(--text-muted)]">{children}</del>,

    // Link
    a: ({ href, children }) => (
      <a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noreferrer' : undefined}
        className="text-accent underline decoration-accent/40 hover:decoration-accent transition-colors"
      >
        {children}
      </a>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent/50 pl-4 py-1 my-4 bg-accent/5 rounded-r-lg">
        <div className="text-sm text-[var(--text-secondary)] italic">{children}</div>
      </blockquote>
    ),

    // Horizontal rule
    hr: () => <hr className="my-6 border-[var(--border)]" />,

    // Image
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt || ''}
        className="rounded-xl border border-[var(--border)] max-w-full my-4"
        loading="lazy"
      />
    ),

    // Table
    table: ({ children }) => (
      <div className="overflow-x-auto my-4 rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-[var(--bg-secondary)]">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-[var(--border)]">{children}</tbody>,
    tr: ({ children }) => <tr className="hover:bg-[var(--bg-secondary)] transition-colors">{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-2.5 text-left text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2.5 text-sm text-[var(--text-secondary)]">{children}</td>
    ),

    // Code
    code({ inline, className, children, ...props }) {
      const raw = String(children || '').replace(/\n$/, '')
      if (inline) {
        return (
          <code
            className="rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] px-1.5 py-0.5 font-mono text-xs text-accent"
            {...props}
          >
            {raw}
          </code>
        )
      }
      const language = (className || '').replace('language-', '').trim()
      return <CodeBlock language={language} code={raw} />
    },
  }

  return (
    <div className="space-y-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {String(content || '')}
      </ReactMarkdown>
    </div>
  )
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="relative rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] my-4 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <div className="flex items-center gap-3">
          {language && (
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {language}
            </span>
          )}
          <button
            type="button"
            className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors"
            onClick={async () => {
              const ok = await copyText(code)
              if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1500) }
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-xs text-[var(--text-primary)] leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )
}
