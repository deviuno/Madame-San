import React from 'react';
import { useNavigate } from 'react-router-dom';

const Courses: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
      <header className="w-full bg-background-light dark:bg-background-dark pt-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] font-light">arrow_back</span>
            </button>
            <h1 className="text-xl font-display font-medium tracking-wide text-stone-900 dark:text-white">Academia</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center text-stone-900 dark:text-white hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px] font-light">search</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-8 pt-2">
        <section className="flex flex-col gap-4 px-6 border-b border-stone-200 dark:border-white/5 pb-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            <button className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-primary pb-1">Todos</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors pb-1">Pérolas</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors pb-1">Diamantes</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors pb-1">História</button>
          </div>
        </section>

        <section className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-stone-900 dark:text-white tracking-wide">Em Andamento</h2>
          </div>
          <div className="group relative flex items-center gap-5 rounded-sm bg-white dark:bg-[#101010] p-4 shadow-sm border border-stone-200 dark:border-white/5 cursor-pointer hover:border-primary/30 transition-all">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden">
              <img alt="Course Thumbnail" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu2IivgBbJYp9B1eJYbZ3QNT5554NOExvylquqm495J68IjtTttBlZRsGGZbroBqhmfkVlO6OtmoH--2uOZXglBg8D9qhMhbKjzUNzxFBfAkBmN1ygrhqg2HtXrp0cLtpW5n9lh7uQ_R1F2TWhVZhR72RzW8rxDjtScHiwC0PBYzCMT7G8O1hhKpGl2NGuZE7WYxvB6ZN27LsVH9nemQQCfpej8GZBRP-0OVYAqIcB9nfD2y0CmUMGW2OI8lmaG0ZDiMbaVh4M3s4"/>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="material-symbols-outlined text-white text-[24px] drop-shadow-lg opacity-80">play_arrow</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] uppercase font-bold text-primary tracking-widest">Módulo 2</span>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">12 min</span>
              </div>
              <h3 className="text-lg font-display text-stone-900 dark:text-white leading-none mb-2">Avaliação de Lustre</h3>
              <div className="flex items-center gap-3">
                <div className="relative h-px w-full bg-stone-200 dark:bg-white/10">
                  <div className="absolute left-0 top-0 h-px w-[65%] bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                </div>
                <span className="text-[9px] font-bold text-stone-400">65%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 px-6 pb-20">
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-lg font-display text-stone-900 dark:text-white tracking-wide">Masterclass</h2>
            <button className="flex items-center gap-1 text-[9px] font-bold text-stone-400 uppercase tracking-widest hover:text-primary transition-colors">
              Filtros
            </button>
          </div>
          <div className="grid gap-8">
            {/* Course Card 1 */}
            <article className="flex flex-col group cursor-pointer">
              <div className="relative h-56 w-full overflow-hidden mb-4">
                <img alt="Course" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY"/>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 border border-white/10">
                    <span className="material-symbols-outlined text-[10px] text-primary">star</span>
                    <span className="text-[9px] font-bold text-white tracking-widest">4.9</span>
                </div>
              </div>
              <div className="flex flex-col px-1">
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Intermediário</span>
                <h3 className="text-xl font-display text-stone-900 dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">Pérolas do Mar do Sul</h3>
                <p className="text-sm font-serif text-stone-600 dark:text-stone-400 line-clamp-2 mb-4 leading-relaxed">Guia completo sobre a identificação, valorização e comércio das pérolas douradas.</p>
                <div className="flex items-center justify-between border-t border-stone-200 dark:border-white/10 pt-3">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">8h 20m</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">R$ 299</span>
                </div>
              </div>
            </article>

            {/* Course Card 2 (Locked) */}
            <article className="flex flex-col group cursor-pointer relative opacity-90 hover:opacity-100 transition-opacity">
              <div className="relative h-56 w-full overflow-hidden mb-4">
                 <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] flex items-center justify-center flex-col gap-3 transition-opacity duration-300">
                  <span className="material-symbols-outlined text-white text-[28px] font-light">lock</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] border border-white/30 px-3 py-1">Premium</span>
                </div>
                <img alt="Course" className="h-full w-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnJKfhTxWzo2q-l3005cEqfjcx2FtTovo33gFiQUJaaKvU8RCO-24lBxMQFCUge2eWNYzHJRFnZGRGxgzQcGf5XEIC37CzQs0SAaB-4IAZ6U4ZO_mObUNSNcWo-sNt60_BjKRaQLd95i7Z1Jgjwy7lTFrcAO4JctPVYb9vWKMVDJg652xAOK2c8MLdsIvD-dhmPNDZvMSGrgTVElz6fny0hYeoqS9OXVLGZpebYoophQ5h2OFFpzUYal_9Nos_SJxcqxhXia0cHyg"/>
              </div>
              <div className="flex flex-col px-1">
                <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-1">Avançado</span>
                <h3 className="text-xl font-display text-stone-500 dark:text-stone-400 mb-2 leading-tight">Colecionismo de Elite</h3>
                <p className="text-sm font-serif text-stone-500 dark:text-stone-500 line-clamp-2 mb-4 leading-relaxed">Estratégias de investimento em peças raras e leilões internacionais para experts.</p>
                <button className="w-full border border-stone-300 dark:border-white/20 hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-black py-3 text-[10px] font-bold uppercase tracking-widest transition-all">
                  Desbloquear Acesso
                </button>
              </div>
            </article>

            {/* Course Card 3 */}
             <article className="flex flex-col group cursor-pointer">
              <div className="relative h-56 w-full overflow-hidden mb-4">
                <img alt="Course" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY"/>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="flex flex-col px-1">
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Iniciante</span>
                <h3 className="text-xl font-display text-stone-900 dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">História das Gemas</h3>
                <p className="text-sm font-serif text-stone-600 dark:text-stone-400 line-clamp-2 mb-4 leading-relaxed">Uma jornada pelas pedras preciosas que moldaram impérios e culturas.</p>
                <div className="flex items-center justify-between border-t border-stone-200 dark:border-white/10 pt-3">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">4h 15m</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">Gratuito</span>
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