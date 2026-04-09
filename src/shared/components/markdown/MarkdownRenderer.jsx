import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { copyText } from '@/shared/utils/clipboard'

export function MarkdownRenderer({ content = '' }) {
  const components = {
    code({ inline, className, children, ...props }) {
      const raw = String(children || '')
      if (inline) {
        return (
          <code className="rounded bg-[var(--bg-secondary)]/80 px-1.5 py-0.5 font-mono text-xs" {...props}>
            {raw}
          </code>
        )
      }
      const language = (className || '').replace('language-', '').trim()
      return (
        <CodeBlock language={language} code={raw} />
      )
    },
  }

  return (
    <div className="markdown-content text-sm text-[var(--text-secondary)] leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {String(content || '')}
      </ReactMarkdown>
    </div>
  )
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)
  const safeCode = String(code || '').replace(/\n$/, '')

  return (
    <div className="relative rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/60 p-4 my-4">
      <div className="absolute right-3 top-3 flex items-center gap-2">
        {language && (
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {language}
          </span>
        )}
        <button
          type="button"
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent hover:text-accent/80"
          onClick={async () => {
            const ok = await copyText(safeCode)
            if (ok) {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto text-xs text-[var(--text-primary)] leading-relaxed">
        <code>{safeCode}</code>
      </pre>
    </div>
  )
}
