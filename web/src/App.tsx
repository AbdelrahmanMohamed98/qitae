import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './state/hooks';
import Login from './screens/Login';
import ContentList from './screens/ContentList';
import ContentDetails from './screens/ContentDetails';
import DraftForm from './screens/DraftForm';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ContentList />} />
        <Route path="content/:id" element={<ContentDetails />} />
        <Route path="content/new" element={<DraftForm />} />
        <Route path="content/:id/edit" element={<DraftForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
