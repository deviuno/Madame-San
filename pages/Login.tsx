import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const from = (location.state as any)?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('E-mail ou senha incorretos');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu e-mail antes de fazer login');
        } else {
          setError(error.message);
        }
      } else {
        const from = (location.state as any)?.from?.pathname || '/home';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setError('Erro ao fazer login com Google');
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

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
            Entre com seu e-mail e senha
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 text-center">
            <p className="text-red-500 text-sm font-serif">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2 group">
            <label className="text-stone-800 dark:text-primary-light text-xs font-bold uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary">E-mail</label>
            <div className="relative">
              <input
                className="w-full h-12 bg-transparent border-b border-stone-300 dark:border-white/20 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-white/30 focus:outline-none focus:border-primary dark:focus:border-primary transition-all duration-500 text-base font-serif pr-10"
                placeholder="seu@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <span className="absolute right-0 bottom-3 material-symbols-outlined text-stone-400 dark:text-white/30 text-[20px]">mail</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 group">
            <label className="text-stone-800 dark:text-primary-light text-xs font-bold uppercase tracking-widest ml-1 transition-colors group-focus-within:text-primary">Senha</label>
            <div className="relative">
              <input
                className="w-full h-12 bg-transparent border-b border-stone-300 dark:border-white/20 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-white/30 focus:outline-none focus:border-primary dark:focus:border-primary transition-all duration-500 text-base font-serif pr-10"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                className="absolute right-0 bottom-3 flex items-center text-stone-400 dark:text-white/30 hover:text-primary transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-xs text-stone-500 dark:text-[#bab59c] hover:text-primary transition-colors font-serif italic"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-white dark:text-[#050505] text-sm font-bold uppercase tracking-[0.2em] rounded-sm shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] transition-all duration-500 transform hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-3 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white dark:border-[#050505] border-t-transparent"></div>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>

        <div className="relative flex items-center py-4 px-6">
          <div className="flex-grow border-t border-stone-300 dark:border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest font-bold">ou continue com</span>
          <div className="flex-grow border-t border-stone-300 dark:border-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="h-12 flex items-center justify-center bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-white/10 hover:border-primary dark:hover:border-primary rounded-sm transition-all duration-300 group shadow-sm disabled:opacity-50"
          >
             {/* Google SVG Oficial */}
             <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
          </button>
          <button
            disabled={loading}
            className="h-12 flex items-center justify-center bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-white/10 hover:border-primary dark:hover:border-primary rounded-sm transition-all duration-300 group shadow-sm text-stone-900 dark:text-white disabled:opacity-50"
          >
             {/* Apple SVG Oficial */}
             <svg className="w-6 h-6 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
             </svg>
          </button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-stone-500 dark:text-stone-400 text-sm font-serif">
            Ainda não é membro?
            <Link
              to="/register"
              className="text-primary font-bold hover:text-primary-light transition-colors ml-1 uppercase text-xs tracking-wider"
            >
              Criar Conta
            </Link>
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
