import React from 'react';
import { useNavigate } from 'react-router-dom';

const Shop: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-30 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-stone-200 dark:border-white/5 pt-2 transition-all">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] font-light">arrow_back</span>
            </button>
            <h1 className="text-xl font-display font-medium tracking-wide text-stone-900 dark:text-white">Boutique</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center text-stone-900 dark:text-white hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px] font-light">shopping_bag</span>
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-8 pt-6">
        <div className="px-6 flex flex-col gap-6">
          <div className="relative group">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400 material-symbols-outlined text-[20px] font-light group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full bg-transparent border-b border-stone-300 dark:border-white/20 py-3 pl-8 pr-4 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 font-serif focus:outline-none focus:border-primary transition-colors" 
              placeholder="Buscar por coleção..." 
              type="text"
            />
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
            <button className="shrink-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-black bg-primary border border-primary">Tudo</button>
            <button className="shrink-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-white/10 hover:border-primary hover:text-primary transition-colors">Colares</button>
            <button className="shrink-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-white/10 hover:border-primary hover:text-primary transition-colors">Brincos</button>
            <button className="shrink-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-white/10 hover:border-primary hover:text-primary transition-colors">Pulseiras</button>
          </div>
        </div>

        <section className="px-6">
          <div className="relative w-full aspect-[16/10] overflow-hidden group cursor-pointer shadow-xl">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-110" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnJKfhTxWzo2q-l3005cEqfjcx2FtTovo33gFiQUJaaKvU8RCO-24lBxMQFCUge2eWNYzHJRFnZGRGxgzQcGf5XEIC37CzQs0SAaB-4IAZ6U4ZO_mObUNSNcWo-sNt60_BjKRaQLd95i7Z1Jgjwy7lTFrcAO4JctPVYb9vWKMVDJg652xAOK2c8MLdsIvD-dhmPNDZvMSGrgTVElz6fny0hYeoqS9OXVLGZpebYoophQ5h2OFFpzUYal_9Nos_SJxcqxhXia0cHyg')"}}></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[85%] border border-white/30 z-10"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
              <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-2 drop-shadow-md">Exclusivo</span>
              <h2 className="text-3xl font-display text-white mb-4 drop-shadow-lg italic">Baroque Collection</h2>
              <button className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/40 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                Ver Coleção
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 px-6">
          <div className="flex items-end justify-between border-b border-stone-200 dark:border-white/5 pb-2">
            <h2 className="text-xl font-display text-stone-900 dark:text-white tracking-wide">Novidades</h2>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{4} Itens</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10">
            
            {/* Product Card 1 */}
            <div className="group flex flex-col gap-3 cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-[#101010]">
                <img alt="Colar Pérola Akoya" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu2IivgBbJYp9B1eJYbZ3QNT5554NOExvylquqm495J68IjtTttBlZRsGGZbroBqhmfkVlO6OtmoH--2uOZXglBg8D9qhMhbKjzUNzxFBfAkBmN1ygrhqg2HtXrp0cLtpW5n9lh7uQ_R1F2TWhVZhR72RzW8rxDjtScHiwC0PBYzCMT7G8O1hhKpGl2NGuZE7WYxvB6ZN27LsVH9nemQQCfpej8GZBRP-0OVYAqIcB9nfD2y0CmUMGW2OI8lmaG0ZDiMbaVh4M3s4"/>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="h-8 w-8 flex items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-md hover:text-red-500">
                    <span className="material-symbols-outlined text-[16px]">favorite</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <h3 className="text-sm font-display text-stone-900 dark:text-white tracking-wide group-hover:text-primary transition-colors">Colar Akoya Classic</h3>
                <p className="text-[10px] text-stone-500 font-serif italic">Pérolas 7mm, Ouro 18k</p>
                <span className="text-xs font-bold text-stone-900 dark:text-white mt-1">R$ 4.500</span>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group flex flex-col gap-3 cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-[#101010]">
                <img alt="Brincos South Sea" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY"/>
                <div className="absolute top-3 left-0">
                  <span className="bg-primary text-black text-[9px] font-bold px-2 py-1 uppercase tracking-widest">Novo</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <h3 className="text-sm font-display text-stone-900 dark:text-white tracking-wide group-hover:text-primary transition-colors">Brincos South Sea</h3>
                <p className="text-[10px] text-stone-500 font-serif italic">Dourado Natural</p>
                <span className="text-xs font-bold text-stone-900 dark:text-white mt-1">R$ 8.200</span>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group flex flex-col gap-3 cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-[#101010]">
                <img alt="Kit Manutenção" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXsz4AwfXL5xbG4CvuLUAXVIxpSeRLq4jyngNzQCuhmjwYWgIHaYxXCb0Nd4SW-9EFuGECB5ILv57z5njjss0jN1DSD-CGoakam-66ctRneuZLkNXBgxw9GVkGIP04GWMLFS0FiUFFqa1uwM2OJCkgkgIXx0GMawu2AOY14_CxHu5OjYLUkC_9W_z3QaEqCjrCZUeb2ZWmtZ5URJ-DHGwMVUqru4h0uz4MZZMgOiqWrmqAEEi2kMok-ra_YlWQwm1O2WYcZsV_KLE"/>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <h3 className="text-sm font-display text-stone-900 dark:text-white tracking-wide group-hover:text-primary transition-colors">Kit Care Deluxe</h3>
                <p className="text-[10px] text-stone-500 font-serif italic">Flanela e Solução</p>
                <span className="text-xs font-bold text-stone-900 dark:text-white mt-1">R$ 180</span>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="group flex flex-col gap-3 cursor-pointer">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-[#101010]">
                <img alt="Guia do Colecionador" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY"/>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <h3 className="text-sm font-display text-stone-900 dark:text-white tracking-wide group-hover:text-primary transition-colors">Guia do Colecionador</h3>
                <p className="text-[10px] text-stone-500 font-serif italic">Edição Capa Dura</p>
                <span className="text-xs font-bold text-stone-900 dark:text-white mt-1">R$ 290</span>
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