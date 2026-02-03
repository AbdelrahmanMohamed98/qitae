// ─── User & Session ─────────────────────────────────────────────────────────

export type Role = 'admin' | 'editor' | 'reviewer';

export interface UserSession {
  id: string;
  name: string;
  role: Role;
  assignedSectors: string[];
}

// ─── Content & Workflow ─────────────────────────────────────────────────────

export type ContentStatus = 'draft' | 'in_review' | 'published';

export interface ContentItem {
  id: string;
  title: string;
  body: string;
  sector: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ContentFilters {
  status?: ContentStatus;
  sector?: string;
}

export interface AuditEntry {
  id: string;
  contentId: string;
  action: string;
  fromStatus?: ContentStatus;
  toStatus?: ContentStatus;
  performedBy: string;
  performedAt: string;
  note?: string;
}

// ─── API payloads ───────────────────────────────────────────────────────────

export interface CreateContentPayload {
  title: string;
  body: string;
  sector: string;
}

export interface UpdateContentPayload {
  title?: string;
  body?: string;
  sector?: string;
}
