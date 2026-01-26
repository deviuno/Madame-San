import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, loading: authLoading } = useAuth();
  const location = useLocation();

  // Use profile from AuthContext directly instead of fetching again
  const isAdmin = profile?.is_admin === true;

  console.log('AdminRoute: authLoading:', authLoading, 'user:', user?.id, 'profile:', profile, 'isAdmin:', isAdmin);

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined text-[64px] text-red-500">block</span>
        <h1 className="text-2xl font-display text-stone-900 dark:text-white">Acesso Negado</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 font-serif text-center max-w-md">
          Você não tem permissão para acessar o painel administrativo.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-3 bg-primary text-black text-sm font-bold uppercase tracking-widest rounded-sm"
        >
          Voltar
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRoute;
