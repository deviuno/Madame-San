import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CourseDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Simulação de estado de compra baseada no ID (ID 1 é comprado, outros não)
  // Em produção, isso viria de uma API/Contexto
  const isOwned = id === '1';
  
  const [activeTab, setActiveTab] = useState<'sobre' | 'aulas'>('sobre');

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark pb-24">
      {/* Hero Image */}
      <div className="relative w-full h-80">
        <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwVa4lXipZKNADnQN3OWDgndbwAE1Kevt6BKQgYh2jUDUQRbTfv03mc66YyM09NBHQ0D9AHCMT9VAg8xAtx7GmyB7nVL2oopokDg__Gbm6M6Ertau906avhi1sCLuyIvi87SIQxDBfgXHJ-0XP6PQ66yqnZBwFEd_bJbXB0lhyOy6Ny_XNuXawNIF2VKXsYvIfaPMPg-zMAlQVijFPkQGm-f4vy3GOCZ1ueEbVW9DduZgY6yqrjMkDgEqWVwxiAsLnAQSO0RgidY" 
            alt="Course Cover" 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-black/30"></div>
        
        {/* Navigation */}
        <button 
            onClick={() => navigate(-1)} 
            className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors"
        >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
      </div>

      <div className="flex flex-col px-6 -mt-10 relative z-10">
        <span className="inline-block px-3 py-1 mb-3 text-[9px] font-bold text-black uppercase tracking-[0.2em] bg-primary w-fit rounded-sm shadow-lg">
            {isOwned ? 'Adquirido' : 'Masterclass'}
        </span>
        <h1 className="text-3xl font-display text-stone-900 dark:text-white mb-2 leading-tight drop-shadow-sm">
            Pérolas do Mar do Sul
        </h1>
        <div className="flex items-center gap-4 text-stone-500 dark:text-stone-400 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span> 8h 20m
            </span>
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">signal_cellular_alt</span> Intermediário
            </span>
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-sm">star</span> 4.9
            </span>
        </div>

        {/* Tabs */}
        <div className="flex w-full border-b border-stone-200 dark:border-white/10 mb-6">
            <button 
                onClick={() => setActiveTab('sobre')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'sobre' ? 'text-primary border-b-2 border-primary' : 'text-stone-400'}`}
            >
                Sobre
            </button>
            <button 
                onClick={() => setActiveTab('aulas')}
                className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'aulas' ? 'text-primary border-b-2 border-primary' : 'text-stone-400'}`}
            >
                Aulas
            </button>
        </div>

        {/* Content */}
        {activeTab === 'sobre' ? (
            <div className="flex flex-col gap-6 animate-fade">
                <p className="text-sm font-serif text-stone-600 dark:text-stone-300 leading-relaxed">
                    Mergulhe profundamente no mundo das "South Sea Pearls". Este curso oferece um guia definitivo para identificar, avaliar e investir nas pérolas douradas e prateadas mais cobiçadas do mundo.
                    <br/><br/>
                    Aprenda com especialistas sobre o cultivo nas águas da Austrália e Filipinas, e descubra como distinguir o verdadeiro oriente de uma imitação.
                </p>
                
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white mb-2">O que você vai aprender</h3>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                        <p className="text-sm text-stone-600 dark:text-stone-400">Identificação de origem e tratamento.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                        <p className="text-sm text-stone-600 dark:text-stone-400">Critérios de avaliação (Lustre, Superfície, Formato).</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                        <p className="text-sm text-stone-600 dark:text-stone-400">Precificação e mercado internacional.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-2 p-4 bg-stone-100 dark:bg-white/5 rounded-sm border border-stone-200 dark:border-white/5">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop" className="w-12 h-12 rounded-full object-cover" alt="Instructor" />
                    <div>
                        <p className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">Instrutora</p>
                        <p className="text-sm font-serif italic text-stone-600 dark:text-stone-400">Dra. Elena Vance, Gemologista GIA</p>
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex flex-col gap-4 animate-fade">
                {[1, 2, 3, 4, 5].map((lesson) => (
                    <div key={lesson} className={`flex items-center gap-4 p-4 rounded-sm border ${isOwned || lesson === 1 ? 'border-stone-200 dark:border-white/10 bg-white dark:bg-white/5 cursor-pointer hover:border-primary/30' : 'border-transparent bg-stone-50 dark:bg-white/5 opacity-60'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isOwned || lesson === 1 ? 'bg-primary text-black border-primary' : 'border-stone-300 dark:border-white/20 text-stone-400'}`}>
                            {isOwned || lesson === 1 ? <span className="material-symbols-outlined text-sm">play_arrow</span> : <span className="material-symbols-outlined text-sm">lock</span>}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-0.5">Aula {lesson}: Introdução ao Cultivo</h4>
                            <p className="text-xs text-stone-500">15 min</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-stone-200 dark:border-white/10 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            {isOwned ? (
                <button className="w-full py-4 bg-primary text-black font-bold uppercase tracking-[0.2em] text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all rounded-sm flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">play_circle</span>
                    Continuar Curso
                </button>
            ) : (
                <>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Preço Total</span>
                        <span className="text-xl font-display font-medium text-stone-900 dark:text-white">R$ 299,00</span>
                    </div>
                    <button className="flex-1 py-4 bg-stone-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-all rounded-sm">
                        Comprar Agora
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;