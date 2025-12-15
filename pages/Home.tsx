import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
      {/* Background gradients */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>

      <header className="relative w-full z-10 pt-4 pb-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-1">Bem-vinda</span>
            <h1 className="text-2xl font-display text-stone-900 dark:text-white tracking-wide">Madame Julia</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative group p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[24px] text-stone-800 dark:text-stone-200 font-light">notifications</span>
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 border border-background-light dark:border-background-dark"></span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="flex h-11 w-11 overflow-hidden rounded-full border border-stone-200 dark:border-white/20 ring-2 ring-transparent hover:ring-primary/30 transition-all duration-500"
            >
              <img alt="User profile portrait" className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfzHlXrB6NUjc_IQu5qaem5zQxiiEvRtsHGKyWf8czdLe5wo0D1iXbLI6yNKdfXZTfIdxT_DN0zzywWIb8OsMiN_--6VRZH6wyYnau0NvjJWTPj9mXYWkOq5ykAvymLZNwDvegkVfX6n58i53KIdU4hIMWM2mHxe7odkDy9oIYi_kf5Xalim-udYjO0BKuAH6-nRfE5R4YwnNpOcbsNUOCnV-KM_43VgQ3_LlOgfyRaox3n-ntH8TcOYSCIptEvfL2zrQwhChdeiE"/>
            </button>
          </div>
        </div>
      </header>

      <main className="relative flex flex-col gap-10 pt-2 z-10">
        <section className="flex flex-col gap-5">
          <div className="flex items-end justify-between px-6">
            <h2 className="text-xl font-display font-medium text-stone-900 dark:text-white tracking-wide">Destaques</h2>
            <button className="text-xs font-bold tracking-widest text-primary hover:text-primary-light uppercase border-b border-primary/30 pb-0.5">Ver Tudo</button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 gap-6 pb-6">
            
            {/* Card 1 */}
            <div className="snap-center shrink-0 w-[85vw] max-w-[340px] relative rounded-sm overflow-hidden aspect-[16/10] group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY')"}}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>
              
              {/* Glass Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                 <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 mb-3 text-[9px] font-bold text-black uppercase tracking-[0.2em] bg-primary rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.4)]">Novo Curso</span>
                    <h3 className="text-2xl font-display text-white leading-none mb-2">Pérolas do Mar do Sul</h3>
                    <p className="text-stone-300 text-sm font-serif italic line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Guia expert de identificação e valor.</p>
                 </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="snap-center shrink-0 w-[85vw] max-w-[340px] relative rounded-sm overflow-hidden aspect-[16/10] group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnJKfhTxWzo2q-l3005cEqfjcx2FtTovo33gFiQUJaaKvU8RCO-24lBxMQFCUge2eWNYzHJRFnZGRGxgzQcGf5XEIC37CzQs0SAaB-4IAZ6U4ZO_mObUNSNcWo-sNt60_BjKRaQLd95i7Z1Jgjwy7lTFrcAO4JctPVYb9vWKMVDJg652xAOK2c8MLdsIvD-dhmPNDZvMSGrgTVElz6fny0hYeoqS9OXVLGZpebYoophQ5h2OFFpzUYal_9Nos_SJxcqxhXia0cHyg')"}}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                 <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 mb-3 text-[9px] font-bold text-black uppercase tracking-[0.2em] bg-white rounded-sm">Boutique</span>
                    <h3 className="text-2xl font-display text-white leading-none mb-2">Coleção Barroca</h3>
                    <p className="text-stone-300 text-sm font-serif italic line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Edição limitada de pérolas irregulares.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8 px-4">
          <div className="flex items-baseline justify-between px-2 border-b border-stone-200 dark:border-white/5 pb-2">
            <h2 className="text-xl font-display font-medium tracking-wide text-stone-900 dark:text-white">Editorial</h2>
            <div className="flex gap-2">
              <button className="text-stone-400 hover:text-primary transition-colors uppercase text-[10px] font-bold tracking-widest">Filtrar</button>
            </div>
          </div>

          <article className="group relative flex flex-col overflow-hidden rounded-sm transition-all hover:-translate-y-1 duration-500">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img alt="Jeweler examining pearl quality" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu2IivgBbJYp9B1eJYbZ3QNT5554NOExvylquqm495J68IjtTttBlZRsGGZbroBqhmfkVlO6OtmoH--2uOZXglBg8D9qhMhbKjzUNzxFBfAkBmN1ygrhqg2HtXrp0cLtpW5n9lh7uQ_R1F2TWhVZhR72RzW8rxDjtScHiwC0PBYzCMT7G8O1hhKpGl2NGuZE7WYxvB6ZN27LsVH9nemQQCfpej8GZBRP-0OVYAqIcB9nfD2y0CmUMGW2OI8lmaG0ZDiMbaVh4M3s4"/>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-[9px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 uppercase tracking-widest">Artigo</span>
              </div>
            </div>
            <div className="flex flex-col pt-5 pb-2 px-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Gemologia</span>
              <h3 className="text-xl font-display text-stone-900 dark:text-white mb-3 leading-tight group-hover:text-primary transition-colors">Identificando o Lustre: O Padrão AAA</h3>
              <p className="text-sm font-serif text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                Como saber se suas pérolas são verdadeiras de grau AAA. Observe os reflexos nítidos e o oriente profundo.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Ler Agora</span>
                <span className="h-[1px] w-8 bg-primary"></span>
              </div>
            </div>
          </article>

          <article className="group relative flex flex-col overflow-hidden rounded-sm transition-all hover:-translate-y-1 duration-500">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-900">
              <img alt="Blurry financial chart background" className="h-full w-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXsz4AwfXL5xbG4CvuLUAXVIxpSeRLq4jyngNzQCuhmjwYWgIHaYxXCb0Nd4SW-9EFuGECB5ILv57z5njjss0jN1DSD-CGoakam-66ctRneuZLkNXBgxw9GVkGIP04GWMLFS0FiUFFqa1uwM2OJCkgkgIXx0GMawu2AOY14_CxHu5OjYLUkC_9W_z3QaEqCjrCZUeb2ZWmtZ5URJ-DHGwMVUqru4h0uz4MZZMgOiqWrmqAEEi2kMok-ra_YlWQwm1O2WYcZsV_KLE"/>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 text-primary bg-black/30 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[20px] font-light">lock</span>
                </div>
                <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Conteúdo Premium</span>
                <h3 className="text-xl font-display text-white mb-4 leading-tight max-w-[80%]">Tendências de Mercado Q4 2024</h3>
                <button className="px-6 py-2 border border-white/30 hover:bg-white hover:text-black text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300">
                  Desbloquear
                </button>
              </div>
            </div>
          </article>

          <div className="h-8"></div>
        </section>
      </main>
    </div>
  );
};

export default Home;