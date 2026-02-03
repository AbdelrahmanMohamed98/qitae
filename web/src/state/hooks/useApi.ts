import { useAtomValue } from 'jotai';
import { apiAtom } from '../atoms/api';

export function useApi() {
  return useAtomValue(apiAtom);
}
