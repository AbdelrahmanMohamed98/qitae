import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
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

export const sessionAtom = atom<UserSession | null>(null);
export const authLoadingAtom = atom(true);

export const loginAtom = atom(
  null,
  (_get, set, session: UserSession) => {
    set(sessionAtom, session);
    AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
);

export const logoutAtom = atom(null, (_get, set) => {
  set(sessionAtom, null);
  AsyncStorage.removeItem(SESSION_KEY);
});
