import { describe, it, expect } from 'vitest';
import {
  getAllowedActions,
  getBlockedReason,
} from '@qitae/shared';

describe('Workflow rules (from web)', () => {
  it('Editor on draft can edit and submit for review', () => {
    const actions = getAllowedActions('editor', 'draft');
    expect(actions).toContain('edit');
    expect(actions).toContain('submit_for_review');
    expect(actions).not.toContain('approve_publish');
  });

  it('Reviewer on in_review can approve and publish', () => {
    const actions = getAllowedActions('reviewer', 'in_review');
    expect(actions).toContain('approve_publish');
  });

  it('Blocked action returns user-friendly message', () => {
    const msg = getBlockedReason('editor', 'approve_publish', 'in_review');
    expect(msg).toContain("don't have permission");
  });
});
