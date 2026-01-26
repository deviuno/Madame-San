import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type Course = Tables<'courses'>;
type CourseLesson = Tables<'course_lessons'>;
type Enrollment = Tables<'course_enrollments'>;
type LessonProgress = Tables<'lesson_progress'>;

interface LessonWithCourse extends CourseLesson {
  course?: Course;
}

const LessonPlayer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [lesson, setLesson] = useState<LessonWithCourse | null>(null);
  const [allLessons, setAllLessons] = useState<CourseLesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showLessonDrawer, setShowLessonDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'materials'>('about');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) {
      fetchLessonData();
    }
  }, [id, user]);

  const fetchLessonData = async () => {
    if (!id) return;

    try {
      // Fetch lesson with course data
      const { data: lessonData, error: lessonError } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('id', id)
        .single();

      if (lessonError) throw lessonError;

      // Fetch course data
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', lessonData.course_id)
        .single();

      setLesson({ ...lessonData, course: courseData || undefined });

      // Fetch all lessons for navigation
      const { data: allLessonsData } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', lessonData.course_id)
        .order('order_index', { ascending: true });

      setAllLessons(allLessonsData || []);

      // Check enrollment and progress
      if (user) {
        const { data: enrollmentData } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', lessonData.course_id)
          .single();

        setEnrollment(enrollmentData);

        if (enrollmentData) {
          // Fetch current lesson progress
          const { data: progressData } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', lessonData.course_id)
            .eq('lesson_id', lessonData.id)
            .single();

          setProgress(progressData);
          setIsCompleted(!!progressData?.completed_at);

          // Fetch all completed lessons for this course
          const { data: allProgressData } = await supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
            .eq('course_id', lessonData.course_id)
            .not('completed_at', 'is', null);

          if (allProgressData) {
            setCompletedLessons(new Set(allProgressData.map(p => p.lesson_id)));
          }

          // Set initial video position
          if (progressData?.watched_seconds && videoRef.current) {
            videoRef.current.currentTime = progressData.watched_seconds;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (position: number, completed: boolean = false) => {
    if (!user || !enrollment || !lesson) return;

    try {
      const progressData = {
        user_id: user.id,
        course_id: lesson.course_id,
        lesson_id: lesson.id,
        watched_seconds: Math.floor(position),
        completed_at: completed ? new Date().toISOString() : progress?.completed_at || null,
        is_completed: completed || progress?.is_completed || false,
      };

      if (progress) {
        await supabase
          .from('lesson_progress')
          .update({
            watched_seconds: progressData.watched_seconds,
            completed_at: progressData.completed_at,
            is_completed: progressData.is_completed,
          })
          .eq('id', progress.id);
      } else {
        const { data } = await supabase
          .from('lesson_progress')
          .insert(progressData)
          .select()
          .single();
        if (data) setProgress(data);
      }

      // Update enrollment progress
      if (completed && !isCompleted) {
        setIsCompleted(true);
        setCompletedLessons(prev => new Set([...prev, lesson.id]));
        await updateEnrollmentProgress();
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const updateEnrollmentProgress = async () => {
    if (!enrollment || !allLessons.length || !user || !lesson) return;

    try {
      const { count } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('course_id', lesson.course_id)
        .not('completed_at', 'is', null);

      const completedCount = (count || 0) + 1;
      const progressPercent = Math.round((completedCount / allLessons.length) * 100);

      const updateData: Partial<Enrollment> = {
        progress_percent: progressPercent,
      };

      if (progressPercent >= 100) {
        updateData.completed_at = new Date().toISOString();
      }

      await supabase
        .from('course_enrollments')
        .update(updateData)
        .eq('id', enrollment.id);
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    if (Math.floor(videoRef.current.currentTime) % 10 === 0) {
      saveProgress(videoRef.current.currentTime);
    }
  };

  const handleVideoEnd = () => {
    if (videoRef.current) {
      saveProgress(videoRef.current.duration, true);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    if (progress?.watched_seconds) {
      videoRef.current.currentTime = progress.watched_seconds;
    }
  };

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex(l => l.id === lesson?.id);
  };

  const navigateToLesson = (direction: 'prev' | 'next') => {
    const currentIndex = getCurrentLessonIndex();
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < allLessons.length) {
      const newLesson = allLessons[newIndex];
      const canAccess = !!enrollment || newLesson.is_preview;
      if (canAccess) {
        navigate(`/lesson/${newLesson.id}`);
      }
    }
  };

  const markAsComplete = async () => {
    if (videoRef.current) {
      await saveProgress(videoRef.current.currentTime, true);
    } else {
      await saveProgress(0, true);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500">Carregando aula...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background-dark">
        <span className="material-symbols-outlined text-[48px] text-stone-600">error</span>
        <p className="text-base text-stone-400">Aula no encontrada</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 px-6 py-2 bg-primary text-black text-sm font-medium rounded"
        >
          Ver Cursos
        </button>
      </div>
    );
  }

  const currentIndex = getCurrentLessonIndex();
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;
  const prevLesson = hasPrev ? allLessons[currentIndex - 1] : null;
  const nextLesson = hasNext ? allLessons[currentIndex + 1] : null;
  const canAccessPrev = prevLesson && (!!enrollment || prevLesson.is_preview);
  const canAccessNext = nextLesson && (!!enrollment || nextLesson.is_preview);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background-dark pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <button
          onClick={() => navigate(`/course/${lesson.course_id}`)}
          className="flex items-center gap-2 text-white"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          <span className="text-sm text-stone-300 truncate max-w-[200px]">
            {lesson.course?.title}
          </span>
        </button>
        <button
          onClick={() => setShowLessonDrawer(true)}
          className="p-2 text-stone-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
      </header>

      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black">
        {lesson.video_url ? (
          <video
            ref={videoRef}
            src={lesson.video_url}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
            onLoadedMetadata={handleLoadedMetadata}
            controls
            playsInline
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
            <div className="text-center">
              <span className="material-symbols-outlined text-[48px] text-stone-700 mb-2">play_circle</span>
              <p className="text-sm text-stone-600">Video no disponvel</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 py-4 border-b border-white/5">
        <button
          onClick={() => canAccessPrev && navigateToLesson('prev')}
          disabled={!canAccessPrev}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
            canAccessPrev
              ? 'border-white/20 text-white hover:border-white/40'
              : 'border-white/5 text-stone-700 cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        {!isCompleted && enrollment ? (
          <button
            onClick={markAsComplete}
            className="flex items-center gap-2 px-5 py-2 border border-primary/40 text-primary text-sm font-medium rounded-full hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            Concluir
          </button>
        ) : isCompleted ? (
          <div className="flex items-center gap-2 px-5 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium rounded-full">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Concluda
          </div>
        ) : null}

        <button
          onClick={() => canAccessNext && navigateToLesson('next')}
          disabled={!canAccessNext}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
            canAccessNext
              ? 'border-white/20 text-white hover:border-white/40'
              : 'border-white/5 text-stone-700 cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>

      {/* Lesson Info */}
      <div className="flex-1 px-4 py-5">
        {/* Course Tag */}
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 mb-3">
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
            {lesson.course?.title}
          </span>
        </div>

        {/* Lesson Title */}
        <h1 className="text-xl font-semibold text-white mb-5">
          {lesson.title}
        </h1>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-white/5 mb-4">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'about'
                ? 'text-primary'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            Sobre a Aula
            {activeTab === 'about' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'materials'
                ? 'text-primary'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            Materiais de Apoio
            {activeTab === 'materials' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' ? (
          <div className="text-sm text-stone-400 leading-relaxed">
            {lesson.description || 'Nenhuma descrio disponvel para esta aula.'}
          </div>
        ) : (
          <div className="text-sm text-stone-500">
            <p>Nenhum material de apoio disponvel.</p>
          </div>
        )}
      </div>

      {/* Lesson Drawer */}
      {showLessonDrawer && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setShowLessonDrawer(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#111] z-50 flex flex-col animate-slide-left">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-base font-medium text-white">Aulas do Curso</h2>
              <button
                onClick={() => setShowLessonDrawer(false)}
                className="p-1 text-stone-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-1">
                {allLessons.map((l, index) => {
                  const isCurrent = l.id === lesson.id;
                  const canAccess = !!enrollment || l.is_preview;
                  const isLessonCompleted = completedLessons.has(l.id);

                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        if (canAccess && !isCurrent) {
                          navigate(`/lesson/${l.id}`);
                          setShowLessonDrawer(false);
                        }
                      }}
                      disabled={!canAccess}
                      className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-primary/10'
                          : canAccess
                            ? 'hover:bg-white/5'
                            : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                        isLessonCompleted
                          ? 'bg-green-500/20 text-green-400'
                          : isCurrent
                            ? 'bg-primary text-black'
                            : 'bg-white/10 text-stone-400'
                      }`}>
                        {isLessonCompleted ? (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className={`text-sm flex-1 truncate ${
                        isCurrent ? 'text-primary font-medium' : 'text-stone-300'
                      }`}>
                        {l.title}
                      </span>
                      {!canAccess && (
                        <span className="material-symbols-outlined text-stone-600 text-[16px]">lock</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Footer */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span>Progresso</span>
                <span>{completedLessons.size} de {allLessons.length} aulas</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(completedLessons.size / allLessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LessonPlayer;
