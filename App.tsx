import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Loading from './pages/Loading';

// Context for global theme state
export const ThemeContext = React.createContext({
  isDark: true,
  toggleTheme: () => {},
});

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Don't show nav on login or loading
  if (location.pathname === '/login' || location.pathname === '/') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-surface-light/95 dark:bg-[#1E1E1E]/95 backdrop-blur-xl shadow-[0_-4px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_32px_rgba(0,0,0,0.4)] border-t border-black/5 dark:border-white/5 transition-all duration-300 pb-1">
      <div className="flex items-center justify-between px-2 py-2">
        <button 
          onClick={() => navigate('/home')}
          className={`flex flex-1 flex-col items-center gap-1 p-2 rounded-xl transition-colors group ${isActive('/home') ? 'text-primary' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/home') ? "font-variation-settings: 'FILL' 1" : 'group-hover:scale-110 transition-transform'}`}>home</span>
          <span className={`text-[10px] ${isActive('/home') ? 'font-bold' : 'font-medium'}`}>Início</span>
        </button>

        <button 
          onClick={() => navigate('/courses')}
          className={`flex flex-1 flex-col items-center gap-1 p-2 rounded-xl transition-colors group ${isActive('/courses') ? 'text-primary' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/courses') ? "font-variation-settings: 'FILL' 1" : 'group-hover:scale-110 transition-transform'}`}>school</span>
          <span className={`text-[10px] ${isActive('/courses') ? 'font-bold' : 'font-medium'}`}>Cursos</span>
        </button>

        <div className="relative -top-8">
          <button 
            onClick={() => navigate('/chat')}
            className="flex h-[64px] w-[64px] flex-col items-center justify-center rounded-full bg-gradient-to-tr from-primary to-[#F2D06B] text-black shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform border-[6px] border-background-light dark:border-background-dark"
          >
             <span className="material-symbols-outlined text-[30px]">auto_awesome</span>
          </button>
        </div>

        <button 
          onClick={() => navigate('/shop')}
          className={`flex flex-1 flex-col items-center gap-1 p-2 rounded-xl transition-colors group ${isActive('/shop') ? 'text-primary' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/shop') ? "font-variation-settings: 'FILL' 1" : 'group-hover:scale-110 transition-transform'}`}>storefront</span>
          <span className={`text-[10px] ${isActive('/shop') ? 'font-bold' : 'font-medium'}`}>Loja</span>
        </button>

        <button 
          onClick={() => navigate('/profile')}
          className={`flex flex-1 flex-col items-center gap-1 p-2 rounded-xl transition-colors group ${isActive('/profile') ? 'text-primary' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <span className={`material-symbols-outlined text-[24px] ${isActive('/profile') ? "font-variation-settings: 'FILL' 1" : 'group-hover:scale-110 transition-transform'}`}>person</span>
          <span className={`text-[10px] ${isActive('/profile') ? 'font-bold' : 'font-medium'}`}>Perfil</span>
        </button>
      </div>
    </nav>
  );
};

export default function App() {
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
      <HashRouter>
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-gray-100 font-display transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Loading />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
          <BottomNav />
        </div>
      </HashRouter>
    </ThemeContext.Provider>
  );
}