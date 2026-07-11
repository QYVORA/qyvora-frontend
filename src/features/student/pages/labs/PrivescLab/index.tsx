import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Shield, Terminal, ArrowLeft, CheckCircle,
  Eye, EyeOff, Flag, FileText, Folder, Search,
} from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { PRIVESC_SCENARIOS } from '@/features/student/data/simulations/privesc-scenarios';
import type { PrivescScenario } from '@/features/student/data/simulations/types';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400',
  intermediate: 'bg-yellow-400/10 text-yellow-400',
  advanced: 'bg-red-400/10 text-red-400',
};

function fuzzyMatch(input: string, solution: string): boolean {
  const normalise = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const a = normalise(input);
  const b = normalise(solution);
  if (a === b) return true;
  const aTokens = a.split(' ').filter(Boolean);
  const bTokens = b.split(' ').filter(Boolean);
  if (bTokens.length <= 2) return a.includes(b);
  let matched = 0;
  for (const token of bTokens) {
    if (aTokens.some((t) => t.includes(token) || token.includes(t))) matched++;
  }
  return matched >= Math.ceil(bTokens.length * 0.7);
}

function buildTree(filesystem: Record<string, string>): TreeNode[] {
  const root: TreeNode = { name: '/', children: [], isDir: true };
  for (const path of Object.keys(filesystem)) {
    const parts = path.split('/').filter(Boolean);
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isLast = i === parts.length - 1;
      let child = current.children.find((c) => c.name === name);
      if (!child) {
        child = { name, children: [], isDir: !isLast, path };
        current.children.push(child);
      }
      current = child;
    }
  }
  return root.children;
}

interface TreeNode {
  name: string;
  children: TreeNode[];
  isDir: boolean;
  path?: string;
}

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  content: string;
}

