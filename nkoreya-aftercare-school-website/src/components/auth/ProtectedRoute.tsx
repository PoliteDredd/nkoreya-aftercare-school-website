import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, rolesLoading, isAdmin, isPrincipal } = useAuth();
  const location = useLocation();

  // Wait for auth and roles to finish loading
  if (loading || (user && rolesLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    const redirectTo = requireAdmin ? '/admin/login' : '/auth';
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin && !isPrincipal) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
