import { View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../src/components/AppHeader';
import { styles } from '../../src/styles/ContentLayout.styles';

export default function ContentLayout() {
  return (
    <View style={styles.container}>
      <AppHeader />
      <SafeAreaView style={styles.content} edges={['bottom']}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </View>
  );
}
