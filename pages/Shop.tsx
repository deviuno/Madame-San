import React from 'react';
import { useNavigate } from 'react-router-dom';

const Shop: React.FC = () => {
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
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Boutique</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark text-slate-900 dark:text-white hover:bg-primary hover:text-black transition-colors ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background-light dark:border-background-dark"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 pt-2">
        <div className="px-6 flex flex-col gap-4">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full rounded-[8px] bg-white dark:bg-surface-dark border-none py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-1 focus:ring-primary shadow-sm ring-1 ring-black/5 dark:ring-white/5" 
              placeholder="Buscar pérolas, joias..." 
              type="text"
            />
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
            <button className="shrink-0 px-4 py-1.5 rounded-full bg-primary text-black text-xs font-bold border border-primary shadow-[0_2px_8px_rgba(212,175,55,0.25)]">Tudo</button>
            <button className="shrink-0 px-4 py-1.5 rounded-full bg-white dark:bg-surface-dark dark:text-gray-300 text-slate-600 border border-slate-200 dark:border-white/10 text-xs font-medium hover:border-primary hover:text-primary transition-all hover:scale-105 shadow-sm">Colares</button>
            <button className="shrink-0 px-4 py-1.5 rounded-full bg-white dark:bg-surface-dark dark:text-gray-300 text-slate-600 border border-slate-200 dark:border-white/10 text-xs font-medium hover:border-primary hover:text-primary transition-all hover:scale-105 shadow-sm">Brincos</button>
            <button className="shrink-0 px-4 py-1.5 rounded-full bg-white dark:bg-surface-dark dark:text-gray-300 text-slate-600 border border-slate-200 dark:border-white/10 text-xs font-medium hover:border-primary hover:text-primary transition-all hover:scale-105 shadow-sm">Pulseiras</button>
            <button className="shrink-0 px-4 py-1.5 rounded-full bg-white dark:bg-surface-dark dark:text-gray-300 text-slate-600 border border-slate-200 dark:border-white/10 text-xs font-medium hover:border-primary hover:text-primary transition-all hover:scale-105 shadow-sm">Anéis</button>
          </div>
        </div>

        <section className="px-6">
          <div className="relative w-full aspect-[16/9] rounded-[8px] overflow-hidden shadow-lg shadow-black/10 dark:shadow-black/20 group cursor-pointer ring-1 ring-black/5 dark:ring-white/10">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnJKfhTxWzo2q-l3005cEqfjcx2FtTovo33gFiQUJaaKvU8RCO-24lBxMQFCUge2eWNYzHJRFnZGRGxgzQcGf5XEIC37CzQs0SAaB-4IAZ6U4ZO_mObUNSNcWo-sNt60_BjKRaQLd95i7Z1Jgjwy7lTFrcAO4JctPVYb9vWKMVDJg652xAOK2c8MLdsIvD-dhmPNDZvMSGrgTVElz6fny0hYeoqS9OXVLGZpebYoophQ5h2OFFpzUYal_9Nos_SJxcqxhXia0cHyg')"}}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className="inline-block px-2.5 py-1 mb-2 text-[10px] font-bold text-black uppercase tracking-wider bg-white/90 backdrop-blur-sm rounded-full">Destaque</span>
              <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-sm">Coleção Barroca</h2>
              <p className="text-gray-200 text-xs line-clamp-1 mb-3 opacity-90">A beleza da imperfeição natural em peças únicas.</p>
              <button className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explorar Coleção <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 px-6">
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Novidades</h2>
            <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors">
              Filtrar <span className="material-symbols-outlined text-[16px]">filter_list</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Product Card 1 */}
            <div className="group flex flex-col gap-2 p-2 rounded-[8px] bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all hover:ring-primary/50 hover:shadow-md">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-slate-200">
                <img alt="Colar Pérola Akoya" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu2IivgBbJYp9B1eJYbZ3QNT5554NOExvylquqm495J68IjtTttBlZRsGGZbroBqhmfkVlO6OtmoH--2uOZXglBg8D9qhMhbKjzUNzxFBfAkBmN1ygrhqg2HtXrp0cLtpW5n9lh7uQ_R1F2TWhVZhR72RzW8rxDjtScHiwC0PBYzCMT7G8O1hhKpGl2NGuZE7WYxvB6ZN27LsVH9nemQQCfpej8GZBRP-0OVYAqIcB9nfD2y0CmUMGW2OI8lmaG0ZDiMbaVh4M3s4"/>
                <button className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-primary hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[14px]">favorite</span>
                </button>
              </div>
              <div className="flex flex-col gap-1 p-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 leading-tight">Colar Akoya Classic</h3>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">Pérolas 7mm, Ouro 18k</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-primary">R$ 4.500</span>
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>add_circle</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group flex flex-col gap-2 p-2 rounded-[8px] bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all hover:ring-primary/50 hover:shadow-md">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-slate-200">
                <img alt="Brincos South Sea" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY"/>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-black text-[9px] font-bold uppercase tracking-wide">Novo</div>
                <button className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-primary hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[14px]">favorite</span>
                </button>
              </div>
              <div className="flex flex-col gap-1 p-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 leading-tight">Brincos South Sea</h3>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">Dourado Natural</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-primary">R$ 8.200</span>
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>add_circle</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group flex flex-col gap-2 p-2 rounded-[8px] bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all hover:ring-primary/50 hover:shadow-md">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-slate-800">
                <img alt="Kit Manutenção" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXsz4AwfXL5xbG4CvuLUAXVIxpSeRLq4jyngNzQCuhmjwYWgIHaYxXCb0Nd4SW-9EFuGECB5ILv57z5njjss0jN1DSD-CGoakam-66ctRneuZLkNXBgxw9GVkGIP04GWMLFS0FiUFFqa1uwM2OJCkgkgIXx0GMawu2AOY14_CxHu5OjYLUkC_9W_z3QaEqCjrCZUeb2ZWmtZ5URJ-DHGwMVUqru4h0uz4MZZMgOiqWrmqAEEi2kMok-ra_YlWQwm1O2WYcZsV_KLE"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <button className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-primary hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[14px]">favorite</span>
                </button>
              </div>
              <div className="flex flex-col gap-1 p-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 leading-tight">Kit Care Deluxe</h3>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">Flanela e Solução</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-primary">R$ 180</span>
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>add_circle</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="group flex flex-col gap-2 p-2 rounded-[8px] bg-white dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all hover:ring-primary/50 hover:shadow-md">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[6px] bg-slate-200">
                <img alt="Guia do Colecionador" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY"/>
                <button className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-primary hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[14px]">favorite</span>
                </button>
              </div>
              <div className="flex flex-col gap-1 p-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 leading-tight">Guia do Colecionador</h3>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">Edição Capa Dura</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-primary">R$ 290</span>
                  <button className="text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>add_circle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-10"></div>
        </section>
      </main>
    </div>
  );
};

export default Shop;