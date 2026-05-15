import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { appConfig } from '@/shared/config/app';
import type { DeploymentLogRealtimeMessage } from '../model/process';

export type DeploymentLogsConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

interface UseDeploymentLogsStreamOptions {
  deploymentId: string | null | undefined;
  enabled: boolean;
  onLog: (entry: DeploymentLogRealtimeMessage) => void;
}

export function useDeploymentLogsStream({
  deploymentId,
  enabled,
  onLog
}: UseDeploymentLogsStreamOptions) {
  const [state, setState] = useState<DeploymentLogsConnectionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const onLogRef = useRef(onLog);

  useEffect(() => {
    onLogRef.current = onLog;
  }, [onLog]);

  useEffect(() => {
    if (!enabled || !deploymentId) {
      setState('idle');
      setError(null);
      return;
    }

    let cancelled = false;
    let subscribed = false;
    let startPromise: Promise<void> | null = null;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${appConfig.api.processes}/hubs/deployment-logs`)
      .withAutomaticReconnect()
      .build();

    connection.on('deploymentLog', (message: DeploymentLogRealtimeMessage) => {
      if (message.deploymentId === deploymentId) {
        onLogRef.current(message);
      }
    });

    connection.onreconnecting(() => {
      if (!cancelled) setState('reconnecting');
    });

    connection.onreconnected(() => {
      if (!cancelled) {
        setState('connected');
        void connection.invoke('Subscribe', deploymentId).catch((err: unknown) => {
          setError(err instanceof Error ? err.message : String(err));
          setState('error');
        });
      }
    });

    connection.onclose((err) => {
      if (!cancelled) {
        setState(err ? 'error' : 'disconnected');
        setError(err?.message ?? null);
      }
    });

    async function start() {
      try {
        setState('connecting');
        setError(null);
        await connection.start();
        if (cancelled) return;
        await connection.invoke('Subscribe', deploymentId);
        subscribed = true;
        if (!cancelled) setState('connected');
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setState('error');
        }
      }
    }

    const startTimer = window.setTimeout(() => {
      startPromise = start();
    }, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      connection.off('deploymentLog');
      if (!startPromise) return;

      const stop = () => {
        void connection.stop().catch(() => undefined);
      };

      void startPromise.finally(() => {
        if (!subscribed) {
          stop();
          return;
        }

        void connection.invoke('Unsubscribe', deploymentId).catch(() => undefined).finally(stop);
      });
    };
  }, [deploymentId, enabled]);

  return { state, error };
}
