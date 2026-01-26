import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import type { Tables } from '../../types/database';

type EditorialContent = Tables<'editorial_content'>;

const EditorialList: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<EditorialContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('editorial_content')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (item: EditorialContent) => {
    try {
      await supabase.from('editorial_content').update({
        is_published: !item.is_published,
        published_at: !item.is_published ? new Date().toISOString() : item.published_at,
      }).eq('id', item.id);
      fetchContent();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return;
    try {
      await supabase.from('editorial_content').delete().eq('id', id);
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-stone-900 dark:text-white">Conteúdo Editorial</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Gerencie artigos e vídeos do feed</p>
        </div>
        <button
          onClick={() => navigate('/admin/editorial/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo Conteúdo
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : content.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5">
          <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">article</span>
          <p className="text-stone-500 dark:text-stone-400">Nenhum conteúdo cadastrado</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 dark:bg-white/5">
              <tr>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Título</th>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Tipo</th>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Data</th>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Status</th>
                <th className="text-right text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-white/5">
              {content.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-stone-900 dark:text-white">{item.title}</p>
                        {item.is_locked && <span className="text-xs text-primary">Premium</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.type === 'Vídeo' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      item.type === 'Premium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-300">{formatDate(item.published_at)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublish(item)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        item.is_published
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-400'
                      }`}
                    >
                      {item.is_published ? 'Publicado' : 'Rascunho'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/editorial/${item.id}`)}
                        className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => deleteContent(item.id)}
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

const EditorialForm: React.FC<{ contentId?: string }> = ({ contentId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!contentId);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<Partial<EditorialContent>>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    type: 'Artigo',
    read_time_minutes: 5,
    video_duration: '',
    is_locked: false,
    is_published: false,
  });

  useEffect(() => {
    if (contentId) {
      supabase.from('editorial_content').select('*').eq('id', contentId).single().then(({ data }) => {
        if (data) setContent(data);
        setLoading(false);
      });
    }
  }, [contentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const publishedAt = content.is_published && !content.published_at ? new Date().toISOString() : content.published_at;

      if (contentId) {
        await supabase.from('editorial_content').update({
          ...content,
          published_at: publishedAt,
        }).eq('id', contentId);
      } else {
        if (!content.title) throw new Error('Título é obrigatório');
        await supabase.from('editorial_content').insert({
          title: content.title,
          excerpt: content.excerpt || null,
          content: content.content || null,
          image_url: content.image_url || null,
          type: content.type || 'Artigo',
          read_time_minutes: content.read_time_minutes || 5,
          video_duration: content.video_duration || null,
          is_locked: content.is_locked || false,
          is_published: content.is_published || false,
          published_at: publishedAt || null,
        });
      }
      navigate('/admin/editorial');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Erro ao salvar conteúdo');
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
        <button onClick={() => navigate('/admin/editorial')} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10">
          <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">arrow_back</span>
        </button>
        <h1 className="text-2xl font-display text-stone-900 dark:text-white">{contentId ? 'Editar Conteúdo' : 'Novo Conteúdo'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Título *</label>
            <input type="text" required value={content.title || ''} onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Resumo</label>
            <textarea rows={2} value={content.excerpt || ''} onChange={(e) => setContent({ ...content, excerpt: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Conteúdo</label>
            <textarea rows={8} value={content.content || ''} onChange={(e) => setContent({ ...content, content: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white font-mono text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Tipo</label>
              <select value={content.type || 'Artigo'} onChange={(e) => setContent({ ...content, type: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white">
                <option value="Artigo">Artigo</option>
                <option value="Vídeo">Vídeo</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                {content.type === 'Vídeo' ? 'Duração do Vídeo' : 'Tempo de Leitura (min)'}
              </label>
              {content.type === 'Vídeo' ? (
                <input type="text" value={content.video_duration || ''} onChange={(e) => setContent({ ...content, video_duration: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                  placeholder="12:45" />
              ) : (
                <input type="number" min="1" value={content.read_time_minutes || 5} onChange={(e) => setContent({ ...content, read_time_minutes: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">URL da Imagem</label>
            <input type="url" value={content.image_url || ''} onChange={(e) => setContent({ ...content, image_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={content.is_locked || false} onChange={(e) => setContent({ ...content, is_locked: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary" />
              <span className="text-sm text-stone-700 dark:text-stone-300">Conteúdo Premium (bloqueado)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={content.is_published || false} onChange={(e) => setContent({ ...content, is_published: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary" />
              <span className="text-sm text-stone-700 dark:text-stone-300">Publicado</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-stone-200 dark:border-white/5">
            <button type="button" onClick={() => navigate('/admin/editorial')}
              className="px-6 py-3 border border-stone-300 dark:border-white/10 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-white/5">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:brightness-110 disabled:opacity-50">
              {saving ? 'Salvando...' : contentId ? 'Salvar Alterações' : 'Criar Conteúdo'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const AdminEditorial: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<EditorialList />} />
        <Route path="/new" element={<EditorialForm />} />
        <Route path="/:id" element={<EditorialFormWrapper />} />
      </Routes>
    </AdminLayout>
  );
};

const EditorialFormWrapper: React.FC = () => {
  const contentId = window.location.hash.split('/admin/editorial/')[1]?.split('/')[0];
  return <EditorialForm contentId={contentId} />;
};

export default AdminEditorial;
