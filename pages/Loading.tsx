import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Loading: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2500); // 2.5 seconds loading time

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="absolute inset-0 bg-white/50 dark:bg-gradient-to-b dark:from-[#18181b] dark:to-[#2e2e2e] opacity-100 z-0 pointer-events-none"></div>
      
      <div className="h-1/4 w-full z-10"></div>
      
      <div className="flex flex-col items-center justify-center gap-10 z-10 w-full px-8 flex-1">
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center animate-pulse">
          {/* Efeito de brilho atrás da logo (opcional, mantido para estética de luxo, mas sutil) */}
          <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full transform scale-75"></div>
          
          <img 
            alt="Madame San brand logo" 
            className="w-full h-full object-contain drop-shadow-2xl relative z-10" 
            src="https://i.ibb.co/fYpqVW0J/sem-fundo-005-para-fundo-escuros.png"
          />
        </div>
        
        <div className="flex flex-col items-center text-center gap-2 animate-fade">
          {/* Texto removido ou reduzido já que a logo pode conter o nome, mas mantendo o slogan elegante */}
          <p className="text-[#756c60] dark:text-[#bab09c] text-sm font-normal tracking-[0.3em] uppercase mt-4">Fine Pearls & Gemology</p>
        </div>
      </div>
      
      <div className="w-full max-w-xs flex flex-col gap-4 p-8 pb-16 z-10">
        <div className="flex justify-between items-end px-1">
          <p className="text-[#756c60] dark:text-[#bab09c] text-xs font-medium uppercase tracking-wider">Loading Experience</p>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-sm animate-spin">diamond</span>
          </div>
        </div>
        <div className="h-1 w-full bg-[#756c60]/20 dark:bg-[#bab09c]/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(242,166,13,0.6)] w-[45%] animate-[width_2s_ease-in-out_infinite]" 
            style={{ width: '45%', animation: 'width 2s ease-in-out infinite' }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes width {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Loading;