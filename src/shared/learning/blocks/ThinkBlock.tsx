/**
 * THINK BLOCK
 * ===========
 * Reasoning question before revealing the answer.
 * Supports multiple choice or open-ended prompts.
 */

import React, { useState } from 'react';
import { Lightbulb, Check, X } from 'lucide-react';
import type { ThinkBlock } from '../types/blocks';
import type { BlockRendererProps } from '../utils/blockRegistry';

export const ThinkBlockComponent: React.FC<BlockRendererProps<ThinkBlock>> = ({ block }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  
  const isCorrect = selectedOption !== null && selectedOption === block.correctIndex;
  const hasOptions = block.options && block.options.length > 0;
  const isOpenEnded = block.openEnded ?? !hasOptions;
  
  const handleOptionSelect = (index: number) => {
    if (revealed) return;
    setSelectedOption(index);
  };
  
  const handleReveal = () => {
    setRevealed(true);
  };
  
  return (
    <div className="rounded-xl border border-warning/20 bg-warning/5 px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-warning" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-warning">
          Think
        </p>
      </div>
      
      {/* Question */}
      <p className="text-sm md:text-base font-mono text-text-primary leading-[2] md:leading-[2.2] mb-4">
        {block.question}
      </p>
      
      {/* Options (if provided) */}
      {hasOptions && !isOpenEnded && (
        <div className="space-y-2 mb-4" role="radiogroup" aria-label="Answer options">
          {block.options!.map((option, index) => {
            const isSelected = selectedOption === index;
            const showResult = revealed && isSelected;
            const isThisCorrect = index === block.correctIndex;
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionSelect(index)}
                disabled={revealed}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  showResult
                    ? isThisCorrect
                      ? 'border-accent/40 bg-accent/10 text-accent'
                      : 'border-danger/40 bg-danger/10 text-danger'
                    : isSelected
                    ? 'border-warning/40 bg-warning/10 text-text-primary'
                    : 'border-border/30 bg-bg-elevated text-text-secondary hover:border-warning/40'
                } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="flex items-center gap-3">
                  {showResult && (
                    <span aria-hidden="true">
                      {isThisCorrect ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <X className="w-4 h-4 text-danger" />
                      )}
                    </span>
                  )}
                  <span className="text-sm font-mono leading-[2]">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      
      {/* Reveal button */}
      {!revealed && !isOpenEnded && (
        <button
          type="button"
          onClick={handleReveal}
          disabled={selectedOption === null}
          className="btn-secondary text-xs px-4 py-2"
        >
          {selectedOption === null ? 'Select an answer' : 'Check Answer'}
        </button>
      )}
      
      {/* Explanation (revealed after answer or for open-ended) */}
      {(revealed || isOpenEnded) && block.explanation && (
        <div className="pt-4 mt-4 border-t border-warning/20">
          <p className="text-xs font-black uppercase tracking-widest text-warning/60 mb-2">
            {isOpenEnded ? 'Consider This' : isCorrect ? 'Correct!' : 'Explanation'}
          </p>
          <p className="text-sm font-mono text-text-secondary leading-[2]">
            {block.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default ThinkBlockComponent;
