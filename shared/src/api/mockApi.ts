import type {
  ContentItem,
  ContentFilters,
  CreateContentPayload,
  UpdateContentPayload,
  AuditEntry,
  ContentStatus,
} from '../types';
import type { ApiResult, ContentListResponse } from './contract';

const LATENCY_MIN = 300;
const LATENCY_MAX = 800;
const FAILURE_RATE = 1 / 15;

function shouldFail(): boolean {
  return Math.random() < FAILURE_RATE;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomLatency(): number {
  return LATENCY_MIN + Math.random() * (LATENCY_MAX - LATENCY_MIN);
}

const SECTORS = ['Healthcare', 'Finance', 'Technology', 'Education', 'Government'];

let contentStore: ContentItem[] = [
  {
    id: '1',
    title: 'Healthcare Policy Update',
    body: 'Summary of recent healthcare policy changes and implications for providers.',
    sector: 'Healthcare',
    status: 'published',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
    createdBy: 'editor-1',
    updatedBy: 'reviewer-1',
  },
  {
    id: '2',
    title: 'Q4 Financial Review',
    body: 'Quarterly financial review and key metrics for the finance sector.',
    sector: 'Finance',
    status: 'in_review',
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-22T11:00:00Z',
    createdBy: 'editor-2',
    updatedBy: 'editor-2',
  },
  {
    id: '3',
    title: 'Tech Standards Draft',
    body: 'Draft document for new technology standards and compliance requirements.',
    sector: 'Technology',
    status: 'draft',
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-01-22T16:00:00Z',
    createdBy: 'editor-1',
    updatedBy: 'editor-1',
  },
  {
    id: '4',
    title: 'Education Curriculum Notes',
    body: 'Preliminary notes on curriculum updates for the education sector.',
    sector: 'Education',
    status: 'draft',
    createdAt: '2025-01-21T12:00:00Z',
    updatedAt: '2025-01-21T12:00:00Z',
    createdBy: 'editor-2',
  },
  {
    id: '5',
    title: 'Government Compliance Guide',
    body: 'Guide to government compliance requirements and reporting.',
    sector: 'Government',
    status: 'published',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
    createdBy: 'editor-1',
    updatedBy: 'reviewer-1',
  },
];

const auditStore: Record<string, AuditEntry[]> = {};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function nowIso(): string {
  return new Date().toISOString();
}

function mockAuditTrail(contentId: string, item: ContentItem): AuditEntry[] {
  const entries: AuditEntry[] = [];
  entries.push({
    id: generateId(),
    contentId,
    action: 'created',
    toStatus: 'draft',
    performedBy: item.createdBy ?? 'system',
    performedAt: item.createdAt,
  });
  if (item.updatedAt !== item.createdAt && item.updatedBy) {
    entries.push({
      id: generateId(),
      contentId,
      action: 'updated',
      fromStatus: 'draft',
      toStatus: item.status,
      performedBy: item.updatedBy,
      performedAt: item.updatedAt,
    });
  }
  return entries;
}

export function getMockContentStore(): ContentItem[] {
  return contentStore;
}

export function setMockContentStore(store: ContentItem[]): void {
  contentStore = store;
}

export function getSectors(): string[] {
  return [...SECTORS];
}

export function createMockApi(): import('./contract').ContentApi {
  return {
    async getContentList(filters: ContentFilters): Promise<ApiResult<ContentListResponse>> {
      await delay(randomLatency());
      if (shouldFail()) {
        return { success: false, error: 'Failed to load content list. Please try again.' };
      }
      let items = [...contentStore];
      if (filters.status) {
        items = items.filter((i) => i.status === filters.status);
      }
      if (filters.sector) {
        items = items.filter((i) => i.sector === filters.sector);
      }
      items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      return {
        success: true,
        data: { items, total: items.length },
      };
    },

    async getContentById(id: string): Promise<ApiResult<ContentItem>> {
      await delay(randomLatency());
      if (shouldFail()) {
        return { success: false, error: 'Failed to load content. Please try again.' };
      }
      const item = contentStore.find((c) => c.id === id);
      if (!item) {
        return { success: false, error: 'Content not found.' };
      }
      return { success: true, data: { ...item } };
    },

    async createContent(payload: CreateContentPayload): Promise<ApiResult<ContentItem>> {
      await delay(randomLatency());
      if (shouldFail()) {
        return { success: false, error: 'Failed to create content. Please try again.' };
      }
      const now = nowIso();
      const item: ContentItem = {
        id: generateId(),
        title: payload.title,
        body: payload.body,
        sector: payload.sector,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        createdBy: 'current-user',
      };
      contentStore = [...contentStore, item];
      return { success: true, data: { ...item } };
    },

    async updateContent(id: string, payload: UpdateContentPayload): Promise<ApiResult<ContentItem>> {
      await delay(randomLatency());
      if (shouldFail()) {
        return { success: false, error: 'Failed to update content. Please try again.' };
      }
      const idx = contentStore.findIndex((c) => c.id === id);
      if (idx === -1) {
        return { success: false, error: 'Content not found.' };
      }
      const existing = contentStore[idx];
      if (existing.status !== 'draft') {
        return { success: false, error: 'Only drafts can be edited.' };
      }
      const updated: ContentItem = {
        ...existing,
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.body !== undefined && { body: payload.body }),
        ...(payload.sector !== undefined && { sector: payload.sector }),
        updatedAt: nowIso(),
        updatedBy: 'current-user',
      };
      contentStore = contentStore.slice(0, idx).concat(updated, contentStore.slice(idx + 1));
      return { success: true, data: { ...updated } };
    },

    async submitForReview(id: string): Promise<ApiResult<ContentItem>> {
      await delay(randomLatency());
      if (shouldFail()) {
        return { success: false, error: 'Failed to submit for review. Please try again.' };
      }
      const idx = contentStore.findIndex((c) => c.id === id);
      if (idx === -1) {
        return { success: false, error: 'Content not found.' };
      }
      const existing = contentStore[idx];
      if (existing.status !== 'draft') {
        return { success: false, error: 'Only drafts can be submitted for review.' };
      }
      const now = nowIso();
      const updated: ContentItem = {
        ...existing,
        status: 'in_review' as ContentStatus,
        updatedAt: now,
        updatedBy: 'current-user',
      };
      contentStore = contentStore.slice(0, idx).concat(updated, contentStore.slice(idx + 1));
      return { success: true, data: { ...updated } };
    },

    async approveContent(id: string): Promise<ApiResult<ContentItem>> {
      await delay(randomLatency());
      if (shouldFail()) {
        return { success: false, error: 'Failed to publish. Please try again.' };
      }
      const idx = contentStore.findIndex((c) => c.id === id);
      if (idx === -1) {
        return { success: false, error: 'Content not found.' };
      }
      const existing = contentStore[idx];
      if (existing.status !== 'in_review') {
        return { success: false, error: 'Only content in review can be published.' };
      }
      const now = nowIso();
      const updated: ContentItem = {
        ...existing,
        status: 'published' as ContentStatus,
        updatedAt: now,
        updatedBy: 'current-user',
      };
      contentStore = contentStore.slice(0, idx).concat(updated, contentStore.slice(idx + 1));
      return { success: true, data: { ...updated } };
    },

    async getAuditTrail(contentId: string): Promise<ApiResult<AuditEntry[]>> {
      await delay(randomLatency());
      if (shouldFail()) {
        return { success: false, error: 'Failed to load audit trail.' };
      }
      const item = contentStore.find((c) => c.id === contentId);
      const entries = auditStore[contentId] ?? (item ? mockAuditTrail(contentId, item) : []);
      return { success: true, data: [...entries] };
    },
  };
}
