/**
 * HTTP BLOCK
 * ==========
 * Shows a request/response pair with optional annotations.
 * Method badge colour follows semantics: GET=accent, POST=info, rest=support.
 */

import React from 'react';
import { Globe } from 'lucide-react';
import type { HttpBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

const methodStyle = (method: string): string => {
  const m = (method || '').toUpperCase();
  if (m === 'GET') return 'border-accent/40 bg-accent/10 text-accent';
  if (m === 'POST' || m === 'PUT' || m === 'PATCH') return 'border-info/40 bg-info/10 text-info';
  if (m === 'DELETE') return 'border-danger/40 bg-danger/10 text-danger';
  return 'border-border/40 bg-bg-elevated text-text-secondary';
};

export const HttpBlockComponent: React.FC<BlockRendererProps<HttpBlock>> = ({ block }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-accent" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-accent">HTTP Request / Response</p>
      </div>

      {block.request && (
        <div className="wc-code overflow-hidden rounded-xl border border-border/50 bg-bg">
          <div className="flex items-center gap-2 border-b border-border/20 bg-bg-elevated px-3 py-2">
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${methodStyle(block.request.method)}`}>
              {block.request.method}
            </span>
            <span className="truncate font-mono text-xs text-text-secondary">{block.request.url}</span>
          </div>
          {(block.request.headers || block.request.body) && (
            <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-text-secondary">
              {block.request.headers && (
                <span>{Object.entries(block.request.headers).map(([k, v]) => `${k}: ${v}`).join('\n')}</span>
              )}
              {block.request.body && (
                <span>{block.request.headers ? '\n\n' : ''}{block.request.body}</span>
              )}
            </pre>
          )}
        </div>
      )}

      {block.response && (
        <div className="wc-code overflow-hidden rounded-xl border border-border/50 bg-bg">
          <div className="flex items-center gap-3 border-b border-border/20 bg-bg-elevated px-3 py-2">
            <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest ${block.response.status >= 400 ? 'border-danger/40 bg-danger/10 text-danger' : block.response.status >= 300 ? 'border-warning/40 bg-warning/10 text-warning' : 'border-accent/40 bg-accent/10 text-accent'}`}>
              {block.response.status}
            </span>
            <span className="font-mono text-xs text-text-muted">response</span>
          </div>
          {(block.response.headers || block.response.body) && (
            <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed text-text-secondary">
              {block.response.headers && (
                <span>{Object.entries(block.response.headers).map(([k, v]) => `${k}: ${v}`).join('\n')}</span>
              )}
              {block.response.body && (
                <span>{block.response.headers ? '\n\n' : ''}{block.response.body}</span>
              )}
            </pre>
          )}
        </div>
      )}

      {block.annotations && block.annotations.length > 0 && (
        <div className="space-y-2">
          {block.annotations.map((ann, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-border/30 bg-bg-elevated px-4 py-2">
              <span className="shrink-0 select-none text-xs font-black text-accent" aria-hidden="true">
                {ann.target}
              </span>
              <p className="text-base font-mono text-text-secondary leading-relaxed">
                {ann.label}
                {ann.description ? <span className="text-text-muted"> — {ann.description}</span> : null}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HttpBlockComponent;