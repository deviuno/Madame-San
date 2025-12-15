import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAQmgYMttdd9zzCjPPzKoef-03NFqiwtO6fWJeNfF9_kuBljORevycjM2HWlTVCD5-c54h5WZ5z4nPyHu9vVJjCH17Ax889-BPax5F20tokKB6KN4FxrJQFRFk40te4-TMD7MbVuXxWzhiqXFFhSyWqTxxUwavxVkl6QGP3qap0eBPxsuo20wfFjH3vuh-2BcY0b0yozlrAqsuIZa4EA8jCq8hYIuS7T7LQTBHtKFI926CDJl21wodpHHZUXYtaQO4X80kmS80qUwo')"}}></div>
      
      <div className="relative z-10 w-full max-w-[400px] flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center pt-8 pb-2">
          {/* Logo Container atualizado */}
          <div className="w-64 h-auto mb-4">
            <img 
              alt="Madame San Logo Luxury Gold" 
              className="w-full h-full object-contain drop-shadow-xl" 
              src="https://i.ibb.co/fYpqVW0J/sem-fundo-005-para-fundo-escuros.png" 
            />
          </div>
          
          <h1 className="text-stone-900 dark:text-white text-2xl font-bold tracking-tight text-center leading-tight mt-2">
            Bem-vindo
          </h1>
          <p className="text-stone-600 dark:text-[#bab59c] text-sm text-center mt-2 max-w-[280px]">
            Faça login com os dados abaixo
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-stone-700 dark:text-[#bab59c] text-sm font-medium ml-1">E-mail</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-stone-400 dark:text-[#54503b] group-focus-within:text-primary transition-colors">mail</span>
              </div>
              <input 
                className="w-full h-14 pl-12 pr-4 bg-white dark:bg-surface-dark border border-stone-200 dark:border-[#54503b] rounded-lg text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-[#54503b] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm" 
                placeholder="exemplo@email.com" 
                type="email"
                defaultValue="demo@madamesan.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-stone-700 dark:text-[#bab59c] text-sm font-medium ml-1">Senha</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-stone-400 dark:text-[#54503b] group-focus-within:text-primary transition-colors">lock</span>
              </div>
              <input 
                className="w-full h-14 pl-12 pr-12 bg-white dark:bg-surface-dark border border-stone-200 dark:border-[#54503b] rounded-lg text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-[#54503b] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm" 
                placeholder="Sua senha secreta" 
                type="password"
                defaultValue="password123"
              />
              <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 dark:text-[#bab59c] hover:text-primary transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <a className="text-xs text-stone-500 dark:text-[#bab59c] hover:text-primary transition-colors underline decoration-dotted underline-offset-4" href="#">Esqueceu a senha?</a>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary-dark text-black dark:text-background-dark text-base font-bold rounded-lg shadow-[0_4px_15px_rgba(242,208,13,0.3)] dark:shadow-[0_0_15px_rgba(242,208,13,0.2)] transition-all duration-300 transform active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            <span>Entrar</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-stone-200 dark:border-[#27251b]"></div>
          <span className="flex-shrink-0 mx-4 text-xs text-stone-500 dark:text-[#54503b] uppercase tracking-wider">ou continue com</span>
          <div className="flex-grow border-t border-stone-200 dark:border-[#27251b]"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="h-12 flex items-center justify-center gap-3 bg-white dark:bg-surface-dark border border-stone-200 dark:border-[#27251b] hover:border-primary dark:hover:border-[#54503b] rounded-lg transition-all duration-300 group shadow-sm hover:shadow-md">
            <img alt="Google Logo" className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpNDj6-KFxO_mas5sAwRVdEbJD6lxlpImmkt9nUhfeHYtZ4tr_kE3XaZWqPF1NRYLNsFbu9qGSwyx5K5DpLNfhf4EwS4VNviaps7SmbBtXASAjAyXeP1XnKOXHPYjjpq0Q1WwyCIDr3IwciwDF340u6dCFjnuUKOoiAShLOTaWo0Taq-WSDUs32t0uwGp5yV_0hiD_PpKXUgcCdzm9BDEYxjU01SgVEyv9if6cKMv3gBOlF80iWAbnBhSIb2NIQpKPRGN_LsYoVa4" />
            <span className="text-sm font-medium text-stone-700 dark:text-[#bab59c] group-hover:text-black dark:group-hover:text-white">Google</span>
          </button>
          <button className="h-12 flex items-center justify-center gap-3 bg-white dark:bg-surface-dark border border-stone-200 dark:border-[#27251b] hover:border-primary dark:hover:border-[#54503b] rounded-lg transition-all duration-300 group shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-stone-900 dark:text-white text-[22px]">ios</span>
            <span className="text-sm font-medium text-stone-700 dark:text-[#bab59c] group-hover:text-black dark:group-hover:text-white">Apple</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-stone-600 dark:text-[#bab59c] text-sm">
            Ainda não é membro? 
            <a className="text-primary font-bold hover:text-primary-dark dark:hover:text-[#fff] transition-colors ml-1" href="#">Criar Conta</a>
          </p>
        </div>

        <div className="mt-8 text-center px-4">
          <p className="text-[10px] text-stone-400 dark:text-[#54503b] leading-relaxed">
            Ao continuar, você concorda com nossos <a className="underline hover:text-stone-600 dark:hover:text-[#bab59c]" href="#">Termos de Uso</a> e <a className="underline hover:text-stone-600 dark:hover:text-[#bab59c]" href="#">Política de Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;