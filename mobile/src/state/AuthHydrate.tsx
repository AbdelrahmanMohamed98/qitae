import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSetAtom } from 'jotai';
import { sessionAtom, authLoadingAtom } from './atoms/auth';
import type { UserSession } from '@qitae/shared';

const SESSION_KEY = 'qitae_session';

export function AuthHydrate({ children }: { children: React.ReactNode }) {
  const setSession = useSetAtom(sessionAtom);
  const setLoading = useSetAtom(authLoadingAtom);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY).then((stored) => {
      if (stored) {
        try {
          setSession(JSON.parse(stored) as UserSession);
        } catch {
          // ignore
        }
      }
      setLoading(false);
    });
  }, [setSession, setLoading]);

  return <>{children}</>;
}
