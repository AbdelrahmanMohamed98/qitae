import toast from 'react-hot-toast';
import { getBlockedReason } from '@qitae/shared';
import type { SubmitForReviewParams, ApprovePublishParams } from '../../types/ContentDetails.helper.types';

export async function submitForReview(params: SubmitForReviewParams): Promise<void> {
    const { id, item, role, api, setItem, setActionLoading } = params;
    const reason = getBlockedReason(role, 'submit_for_review', item.status);
    if (reason) {
        toast.error(reason);
        return;
    }
    setActionLoading('submit_for_review');
    const result = await api.submitForReview(id);
    setActionLoading(null);
    if (result.success) {
        setItem(result.data!);
        toast.success('Submitted for review.');
    } else {
        toast.error(result.error ?? 'Failed to submit.');
    }
}

export async function approvePublish(params: ApprovePublishParams): Promise<void> {
    const { id, item, role, api, setItem, setActionLoading } = params;
    const reason = getBlockedReason(role, 'approve_publish', item.status);
    if (reason) {
        toast.error(reason);
        return;
    }
    setActionLoading('approve_publish');
    const result = await api.approveContent(id);
    setActionLoading(null);
    if (result.success) {
        setItem(result.data!);
        toast.success('Published.');
    } else {
        toast.error(result.error ?? 'Failed to publish.');
    }
}
