import {create} from 'zustand';
import {usersService} from '../services/usersService';

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'professor' | 'aluno';
  avatar?: string;
  created_at: string;
  posts_count?: number;
  likes_count?: number;
}

export interface CreateUserData {
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: 'professor' | 'aluno';
  confirmacao_senha: string;
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  senha?: string;
  confirmacao_senha?: string;
}

interface UsersState {
  // Core data
  teachers: User[];
  students: User[];
  loading: boolean;
  error: string | null;
  
  // Pagination
  teachersPage: number;
  studentsPage: number;
  teachersHasMore: boolean;
  studentsHasMore: boolean;
  limit: number;
  
  // Search
  teachersSearchQuery: string;
  studentsSearchQuery: string;
  
  // Actions
  fetchTeachers: (page?: number, limit?: number) => Promise<void>;
  fetchStudents: (page?: number, limit?: number) => Promise<void>;
  loadMoreTeachers: () => Promise<void>;
  loadMoreStudents: () => Promise<void>;
  refreshTeachers: () => Promise<void>;
  refreshStudents: () => Promise<void>;
  
  // CRUD operations
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (id: number, userData: UpdateUserData) => Promise<void>;
  deleteUser: (id: number, userType: 'professor' | 'aluno') => Promise<void>;
  
  // Search
  searchTeachers: (query: string) => Promise<void>;
  searchStudents: (query: string) => Promise<void>;
  
  // State management
  setTeachersSearchQuery: (query: string) => void;
  setStudentsSearchQuery: (query: string) => void;
  clearError: () => void;
  getUserById: (id: number) => User | undefined;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  // Core data
  teachers: [],
  students: [],
  loading: false,
  error: null,
  
  // Pagination
  teachersPage: 1,
  studentsPage: 1,
  teachersHasMore: true,
  studentsHasMore: true,
  limit: 10,
  
  // Search
  teachersSearchQuery: '',
  studentsSearchQuery: '',

  // Actions
  fetchTeachers: async (page = 1, limit = 10) => {
    try {
      set({loading: true, error: null});
      
      const response = await usersService.fetchTeachers(page, limit);
      
      if (page === 1) {
        set({
          teachers: response.users,
          teachersPage: 1,
          teachersHasMore: response.hasMore,
          loading: false,
        });
      } else {
        const currentTeachers = get().teachers;
        set({
          teachers: [...currentTeachers, ...response.users],
          teachersPage: page,
          teachersHasMore: response.hasMore,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar professores',
        loading: false,
      });
    }
  },

  fetchStudents: async (page = 1, limit = 10) => {
    try {
      set({loading: true, error: null});
      
      const response = await usersService.fetchStudents(page, limit);
      
      if (page === 1) {
        set({
          students: response.users,
          studentsPage: 1,
          studentsHasMore: response.hasMore,
          loading: false,
        });
      } else {
        const currentStudents = get().students;
        set({
          students: [...currentStudents, ...response.users],
          studentsPage: page,
          studentsHasMore: response.hasMore,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar alunos',
        loading: false,
      });
    }
  },

  loadMoreTeachers: async () => {
    const {teachersHasMore, loading, teachersPage, limit} = get();
    
    if (!teachersHasMore || loading) return;
    
    await get().fetchTeachers(teachersPage + 1, limit);
  },

  loadMoreStudents: async () => {
    const {studentsHasMore, loading, studentsPage, limit} = get();
    
    if (!studentsHasMore || loading) return;
    
    await get().fetchStudents(studentsPage + 1, limit);
  },

  refreshTeachers: async () => {
    set({teachersPage: 1, teachersHasMore: true});
    await get().fetchTeachers(1, get().limit);
  },

  refreshStudents: async () => {
    set({studentsPage: 1, studentsHasMore: true});
    await get().fetchStudents(1, get().limit);
  },

  // CRUD operations
  createUser: async (userData: CreateUserData) => {
    try {
      set({loading: true, error: null});
      
      const newUser = await usersService.createUser(userData);
      
      // Add to appropriate list
      if (userData.tipo_usuario === 'professor') {
        const currentTeachers = get().teachers;
        set({teachers: [newUser, ...currentTeachers], loading: false});
      } else {
        const currentStudents = get().students;
        set({students: [newUser, ...currentStudents], loading: false});
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao criar usuário',
        loading: false,
      });
      throw error;
    }
  },

  updateUser: async (id: number, userData: UpdateUserData) => {
    try {
      set({loading: true, error: null});
      
      const updatedUser = await usersService.updateUser(id, userData);
      
      // Update in appropriate list
      const currentTeachers = get().teachers;
      const currentStudents = get().students;
      
      const teacherIndex = currentTeachers.findIndex(user => user.id === id);
      const studentIndex = currentStudents.findIndex(user => user.id === id);
      
      if (teacherIndex !== -1) {
        const updatedTeachers = [...currentTeachers];
        updatedTeachers[teacherIndex] = updatedUser;
        set({teachers: updatedTeachers, loading: false});
      } else if (studentIndex !== -1) {
        const updatedStudents = [...currentStudents];
        updatedStudents[studentIndex] = updatedUser;
        set({students: updatedStudents, loading: false});
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao atualizar usuário',
        loading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id: number, userType: 'professor' | 'aluno') => {
    try {
      set({loading: true, error: null});
      
      await usersService.deleteUser(id);
      
      // Remove from appropriate list
      if (userType === 'professor') {
        const currentTeachers = get().teachers;
        set({teachers: currentTeachers.filter(user => user.id !== id), loading: false});
      } else {
        const currentStudents = get().students;
        set({students: currentStudents.filter(user => user.id !== id), loading: false});
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao excluir usuário',
        loading: false,
      });
      throw error;
    }
  },

  // Search
  searchTeachers: async (query: string) => {
    try {
      set({loading: true, error: null, teachersSearchQuery: query});
      
      if (query.trim() === '') {
        // If empty query, refresh teachers list
        await get().refreshTeachers();
        return;
      }
      
      const teachers = await usersService.searchUsers(query, 'professor');
      set({
        teachers,
        teachersPage: 1,
        teachersHasMore: false, // Search results don't support pagination
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao buscar professores',
        loading: false,
      });
    }
  },

  searchStudents: async (query: string) => {
    try {
      set({loading: true, error: null, studentsSearchQuery: query});
      
      if (query.trim() === '') {
        // If empty query, refresh students list
        await get().refreshStudents();
        return;
      }
      
      const students = await usersService.searchUsers(query, 'aluno');
      set({
        students,
        studentsPage: 1,
        studentsHasMore: false, // Search results don't support pagination
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao buscar alunos',
        loading: false,
      });
    }
  },

  // State management
  setTeachersSearchQuery: (query: string) => {
    set({teachersSearchQuery: query});
  },

  setStudentsSearchQuery: (query: string) => {
    set({studentsSearchQuery: query});
  },

  clearError: () => {
    set({error: null});
  },

  getUserById: (id: number) => {
    const {teachers, students} = get();
    return [...teachers, ...students].find(user => user.id === id);
  },
}));