import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type Ebook = Tables<'ebooks'>;
type EbookAccess = Tables<'ebook_access'>;
type EbookProgress = Tables<'ebook_progress'>;

const EbookReader: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [access, setAccess] = useState<EbookAccess | null>(null);
  const [progress, setProgress] = useState<EbookProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showToc, setShowToc] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const controlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      fetchEbookData();
    }
  }, [id, user]);

  const fetchEbookData = async () => {
    if (!id || !user) {
      navigate('/login');
      return;
    }

    try {
      // Fetch ebook details
      const { data: ebookData, error: ebookError } = await supabase
        .from('ebooks')
        .select('*')
        .eq('id', id)
        .single();

      if (ebookError) throw ebookError;
      setEbook(ebookData);

      // Check access
      const { data: accessData } = await supabase
        .from('ebook_access')
        .select('*')
        .eq('user_id', user.id)
        .eq('ebook_id', id)
        .single();

      // If no access and not free, redirect
      if (!accessData && !ebookData.is_free) {
        navigate(`/ebook/${id}`);
        return;
      }

      setAccess(accessData);

      // Fetch or create progress
      const { data: progressData } = await supabase
        .from('ebook_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('ebook_id', id)
        .single();

      if (progressData) {
        setProgress(progressData);
        setCurrentPage(progressData.current_page || 1);
      } else {
        // Create new progress entry
        const { data: newProgress } = await supabase
          .from('ebook_progress')
          .insert({
            user_id: user.id,
            ebook_id: id,
            current_page: 1,
          })
          .select()
          .single();
        setProgress(newProgress);
      }
    } catch (error) {
      console.error('Error fetching ebook data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = useCallback(async (page: number) => {
    if (!user || !ebook || !progress) return;

    try {
      await supabase
        .from('ebook_progress')
        .update({
          current_page: page,
          last_read_at: new Date().toISOString(),
        })
        .eq('id', progress.id);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [user, ebook, progress]);

  const handlePageChange = (newPage: number) => {
    if (!ebook) return;
    const validPage = Math.max(1, Math.min(newPage, ebook.total_pages || 1));
    setCurrentPage(validPage);
    saveProgress(validPage);
  };

  const handleScreenTouch = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const toggleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      return 'small';
    });
  };

  const getProgressPercent = () => {
    if (!ebook?.total_pages) return 0;
    return Math.round((currentPage / ebook.total_pages) * 100);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#1a1a1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-400 font-serif">Carregando e-book...</p>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#1a1a1a]">
        <span className="material-symbols-outlined text-[64px] text-stone-600">error</span>
        <p className="text-lg text-stone-400 font-serif">E-book não encontrado</p>
        <button
          onClick={() => navigate('/ebooks')}
          className="mt-4 px-6 py-3 bg-primary text-black text-sm font-bold uppercase tracking-widest rounded-sm"
        >
          Ver E-books
        </button>
      </div>
    );
  }

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[fontSize];

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1a1a1a]" onClick={handleScreenTouch}>
      {/* Top Controls */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ebook/${ebook.id}`);
            }}
            className="flex items-center gap-2 text-white"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-wider hidden sm:inline">Voltar</span>
          </button>

          <div className="flex items-center gap-2 text-white">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowToc(!showToc);
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">toc</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFontSize();
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">format_size</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-2">
          <h1 className="text-sm font-display text-white truncate px-4">{ebook.title}</h1>
        </div>
      </div>

      {/* Table of Contents Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#0a0a0a] z-50 transform transition-transform duration-300 ${
          showToc ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Índice</h2>
          <button onClick={() => setShowToc(false)} className="text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          {/* Simulated chapters - in production, this would come from the ebook metadata */}
          {Array.from({ length: Math.ceil((ebook.total_pages || 1) / 20) }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                handlePageChange(i * 20 + 1);
                setShowToc(false);
              }}
              className={`w-full text-left py-3 px-2 border-b border-white/5 text-sm font-serif transition-colors ${
                currentPage >= i * 20 + 1 && currentPage < (i + 1) * 20 + 1
                  ? 'text-primary'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Capítulo {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay when TOC is open */}
      {showToc && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowToc(false)}
        />
      )}

      {/* Reader Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          {/* PDF Embed or Content Area */}
          <div className="bg-[#f5f5f0] dark:bg-[#252525] rounded-sm shadow-2xl min-h-[70vh] p-8 relative">
            {ebook.file_url ? (
              // If we have a file URL, show an iframe (for PDF) or content
              ebook.file_type === 'pdf' ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-[64px] text-primary mb-4">picture_as_pdf</span>
                  <p className={`text-stone-700 dark:text-stone-300 font-serif mb-6 ${fontSizeClass}`}>
                    Visualização do PDF
                  </p>
                  <a
                    href={ebook.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-widest text-sm rounded-sm hover:brightness-110 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Abrir PDF Completo
                  </a>
                  <p className="text-xs text-stone-500 mt-4 font-serif">
                    Para melhor experiência, abra o PDF em tela cheia
                  </p>
                </div>
              ) : (
                // For other formats (EPUB, etc.), show reader content
                <div className={`text-stone-800 dark:text-stone-200 font-serif leading-relaxed ${fontSizeClass}`}>
                  <p className="mb-4">
                    <span className="text-4xl font-display float-left mr-2 leading-none text-primary">
                      {ebook.title.charAt(0)}
                    </span>
                    {ebook.description}
                  </p>
                  <p className="mb-4 text-stone-600 dark:text-stone-400 italic text-sm">
                    Página {currentPage} de {ebook.total_pages}
                  </p>
                </div>
              )
            ) : (
              // Placeholder content when no file URL
              <div className={`text-stone-800 dark:text-stone-200 font-serif leading-relaxed ${fontSizeClass}`}>
                <p className="mb-4">
                  <span className="text-4xl font-display float-left mr-2 leading-none text-primary">
                    {ebook.title.charAt(0)}
                  </span>
                  Este é um exemplo de como o conteúdo do e-book seria exibido. O texto fluiria naturalmente pela página, permitindo uma leitura confortável.
                </p>
                <p className="mb-4">
                  {ebook.description}
                </p>
                <p className="text-stone-600 dark:text-stone-400 italic text-sm mt-8">
                  Página {currentPage} de {ebook.total_pages}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="1"
            max={ebook.total_pages || 1}
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`flex items-center gap-1 text-sm ${
              currentPage <= 1 ? 'text-stone-600 cursor-not-allowed' : 'text-white hover:text-primary'
            } transition-colors`}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            <span className="font-bold uppercase tracking-wider hidden sm:inline">Anterior</span>
          </button>

          <div className="flex flex-col items-center">
            <span className="text-xs text-white font-bold">
              {currentPage} / {ebook.total_pages}
            </span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest">
              {getProgressPercent()}% concluído
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= (ebook.total_pages || 1)}
            className={`flex items-center gap-1 text-sm ${
              currentPage >= (ebook.total_pages || 1) ? 'text-stone-600 cursor-not-allowed' : 'text-white hover:text-primary'
            } transition-colors`}
          >
            <span className="font-bold uppercase tracking-wider hidden sm:inline">Próxima</span>
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EbookReader;
