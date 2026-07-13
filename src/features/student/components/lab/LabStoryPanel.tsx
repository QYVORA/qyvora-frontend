import React from 'react';
import { Circle, Lightbulb } from 'lucide-react';
import { IconCheck } from '@/shared/components/icons';
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

  const currentChapter = story.chapters.find((ch) => ch.id === currentChapterId);

  return (
    <div className="flex flex-col h-full">
      {/* Timeline Header */}
      <div className="px-5 py-4 border-b border-border/20">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">
          Mission Timeline
        </h3>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border/20" />

          {/* Chapters */}
          <div className="space-y-2">
            {story.chapters.map((chapter, index) => {
              const status = getChapterStatus(chapter);
              const isExpanded = status === 'current';

              return (
                <div key={chapter.id} className="relative">
                  <div className="flex gap-3">
                    {/* Status Icon */}
                    <div className="relative z-10 flex-shrink-0 mt-0.5">
                      {status === 'completed' ? (
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <IconCheck size={16} className="text-white" />
                        </div>
                      ) : status === 'current' ? (
                        <div className="w-6 h-6 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-border/30 flex items-center justify-center">
                          <Circle className="w-3 h-3 text-white/20" />
                        </div>
                      )}
                    </div>

                    {/* Chapter Content */}
                    <div className="flex-1 min-w-0">
                      {/* Chapter Title (always visible) */}
                      <div className={`text-xs font-bold uppercase tracking-wider ${
                        status === 'completed' ? 'text-accent' :
                        status === 'current' ? 'text-text-primary' :
                        'text-white/20'
                      }`}>
                        <span className="text-white/30 mr-1.5">{String(index + 1).padStart(2, '0')}</span>
                        {chapter.title.replace(/^Chapter \d+: /, '')}
                      </div>

                      {/* Expanded Content (only for current chapter) */}
                      {isExpanded && (
                        <div className="mt-3 p-3 rounded-xl bg-white/5 border border-border/20">
                          <p className="text-xs text-text-secondary font-mono leading-relaxed mb-3">
                            {chapter.narrative}
                          </p>

                          {chapter.hint && (
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
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="px-5 py-4 border-t border-border/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Progress</span>
          <span className="text-xs font-mono text-accent font-bold">
            {completedChapters.length} / {story.chapters.length}
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
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
