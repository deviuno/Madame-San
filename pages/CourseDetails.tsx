import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type Course = Tables<'courses'>;
type CourseLesson = Tables<'course_lessons'>;
type Enrollment = Tables<'course_enrollments'>;
type LessonProgress = Tables<'lesson_progress'>;

// Extended course type with what_youll_learn (stored in description or separate)
interface ExtendedCourse extends Course {
  what_youll_learn?: string[] | null;
}

interface LessonWithProgress extends CourseLesson {
  progress?: LessonProgress | null;
}

const CourseDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState<ExtendedCourse | null>(null);
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<'sobre' | 'aulas'>('sobre');

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    if (!id) return;

    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData as ExtendedCourse);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      let lessonsWithProgress: LessonWithProgress[] = lessonsData || [];

      // If user is logged in, fetch enrollment and lesson progress
      if (user) {
        const { data: enrollmentData } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .single();

        setEnrollment(enrollmentData);

        if (enrollmentData) {
          // Fetch lesson progress (uses user_id and course_id directly)
          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', id);

          if (progressData) {
            lessonsWithProgress = lessonsData?.map(lesson => ({
              ...lesson,
              progress: progressData.find(p => p.lesson_id === lesson.id) || null
            })) || [];
          }
        }
      }

      setLessons(lessonsWithProgress);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!course) return;

    setEnrolling(true);
    try {
      // For free courses, enroll directly
      // For paid courses, this would integrate with a payment system
      if (course.is_free || course.price === 0) {
        const { data, error } = await supabase
          .from('course_enrollments')
          .insert({
            user_id: user.id,
            course_id: course.id,
            progress_percent: 0,
          })
          .select()
          .single();

        if (error) throw error;
        setEnrollment(data);
      } else {
        // For paid courses, show a message or redirect to payment
        // For now, we'll just show an alert
        alert('Funcionalidade de pagamento em desenvolvimento. Contate o suporte.');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Erro ao se inscrever. Tente novamente.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLesson = (lesson: LessonWithProgress) => {
    // Check if user can access this lesson
    const isOwned = !!enrollment;
    const isFreePreview = lesson.is_preview;

    if (isOwned || isFreePreview) {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const findNextLesson = (): LessonWithProgress | null => {
    // Find the first lesson that is not completed
    const incompleteLesson = lessons.find(
      lesson => !lesson.progress?.completed_at
    );
    return incompleteLesson || lessons[0] || null;
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price: number | null, isFree: boolean | null) => {
    if (isFree) return 'Gratuito';
    if (!price) return 'Gratuito';
    return `R$ ${price.toFixed(0)},00`;
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined text-[64px] text-stone-300 dark:text-stone-600">error</span>
        <p className="text-lg text-stone-500 dark:text-stone-400 font-serif">Curso não encontrado</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-6 py-3 bg-primary text-black text-sm font-bold uppercase tracking-widest rounded-sm"
        >
          Ver Todos os Cursos
        </button>
      </div>
    );
  }

  const isOwned = !!enrollment;
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter(l => l.progress?.completed_at).length;

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark pb-24">
      {/* Hero Image */}
      <div className="relative w-full h-80">
        <img
          src={course.thumbnail_url || ''}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-black/30"></div>

        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        {/* Rating Badge */}
        {course.rating && (
          <div className="absolute top-6 right-6 flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/20">
            <span className="material-symbols-outlined text-[14px] text-primary">star</span>
            <span className="text-xs font-bold text-white tracking-widest">{course.rating}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col px-6 -mt-10 relative z-10">
        <span className="inline-block px-3 py-1 mb-3 text-[9px] font-bold text-black uppercase tracking-[0.2em] bg-primary w-fit rounded-sm shadow-lg">
          {isOwned ? 'Adquirido' : (course.is_premium ? 'Premium' : course.level)}
        </span>
        <h1 className="text-3xl font-display text-stone-900 dark:text-white mb-2 leading-tight drop-shadow-sm">
          {course.title}
        </h1>
        <div className="flex items-center gap-4 text-stone-500 dark:text-stone-400 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span> {formatDuration(course.duration_minutes)}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">signal_cellular_alt</span> {course.level}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">play_lesson</span> {totalLessons} aulas
          </span>
        </div>

        {/* Progress Bar for enrolled users */}
        {isOwned && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Seu Progresso</span>
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                {completedLessons}/{totalLessons} aulas
              </span>
            </div>
            <div className="relative h-1.5 w-full bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${enrollment?.progress_percent || 0}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex w-full border-b border-stone-200 dark:border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('sobre')}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'sobre' ? 'text-primary border-b-2 border-primary' : 'text-stone-400'}`}
          >
            Sobre
          </button>
          <button
            onClick={() => setActiveTab('aulas')}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'aulas' ? 'text-primary border-b-2 border-primary' : 'text-stone-400'}`}
          >
            Aulas ({totalLessons})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'sobre' ? (
          <div className="flex flex-col gap-6 animate-fade">
            <p className="text-sm font-serif text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>

            {course.what_youll_learn && (
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white mb-2">O que você vai aprender</h3>
                {course.what_youll_learn.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
                    <p className="text-sm text-stone-600 dark:text-stone-400">{item}</p>
                  </div>
                ))}
              </div>
            )}

            {course.instructor_name && (
              <div className="flex items-center gap-4 mt-2 p-4 bg-stone-100 dark:bg-white/5 rounded-sm border border-stone-200 dark:border-white/5">
                <img
                  src={course.instructor_avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop'}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={course.instructor_name}
                />
                <div>
                  <p className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">Instrutor(a)</p>
                  <p className="text-sm font-serif italic text-stone-600 dark:text-stone-400">{course.instructor_name}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-fade">
            {lessons.map((lesson, index) => {
              const isCompleted = !!lesson.progress?.completed_at;
              const canAccess = isOwned || lesson.is_preview;
              const isLocked = !canAccess;

              return (
                <div
                  key={lesson.id}
                  onClick={() => canAccess && handleStartLesson(lesson)}
                  className={`flex items-center gap-4 p-4 rounded-sm border transition-all ${
                    canAccess
                      ? 'border-stone-200 dark:border-white/10 bg-white dark:bg-white/5 cursor-pointer hover:border-primary/30'
                      : 'border-transparent bg-stone-50 dark:bg-white/5 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-500 text-white border-green-500'
                      : canAccess
                        ? 'bg-primary text-black border-primary'
                        : 'border-stone-300 dark:border-white/20 text-stone-400'
                  }`}>
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-sm">check</span>
                    ) : canAccess ? (
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">lock</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-0.5 truncate">
                        {index + 1}. {lesson.title}
                      </h4>
                      {lesson.is_preview && !isOwned && (
                        <span className="text-[8px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-sm flex-shrink-0">
                          Grátis
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">{formatDuration(lesson.duration_minutes)}</p>
                  </div>
                  {canAccess && (
                    <span className="material-symbols-outlined text-stone-400 text-lg">chevron_right</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-stone-200 dark:border-white/10 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          {isOwned ? (
            <button
              onClick={() => {
                const nextLesson = findNextLesson();
                if (nextLesson) navigate(`/lesson/${nextLesson.id}`);
              }}
              className="w-full py-4 bg-primary text-black font-bold uppercase tracking-[0.2em] text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all rounded-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">play_circle</span>
              {completedLessons > 0 ? 'Continuar Curso' : 'Iniciar Curso'}
            </button>
          ) : (
            <>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Preço Total</span>
                <span className="text-xl font-display font-medium text-stone-900 dark:text-white">
                  {formatPrice(course.price, course.is_free)}
                </span>
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="flex-1 py-4 bg-stone-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center"
              >
                {enrolling ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent"></div>
                ) : (
                  course.is_free ? 'Começar Grátis' : 'Comprar Agora'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
