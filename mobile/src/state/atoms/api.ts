import { atom } from 'jotai';
import { createMockApi } from '@qitae/shared';
import type { ContentApi } from '@qitae/shared';

const rawApi = createMockApi();
export const rawApiAtom = atom<ContentApi>(rawApi);
