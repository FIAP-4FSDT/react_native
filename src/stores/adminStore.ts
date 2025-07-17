import {create} from 'zustand';
import {adminService} from '../services/adminService';
import {Post} from './postsStore';
import {User} from './usersStore';

export interface AdminStats {
  totalPosts: number;
  totalTeachers: number;
  totalStudents: number;
  recentActivity: number;
  postsThisMonth: number;
  usersThisMonth: number;
  mostActiveUsers: User[];
  popularSubjects: Array<{subject: string; count: number}>;
}

interface AdminState {
  // Core data
  stats: AdminStats | null;
  allPosts: Post[];
  loading: boolean;
  error: string | null;
  
  // Loading states for specific operations
  statsLoading: boolean;
  postsLoading: boolean;
  bulkOperationLoading: boolean;
  
  // Actions
  fetchStats: () => Promise<void>;
  fetchAllPosts: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Bulk operations
  bulkDeletePosts: (postIds: number[]) => Promise<void>;
  bulkDeleteUsers: (userIds: number[], userType: 'professor' | 'aluno') => Promise<void>;
  
  // Data export
  exportData: (type: 'posts' | 'users' | 'stats') => Promise<string>;
  
  // State management
  clearError: () => void;
  getPostById: (id: number) => Post | undefined;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Core data
  stats: null,
  allPosts: [],
  loading: false,
  error: null,
  
  // Loading states
  statsLoading: false,
  postsLoading: false,
  bulkOperationLoading: false,

  // Actions
  fetchStats: async () => {
    try {
      set({statsLoading: true, error: null});
      
      const stats = await adminService.fetchStats();
      
      set({
        stats,
        statsLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas',
        statsLoading: false,
      });
    }
  },

  fetchAllPosts: async () => {
    try {
      set({postsLoading: true, error: null});
      
      const posts = await adminService.fetchAllPosts();
      
      set({
        allPosts: posts,
        postsLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar todos os posts',
        postsLoading: false,
      });
    }
  },

  refreshData: async () => {
    try {
      set({loading: true, error: null});
      
      // Fetch both stats and posts in parallel
      await Promise.all([
        get().fetchStats(),
        get().fetchAllPosts(),
      ]);
      
      set({loading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao atualizar dados administrativos',
        loading: false,
      });
    }
  },

  // Bulk operations
  bulkDeletePosts: async (postIds: number[]) => {
    try {
      set({bulkOperationLoading: true, error: null});
      
      await adminService.bulkDeletePosts(postIds);
      
      // Remove deleted posts from local state
      const currentPosts = get().allPosts;
      const updatedPosts = currentPosts.filter(post => !postIds.includes(post.id));
      
      set({
        allPosts: updatedPosts,
        bulkOperationLoading: false,
      });
      
      // Refresh stats to reflect changes
      await get().fetchStats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao excluir posts em lote',
        bulkOperationLoading: false,
      });
      throw error;
    }
  },

  bulkDeleteUsers: async (userIds: number[], userType: 'professor' | 'aluno') => {
    try {
      set({bulkOperationLoading: true, error: null});
      
      await adminService.bulkDeleteUsers(userIds, userType);
      
      set({bulkOperationLoading: false});
      
      // Refresh stats to reflect changes
      await get().fetchStats();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao excluir usuários em lote',
        bulkOperationLoading: false,
      });
      throw error;
    }
  },

  // Data export
  exportData: async (type: 'posts' | 'users' | 'stats') => {
    try {
      set({loading: true, error: null});
      
      const exportedData = await adminService.exportData(type);
      
      set({loading: false});
      
      return exportedData;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao exportar dados',
        loading: false,
      });
      throw error;
    }
  },

  // State management
  clearError: () => {
    set({error: null});
  },

  getPostById: (id: number) => {
    return get().allPosts.find(post => post.id === id);
  },
}));