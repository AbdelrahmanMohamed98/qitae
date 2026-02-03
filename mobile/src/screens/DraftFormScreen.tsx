import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../state/hooks';
import { useApi } from '../state/hooks';
import { getSectors } from '@qitae/shared';
import { getVisibleSectorOptions } from '../services/contentService';
import { styles } from '../styles/DraftForm.styles';

const MIN_BODY_LENGTH = 10;

interface DraftFormScreenProps {
  editId?: string;
}

export default function DraftFormScreen({ editId }: DraftFormScreenProps) {
  const router = useRouter();
  const id = editId;
  const { session } = useAuth();
  const api = useApi();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sector, setSector] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ title: false, body: false, sector: false });

  const allSectors = getSectors();
  const visibleSectors = session ? getVisibleSectorOptions(session, allSectors) : [];

  useEffect(() => {
    if (!sector && visibleSectors.length > 0) setSector(visibleSectors[0]);
  }, [visibleSectors, sector]);

  useEffect(() => {
    if (!id || !session) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const result = await api.getContentById(id);
      setLoading(false);
      if (cancelled) return;
      if (!result.success) {
        setError(result.error ?? 'Failed to load');
        return;
      }
      const item = result.data!;
      if (item.status !== 'draft') {
        setError('Only drafts can be edited.');
        return;
      }
      setTitle(item.title);
      setBody(item.body);
      setSector(item.sector);
    })();
    return () => { cancelled = true; };
  }, [id, session, api]);

  const titleError = touched.title && !title.trim() ? 'Title is required' : null;
  const bodyError = touched.body && body.length < MIN_BODY_LENGTH ? `Body min ${MIN_BODY_LENGTH} chars` : null;
  const sectorError = touched.sector && !sector ? 'Sector is required' : null;
  const isValid = Boolean(title.trim() && body.length >= MIN_BODY_LENGTH && sector);

  const handleSubmit = async () => {
    setTouched({ title: true, body: true, sector: true });
    if (!isValid) return;
    setSaving(true);
    if (isEdit && id) {
      const result = await api.updateContent(id, { title: title.trim(), body, sector });
      setSaving(false);
      if (result.success) {
        Alert.alert('Success', 'Draft updated.');
        router.replace(`/content/${id}`);
      } else {
        Alert.alert('Error', result.error ?? 'Failed to update.');
      }
    } else {
      const result = await api.createContent({ title: title.trim(), body, sector });
      setSaving(false);
      if (result.success) {
        Alert.alert('Success', 'Draft created.');
        router.replace(`/content/${result.data!.id}`);
      } else {
        Alert.alert('Error', result.error ?? 'Failed to create.');
      }
    }
  };

  if (!session) return <Redirect href="/sign-in" />;
  if (loading) return <View style={styles.centered}><Text style={styles.muted}>Loading…</Text></View>;
  if (error && isEdit) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          placeholder="Content title"
          placeholderTextColor="#9ca3af"
        />
        {titleError && <Text style={styles.errText}>{titleError}</Text>}

        <Text style={styles.label}>Body *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={body}
          onChangeText={setBody}
          onBlur={() => setTouched((t) => ({ ...t, body: true }))}
          placeholder={`Min ${MIN_BODY_LENGTH} characters`}
          placeholderTextColor="#9ca3af"
          multiline
        />
        {bodyError && <Text style={styles.errText}>{bodyError}</Text>}

        <Text style={styles.label}>Sector *</Text>
        <View style={styles.sectorRow}>
          {visibleSectors.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, sector === s && styles.chipSelected]}
              onPress={() => setSector(s)}
            >
              <Text style={[styles.chipText, sector === s && styles.chipTextSelected]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {sectorError && <Text style={styles.errText}>{sectorError}</Text>}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btnPrimary, (!isValid || saving) && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || saving}
          >
            <Text style={styles.btnPrimaryText}>{saving ? 'Saving…' : isEdit ? 'Update draft' : 'Create draft'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => router.back()}>
            <Text style={styles.btnSecondaryText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
