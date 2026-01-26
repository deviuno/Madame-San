import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type Ebook = Tables<'ebooks'>;
type EbookAccess = Tables<'ebook_access'>;
type EbookProgress = Tables<'ebook_progress'>;

interface EbookWithAccess extends Ebook {
  access?: EbookAccess | null;
  progress?: EbookProgress | null;
}

const Ebooks: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ebooks, setEbooks] = useState<EbookWithAccess[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<EbookWithAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchEbooks();
  }, [user]);

  const fetchEbooks = async () => {
    try {
      // Fetch all published ebooks
      const { data: ebooksData, error: ebooksError } = await supabase
        .from('ebooks')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (ebooksError) throw ebooksError;

      let ebooksWithAccess: EbookWithAccess[] = ebooksData || [];

      // If user is logged in, fetch their access and progress
      if (user) {
        const { data: accessData, error: accessError } = await supabase
          .from('ebook_access')
          .select('*')
          .eq('user_id', user.id);

        const { data: progressData, error: progressError } = await supabase
          .from('ebook_progress')
          .select('*')
          .eq('user_id', user.id);

        if (!accessError && accessData) {
          ebooksWithAccess = ebooksData?.map(ebook => ({
            ...ebook,
            access: accessData.find(a => a.ebook_id === ebook.id) || null,
            progress: progressData?.find(p => p.ebook_id === ebook.id) || null
          })) || [];

          // Find currently reading ebook (has access and progress but not finished)
          const reading = ebooksWithAccess.find(
            e => e.access && e.progress &&
            e.progress.current_page &&
            e.progress.current_page > 0 &&
            e.progress.current_page < (e.total_pages || 999)
          );
          setCurrentlyReading(reading || null);
        }
      }

      setEbooks(ebooksWithAccess);
    } catch (error) {
      console.error('Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null, isFree: boolean | null) => {
    if (isFree) return 'Gratuito';
    if (!price) return 'Gratuito';
    return `R$ ${price.toFixed(0)}`;
  };

  const getReadingProgress = (ebook: EbookWithAccess) => {
    if (!ebook.progress?.current_page || !ebook.total_pages) return 0;
    return Math.round((ebook.progress.current_page / ebook.total_pages) * 100);
  };

  const filteredEbooks = ebooks.filter(ebook => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'free') return ebook.is_free;
    if (activeFilter === 'premium') return ebook.is_premium;
    return ebook.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  // Get unique categories
  const categories = [...new Set(ebooks.map(e => e.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Carregando biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
      <header className="w-full bg-background-light dark:bg-background-dark pt-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] font-light">arrow_back</span>
            </button>
            <h1 className="text-xl font-display font-medium tracking-wide text-stone-900 dark:text-white">Biblioteca</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center text-stone-900 dark:text-white hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px] font-light">search</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-8 pt-2">
        {/* Filters */}
        <section className="flex flex-col gap-4 px-6 border-b border-stone-200 dark:border-white/5 pb-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'free', label: 'Gratuitos' },
              ...categories.map(cat => ({ key: cat!, label: cat! }))
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap pb-1 transition-colors ${
                  activeFilter === filter.key
                    ? 'text-primary border-b border-primary'
                    : 'text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {/* Currently Reading */}
        {currentlyReading && (
          <section className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display text-stone-900 dark:text-white tracking-wide">Lendo Agora</h2>
            </div>
            <div
              onClick={() => navigate(`/ebook/${currentlyReading.id}`)}
              className="group relative flex items-center gap-5 rounded-sm bg-white dark:bg-[#101010] p-4 shadow-sm border border-stone-200 dark:border-white/5 cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden shadow-lg">
                <img
                  alt="Ebook Cover"
                  className="h-full w-full object-cover"
                  src={currentlyReading.cover_url || ''}
                />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{currentlyReading.category}</span>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    {currentlyReading.total_pages} págs
                  </span>
                </div>
                <h3 className="text-lg font-display text-stone-900 dark:text-white leading-tight mb-1">{currentlyReading.title}</h3>
                <p className="text-xs text-stone-500 font-serif italic mb-2">{currentlyReading.author}</p>
                <div className="flex items-center gap-3">
                  <div className="relative h-px w-full bg-stone-200 dark:bg-white/10">
                    <div
                      className="absolute left-0 top-0 h-px bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                      style={{ width: `${getReadingProgress(currentlyReading)}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] font-bold text-stone-400">
                    {currentlyReading.progress?.current_page || 0}/{currentlyReading.total_pages}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Ebook List */}
        <section className="flex flex-col gap-6 px-6 pb-20">
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-lg font-display text-stone-900 dark:text-white tracking-wide">
              {activeFilter === 'all' ? 'Todos os E-books' : 'E-books Filtrados'}
            </h2>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
              {filteredEbooks.length} e-books
            </span>
          </div>

          {filteredEbooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">menu_book</span>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Nenhum e-book encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredEbooks.map((ebook) => {
                const hasAccess = !!ebook.access || ebook.is_free;
                const isPremiumLocked = ebook.is_premium && !ebook.access;

                return (
                  <article
                    key={ebook.id}
                    className={`flex flex-col group cursor-pointer ${isPremiumLocked ? 'opacity-90 hover:opacity-100' : ''}`}
                    onClick={() => navigate(`/ebook/${ebook.id}`)}
                  >
                    <div className="relative w-full aspect-[2/3] overflow-hidden mb-3 shadow-lg">
                      {isPremiumLocked && (
                        <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] flex items-center justify-center flex-col gap-2 transition-opacity duration-300">
                          <span className="material-symbols-outlined text-white text-[24px] font-light">lock</span>
                          <span className="text-[8px] font-bold text-white uppercase tracking-[0.2em] border border-white/30 px-2 py-0.5">Premium</span>
                        </div>
                      )}
                      <img
                        alt={ebook.title}
                        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${isPremiumLocked ? 'grayscale' : ''}`}
                        src={ebook.cover_url || ''}
                      />
                      {ebook.access && (
                        <div className="absolute top-2 left-2 bg-primary px-1.5 py-0.5">
                          <span className="text-[8px] font-bold text-black uppercase tracking-widest">Adquirido</span>
                        </div>
                      )}
                      {ebook.is_free && !ebook.access && (
                        <div className="absolute top-2 left-2 bg-green-500 px-1.5 py-0.5">
                          <span className="text-[8px] font-bold text-white uppercase tracking-widest">Grátis</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col px-0.5">
                      <span className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${isPremiumLocked ? 'text-stone-500' : 'text-primary'}`}>
                        {ebook.category}
                      </span>
                      <h3 className={`text-sm font-display mb-1 leading-tight transition-colors line-clamp-2 ${
                        isPremiumLocked
                          ? 'text-stone-500 dark:text-stone-400'
                          : 'text-stone-900 dark:text-white group-hover:text-primary'
                      }`}>
                        {ebook.title}
                      </h3>
                      <p className={`text-[10px] font-serif italic mb-2 ${
                        isPremiumLocked ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'
                      }`}>
                        {ebook.author}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                          {ebook.total_pages} págs
                        </span>
                        {!hasAccess && (
                          <span className="text-xs font-bold text-stone-900 dark:text-white">
                            {formatPrice(ebook.price, ebook.is_free)}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Ebooks;
