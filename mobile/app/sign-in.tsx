import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../src/state/hooks';
import { MOCK_USERS } from '../src/state/atoms/auth';
import type { Role, UserSession } from '@qitae/shared';
import { styles, colors } from '../src/styles/Login.styles';

const ROLES: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'reviewer', label: 'Reviewer' },
];

const RANDOM_FIRST_NAMES = [
  'Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley',
  'Avery', 'Quinn', 'Reese', 'Jamie', 'Drew', 'Blake', 'Cameron',
  'Skyler', 'Parker', 'Finley', 'Sage', 'River', 'Phoenix',
];

function getRandomName(): string {
  const first = RANDOM_FIRST_NAMES[Math.floor(Math.random() * RANDOM_FIRST_NAMES.length)];
  const last = Math.random().toString(36).slice(2, 6);
  return `${first} ${last}`;
}

export default function SignInScreen() {
  const { session, login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('admin');

  if (session) return <Redirect href="/content" />;

  const handleSubmit = () => {
    const displayName = name.trim() || 'Guest';
    const template = MOCK_USERS[role];
    const userSession: UserSession = {
      id: template.id,
      name: displayName,
      role: template.role,
      assignedSectors: template.assignedSectors,
    };
    login(userSession);
    router.replace('/content');
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Qitae</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>
            <View style={styles.form}>
              <Text style={styles.label}>Your name</Text>
              <View style={styles.nameRow}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.slate400}
                  autoCapitalize="words"
                  autoComplete="name"
                />
                <TouchableOpacity
                  style={styles.randomButton}
                  onPress={() => setName(getRandomName())}
                >
                  <Text style={styles.randomButtonText}>Random</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.label, styles.labelRole]}>Role</Text>
              <View style={styles.roleList}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.roleOption, role === r.value && styles.roleOptionSelected]}
                    onPress={() => setRole(r.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.roleLabel, role === r.value && styles.roleLabelSelected]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
                <Text style={styles.submitButtonText}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
