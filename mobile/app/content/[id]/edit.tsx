import { useLocalSearchParams, Redirect } from 'expo-router';
import DraftFormScreen from '../../../src/screens/DraftFormScreen';

export default function EditDraftScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return <Redirect href="/content" />;
  return <DraftFormScreen editId={id} />;
}
