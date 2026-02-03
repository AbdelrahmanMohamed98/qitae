import { View, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Provider as JotaiProvider } from 'jotai';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthHydrate } from '../src/state/AuthHydrate';
import { useAuth } from '../src/state/hooks';
import { styles } from '../src/styles/RootLayout.styles';

function RootStack() {
  const { isLoading } = useAuth();
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loading} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading…</Text>
      </SafeAreaView>
    );
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <JotaiProvider>
        <AuthHydrate>
          <RootStack />
        </AuthHydrate>
      </JotaiProvider>
    </SafeAreaProvider>
  );
}
