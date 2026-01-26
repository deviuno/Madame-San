import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import type { Tables } from '../../types/database';

type Ebook = Tables<'ebooks'>;

const EbookList: React.FC = () => {
  const navigate = useNavigate();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      setEbooks(data || []);
    } catch (error) {
      console.error('Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (ebook: Ebook) => {
    try {
      await supabase.from('ebooks').update({ is_published: !ebook.is_published }).eq('id', ebook.id);
      fetchEbooks();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const deleteEbook = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este e-book?')) return;
    try {
      await supabase.from('ebooks').delete().eq('id', id);
      fetchEbooks();
    } catch (error) {
      console.error('Error deleting ebook:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-stone-900 dark:text-white">E-books</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Gerencie os e-books da plataforma</p>
        </div>
        <button
          onClick={() => navigate('/admin/ebooks/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo E-book
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : ebooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5">
          <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">auto_stories</span>
          <p className="text-stone-500 dark:text-stone-400">Nenhum e-book cadastrado</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 dark:bg-white/5">
              <tr>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">E-book</th>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Autor</th>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Preço</th>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Status</th>
                <th className="text-right text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-white/5">
              {ebooks.map((ebook) => (
                <tr key={ebook.id} className="hover:bg-stone-50 dark:hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded bg-stone-100 dark:bg-white/10 overflow-hidden">
                        {ebook.cover_url ? (
                          <img src={ebook.cover_url} alt={ebook.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-stone-400 text-sm">auto_stories</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 dark:text-white">{ebook.title}</p>
                        <p className="text-xs text-stone-500">{ebook.total_pages} páginas</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-300">{ebook.author || '-'}</td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-300">
                    {ebook.is_free ? 'Grátis' : `R$ ${ebook.price}`}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublish(ebook)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        ebook.is_published
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-400'
                      }`}
                    >
                      {ebook.is_published ? 'Publicado' : 'Rascunho'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/ebooks/${ebook.id}`)}
                        className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => deleteEbook(ebook.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const EbookForm: React.FC<{ ebookId?: string }> = ({ ebookId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!ebookId);
  const [saving, setSaving] = useState(false);
  const [ebook, setEbook] = useState<Partial<Ebook>>({
    title: '',
    description: '',
    author: '',
    cover_url: '',
    file_url: '',
    file_type: 'pdf',
    total_pages: 0,
    price: 0,
    is_free: false,
    is_premium: false,
    is_published: false,
    category: '',
  });

  useEffect(() => {
    if (ebookId) {
      supabase.from('ebooks').select('*').eq('id', ebookId).single().then(({ data }) => {
        if (data) setEbook(data);
        setLoading(false);
      });
    }
  }, [ebookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (ebookId) {
        await supabase.from('ebooks').update(ebook).eq('id', ebookId);
      } else {
        if (!ebook.file_url) throw new Error('URL do arquivo é obrigatória');
        await supabase.from('ebooks').insert({
          title: ebook.title || 'Sem título',
          file_url: ebook.file_url,
          description: ebook.description || null,
          author: ebook.author || null,
          cover_url: ebook.cover_url || null,
          file_type: ebook.file_type || 'pdf',
          total_pages: ebook.total_pages || 0,
          price: ebook.price || 0,
          is_free: ebook.is_free || false,
          is_premium: ebook.is_premium || false,
          is_published: ebook.is_published || false,
          category: ebook.category || null,
        });
      }
      navigate('/admin/ebooks');
    } catch (error) {
      console.error('Error saving ebook:', error);
      alert('Erro ao salvar e-book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center h-64"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/ebooks')} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10">
          <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">arrow_back</span>
        </button>
        <h1 className="text-2xl font-display text-stone-900 dark:text-white">{ebookId ? 'Editar E-book' : 'Novo E-book'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Título *</label>
            <input type="text" required value={ebook.title || ''} onChange={(e) => setEbook({ ...ebook, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Descrição</label>
            <textarea rows={3} value={ebook.description || ''} onChange={(e) => setEbook({ ...ebook, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Autor</label>
              <input type="text" value={ebook.author || ''} onChange={(e) => setEbook({ ...ebook, author: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Categoria</label>
              <input type="text" value={ebook.category || ''} onChange={(e) => setEbook({ ...ebook, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Preço (R$)</label>
              <input type="number" min="0" value={ebook.price || 0} onChange={(e) => setEbook({ ...ebook, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Total de Páginas</label>
              <input type="number" min="0" value={ebook.total_pages || 0} onChange={(e) => setEbook({ ...ebook, total_pages: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Tipo</label>
              <select value={ebook.file_type || 'pdf'} onChange={(e) => setEbook({ ...ebook, file_type: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white">
                <option value="pdf">PDF</option>
                <option value="epub">EPUB</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">URL da Capa</label>
            <input type="url" value={ebook.cover_url || ''} onChange={(e) => setEbook({ ...ebook, cover_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">URL do Arquivo *</label>
            <input type="url" required value={ebook.file_url || ''} onChange={(e) => setEbook({ ...ebook, file_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={ebook.is_free || false} onChange={(e) => setEbook({ ...ebook, is_free: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary" />
              <span className="text-sm text-stone-700 dark:text-stone-300">Gratuito</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={ebook.is_premium || false} onChange={(e) => setEbook({ ...ebook, is_premium: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary" />
              <span className="text-sm text-stone-700 dark:text-stone-300">Premium</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={ebook.is_published || false} onChange={(e) => setEbook({ ...ebook, is_published: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary" />
              <span className="text-sm text-stone-700 dark:text-stone-300">Publicado</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-stone-200 dark:border-white/5">
            <button type="button" onClick={() => navigate('/admin/ebooks')}
              className="px-6 py-3 border border-stone-300 dark:border-white/10 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-white/5">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:brightness-110 disabled:opacity-50">
              {saving ? 'Salvando...' : ebookId ? 'Salvar Alterações' : 'Criar E-book'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const AdminEbooks: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<EbookList />} />
        <Route path="/new" element={<EbookForm />} />
        <Route path="/:id" element={<EbookFormWrapper />} />
      </Routes>
    </AdminLayout>
  );
};

const EbookFormWrapper: React.FC = () => {
  const ebookId = window.location.hash.split('/admin/ebooks/')[1]?.split('/')[0];
  return <EbookForm ebookId={ebookId} />;
};

export default AdminEbooks;
