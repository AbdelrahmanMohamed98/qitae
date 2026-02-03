import type { Role, ContentStatus } from '../types';

export type WorkflowAction =
  | 'create'
  | 'edit'
  | 'submit_for_review'
  | 'approve_publish'
  | 'revert_to_draft';

const EDITOR_ACTIONS: WorkflowAction[] = ['create', 'edit', 'submit_for_review'];
const REVIEWER_ACTIONS: WorkflowAction[] = ['approve_publish'];
const ADMIN_ACTIONS: WorkflowAction[] = [
  'create',
  'edit',
  'submit_for_review',
  'approve_publish',
  'revert_to_draft',
];

const VALID_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  draft: ['in_review'],
  in_review: ['published', 'draft'],
  published: [],
};

export function canPerformAction(
  role: Role,
  action: WorkflowAction,
  status: ContentStatus
): boolean {
  const roleActions = getActionsForRole(role);
  if (!roleActions.includes(action)) return false;

  switch (action) {
    case 'create':
      return true;
    case 'edit':
    case 'submit_for_review':
      return status === 'draft';
    case 'approve_publish':
      return status === 'in_review';
    case 'revert_to_draft':
      return status === 'in_review' && role === 'admin';
    default:
      return false;
  }
}

function getActionsForRole(role: Role): WorkflowAction[] {
  switch (role) {
    case 'admin':
      return ADMIN_ACTIONS;
    case 'editor':
      return EDITOR_ACTIONS;
    case 'reviewer':
      return REVIEWER_ACTIONS;
    default:
      return [];
  }
}

export function isValidTransition(
  fromStatus: ContentStatus,
  toStatus: ContentStatus
): boolean {
  return VALID_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false;
}

const ITEM_ACTIONS: WorkflowAction[] = [
  'edit',
  'submit_for_review',
  'approve_publish',
  'revert_to_draft',
];

export function getAllowedActions(
  role: Role,
  status: ContentStatus
): WorkflowAction[] {
  const roleActions = getActionsForRole(role);
  return ITEM_ACTIONS.filter(
    (action) =>
      roleActions.includes(action) && canPerformAction(role, action, status)
  );
}

export function getBlockedReason(
  role: Role,
  action: WorkflowAction,
  status: ContentStatus
): string {
  if (!getActionsForRole(role).includes(action)) {
    return "You don't have permission to perform this action.";
  }
  if (!canPerformAction(role, action, status)) {
    if (action === 'submit_for_review' && status !== 'draft') {
      return 'Only drafts can be submitted for review.';
    }
    if (action === 'approve_publish' && status !== 'in_review') {
      return 'Only content in review can be approved and published.';
    }
    if (action === 'edit' && status !== 'draft') {
      return 'Only drafts can be edited.';
    }
    return 'Invalid transition for current status.';
  }
  return '';
}
