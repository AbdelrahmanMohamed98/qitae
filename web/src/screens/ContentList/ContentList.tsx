import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth, useApi } from '../../state/hooks';
import { getSectors } from '@qitae/shared';
import { filterContentBySector, getVisibleSectorOptions } from '../../services/contentService';
import type { ContentFilters as SharedFilters } from '@qitae/shared';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { Text } from '../../components/ui';
import { ContentListFilters, ContentCard } from '../../components/content-list';
import { formatDate } from '../../helpers';
import { STATUS_OPTIONS } from './constants';
import type { FilterStatus } from '../../types/ContentList.types';

export default function ContentList() {
  const { session } = useAuth();
  const api = useApi();
  const [items, setItems] = useState<import('@qitae/shared').ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(undefined);
  const [sectorFilter, setSectorFilter] = useState<string>('');

  const allSectors = getSectors();
  const visibleSectors = useMemo(
    () => getVisibleSectorOptions(session!, allSectors),
    [session, allSectors]
  );

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const filters: SharedFilters = {};
    if (statusFilter) filters.status = statusFilter;
    if (sectorFilter) filters.sector = sectorFilter;
    const result = await api.getContentList(filters);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Failed to load content');
      return;
    }
    const filtered = filterContentBySector(result.data!.items, session);
    setItems(filtered);
  }, [session, api, statusFilter, sectorFilter]);

  useEffect(() => {
    load();
  }, [load]);

  if (!session) return null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Text title1>Content</Text>
          {!loading && !error && (
            <Text body className="mt-2 text-slate-500">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Text>
          )}
        </div>
        <ContentListFilters
          statusFilter={statusFilter}
          sectorFilter={sectorFilter}
          statusOptions={STATUS_OPTIONS}
          sectorOptions={visibleSectors}
          onStatusChange={setStatusFilter}
          onSectorChange={setSectorFilter}
        />
      </header>

      {loading && <LoadingState />}
      {!loading && error && (
        <ErrorState message={error} onRetry={load} />
      )}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No content found"
          description="Try changing filters or create a new draft."
        />
      )}
      {!loading && !error && items.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {items.map((item) => (
            <li key={item.id}>
              <ContentCard item={item} formatDate={formatDate} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
