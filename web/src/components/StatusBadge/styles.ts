import type { ContentStatus } from '@qitae/shared';

export const STATUS_STYLES: Record<ContentStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  in_review: 'bg-amber-50 text-amber-800 border-amber-200',
  published: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

export function statusLabel(status: ContentStatus): string {
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
