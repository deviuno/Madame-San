import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import type { Tables } from '../../types/database';

type Product = Tables<'products'>;
type ProductCategory = Tables<'product_categories'>;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<(Product & { category?: ProductCategory })[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('order_index'),
        supabase.from('product_categories').select('*').order('order_index'),
      ]);

      const productsWithCategory = (productsRes.data || []).map(p => ({
        ...p,
        category: categoriesRes.data?.find(c => c.id === p.category_id),
      }));

      setProducts(productsWithCategory);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
      fetchData();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-stone-900 dark:text-white">Produtos</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Gerencie os produtos da boutique</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5">
          <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">storefront</span>
          <p className="text-stone-500 dark:text-stone-400">Nenhum produto cadastrado</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 dark:bg-white/5">
              <tr>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Produto</th>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Categoria</th>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Preço</th>
                <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Status</th>
                <th className="text-right text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 dark:hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-stone-900 dark:text-white">{product.name}</p>
                        {product.is_new && <span className="text-xs text-primary">Novo</span>}
                        {product.is_featured && <span className="text-xs text-orange-500 ml-2">Destaque</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-300">{product.category?.name || '-'}</td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-300">{formatPrice(product.price)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        product.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-400'
                      }`}
                    >
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                        className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
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

const ProductForm: React.FC<{ productId?: string }> = ({ productId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!productId);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    external_link: '',
    category_id: null,
    is_new: false,
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    supabase.from('product_categories').select('*').order('order_index').then(({ data }) => {
      setCategories(data || []);
    });

    if (productId) {
      supabase.from('products').select('*').eq('id', productId).single().then(({ data }) => {
        if (data) setProduct(data);
        setLoading(false);
      });
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (productId) {
        await supabase.from('products').update(product).eq('id', productId);
      } else {
        if (!product.name || !product.external_link) {
          throw new Error('Nome e link externo são obrigatórios');
        }
        await supabase.from('products').insert({
          name: product.name,
          external_link: product.external_link,
          price: product.price || 0,
          description: product.description || null,
          category_id: product.category_id || null,
          is_new: product.is_new || false,
          is_featured: product.is_featured || false,
          is_active: product.is_active ?? true,
        });
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto');
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
        <button onClick={() => navigate('/admin/products')} className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10">
          <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">arrow_back</span>
        </button>
        <h1 className="text-2xl font-display text-stone-900 dark:text-white">{productId ? 'Editar Produto' : 'Novo Produto'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Nome do Produto *</label>
            <input type="text" required value={product.name || ''} onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Descrição</label>
            <textarea rows={3} value={product.description || ''} onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Categoria</label>
              <select value={product.category_id || ''} onChange={(e) => setProduct({ ...product, category_id: e.target.value || null })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white">
                <option value="">Sem categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Preço (R$) *</label>
              <input type="number" required min="0" step="0.01" value={product.price || 0} onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Link Externo (WhatsApp) *</label>
            <input type="url" required value={product.external_link || ''} onChange={(e) => setProduct({ ...product, external_link: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
              placeholder="https://wa.me/5511999999999?text=..." />
            <p className="text-xs text-stone-500 mt-1">Link para onde o cliente será redirecionado ao clicar em "Comprar"</p>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={product.is_new || false} onChange={(e) => setProduct({ ...product, is_new: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary" />
              <span className="text-sm text-stone-700 dark:text-stone-300">Produto Novo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={product.is_featured || false} onChange={(e) => setProduct({ ...product, is_featured: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary" />
              <span className="text-sm text-stone-700 dark:text-stone-300">Destaque</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={product.is_active || false} onChange={(e) => setProduct({ ...product, is_active: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary" />
              <span className="text-sm text-stone-700 dark:text-stone-300">Ativo</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-stone-200 dark:border-white/5">
            <button type="button" onClick={() => navigate('/admin/products')}
              className="px-6 py-3 border border-stone-300 dark:border-white/10 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-white/5">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:brightness-110 disabled:opacity-50">
              {saving ? 'Salvando...' : productId ? 'Salvar Alterações' : 'Criar Produto'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const AdminProducts: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/new" element={<ProductForm />} />
        <Route path="/:id" element={<ProductFormWrapper />} />
      </Routes>
    </AdminLayout>
  );
};

const ProductFormWrapper: React.FC = () => {
  const productId = window.location.hash.split('/admin/products/')[1]?.split('/')[0];
  return <ProductForm productId={productId} />;
};

export default AdminProducts;
