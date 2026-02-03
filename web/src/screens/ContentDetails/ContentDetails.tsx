import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth, useApi } from '../../state/hooks';
import { getAllowedActions } from '@qitae/shared';
import { submitForReview as submitForReviewAction, approvePublish as approvePublishAction } from './ContentDetails.helper';
import { canAccessContent } from '../../services/contentService';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { StatusBadge } from '../../components/content-list';
import { Text } from '../../components/ui';
import { formatDate } from '../../helpers';
import BackIcon from '@shared-assets/back.svg';
import EditIcon from '@shared-assets/edit.svg';
import SubmitForReviewIcon from '@shared-assets/submit-for-review.svg';
import ApprovePublishIcon from '@shared-assets/approve-publish.svg';
import ArrowRightIcon from '@shared-assets/arrow-right.svg';
import type { ContentItem, AuditEntry } from '@qitae/shared';

export default function ContentDetails() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const api = useApi();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id || !session) return;
    setLoading(true);
    setError(null);
    const [contentRes, auditRes] = await Promise.all([
      api.getContentById(id),
      api.getAuditTrail(id),
    ]);
    setLoading(false);
    if (!contentRes.success) {
      setError(contentRes.error ?? 'Failed to load content');
      return;
    }
    const content = contentRes.data!;
    if (!canAccessContent(session, content)) {
      setError("You don't have access to this content.");
      return;
    }
    setItem(content);
    if (auditRes.success) setAudit(auditRes.data ?? []);
  }, [id, session, api]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmitForReview = useCallback(() => {
    if (!id || !item || !session) return;
    void submitForReviewAction({
      id,
      item,
      role: session.role,
      api,
      setItem,
      setActionLoading,
    });
  }, [id, item, session, api]);

  const handleApprovePublish = useCallback(() => {
    if (!id || !item || !session) return;
    void approvePublishAction({
      id,
      item,
      role: session.role,
      api,
      setItem,
      setActionLoading,
    });
  }, [id, item, session, api]);

  if (!session) return null;
  if (loading) return <LoadingState />;
  const isAccessDenied = error?.includes("don't have access");
  if (error || !item) {
    return (
      <ErrorState
        message={error ?? 'Content not found'}
        onRetry={id && !isAccessDenied ? loadData : undefined}
      />
    );
  }

  const allowedActions = getAllowedActions(session.role, item.status);

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <img src={BackIcon} alt="Back" className="h-4 w-4" />
        Back to list
      </Link>

      <article className="card">
        <header className="card-header">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <Text title1 className="sm:text-3xl">{item.title}</Text>
            <StatusBadge status={item.status} className="shrink-0" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-base text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Text label>Sector</Text>
              <Text body as="span">{item.sector}</Text>
            </span>
            <span className="inline-flex flex-col">
              <Text label>Updated</Text>
              <Text body as="span">{formatDate(item.updatedAt)}</Text>
            </span>
            <span className="inline-flex flex-col">
              <Text label>Created</Text>
              <Text body as="span">{formatDate(item.createdAt)}</Text>
            </span>
          </div>
        </header>
        <div className="card-body">
          <Text body className="whitespace-pre-wrap sm:text-lg">
            {item.body}
          </Text>
        </div>
      </article>

      {allowedActions.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {allowedActions.includes('edit') && (
            <Link to={`/content/${id}/edit`} className="btn btn-primary">
              <img src={EditIcon} alt="Edit" className="h-5 w-5" />
              Edit
            </Link>
          )}
          {allowedActions.includes('submit_for_review') && (
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={!!actionLoading}
              className="btn btn-amber"
            >
              <img src={SubmitForReviewIcon} alt="Submit for review" className="h-5 w-5" />
              {actionLoading === 'submit_for_review' ? 'Submitting…' : 'Submit for review'}
            </button>
          )}
          {allowedActions.includes('approve_publish') && (
            <button
              type="button"
              onClick={handleApprovePublish}
              disabled={!!actionLoading}
              className="btn btn-emerald"
            >
              <img src={ApprovePublishIcon} alt="Approve and publish" className="h-5 w-5" />
              {actionLoading === 'approve_publish' ? 'Publishing…' : 'Approve & publish'}
            </button>
          )}
        </div>
      )}

      <section className="section-card">
        <Text title3 as="h2" className="section-header">Audit trail</Text>
        <ul className="section-body">
          {audit.length === 0 ? (
            <li className="section-item py-8 text-center">
              <Text caption>No audit entries yet.</Text>
            </li>
          ) : (
            audit.map((entry) => (
              <li key={entry.id} className="section-item">
                <div className="flex flex-wrap items-center gap-2 text-base">
                  <Text body as="span" className="font-medium text-slate-800">{entry.action}</Text>
                  {entry.fromStatus && (
                    <>
                      <Text body as="span" className="text-slate-400">{entry.fromStatus}</Text>
                      <img src={ArrowRightIcon} alt="to" className="h-4 w-4 text-slate-300" />
                      {entry.toStatus && <Text body as="span" className="text-slate-600">{entry.toStatus}</Text>}
                    </>
                  )}
                  {!entry.fromStatus && entry.toStatus && (
                    <Text body as="span" className="text-slate-600">{entry.toStatus}</Text>
                  )}
                </div>
                <Text caption as="p" className="mt-1">
                  {entry.performedBy === 'current-user' && session
                    ? `${session.name} (you)`
                    : entry.performedBy}{' '}
                  · {formatDate(entry.performedAt)}
                </Text>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
