import React, { useContext } from 'react';
import { ThemeContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-30 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-stone-200 dark:border-white/5 pt-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] font-light">arrow_back</span>
            </button>
            <h1 className="text-xl font-display font-medium tracking-wide text-stone-900 dark:text-primary">Perfil</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center text-stone-900 dark:text-white hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px] font-light">settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-8 pt-4 px-6">
        <section className="flex flex-col items-center justify-center py-4">
          <div className="relative group cursor-pointer mb-4">
            <div className="h-32 w-32 rounded-full p-1.5 border border-primary/30 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)]">
              <img alt="User profile portrait" className="h-full w-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfzHlXrB6NUjc_IQu5qaem5zQxiiEvRtsHGKyWf8czdLe5wo0D1iXbLI6yNKdfXZTfIdxT_DN0zzywWIb8OsMiN_--6VRZH6wyYnau0NvjJWTPj9mXYWkOq5ykAvymLZNwDvegkVfX6n58i53KIdU4hIMWM2mHxe7odkDy9oIYi_kf5Xalim-udYjO0BKuAH6-nRfE5R4YwnNpOcbsNUOCnV-KM_43VgQ3_LlOgfyRaox3n-ntH8TcOYSCIptEvfL2zrQwhChdeiE"/>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-background-light dark:bg-background-dark border border-stone-200 dark:border-white/10 px-3 py-0.5 rounded-full">
               <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Editar</span>
            </div>
          </div>
          <h2 className="text-2xl font-display font-medium text-stone-900 dark:text-white tracking-wide">Madame Julia</h2>
          <p className="text-xs font-serif italic text-stone-500 dark:text-stone-400 mt-1">Membro VIP • Desde 2023</p>
        </section>

        <section className="grid grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-white/5 rounded-sm p-4 flex flex-col items-center justify-center gap-1 border border-stone-200 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group backdrop-blur-sm">
            <span className="text-xl font-display font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors">12</span>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Cursos</span>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-sm p-4 flex flex-col items-center justify-center gap-1 border border-stone-200 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group backdrop-blur-sm">
            <span className="text-xl font-display font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors">3</span>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Certificados</span>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-sm p-4 flex flex-col items-center justify-center gap-1 border border-stone-200 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group backdrop-blur-sm">
            <span className="text-xl font-display font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors">5</span>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Pedidos</span>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1 border-b border-primary/20 pb-2 w-full">Conta</h3>
          <div className="flex flex-col gap-1">
            <button className="flex items-center justify-between w-full py-4 px-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-sm transition-all group border-b border-stone-100 dark:border-white/5">
              <span className="text-sm font-serif text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Dados Pessoais</span>
              <span className="material-symbols-outlined text-stone-400 text-[18px] font-light">chevron_right</span>
            </button>
            <button className="flex items-center justify-between w-full py-4 px-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-sm transition-all group border-b border-stone-100 dark:border-white/5">
              <span className="text-sm font-serif text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Pagamentos & Assinatura</span>
              <span className="material-symbols-outlined text-stone-400 text-[18px] font-light">chevron_right</span>
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1 border-b border-primary/20 pb-2 w-full">Preferências</h3>
          <div className="flex flex-col gap-1">
            <button className="flex items-center justify-between w-full py-4 px-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-sm transition-all group border-b border-stone-100 dark:border-white/5">
               <span className="text-sm font-serif text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Notificações</span>
               <div className="h-4 w-8 bg-primary/20 rounded-full relative">
                  <div className="absolute right-0 top-0 h-4 w-4 bg-primary rounded-full shadow-sm"></div>
               </div>
            </button>
            
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-between w-full py-4 px-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-sm transition-all group border-b border-stone-100 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-serif text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Tema</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </section>

        <div className="py-6 flex justify-center">
            <button 
                onClick={() => navigate('/login')}
                className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors"
            >
                Sair da Conta
            </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;