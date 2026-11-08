import React from 'react';
import { cn } from '@/shared/utils/cn';
import type { ShellComment } from './shellComments';

interface CommandNotesProps {
  comments: ShellComment[];
  className?: string;
}

export const CommandNotes: React.FC<CommandNotesProps> = ({ comments, className }) => {
  if (comments.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">
        Command notes
      </p>
      <ul className="space-y-1.5" role="list">
        {comments.map((comment) => (
          <li
            key={`${comment.line}-${comment.text}`}
            className="flex items-start gap-2 text-sm leading-6 text-text-secondary"
          >
            <span className="mt-0.5 shrink-0 select-none text-accent" aria-hidden="true">
              &bull;
            </span>
            <span>{comment.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommandNotes;
