import React from 'react';
import type { TerminalLine } from './types';

interface TerminalOutputProps {
  lines: TerminalLine[];
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ lines }) => (
  <>
    {lines.map((line, i) => (
      <div
        key={i}
        className={`whitespace-pre-wrap break-all ${
          line.type === 'input'
            ? 'text-green-400/90'
            : line.type === 'output'
            ? 'text-white/80'
            : line.type === 'error'
            ? 'text-red-400'
            : line.type === 'prompt'
            ? 'text-green-400'
            : 'text-white/40 text-[11px]'
        }`}
      >
        {line.text}
      </div>
    ))}
  </>
);
