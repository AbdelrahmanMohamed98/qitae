import type { FilterStatus } from '../../types/ContentList.types';

export const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: undefined, label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'in_review', label: 'In Review' },
  { value: 'published', label: 'Published' },
];
