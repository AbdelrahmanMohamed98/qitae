import { atom } from 'jotai';
import { createMockApi } from '@qitae/shared';
import type { ContentApi } from '@qitae/shared';

const apiInstance = createMockApi();

export const apiAtom = atom<ContentApi>(apiInstance);
