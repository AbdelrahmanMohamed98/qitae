import { atom } from 'jotai';
import type { CreateContentPayload, UpdateContentPayload } from '@qitae/shared';

export type QueuedAction =
  | { type: 'create'; payload: CreateContentPayload }
  | { type: 'update'; id: string; payload: UpdateContentPayload }
  | { type: 'submitForReview'; id: string }
  | { type: 'approveContent'; id: string };

export const isOfflineAtom = atom(false);
export const queueAtom = atom<QueuedAction[]>([]);

export const setOfflineAtom = atom(null, (_get, set, value: boolean) => {
  set(isOfflineAtom, value);
});

export const addToQueueAtom = atom(null, (_get, set, action: QueuedAction) => {
  set(queueAtom, (prev) => [...prev, action]);
});

export const clearQueueAtom = atom(null, (_get, set) => {
  set(queueAtom, []);
});

export const queueLengthAtom = atom((get) => get(queueAtom).length);
