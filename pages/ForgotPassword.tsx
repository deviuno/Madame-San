import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        if (error.message.includes('User not found')) {
          setError('E-mail não encontrado');
        } else {
          setError(error.message);
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center p-6 bg-background-light dark:bg-background-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center gap-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[40px] text-primary">mark_email_read</span>
          </div>

          <div>
            <h1 className="text-stone-900 dark:text-white text-2xl font-display font-medium tracking-wide mb-3">
              E-mail Enviado!
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-serif">
              Enviamos um link para redefinir sua senha para <strong className="text-primary">{email}</strong>.
              Verifique sua caixa de entrada e spam.
            </p>
          </div>

          <Link
            to="/login"
            className="w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-white dark:text-[#050505] text-sm font-bold uppercase tracking-[0.2em] rounded-sm shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] transition-all duration-500 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 border border-white/10"
          >
            Voltar ao Login
          </Link>

          <button
            onClick={() => {
              setSuccess(false);
              setEmail('');
            }}
            className="text-sm text-stone-500 dark:text-stone-400 hover:text-primary transition-colors font-serif"
          >
            Tentar outro e-mail
          </button>
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
        {/* Back Button */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span className="text-sm font-serif">Voltar</span>
        </Link>

        <div className="flex flex-col items-center justify-center pt-4 pb-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[40px] text-primary">lock_reset</span>
          </div>

          <h1 className="text-stone-900 dark:text-white text-2xl font-display font-medium tracking-wide text-center">
            Esqueceu a Senha?
          </h1>
          <p className="text-stone-500 dark:text-[#bab59c] text-sm font-serif italic text-center mt-2 tracking-wide max-w-[280px]">
            Informe seu e-mail e enviaremos um link para redefinir sua senha
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 text-center">
            <p className="text-red-500 text-sm font-serif">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-white dark:text-[#050505] text-sm font-bold uppercase tracking-[0.2em] rounded-sm shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] transition-all duration-500 transform hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-3 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white dark:border-[#050505] border-t-transparent"></div>
            ) : (
              <span>Enviar Link</span>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-stone-500 dark:text-stone-400 text-sm font-serif">
            Lembrou a senha?
            <Link
              to="/login"
              className="text-primary font-bold hover:text-primary-light transition-colors ml-1 uppercase text-xs tracking-wider"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
