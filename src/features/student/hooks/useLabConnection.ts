import { useState, useCallback, useEffect } from 'react';
import api from '../../../core/services/api';
import type { LabConnectionState } from '../data/simulations/types';

interface UseLabConnectionReturn {
  connection: LabConnectionState | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: (labId: string, scenarioId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  updateProgress: (command?: string, chapterId?: string) => Promise<void>;
}

export function useLabConnection(): UseLabConnectionReturn {
  const [connection, setConnection] = useState<LabConnectionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      const { data } = await api.get('/student/labs/connections');
      if (data.connections && data.connections.length > 0) {
        const active = data.connections[0];
        setConnection({
          connectionId: active.connectionId,
          targetIp: active.targetIp,
          expiresAt: active.expiresAt,
          commandsRun: active.commandsRun || [],
          chaptersCompleted: active.chaptersCompleted || [],
          currentChapterId: active.currentChapterId || '',
        });
      }
    } catch {
      // No active connection
    }
  };

  const connect = useCallback(async (labId: string, scenarioId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/student/labs/connect', { labId, scenarioId });
      setConnection({
        connectionId: data.connectionId,
        targetIp: data.targetIp,
        expiresAt: data.expiresAt,
        commandsRun: [],
        chaptersCompleted: [],
        currentChapterId: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (!connection) return;
    setIsLoading(true);
    try {
      await api.post('/student/labs/disconnect', {
        connectionId: connection.connectionId,
      });
      setConnection(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to disconnect');
    } finally {
      setIsLoading(false);
    }
  }, [connection]);

  const updateProgress = useCallback(
    async (command?: string, chapterId?: string) => {
      if (!connection) return;
      try {
        const { data } = await api.put('/student/labs/progress', {
          connectionId: connection.connectionId,
          command,
          chapterId,
        });
        setConnection((prev) =>
          prev
            ? {
                ...prev,
                commandsRun: data.commandsRun,
                chaptersCompleted: data.chaptersCompleted,
                currentChapterId: data.currentChapterId,
              }
            : prev
        );
      } catch {
        // Progress update failed silently
      }
    },
    [connection]
  );

  return {
    connection,
    isConnected: !!connection,
    isLoading,
    error,
    connect,
    disconnect,
    updateProgress,
  };
}

export default useLabConnection;
