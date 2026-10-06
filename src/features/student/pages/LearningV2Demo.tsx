/**
 * LEARNING V2 DEMO PAGE
 * =====================
 * Demo page to showcase all implemented learning blocks.
 * Route: /dashboard/learning-v2-demo
 */

import React from 'react';
import { LearningContentRenderer } from '@/shared/learning';
import type { LearningUnit } from '@/shared/learning';

const demoUnit: LearningUnit = {
  id: 'demo-unit',
  number: 1,
  title: 'Learning System V2 Demo',
  blocks: [
    {
      type: 'mission',
      id: 'demo-mission',
      mission: 'Explore all the semantic learning block types',
      context: 'This demo showcases the new Learning System V2 architecture',
    },
    {
      type: 'objective',
      id: 'demo-objectives',
      title: 'You will see',
      objectives: [
        'All implemented block types',
        'QYVORA design system compliance',
        'Interactive components in action',
        'Semantic structure vs Markdown',
      ],
    },
    {
      type: 'text',
      id: 'demo-intro',
      content: '# Welcome to Learning V2\n\nThis is a **TextBlock** — it supports Markdown for backward compatibility. The system renders GitHub Flavored Markdown including:\n\n- Bold and *italic*\n- Lists and `inline code`\n- Links and more',
    },
    {
      type: 'concept',
      id: 'demo-concept',
      title: 'Semantic vs Presentational',
      content: 'Block types encode pedagogical intent, not visual appearance. Authors focus on WHAT to teach, not HOW it looks.',
      importance: 'core',
    },
    {
      type: 'observe',
      id: 'demo-observe',
      title: 'Look at this',
      content: 'Notice how the ObserveBlock directs your attention to specific evidence',
      artifact: 'terminal',
      artifactContent: '$ ls -la\ntotal 48\ndrwxr-xr-x  12 user  staff   384 Jan 15 10:30 .\ndrwxr-xr-x   8 user  staff   256 Jan 15 09:15 ..',
      callouts: [
        { text: 'The first column shows file permissions' },
        { text: 'Hidden files start with a dot (.)' },
      ],
    },
    {
      type: 'evidence',
      id: 'demo-evidence',
      title: 'Terminal Output',
      entries: [
        'Connection established to 192.168.1.1',
        'Port 22 (SSH) is open',
        'Service: OpenSSH 8.2',
      ],
      format: 'terminal',
    },
    {
      type: 'command',
      id: 'demo-command',
      command: 'nmap -sV 192.168.1.1',
      explanation: {
        what: 'Scans the target for open ports and service versions',
        why: 'To identify potential attack surfaces',
        watch: 'Look for open ports and outdated service versions',
      },
      flags: [
        { flag: '-sV', description: 'Version detection' },
      ],
    },
    {
      type: 'think',
      id: 'demo-think',
      question: 'What should you check first when analyzing a target?',
      options: [
        'Try random exploits',
        'Scan for open ports and services',
        'Guess the admin password',
      ],
      correctIndex: 1,
      explanation: 'Always start with reconnaissance to understand the attack surface before attempting exploitation.',
    },
    {
      type: 'do',
      id: 'demo-do',
      title: 'Try It Yourself',
      instructions: [
        'Open your terminal',
        'Run the nmap command shown above',
        'Analyze the results',
        'Document your findings',
      ],
      expectedResult: 'You should see a list of open ports and services',
      verificationHint: 'Check if port 22 (SSH) or 80 (HTTP) are open',
    },
    {
      type: 'debrief',
      id: 'demo-debrief',
      title: 'What We Learned',
      content: 'You just saw how semantic learning blocks create a structured, pedagogically-sound learning experience. Each block type has a specific purpose in the learning flow.',
      keyTakeaways: [
        'Blocks encode learning intent',
        'Renderer handles presentation',
        'Consistent UX across all content',
      ],
    },
    {
      type: 'recall',
      id: 'demo-recall',
      title: 'Key Points',
      points: [
        'Learning V2 uses semantic blocks, not Markdown',
        'Each block type has a pedagogical purpose',
        'Design system compliance is enforced',
        'The architecture is type-safe and extensible',
      ],
    },
    {
      type: 'checkpoint',
      id: 'demo-checkpoint',
      checkpointType: 'quiz',
      title: 'Check Your Understanding',
      quiz: {
        questions: [
          {
            id: 'q1',
            question: 'What is the main benefit of semantic blocks?',
            options: [
              'They look prettier',
              'They encode learning intent, not presentation',
              'They are faster to render',
              'They use less memory',
            ],
            correctIndex: 1,
            explanation: 'Semantic blocks separate WHAT we teach from HOW we present it, allowing content authors to focus on pedagogy.',
          },
          {
            id: 'q2',
            question: 'How many block types are defined in V2?',
            options: [
              '5 block types',
              '10 block types',
              '21 block types',
              '50 block types',
            ],
            correctIndex: 2,
            explanation: 'Learning V2 defines 21 semantic block types across 5 categories: Narrative, Visual, Evidence, Interactive, and Practice.',
          },
        ],
      },
    },
  ],
  completionType: 'view',
};

export default function LearningV2Demo() {
  return (
    <div className="min-h-screen pt-20 md:pt-24 px-3 md:px-4 lg:px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-accent">
              V2 Architecture Demo
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-text-primary mb-4">
            Learning System V2
          </h1>
          <p className="text-base text-text-secondary font-mono leading-relaxed">
            Interactive demonstration of all semantic learning blocks
          </p>
        </header>

        {/* Render all blocks */}
        <LearningContentRenderer
          unit={demoUnit}
          context={{
            surface: 'bootcamp',
            sequenceId: 'demo',
            unitId: 'demo-unit',
          }}
        />

        {/* Info Footer */}
        <footer className="mt-16 pt-8 border-t border-border/30">
          <div className="text-sm font-mono text-text-muted space-y-2">
            <p>
              <strong className="text-text-secondary">Architecture:</strong> 21 block types, 12 components implemented
            </p>
            <p>
              <strong className="text-text-secondary">Status:</strong> ✅ Production ready
            </p>
            <p>
              <strong className="text-text-secondary">Docs:</strong> See{' '}
              <code className="text-accent">docs/LEARNING_V2_STATUS.md</code>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
