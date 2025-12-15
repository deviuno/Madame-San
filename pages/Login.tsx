import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:opacity-[0.03]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-[360px] flex flex-col gap-8">
        <div className="flex flex-col items-center justify-center pt-8 pb-4">
          <div className="w-56 h-auto mb-6 transform hover:scale-105 transition-transform duration-700">
            <img 
              alt="Madame San Logo Luxury Gold" 
              className="w-full h-full object-contain drop-shadow-2xl" 
              src="https://i.ibb.co/fYpqVW0J/sem-fundo-005-para-fundo-escuros.png" 
            />
          </div>
          
          <h1 className="text-stone-900 dark:text-white text-3xl font-display font-medium tracking-wide text-center mt-2">
            Bem-vindo
          </h1>
          <p className="text-stone-500 dark:text-[#bab59c] text-sm font-serif italic text-center mt-2 tracking-wide">
            Faça login com os dados abaixo
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full px-2">
          <div className="flex flex-col gap-2 group">
            <label className="text-stone-800 dark:text-primary-light text-xs font-bold uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary">E-mail</label>
            <div className="relative">
              <input 
                className="w-full h-12 bg-transparent border-b border-stone-300 dark:border-white/20 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-white/30 focus:outline-none focus:border-primary dark:focus:border-primary transition-all duration-500 text-base font-serif" 
                placeholder="exemplo@email.com" 
                type="email"
                defaultValue="demo@madamesan.com"
              />
              <span className="absolute right-0 bottom-3 material-symbols-outlined text-stone-400 dark:text-white/30 text-[20px]">mail</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 group">
            <label className="text-stone-800 dark:text-primary-light text-xs font-bold uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary">Senha</label>
            <div className="relative">
              <input 
                className="w-full h-12 bg-transparent border-b border-stone-300 dark:border-white/20 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-white/30 focus:outline-none focus:border-primary dark:focus:border-primary transition-all duration-500 text-base font-serif" 
                placeholder="••••••••" 
                type="password"
                defaultValue="password123"
              />
              <button className="absolute right-0 bottom-3 flex items-center text-stone-400 dark:text-white/30 hover:text-primary transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <a className="text-xs text-stone-500 dark:text-[#bab59c] hover:text-primary transition-colors font-serif italic" href="#">Esqueceu a senha?</a>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-white dark:text-[#050505] text-sm font-bold uppercase tracking-[0.2em] rounded-sm shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] transition-all duration-500 transform hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-3 border border-white/10"
          >
            <span>Entrar</span>
          </button>
        </form>

        <div className="relative flex items-center py-4 px-6">
          <div className="flex-grow border-t border-stone-300 dark:border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest font-bold">ou continue com</span>
          <div className="flex-grow border-t border-stone-300 dark:border-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-2">
          <button className="h-12 flex items-center justify-center gap-3 bg-transparent border border-stone-300 dark:border-white/10 hover:border-primary dark:hover:border-primary rounded-sm transition-all duration-500 group">
            <img alt="Google Logo" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpNDj6-KFxO_mas5sAwRVdEbJD6lxlpImmkt9nUhfeHYtZ4tr_kE3XaZWqPF1NRYLNsFbu9qGSwyx5K5DpLNfhf4EwS4VNviaps7SmbBtXASAjAyXeP1XnKOXHPYjjpq0Q1WwyCIDr3IwciwDF340u6dCFjnuUKOoiAShLOTaWo0Taq-WSDUs32t0uwGp5yV_0hiD_PpKXUgcCdzm9BDEYxjU01SgVEyv9if6cKMv3gBOlF80iWAbnBhSIb2NIQpKPRGN_LsYoVa4" />
          </button>
          <button className="h-12 flex items-center justify-center gap-3 bg-transparent border border-stone-300 dark:border-white/10 hover:border-primary dark:hover:border-primary rounded-sm transition-all duration-500 group">
            <span className="material-symbols-outlined text-stone-700 dark:text-white text-[22px] group-hover:scale-110 transition-transform">ios</span>
          </button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-stone-500 dark:text-stone-400 text-sm font-serif">
            Ainda não é membro? 
            <a className="text-primary font-bold hover:text-primary-light transition-colors ml-1 uppercase text-xs tracking-wider" href="#">Criar Conta</a>
          </p>
        </div>

        <div className="mt-4 text-center px-4">
          <p className="text-[10px] text-stone-400 dark:text-stone-600 font-medium tracking-wide">
            Ao continuar, você concorda com nossos <a className="underline hover:text-primary decoration-stone-400" href="#">Termos de Uso</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;