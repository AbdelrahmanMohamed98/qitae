import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../state/hooks';
import { MOCK_USERS } from '../state/atoms/auth';
import { Text, Input } from '../components/ui';
import type { UserSession, Role } from '@qitae/shared';

const ROLES: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'reviewer', label: 'Reviewer' },
];

const RANDOM_FIRST_NAMES = [
  'Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley',
  'Avery', 'Quinn', 'Reese', 'Jamie', 'Drew', 'Blake', 'Cameron',
  'Skyler', 'Parker', 'Finley', 'Sage', 'River', 'Phoenix',
];

function getRandomName(): string {
  const first = RANDOM_FIRST_NAMES[Math.floor(Math.random() * RANDOM_FIRST_NAMES.length)];
  const last = Math.random().toString(36).slice(2, 6);
  return `${first} ${last}`;
}

export default function Login() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('admin');

  if (session) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = name.trim() || 'Guest';
    const template = MOCK_USERS[role];
    const userSession: UserSession = {
      id: template.id,
      name: displayName,
      role: template.role,
      assignedSectors: template.assignedSectors,
    };
    login(userSession);
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 px-8 py-10 text-center">
          <Text title2 className="text-white">Qitae</Text>
          <Text caption className="mt-1 text-slate-400">Content dashboard</Text>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Your name
            </label>
            <div className="flex gap-2">
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1"
                autoComplete="name"
              />
              <button
                type="button"
                onClick={() => setName(getRandomName())}
                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 whitespace-nowrap"
              >
                Random
              </button>
            </div>
          </div>
          <fieldset>
            <legend className="block text-sm font-medium text-slate-700 mb-3">
              Role
            </legend>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-200 px-4 py-3 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <Text bodySmall className="font-medium text-slate-900">{r.label}</Text>
                </label>
              ))}
            </div>
          </fieldset>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
