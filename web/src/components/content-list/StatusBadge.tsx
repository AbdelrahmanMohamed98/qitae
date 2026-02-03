import type { ContentStatus } from '@qitae/shared';
import type { StatusBadgeProps } from '../../types/StatusBadge.types';

const STATUS_STYLES: Record<ContentStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  in_review: 'bg-amber-50 text-amber-800 border-amber-200',
  published: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

function statusLabel(status: ContentStatus): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'in_review':
      return 'In Review';
    case 'published':
      return 'Published';
    default:
      return status;
  }
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]} ${className}`}
    >
      {statusLabel(status)}
    </span>
  );
}
