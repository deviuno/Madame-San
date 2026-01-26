import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Profile: React.FC = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile } = useAuth();

  const [stats, setStats] = useState({
    courses: 0,
    certificates: 0,
    ebooks: 0,
  });
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Count enrollments
        const { count: coursesCount } = await supabase
          .from('course_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Count completed courses (certificates)
        const { count: certificatesCount } = await supabase
          .from('course_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('completed_at', 'is', null);

        // Count ebook access
        const { count: ebooksCount } = await supabase
          .from('ebook_access')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setStats({
          courses: coursesCount || 0,
          certificates: certificatesCount || 0,
          ebooks: ebooksCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  const handleLogout = async () => {
    setLoadingLogout(true);
    await signOut();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;

    setSavingProfile(true);
    const { error } = await updateProfile({ full_name: editName.trim() });

    if (!error) {
      setShowEditModal(false);
    }
    setSavingProfile(false);
  };

  const openEditModal = () => {
    setEditName(profile?.full_name || '');
    setShowEditModal(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-30 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-stone-200 dark:border-white/5 pt-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] font-light">arrow_back</span>
            </button>
            <h1 className="text-xl font-display font-medium tracking-wide text-stone-900 dark:text-primary">Perfil</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center text-stone-900 dark:text-white hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px] font-light">settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-8 pt-4 px-6">
        <section className="flex flex-col items-center justify-center py-4">
          <div className="relative group cursor-pointer mb-4" onClick={openEditModal}>
            <div className="h-32 w-32 rounded-full p-1.5 border border-primary/30 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)]">
              {profile?.avatar_url ? (
                <img
                  alt="User profile"
                  className="h-full w-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700"
                  src={profile.avatar_url}
                />
              ) : (
                <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[48px] text-primary/50">person</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-background-light dark:bg-background-dark border border-stone-200 dark:border-white/10 px-3 py-0.5 rounded-full">
               <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Editar</span>
            </div>
          </div>
          <h2 className="text-2xl font-display font-medium text-stone-900 dark:text-white tracking-wide">
            {profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}
          </h2>
          <p className="text-xs font-serif italic text-stone-500 dark:text-stone-400 mt-1">
            {profile?.is_vip ? 'Membro VIP' : 'Membro'} {profile?.member_since ? `• Desde ${formatDate(profile.member_since)}` : ''}
          </p>
        </section>

        <section className="grid grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-white/5 rounded-sm p-4 flex flex-col items-center justify-center gap-1 border border-stone-200 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group backdrop-blur-sm">
            <span className="text-xl font-display font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors">{stats.courses}</span>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Cursos</span>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-sm p-4 flex flex-col items-center justify-center gap-1 border border-stone-200 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group backdrop-blur-sm">
            <span className="text-xl font-display font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors">{stats.certificates}</span>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Certificados</span>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-sm p-4 flex flex-col items-center justify-center gap-1 border border-stone-200 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer group backdrop-blur-sm">
            <span className="text-xl font-display font-medium text-stone-900 dark:text-white group-hover:text-primary transition-colors">{stats.ebooks}</span>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">E-books</span>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1 border-b border-primary/20 pb-2 w-full">Conta</h3>
          <div className="flex flex-col gap-1">
            <button
              onClick={openEditModal}
              className="flex items-center justify-between w-full py-4 px-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-sm transition-all group border-b border-stone-100 dark:border-white/5"
            >
              <span className="text-sm font-serif text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Dados Pessoais</span>
              <span className="material-symbols-outlined text-stone-400 text-[18px] font-light">chevron_right</span>
            </button>
            <button className="flex items-center justify-between w-full py-4 px-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-sm transition-all group border-b border-stone-100 dark:border-white/5">
              <span className="text-sm font-serif text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Pagamentos & Assinatura</span>
              <span className="material-symbols-outlined text-stone-400 text-[18px] font-light">chevron_right</span>
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1 border-b border-primary/20 pb-2 w-full">Preferências</h3>
          <div className="flex flex-col gap-1">
            <button className="flex items-center justify-between w-full py-4 px-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-sm transition-all group border-b border-stone-100 dark:border-white/5">
               <span className="text-sm font-serif text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Notificações</span>
               <div className="h-4 w-8 bg-primary/20 rounded-full relative">
                  <div className="absolute right-0 top-0 h-4 w-4 bg-primary rounded-full shadow-sm"></div>
               </div>
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full py-4 px-2 hover:bg-stone-50 dark:hover:bg-white/5 rounded-sm transition-all group border-b border-stone-100 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-serif text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Tema</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4 mt-4 p-4 bg-stone-100/50 dark:bg-white/5 rounded-sm border border-stone-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-stone-400 text-[20px]">mail</span>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">E-mail</p>
              <p className="text-sm font-serif text-stone-700 dark:text-stone-300">{user?.email}</p>
            </div>
          </div>
        </section>

        <div className="py-6 flex justify-center">
            <button
                onClick={handleLogout}
                disabled={loadingLogout}
                className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {loadingLogout ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-stone-400 border-t-transparent"></div>
                    <span>Saindo...</span>
                  </>
                ) : (
                  'Sair da Conta'
                )}
            </button>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-[360px] bg-background-light dark:bg-background-dark rounded-sm border border-stone-200 dark:border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-medium text-stone-900 dark:text-white">Editar Perfil</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-stone-800 dark:text-primary-light text-xs font-bold uppercase tracking-widest">Nome</label>
                <input
                  className="w-full h-12 bg-transparent border-b border-stone-300 dark:border-white/20 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-white/30 focus:outline-none focus:border-primary transition-all duration-500 text-base font-serif"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-12 border border-stone-300 dark:border-white/20 text-stone-700 dark:text-stone-300 text-sm font-bold uppercase tracking-wider rounded-sm hover:border-primary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile || !editName.trim()}
                  className="flex-1 h-12 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] text-white dark:text-[#050505] text-sm font-bold uppercase tracking-wider rounded-sm disabled:opacity-50 flex items-center justify-center"
                >
                  {savingProfile ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-[#050505] border-t-transparent"></div>
                  ) : (
                    'Salvar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
