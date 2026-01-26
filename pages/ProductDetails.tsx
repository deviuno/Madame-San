import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type Product = Tables<'products'>;
type ProductCategory = Tables<'product_categories'>;
type ProductImage = Tables<'product_images'>;

interface ProductWithDetails extends Product {
  images?: ProductImage[];
  category?: ProductCategory;
  isWishlisted?: boolean;
}

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id, user]);

  const fetchProductData = async () => {
    if (!id) return;

    try {
      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) throw productError;

      // Fetch product images
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('order_index', { ascending: true });

      // Fetch category
      let category: ProductCategory | undefined;
      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from('product_categories')
          .select('*')
          .eq('id', productData.category_id)
          .single();
        category = categoryData || undefined;
      }

      // Check if in wishlist
      let isWishlisted = false;
      if (user) {
        const { data: wishlistData } = await supabase
          .from('wishlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', id)
          .single();
        isWishlisted = !!wishlistData;
      }

      setProduct({
        ...productData,
        images: imagesData || [],
        category,
        isWishlisted,
      });
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      if (product.isWishlisted) {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
      } else {
        await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: product.id,
          });
      }

      setProduct(prev => prev ? { ...prev, isWishlisted: !prev.isWishlisted } : null);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handleBuyClick = () => {
    if (product?.external_link) {
      window.open(product.external_link, '_blank', 'noopener,noreferrer');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined text-[64px] text-stone-300 dark:text-stone-600">error</span>
        <p className="text-lg text-stone-500 dark:text-stone-400 font-serif">Produto não encontrado</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 px-6 py-3 bg-primary text-black text-sm font-bold uppercase tracking-widest rounded-sm"
        >
          Ver Todos os Produtos
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImageIndex]?.image_url || '';

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark pb-24">
      {/* Header Transparente */}
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background-light/80 dark:bg-black/40 backdrop-blur-md text-stone-900 dark:text-white border border-stone-200 dark:border-white/10"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <button
          onClick={toggleWishlist}
          className={`flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border transition-colors ${
            product.isWishlisted
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-background-light/80 dark:bg-black/40 text-stone-900 dark:text-white border-stone-200 dark:border-white/10'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {product.isWishlisted ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>

      {/* Image Gallery */}
      <div className="relative w-full aspect-[3/4] bg-stone-100 dark:bg-[#101010]">
        {currentImage ? (
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[64px] text-stone-300 dark:text-stone-600">image</span>
          </div>
        )}

        {/* Image Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  selectedImageIndex === idx ? 'bg-primary w-4' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        {product.is_new && (
          <div className="absolute top-20 left-0">
            <span className="bg-primary text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">Novo</span>
          </div>
        )}
      </div>

      <div className="flex flex-col px-6 pt-8 gap-6">
        {/* Category & Title */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
            {product.category?.name}
          </span>
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl font-display text-stone-900 dark:text-white leading-tight flex-1">
              {product.name}
            </h1>
            <span className="text-xl font-bold text-primary whitespace-nowrap">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif whitespace-pre-line">
          {product.description}
        </p>

        <div className="h-px w-full bg-stone-200 dark:bg-white/10 my-2"></div>

        {/* Product Features */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
            <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
            <span className="text-xs">Certificado de Autenticidade</span>
          </div>
          <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
            <span className="material-symbols-outlined text-[18px] text-primary">local_shipping</span>
            <span className="text-xs">Envio Seguro para Todo Brasil</span>
          </div>
          <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
            <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
            <span className="text-xs">Embalagem Premium para Presente</span>
          </div>
          <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
            <span className="material-symbols-outlined text-[18px] text-primary">support_agent</span>
            <span className="text-xs">Atendimento Personalizado via WhatsApp</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-4 p-4 bg-stone-100 dark:bg-white/5 rounded-sm border border-stone-200 dark:border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">Informação</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
            Ao clicar em "Comprar", você será redirecionado(a) para nosso WhatsApp onde nossa equipe estará pronta para auxiliá-lo(a) com seu pedido.
          </p>
        </div>
      </div>

      {/* Sticky Buy Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-stone-200 dark:border-white/10 z-20">
        <button
          onClick={handleBuyClick}
          className="w-full py-4 bg-primary text-black font-bold uppercase tracking-[0.2em] text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all rounded-sm flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
          <span>Comprar</span>
          <span className="w-px h-4 bg-black/20"></span>
          <span>{formatPrice(product.price)}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
