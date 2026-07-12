import { useState, useCallback } from 'react';
import { Shield, Terminal, ArrowLeft, CheckCircle, Flag, AlertTriangle, BookOpen, Target } from 'lucide-react';
import SEO from '@/shared/components/SEO';
import { PRIVESC_SCENARIOS } from '@/features/student/data/simulations/privesc-scenarios';
import type { PrivescScenario } from '@/features/student/data/simulations/types';
import { verifyLabFlag } from '../../../services/lab.service';
import { LabTerminal } from '../../../components/lab/LabTerminal';
import { LabStoryPanel } from '../../../components/lab/LabStoryPanel';

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-green-400/10 text-green-400 border-green-400/20',
  intermediate: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  advanced: 'bg-red-400/10 text-red-400 border-red-400/20',
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

  const totalChapters = selectedScenario?.story?.chapters.length || 0;
  const completedCount = completedChapters.length;

  // ─── Scenario Selection Screen ─────────────────────────────────────────
  if (!selectedScenario) {
    return (
      <div className="bg-bg min-h-full">
        <SEO title="Privilege Escalation Lab" description="Escalate privileges in simulated Linux environments." />
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">
          {/* Mission Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tight">
                  Privilege <span className="text-accent">Escalation</span>
                </h1>
              </div>
            </div>
            <p className="text-base text-text-muted font-mono max-w-2xl">
              Escalate from low-privilege user to root using Linux misconfigurations. Each scenario is a self-contained mission with a storyline.
            </p>
          </div>

          {/* Separator */}
          <div className="border-t border-border/30 mb-10" />

          {/* Mission List */}
          <div className="space-y-4">
            {PRIVESC_SCENARIOS.map((scenario, index) => (
              <button
                key={scenario.id}
                onClick={() => startScenario(scenario)}
                className="group w-full text-left rounded-2xl border border-border/30 bg-bg-card p-6 hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  {/* Mission Number */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 transition-colors">
                    <span className="text-sm font-black text-text-muted group-hover:text-accent transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Mission Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-text-primary group-hover:text-accent transition-colors">
                        {scenario.title}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[scenario.difficulty]}`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-accent/70 mb-2">
                      {scenario.technique}
                    </p>
                    <p className="text-sm text-text-muted/70 font-mono leading-relaxed line-clamp-2">
                      {scenario.description}
                    </p>
                  </div>

                  {/* Chapters Badge */}
                  {scenario.story && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-border/20 shrink-0">
                      <BookOpen className="w-4 h-4 text-text-muted" />
                      <span className="text-xs font-mono text-text-muted">
                        {scenario.story.chapters.length} tasks
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Active Mission Screen ─────────────────────────────────────────────
  return (
    <div className="bg-bg min-h-full">
      <SEO title={`${selectedScenario.title} — Privilege Escalation`} description={selectedScenario.description} />
      <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24">

        {/* ── Section 1: Mission Header ──────────────────────────────────── */}
        <div className="mb-8">
          <button
            onClick={exitScenario}
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">All Missions</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight">
                  {selectedScenario.title}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-accent">{selectedScenario.technique}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${DIFFICULTY_STYLES[selectedScenario.difficulty]}`}>
                    {selectedScenario.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Badge */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-border/20">
              <Target className="w-4 h-4 text-accent" />
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Progress</div>
                <div className="font-mono text-sm font-black text-accent">
                  {completedCount} / {totalChapters}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-border/30 mb-10" />

        {/* ── Section 2: Mission Workspace ────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Mission Workspace</h2>
          </div>

          <div className="rounded-2xl border border-border/30 bg-bg-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-[600px]">
              {/* Story Timeline */}
              <div className="border-b lg:border-b-0 lg:border-r border-border/20">
                <LabStoryPanel
                  story={selectedScenario.story!}
                  completedChapters={completedChapters}
                  currentChapterId={currentChapterId}
                  onHintRequest={handleHintRequest}
                />
              </div>

              {/* Terminal */}
              <div className="min-h-[500px]">
                <LabTerminal
                  scenario={selectedScenario}
                  onChapterComplete={handleChapterComplete}
                  onFlagFound={handleFlagFound}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-border/30 mb-10" />

        {/* ── Section 3: Objectives ──────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Objectives</h2>
          </div>

          <div className="rounded-2xl border border-border/30 bg-bg-card p-6">
            <div className="space-y-3">
              {selectedScenario.story?.chapters.map((chapter, index) => {
                const isCompleted = completedChapters.includes(chapter.id);
                const isCurrent = chapter.id === currentChapterId;
                return (
                  <div
                    key={chapter.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      isCompleted
                        ? 'bg-accent/5 border border-accent/20'
                        : isCurrent
                          ? 'bg-white/5 border border-accent/30'
                          : 'bg-white/[0.02] border border-border/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-accent text-white'
                        : isCurrent
                          ? 'bg-accent/20 text-accent'
                          : 'bg-white/5 text-text-muted/30'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-black">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold ${
                        isCompleted ? 'text-accent' : isCurrent ? 'text-text-primary' : 'text-text-muted/50'
                      }`}>
                        {chapter.title}
                      </h4>
                      <p className={`text-xs font-mono mt-0.5 ${
                        isCompleted ? 'text-text-muted/60' : isCurrent ? 'text-text-muted/80' : 'text-text-muted/30'
                      }`}>
                        {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Locked'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-border/30 mb-10" />

        {/* ── Section 4: Flag Submission ─────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Flag className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-black text-text-primary uppercase tracking-wider">Capture the Flag</h2>
          </div>

          <div className="rounded-2xl border border-border/30 bg-bg-card p-6">
            {flagStatus === 'correct' ? (
              <div className="flex items-center gap-4 p-6 rounded-xl bg-green-400/10 border border-green-400/20">
                <div className="w-12 h-12 rounded-xl bg-green-400/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-lg font-black text-green-400">Mission Complete!</p>
                  <p className="text-sm font-mono text-text-muted mt-1">
                    You successfully escalated privileges and captured the flag.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-text-muted font-mono mb-4">
                  Once you've obtained the root flag, submit it here to complete the mission.
                </p>
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
                    className="btn-primary !rounded-xl !text-[11px] px-8 disabled:opacity-50"
                  >
                    {flagLoading ? 'Verifying...' : 'Submit Flag'}
                  </button>
                </div>
                {flagStatus === 'incorrect' && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-red-400 font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    Incorrect flag. Review your work and try again.
                  </div>
                )}
              </div>
            )}
          </div>
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
            <button onClick={() => setShowHint(null)} className="btn-secondary w-full">
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivescLab;
