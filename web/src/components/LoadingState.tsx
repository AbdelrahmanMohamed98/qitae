import { Text } from './ui';

export default function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      role="status"
      aria-label="Loading"
    >
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent" />
      <Text caption>Loading…</Text>
    </div>
  );
}
