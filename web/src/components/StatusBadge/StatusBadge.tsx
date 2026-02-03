import { STATUS_STYLES, statusLabel } from './styles';
import type { StatusBadgeProps } from '../../types/StatusBadge.types';

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]} ${className}`}
    >
      {statusLabel(status)}
    </span>
  );
}
