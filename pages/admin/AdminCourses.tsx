import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import type { Tables } from '../../types/database';

type Course = Tables<'courses'>;
type CourseLesson = Tables<'course_lessons'>;

// Course List Component
const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (course: Course) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !course.is_published })
        .eq('id', course.id);

      if (error) throw error;
      fetchCourses();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-stone-900 dark:text-white">Cursos</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Gerencie os cursos da plataforma
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/courses/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Novo Curso
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5">
          <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">school</span>
          <p className="text-stone-500 dark:text-stone-400">Nenhum curso cadastrado</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 dark:bg-white/5">
              <tr>
                <th className="text-left text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider p-4">Curso</th>
                <th className="text-left text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider p-4">Nível</th>
                <th className="text-left text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider p-4">Preço</th>
                <th className="text-left text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider p-4">Status</th>
                <th className="text-right text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider p-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-white/5">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-stone-50 dark:hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-white/10 overflow-hidden">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-stone-400">image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 dark:text-white">{course.title}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{course.instructor_name || 'Sem instrutor'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-stone-600 dark:text-stone-300">{course.level || '-'}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-stone-600 dark:text-stone-300">
                      {course.is_free ? 'Grátis' : `R$ ${course.price}`}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublish(course)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        course.is_published
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-400'
                      }`}
                    >
                      {course.is_published ? 'Publicado' : 'Rascunho'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/courses/${course.id}/lessons`)}
                        className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400"
                        title="Gerenciar Aulas"
                      >
                        <span className="material-symbols-outlined text-[18px]">video_library</span>
                      </button>
                      <button
                        onClick={() => navigate(`/admin/courses/${course.id}`)}
                        className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                        title="Excluir"
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

