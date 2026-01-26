import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type Product = Tables<'products'>;
type ProductCategory = Tables<'product_categories'>;
type ProductImage = Tables<'product_images'>;
type Wishlist = Tables<'wishlist'>;

interface ProductWithImages extends Product {
  images?: ProductImage[];
  category?: ProductCategory;
  isWishlisted?: boolean;
}

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch products with images
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (productsError) throw productsError;

      // Fetch all product images
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .order('order_index', { ascending: true });

      // Fetch user's wishlist if logged in
      let wishlistIds: string[] = [];
      if (user) {
        const { data: wishlistData } = await supabase
          .from('wishlist')
          .select('product_id')
          .eq('user_id', user.id);

        wishlistIds = wishlistData?.map(w => w.product_id) || [];
      }

      // Combine products with their images and category
      const productsWithImages: ProductWithImages[] = (productsData || []).map(product => ({
        ...product,
        images: imagesData?.filter(img => img.product_id === product.id) || [],
        category: categoriesData?.find(cat => cat.id === product.category_id),
        isWishlisted: wishlistIds.includes(product.id),
      }));

      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      if (product.isWishlisted) {
        // Remove from wishlist
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } else {
        // Add to wishlist
        await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: productId,
          });
      }

      // Update local state
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, isWishlisted: !p.isWishlisted } : p
      ));
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPrimaryImage = (product: ProductWithImages): string => {
    const primaryImage = product.images?.find(img => img.is_primary);
    return primaryImage?.image_url || product.images?.[0]?.image_url || '';
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !activeCategory || product.category_id === activeCategory;
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProducts = products.filter(p => p.is_featured);
  const newProducts = filteredProducts.filter(p => p.is_new);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Carregando boutique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-30 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-stone-200 dark:border-white/5 pt-2 transition-all">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] font-light">arrow_back</span>
            </button>
            <h1 className="text-xl font-display font-medium tracking-wide text-stone-900 dark:text-white">Boutique</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center text-stone-900 dark:text-white hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[22px] font-light">favorite</span>
              {products.some(p => p.isWishlisted) && (
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-8 pt-6">
        {/* Search */}
        <div className="px-6 flex flex-col gap-6">
          <div className="relative group">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400 material-symbols-outlined text-[20px] font-light group-focus-within:text-primary transition-colors">search</span>
            <input
              className="w-full bg-transparent border-b border-stone-300 dark:border-white/20 py-3 pl-8 pr-4 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 font-serif focus:outline-none focus:border-primary transition-colors"
              placeholder="Buscar produtos..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                !activeCategory
                  ? 'text-black bg-primary border-primary'
                  : 'text-stone-500 dark:text-stone-400 border-stone-300 dark:border-white/10 hover:border-primary hover:text-primary'
              }`}
            >
              Tudo
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`shrink-0 px-5 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                  activeCategory === category.id
                    ? 'text-black bg-primary border-primary'
                    : 'text-stone-500 dark:text-stone-400 border-stone-300 dark:border-white/10 hover:border-primary hover:text-primary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Banner */}
        {featuredProducts.length > 0 && !activeCategory && !searchQuery && (
          <section className="px-6">
            <div
              onClick={() => navigate(`/product/${featuredProducts[0].id}`)}
              className="relative w-full aspect-[16/10] overflow-hidden group cursor-pointer shadow-xl"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] group-hover:scale-110"
                style={{ backgroundImage: `url('${getPrimaryImage(featuredProducts[0])}')` }}
              ></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-700"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[85%] border border-white/30 z-10"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-2 drop-shadow-md">Destaque</span>
                <h2 className="text-2xl font-display text-white mb-4 drop-shadow-lg">{featuredProducts[0].name}</h2>
                <span className="text-lg font-display text-primary drop-shadow-lg mb-4">
                  {formatPrice(featuredProducts[0].price)}
                </span>
                <button className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/40 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section className="flex flex-col gap-6 px-6">
          <div className="flex items-end justify-between border-b border-stone-200 dark:border-white/5 pb-2">
            <h2 className="text-xl font-display text-stone-900 dark:text-white tracking-wide">
              {activeCategory
                ? categories.find(c => c.id === activeCategory)?.name
                : searchQuery
                  ? 'Resultados'
                  : 'Todos os Produtos'}
            </h2>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              {filteredProducts.length} Itens
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">inventory_2</span>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="group flex flex-col gap-3 cursor-pointer"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-[#101010]">
                    <img
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={getPrimaryImage(product)}
                    />

                    {/* Wishlist Button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => toggleWishlist(e, product.id)}
                        className={`h-8 w-8 flex items-center justify-center rounded-full shadow-md transition-colors ${
                          product.isWishlisted
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-stone-900 hover:text-red-500'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {product.isWishlisted ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                    </div>

                    {/* Badges */}
                    {product.is_new && (
                      <div className="absolute top-3 left-0">
                        <span className="bg-primary text-black text-[9px] font-bold px-2 py-1 uppercase tracking-widest">Novo</span>
                      </div>
                    )}
                    {product.is_featured && !product.is_new && (
                      <div className="absolute top-3 left-0">
                        <span className="bg-stone-900 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest">Destaque</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center text-center gap-1">
                    <span className="text-[8px] font-bold text-primary uppercase tracking-widest">
                      {product.category?.name}
                    </span>
                    <h3 className="text-sm font-display text-stone-900 dark:text-white tracking-wide group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-serif italic line-clamp-1">
                      {product.description?.substring(0, 30)}...
                    </p>
                    <span className="text-sm font-bold text-stone-900 dark:text-white mt-1">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="h-10"></div>
        </section>
      </main>
    </div>
  );
};

export default Shop;
