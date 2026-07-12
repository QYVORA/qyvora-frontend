import { useState, useCallback } from 'react';
import { Shield, Terminal, ArrowLeft, CheckCircle, Flag, AlertTriangle } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { PRIVESC_SCENARIOS } from '@/features/student/data/simulations/privesc-scenarios';
import type { PrivescScenario } from '@/features/student/data/simulations/types';
import { verifyLabFlag } from '../../../services/lab.service';
import { LabTerminal } from '../../../components/lab/LabTerminal';
import { LabStoryPanel } from '../../../components/lab/LabStoryPanel';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400',
  intermediate: 'bg-yellow-400/10 text-yellow-400',
  advanced: 'bg-red-400/10 text-red-400',
};

const PrivescLab = () => {
  const [selectedScenario, setSelectedScenario] = useState<PrivescScenario | null>(null);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [currentChapterId, setCurrentChapterId] = useState<string>('');
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [flagLoading, setFlagLoading] = useState(false);
  const [showHint, setShowHint] = useState<string | null>(null);

  const startScenario = useCallback((scenario: PrivescScenario) => {
    setSelectedScenario(scenario);
    setCompletedChapters([]);
    setCurrentChapterId(scenario.story?.chapters[0]?.id || '');
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
    setShowHint(null);
  }, []);

  const exitScenario = useCallback(() => {
    setSelectedScenario(null);
    setCompletedChapters([]);
    setCurrentChapterId('');
    setFlagInput('');
    setFlagStatus('idle');
    setFlagLoading(false);
    setShowHint(null);
  }, []);

  const handleChapterComplete = useCallback(
    (chapterId: string) => {
      if (!completedChapters.includes(chapterId)) {
        setCompletedChapters((prev) => [...prev, chapterId]);
      }
      if (selectedScenario?.story) {
        const chapters = selectedScenario.story.chapters;
        const idx = chapters.findIndex((ch) => ch.id === chapterId);
        if (idx < chapters.length - 1) {
          setCurrentChapterId(chapters[idx + 1].id);
        }
      }
    },
    [completedChapters, selectedScenario]
  );

  const handleFlagFound = useCallback(() => {
    if (selectedScenario?.story) {
      const lastChapter = selectedScenario.story.chapters[selectedScenario.story.chapters.length - 1];
      if (lastChapter && !completedChapters.includes(lastChapter.id)) {
        setCompletedChapters((prev) => [...prev, lastChapter.id]);
      }
    }
  }, [selectedScenario, completedChapters]);

  const submitFlag = useCallback(async () => {
    if (!selectedScenario || !flagInput.trim() || flagLoading) return;
    setFlagLoading(true);
    try {
      const result = await verifyLabFlag('privesc', selectedScenario.id, flagInput.trim());
      if (result.correct) {
        setFlagStatus('correct');
      } else {
        setFlagStatus('incorrect');
      }
    } catch {
      setFlagStatus('incorrect');
    } finally {
      setFlagLoading(false);
    }
  }, [selectedScenario, flagInput, flagLoading]);

  const handleHintRequest = useCallback((hint: string) => {
    setShowHint(hint);
  }, []);

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
                  {scenario.story && (
                    <span className="ml-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent/10 text-accent">
                      {scenario.story.chapters.length} chapters
                    </span>
                  )}
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
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">
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
              <div className="text-xs font-mono text-text-muted">Chapters</div>
              <div className="font-mono text-sm font-black text-accent">
                {completedChapters.length} of {selectedScenario.story?.chapters.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          {/* Story Panel */}
          {selectedScenario.story && (
            <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
              <LabStoryPanel
                story={selectedScenario.story}
                completedChapters={completedChapters}
                currentChapterId={currentChapterId}
                onHintRequest={handleHintRequest}
              />
            </div>
          )}

          {/* Terminal */}
          <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden min-h-[500px]">
            <LabTerminal
              scenario={selectedScenario}
              onChapterComplete={handleChapterComplete}
              onFlagFound={handleFlagFound}
            />
          </div>
        </div>

        {/* Hint Modal */}
        {showHint && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80">
            <div className="bg-bg border border-border/30 rounded-2xl p-6 max-w-md mx-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-text-primary">Hint</h3>
              </div>
              <p className="text-sm text-text-secondary font-mono mb-4">{showHint}</p>
              <button
                onClick={() => setShowHint(null)}
                className="btn-secondary w-full"
              >
                Got it
              </button>
            </div>
          </div>
        )}

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
                  You captured the flag with {completedChapters.length} chapters completed.
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
                disabled={!flagInput.trim() || flagLoading}
                className="btn-primary !rounded-xl !text-[10px] px-6 disabled:opacity-50"
              >
                {flagLoading ? 'Verifying...' : 'Submit'}
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

export default PrivescLab;
