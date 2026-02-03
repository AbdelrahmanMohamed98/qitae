import { Link } from 'react-router-dom';
import { Text } from '../ui';
import StatusBadge from './StatusBadge';
import type { ContentCardProps } from '../../types/ContentCard.types';

export default function ContentCard({ item, formatDate }: ContentCardProps) {
  return (
    <Link to={`/content/${item.id}`} className="card-sm block">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Text title2 className="line-clamp-2 shrink min-w-0">
          {item.title}
        </Text>
        <StatusBadge status={item.status} className="shrink-0" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Text bodySmall className="font-medium text-slate-600">
          {item.sector}
        </Text>
        <Text caption className="text-slate-400">·</Text>
        <Text caption>
          {item.status === 'draft' && item.createdAt === item.updatedAt
            ? `Created ${formatDate(item.createdAt)}`
            : `Updated ${formatDate(item.updatedAt)}`}
        </Text>
      </div>
      {item.body && (
        <Text body className="mt-3 line-clamp-3 text-slate-600">
          {item.body}
        </Text>
      )}
    </Link>
  );
}
