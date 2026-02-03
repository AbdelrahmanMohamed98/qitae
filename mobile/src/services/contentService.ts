import { visibleSectors } from '@qitae/shared';
import type { UserSession } from '@qitae/shared';
import type { ContentItem } from '@qitae/shared';

export function filterContentBySector(
  items: ContentItem[],
  session: UserSession
): ContentItem[] {
  if (session.role === 'admin') return items;
  const allowed = new Set(session.assignedSectors);
  return items.filter((item) => allowed.has(item.sector));
}

export function getVisibleSectorOptions(
  session: UserSession,
  allSectors: string[]
): string[] {
  return visibleSectors(session, allSectors);
}

export function canAccessContent(session: UserSession, item: ContentItem): boolean {
  if (session.role === 'admin') return true;
  return session.assignedSectors.includes(item.sector);
}
