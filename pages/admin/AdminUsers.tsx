import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import type { Tables } from '../../types/database';

type Profile = Tables<'profiles'>;
type Course = Tables<'courses'>;
type Ebook = Tables<'ebooks'>;

interface UserWithDetails extends Profile {
  enrollments_count?: number;
  ebook_access_count?: number;
}

interface NewUserData {
  email: string;
  password: string;
  fullName: string;
}

interface CreatedUserInfo {
  email: string;
  password: string;
  fullName: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'vip' | 'admin'>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
  const [userEbookAccess, setUserEbookAccess] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Create user states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState<NewUserData>({ email: '', password: '', fullName: '' });
  const [creating, setCreating] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreatedUserInfo | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profilesRes, coursesRes, ebooksRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('courses').select('*').order('order_index'),
        supabase.from('ebooks').select('*').order('order_index'),
      ]);

      // Get enrollment counts
      const enrollmentCounts = await supabase
        .from('course_enrollments')
        .select('user_id');

      // Get ebook access counts
      const ebookAccessCounts = await supabase
        .from('ebook_access')
        .select('user_id');

      const usersWithDetails = (profilesRes.data || []).map(profile => {
        const enrollments = enrollmentCounts.data?.filter(e => e.user_id === profile.id) || [];
        const ebookAccess = ebookAccessCounts.data?.filter(e => e.user_id === profile.id) || [];
        return {
          ...profile,
          enrollments_count: enrollments.length,
          ebook_access_count: ebookAccess.length,
        } as UserWithDetails;
      });

      setUsers(usersWithDetails);
      setCourses(coursesRes.data || []);
      setEbooks(ebooksRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert('E-mail e senha são obrigatórios');
      return;
    }

    if (newUser.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCreating(true);

    try {
      // Create user using custom database function (bypasses Auth API email validation)
      const { data, error } = await supabase.rpc('create_app_user', {
        p_email: newUser.email,
        p_password: newUser.password,
        p_full_name: newUser.fullName || undefined,
      });

      if (error) throw error;

      // Store created user info for WhatsApp message
      setCreatedUser({
        email: newUser.email,
        password: newUser.password,
        fullName: newUser.fullName || newUser.email.split('@')[0],
      });

      // Reset form and close create modal
      setNewUser({ email: '', password: '', fullName: '' });
      setShowCreateModal(false);

      // Refresh user list
      fetchData();
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.message?.includes('already exists')) {
        alert('Este e-mail já está cadastrado');
      } else if (error.message?.includes('Only admins')) {
        alert('Apenas administradores podem criar usuários');
      } else {
        alert('Erro ao criar usuário: ' + (error.message || 'Erro desconhecido'));
      }
    } finally {
      setCreating(false);
    }
  };

  const generateWhatsAppMessage = (user: CreatedUserInfo) => {
    const appUrl = window.location.origin;
    return `*Bem-vinda ao Madame San!*

Olá${user.fullName ? `, ${user.fullName}` : ''}!

Sua conta foi criada com sucesso. Aqui estão seus dados de acesso:

*E-mail:* ${user.email}
*Senha:* ${user.password}

*Acesse agora:* ${appUrl}

Após o primeiro acesso, recomendamos que você altere sua senha nas configurações do perfil.

Qualquer dúvida, estamos à disposição!

_Equipe Madame San_`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Mensagem copiada para a área de transferência!');
  };

  const openUserModal = async (user: UserWithDetails) => {
    setSelectedUser(user);

    // Fetch user enrollments
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('course_id')
      .eq('user_id', user.id);
    setUserEnrollments(enrollments?.map(e => e.course_id) || []);

    // Fetch user ebook access
    const { data: ebookAccess } = await supabase
      .from('ebook_access')
      .select('ebook_id')
      .eq('user_id', user.id);
    setUserEbookAccess(ebookAccess?.map(e => e.ebook_id) || []);
  };

  const toggleVIP = async (user: UserWithDetails) => {
    try {
      await supabase.from('profiles').update({ is_vip: !user.is_vip }).eq('id', user.id);
      fetchData();
    } catch (error) {
      console.error('Error toggling VIP:', error);
    }
  };

  const toggleAdmin = async (user: UserWithDetails) => {
    if (!confirm(user.is_admin ? 'Remover privilégios de administrador?' : 'Conceder privilégios de administrador?')) return;
    try {
      await supabase.from('profiles').update({ is_admin: !user.is_admin }).eq('id', user.id);
      fetchData();
    } catch (error) {
      console.error('Error toggling admin:', error);
    }
  };

  const toggleEnrollment = (courseId: string) => {
    if (userEnrollments.includes(courseId)) {
      setUserEnrollments(userEnrollments.filter(id => id !== courseId));
    } else {
      setUserEnrollments([...userEnrollments, courseId]);
    }
  };

  const toggleEbookAccess = (ebookId: string) => {
    if (userEbookAccess.includes(ebookId)) {
      setUserEbookAccess(userEbookAccess.filter(id => id !== ebookId));
    } else {
      setUserEbookAccess([...userEbookAccess, ebookId]);
    }
  };

  const saveUserAccess = async () => {
    if (!selectedUser) return;
    setSaving(true);

    try {
      // Get current enrollments
      const { data: currentEnrollments } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('user_id', selectedUser.id);
      const currentEnrollmentIds = currentEnrollments?.map(e => e.course_id) || [];

      // Add new enrollments
      const toAddEnrollments = userEnrollments.filter(id => !currentEnrollmentIds.includes(id));
      if (toAddEnrollments.length > 0) {
        await supabase.from('course_enrollments').insert(
          toAddEnrollments.map(courseId => ({ user_id: selectedUser.id, course_id: courseId }))
        );
      }

      // Remove enrollments
      const toRemoveEnrollments = currentEnrollmentIds.filter(id => !userEnrollments.includes(id));
      if (toRemoveEnrollments.length > 0) {
        for (const courseId of toRemoveEnrollments) {
          await supabase.from('course_enrollments').delete().eq('user_id', selectedUser.id).eq('course_id', courseId);
        }
      }

      // Get current ebook access
      const { data: currentEbookAccess } = await supabase
        .from('ebook_access')
        .select('ebook_id')
        .eq('user_id', selectedUser.id);
      const currentEbookAccessIds = currentEbookAccess?.map(e => e.ebook_id) || [];

      // Add new ebook access
      const toAddEbookAccess = userEbookAccess.filter(id => !currentEbookAccessIds.includes(id));
      if (toAddEbookAccess.length > 0) {
        await supabase.from('ebook_access').insert(
          toAddEbookAccess.map(ebookId => ({ user_id: selectedUser.id, ebook_id: ebookId }))
        );
      }

      // Remove ebook access
      const toRemoveEbookAccess = currentEbookAccessIds.filter(id => !userEbookAccess.includes(id));
      if (toRemoveEbookAccess.length > 0) {
        for (const ebookId of toRemoveEbookAccess) {
          await supabase.from('ebook_access').delete().eq('user_id', selectedUser.id).eq('ebook_id', ebookId);
        }
      }

      setSelectedUser(null);
      fetchData();
    } catch (error) {
      console.error('Error saving user access:', error);
      alert('Erro ao salvar acessos do usuário');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !search ||
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'vip' && user.is_vip) ||
      (filter === 'admin' && user.is_admin);

    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display text-stone-900 dark:text-white">Usuários</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">Gerencie usuários e seus acessos</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-lg hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Novo Usuário
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[20px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {(['all', 'vip', 'admin'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-black'
                    : 'bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-white/20'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'vip' ? 'VIP' : 'Admins'}
              </button>
            ))}
          </div>
          <span className="text-sm text-stone-500">{filteredUsers.length} usuários</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5">
            <span className="material-symbols-outlined text-[48px] text-stone-300 dark:text-stone-600 mb-4">group</span>
            <p className="text-stone-500 dark:text-stone-400">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111111] rounded-lg border border-stone-200 dark:border-white/5 overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50 dark:bg-white/5">
                <tr>
                  <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Usuário</th>
                  <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Cadastro</th>
                  <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Cursos</th>
                  <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">E-books</th>
                  <th className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Status</th>
                  <th className="text-right text-xs font-bold text-stone-500 uppercase tracking-wider p-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50 dark:hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {user.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-stone-900 dark:text-white">{user.full_name || 'Sem nome'}</p>
                          <p className="text-xs text-stone-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-stone-600 dark:text-stone-300">{formatDate(user.created_at)}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
                        {user.enrollments_count || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold">
                        {user.ebook_access_count || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {user.is_admin && (
                          <span className="px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold uppercase">
                            Admin
                          </span>
                        )}
                        {user.is_vip && (
                          <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold uppercase">
                            VIP
                          </span>
                        )}
                        {!user.is_admin && !user.is_vip && (
                          <span className="px-2 py-1 rounded bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-400 text-xs font-bold uppercase">
                            Normal
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVIP(user)}
                          className={`p-2 rounded-lg ${
                            user.is_vip
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                              : 'hover:bg-stone-100 dark:hover:bg-white/10 text-stone-400'
                          }`}
                          title={user.is_vip ? 'Remover VIP' : 'Conceder VIP'}
                        >
                          <span className="material-symbols-outlined text-[18px]">star</span>
                        </button>
                        <button
                          onClick={() => toggleAdmin(user)}
                          className={`p-2 rounded-lg ${
                            user.is_admin
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                              : 'hover:bg-stone-100 dark:hover:bg-white/10 text-stone-400'
                          }`}
                          title={user.is_admin ? 'Remover Admin' : 'Conceder Admin'}
                        >
                          <span className="material-symbols-outlined text-[18px]">shield_person</span>
                        </button>
                        <button
                          onClick={() => openUserModal(user)}
                          className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400"
                          title="Gerenciar acessos"
                        >
                          <span className="material-symbols-outlined text-[18px]">key</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#111111] rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display text-stone-900 dark:text-white">Novo Usuário</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-stone-500">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Senha *
                  </label>
                  <input
                    type="text"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <p className="text-xs text-stone-500 mt-1">A senha será visível na mensagem de convite</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Nome (opcional)
                  </label>
                  <input
                    type="text"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-900 dark:text-white"
                    placeholder="Nome do usuário"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg text-stone-700 dark:text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={createUser}
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-primary text-black font-bold rounded-lg disabled:opacity-50"
                >
                  {creating ? 'Criando...' : 'Criar Usuário'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Message Modal */}
        {createdUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#111111] rounded-lg w-full max-w-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-500 text-[24px]">check_circle</span>
                </div>
                <div>
                  <h2 className="text-lg font-display text-stone-900 dark:text-white">Usuário Criado!</h2>
                  <p className="text-sm text-stone-500">Copie a mensagem abaixo para enviar via WhatsApp</p>
                </div>
              </div>

              <div className="bg-stone-50 dark:bg-white/5 rounded-lg p-4 mb-4">
                <pre className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap font-sans">
                  {generateWhatsAppMessage(createdUser)}
                </pre>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCreatedUser(null)}
                  className="flex-1 px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg text-stone-700 dark:text-stone-300"
                >
                  Fechar
                </button>
                <button
                  onClick={() => copyToClipboard(generateWhatsAppMessage(createdUser))}
                  className="flex-1 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  Copiar Mensagem
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Access Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#111111] rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-stone-200 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      {selectedUser.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h2 className="text-lg font-display text-stone-900 dark:text-white">{selectedUser.full_name}</h2>
                      <p className="text-sm text-stone-500">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10"
                  >
                    <span className="material-symbols-outlined text-stone-500">close</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Course Access */}
                <div>
                  <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-3">
                    Acesso a Cursos
                  </h3>
                  <div className="space-y-2">
                    {courses.length === 0 ? (
                      <p className="text-sm text-stone-500">Nenhum curso cadastrado</p>
                    ) : (
                      courses.map((course) => (
                        <label
                          key={course.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={userEnrollments.includes(course.id)}
                            onChange={() => toggleEnrollment(course.id)}
                            className="w-5 h-5 rounded border-stone-300 text-primary"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-stone-900 dark:text-white">{course.title}</p>
                            <p className="text-xs text-stone-500">{course.level}</p>
                          </div>
                          {course.is_premium && (
                            <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold">
                              Premium
                            </span>
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Ebook Access */}
                <div>
                  <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-3">
                    Acesso a E-books
                  </h3>
                  <div className="space-y-2">
                    {ebooks.length === 0 ? (
                      <p className="text-sm text-stone-500">Nenhum e-book cadastrado</p>
                    ) : (
                      ebooks.map((ebook) => (
                        <label
                          key={ebook.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={userEbookAccess.includes(ebook.id)}
                            onChange={() => toggleEbookAccess(ebook.id)}
                            className="w-5 h-5 rounded border-stone-300 text-primary"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-stone-900 dark:text-white">{ebook.title}</p>
                            <p className="text-xs text-stone-500">{ebook.author}</p>
                          </div>
                          {ebook.is_premium && (
                            <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold">
                              Premium
                            </span>
                          )}
                          {ebook.is_free && (
                            <span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                              Grátis
                            </span>
                          )}
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-stone-200 dark:border-white/5 flex gap-4">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 px-4 py-2 border border-stone-300 dark:border-white/10 rounded-lg text-stone-700 dark:text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveUserAccess}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-primary text-black font-bold rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Acessos'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
