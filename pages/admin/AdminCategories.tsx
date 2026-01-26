import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import type { Tables } from '../../types/database';

type ProductCategory = Tables<'product_categories'>;

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ProductCategory> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async () => {
    if (!editing?.name) return;
    setSaving(true);

    try {
      const slug = editing.slug || editing.name.toLowerCase().replace(/\s+/g, '-');
      const categoryData = { ...editing, slug };

      if (editing.id) {
        await supabase.from('product_categories').update(categoryData).eq('id', editing.id);
      } else {
        await supabase.from('product_categories').insert({
          name: editing.name,
          slug,
          description: editing.description || null,
          is_active: editing.is_active ?? true,
          order_index: categories.length,
        });
      }
      setEditing(null);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
    try {
      await supabase.from('product_categories').delete().eq('id', id);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const toggleActive = async (category: ProductCategory) => {
    try {
      await supabase.from('product_categories').update({ is_active: !category.is_active }).eq('id', category.id);
      fetchCategories();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display text-stone-900 dark:text-white">Categorias</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Gerencie as categorias de produtos</p>
          </div>
          <button
            onClick={() => setEditing({ name: '', description: '', is_active: true })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nova Categoria
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5">
            <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">category</span>
            <p className="text-stone-500 dark:text-stone-400">Nenhuma categoria cadastrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-stone-900 dark:text-white">{category.name}</p>
                  <p className="text-xs text-stone-500">{category.slug}</p>
                </div>
                <button
                  onClick={() => toggleActive(category)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    category.is_active
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-400'
                  }`}
                >
                  {category.is_active ? 'Ativa' : 'Inativa'}
                </button>
                <button
                  onClick={() => setEditing(category)}
                  className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#111111] rounded-lg w-full max-w-md p-6">
              <h2 className="text-lg font-display text-stone-900 dark:text-white mb-4">
                {editing.id ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Nome</label>
                  <input
                    type="text"
                    value={editing.name || ''}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    value={editing.description || ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_active ?? true}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-stone-300 text-primary"
                  />
                  <span className="text-sm text-stone-700 dark:text-stone-300">Categoria ativa</span>
                </label>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg text-stone-700 dark:text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCategory}
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

export default AdminCategories;
