import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import {
  X, Play, RotateCcw, Copy, Check, FileCode2, Maximize2, Minimize2,
  Search, GitBranch, Puzzle, ChevronDown, ChevronRight,
  Settings, Files, TerminalSquare, Save, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { TerminalShell } from '@/features/student/components/SimulatedTerminal/TerminalShell';
import type { TerminalContext } from '@/features/student/components/SimulatedTerminal/types';

export type IdeLanguage = 'python' | 'bash' | 'javascript';

export interface IdeFile {
  id: string;
  name: string;
  language: IdeLanguage;
  content: string;
}

export interface IdeOutputRule {
  matchPattern: RegExp | ((code: string) => boolean);
  output: string;
  exitCode?: number;
}

export interface IdeContext {
  lessonId?: string;
  labId?: string;
  language: IdeLanguage;
  rules: IdeOutputRule[];
  fallback: string;
}

interface IdeProps {
  files: IdeFile[];
  context?: IdeContext;
  terminalContext?: TerminalContext;
  title?: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  standalone?: boolean;
}

const LANGUAGE_LABELS: Record<IdeLanguage, string> = {
  python: 'Python',
  bash: 'Shell Script',
  javascript: 'JavaScript',
};

const LANGUAGE_COLORS: Record<IdeLanguage, string> = {
  python: '#3572A5',
  bash: '#89e051',
  javascript: '#f1e05a',
};

// ─── File Icons (clear at small sizes) ────────────────────────────────────────

function FileIcon({ language, size = 16 }: { language: IdeLanguage; size?: number }) {
  const s = size;
  if (language === 'python') {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="2" fill="#3776AB"/>
        <text x="8" y="11.5" textAnchor="middle" fontSize="8" fill="#FFD43B" fontFamily="monospace" fontWeight="bold">Py</text>
      </svg>
    );
  }
  if (language === 'javascript') {
    return (
      <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
        <rect width="16" height="16" rx="2" fill="#F7DF1E"/>
        <text x="8" y="11.5" textAnchor="middle" fontSize="8" fill="#000" fontFamily="monospace" fontWeight="bold">JS</text>
      </svg>
    );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="2" fill="#4EAA25"/>
      <text x="8" y="11.5" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="monospace" fontWeight="bold">$_</text>
    </svg>
  );
}

// ─── Token-based syntax highlighting ──────────────────────────────────────────

type TokenType = 'comment' | 'keyword' | 'builtin' | 'constant' | 'string' | 'number' | 'decorator' | 'plain';

interface Token {
  text: string;
  type: TokenType;
}

const TOKEN_COLORS: Record<TokenType, string> = {
  comment:  '#6A9955',
  keyword:  '#C586C0',
  builtin:  '#DCDCAA',
  constant: '#569CD6',
  string:   '#CE9178',
  number:   '#B5CEA8',
  decorator: '#DCDCAA',
  plain:    '#D4D4D4',
};

const PYTHON_KEYWORDS = new Set(['def','class','import','from','return','if','elif','else','for','while','try','except','finally','with','as','in','not','and','or','is','lambda','yield','raise','pass','break','continue','global','nonlocal','assert','del','async','await','self']);
const PYTHON_CONSTANTS = new Set(['True','False','None']);
const PYTHON_BUILTINS = new Set(['print','len','range','str','int','float','list','dict','set','tuple','type','input','open','super','isinstance','enumerate','zip','map','filter','sorted','reversed','abs','min','max','sum','round','any','all','format','hasattr','getattr','setattr','property','staticmethod','classmethod','__init__','__str__','__repr__']);

const JS_KEYWORDS = new Set(['const','let','var','function','return','if','else','for','while','do','switch','case','break','continue','new','this','class','extends','import','from','export','default','async','await','try','catch','finally','throw','typeof','instanceof','of','in']);
const JS_CONSTANTS = new Set(['null','undefined','true','false','NaN','Infinity']);
const JS_BUILTINS = new Set(['console','document','window','Math','JSON','Promise','Array','Object','String','Number','Map','Set','Error','RegExp','Date','Symbol','Proxy','WeakMap','WeakSet','parseInt','parseFloat','setTimeout','setInterval','clearTimeout','clearInterval','fetch','Response','Request','Headers','URL','FormData']);

