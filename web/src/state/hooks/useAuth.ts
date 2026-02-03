import { useAtomValue, useSetAtom } from 'jotai';
import { sessionAtom, loginAtom, logoutAtom } from '../atoms/auth';

export function useAuth() {
  const session = useAtomValue(sessionAtom);
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(logoutAtom);
  return { session, login, logout };
}

export function useSession() {
  return useAtomValue(sessionAtom);
}
