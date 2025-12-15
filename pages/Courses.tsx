import React from 'react';
import { useNavigate } from 'react-router-dom';

const Courses: React.FC = () => {
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
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Cursos</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark text-slate-900 dark:text-white hover:bg-primary hover:text-black transition-colors ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 pt-2">
        <section className="flex flex-col gap-4 px-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button className="px-5 py-2 rounded-[8px] bg-primary text-black text-sm font-bold whitespace-nowrap shadow-sm shadow-primary/20">Todos</button>
            <button className="px-5 py-2 rounded-[8px] bg-white dark:bg-surface-dark border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap hover:border-primary/50 transition-colors shadow-sm">Pérolas</button>
            <button className="px-5 py-2 rounded-[8px] bg-white dark:bg-surface-dark border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap hover:border-primary/50 transition-colors shadow-sm">Diamantes</button>
            <button className="px-5 py-2 rounded-[8px] bg-white dark:bg-surface-dark border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap hover:border-primary/50 transition-colors shadow-sm">História</button>
            <button className="px-5 py-2 rounded-[8px] bg-white dark:bg-surface-dark border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 text-sm font-medium whitespace-nowrap hover:border-primary/50 transition-colors shadow-sm">Negócios</button>
          </div>
        </section>

        <section className="px-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Continuar Aprendendo</h2>
          </div>
          <div className="group relative flex items-center gap-4 rounded-[8px] bg-white dark:bg-surface-dark p-3 shadow-md ring-1 ring-black/5 dark:ring-white/5 cursor-pointer hover:ring-primary/30 transition-all">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[6px]">
              <img alt="Course Thumbnail" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu2IivgBbJYp9B1eJYbZ3QNT5554NOExvylquqm495J68IjtTttBlZRsGGZbroBqhmfkVlO6OtmoH--2uOZXglBg8D9qhMhbKjzUNzxFBfAkBmN1ygrhqg2HtXrp0cLtpW5n9lh7uQ_R1F2TWhVZhR72RzW8rxDjtScHiwC0PBYzCMT7G8O1hhKpGl2NGuZE7WYxvB6ZN27LsVH9nemQQCfpej8GZBRP-0OVYAqIcB9nfD2y0CmUMGW2OI8lmaG0ZDiMbaVh4M3s4"/>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                <span className="material-symbols-outlined text-white text-[28px] drop-shadow-lg">play_circle</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center py-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wide">Módulo 2 • Aula 3</span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-gray-400">12 min</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-3">Avaliação de Lustre</h3>
              <div className="flex items-center gap-3">
                <div className="relative h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-[65%] rounded-full bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-gray-400">65%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 px-6 pb-20">
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Catálogo de Cursos</h2>
            <button className="flex items-center gap-1 text-xs font-bold text-primary uppercase hover:text-primary-dark transition-colors">
              Filtros <span className="material-symbols-outlined text-[14px]">filter_list</span>
            </button>
          </div>
          <div className="grid gap-5">
            {/* Course Card 1 */}
            <article className="flex flex-col overflow-hidden rounded-[8px] bg-white dark:bg-surface-dark shadow-md ring-1 ring-black/5 dark:ring-white/5 group transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="relative h-44 w-full overflow-hidden">
                <img alt="Course" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                <div className="absolute top-3 right-3">
                  <span className="flex h-6 items-center justify-center rounded-[4px] bg-black/60 px-2 text-[10px] font-bold text-white backdrop-blur-md border border-white/10">
                    <span className="material-symbols-outlined mr-1 text-[12px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    4.9
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold text-black bg-primary rounded-[4px] uppercase tracking-wider">Intermediário</span>
                </div>
              </div>
              <div className="flex flex-col p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-snug">Pérolas do Mar do Sul</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">Guia completo sobre a identificação, valorização e comércio das pérolas douradas.</p>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-gray-400">8h 20m</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">R$ 299</span>
                </div>
              </div>
            </article>

            {/* Course Card 2 (Locked) */}
            <article className="flex flex-col overflow-hidden rounded-[8px] bg-white dark:bg-surface-dark shadow-md ring-1 ring-black/5 dark:ring-white/5 group relative">
              <div className="relative h-44 w-full overflow-hidden">
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex items-center justify-center flex-col gap-2 transition-opacity duration-300 group-hover:bg-black/50">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                    <span className="material-symbols-outlined text-black text-[20px]">lock</span>
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Exclusivo Premium</span>
                </div>
                <img alt="Course" className="h-full w-full object-cover grayscale-[30%]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnJKfhTxWzo2q-l3005cEqfjcx2FtTovo33gFiQUJaaKvU8RCO-24lBxMQFCUge2eWNYzHJRFnZGRGxgzQcGf5XEIC37CzQs0SAaB-4IAZ6U4ZO_mObUNSNcWo-sNt60_BjKRaQLd95i7Z1Jgjwy7lTFrcAO4JctPVYb9vWKMVDJg652xAOK2c8MLdsIvD-dhmPNDZvMSGrgTVElz6fny0hYeoqS9OXVLGZpebYoophQ5h2OFFpzUYal_9Nos_SJxcqxhXia0cHyg"/>
              </div>
              <div className="flex flex-col p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">Colecionismo de Elite</h3>
                  <span className="px-2 py-0.5 rounded-[4px] bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase">Avançado</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">Estratégias de investimento em peças raras e leilões internacionais para experts.</p>
                <button className="w-full rounded-[6px] bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-gray-200 py-2.5 text-xs font-bold text-white dark:text-black hover:scale-[1.02] transition-transform shadow-lg">
                  Desbloquear Acesso
                </button>
              </div>
            </article>

            {/* Course Card 3 */}
            <article className="flex flex-col overflow-hidden rounded-[8px] bg-white dark:bg-surface-dark shadow-md ring-1 ring-black/5 dark:ring-white/5 group transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="relative h-44 w-full overflow-hidden">
                <img alt="Course" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold text-black bg-white rounded-[4px] uppercase tracking-wider">Iniciante</span>
                </div>
              </div>
              <div className="flex flex-col p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-snug">História das Gemas</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">Uma jornada pelas pedras preciosas que moldaram impérios e culturas.</p>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-gray-400">4h 15m</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Gratuito</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Courses;