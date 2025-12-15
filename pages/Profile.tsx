import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-28">
      <header className="w-full bg-background-light dark:bg-background-dark pt-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-primary">Perfil</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-surface-dark text-slate-900 dark:text-white hover:bg-primary hover:text-black transition-colors ring-1 ring-black/5 dark:ring-white/10">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background-light dark:border-background-dark"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 pt-2 px-4">
        <section className="flex flex-col items-center justify-center py-2">
          <div className="relative group cursor-pointer">
            <div className="h-28 w-28 rounded-full p-1 border-2 border-primary overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <img alt="User profile portrait" className="h-full w-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfzHlXrB6NUjc_IQu5qaem5zQxiiEvRtsHGKyWf8czdLe5wo0D1iXbLI6yNKdfXZTfIdxT_DN0zzywWIb8OsMiN_--6VRZH6wyYnau0NvjJWTPj9mXYWkOq5ykAvymLZNwDvegkVfX6n58i53KIdU4hIMWM2mHxe7odkDy9oIYi_kf5Xalim-udYjO0BKuAH6-nRfE5R4YwnNpOcbsNUOCnV-KM_43VgQ3_LlOgfyRaox3n-ntH8TcOYSCIptEvfL2zrQwhChdeiE"/>
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-black rounded-full p-2 border-4 border-background-light dark:border-background-dark hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[16px] font-bold">edit</span>
            </button>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Madame Julia</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-[4px] bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wide border border-primary/30">Membro VIP</span>
            <span className="text-xs text-slate-500 dark:text-gray-400">• Desde 2023</span>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-surface-dark rounded-[8px] p-3 flex flex-col items-center justify-center gap-1 shadow-sm ring-1 ring-black/5 dark:ring-white/5 hover:ring-primary/50 transition-all cursor-pointer group">
            <span className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">12</span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wide">Cursos</span>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-[8px] p-3 flex flex-col items-center justify-center gap-1 shadow-sm ring-1 ring-black/5 dark:ring-white/5 hover:ring-primary/50 transition-all cursor-pointer group">
            <span className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">3</span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wide">Certificados</span>
          </div>
          <div className="bg-white dark:bg-surface-dark rounded-[8px] p-3 flex flex-col items-center justify-center gap-1 shadow-sm ring-1 ring-black/5 dark:ring-white/5 hover:ring-primary/50 transition-all cursor-pointer group">
            <span className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">5</span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wide">Pedidos</span>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Conta</h3>
          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-between w-full p-4 bg-white dark:bg-surface-dark rounded-[8px] shadow-sm ring-1 ring-black/5 dark:ring-white/5 hover:ring-primary/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 group-hover:bg-primary group-hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Dados Pessoais</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </button>
            <button className="flex items-center justify-between w-full p-4 bg-white dark:bg-surface-dark rounded-[8px] shadow-sm ring-1 ring-black/5 dark:ring-white/5 hover:ring-primary/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 group-hover:bg-primary group-hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Pagamentos & Assinatura</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Aplicativo</h3>
          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-between w-full p-4 bg-white dark:bg-surface-dark rounded-[8px] shadow-sm ring-1 ring-black/5 dark:ring-white/5 hover:ring-primary/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 group-hover:bg-primary group-hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Notificações</span>
              </div>
              <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                <span className="translate-x-5 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow"></span>
              </div>
            </button>
            
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-between w-full p-4 bg-white dark:bg-surface-dark rounded-[8px] shadow-sm ring-1 ring-black/5 dark:ring-white/5 hover:ring-primary/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 group-hover:bg-primary group-hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{isDark ? 'dark_mode' : 'light_mode'}</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Aparência</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-gray-400 font-medium mr-2">{isDark ? 'Escuro' : 'Claro'}</span>
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2 pt-2">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center justify-between w-full p-4 bg-white dark:bg-surface-dark rounded-[8px] shadow-sm ring-1 ring-black/5 dark:ring-white/5 hover:ring-red-500/20 hover:border-red-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-red-400">Sair da Conta</span>
            </div>
          </button>
          <div className="text-center py-4">
            <p className="text-[10px] text-slate-400">Versão 2.4.0 (Build 1024)</p>
          </div>
        </section>
        <div className="h-10"></div>
      </main>
    </div>
  );
};

export default Profile;