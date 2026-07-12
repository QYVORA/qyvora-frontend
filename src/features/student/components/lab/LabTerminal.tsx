import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Terminal, X, Wifi, WifiOff, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { SimulatedTerminal } from '../SimulatedTerminal/SimulatedTerminal';
import { useLabConnection } from '../../hooks/useLabConnection';
import type { PrivescScenario, ChapterTrigger } from '../../data/simulations/types';
import type { TerminalContext } from '../SimulatedTerminal/types';

interface LabTerminalProps {
  scenario: PrivescScenario;
  onChapterComplete: (chapterId: string) => void;
  onFlagFound: () => void;
}

export const LabTerminal: React.FC<LabTerminalProps> = ({
  scenario,
  onChapterComplete,
  onFlagFound,
}) => {
  const { connection, isConnected, connect, disconnect, updateProgress } = useLabConnection();
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [storyExpanded, setStoryExpanded] = useState(true);
  const lastCommandRef = useRef<string>('');

  const handleConnect = useCallback(async () => {
    await connect('privesc', scenario.id);
  }, [connect, scenario.id]);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
    setShowDisconnectConfirm(false);
  }, [disconnect]);

  const handleTerminalCommand = useCallback(
    async (command: string) => {
      if (!connection) return;

      lastCommandRef.current = command;
      await updateProgress(command);

      if (scenario.story) {
        for (const chapter of scenario.story.chapters) {
          const allTriggersMet = chapter.triggers.every((trigger) =>
            checkTrigger(trigger, command, scenario)
          );
          if (allTriggersMet) {
            onChapterComplete(chapter.id);
          }
        }
      }

      if (command.includes('flag.txt') || command.includes('cat /root')) {
        onFlagFound();
      }
    },
    [connection, scenario, updateProgress, onChapterComplete, onFlagFound]
  );

  const context: TerminalContext = {
    type: 'dashboard',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Connection Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/80 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-accent" />
            ) : (
              <WifiOff className="w-4 h-4 text-white/30" />
            )}
            <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {connection && (
            <div className="flex items-center gap-2 text-xs font-mono text-white/30">
              <Clock className="w-3 h-3" />
              <span>Expires: {new Date(connection.expiresAt).toLocaleTimeString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <button
                onClick={() => setStoryExpanded(!storyExpanded)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-border/30 rounded-lg
                  hover:border-accent/30 hover:bg-white/10 transition-all duration-200
                  text-[10px] font-mono text-white/50 hover:text-white/70 uppercase tracking-wider"
              >
                {storyExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Story
              </button>
              <button
                onClick={() => setShowDisconnectConfirm(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg
                  hover:border-red-500/50 hover:bg-red-500/20 transition-all duration-200
                  text-[10px] font-mono text-red-400/70 hover:text-red-400 uppercase tracking-wider"
              >
                <X className="w-3 h-3" />
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-xl
                hover:border-accent/50 hover:bg-accent/20 transition-all duration-200
                text-xs font-mono text-accent uppercase tracking-wider"
            >
              <Terminal className="w-4 h-4" />
              Connect to Target
            </button>
          )}
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 min-h-0">
        <SimulatedTerminal
          open={true}
          onOpenChange={() => {}}
          context={context}
          mode="inline"
          title={`Lab: ${scenario.title}`}
        />
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80">
          <div className="bg-bg border border-border/30 rounded-2xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-text-primary mb-2">Disconnect from Lab?</h3>
            <p className="text-sm text-text-secondary mb-4">
              Your terminal session will end. Progress is saved automatically.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDisconnectConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleDisconnect} className="btn-danger">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function checkTrigger(trigger: ChapterTrigger, command: string, scenario: PrivescScenario): boolean {
  const cmdLower = command.toLowerCase().trim();

  switch (trigger.type) {
    case 'command':
      return cmdLower.includes(trigger.value.toLowerCase());
    case 'output_contains':
      return cmdLower.includes(trigger.value.toLowerCase());
    case 'file_access':
      return cmdLower.includes(trigger.value.toLowerCase());
    case 'privilege_check':
      return cmdLower.includes('root') || cmdLower.includes('whoami');
    default:
      return false;
  }
}

export default LabTerminal;
