import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type Profile = Tables<'profiles'>;
type Course = Tables<'courses'>;
type Product = Tables<'products'>;
type ProductImage = Tables<'product_images'>;
type DailyPearl = Tables<'daily_pearls'>;
type EditorialContent = Tables<'editorial_content'>;

interface ProductWithImages extends Product {
  images?: ProductImage[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [dailyPearl, setDailyPearl] = useState<DailyPearl | null>(null);
  const [editorialContent, setEditorialContent] = useState<EditorialContent[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, [user]);

  const fetchHomeData = async () => {
    try {
      // Fetch user profile if logged in
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileData) {
          setProfile(profileData as Profile);
        }
      }

      // Fetch daily pearl for today
      const today = new Date().toISOString().split('T')[0];
      const { data: pearlData } = await supabase
        .from('daily_pearls')
        .select('*')
        .lte('scheduled_date', today)
        .order('scheduled_date', { ascending: false })
        .limit(1)
        .single();

      if (pearlData) {
        setDailyPearl(pearlData);
      }

      // Fetch editorial content (published only)
      const { data: editorialData } = await supabase
        .from('editorial_content')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(4);

      setEditorialContent(editorialData || []);

      // Fetch featured courses (published only)
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true })
        .limit(3);

      setFeaturedCourses(coursesData || []);

      // Fetch featured products with images
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('order_index', { ascending: true })
        .limit(3);

      if (productsData) {
        // Fetch images for products
        const productIds = productsData.map(p => p.id);
        const { data: imagesData } = await supabase
          .from('product_images')
          .select('*')
          .in('product_id', productIds)
          .order('order_index', { ascending: true });

        const productsWithImages: ProductWithImages[] = productsData.map(product => ({
          ...product,
          images: imagesData?.filter(img => img.product_id === product.id) || [],
        }));

        setFeaturedProducts(productsWithImages);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrimaryImage = (product: ProductWithImages): string => {
    const primaryImage = product.images?.find(img => img.is_primary);
    return primaryImage?.image_url || product.images?.[0]?.image_url || '';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Visitante';
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
      {/* Background gradients */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>

      <header className="relative w-full z-10 pt-4 pb-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-1">Bem-vinda</span>
            <h1 className="text-2xl font-display text-stone-900 dark:text-white tracking-wide">{getUserDisplayName()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative group p-2 rounded-full hover:bg-stone-100 dark:hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[24px] text-stone-800 dark:text-stone-200 font-light">notifications</span>
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 border border-background-light dark:border-background-dark"></span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex h-11 w-11 overflow-hidden rounded-full border border-stone-200 dark:border-white/20 ring-2 ring-transparent hover:ring-primary/30 transition-all duration-500 bg-stone-100 dark:bg-white/10"
            >
              {profile?.avatar_url ? (
                <img alt="User profile" className="h-full w-full object-cover" src={profile.avatar_url}/>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-stone-400 dark:text-stone-500">person</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative flex flex-col gap-10 pt-2 z-10">
        {/* Menu Rápido - Quick Access Grid */}
        <section className="px-6 animate-fade">
            <h2 className="text-xs font-bold tracking-[0.2em] text-stone-400 uppercase mb-4">Menu Rápido</h2>
            <div className="grid grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-2 group" onClick={() => navigate('/chat')}>
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:border-primary/50 group-hover:scale-105 transition-all">
                        <span className="material-symbols-outlined text-primary text-[24px]">diamond</span>
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide text-center">Avaliar</span>
                </button>
                <button className="flex flex-col items-center gap-2 group" onClick={() => navigate('/courses')}>
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:border-primary/50 group-hover:scale-105 transition-all">
                        <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide text-center">Certificar</span>
                </button>
                <button className="flex flex-col items-center gap-2 group" onClick={() => navigate('/ebooks')}>
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:border-primary/50 group-hover:scale-105 transition-all">
                        <span className="material-symbols-outlined text-primary text-[24px]">auto_stories</span>
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide text-center">E-books</span>
                </button>
                <button className="flex flex-col items-center gap-2 group" onClick={() => navigate('/shop')}>
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:border-primary/50 group-hover:scale-105 transition-all">
                        <span className="material-symbols-outlined text-primary text-[24px]">favorite</span>
                    </div>
                    <span className="text-[9px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide text-center">Boutique</span>
                </button>
            </div>
        </section>

        {/* Destaques Scroll Horizontal */}
        <section className="flex flex-col gap-5">
          <div className="flex items-end justify-between px-6">
            <h2 className="text-xl font-display font-medium text-stone-900 dark:text-white tracking-wide">Destaques</h2>
            <button
              onClick={() => navigate('/courses')}
              className="text-xs font-bold tracking-widest text-primary hover:text-primary-light uppercase border-b border-primary/30 pb-0.5"
            >
              Ver Tudo
            </button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 gap-6 pb-6">

            {/* Featured Courses */}
            {featuredCourses.map((course, index) => (
              <div
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="snap-center shrink-0 w-[85vw] max-w-[340px] relative rounded-sm overflow-hidden aspect-[16/10] group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{backgroundImage: `url('${course.thumbnail_url || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1887&auto=format&fit=crop'}')`}}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>

                {/* Glass Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                   <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className={`inline-block px-3 py-1 mb-3 text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.4)] ${
                        course.is_free ? 'text-black bg-primary' : 'text-white bg-stone-800'
                      }`}>
                        {course.is_free ? 'Grátis' : course.level}
                      </span>
                      <h3 className="text-2xl font-display text-white leading-none mb-2">{course.title}</h3>
                      <p className="text-stone-300 text-sm font-serif italic line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {course.description?.substring(0, 60)}...
                      </p>
                   </div>
                </div>
              </div>
            ))}

            {/* Featured Products */}
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="snap-center shrink-0 w-[85vw] max-w-[340px] relative rounded-sm overflow-hidden aspect-[16/10] group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-700 hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{backgroundImage: `url('${getPrimaryImage(product)}')`}}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                   <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="inline-block px-3 py-1 mb-3 text-[9px] font-bold text-black uppercase tracking-[0.2em] bg-white rounded-sm">Boutique</span>
                      <h3 className="text-2xl font-display text-white leading-none mb-2">{product.name}</h3>
                      <p className="text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {formatPrice(product.price)}
                      </p>
                   </div>
                </div>
              </div>
            ))}

            {/* Fallback if no content */}
            {featuredCourses.length === 0 && featuredProducts.length === 0 && (
              <div className="snap-center shrink-0 w-[85vw] max-w-[340px] relative rounded-sm overflow-hidden aspect-[16/10] bg-stone-100 dark:bg-white/5 flex items-center justify-center">
                <p className="text-stone-400 font-serif">Conteúdo em breve</p>
              </div>
            )}
          </div>
        </section>

        {/* Pérola do Dia - Daily Content */}
        <section className="px-6">
            <div className="relative overflow-hidden rounded-sm bg-stone-100 dark:bg-[#101010] border border-stone-200 dark:border-white/5 p-6 flex flex-col items-center text-center gap-3">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-[100px] text-primary">format_quote</span>
                 </div>
                 <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] border border-primary/30 px-2 py-0.5 rounded-full">Pérola do Dia</span>
                 <h3 className="text-lg font-serif italic text-stone-700 dark:text-stone-300 leading-relaxed max-w-xs">
                    "{dailyPearl?.quote || 'O verdadeiro valor de uma pérola está na história que ela carrega.'}"
                 </h3>
                 <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-2">
                    — {dailyPearl?.author || 'Madame San'}
                 </span>
            </div>
        </section>

        {/* Editorial Section */}
        <section className="flex flex-col gap-8 px-4">
          <div className="flex items-baseline justify-between px-2 border-b border-stone-200 dark:border-white/5 pb-2">
            <h2 className="text-xl font-display font-medium tracking-wide text-stone-900 dark:text-white">Editorial</h2>
            <div className="flex gap-2">
              <button className="text-stone-400 hover:text-primary transition-colors uppercase text-[10px] font-bold tracking-widest">Filtrar</button>
            </div>
          </div>

          {editorialContent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">article</span>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Conteúdo editorial em breve</p>
            </div>
          ) : (
            editorialContent.map((content) => (
              <article
                key={content.id}
                className="group relative flex flex-col overflow-hidden rounded-sm transition-all hover:-translate-y-1 duration-500"
              >
                {content.is_locked ? (
                  // Premium/Locked Content
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-900">
                    <img
                      alt={content.title}
                      className="h-full w-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"
                      src={content.image_url || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1887&auto=format&fit=crop'}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/50 text-primary bg-black/30 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[20px] font-light">lock</span>
                      </div>
                      <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Conteúdo Premium</span>
                      <h3 className="text-xl font-display text-white mb-4 leading-tight max-w-[80%]">{content.title}</h3>
                      <button className="px-6 py-2 border border-white/30 hover:bg-white hover:text-black text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300">
                        Desbloquear
                      </button>
                    </div>
                  </div>
                ) : (
                  // Regular Content
                  <>
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <img
                        alt={content.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={content.image_url || 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1887&auto=format&fit=crop'}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-[9px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 uppercase tracking-widest">
                          {content.type}
                        </span>
                      </div>
                      {content.type === 'Vídeo' && content.video_duration && (
                        <div className="absolute bottom-4 right-4">
                          <span className="px-2 py-1 text-[10px] font-bold text-white bg-black/70 rounded-sm">
                            {content.video_duration}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col pt-5 pb-2 px-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                        {content.type === 'Vídeo' ? 'Vídeo' : 'Gemologia'}
                      </span>
                      <h3 className="text-xl font-display text-stone-900 dark:text-white mb-3 leading-tight group-hover:text-primary transition-colors">
                        {content.title}
                      </h3>
                      <p className="text-sm font-serif text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                        {content.excerpt}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          {content.type === 'Vídeo' ? 'Assistir' : `${content.read_time_minutes || 5} min de leitura`}
                        </span>
                        <span className="h-[1px] w-8 bg-primary"></span>
                      </div>
                    </div>
                  </>
                )}
              </article>
            ))
          )}

          <div className="h-8"></div>
        </section>
      </main>
    </div>
  );
};

export default Home;
