import React, { useState, useCallback } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { IconTerminal, IconX, IconClock } from '@/shared/components/icons';
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
      {/* Terminal Chrome Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-border/20">
        <div className="flex items-center gap-3">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>

          {/* Terminal Title */}
          <div className="flex items-center gap-2 ml-2">
            <IconTerminal size={16} className="text-accent" />
            <span className="text-[10px] font-mono text-text-muted">
              {isConnected ? `trainee@${connection?.targetIp || 'target'}:~$` : 'Not connected'}
            </span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-accent">
                <Wifi className="w-3 h-3" />
                <span>Connected</span>
              </div>
              {connection?.expiresAt && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted/50">
                  <IconClock size={12} />
                  <span>{new Date(connection.expiresAt).toLocaleTimeString()}</span>
                </div>
              )}
              <button
                onClick={() => setShowDisconnectConfirm(true)}
                className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-border/20 rounded-lg
                  hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200
                  text-[10px] font-mono text-text-muted/50 hover:text-red-400"
              >
                <IconX size={12} />
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-lg
                hover:border-accent/50 hover:bg-accent/20 transition-all duration-200
                text-[10px] font-mono text-accent uppercase tracking-wider"
            >
              <IconTerminal size={12} />
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Terminal Content */}
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
            <h3 className="text-lg font-bold text-text-primary mb-2">Disconnect from Target?</h3>
            <p className="text-sm text-text-secondary font-mono mb-4">
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
