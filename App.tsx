import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Loading from './pages/Loading';
import LessonPlayer from './pages/LessonPlayer';
import Ebooks from './pages/Ebooks';
import EbookDetails from './pages/EbookDetails';
import EbookReader from './pages/EbookReader';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminEbooks from './pages/admin/AdminEbooks';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminEditorial from './pages/admin/AdminEditorial';
import AdminPearls from './pages/admin/AdminPearls';
import AdminUsers from './pages/admin/AdminUsers';

// Context for global theme state
export const ThemeContext = React.createContext({
  isDark: true,
  toggleTheme: () => {},
});

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Don't show nav on login, register, forgot-password, loading, details pages, or admin pages
  const hiddenPaths = ['/login', '/register', '/forgot-password', '/'];
  const isDetailsPage = location.pathname.includes('/course/') || location.pathname.includes('/product/') || location.pathname.includes('/ebook/') || location.pathname.includes('/read/');
  const isAdminPage = location.pathname.startsWith('/admin');
  if (hiddenPaths.includes(location.pathname) || isDetailsPage || isAdminPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-surface-light/90 dark:bg-[#050505]/90 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.6)] border-t border-white/20 dark:border-white/5 transition-all duration-500 py-1">
      <div className="flex items-center justify-between px-4">
        <button
          onClick={() => navigate('/home')}
          className={`flex flex-1 flex-col items-center gap-0.5 p-1 rounded-xl transition-all duration-300 group ${isActive('/home') ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'}`}
        >
          <span className={`material-symbols-outlined text-[22px] font-light transition-transform duration-300 ${isActive('/home') ? "font-variation-settings: 'FILL' 1, 'wght' 400" : "font-variation-settings: 'FILL' 0, 'wght' 300 scale-95"}`}>home</span>
          <span className="text-[9px] font-medium tracking-wide">Início</span>
        </button>

        <button
          onClick={() => navigate('/courses')}
          className={`flex flex-1 flex-col items-center gap-0.5 p-1 rounded-xl transition-all duration-300 group ${isActive('/courses') || location.pathname.includes('/course/') ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'}`}
        >
          <span className={`material-symbols-outlined text-[22px] font-light transition-transform duration-300 ${isActive('/courses') ? "font-variation-settings: 'FILL' 1, 'wght' 400" : "font-variation-settings: 'FILL' 0, 'wght' 300 scale-95"}`}>school</span>
          <span className="text-[9px] font-medium tracking-wide">Cursos</span>
        </button>

        <div className="relative -top-6 group px-1">
          {/* Glow suave atrás da pérola */}
          <div className={`absolute inset-0 rounded-full bg-primary/30 blur-2xl transition-opacity duration-500 ${isActive('/chat') ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`}></div>

          <button
            onClick={() => navigate('/chat')}
            className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1 pearl-shadow bg-pearl-gradient"
          >
             {/* Ícone dentro da pérola - cor escura para contraste com o dourado */}
             <span className="material-symbols-outlined text-[26px] drop-shadow-sm text-[#5C4D22] opacity-90">auto_awesome</span>

             {/* Brilho especular adicional no topo para reforçar o efeito 3D */}
             <div className="absolute top-2 left-3 w-4 h-3 bg-white/40 blur-[2px] rounded-full -rotate-45"></div>
          </button>
        </div>

        <button
          onClick={() => navigate('/shop')}
          className={`flex flex-1 flex-col items-center gap-0.5 p-1 rounded-xl transition-all duration-300 group ${isActive('/shop') || location.pathname.includes('/product/') ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'}`}
        >
          <span className={`material-symbols-outlined text-[22px] font-light transition-transform duration-300 ${isActive('/shop') ? "font-variation-settings: 'FILL' 1, 'wght' 400" : "font-variation-settings: 'FILL' 0, 'wght' 300 scale-95"}`}>storefront</span>
          <span className="text-[9px] font-medium tracking-wide">Loja</span>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-1 flex-col items-center gap-0.5 p-1 rounded-xl transition-all duration-300 group ${isActive('/profile') ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'}`}
        >
          <span className={`material-symbols-outlined text-[22px] font-light transition-transform duration-300 ${isActive('/profile') ? "font-variation-settings: 'FILL' 1, 'wght' 400" : "font-variation-settings: 'FILL' 0, 'wght' 300 scale-95"}`}>person</span>
          <span className="text-[9px] font-medium tracking-wide">Perfil</span>
        </button>
      </div>
    </nav>
  );
};

function AppContent() {
  const [isDark, setIsDark] = useState(true);

  // Initialize theme from localStorage or default to true
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className="bg-background-light dark:bg-background-dark min-h-screen text-stone-900 dark:text-stone-100 font-sans transition-colors duration-500">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Loading />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          } />
          <Route path="/course/:id" element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          } />
          <Route path="/lesson/:id" element={
            <ProtectedRoute>
              <LessonPlayer />
            </ProtectedRoute>
          } />
          <Route path="/ebooks" element={
            <ProtectedRoute>
              <Ebooks />
            </ProtectedRoute>
          } />
          <Route path="/ebook/:id" element={
            <ProtectedRoute>
              <EbookDetails />
            </ProtectedRoute>
          } />
          <Route path="/read/:id" element={
            <ProtectedRoute>
              <EbookReader />
            </ProtectedRoute>
          } />
          <Route path="/shop" element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          } />
          <Route path="/product/:id" element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/courses/*" element={
            <AdminRoute>
              <AdminCourses />
            </AdminRoute>
          } />
          <Route path="/admin/ebooks/*" element={
            <AdminRoute>
              <AdminEbooks />
            </AdminRoute>
          } />
          <Route path="/admin/products/*" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/categories/*" element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          } />
          <Route path="/admin/editorial/*" element={
            <AdminRoute>
              <AdminEditorial />
            </AdminRoute>
          } />
          <Route path="/admin/pearls/*" element={
            <AdminRoute>
              <AdminPearls />
            </AdminRoute>
          } />
          <Route path="/admin/users/*" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
        </Routes>
        <BottomNav />
      </div>
    </ThemeContext.Provider>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}
