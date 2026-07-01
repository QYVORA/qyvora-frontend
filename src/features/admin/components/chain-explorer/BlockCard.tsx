import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, BookOpen, Award, Zap } from 'lucide-react';
import CpLogo from '../../../../shared/components/CpLogo';
import { ChainBlock, EVENT_COLORS, EVENT_LABELS, shortHash } from './types';

const EVENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ROOM_COMPLETED:    BookOpen,
  MODULE_COMPLETED:  Award,
  CP_REWARD:         Zap,
  USER_ACTIVITY_LOG: Activity,
};

const BlockCard: React.FC<{ block: ChainBlock; isGenesis: boolean }> = ({ block, isGenesis }) => {
  const [expanded, setExpanded] = useState(false);
  const colorClass = EVENT_COLORS[block.data.type] ?? EVENT_COLORS.USER_ACTIVITY_LOG;
  const Icon = EVENT_ICONS[block.data.type] ?? Activity;
  const label = EVENT_LABELS[block.data.type] ?? block.data.type;

  return (
    <div className={`rounded-2xl border-2 bg-bg-card transition-all ${
      isGenesis ? 'border-border/50 opacity-60' : 'border-border hover:border-accent/30'
    }`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg font-mono text-xs font-black text-text-muted">
          #{block.index}
        </div>

        <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest shrink-0 ${colorClass}`}>
          <Icon className="h-3 w-3" />
          {label}
        </div>

        <div className="flex-1 min-w-0 hidden sm:block">
          <div className="font-mono text-[11px] text-text-muted truncate">{shortHash(block.hash)}</div>
          <div className="text-[10px] text-text-muted/60 mt-0.5">
            {block.timestamp ? new Date(block.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
          </div>
        </div>

        {block.data.cpPoints != null && block.data.cpPoints > 0 && (
          <div className="flex items-center gap-1 font-mono text-sm font-black text-accent shrink-0">
            +{block.data.cpPoints} <CpLogo className="w-3.5 h-3.5" />
          </div>
        )}

        <div className="shrink-0 text-text-muted">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Block Index', value: String(block.index) },
              { label: 'Validator', value: String(block.validator) },
              { label: 'User ID', value: String(block.data.userId ?? '') },
              { label: 'Bootcamp ID', value: String(block.data.bootcampId ?? '') },
              ...(block.data.moduleId ? [{ label: 'Module ID', value: String(block.data.moduleId) }] : []),
              ...(block.data.roomId ? [{ label: 'Room ID', value: String(block.data.roomId) }] : []),
              ...(block.data.cpPoints != null ? [{ label: 'CP Points', value: String(block.data.cpPoints) }] : []),
              { label: 'Timestamp', value: block.timestamp ? new Date(block.timestamp).toISOString() : '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">{label}</div>
                <div className="font-mono text-text-secondary break-all">{value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-1">
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">Block Hash</div>
              <div className="font-mono text-[11px] text-accent break-all bg-accent/5 border border-accent/20 rounded-lg px-3 py-2">{block.hash}</div>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-0.5">Previous Hash</div>
              <div className="font-mono text-[11px] text-text-muted break-all bg-bg border border-border rounded-lg px-3 py-2">{block.previousHash}</div>
            </div>
          </div>

          {block.data.metadata && Object.keys(block.data.metadata).length > 0 && (
            <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-text-muted mb-1">Metadata</div>
              <pre className="text-[11px] font-mono text-text-secondary bg-bg border border-border rounded-lg px-3 py-2 overflow-x-auto">
                {JSON.stringify(block.data.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockCard;
