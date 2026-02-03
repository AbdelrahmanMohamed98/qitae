import type { Role } from '@qitae/shared';

export const ROLES: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'reviewer', label: 'Reviewer' },
];

const RANDOM_FIRST_NAMES = [
  'Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley',
  'Avery', 'Quinn', 'Reese', 'Jamie', 'Drew', 'Blake', 'Cameron',
  'Skyler', 'Parker', 'Finley', 'Sage', 'River', 'Phoenix',
];

export function getRandomName(): string {
  const first = RANDOM_FIRST_NAMES[Math.floor(Math.random() * RANDOM_FIRST_NAMES.length)];
  const last = Math.random().toString(36).slice(2, 6);
  return `${first} ${last}`;
}
