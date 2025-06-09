import {create} from 'zustand';
import {postsService} from '../services/postsService';

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  nome: string;
  created_at: string;
  materia?: string;
  likes?: number;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedSubject: string | null;
  fetchPosts: () => Promise<void>;
  searchPosts: (query: string) => Promise<void>;
  createPost: (postData: Omit<Post, 'id' | 'created_at' | 'author_id' | 'nome'>) => Promise<void>;
  updatePost: (id: number, postData: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedSubject: (subject: string | null) => void;
  clearError: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedSubject: null,

  fetchPosts: async () => {
    try {
      set({loading: true, error: null});
      const posts = await postsService.fetchPosts();
      set({posts, loading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar posts',
        loading: false,
      });
    }
  },

  searchPosts: async (query: string) => {
    try {
      set({loading: true, error: null, searchQuery: query});
      const posts = await postsService.searchPosts(query);
      set({posts, loading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao buscar posts',
        loading: false,
      });
    }
  },

  createPost: async (postData) => {
    try {
      set({loading: true, error: null});
      await postsService.createPost(postData);
      // Recarregar posts após criar
      await get().fetchPosts();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao criar post',
        loading: false,
      });
      throw error;
    }
  },

  updatePost: async (id: number, postData: Partial<Post>) => {
    try {
      set({loading: true, error: null});
      await postsService.updatePost(id, postData);
      // Recarregar posts após atualizar
      await get().fetchPosts();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao atualizar post',
        loading: false,
      });
      throw error;
    }
  },

  deletePost: async (id: number) => {
    try {
      set({loading: true, error: null});
      await postsService.deletePost(id);
      // Remover post da lista local
      const currentPosts = get().posts;
      set({posts: currentPosts.filter(post => post.id !== id), loading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao excluir post',
        loading: false,
      });
      throw error;
    }
  },

  setSearchQuery: (query: string) => {
    set({searchQuery: query});
  },

  setSelectedSubject: (subject: string | null) => {
    set({selectedSubject: subject});
  },

  clearError: () => {
    set({error: null});
  },
}));