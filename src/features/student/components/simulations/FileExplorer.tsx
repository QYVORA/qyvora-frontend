import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Hash, Clock, Lock } from 'lucide-react';
import type { SimFile } from './types';

interface FileExplorerProps {
  files: SimFile[];
}

function FileNode({ file, depth = 0, onSelect, selectedPath }: {
  file: SimFile; depth?: number; onSelect: (f: SimFile) => void; selectedPath: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isDir = file.type === 'dir';
  const isSelected = selectedPath === file.name;

  return (
    <div>
      <button
        onClick={() => { if (isDir) setExpanded(!expanded); else onSelect(file); }}
        className={`w-full flex items-center gap-2 px-2 py-1 text-[10px] font-mono transition-colors ${
          isSelected ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isDir ? (
          expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
        ) : <span className="w-3" />}
        {isDir ? <Folder size={12} className="text-yellow-400" /> : <File size={12} className="text-text-muted" />}
        <span className="truncate">{file.name}</span>
        {!isDir && <span className="ml-auto text-text-muted/50">{formatSize(file.size)}</span>}
      </button>
      {isDir && expanded && file.children?.map(child => (
        <FileNode key={child.name} file={child} depth={depth + 1} onSelect={onSelect} selectedPath={selectedPath} />
      ))}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function FileExplorer({ files }: FileExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<SimFile | null>(null);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
      <div className="px-4 py-3 bg-bg-elevated border-b border-border/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent">File Explorer</p>
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* File Tree */}
        <div className="w-[220px] border-r border-border/20 overflow-auto shrink-0 py-1">
          {files.map(f => (
            <FileNode key={f.name} file={f} onSelect={setSelectedFile} selectedPath={selectedFile?.name || ''} />
          ))}
        </div>

        {/* File Detail */}
        <div className="flex-1 min-w-0 p-4 overflow-auto">
          {selectedFile ? (
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-3">{selectedFile.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-4">
                <div><span className="text-text-muted">Type:</span> <span className="text-text-primary">{selectedFile.type}</span></div>
                <div><span className="text-text-muted">Size:</span> <span className="text-text-primary">{formatSize(selectedFile.size)}</span></div>
                <div className="flex items-center gap-1"><Clock size={10} className="text-text-muted" /> <span className="text-text-primary">{selectedFile.modified}</span></div>
                <div className="flex items-center gap-1"><Lock size={10} className="text-text-muted" /> <span className="text-text-primary">{selectedFile.permissions}</span></div>
                {selectedFile.hash && (
                  <div className="col-span-2 flex items-center gap-1"><Hash size={10} className="text-text-muted" /> <span className="text-text-primary break-all">{selectedFile.hash}</span></div>
                )}
              </div>
              {selectedFile.content && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-accent mb-2">Content</p>
                  <pre className="text-[10px] font-mono text-text-muted bg-black/40 rounded p-3 whitespace-pre-wrap overflow-auto max-h-[300px]">
                    {selectedFile.content}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted/50 text-[11px] font-mono">
              Select a file to inspect
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
