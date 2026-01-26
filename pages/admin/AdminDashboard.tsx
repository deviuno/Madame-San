import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';

interface DashboardMetrics {
  totalUsers: number;
  totalCourses: number;
  totalEbooks: number;
  totalProducts: number;
  totalEnrollments: number;
  recentUsers: Array<{ id: string; full_name: string; created_at: string | null }>;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalCourses: 0,
    totalEbooks: 0,
    totalProducts: 0,
    totalEnrollments: 0,
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Fetch counts in parallel
      const [
        usersResult,
        coursesResult,
        ebooksResult,
        productsResult,
        enrollmentsResult,
        recentUsersResult,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('ebooks').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('course_enrollments').select('id', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('id, full_name, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setMetrics({
        totalUsers: usersResult.count || 0,
        totalCourses: coursesResult.count || 0,
        totalEbooks: ebooksResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalEnrollments: enrollmentsResult.count || 0,
        recentUsers: recentUsersResult.data || [],
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Usuários', value: metrics.totalUsers, icon: 'group', color: 'bg-blue-500', path: '/admin/users' },
    { label: 'Cursos', value: metrics.totalCourses, icon: 'school', color: 'bg-purple-500', path: '/admin/courses' },
    { label: 'E-books', value: metrics.totalEbooks, icon: 'auto_stories', color: 'bg-green-500', path: '/admin/ebooks' },
    { label: 'Produtos', value: metrics.totalProducts, icon: 'storefront', color: 'bg-orange-500', path: '/admin/products' },
    { label: 'Matrículas', value: metrics.totalEnrollments, icon: 'how_to_reg', color: 'bg-pink-500', path: '/admin/courses' },
  ];

  const quickActions = [
    { label: 'Novo Curso', icon: 'add_circle', path: '/admin/courses/new' },
    { label: 'Novo E-book', icon: 'add_circle', path: '/admin/ebooks/new' },
    { label: 'Novo Produto', icon: 'add_circle', path: '/admin/products/new' },
    { label: 'Nova Pérola', icon: 'add_circle', path: '/admin/pearls/new' },
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display text-stone-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Visão geral da plataforma Madame San
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {statCards.map((stat) => (
                <button
                  key={stat.label}
                  onClick={() => navigate(stat.path)}
                  className="bg-white dark:bg-[#111111] rounded-lg p-5 border border-stone-200 dark:border-white/5 hover:border-primary/50 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-white text-[20px]">{stat.icon}</span>
                    </div>
                    <span className="material-symbols-outlined text-stone-300 dark:text-stone-600 group-hover:text-primary transition-colors">
                      arrow_forward
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-stone-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 p-5">
                <h2 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-4">
                  Ações Rápidas
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => navigate(action.path)}
                      className="flex items-center gap-2 p-3 rounded-lg bg-stone-50 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-colors text-stone-600 dark:text-stone-400"
                    >
                      <span className="material-symbols-outlined text-[18px]">{action.icon}</span>
                      <span className="text-xs font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Users */}
              <div className="lg:col-span-2 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                    Usuários Recentes
                  </h2>
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="text-xs text-primary hover:underline"
                  >
                    Ver todos
                  </button>
                </div>
                {metrics.recentUsers.length === 0 ? (
                  <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-8">
                    Nenhum usuário cadastrado
                  </p>
                ) : (
                  <div className="space-y-3">
                    {metrics.recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[16px]">person</span>
                          </div>
                          <span className="text-sm font-medium text-stone-900 dark:text-white">
                            {user.full_name}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Platform Status */}
            <div className="mt-6 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 p-5">
              <h2 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-4">
                Status da Plataforma
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-stone-600 dark:text-stone-400">Banco de Dados</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-stone-600 dark:text-stone-400">Autenticação</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-stone-600 dark:text-stone-400">Storage</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-stone-600 dark:text-stone-400">API</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
