import { describe, it, expect } from 'vitest';
import { canSeeSector, visibleSectors, canAccessSector } from './sectors';
import type { UserSession } from '../types';

const ALL_SECTORS = ['Healthcare', 'Finance', 'Technology', 'Education', 'Government'];

describe('sectors', () => {
  describe('canSeeSector', () => {
    it('admin can see any sector', () => {
      const admin: UserSession = { id: '1', name: 'A', role: 'admin', assignedSectors: ['Healthcare', 'Finance'] };
      expect(canSeeSector(admin, 'Healthcare')).toBe(true);
      expect(canSeeSector(admin, 'Government')).toBe(true);
      expect(canSeeSector(admin, 'Other')).toBe(true);
    });

    it('editor/reviewer can only see assigned sectors', () => {
      const editor: UserSession = { id: '2', name: 'E', role: 'editor', assignedSectors: ['Healthcare', 'Technology'] };
      expect(canSeeSector(editor, 'Healthcare')).toBe(true);
      expect(canSeeSector(editor, 'Technology')).toBe(true);
      expect(canSeeSector(editor, 'Finance')).toBe(false);
      expect(canSeeSector(editor, 'Education')).toBe(false);
    });
  });

  describe('visibleSectors', () => {
    it('admin sees all sectors', () => {
      const admin: UserSession = { id: '1', name: 'A', role: 'admin', assignedSectors: [] };
      expect(visibleSectors(admin, ALL_SECTORS)).toEqual(ALL_SECTORS);
    });

    it('editor/reviewer see only assigned sectors from the list', () => {
      const reviewer: UserSession = { id: '3', name: 'R', role: 'reviewer', assignedSectors: ['Finance', 'Education'] };
      expect(visibleSectors(reviewer, ALL_SECTORS)).toEqual(['Finance', 'Education']);
    });
  });

  describe('canAccessSector', () => {
    it('matches canSeeSector', () => {
      const session: UserSession = { id: '1', name: 'U', role: 'editor', assignedSectors: ['Technology'] };
      expect(canAccessSector(session, 'Technology')).toBe(true);
      expect(canAccessSector(session, 'Healthcare')).toBe(false);
    });
  });
});