const BASH_KEYWORDS = new Set(['echo','ls','cd','pwd','cat','grep','find','mkdir','rm','cp','mv','chmod','chown','sudo','apt','apt-get','pip','npm','npx','git','docker','curl','wget','ssh','scp','tar','zip','unzip','head','tail','wc','sort','uniq','sed','awk','cut','tr','tee','xargs','whoami','id','uname','date','ps','top','kill','export','alias','source','clear','exit','history','man','which','df','du','mount','ping','ifconfig','ip','netstat','ss','dig','nslookup','nmap','iptables','systemctl','service','bash','sh']);

function tokenizeLine(line: string, language: IdeLanguage): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const keywords = language === 'python' ? PYTHON_KEYWORDS : language === 'bash' ? BASH_KEYWORDS : JS_KEYWORDS;
  const constants = language === 'python' ? PYTHON_CONSTANTS : JS_CONSTANTS;
  const builtins = language === 'python' ? PYTHON_BUILTINS : JS_BUILTINS;

  while (i < line.length) {
    // Comments
    if (language === 'javascript') {
      if (line[i] === '/' && line[i + 1] === '/') {
        tokens.push({ text: line.slice(i), type: 'comment' });
        break;
      }
    } else {
      if (line[i] === '#') {
        tokens.push({ text: line.slice(i), type: 'comment' });
        break;
      }
    }

    // Strings (single, double, f-strings, template)
    if (line[i] === "'" || line[i] === '"' || line[i] === '`') {
      const quote = line[i];
      // Check for f-string prefix (Python)
      const isFString = language === 'python' && i > 0 && line[i - 1] === 'f';
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === '\\') j++;
        j++;
      }
      j++; // past closing quote
      const start = isFString ? i - 1 : i;
      tokens.push({ text: line.slice(start, j), type: 'string' });
      i = j;
      continue;
    }

    // Decorator (Python)
    if (language === 'python' && line[i] === '@') {
      let j = i + 1;
      while (j < line.length && /\w/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: 'decorator' });
      i = j;
      continue;
    }

    // Numbers
    if (/\d/.test(line[i]) && (i === 0 || !/\w/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\d.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: 'number' });
      i = j;
      continue;
    }

    // Bash variable $VAR or ${VAR}
    if (language === 'bash' && line[i] === '$') {
      let j = i + 1;
      if (j < line.length && line[j] === '{') {
        j++;
        while (j < line.length && line[j] !== '}') j++;
        j++;
      } else {
        while (j < line.length && /\w/.test(line[j])) j++;
      }
      tokens.push({ text: line.slice(i, j), type: 'constant' });
      i = j;
      continue;
    }

    // Words (identifiers / keywords)
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\w]/.test(line[j])) j++;
      const word = line.slice(i, j);

      // Check for function call: word followed by (
      const isCall = j < line.length && line[j] === '(';

      if (constants.has(word)) {
        tokens.push({ text: word, type: 'constant' });
      } else if (keywords.has(word)) {
        tokens.push({ text: word, type: 'keyword' });
      } else if (builtins.has(word) || isCall) {
        tokens.push({ text: word, type: 'builtin' });
      } else {
        tokens.push({ text: word, type: 'plain' });
      }
      i = j;
      continue;
    }

    // Operators and punctuation
    tokens.push({ text: line[i], type: 'plain' });
    i++;
  }

  return tokens;
}

