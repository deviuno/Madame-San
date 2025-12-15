import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-40">
      <header className="w-full bg-background-light dark:bg-background-dark pt-2 border-b border-stone-200 dark:border-white/5">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-3">
             <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">San IA</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark text-slate-900 dark:text-white hover:bg-primary hover:text-black transition-colors ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">history</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <span className="bg-slate-200 dark:bg-surface-dark text-slate-500 dark:text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Hoje</span>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-[#F2D06B] flex items-center justify-center text-black shadow-md border border-white/20">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            </div>
            <div className="flex flex-col gap-1 max-w-[85%]">
              <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 ml-1">San IA</span>
              <div className="bg-white dark:bg-surface-dark p-4 rounded-[8px] rounded-tl-none shadow-sm border border-slate-200 dark:border-white/5">
                <p className="text-sm text-slate-800 dark:text-gray-200 leading-relaxed">
                  Olá! Sou a inteligência artificial da Madame San. Estou aqui para oferecer consultoria especializada em gemologia, avaliar suas pérolas e auxiliar em suas escolhas de luxo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-[88px] left-0 right-0 z-40 px-4">
        <div className="mx-auto w-full max-w-md">
          <form className="relative flex items-center gap-2">
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark text-slate-400 dark:text-gray-400 border border-slate-200 dark:border-white/10 shadow-md hover:text-primary transition-colors" type="button">
              <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
            </button>
            <div className="relative flex-1">
              <input 
                className="w-full h-12 rounded-[8px] border-none bg-white dark:bg-surface-dark pl-4 pr-12 text-sm text-slate-900 dark:text-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:ring-white/10 focus:ring-2 focus:ring-primary placeholder:text-slate-400 dark:placeholder:text-gray-500" 
                placeholder="Pergunte sobre gemas..." 
                type="text"
              />
              <button className="absolute right-2 top-2 bottom-2 flex w-8 items-center justify-center rounded bg-primary/10 text-primary hover:bg-primary hover:text-black transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;