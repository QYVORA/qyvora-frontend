/**
 * CHECKPOINT BLOCK
 * ================
 * Learning checkpoint — quiz, flag, or task validation.
 * This is the primary completion gate for learning units.
 */

import React, { useState } from 'react';
import { Flag, CheckCircle2 } from 'lucide-react';
import type { CheckpointBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';
import InlineQuiz from '@/shared/components/courses/InlineQuiz';

export const CheckpointBlockComponent: React.FC<BlockRendererProps<CheckpointBlock>> = ({
  block,
  context,
}) => {
  const [flagValue, setFlagValue] = useState('');
  const [flagSubmitting, setFlagSubmitting] = useState(false);
  const [flagSuccess, setFlagSuccess] = useState(false);
  const [flagError, setFlagError] = useState('');
  const [visibleHintLevel, setVisibleHintLevel] = useState(0);
  
  const title = block.title ?? 'Checkpoint';
  
  // Quiz checkpoint
  if (block.checkpointType === 'quiz' && block.quiz) {
    return (
      <div className="wc-interactive">
        <InlineQuiz
          questions={block.quiz.questions}
          title={title}
        />
      </div>
    );
  }
  
  // Flag checkpoint
  if (block.checkpointType === 'flag' && block.flag) {
    const handleFlagSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!flagValue.trim() || !context?.onCheckpointSubmit) return;
      
      setFlagSubmitting(true);
      setFlagError('');
      
      try {
        const result = await context.onCheckpointSubmit(block.id, flagValue);
        
        if (result.correct) {
          setFlagSuccess(true);
          setFlagError('');
          // Call completion callback if provided
          if (context.onComplete && context.unitId) {
            context.onComplete(context.unitId);
          }
        } else {
          setFlagError('Incorrect flag. Try again.');
        }
      } catch (error) {
        setFlagError('Failed to submit flag. Please try again.');
        console.error('Flag submission error:', error);
      } finally {
        setFlagSubmitting(false);
      }
    };
    
    const showNextHint = () => {
      if (block.flag?.progressiveHints && visibleHintLevel < block.flag.progressiveHints.length) {
        setVisibleHintLevel(visibleHintLevel + 1);
      }
    };
    
    return (
      <div className="space-y-4">
        {/* Progressive hints */}
        {block.flag.progressiveHints && visibleHintLevel > 0 && (
          <div className="space-y-2">
            {block.flag.progressiveHints.slice(0, visibleHintLevel).map((hint) => (
              <div
                key={hint.level}
                className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3"
              >
                <p className="text-xs font-black uppercase tracking-widest text-warning/60 mb-1">
                  Hint {hint.level}
                </p>
                <p className="text-sm font-mono text-warning/80 leading-[2]">
                  {hint.content}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {/* Hint button */}
        {block.flag.progressiveHints && visibleHintLevel < block.flag.progressiveHints.length && !flagSuccess && (
          <button
            type="button"
            onClick={showNextHint}
            className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-warning transition-colors"
          >
            {visibleHintLevel === 0 ? 'Need a hint?' : 'Need another hint?'}
          </button>
        )}
        
        {/* Single hint (legacy) */}
        {block.flag.hint && !block.flag.progressiveHints && !flagSuccess && (
          <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-widest text-warning/60 mb-1">
              Hint
            </p>
            <p className="text-sm font-mono text-warning/80 leading-[2]">
              {block.flag.hint}
            </p>
          </div>
        )}
        
        {/* Flag input */}
        {!flagSuccess ? (
          <form onSubmit={handleFlagSubmit} className="wc-interactive">
            <div className="rounded-xl border border-border bg-bg px-4 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Flag className="w-4 h-4 text-accent" aria-hidden="true" />
                <p className="text-xs font-black uppercase tracking-widest text-accent">
                  Submit Flag
                </p>
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={flagValue}
                  onChange={(e) => setFlagValue(e.target.value)}
                  placeholder="Enter the flag..."
                  disabled={flagSubmitting}
                  className="w-full bg-bg-card border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm"
                  aria-label="Flag input"
                />
                
                {flagError && (
                  <p className="text-sm font-mono text-danger" role="alert">
                    {flagError}
                  </p>
                )}
                
                <button
                  type="submit"
                  disabled={!flagValue.trim() || flagSubmitting}
                  className="btn-primary text-xs px-5 py-2.5"
                >
                  {flagSubmitting ? 'Submitting...' : 'Submit Flag'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="rounded-xl border-2 border-accent/40 bg-accent/5 px-5 py-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-black text-accent uppercase tracking-widest">
                Correct!
              </p>
              <p className="text-sm font-mono text-text-secondary">
                Flag accepted. Well done!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Task checkpoint (manual verification)
  if (block.checkpointType === 'task' && block.task) {
    return (
      <div className="wc-interactive rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
        <p className="text-xs font-black uppercase tracking-widest text-accent mb-3">
          {title}
        </p>
        
        <p className="text-sm md:text-base font-mono text-text-secondary leading-[2] md:leading-[2.2] mb-4">
          {block.task.description}
        </p>
        
        <div className="pt-3 border-t border-accent/20">
          <p className="text-xs font-black uppercase tracking-widest text-accent/60 mb-2">
            Verification Steps
          </p>
          <ol className="space-y-2" role="list">
            {block.task.verificationSteps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm font-mono text-text-secondary leading-[2]"
              >
                <span className="text-accent font-black shrink-0">
                  {index + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
  
  // Fallback for unknown checkpoint type
  return null;
};

export default CheckpointBlockComponent;