const PrivescLab = () => {
  const [selectedScenario, setSelectedScenario] = useState<PrivescScenario | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [commandInput, setCommandInput] = useState('');
  const [executedCommands, setExecutedCommands] = useState<Set<number>>(new Set());
  const [hintIndex, setHintIndex] = useState(-1);
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showFileContent, setShowFileContent] = useState<string | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['/']));
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lineIdRef = useRef(0);

  const nextLineId = useCallback(() => {
    lineIdRef.current += 1;
    return lineIdRef.current;
  }, []);

  const addLine = useCallback((type: TerminalLine['type'], content: string) => {
    const id = nextLineId();
    setTerminalLines((prev) => [...prev, { id, type, content }]);
    return id;
  }, [nextLineId]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const tree = useMemo(() => {
    if (!selectedScenario) return [];
    return buildTree(selectedScenario.filesystem);
  }, [selectedScenario]);

  const toggleDir = useCallback((path: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const startScenario = useCallback((scenario: PrivescScenario) => {
    setSelectedScenario(scenario);
    setTerminalLines([]);
    setExecutedCommands(new Set());
    setHintIndex(-1);
    setFlagInput('');
    setFlagStatus('idle');
    setShowFileContent(null);
    lineIdRef.current = 0;
    setExpandedDirs(new Set(['/']));
    setTimeout(() => {
      addLine('info', `[ Simulation started: ${scenario.title} ]`);
      addLine('info', `[ Technique: ${scenario.technique} | Difficulty: ${scenario.difficulty} ]`);
      addLine('info', 'Type commands below. Use hints if you get stuck.\n');
      inputRef.current?.focus();
    }, 50);
  }, [addLine]);

  const exitScenario = useCallback(() => {
    setSelectedScenario(null);
    setTerminalLines([]);
    setCommandInput('');
    setExecutedCommands(new Set());
    setHintIndex(-1);
    setFlagInput('');
    setFlagStatus('idle');
    setShowFileContent(null);
  }, []);

  const showHint = useCallback(() => {
    if (!selectedScenario) return;
    const next = hintIndex + 1;
    if (next >= selectedScenario.hints.length) return;
    setHintIndex(next);
    addLine('info', `\n[ Hint ${next + 1}/${selectedScenario.hints.length} ]`);
    addLine('info', selectedScenario.hints[next]);
  }, [selectedScenario, hintIndex, addLine]);

  const getCommandOutput = useCallback((cmd: string): { output: string; matched: boolean } => {
    if (!selectedScenario) return { output: 'No scenario loaded', matched: false };
    const trimmed = cmd.trim();
    const fs = selectedScenario.filesystem;

    if (trimmed === 'whoami') {
      return { output: 'trainee', matched: true };
    }
    if (trimmed === 'id') {
      return { output: 'uid=1000(trainee) gid=1000(trainee) groups=1000(trainee)', matched: true };
    }
    if (trimmed === 'uname -r' || trimmed === 'uname -a') {
      return { output: 'Linux server01 3.13.0-24-generic #46-Ubuntu SMP x86_64 GNU/Linux', matched: true };
    }
    if (trimmed === 'ls' || trimmed === 'ls -la' || trimmed === 'ls -l') {
      const entries = Object.keys(fs)
        .filter((p) => p.split('/').length === 3)
        .map((p) => p.split('/').pop())
        .filter(Boolean)
        .join('  ');
      return { output: entries || 'total 0', matched: true };
    }
    if (trimmed.startsWith('cat ')) {
      const filePath = trimmed.slice(4).trim();
      if (fs[filePath] !== undefined) {
        return { output: fs[filePath], matched: true };
      }
      return { output: `cat: ${filePath}: No such file or directory`, matched: false };
    }
    if (trimmed.startsWith('find ')) {
      const suidFiles = Object.keys(fs).filter((p) => {
        return fs[p].includes('SUID') || p.includes('find') || (trimmed.includes('-perm') && fs[p].includes('4755'));
      });
      if (suidFiles.length > 0) {
        return { output: suidFiles.join('\n'), matched: true };
      }
      if (trimmed.includes('-perm') || trimmed.includes('4000')) {
        const suidEntries: string[] = [];
        for (const [path, content] of Object.entries(fs)) {
          if (content.includes('SUID') || content.includes('4755')) {
            suidEntries.push(path);
          }
        }
        if (suidEntries.length > 0) {
          return { output: suidEntries.join('\n'), matched: true };
        }
      }
      return { output: '', matched: true };
    }
    if (trimmed === 'sudo -l') {
      const sudoers = fs['/etc/sudoers'] || '';
      if (sudoers.includes('NOPASSWD')) {
        const lines = sudoers.split('\n').filter((l) => l.includes('NOPASSWD') || l.includes('ALL'));
        return { output: `User trainee may run the following commands:\n${lines.join('\n')}`, matched: true };
      }
      return { output: 'Sorry, user trainee may not run sudo on this host.', matched: true };
    }
    if (trimmed === 'crontab -l') {
      const crontab = fs['/etc/crontab'] || '';
      return { output: crontab || 'no crontab for trainee', matched: true };
    }
    if (trimmed.startsWith('getcap')) {
      const caps: string[] = [];
      for (const [path, content] of Object.entries(fs)) {
        if (content.includes('cap_') || content.includes('cap_setuid')) {
          caps.push(`${path} ${content.match(/cap_\w+=\w+/g)?.join(' ') || ''}`);
        }
      }
      return { output: caps.join('\n') || '', matched: true };
    }
    if (trimmed.startsWith('gcc ')) {
      return { output: '[Compiled successfully]', matched: true };
    }
    if (trimmed.startsWith('./')) {
      if (selectedScenario.solutionCommands.some((sc) => sc.startsWith(trimmed))) {
        return { output: '# id\nuid=0(root) gid=0(root) groups=0(root)', matched: true };
      }
      return { output: `bash: ${trimmed}: Permission denied`, matched: false };
    }
    if (trimmed.startsWith('echo ')) {
      return { output: '', matched: true };
    }
    if (trimmed === 'sleep 65' || trimmed.startsWith('sleep ')) {
      return { output: '[Waiting... simulation skip]', matched: true };
    }
    if (trimmed.startsWith('export ')) {
      return { output: '', matched: true };
    }
    if (trimmed.startsWith('su ') || trimmed.startsWith('su')) {
      return { output: '# id\nuid=0(root) gid=0(root) groups=0(root)', matched: true };
    }
    if (trimmed.startsWith('docker ')) {
      return { output: '# id\nuid=0(root) gid=0(root) groups=0(root)', matched: true };
    }
    if (trimmed.startsWith('mount')) {
      return { output: '/dev/sda1 on / type ext4 (rw,relatime)', matched: true };
    }
    if (trimmed === 'python3.4 -c "import os; os.setuid(0); os.system(\'/bin/bash\')"' ||
        trimmed.includes('python') && trimmed.includes('setuid')) {
      return { output: '# id\nuid=0(root) gid=0(root) groups=0(root)', matched: true };
    }
    if (trimmed.startsWith('openssl ')) {
      return { output: '$1$xyz$abc123hashvaluehere', matched: true };
    }
    if (trimmed === 'mkdir -p /home/dev/bin' || trimmed.startsWith('mkdir')) {
      return { output: '', matched: true };
    }
    if (trimmed.startsWith('chmod')) {
      return { output: '', matched: true };
    }
    if (trimmed.startsWith('rm ')) {
      return { output: '', matched: true };
    }
    if (trimmed.startsWith('ln ')) {
      return { output: '', matched: true };
    }

    for (let i = 0; i < selectedScenario.solutionCommands.length; i++) {
      const sol = selectedScenario.solutionCommands[i];
      if (fuzzyMatch(trimmed, sol)) {
        const solIdx = i;
        const nextSol = selectedScenario.solutionCommands[solIdx + 1];
        if (nextSol && nextSol.startsWith('cat ')) {
          const filePath = nextSol.slice(4).trim();
          if (fs[filePath] !== undefined) {
            return { output: fs[filePath], matched: true };
          }
        }
        return { output: `[Command accepted — step ${solIdx + 1} of ${selectedScenario.solutionCommands.length}]`, matched: true };
      }
    }

    return { output: `bash: ${trimmed.split(' ')[0]}: command not found`, matched: false };
  }, [selectedScenario]);

  const executeCommand = useCallback((cmd: string) => {
    if (!cmd.trim() || !selectedScenario) return;
    addLine('input', `$ ${cmd}`);
    const { output, matched } = getCommandOutput(cmd);
    if (output) {
      addLine(matched ? 'output' : 'error', output);
    }
    const matchedSolIdx = selectedScenario.solutionCommands.findIndex((sol) => fuzzyMatch(cmd, sol));
    if (matchedSolIdx >= 0) {
      setExecutedCommands((prev) => {
        const next = new Set(prev);
        next.add(matchedSolIdx);
        return next;
      });
    }
    setCommandInput('');
  }, [selectedScenario, addLine, getCommandOutput]);

  const handleFileClick = useCallback((path: string) => {
    if (!selectedScenario) return;
    if (selectedScenario.filesystem[path] !== undefined) {
      addLine('input', `$ cat ${path}`);
      addLine('output', selectedScenario.filesystem[path]);
      setShowFileContent(path);
    }
  }, [selectedScenario, addLine]);

  const submitFlag = useCallback(() => {
    if (!selectedScenario || !flagInput.trim()) return;
    if (flagInput.trim() === selectedScenario.flag) {
      setFlagStatus('correct');
      addLine('success', '\n🎉 FLAG CAPTURED! Privilege escalation successful!');
    } else {
      setFlagStatus('incorrect');
      addLine('error', '\n✗ Incorrect flag. Try again.');
    }
  }, [selectedScenario, flagInput, addLine]);

  const completedSteps = executedCommands.size;
  const totalSteps = selectedScenario?.solutionCommands.length || 0;

  if (!selectedScenario) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Privilege Escalation Lab" description="Escalate privileges in simulated Linux environments." />
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                Privilege <span className="text-accent">Escalation</span>
              </h1>
            </div>
            <p className="text-sm text-text-muted font-mono">
              Escalate from low-privilege user to root using Linux misconfigurations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRIVESC_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className="group text-left flex flex-col h-full rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Terminal className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-sm font-black text-text-primary group-hover:text-accent transition-colors leading-snug">
                    {scenario.title}
                  </h3>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">
                  {scenario.technique}
                </p>
                <p className="text-xs text-text-muted/70 font-mono leading-relaxed mb-4 flex-1 line-clamp-3">
                  {scenario.description}
                </p>
                <div className="flex items-center pt-3 border-t border-border/20">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${DIFFICULTY_STYLES[scenario.difficulty]}`}>
                    {scenario.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${selectedScenario.title} — Privilege Escalation`} description={selectedScenario.description} />
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={exitScenario}
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Scenarios</span>
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                {selectedScenario.title}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">{selectedScenario.technique}</span>
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${DIFFICULTY_STYLES[selectedScenario.difficulty]}`}>
                  {selectedScenario.difficulty}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-text-muted">Progress</div>
              <div className="font-mono text-sm font-black text-accent">
                {completedSteps} of {totalSteps} steps
              </div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          {/* Sidebar: Filesystem + Hints */}
          <div className="space-y-4">
            {/* Filesystem Browser */}
            <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
                <Folder className="w-4 h-4 text-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Filesystem</span>
              </div>
              <div className="p-2 max-h-[300px] overflow-y-auto">
                {tree.map((node) => (
                  <TreeItemWrapper
                    key={node.name}
                    node={node}
                    depth={0}
                    onFileClick={handleFileClick}
                    expandedDirs={expandedDirs}
                    toggleDir={toggleDir}
                    filesystem={selectedScenario.filesystem}
                  />
                ))}
              </div>
            </div>

            {/* File Content Preview */}
            {showFileContent && selectedScenario.filesystem[showFileContent] !== undefined && (
              <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent truncate max-w-[180px]">
                      {showFileContent}
                    </span>
                  </div>
                  <button onClick={() => setShowFileContent(null)} className="btn-secondary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest text-text-muted hover:text-text-primary">
                    <span className="text-xs">✕</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-text-muted/80 overflow-x-auto whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto">
                  {selectedScenario.filesystem[showFileContent]}
                </pre>
              </div>
            )}

            {/* Hints */}
            <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-accent" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent">Hints</span>
                </div>
                {hintIndex >= 0 && (
                  <span className="text-[9px] font-mono text-text-muted">
                    {hintIndex + 1}/{selectedScenario.hints.length}
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2">
                {hintIndex >= 0 && selectedScenario.hints.slice(0, hintIndex + 1).map((hint, i) => (
                  <div key={i} className="px-3 py-2 rounded-xl bg-accent/5 border border-accent/10 text-xs font-mono text-text-muted/80">
                    <span className="text-accent font-black mr-1">#{i + 1}</span>
                    {hint}
                  </div>
                ))}
                {hintIndex < selectedScenario.hints.length - 1 ? (
                  <button
                    onClick={showHint}
                    className="btn-secondary w-full flex items-center justify-center gap-2 px-3 py-2.5 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest text-text-muted hover:text-accent transition-colors"
                  >
                    {hintIndex < 0 ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {hintIndex < 0 ? 'Show Hint' : 'Next Hint'}
                  </button>
                ) : (
                  <div className="text-center text-[9px] font-mono text-text-muted/50 py-1">All hints revealed</div>
                )}
              </div>
            </div>
          </div>

          {/* Terminal Area */}
          <div className="flex flex-col rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
            {/* Terminal Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20 bg-bg-elevated/30">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
              <div className="flex items-center gap-2 ml-3">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-mono text-text-muted">trainee@server01:~$</span>
              </div>
            </div>

            {/* Output */}
            <div
              ref={terminalRef}
              className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[500px] font-mono text-sm"
            >
              {terminalLines.map((line) => (
                <div key={line.id} className={`whitespace-pre-wrap break-words ${
                  line.type === 'input' ? 'text-accent font-bold' :
                  line.type === 'error' ? 'text-red-400/80' :
                  line.type === 'success' ? 'text-green-400 font-bold' :
                  line.type === 'info' ? 'text-yellow-400/70' :
                  'text-text-muted/80'
                }`}>
                  {line.content}
                </div>
              ))}
            </div>

            {/* Command Input */}
            <div className="border-t border-border/20 px-4 py-3 flex items-center gap-3">
              <span className="text-accent font-mono text-sm font-bold shrink-0">$</span>
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') executeCommand(commandInput);
                }}
                placeholder="Type a command..."
                className="flex-1 bg-transparent outline-none font-mono text-sm text-text-primary placeholder:text-text-muted/30"
              />
              <button
                onClick={() => executeCommand(commandInput)}
                disabled={!commandInput.trim()}
                className="btn-primary !rounded-xl !text-[10px] px-4 py-2 disabled:opacity-50"
              >
                Run
              </button>
            </div>
          </div>
        </div>

        {/* Flag Submission */}
        <div className="rounded-2xl border border-border/30 bg-bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Flag className="w-4 h-4 text-accent" />
            <span className="text-[9px] font-black uppercase tracking-widest text-accent">Submit Flag</span>
          </div>
          {flagStatus === 'correct' ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-400/10 border border-green-400/20">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <div>
                <p className="text-sm font-black text-green-400">Privilege Escalation Successful!</p>
                <p className="text-xs font-mono text-text-muted mt-1">
                  You captured the flag with {hintIndex + 1} hint{hintIndex === 0 ? '' : 's'} used.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => { setFlagInput(e.target.value); setFlagStatus('idle'); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submitFlag(); }}
                placeholder="FLAG{...}"
                className="flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary font-mono text-sm focus:border-accent outline-none"
              />
              <button
                onClick={submitFlag}
                disabled={!flagInput.trim()}
                className="btn-primary !rounded-xl !text-[10px] px-6 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          )}
          {flagStatus === 'incorrect' && (
            <p className="text-xs text-red-400 mt-2 font-mono">Incorrect flag. Keep trying.</p>
          )}
        </div>
      </div>
    </div>
  );
};

function TreeItemWrapper(props: {
  node: TreeNode; depth: number; onFileClick: (path: string) => void;
  expandedDirs: Set<string>; toggleDir: (path: string) => void;
  filesystem: Record<string, string>;
}) {
  const { node, depth, onFileClick, expandedDirs, toggleDir, filesystem } = props;
  const dirPath = node.path || `/${node.name}`;
  const isExpanded = expandedDirs.has(dirPath);
  const hasRelevantContent = !node.isDir && node.path && filesystem[node.path] &&
    (filesystem[node.path].includes('FLAG') || filesystem[node.path].includes('flag'));

  return (
    <div>
      <button
        onClick={() => {
          if (node.isDir) toggleDir(dirPath);
          else onFileClick(dirPath);
        }}
        className={`flex items-center gap-2 w-full px-2 py-1 rounded-lg text-left transition-colors ${
          node.isDir ? 'cursor-pointer hover:bg-bg-elevated' : 'cursor-pointer hover:bg-accent/10'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {node.isDir ? (
          <Folder className={`w-3.5 h-3.5 shrink-0 ${isExpanded ? 'text-accent' : 'text-yellow-400'}`} />
        ) : (
          <FileText className={`w-3.5 h-3.5 shrink-0 ${hasRelevantContent ? 'text-accent' : 'text-text-muted'}`} />
        )}
        <span className={`text-xs font-mono truncate ${
          node.isDir ? 'text-text-primary font-bold' :
          hasRelevantContent ? 'text-accent font-bold' : 'text-text-muted'
        }`}>
          {node.name}
        </span>
        {hasRelevantContent && <span className="ml-auto text-[8px] font-black text-accent/60">★</span>}
      </button>
      {node.isDir && isExpanded && node.children.map((child) => (
        <TreeItemWrapper
          key={child.name}
          node={child}
          depth={depth + 1}
          onFileClick={onFileClick}
          expandedDirs={expandedDirs}
          toggleDir={toggleDir}
          filesystem={filesystem}
        />
      ))}
    </div>
  );
}

export default PrivescLab;
