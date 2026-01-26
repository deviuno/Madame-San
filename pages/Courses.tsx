import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type Course = Tables<'courses'>;
type Enrollment = Tables<'course_enrollments'>;
type Ebook = Tables<'ebooks'>;
type EbookAccess = Tables<'ebook_access'>;

interface CourseWithEnrollment extends Course {
  enrollment?: Enrollment | null;
}

interface EbookWithAccess extends Ebook {
  access?: EbookAccess | null;
}

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courses, setCourses] = useState<CourseWithEnrollment[]>([]);
  const [ebooks, setEbooks] = useState<EbookWithAccess[]>([]);
  const [inProgressCourse, setInProgressCourse] = useState<CourseWithEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const ebooksScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchEbooks = async () => {
    try {
      const { data: ebooksData, error: ebooksError } = await supabase
        .from('ebooks')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (ebooksError) throw ebooksError;

      let ebooksWithAccess: EbookWithAccess[] = ebooksData || [];

      if (user) {
        const { data: accessData } = await supabase
          .from('ebook_access')
          .select('*')
          .eq('user_id', user.id);

        if (accessData) {
          ebooksWithAccess = ebooksData?.map(ebook => ({
            ...ebook,
            access: accessData.find(a => a.ebook_id === ebook.id) || null
          })) || [];
        }
      }

      setEbooks(ebooksWithAccess);
    } catch (error) {
      console.error('Error fetching ebooks:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchCourses(), fetchEbooks()]);
    setLoading(false);
  };

  const fetchCourses = async () => {
    try {
      // Fetch all published courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true });

      if (coursesError) throw coursesError;

      let coursesWithEnrollment: CourseWithEnrollment[] = coursesData || [];

      // If user is logged in, fetch their enrollments
      if (user) {
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', user.id);

        if (!enrollmentsError && enrollmentsData) {
          coursesWithEnrollment = coursesData?.map(course => ({
            ...course,
            enrollment: enrollmentsData.find(e => e.course_id === course.id) || null
          })) || [];

          // Find course in progress (has enrollment but not completed)
          const inProgress = coursesWithEnrollment.find(
            c => c.enrollment && !c.enrollment.completed_at && (c.enrollment.progress_percent || 0) > 0
          );
          setInProgressCourse(inProgress || null);
        }
      }

      setCourses(coursesWithEnrollment);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0h';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price: number | null, isFree: boolean | null) => {
    if (isFree) return 'Gratuito';
    if (!price) return 'Gratuito';
    return `R$ ${price.toFixed(0)}`;
  };

  const filteredCourses = courses.filter(course => {
    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      const matchesTitle = course.title?.toLowerCase().includes(search);
      const matchesDescription = course.description?.toLowerCase().includes(search);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Filter by category
    if (activeFilter === 'all') return true;
    if (activeFilter === 'free') return course.is_free;
    if (activeFilter === 'premium') return course.is_premium;
    return course.level?.toLowerCase() === activeFilter;
  });

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark">
      <header className="w-full bg-background-light dark:bg-background-dark pt-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] font-light">arrow_back</span>
            </button>
            <h1 className="text-xl font-display font-medium tracking-wide text-stone-900 dark:text-white">Academia</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchTerm('');
              }}
              className={`relative flex h-10 w-10 items-center justify-center transition-colors ${
                showSearch ? 'text-primary' : 'text-stone-900 dark:text-white hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[22px] font-light">
                {showSearch ? 'close' : 'search'}
              </span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        {showSearch && (
          <div className="px-6 pb-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-stone-400">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cursos..."
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#101010] border border-stone-200 dark:border-white/10 rounded-sm text-sm text-stone-900 dark:text-white placeholder-stone-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex flex-col gap-8 pt-2">
        {/* Filters */}
        <section className="flex flex-col gap-4 px-6 border-b border-stone-200 dark:border-white/5 pb-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'free', label: 'Gratuitos' },
              { key: 'iniciante', label: 'Iniciante' },
              { key: 'intermediário', label: 'Intermediário' },
              { key: 'avançado', label: 'Avançado' },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap pb-1 transition-colors ${
                  activeFilter === filter.key
                    ? 'text-primary border-b border-primary'
                    : 'text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {/* E-books Section - Horizontal Scroll */}
        {ebooks.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-6">
              <h2 className="text-lg font-display text-stone-900 dark:text-white tracking-wide">E-books</h2>
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                {ebooks.length} {ebooks.length === 1 ? 'título' : 'títulos'}
              </span>
            </div>
            <div
              ref={ebooksScrollRef}
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {ebooks.map((ebook, index) => {
                const isPremiumLocked = ebook.is_premium && !ebook.access;

                return (
                  <article
                    key={ebook.id}
                    onClick={() => navigate(`/ebook/${ebook.id}`)}
                    className={`flex-shrink-0 snap-start cursor-pointer group w-[140px] ${index === 0 ? 'ml-[24px]' : ''}`}
                  >
                    <div className="flex flex-col">
                      <div className="relative w-[140px] h-[210px] overflow-hidden mb-3 shadow-lg">
                        {isPremiumLocked && (
                          <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] flex items-center justify-center flex-col gap-2">
                            <span className="material-symbols-outlined text-white text-[20px] font-light">lock</span>
                            <span className="text-[7px] font-bold text-white uppercase tracking-[0.15em] border border-white/30 px-1.5 py-0.5">Premium</span>
                          </div>
                        )}
                        <img
                          alt={ebook.title}
                          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPremiumLocked ? 'grayscale' : ''}`}
                          src={ebook.cover_url || ''}
                        />
                        {ebook.access && (
                          <div className="absolute top-2 left-2 bg-primary px-1.5 py-0.5">
                            <span className="text-[7px] font-bold text-black uppercase tracking-widest">Adquirido</span>
                          </div>
                        )}
                        {ebook.is_free && !ebook.access && (
                          <div className="absolute top-2 left-2 bg-green-500 px-1.5 py-0.5">
                            <span className="text-[7px] font-bold text-white uppercase tracking-widest">Grátis</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${isPremiumLocked ? 'text-stone-500' : 'text-primary'}`}>
                          {ebook.category}
                        </span>
                        <h3 className={`text-sm font-display mb-1 leading-tight line-clamp-2 transition-colors ${
                          isPremiumLocked
                            ? 'text-stone-500 dark:text-stone-400'
                            : 'text-stone-900 dark:text-white group-hover:text-primary'
                        }`}>
                          {ebook.title}
                        </h3>
                        <p className={`text-[10px] font-serif italic ${
                          isPremiumLocked ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'
                        }`}>
                          {ebook.author}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* In Progress Course */}
        {inProgressCourse && (
          <section className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display text-stone-900 dark:text-white tracking-wide">Em Andamento</h2>
            </div>
            <div
              onClick={() => navigate(`/course/${inProgressCourse.id}`)}
              className="group relative flex items-center gap-5 rounded-sm bg-white dark:bg-[#101010] p-4 shadow-sm border border-stone-200 dark:border-white/5 cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden">
                <img
                  alt="Course Thumbnail"
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  src={inProgressCourse.thumbnail_url || ''}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="material-symbols-outlined text-white text-[24px] drop-shadow-lg opacity-80">play_arrow</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{inProgressCourse.level}</span>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    {formatDuration(inProgressCourse.duration_minutes)}
                  </span>
                </div>
                <h3 className="text-lg font-display text-stone-900 dark:text-white leading-none mb-2">{inProgressCourse.title}</h3>
                <div className="flex items-center gap-3">
                  <div className="relative h-px w-full bg-stone-200 dark:bg-white/10">
                    <div
                      className="absolute left-0 top-0 h-px bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                      style={{ width: `${inProgressCourse.enrollment?.progress_percent || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-[9px] font-bold text-stone-400">{inProgressCourse.enrollment?.progress_percent || 0}%</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Course List */}
        <section className="flex flex-col gap-6 px-6 pb-20">
          <div className="flex items-center justify-between mt-2">
            <h2 className="text-lg font-display text-stone-900 dark:text-white tracking-wide">
              {searchTerm.trim()
                ? `Resultados para "${searchTerm}"`
                : activeFilter === 'all'
                  ? 'Todos os Cursos'
                  : 'Cursos Filtrados'}
            </h2>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'curso' : 'cursos'}
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">
                {searchTerm.trim() ? 'search_off' : 'school'}
              </span>
              <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">
                {searchTerm.trim()
                  ? `Nenhum curso encontrado para "${searchTerm}"`
                  : 'Nenhum curso encontrado'}
              </p>
              {searchTerm.trim() && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowSearch(false);
                  }}
                  className="mt-4 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                >
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-8">
              {filteredCourses.map((course) => {
                const isEnrolled = !!course.enrollment;
                const isPremiumLocked = course.is_premium && !isEnrolled;

                return (
                  <article
                    key={course.id}
                    className={`flex flex-col group cursor-pointer ${isPremiumLocked ? 'opacity-90 hover:opacity-100' : ''}`}
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <div className="relative h-56 w-full overflow-hidden mb-4">
                      {isPremiumLocked && (
                        <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] flex items-center justify-center flex-col gap-3 transition-opacity duration-300">
                          <span className="material-symbols-outlined text-white text-[28px] font-light">lock</span>
                          <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] border border-white/30 px-3 py-1">Premium</span>
                        </div>
                      )}
                      <img
                        alt={course.title}
                        className={`h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 ${isPremiumLocked ? 'grayscale' : ''}`}
                        src={course.thumbnail_url || ''}
                      />
                      {!isPremiumLocked && (
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                      )}
                      {course.rating && !isPremiumLocked && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 border border-white/10">
                          <span className="material-symbols-outlined text-[10px] text-primary">star</span>
                          <span className="text-[9px] font-bold text-white tracking-widest">{course.rating}</span>
                        </div>
                      )}
                      {isEnrolled && (
                        <div className="absolute top-4 left-4 bg-primary px-2 py-1">
                          <span className="text-[9px] font-bold text-black uppercase tracking-widest">Adquirido</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col px-1">
                      <span className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${isPremiumLocked ? 'text-stone-500' : 'text-primary'}`}>
                        {course.level}
                      </span>
                      <h3 className={`text-xl font-display mb-2 leading-tight transition-colors ${
                        isPremiumLocked
                          ? 'text-stone-500 dark:text-stone-400'
                          : 'text-stone-900 dark:text-white group-hover:text-primary'
                      }`}>
                        {course.title}
                      </h3>
                      <p className={`text-sm font-serif line-clamp-2 mb-4 leading-relaxed ${
                        isPremiumLocked ? 'text-stone-500' : 'text-stone-600 dark:text-stone-400'
                      }`}>
                        {course.description}
                      </p>
                      {isPremiumLocked ? (
                        <button className="w-full border border-stone-300 dark:border-white/20 hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-black py-3 text-[10px] font-bold uppercase tracking-widest transition-all">
                          Desbloquear Acesso
                        </button>
                      ) : (
                        <div className="flex items-center justify-between border-t border-stone-200 dark:border-white/10 pt-3">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                            {formatDuration(course.duration_minutes)}
                          </span>
                          <span className="text-sm font-bold text-stone-900 dark:text-white">
                            {formatPrice(course.price, course.is_free)}
                          </span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Courses;
