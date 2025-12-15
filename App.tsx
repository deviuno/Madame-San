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
          className={`flex flex-1 flex-col items-center gap-0.5 p-1 rounded-xl transition-all duration-300 group ${isActive('/courses') ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'}`}
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
          className={`flex flex-1 flex-col items-center gap-0.5 p-1 rounded-xl transition-all duration-300 group ${isActive('/shop') ? 'text-primary' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'}`}
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
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-stone-900 dark:text-stone-100 font-sans transition-colors duration-500">
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