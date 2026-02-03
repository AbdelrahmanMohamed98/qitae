import { Redirect } from 'expo-router';
import { useAuth } from '../src/state/hooks';

export default function RootRedirectScreen() {
  const { session } = useAuth();
  if (session) return <Redirect href="/content" />;
  return <Redirect href="/sign-in" />;
}
