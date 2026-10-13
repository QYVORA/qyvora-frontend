/**
 * SPEECH TEXT
 * ===========
 * Builds a natural read-aloud script for a learning card. Cards are visual and
 * terse; voice mode needs connected prose, so this flattens a block into the
 * sentence(s) a lecturer would actually say.
 *
 * Markdown syntax is stripped (never read out "asterisk asterisk"), code and
 * ids are skipped, and every branch degrades to '' so a block with nothing
 * speakable simply produces no audio.
 */

import type { LearningBlock } from '../types/blocks';
import { plainMarkdown } from './markdownChunker';

const clean = (value?: string | null): string =>
  value ? plainMarkdown(value).replace(/\s+/g, ' ').trim() : '';

const sentence = (value: string, end = '.'): string => {
  const text = value.trim();
  if (!text) return '';
  return /[.!?]$/.test(text) ? `${text} ` : `${text}${end} `;
};

export function cardSpeechText(block: LearningBlock): string {
  switch (block.type) {
    case 'text':
      return sentence(clean(block.content));

    case 'concept':
      return `${sentence(clean(block.title))}${sentence(clean(block.content))}`;

    case 'mission':
      return `Mission. ${sentence(clean(block.mission))}${sentence(clean(block.context))}`;

    case 'objective':
      return `Objectives. ${block.objectives.map((o) => sentence(clean(o))).join('')}`;

    case 'recall':
      return `${sentence(clean(block.title) || 'Key points')}${block.points
        .map((p) => sentence(clean(p)))
        .join('')}`;

    case 'debrief':
      return `${sentence(clean(block.title) || 'Debrief')}${sentence(clean(block.content))}${(
        block.keyTakeaways ?? []
      )
        .map((t) => sentence(clean(t)))
        .join('')}`;

    case 'mental-model': {
      const nodes = block.nodes
        .map((n) => `${sentence(clean(n.label))}${sentence(clean(n.description))}`)
        .join('');
      return `${sentence(clean(block.title) || 'Mental model')}${nodes}${sentence(clean(block.caption))}`;
    }

    case 'diagram':
      return `${sentence(clean(block.title) || 'Diagram')}${sentence(clean(block.caption))}`;

    case 'observe':
      return `${sentence(clean(block.title) || 'Observe')}${sentence(clean(block.content))}`;

    case 'evidence':
      return `Evidence. ${block.entries.map((e) => sentence(clean(e))).join('')}`;

    case 'think': {
      const options = (block.options ?? []).map((o) => sentence(clean(o))).join('');
      return `${sentence(clean(block.question))}${options}`;
    }

    case 'do':
      return `${sentence(clean(block.title) || 'Try it')}${block.instructions
        .map((i) => sentence(clean(i)))
        .join('')}${sentence(clean(block.expectedResult))}`;

    case 'command': {
      const what = sentence(clean(block.explanation?.what));
      const watch = clean(block.explanation?.watch);
      const tail = watch ? `Watch for ${sentence(watch)}` : '';
      return `Run the command ${clean(block.command)}. ${what}${tail}`.replace(/\s+/g, ' ').trim();
    }

    case 'http':
      return block.request
        ? `${sentence(block.request.method)} request to ${sentence(clean(block.request.url))}`
        : 'HTTP request.';

    case 'code':
      return `${sentence(clean(block.filename) || block.language || 'Code')}${sentence(clean(block.explanation))}`;

    case 'comparison':
      return `${sentence(clean(block.title) || 'Comparison')}${sentence(clean(block.keyDifference))}`;

    case 'checkpoint': {
      if (block.checkpointType === 'quiz' && block.quiz) {
        const questions = block.quiz.questions
          .map((q) => {
            const opts = (q.options ?? []).map((o) => sentence(clean(o))).join('');
            return `${sentence(clean(q.question))}${opts}`;
          })
          .join('');
        return `${sentence(clean(block.title) || 'Knowledge check')}${questions}`;
      }
      if (block.checkpointType === 'flag') {
        return `${sentence(clean(block.title) || 'Submit the flag')}${sentence(clean(block.flag?.hint))}`;
      }
      return sentence(clean(block.title) || 'Checkpoint');
    }

    case 'hint':
      return block.hints.map((h) => sentence(clean(h.content))).join('');

    case 'challenge':
      return `${sentence(clean(block.title))}${sentence(clean(block.description))}${(
        block.successCriteria ?? []
      )
        .map((c) => sentence(clean(c)))
        .join('')}`;

    case 'lab':
      return `${sentence(clean(block.title))}${sentence(clean(block.summary))}${block.objectives
        .map((o) => sentence(clean(o)))
        .join('')}`;

    case 'playground':
      return sentence(clean(block.title) || 'Code playground');

    default:
      return '';
  }
}

export default cardSpeechText;
