import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface DocTableColumn {
  key: string;
  label: string;
  /** Render the cell in monospace — for rule IDs, flags, file paths. */
  mono?: boolean;
}

interface DocTableProps {
  columns: DocTableColumn[];
  rows: Record<string, string>[];
  caption?: string;
  className?: string;
}

/**
 * DocTable — a real `<table>` for reference data (rules, flags, configuration
 * keys). Rendered with horizontal rules only, so it reads as documentation
 * rather than as a stack of panels.
 */
const DocTable: React.FC<DocTableProps> = ({ columns, rows, caption, className }) => {
  if (!rows.length) return null;

  return (
    <div className={cn('min-w-0', className)}>
      <div className="custom-scrollbar w-full overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">{caption ?? columns.map((c) => c.label).join(', ')}</caption>
          <thead>
            <tr className="border-y border-border/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="whitespace-nowrap px-3 py-2.5 text-left font-mono text-[11px] font-black uppercase tracking-[0.16em] text-text-muted"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-border/20 align-top">
                {columns.map((column, columnIndex) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-3 py-2.5 text-xs leading-relaxed',
                      column.mono
                        ? 'font-mono text-text-primary'
                        : 'font-mono text-text-secondary',
                      // First column carries the row identity — keep it tight.
                      columnIndex === 0 && 'whitespace-nowrap text-accent',
                    )}
                  >
                    {row[column.key] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <p className="mt-2 text-xs font-mono leading-relaxed text-text-muted">{caption}</p>
      )}
    </div>
  );
};

export default DocTable;
