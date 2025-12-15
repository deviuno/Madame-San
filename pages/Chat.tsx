import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-40">
      <header className="fixed top-0 w-full z-30 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-stone-200 dark:border-white/5 pt-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
             <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] font-light">arrow_back</span>
            </button>
            <div className="flex flex-col">
                <h1 className="text-lg font-display font-medium tracking-wide text-stone-900 dark:text-white">San IA</h1>
                <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400">Online</span>
                </div>
            </div>
          </div>
          <button className="text-stone-900 dark:text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[24px] font-light">history</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pt-24 pb-4">
        <div className="flex flex-col gap-8">
          <div className="flex justify-center">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em] opacity-60">Hoje, 10:23</span>
          </div>
          
          <div className="flex items-start gap-4 animate-fade">
            <div className="flex-shrink-0 h-10 w-10 rounded-full border border-primary/30 p-0.5 shadow-lg shadow-primary/10">
               <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-[#AA8C2C] flex items-center justify-center text-black">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
               </div>
            </div>
            <div className="flex flex-col gap-1 max-w-[85%]">
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest ml-1">San IA</span>
              <div className="bg-white dark:bg-[#121212] p-5 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-stone-100 dark:border-white/5 relative">
                <p className="text-sm font-serif text-stone-800 dark:text-stone-200 leading-relaxed">
                  Bonjour, Madame. Sou sua consultora de gemologia pessoal.
                  <br/><br/>
                  Posso analisar a qualidade de suas pérolas através de fotos ou sugerir investimentos na coleção Barroca. Como posso servi-la hoje?
                </p>
              </div>
            </div>
          </div>

           {/* User Message Example */}
           <div className="flex items-end justify-end gap-3 animate-fade" style={{animationDelay: '0.2s'}}>
            <div className="flex flex-col gap-1 max-w-[80%] items-end">
              <div className="bg-stone-100 dark:bg-white/5 p-4 rounded-tl-xl rounded-tr-xl rounded-bl-xl border border-stone-200 dark:border-white/5">
                <p className="text-sm font-serif text-stone-800 dark:text-stone-200 leading-relaxed">
                  Gostaria de saber mais sobre o colar South Sea.
                </p>
              </div>
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mr-1">Lido 10:25</span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-stone-200 dark:border-white/5 px-4 pt-4 pb-[100px]">
        <div className="mx-auto w-full max-w-2xl">
          <form className="relative flex items-end gap-3">
            <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-stone-400 hover:text-primary transition-colors hover:bg-stone-100 dark:hover:bg-white/5" type="button">
              <span className="material-symbols-outlined text-[24px] font-light">add_circle</span>
            </button>
            <div className="relative flex-1">
              <input 
                className="w-full h-12 rounded-full border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-white/5 pl-6 pr-14 text-sm font-serif text-stone-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all" 
                placeholder="Escreva sua mensagem..." 
                type="text"
              />
              <button className="absolute right-2 top-2 bottom-2 flex w-8 items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;