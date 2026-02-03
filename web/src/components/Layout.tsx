import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/hooks';
import { canPerformAction } from '@qitae/shared';
import { Text } from './ui';
import PlusIcon from '@shared-assets/plus.svg';

export default function Layout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const canCreate = session && canPerformAction(session.role, 'create', 'draft');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200/80 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-900 hover:text-slate-700 transition-colors"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-semibold text-sm">
                Q
              </span>
              <Text title2 className="!text-lg">Qitae</Text>
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {canCreate && (
              <Link
                to="/content/new"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                <img src={PlusIcon} alt="New draft" className="h-5 w-5" />
                New draft
              </Link>
            )}
            <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                {session?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
              <div className="hidden sm:block">
                <Text bodySmall className="font-medium text-slate-900">Hey, {session?.name}</Text>
                <Text caption className="capitalize">{session?.role}</Text>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 relative">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
