import { Text } from './ui';
import DocumentIcon from '@shared-assets/document.svg';
import type { EmptyStateProps } from '../types/EmptyState.types';

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="panel-empty">
      <div className="panel-icon bg-slate-200 text-slate-500">
        <img src={DocumentIcon} alt="No content" className="h-6 w-6" />
      </div>
      <Text body className="mt-4 font-medium text-slate-700">{title}</Text>
      {description && <Text caption className="mt-1">{description}</Text>}
    </div>
  );
}