// Course Form Component
const CourseForm: React.FC<{ courseId?: string }> = ({ courseId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    level: 'Iniciante',
    price: 0,
    is_free: false,
    is_premium: false,
    is_published: false,
    instructor_name: '',
    instructor_title: '',
    thumbnail_url: '',
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    } else {
      setLoading(false);
    }
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId) return;
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (courseId) {
        const { error } = await supabase
          .from('courses')
          .update(course)
          .eq('id', courseId);
        if (error) throw error;
      } else {
        if (!course.title) throw new Error('Título é obrigatório');
        const { error } = await supabase
          .from('courses')
          .insert({
            title: course.title,
            description: course.description || null,
            level: course.level || 'Iniciante',
            price: course.price || 0,
            is_free: course.is_free || false,
            is_premium: course.is_premium || false,
            is_published: course.is_published || false,
            instructor_name: course.instructor_name || null,
            instructor_title: course.instructor_title || null,
            thumbnail_url: course.thumbnail_url || null,
            duration_minutes: course.duration_minutes || null,
          });
        if (error) throw error;
      }
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Erro ao salvar curso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/courses')}
          className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10"
        >
          <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">arrow_back</span>
        </button>
        <div>
          <h1 className="text-2xl font-display text-stone-900 dark:text-white">
            {courseId ? 'Editar Curso' : 'Novo Curso'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Título do Curso *
            </label>
            <input
              type="text"
              required
              value={course.title || ''}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: Introdução às Pérolas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Descrição
            </label>
            <textarea
              rows={4}
              value={course.description || ''}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Descreva o conteúdo do curso..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Nível
              </label>
              <select
                value={course.level || 'Iniciante'}
                onChange={(e) => setCourse({ ...course, level: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Preço (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={course.price || 0}
                onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Nome do Instrutor
              </label>
              <input
                type="text"
                value={course.instructor_name || ''}
                onChange={(e) => setCourse({ ...course, instructor_name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Madame San"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Título do Instrutor
              </label>
              <input
                type="text"
                value={course.instructor_title || ''}
                onChange={(e) => setCourse({ ...course, instructor_title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Gemóloga Especialista"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              URL da Thumbnail
            </label>
            <input
              type="url"
              value={course.thumbnail_url || ''}
              onChange={(e) => setCourse({ ...course, thumbnail_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={course.is_free || false}
                onChange={(e) => setCourse({ ...course, is_free: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">Curso Gratuito</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={course.is_premium || false}
                onChange={(e) => setCourse({ ...course, is_premium: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">Conteúdo Premium</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={course.is_published || false}
                onChange={(e) => setCourse({ ...course, is_published: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">Publicado</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-stone-200 dark:border-white/5">
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              className="px-6 py-3 border border-stone-300 dark:border-white/10 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-primary text-black font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
            >
              {saving ? 'Salvando...' : courseId ? 'Salvar Alterações' : 'Criar Curso'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Course Lessons Component
const CourseLessons: React.FC<{ courseId: string }> = ({ courseId }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<Partial<CourseLesson> | null>(null);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        supabase.from('courses').select('*').eq('id', courseId).single(),
        supabase.from('course_lessons').select('*').eq('course_id', courseId).order('order_index'),
      ]);

      if (courseRes.data) setCourse(courseRes.data);
      if (lessonsRes.data) setLessons(lessonsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLesson = async () => {
    if (!editingLesson || !editingLesson.title || !courseId) return;

    try {
      if (editingLesson.id) {
        await supabase.from('course_lessons').update(editingLesson).eq('id', editingLesson.id);
      } else {
        await supabase.from('course_lessons').insert({
          title: editingLesson.title,
          course_id: courseId,
          order_index: lessons.length,
          description: editingLesson.description || null,
          video_url: editingLesson.video_url || null,
          duration_minutes: editingLesson.duration_minutes || null,
          is_preview: editingLesson.is_preview || false,
        });
      }
      setEditingLesson(null);
      fetchData();
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return;

    try {
      await supabase.from('course_lessons').delete().eq('id', id);
      fetchData();
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/courses')}
          className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10"
        >
          <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display text-stone-900 dark:text-white">Aulas do Curso</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">{course?.title}</p>
        </div>
        <button
          onClick={() => setEditingLesson({ title: '', description: '', video_url: '', duration_minutes: 0, is_preview: false })}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nova Aula
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5">
          <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">video_library</span>
          <p className="text-stone-500 dark:text-stone-400">Nenhuma aula cadastrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-stone-900 dark:text-white">{lesson.title}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {lesson.duration_minutes} min {lesson.is_preview && '• Preview gratuito'}
                </p>
              </div>
              <button
                onClick={() => setEditingLesson(lesson)}
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button
                onClick={() => deleteLesson(lesson.id)}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111111] rounded-lg w-full max-w-lg p-6">
            <h2 className="text-lg font-display text-stone-900 dark:text-white mb-4">
              {editingLesson.id ? 'Editar Aula' : 'Nova Aula'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Título</label>
                <input
                  type="text"
                  value={editingLesson.title || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">URL do Vídeo</label>
                <input
                  type="url"
                  value={editingLesson.video_url || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, video_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Duração (minutos)</label>
                <input
                  type="number"
                  value={editingLesson.duration_minutes || 0}
                  onChange={(e) => setEditingLesson({ ...editingLesson, duration_minutes: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingLesson.is_preview || false}
                  onChange={(e) => setEditingLesson({ ...editingLesson, is_preview: e.target.checked })}
                  className="w-5 h-5 rounded border-stone-300 text-primary"
                />
                <span className="text-sm text-stone-700 dark:text-stone-300">Preview gratuito</span>
              </label>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setEditingLesson(null)}
                className="flex-1 px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={saveLesson}
                className="flex-1 px-4 py-2 bg-primary text-black font-bold rounded-lg"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component with Routes
const AdminCourses: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/new" element={<CourseForm />} />
        <Route path="/:id" element={<CourseFormWrapper />} />
        <Route path="/:id/lessons" element={<CourseLessonsWrapper />} />
      </Routes>
    </AdminLayout>
  );
};

// Wrapper components to extract params
const CourseFormWrapper: React.FC = () => {
  const courseId = window.location.hash.split('/admin/courses/')[1]?.split('/')[0];
  return <CourseForm courseId={courseId} />;
};

const CourseLessonsWrapper: React.FC = () => {
  const courseId = window.location.hash.split('/admin/courses/')[1]?.split('/')[0];
  return <CourseLessons courseId={courseId || ''} />;
};

export default AdminCourses;
