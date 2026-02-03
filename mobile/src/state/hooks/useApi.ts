import { useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { rawApiAtom } from '../atoms/api';
import { isOfflineAtom, addToQueueAtom } from '../atoms/offline';
import type { ContentApi } from '@qitae/shared';
import type { CreateContentPayload, UpdateContentPayload } from '@qitae/shared';
import type { QueuedAction } from '../atoms/offline';

function createOfflineAwareApi(
  api: ContentApi,
  getIsOffline: () => boolean,
  addToQueue: (action: QueuedAction) => void
): ContentApi {
  return {
    getContentList: (filters) =>
      getIsOffline()
        ? Promise.resolve({ success: false, error: 'Offline. Turn off offline mode to load content.' })
        : api.getContentList(filters),
    getContentById: (id) =>
      getIsOffline() ? Promise.resolve({ success: false, error: 'Offline.' }) : api.getContentById(id),
    createContent: (payload: CreateContentPayload) => {
      if (getIsOffline()) {
        addToQueue({ type: 'create', payload });
        return Promise.resolve({ success: false, error: 'Offline. Action queued for sync.' });
      }
      return api.createContent(payload);
    },
    updateContent: (id, payload: UpdateContentPayload) => {
      if (getIsOffline()) {
        addToQueue({ type: 'update', id, payload });
        return Promise.resolve({ success: false, error: 'Offline. Action queued for sync.' });
      }
      return api.updateContent(id, payload);
    },
    submitForReview: (id) => {
      if (getIsOffline()) {
        addToQueue({ type: 'submitForReview', id });
        return Promise.resolve({ success: false, error: 'Offline. Action queued for sync.' });
      }
      return api.submitForReview(id);
    },
    approveContent: (id) => {
      if (getIsOffline()) {
        addToQueue({ type: 'approveContent', id });
        return Promise.resolve({ success: false, error: 'Offline. Action queued for sync.' });
      }
      return api.approveContent(id);
    },
    getAuditTrail: (contentId) =>
      getIsOffline() ? Promise.resolve({ success: false, error: 'Offline.' }) : api.getAuditTrail(contentId),
  };
}

export function useApi(): ContentApi {
  const rawApi = useAtomValue(rawApiAtom);
  const isOffline = useAtomValue(isOfflineAtom);
  const addToQueue = useSetAtom(addToQueueAtom);
  return useMemo(
    () => createOfflineAwareApi(rawApi, () => isOffline, addToQueue),
    [rawApi, isOffline, addToQueue]
  );
}

export function useRawApi(): ContentApi {
  return useAtomValue(rawApiAtom);
}
