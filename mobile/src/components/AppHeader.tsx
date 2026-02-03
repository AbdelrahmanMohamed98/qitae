import { useCallback } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../state/hooks';
import { useOffline } from '../state/hooks';
import { canPerformAction } from '@qitae/shared';
import { styles } from '../styles/AppHeader.styles';

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const { session, logout } = useAuth();
  const { isOffline, setOffline, queueLength, flushQueue } = useOffline();
  const router = useRouter();
  const canCreate = session && canPerformAction(session.role, 'create', 'draft');

  const handleLogout = () => {
    logout();
    router.replace('/sign-in');
  };

  const handleOfflineToggle = useCallback(
    async (value: boolean) => {
      if (value) {
        setOffline(true);
      } else {
        if (queueLength > 0) {
          const { synced, failed } = await flushQueue();
          setOffline(false);
          Alert.alert('Sync complete', `Synced: ${synced}, Failed: ${failed}`);
        } else {
          setOffline(false);
        }
      }
    },
    [setOffline, queueLength, flushQueue]
  );

  if (!session) return null;

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.logoRow}
          onPress={() => router.push('/content')}
          activeOpacity={0.7}
        >
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>Q</Text>
          </View>
          <Text style={styles.brand}>Qitae</Text>
        </TouchableOpacity>
        <View style={styles.actionsRow}>
          {canCreate && (
            <TouchableOpacity
              style={styles.newButton}
              onPress={() => router.push('/content/new-draft')}
              activeOpacity={0.8}
            >
              <Text style={styles.newButtonText}>New</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => { }}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {session.name?.charAt(0)?.toUpperCase() ?? '?'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.offlineRow}>
        <Text style={styles.offlineLabel}>Offline mode</Text>
        {isOffline && queueLength > 0 && (
          <Text style={styles.offlineBadge}>{queueLength} queued</Text>
        )}
        <Switch
          value={isOffline}
          onValueChange={handleOfflineToggle}
          trackColor={{ false: undefined, true: '#c7d2fe' }}
          thumbColor={isOffline ? '#4f46e5' : undefined}
        />
      </View>
    </View>
  );
}
