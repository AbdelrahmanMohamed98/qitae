import { describe, it, expect } from 'vitest';
import {
  canPerformAction,
  isValidTransition,
  getAllowedActions,
  getBlockedReason,
} from './workflow';
import type { Role, ContentStatus } from '../types';

describe('workflow', () => {
  describe('canPerformAction', () => {
    it('allows Editor to create, edit draft, submit for review', () => {
      expect(canPerformAction('editor', 'create', 'draft')).toBe(true);
      expect(canPerformAction('editor', 'edit', 'draft')).toBe(true);
      expect(canPerformAction('editor', 'submit_for_review', 'draft')).toBe(true);
    });

    it('disallows Editor from approve_publish or revert_to_draft', () => {
      expect(canPerformAction('editor', 'approve_publish', 'in_review')).toBe(false);
      expect(canPerformAction('editor', 'revert_to_draft', 'in_review')).toBe(false);
    });

    it('allows Reviewer to approve_publish only when in_review', () => {
      expect(canPerformAction('reviewer', 'approve_publish', 'in_review')).toBe(true);
      expect(canPerformAction('reviewer', 'approve_publish', 'draft')).toBe(false);
      expect(canPerformAction('reviewer', 'approve_publish', 'published')).toBe(false);
    });

    it('disallows Reviewer from edit or submit_for_review', () => {
      expect(canPerformAction('reviewer', 'edit', 'draft')).toBe(false);
      expect(canPerformAction('reviewer', 'submit_for_review', 'draft')).toBe(false);
    });

    it('allows Admin to perform all actions at correct statuses', () => {
      expect(canPerformAction('admin', 'create', 'draft')).toBe(true);
      expect(canPerformAction('admin', 'edit', 'draft')).toBe(true);
      expect(canPerformAction('admin', 'submit_for_review', 'draft')).toBe(true);
      expect(canPerformAction('admin', 'approve_publish', 'in_review')).toBe(true);
      expect(canPerformAction('admin', 'revert_to_draft', 'in_review')).toBe(true);
    });

    it('disallows edit and submit_for_review when status is not draft', () => {
      expect(canPerformAction('editor', 'edit', 'in_review')).toBe(false);
      expect(canPerformAction('editor', 'edit', 'published')).toBe(false);
      expect(canPerformAction('editor', 'submit_for_review', 'in_review')).toBe(false);
    });
  });

  describe('isValidTransition', () => {
    it('allows draft -> in_review', () => {
      expect(isValidTransition('draft', 'in_review')).toBe(true);
    });

    it('allows in_review -> published and in_review -> draft', () => {
      expect(isValidTransition('in_review', 'published')).toBe(true);
      expect(isValidTransition('in_review', 'draft')).toBe(true);
    });

    it('disallows invalid transitions', () => {
      expect(isValidTransition('draft', 'published')).toBe(false);
      expect(isValidTransition('published', 'draft')).toBe(false);
      expect(isValidTransition('published', 'in_review')).toBe(false);
    });
  });

  describe('getAllowedActions', () => {
    it('returns edit, submit_for_review for Editor on draft (create is for new content only)', () => {
      const actions = getAllowedActions('editor', 'draft');
      expect(actions).toContain('edit');
      expect(actions).toContain('submit_for_review');
      expect(actions).not.toContain('create');
      expect(actions).not.toContain('approve_publish');
    });

    it('returns approve_publish for Reviewer on in_review', () => {
      const actions = getAllowedActions('reviewer', 'in_review');
      expect(actions).toContain('approve_publish');
      expect(actions).not.toContain('edit');
    });

    it('returns empty for published content for Editor/Reviewer', () => {
      expect(getAllowedActions('editor', 'published')).toEqual([]);
      expect(getAllowedActions('reviewer', 'published')).toEqual([]);
    });
  });

  describe('getBlockedReason', () => {
    it('returns permission message when role cannot perform action', () => {
      const msg = getBlockedReason('editor', 'approve_publish', 'in_review');
      expect(msg).toContain("don't have permission");
    });

    it('returns invalid transition message when status is wrong', () => {
      const msg = getBlockedReason('reviewer', 'approve_publish', 'draft');
      expect(msg).toContain('in review');
    });
  });
});
