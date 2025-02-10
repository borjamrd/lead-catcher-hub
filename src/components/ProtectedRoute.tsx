
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/inicia-sesion" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
