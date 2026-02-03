import { Select, Text } from '../ui';
import type { ContentListFiltersProps } from '../../types/ContentListFilters.types';

export default function ContentListFilters({
  statusFilter,
  sectorFilter,
  statusOptions,
  sectorOptions,
  onStatusChange,
  onSectorChange,
}: ContentListFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center gap-2">
        <label htmlFor="status-filter">
          <Text label>Status</Text>
        </label>
        <Select
          id="status-filter"
          value={statusFilter ?? ''}
          onChange={(e) =>
            onStatusChange((e.target.value || undefined) as ContentListFiltersProps['statusFilter'])
          }
          options={statusOptions.map((o) => ({ value: o.value ?? '', label: o.label }))}
          className="w-auto"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sector-filter">
          <Text label>Sector</Text>
        </label>
        <Select
          id="sector-filter"
          value={sectorFilter}
          onChange={(e) => onSectorChange(e.target.value)}
          placeholder="All sectors"
          options={sectorOptions.map((s) => ({ value: s, label: s }))}
          className="w-auto"
        />
      </div>
    </div>
  );
}
