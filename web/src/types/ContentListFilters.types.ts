import type { ContentStatus } from '@qitae/shared';

export interface ContentListFiltersProps {
  statusFilter: ContentStatus | undefined;
  sectorFilter: string;
  statusOptions: { value: ContentStatus | undefined; label: string }[];
  sectorOptions: string[];
  onStatusChange: (value: ContentStatus | undefined) => void;
  onSectorChange: (value: string) => void;
}
