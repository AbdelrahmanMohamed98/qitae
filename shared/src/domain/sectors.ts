import type { UserSession } from '../types';

export function canSeeSector(session: UserSession, sector: string): boolean {
  if (session.role === 'admin') return true;
  return session.assignedSectors.includes(sector);
}

export function visibleSectors(session: UserSession, allSectors: string[]): string[] {
  if (session.role === 'admin') return allSectors;
  return allSectors.filter((s) => session.assignedSectors.includes(s));
}

export function canAccessSector(session: UserSession, sector: string): boolean {
  return canSeeSector(session, sector);
}
