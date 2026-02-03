import { Text } from '../ui';
import WarningIcon from '@shared-assets/warning.svg';
import type { ErrorStateProps } from '../../types/ErrorState.types';

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="panel-error">
      <div className="panel-icon bg-red-100 text-red-600">
        <img src={WarningIcon} alt="Error" className="h-6 w-6" />
      </div>
      <Text body className="mt-4 font-medium text-red-800">{message}</Text>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 btn btn-primary">
          Try again
        </button>
      )}
    </div>
  );
}
