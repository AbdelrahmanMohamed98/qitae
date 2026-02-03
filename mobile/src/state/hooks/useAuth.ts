import { useAtomValue, useSetAtom } from 'jotai';
import { sessionAtom, authLoadingAtom, loginAtom, logoutAtom } from '../atoms/auth';

export function useAuth() {
  const session = useAtomValue(sessionAtom);
  const isLoading = useAtomValue(authLoadingAtom);
  const login = useSetAtom(loginAtom);
  const logout = useSetAtom(logoutAtom);
  return { session, login, logout, isLoading };
}

export function useSession() {
  return useAtomValue(sessionAtom);
}
