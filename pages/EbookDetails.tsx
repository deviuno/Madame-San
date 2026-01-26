import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type Ebook = Tables<'ebooks'>;
type EbookAccess = Tables<'ebook_access'>;
type EbookProgress = Tables<'ebook_progress'>;

const EbookDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [access, setAccess] = useState<EbookAccess | null>(null);
  const [progress, setProgress] = useState<EbookProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [acquiring, setAcquiring] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEbookData();
    }
  }, [id, user]);

  const fetchEbookData = async () => {
    if (!id) return;

    try {
      // Fetch ebook details
      const { data: ebookData, error: ebookError } = await supabase
        .from('ebooks')
        .select('*')
        .eq('id', id)
        .single();

      if (ebookError) throw ebookError;
      setEbook(ebookData);

      // If user is logged in, fetch access and progress
      if (user) {
        const { data: accessData } = await supabase
          .from('ebook_access')
          .select('*')
          .eq('user_id', user.id)
          .eq('ebook_id', id)
          .single();

        setAccess(accessData);

        if (accessData) {
          const { data: progressData } = await supabase
            .from('ebook_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('ebook_id', id)
            .single();

          setProgress(progressData);
        }
      }
    } catch (error) {
      console.error('Error fetching ebook data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcquire = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!ebook) return;

    setAcquiring(true);
    try {
      // For free ebooks, grant access directly
      if (ebook.is_free || ebook.price === 0) {
        const { data, error } = await supabase
          .from('ebook_access')
          .insert({
            user_id: user.id,
            ebook_id: ebook.id,
          })
          .select()
          .single();

        if (error) throw error;
        setAccess(data);
      } else {
        // For paid ebooks, show a message or redirect to payment
        alert('Funcionalidade de pagamento em desenvolvimento. Contate o suporte.');
      }
    } catch (error) {
      console.error('Error acquiring ebook:', error);
      alert('Erro ao adquirir e-book. Tente novamente.');
    } finally {
      setAcquiring(false);
    }
  };

  const handleStartReading = () => {
    navigate(`/read/${ebook?.id}`);
  };

  const formatPrice = (price: number | null, isFree: boolean | null) => {
    if (isFree) return 'Gratuito';
    if (!price) return 'Gratuito';
    return `R$ ${price.toFixed(0)},00`;
  };

  const getReadingProgress = () => {
    if (!progress?.current_page || !ebook?.total_pages) return 0;
    return Math.round((progress.current_page / ebook.total_pages) * 100);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Carregando e-book...</p>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined text-[64px] text-stone-300 dark:text-stone-600">error</span>
        <p className="text-lg text-stone-500 dark:text-stone-400 font-serif">E-book não encontrado</p>
        <button
          onClick={() => navigate('/ebooks')}
          className="mt-4 px-6 py-3 bg-primary text-black text-sm font-bold uppercase tracking-widest rounded-sm"
        >
          Ver Todos os E-books
        </button>
      </div>
    );
  }

  const hasAccess = !!access || ebook.is_free;
  const readingProgress = getReadingProgress();

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark pb-24">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-b from-primary/10 to-transparent pt-6 pb-12">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md text-stone-900 dark:text-white border border-stone-200 dark:border-white/20 hover:bg-white dark:hover:bg-black/60 transition-colors z-10"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        {/* Book Cover */}
        <div className="flex justify-center mt-8">
          <div className="relative w-48 aspect-[2/3] shadow-2xl">
            <img
              src={ebook.cover_url || ''}
              alt={ebook.title}
              className="w-full h-full object-cover"
            />
            {ebook.is_premium && !access && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-white text-[32px]">lock</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em] border border-white/40 px-3 py-1">Premium</span>
                </div>
              </div>
            )}
            {access && (
              <div className="absolute top-3 left-3 bg-primary px-2 py-1 shadow-lg">
                <span className="text-[9px] font-bold text-black uppercase tracking-widest">Adquirido</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col px-6 -mt-4 relative z-10">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 mb-3 text-[9px] font-bold text-primary uppercase tracking-[0.2em] bg-primary/10 rounded-sm">
            {ebook.category}
          </span>
          <h1 className="text-2xl font-display text-stone-900 dark:text-white mb-2 leading-tight">
            {ebook.title}
          </h1>
          <p className="text-sm font-serif italic text-stone-500 dark:text-stone-400">
            por {ebook.author}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mb-6 pb-6 border-b border-stone-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              {ebook.total_pages} páginas
            </span>
          </div>
          <div className="w-px h-4 bg-stone-300 dark:bg-stone-600"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">description</span>
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              {ebook.file_type?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Reading Progress (if has access and progress) */}
        {access && progress && readingProgress > 0 && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Seu Progresso</span>
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                Página {progress.current_page} de {ebook.total_pages}
              </span>
            </div>
            <div className="relative h-1.5 w-full bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${readingProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white mb-3">Sobre o E-book</h3>
          <p className="text-sm font-serif text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
            {ebook.description}
          </p>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-4 p-4 bg-stone-100 dark:bg-white/5 rounded-sm border border-stone-200 dark:border-white/5 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[24px]">person</span>
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">Autor(a)</p>
            <p className="text-sm font-serif italic text-stone-600 dark:text-stone-400">{ebook.author}</p>
          </div>
        </div>

        {/* Related Ebooks could go here */}
      </div>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-stone-200 dark:border-white/10 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          {access ? (
            <button
              onClick={handleStartReading}
              className="w-full py-4 bg-primary text-black font-bold uppercase tracking-[0.2em] text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all rounded-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">auto_stories</span>
              {progress && readingProgress > 0 ? 'Continuar Leitura' : 'Começar a Ler'}
            </button>
          ) : ebook.is_free ? (
            <button
              onClick={handleAcquire}
              disabled={acquiring}
              className="w-full py-4 bg-primary text-black font-bold uppercase tracking-[0.2em] text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all rounded-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {acquiring ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined">download</span>
                  Baixar Grátis
                </>
              )}
            </button>
          ) : (
            <>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Preço</span>
                <span className="text-xl font-display font-medium text-stone-900 dark:text-white">
                  {formatPrice(ebook.price, ebook.is_free)}
                </span>
              </div>
              <button
                onClick={handleAcquire}
                disabled={acquiring}
                className="flex-1 py-4 bg-stone-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center"
              >
                {acquiring ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent"></div>
                ) : (
                  'Comprar Agora'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EbookDetails;
