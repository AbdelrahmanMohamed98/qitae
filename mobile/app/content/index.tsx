import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../../src/state/hooks';
import { useApi } from '../../src/state/hooks';
import { filterContentBySector, getVisibleSectorOptions } from '../../src/services/contentService';
import { getSectors } from '@qitae/shared';
import type { ContentItem, ContentFilters } from '@qitae/shared';
import { styles, badgeStyles } from '../../src/styles/ContentList.styles';

type FilterStatus = 'draft' | 'in_review' | 'published' | undefined;

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: undefined, label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In Review' },
  { value: 'published', label: 'Published' },
];

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
    <View style={[badgeStyles.badge, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Text style={[badgeStyles.text, { color: s.text }]}>{label}</Text>
    </View>
  );
}

export default function ContentListScreen() {
  const { session } = useAuth();
  const api = useApi();
  const router = useRouter();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(undefined);
  const [sectorFilter, setSectorFilter] = useState('');
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);

  const allSectors = getSectors();
  const visibleSectors = useMemo(
    () => (session ? getVisibleSectorOptions(session, allSectors) : []),
    [session, allSectors]
  );

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const filters: ContentFilters = {};
    if (statusFilter) filters.status = statusFilter;
    if (sectorFilter) filters.sector = sectorFilter;
    const result = await api.getContentList(filters);
    setLoading(false);
    setRefreshing(false);
    if (!result.success) {
      setError(result.error ?? 'Failed to load');
      return;
    }
    const filtered = filterContentBySector(result.data!.items, session);
    setItems(filtered);
  }, [session, api, statusFilter, sectorFilter]);

  useEffect(() => { load(); }, [load]);

  if (!session) return <Redirect href="/sign-in" />;

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>Content</Text>
          {!loading && !error && (
            <Text style={styles.count}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.statusPills}>
            {STATUS_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.label}
                style={[styles.pill, statusFilter === o.value && styles.pillSelected]}
                onPress={() => setStatusFilter(o.value)}
              >
                <Text style={[styles.pillText, statusFilter === o.value && styles.pillTextSelected]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Sector</Text>
          <View>
            <TouchableOpacity
              style={styles.sectorButton}
              onPress={() => setSectorDropdownOpen((v) => !v)}
            >
              <Text style={styles.sectorButtonText}>
                {sectorFilter || 'All sectors'}
              </Text>
              <Text style={styles.sectorChevron}>
                {sectorDropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {sectorDropdownOpen && (
              <View style={styles.dropdown}>
                <ScrollView
                  style={styles.dropdownScroll}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      !sectorFilter && styles.dropdownOptionSelected,
                      visibleSectors.length === 0 && styles.dropdownOptionLast,
                    ]}
                    onPress={() => {
                      setSectorFilter('');
                      setSectorDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        !sectorFilter && styles.dropdownOptionTextSelected,
                      ]}
                    >
                      All sectors
                    </Text>
                  </TouchableOpacity>
                  {visibleSectors.map((s, i) => (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.dropdownOption,
                        sectorFilter === s && styles.dropdownOptionSelected,
                        i === visibleSectors.length - 1 && styles.dropdownOptionLast,
                      ]}
                      onPress={() => {
                        setSectorFilter(s);
                        setSectorDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          sectorFilter === s && styles.dropdownOptionTextSelected,
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}><Text style={styles.muted}>Loading…</Text></View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => load()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>No content found</Text>
          <Text style={styles.mutedSmall}>Try changing filters or create a new draft.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/content/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <StatusBadge status={item.status} />
              </View>
              <View style={styles.cardMeta}>
                <Text style={styles.cardSector}>{item.sector}</Text>
                <Text style={styles.cardDot}>·</Text>
                <Text style={styles.cardDate}>
                  {item.status === 'draft' && item.createdAt === item.updatedAt
                    ? `Created ${formatDate(item.createdAt)}`
                    : `Updated ${formatDate(item.updatedAt)}`}
                </Text>
              </View>
              {item.body ? (
                <Text style={styles.cardBody} numberOfLines={3}>{item.body}</Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}

    </View>
  );
}
