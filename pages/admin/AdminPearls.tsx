import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import type { Tables } from '../../types/database';

type DailyPearl = Tables<'daily_pearls'>;

const AdminPearls: React.FC = () => {
  const [pearls, setPearls] = useState<DailyPearl[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<DailyPearl> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPearls();
  }, []);

  const fetchPearls = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_pearls')
        .select('*')
        .order('scheduled_date', { ascending: false });
      if (error) throw error;
      setPearls(data || []);
    } catch (error) {
      console.error('Error fetching pearls:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePearl = async () => {
    if (!editing?.quote) return;
    setSaving(true);

    try {
      if (editing.id) {
        await supabase.from('daily_pearls').update(editing).eq('id', editing.id);
      } else {
        await supabase.from('daily_pearls').insert({
          quote: editing.quote,
          author: editing.author || null,
          scheduled_date: editing.scheduled_date || null,
        });
      }
      setEditing(null);
      fetchPearls();
    } catch (error) {
      console.error('Error saving pearl:', error);
      alert('Erro ao salvar pérola');
    } finally {
      setSaving(false);
    }
  };

  const deletePearl = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta pérola?')) return;
    try {
      await supabase.from('daily_pearls').delete().eq('id', id);
      fetchPearls();
    } catch (error) {
      console.error('Error deleting pearl:', error);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const isToday = (date: string | null) => {
    if (!date) return false;
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  const isPast = (date: string | null) => {
    if (!date) return false;
    const today = new Date().toISOString().split('T')[0];
    return date < today;
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display text-stone-900 dark:text-white">Pérolas do Dia</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Gerencie as citações diárias</p>
          </div>
          <button
            onClick={() => setEditing({ quote: '', author: 'Madame San', scheduled_date: new Date().toISOString().split('T')[0] })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nova Pérola
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : pearls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5">
            <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">format_quote</span>
            <p className="text-stone-500 dark:text-stone-400">Nenhuma pérola cadastrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pearls.map((pearl) => (
              <div
                key={pearl.id}
                className={`p-4 bg-white dark:bg-[#111111] rounded-lg border ${
                  isToday(pearl.scheduled_date)
                    ? 'border-primary'
                    : 'border-stone-200 dark:border-white/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 px-3 py-1 rounded text-xs font-bold ${
                    isToday(pearl.scheduled_date)
                      ? 'bg-primary text-black'
                      : isPast(pearl.scheduled_date)
                        ? 'bg-stone-100 text-stone-500 dark:bg-white/10 dark:text-stone-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {formatDate(pearl.scheduled_date)}
                  </div>
                  <div className="flex-1">
                    <p className="text-stone-900 dark:text-white font-serif italic">"{pearl.quote}"</p>
                    <p className="text-xs text-stone-500 mt-2">— {pearl.author || 'Anônimo'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(pearl)}
                      className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => deletePearl(pearl.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#111111] rounded-lg w-full max-w-lg p-6">
              <h2 className="text-lg font-display text-stone-900 dark:text-white mb-4">
                {editing.id ? 'Editar Pérola' : 'Nova Pérola'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Citação</label>
                  <textarea
                    rows={4}
                    value={editing.quote || ''}
                    onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                    placeholder="O nácar é a alma da pérola..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Autor</label>
                    <input
                      type="text"
                      value={editing.author || ''}
                      onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                      placeholder="Madame San"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Data Agendada</label>
                    <input
                      type="date"
                      value={editing.scheduled_date || ''}
                      onChange={(e) => setEditing({ ...editing, scheduled_date: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg text-stone-700 dark:text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePearl}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-primary text-black font-bold rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPearls;
