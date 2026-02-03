import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { useAuth } from '../../src/state/hooks';
import { useApi } from '../../src/state/hooks';
import { getAllowedActions, getBlockedReason } from '@qitae/shared';
import { canAccessContent } from '../../src/services/contentService';
import type { ContentItem, AuditEntry } from '@qitae/shared';
import { styles, detailBadgeStyles } from '../../src/styles/ContentDetail.styles';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: ContentItem['status'] }) {
  const stylesByStatus = {
    draft: { bg: '#f1f5f9', text: '#334155', border: '#e2e8f0' },
    in_review: { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
    published: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  };
  const s = stylesByStatus[status] ?? stylesByStatus.draft;
  const label = status === 'draft' ? 'Draft' : status === 'in_review' ? 'In Review' : 'Published';
  return (
    <View style={[detailBadgeStyles.badge, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Text style={[detailBadgeStyles.text, { color: s.text }]}>{label}</Text>
    </View>
  );
}

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuth();
  const api = useApi();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id || !session) return;
    setLoading(true);
    setError(null);
    const [contentRes, auditRes] = await Promise.all([
      api.getContentById(id),
      api.getAuditTrail(id),
    ]);
    setLoading(false);
    if (!contentRes.success) {
      setError(contentRes.error ?? 'Failed to load');
      return;
    }
    const content = contentRes.data!;
    if (!canAccessContent(session, content)) {
      setError("You don't have access to this content.");
      return;
    }
    setItem(content);
    if (auditRes.success) setAudit(auditRes.data ?? []);
  }, [id, session, api]);

  useEffect(() => { load(); }, [load]);

  const handleSubmitForReview = async () => {
    if (!id || !item) return;
    const reason = getBlockedReason(session!.role, 'submit_for_review', item.status);
    if (reason) {
      Alert.alert('Action blocked', reason);
      return;
    }
    setActionLoading('submit_for_review');
    const result = await api.submitForReview(id);
    setActionLoading(null);
    if (result.success) {
      setItem(result.data!);
      Alert.alert('Success', 'Submitted for review.');
    } else {
      Alert.alert('Error', result.error ?? 'Failed to submit.');
    }
  };

  const handleApprovePublish = async () => {
    if (!id || !item) return;
    const reason = getBlockedReason(session!.role, 'approve_publish', item.status);
    if (reason) {
      Alert.alert('Action blocked', reason);
      return;
    }
    setActionLoading('approve_publish');
    const result = await api.approveContent(id);
    setActionLoading(null);
    if (result.success) {
      setItem(result.data!);
      Alert.alert('Success', 'Published.');
    } else {
      Alert.alert('Error', result.error ?? 'Failed to publish.');
    }
  };

  if (!session) return <Redirect href="/sign-in" />;
  if (!id) return null;
  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  if (error || !item) {
    const isAccessDenied = error?.includes("don't have access");
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error ?? 'Not found'}</Text>
        <View style={styles.errorActions}>
          {id && !isAccessDenied && (
            <TouchableOpacity style={styles.retryButton} onPress={() => load()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const allowedActions = getAllowedActions(session.role, item.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity
        style={styles.backLink}
        onPress={() => router.push('/content')}
        activeOpacity={0.7}
      >
        <Text style={styles.backLinkText}>← Back to list</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <StatusBadge status={item.status} />
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Sector</Text>
            <Text style={styles.metaValue}>{item.sector}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Updated</Text>
            <Text style={styles.metaValue}>{formatDate(item.updatedAt)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Created</Text>
            <Text style={styles.metaValue}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.body}>{item.body}</Text>
        </View>
      </View>

      {allowedActions.length > 0 && (
        <View style={styles.actions}>
          {allowedActions.includes('edit') && (
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => router.push(`/content/${id}/edit`)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnPrimaryText}>Edit</Text>
            </TouchableOpacity>
          )}
          {allowedActions.includes('submit_for_review') && (
            <TouchableOpacity
              style={styles.btnAmber}
              onPress={handleSubmitForReview}
              disabled={!!actionLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.btnAmberText}>
                {actionLoading === 'submit_for_review' ? 'Submitting…' : 'Submit for review'}
              </Text>
            </TouchableOpacity>
          )}
          {allowedActions.includes('approve_publish') && (
            <TouchableOpacity
              style={styles.btnGreen}
              onPress={handleApprovePublish}
              disabled={!!actionLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.btnGreenText}>
                {actionLoading === 'approve_publish' ? 'Publishing…' : 'Approve & publish'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.auditSection}>
        <Text style={styles.auditTitle}>Audit trail</Text>
        {audit.length === 0 ? (
          <View style={styles.auditEmpty}>
            <Text style={styles.muted}>No audit entries yet.</Text>
          </View>
        ) : (
          audit.map((entry) => (
            <View key={entry.id} style={styles.auditRow}>
              <View style={styles.auditRowTop}>
                <Text style={styles.auditAction}>{entry.action}</Text>
                {entry.fromStatus && (
                  <>
                    <Text style={styles.auditMuted}> {entry.fromStatus}</Text>
                    <Text style={styles.auditArrow}> → </Text>
                    {entry.toStatus && <Text style={styles.auditTo}>{entry.toStatus}</Text>}
                  </>
                )}
                {!entry.fromStatus && entry.toStatus && (
                  <Text style={styles.auditTo}>{entry.toStatus}</Text>
                )}
              </View>
              <Text style={styles.auditMeta}>
                {entry.performedBy === 'current-user' && session
                  ? `${session.name} (you)`
                  : entry.performedBy}{' '}
                · {formatDate(entry.performedAt)}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
