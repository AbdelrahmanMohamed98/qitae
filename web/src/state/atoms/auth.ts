import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { UserSession } from '@qitae/shared';

const SESSION_KEY = 'qitae_session';

export const MOCK_USERS: Record<string, UserSession> = {
  admin: {
    id: 'admin-1',
    name: 'Admin User',
    role: 'admin',
    assignedSectors: ['Healthcare', 'Finance', 'Technology', 'Education', 'Government'],
  },
  editor: {
    id: 'editor-1',
    name: 'Editor User',
    role: 'editor',
    assignedSectors: ['Healthcare', 'Technology'],
  },
  reviewer: {
    id: 'reviewer-1',
    name: 'Reviewer User',
    role: 'reviewer',
    assignedSectors: ['Finance', 'Education'],
  },
};

function getSessionStorage(): Storage {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    const map = new Map<string, string>();
    return {
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => { map.set(k, v); },
      removeItem: (k) => { map.delete(k); },
      key: () => null,
      length: 0,
      clear: () => { map.clear(); },
    };
  }
  return window.sessionStorage;
}

const storage = createJSONStorage<UserSession | null>(getSessionStorage);

export const sessionAtom = atomWithStorage<UserSession | null>(SESSION_KEY, null, storage);

export const loginAtom = atom(
  null,
  (_get, set, session: UserSession) => {
    set(sessionAtom, session);
  }
);

export const logoutAtom = atom(null, (_get, set) => {
  set(sessionAtom, null);
});
