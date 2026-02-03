import type {
  ContentItem,
  ContentFilters,
  CreateContentPayload,
  UpdateContentPayload,
  AuditEntry,
} from '../types';

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ContentListResponse {
  items: ContentItem[];
  total: number;
}

export interface ContentApi {
  getContentList(filters: ContentFilters): Promise<ApiResult<ContentListResponse>>;
  getContentById(id: string): Promise<ApiResult<ContentItem>>;
  createContent(payload: CreateContentPayload): Promise<ApiResult<ContentItem>>;
  updateContent(id: string, payload: UpdateContentPayload): Promise<ApiResult<ContentItem>>;
  submitForReview(id: string): Promise<ApiResult<ContentItem>>;
  approveContent(id: string): Promise<ApiResult<ContentItem>>;
  getAuditTrail(contentId: string): Promise<ApiResult<AuditEntry[]>>;
}
