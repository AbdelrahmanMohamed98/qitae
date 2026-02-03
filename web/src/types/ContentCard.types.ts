import type { ContentItem } from '@qitae/shared';

export interface ContentCardProps {
  item: ContentItem;
  formatDate: (iso: string) => string;
}
