import { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  isOfflineAtom,
  queueAtom,
  queueLengthAtom,
  setOfflineAtom,
  addToQueueAtom,
  clearQueueAtom,
} from '../atoms/offline';
import type { QueuedAction } from '../atoms/offline';
import { useRawApi } from './useApi';
import type { ContentApi } from '@qitae/shared';

export function useOffline() {
  const isOffline = useAtomValue(isOfflineAtom);
  const queue = useAtomValue(queueAtom);
  const queueLength = useAtomValue(queueLengthAtom);
  const setOffline = useSetAtom(setOfflineAtom);
  const addToQueue = useSetAtom(addToQueueAtom);
  const setQueue = useSetAtom(queueAtom);
  const clearQueue = useSetAtom(clearQueueAtom);
  const rawApi = useRawApi();

  const flushQueue = useCallback(
    async (api?: ContentApi): Promise<{ synced: number; failed: number }> => {
      const targetApi = api ?? rawApi;
      let items: QueuedAction[] = [];
      setQueue((current) => {
        items = [...current];
        return [];
      });
      let synced = 0;
      let failed = 0;
      for (const action of items) {
        try {
          if (action.type === 'create') {
            const res = await targetApi.createContent(action.payload);
            if (res.success) synced++; else failed++;
          } else if (action.type === 'update') {
            const res = await targetApi.updateContent(action.id, action.payload);
            if (res.success) synced++; else failed++;
          } else if (action.type === 'submitForReview') {
            const res = await targetApi.submitForReview(action.id);
            if (res.success) synced++; else failed++;
          } else if (action.type === 'approveContent') {
            const res = await targetApi.approveContent(action.id);
            if (res.success) synced++; else failed++;
          }
        } catch {
          failed++;
        }
      }
      return { synced, failed };
    },
    [rawApi, setQueue]
  );

  return {
    isOffline,
    setOffline,
    queue,
    queueLength,
    addToQueue,
    flushQueue,
    clearQueue,
  };
}
