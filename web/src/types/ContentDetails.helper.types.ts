import type { ContentApi, ContentItem, Role } from '@qitae/shared';

export type SubmitForReviewParams = {
  id: string;
  item: ContentItem;
  role: Role;
  api: ContentApi;
  setItem: (item: ContentItem | null) => void;
  setActionLoading: (loading: string | null) => void;
};

export type ApprovePublishParams = {
  id: string;
  item: ContentItem;
  role: Role;
  api: ContentApi;
  setItem: (item: ContentItem | null) => void;
  setActionLoading: (loading: string | null) => void;
};