function HighlightedCode({ code, language }: { code: string; language: IdeLanguage }) {
  const lines = useMemo(() => code.split('\n'), [code, language]);

  return (
    <>
      {lines.map((line, lineIdx) => {
        const tokens = tokenizeLine(line, language);
        return (
          <div key={lineIdx} className="flex hover:bg-white/[0.03]">
            {tokens.map((token, tokenIdx) => (
              <span key={tokenIdx} style={{ color: TOKEN_COLORS[token.type] }}>
                {token.text}
              </span>
            ))}
            {tokens.length === 0 && <span>&nbsp;</span>}
          </div>
        );
      })}
    </>
  );
}

// ─── Code execution ───────────────────────────────────────────────────────────

function executeWithRules(code: string, context?: IdeContext): { output: string; exitCode: number } {
  if (context?.rules) {
    for (const rule of context.rules) {
      const matches = typeof rule.matchPattern === 'function'
        ? rule.matchPattern(code)
        : rule.matchPattern.test(code);
      if (matches) return { output: rule.output, exitCode: rule.exitCode ?? 0 };
    }
    return {
      output: context.fallback || "No matching output — check your syntax against the lesson's expected approach.",
      exitCode: 1,
    };
  }
  const lang = context?.language || 'python';
  if (lang === 'python' && code.includes('print')) {
    const match = code.match(/print\((['"])(.+?)\1\)/);
    if (match) return { output: match[2], exitCode: 0 };
  }
  if (lang === 'bash') {
    if (code.startsWith('echo ')) return { output: code.slice(5).replace(/['"]/g, ''), exitCode: 0 };
    if (code.startsWith('ls')) return { output: 'Desktop  Documents  Downloads  Pictures  Projects', exitCode: 0 };
    if (code.startsWith('pwd')) return { output: '/home/user', exitCode: 0 };
    if (code.startsWith('whoami')) return { output: 'user', exitCode: 0 };
    if (code.startsWith('date')) return { output: new Date().toString(), exitCode: 0 };
  }
  if (lang === 'javascript' && code.includes('console.log')) {
    const match = code.match(/console\.log\((['"])(.+?)\1\)/);
    if (match) return { output: match[2], exitCode: 0 };
  }
  return {
    output: "No matching output — check your syntax against the lesson's expected approach.",
    exitCode: 1,
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Ide: React.FC<IdeProps> = ({ files, context, terminalContext, title = 'IDE', open, onOpenChange, standalone }) => {
  const [activeFileId, setActiveFileId] = useState(files[0]?.id || '');
  const [fileContents, setFileContents] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    files.forEach(f => { initial[f.id] = f.content; });
    return initial;
  });
  const [output, setOutput] = useState<string | null>(null);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sidebarPanel, setSidebarPanel] = useState<'files' | 'search'>('files');
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const [bottomPanelTab, setBottomPanelTab] = useState<'output' | 'terminal'>('output');
  const [saveFlash, setSaveFlash] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const currentContent = fileContents[activeFileId] || '';
  const isModified = fileContents[activeFileId] !== files.find(f => f.id === activeFileId)?.content;

  const handleRun = useCallback(() => {
    const result = executeWithRules(currentContent, context || { language: activeFile?.language || 'python', rules: [], fallback: '' });
    setOutput(result.output);
    setExitCode(result.exitCode);
    setBottomPanelOpen(true);
    setBottomPanelTab('output');
  }, [currentContent, context, activeFile]);

  const handleReset = useCallback(() => {
    setFileContents(prev => ({ ...prev, [activeFileId]: activeFile?.content || '' }));
    setOutput(null);
    setExitCode(null);
  }, [activeFileId, activeFile]);

  const handleSave = useCallback(() => {
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currentContent]);

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newContent = currentContent.substring(0, start) + '  ' + currentContent.substring(end);
      setFileContents(prev => ({ ...prev, [activeFileId]: newContent }));
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
        syncScroll();
      });
    }
  }, [currentContent, activeFileId]);

  const syncScroll = useCallback(() => {
    if (editorRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = editorRef.current.scrollTop;
      highlightRef.current.scrollLeft = editorRef.current.scrollLeft;
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun, handleSave]);

  const handleSidebarIconClick = (panel: typeof sidebarPanel) => {
    if (sidebarExpanded && sidebarPanel === panel) {
      setSidebarExpanded(false);
    } else {
      setSidebarPanel(panel);
      setSidebarExpanded(true);
    }
  };

  const shell = (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-mono select-none">
      {/* Title Bar */}
      <div className="flex items-center h-9 px-2 bg-[#323233] border-b border-[#3c3c3c] shrink-0">
        <div className="flex items-center gap-1.5 mr-4">
          <FileCode2 size={14} className="text-[#007acc]" />
          <span className="text-[11px] font-bold text-[#cccccc]">QYVORA</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#999]">
          <span className="px-1.5 hover:bg-[#ffffff10] rounded cursor-pointer">File</span>
          <span className="px-1.5 hover:bg-[#ffffff10] rounded cursor-pointer">Edit</span>
          <span className="px-1.5 hover:bg-[#ffffff10] rounded cursor-pointer">View</span>
          <span className="px-1.5 hover:bg-[#ffffff10] rounded cursor-pointer">Run</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button onClick={handleSave} className="flex items-center gap-1 px-2 py-1 text-[10px] text-[#999] hover:text-[#ccc] hover:bg-[#ffffff10] rounded transition-colors">
            <Save size={11} />
            {saveFlash ? <span className="text-green-400">Saved</span> : 'Save'}
          </button>
          <button onClick={() => setIsFullscreen(prev => !prev)} className="flex items-center justify-center h-6 w-8 hover:bg-[#ffffff10] transition-colors text-[#999] hover:text-[#ccc]">
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          <button onClick={() => onOpenChange(false)} className="flex items-center justify-center h-6 w-8 hover:bg-[#e81123] transition-colors text-[#999] hover:text-white">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex min-h-0">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 border-r border-[#3c3c3c] shrink-0">
          <SidebarIcon icon={Files} active={sidebarExpanded && sidebarPanel === 'files'} onClick={() => handleSidebarIconClick('files')} />
          <SidebarIcon icon={Search} active={sidebarExpanded && sidebarPanel === 'search'} onClick={() => handleSidebarIconClick('search')} />
          <div className="flex-1" />
          <SidebarIcon icon={Play} active={false} onClick={handleRun} accent />
          <SidebarIcon icon={Settings} active={false} onClick={() => {}} />
        </div>

        {/* Side Panel */}
        {sidebarExpanded && (
          <div className="w-56 bg-[#252526] border-r border-[#3c3c3c] flex flex-col shrink-0 overflow-hidden animate-in slide-in-from-left-4 fade-in duration-150">
            <div className="flex items-center justify-between h-9 px-3 border-b border-[#3c3c3c] shrink-0">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#999]">
                {sidebarPanel === 'files' ? 'EXPLORER' : 'SEARCH'}
              </span>
              <button onClick={() => setSidebarExpanded(false)} className="text-[#666] hover:text-[#ccc]">
                <PanelLeftClose size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {sidebarPanel === 'files' && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#cccccc]">
                    <ChevronDown size={12} className="text-[#999]" />
                    <span>PROJECT</span>
                  </div>
                  <div className="pb-2">
                    {files.map((file) => {
                      const isActive = file.id === activeFileId;
                      const modified = fileContents[file.id] !== file.content;
                      return (
                        <button
                          key={file.id}
                          onClick={() => setActiveFileId(file.id)}
                          className={`w-full flex items-center gap-2 px-3 py-[5px] text-left text-[12px] transition-colors ${
                            isActive ? 'bg-[#094771] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                          }`}
                        >
                          <FileIcon language={file.language} size={14} />
                          <span className="font-mono truncate flex-1">{file.name}</span>
                          {modified && <span className="w-2 h-2 rounded-full bg-[#e0e0e0] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {files.some(f => fileContents[f.id] !== f.content) && (
                    <div className="px-3 py-1 border-t border-[#3c3c3c]">
                      <span className="text-[9px] text-[#e0e0e0] bg-[#4d4d4d] px-1.5 py-0.5 rounded">Unsaved changes</span>
                    </div>
                  )}
                </div>
              )}
              {sidebarPanel === 'search' && (
                <div className="p-3">
                  <input placeholder="Search in files..." className="w-full px-2.5 py-1.5 bg-[#3c3c3c] border border-[#555] rounded text-[12px] text-[#ccc] font-mono outline-none focus:border-[#007acc]" />
                </div>
              )}
            </div>
          </div>
        )}

        {!sidebarExpanded && (
          <button onClick={() => setSidebarExpanded(true)} className="w-0 flex items-center justify-center bg-[#252526] border-r border-[#3c3c3c] hover:bg-[#2a2d2e] transition-colors group" title="Expand sidebar">
            <PanelLeftOpen size={14} className="text-[#666] group-hover:text-[#ccc]" />
          </button>
        )}

        {/* Editor + Bottom Panel */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {/* Tab bar */}
          <div className="flex items-center h-9 bg-[#252526] border-b border-[#3c3c3c] shrink-0 overflow-x-auto">
            {files.map((file) => {
              const isActive = file.id === activeFileId;
              const modified = fileContents[file.id] !== file.content;
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`flex items-center gap-1.5 h-full px-3 text-[11px] border-r border-[#3c3c3c] transition-colors shrink-0 ${
                    isActive ? 'bg-[#1e1e1e] text-[#ffffff] border-t-[2px] border-t-[#007acc]' : 'bg-[#2d2d2d] text-[#999] hover:bg-[#2a2d2e] hover:text-[#ccc]'
                  }`}
                >
                  <FileIcon language={file.language} size={12} />
                  <span className="font-mono">{file.name}</span>
                  {modified && <span className="w-1.5 h-1.5 rounded-full bg-[#e0e0e0] ml-1" />}
                </button>
              );
            })}
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center h-6 px-3 bg-[#1e1e1e] border-b border-[#3c3c3c] text-[10px] text-[#888] shrink-0">
            <span>PROJECT</span>
            <ChevronRight size={10} className="mx-0.5" />
            <span className="text-[#ccc]">{activeFile?.name}</span>
            <span className="mx-1.5 text-[#555]">&middot;</span>
            <span style={{ color: LANGUAGE_COLORS[activeFile?.language || 'python'] }}>{LANGUAGE_LABELS[activeFile?.language || 'python']}</span>
            {isModified && <span className="ml-2 text-[#e0e0e0]">&bull; modified</span>}
          </div>

          {/* Editor (overlay: pre behind, textarea on top) */}
          <div className="flex-1 min-h-0 overflow-hidden bg-[#1e1e1e] relative">
            <div className="absolute inset-0 overflow-auto" ref={highlightRef}>
              <div className="flex">
                <div className="shrink-0 pt-3 pb-3 pl-3 pr-1 text-right bg-[#1e1e1e]">
                  {currentContent.split('\n').map((_, i) => (
                    <div key={i} className="text-[13px] leading-[1.6] text-[#858585] select-none pr-2">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <pre
                  className="flex-1 pt-3 pb-3 pr-3 pl-0 text-[13px] leading-[1.6] font-mono whitespace-pre m-0 pointer-events-none"
                  style={{ tabSize: 2, minHeight: '100%' }}
                >
                  <HighlightedCode code={currentContent} language={activeFile?.language || 'python'} />
                </pre>
              </div>
            </div>
            <textarea
              ref={editorRef}
              value={currentContent}
              onChange={(e) => setFileContents(prev => ({ ...prev, [activeFileId]: e.target.value }))}
              onKeyDown={handleTabKeyDown}
              onScroll={syncScroll}
              className="absolute inset-0 flex w-full h-full bg-transparent text-transparent font-mono text-[13px] pt-3 pb-3 pl-[3.75rem] pr-3 border-none outline-none resize-none leading-[1.6] caret-[#aeafad] overflow-auto"
              style={{ tabSize: 2, caretColor: '#aeafad', WebkitTextFillColor: 'transparent' }}
              spellCheck={false}
              autoFocus
            />
          </div>

          {/* Bottom Panel */}
          {bottomPanelOpen && (
            <div className="h-[200px] flex flex-col border-t border-[#3c3c3c] shrink-0">
              <div className="flex items-center h-8 bg-[#1e1e1e] border-b border-[#3c3c3c] shrink-0 px-1">
                <button onClick={() => setBottomPanelTab('output')} className={`flex items-center gap-1.5 h-full px-3 text-[11px] transition-colors ${bottomPanelTab === 'output' ? 'text-[#ffffff] border-t-[2px] border-t-[#007acc]' : 'text-[#999] hover:text-[#ccc]'}`}>
                  <TerminalSquare size={12} /> OUTPUT
                </button>
                <button onClick={() => setBottomPanelTab('terminal')} className={`flex items-center gap-1.5 h-full px-3 text-[11px] transition-colors ${bottomPanelTab === 'terminal' ? 'text-[#ffffff] border-t-[2px] border-t-[#007acc]' : 'text-[#999] hover:text-[#ccc]'}`}>
                  <TerminalSquare size={12} /> TERMINAL
                </button>
                <div className="flex-1" />
                <button onClick={() => setBottomPanelOpen(false)} className="flex items-center justify-center h-5 w-5 text-[#666] hover:text-[#ccc] hover:bg-[#ffffff10] rounded">
                  <X size={12} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
                {bottomPanelTab === 'output' ? (
                  <div className="h-full overflow-auto p-3">
                    {output ? (
                      <pre className={`text-[13px] font-mono whitespace-pre-wrap leading-relaxed ${exitCode === 0 ? 'text-[#d4d4d4]' : 'text-[#f48771]'}`}>{output}</pre>
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#555] text-[12px] font-mono">No output — run your code to see results</div>
                    )}
                  </div>
                ) : (
                  <div className="h-full [&>div:first-child]:hidden">
                    <TerminalShell context={terminalContext} onClose={() => setBottomPanelOpen(false)} />
                  </div>
                )}
              </div>
            </div>
          )}

          {!bottomPanelOpen && (
            <button onClick={() => setBottomPanelOpen(true)} className="h-6 bg-[#007acc] flex items-center px-3 text-[10px] text-white hover:bg-[#0098ff] transition-colors shrink-0">
              <TerminalSquare size={10} className="mr-1.5" /> Show Panel
            </button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center h-6 px-2 bg-[#007acc] text-[10px] text-white shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><GitBranch size={10} /> main</span>
          <span>0 errors</span>
          <span>0 warnings</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          {isModified && <span className="font-bold">Modified</span>}
          <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
          <span>{LANGUAGE_LABELS[activeFile?.language || 'python']}</span>
          <span>UTF-8</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );

  if (!open) return null;
  if (standalone) return <div className="h-dvh w-screen overflow-hidden">{shell}</div>;
  if (isFullscreen) return <div className="fixed inset-0 z-[201]">{shell}</div>;

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-[200] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          aria-label="IDE"
          onKeyDown={(e) => { if (e.key === 'Tab') e.stopPropagation(); }}
          className="fixed z-[201] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] max-w-[1400px] h-[88vh] max-h-[92vh] flex flex-col overflow-hidden rounded-lg border border-[#3c3c3c] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-150"
        >
          <RadixDialog.Title className="sr-only">IDE</RadixDialog.Title>
          {shell}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

function SidebarIcon({ icon: Icon, active, onClick, accent }: {
  icon: typeof Files;
  active: boolean;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center transition-colors relative ${
        active ? 'text-white' : accent ? 'text-[#999] hover:text-[#007acc]' : 'text-[#999] hover:text-[#ccc]'
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-white rounded-r" />}
      <Icon size={20} strokeWidth={1.5} />
    </button>
  );
}

export default Ide;
