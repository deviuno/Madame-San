import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-28">
      <header className="w-full bg-background-light dark:bg-background-dark pt-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-primary">Olá, Madame Julia</h1>
            <p className="text-xs font-medium text-slate-500 dark:text-gray-400">Gemologia & Luxo</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-surface-dark text-slate-900 dark:text-white hover:bg-primary hover:text-black transition-colors ring-1 ring-black/5 dark:ring-white/10">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background-light dark:border-background-dark"></span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="flex h-10 w-10 overflow-hidden rounded-full border-2 border-slate-200 dark:border-primary/30"
            >
              <img alt="User profile portrait" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfzHlXrB6NUjc_IQu5qaem5zQxiiEvRtsHGKyWf8czdLe5wo0D1iXbLI6yNKdfXZTfIdxT_DN0zzywWIb8OsMiN_--6VRZH6wyYnau0NvjJWTPj9mXYWkOq5ykAvymLZNwDvegkVfX6n58i53KIdU4hIMWM2mHxe7odkDy9oIYi_kf5Xalim-udYjO0BKuAH6-nRfE5R4YwnNpOcbsNUOCnV-KM_43VgQ3_LlOgfyRaox3n-ntH8TcOYSCIptEvfL2zrQwhChdeiE"/>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 pt-2">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Destaques</h2>
            <button className="text-sm font-medium text-primary hover:text-primary-dark">Ver Tudo</button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 gap-4 pb-2">
            <div className="snap-center shrink-0 w-[85vw] max-w-[320px] relative rounded-[8px] overflow-hidden aspect-[16/10] group cursor-pointer shadow-lg shadow-black/10 dark:shadow-black/20">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY')"}}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <span className="inline-block px-2.5 py-1 mb-2 text-[10px] font-bold text-black uppercase tracking-wider bg-primary rounded-full">Novo Curso</span>
                <h3 className="text-xl font-bold text-white leading-tight">Pérolas do Mar do Sul</h3>
                <p className="text-gray-300 text-sm mt-1 line-clamp-1">Guia expert de identificação e valor.</p>
              </div>
            </div>
            <div className="snap-center shrink-0 w-[85vw] max-w-[320px] relative rounded-[8px] overflow-hidden aspect-[16/10] group cursor-pointer shadow-lg shadow-black/10 dark:shadow-black/20">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnJKfhTxWzo2q-l3005cEqfjcx2FtTovo33gFiQUJaaKvU8RCO-24lBxMQFCUge2eWNYzHJRFnZGRGxgzQcGf5XEIC37CzQs0SAaB-4IAZ6U4ZO_mObUNSNcWo-sNt60_BjKRaQLd95i7Z1Jgjwy7lTFrcAO4JctPVYb9vWKMVDJg652xAOK2c8MLdsIvD-dhmPNDZvMSGrgTVElz6fny0hYeoqS9OXVLGZpebYoophQ5h2OFFpzUYal_9Nos_SJxcqxhXia0cHyg')"}}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <span className="inline-block px-2.5 py-1 mb-2 text-[10px] font-bold text-black uppercase tracking-wider bg-white rounded-full">Loja</span>
                <h3 className="text-xl font-bold text-white leading-tight">Coleção Barroca</h3>
                <p className="text-gray-300 text-sm mt-1 line-clamp-1">Edição limitada de pérolas irregulares.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 px-4">
          <div className="flex items-baseline justify-between px-2">
            <h2 className="text-[24px] font-bold tracking-tight text-slate-900 dark:text-white">Feed Recente</h2>
            <div className="flex gap-2">
              <button className="p-1 text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-[20px]">tune</span></button>
            </div>
          </div>

          <article className="group relative flex flex-col overflow-hidden rounded-[8px] bg-white dark:bg-surface-dark shadow-md ring-1 ring-slate-900/5 dark:ring-white/5 transition-all hover:ring-primary/50">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
              <img alt="Jeweler examining pearl quality" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu2IivgBbJYp9B1eJYbZ3QNT5554NOExvylquqm495J68IjtTttBlZRsGGZbroBqhmfkVlO6OtmoH--2uOZXglBg8D9qhMhbKjzUNzxFBfAkBmN1ygrhqg2HtXrp0cLtpW5n9lh7uQ_R1F2TWhVZhR72RzW8rxDjtScHiwC0PBYzCMT7G8O1hhKpGl2NGuZE7WYxvB6ZN27LsVH9nemQQCfpej8GZBRP-0OVYAqIcB9nfD2y0CmUMGW2OI8lmaG0ZDiMbaVh4M3s4"/>
              <div className="absolute top-3 right-3">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-primary hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0"}}>favorite</span>
                </button>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 text-[10px] font-bold text-white bg-black/60 backdrop-blur-md rounded-full uppercase tracking-wide">Artigo</span>
              </div>
            </div>
            <div className="flex flex-col p-5">
              <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white mb-2">Identificando o Lustre: O Padrão AAA</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                Como saber se suas pérolas são verdadeiras de grau AAA. Observe os reflexos nítidos e o oriente profundo.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                <span className="text-xs font-medium text-slate-400">5 min de leitura</span>
                <button className="text-sm font-bold text-primary hover:text-primary-dark">Ler Agora</button>
              </div>
            </div>
          </article>

          <article className="group relative flex flex-col overflow-hidden rounded-[8px] bg-white dark:bg-surface-dark shadow-md ring-1 ring-slate-900/5 dark:ring-white/5">
            <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
              <img alt="Blurry financial chart background" className="h-full w-full object-cover blur-sm opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXsz4AwfXL5xbG4CvuLUAXVIxpSeRLq4jyngNzQCuhmjwYWgIHaYxXCb0Nd4SW-9EFuGECB5ILv57z5njjss0jN1DSD-CGoakam-66ctRneuZLkNXBgxw9GVkGIP04GWMLFS0FiUFFqa1uwM2OJCkgkgIXx0GMawu2AOY14_CxHu5OjYLUkC_9W_z3QaEqCjrCZUeb2ZWmtZ5URJ-DHGwMVUqru4h0uz4MZZMgOiqWrmqAEEi2kMok-ra_YlWQwm1O2WYcZsV_KLE"/>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-6 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">Conteúdo Premium</span>
              </div>
            </div>
            <div className="flex flex-col p-5 relative">
              <div className="blur-[3px] select-none opacity-40">
                <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white mb-2">Tendências de Mercado Q4 2024</h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  Nossa análise detalhada sobre por que as pérolas do Mar do Sul estão superando o ouro neste trimestre.
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <button className="rounded-full bg-gradient-to-r from-primary to-[#E5C558] px-6 py-2.5 text-sm font-bold text-black shadow-lg hover:scale-105 transition-transform">
                  Desbloquear
                </button>
              </div>
            </div>
          </article>

          <div className="h-12"></div>
        </section>
      </main>
    </div>
  );
};

export default Home;