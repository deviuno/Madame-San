import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: 'group', label: 'Usuários' },
    { path: '/admin/courses', icon: 'school', label: 'Cursos' },
    { path: '/admin/ebooks', icon: 'auto_stories', label: 'E-books' },
    { path: '/admin/products', icon: 'storefront', label: 'Produtos' },
    { path: '/admin/categories', icon: 'category', label: 'Categorias' },
    { path: '/admin/editorial', icon: 'article', label: 'Editorial' },
    { path: '/admin/pearls', icon: 'format_quote', label: 'Pérolas do Dia' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-stone-100 dark:bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col bg-white dark:bg-[#111111] border-r border-stone-200 dark:border-white/5 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-stone-200 dark:border-white/5">
          {sidebarOpen && (
            <span className="text-lg font-display text-stone-900 dark:text-white">
              Madame San
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">
              {sidebarOpen ? 'menu_open' : 'menu'}
            </span>
          </button>
        </div>

        {/* Admin Badge */}
        <div className="px-4 py-3 border-b border-stone-200 dark:border-white/5">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]">shield_person</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin</span>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[140px]">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(item.path, item.exact)
                      ? 'bg-primary/10 text-primary'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5'
                  } ${!sidebarOpen && 'justify-center'}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Back to App */}
        <div className="p-3 border-t border-stone-200 dark:border-white/5">
          <button
            onClick={() => navigate('/home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            {sidebarOpen && <span className="text-sm font-medium">Voltar ao App</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
