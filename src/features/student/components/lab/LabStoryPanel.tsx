import React from 'react';
import { CheckCircle, Circle, BookOpen, Lightbulb } from 'lucide-react';
import type { LabStory, LabChapter } from '../../data/simulations/types';

interface LabStoryPanelProps {
  story: LabStory;
  completedChapters: string[];
  currentChapterId: string;
  onHintRequest: (hint: string) => void;
}

export const LabStoryPanel: React.FC<LabStoryPanelProps> = ({
  story,
  completedChapters,
  currentChapterId,
  onHintRequest,
}) => {
  const getChapterStatus = (chapter: LabChapter): 'completed' | 'current' | 'upcoming' => {
    if (completedChapters.includes(chapter.id)) return 'completed';
    if (chapter.id === currentChapterId) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Story Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
        <BookOpen className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          {story.title}
        </h3>
      </div>

      {/* Chapters Timeline */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border/30" />

          {/* Chapters */}
          <div className="space-y-4">
            {story.chapters.map((chapter, index) => {
              const status = getChapterStatus(chapter);
              return (
                <div key={chapter.id} className="relative flex gap-3">
                  {/* Status Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    {status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-accent" />
                    ) : status === 'current' ? (
                      <div className="w-6 h-6 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-white/20" />
                    )}
                  </div>

                  {/* Chapter Content */}
                  <div
                    className={`flex-1 p-3 rounded-xl border transition-all duration-200 ${
                      status === 'completed'
                        ? 'bg-accent/5 border-accent/20'
                        : status === 'current'
                          ? 'bg-white/5 border-accent/30'
                          : 'bg-white/[0.02] border-border/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-xs font-bold uppercase tracking-wider ${
                          status === 'upcoming' ? 'text-white/30' : 'text-text-primary'
                        }`}
                      >
                        {chapter.title}
                      </h4>
                      {status === 'completed' && (
                        <span className="text-[9px] font-black text-accent uppercase tracking-widest">
                          Done
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs leading-relaxed mb-2 ${
                        status === 'upcoming' ? 'text-white/20' : 'text-text-secondary'
                      }`}
                    >
                      {chapter.narrative}
                    </p>

                    {status === 'current' && chapter.hint && (
                      <button
                        onClick={() => onHintRequest(chapter.hint)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg
                          hover:border-yellow-500/50 hover:bg-yellow-500/20 transition-all duration-200
                          text-[10px] font-mono text-yellow-400/70 hover:text-yellow-400 uppercase tracking-wider"
                      >
                        <Lightbulb className="w-3 h-3" />
                        Need a hint?
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="px-4 py-3 border-t border-border/30">
        <div className="flex items-center justify-between text-xs font-mono text-white/30">
          <span>Chapters</span>
          <span>
            {completedChapters.length} / {story.chapters.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{
              width: `${(completedChapters.length / story.chapters.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LabStoryPanel;
