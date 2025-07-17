import {create} from 'zustand';
import {postsService} from '../services/postsService';

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  nome: string;
  created_at: string;
  updated_at?: string;
  materia?: string;
  likes: number;
  comments_count: number;
  is_liked_by_user: boolean;
  author: {
    id: number;
    nome: string;
    email: string;
    tipo_usuario: 'professor' | 'aluno';
    avatar?: string;
  };
}

export interface CreatePostData {
  title: string;
  content: string;
  materia?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  materia?: string;
}

interface PostsState {
  // Core data
  posts: Post[];
  filteredPosts: Post[];
  loading: boolean;
  error: string | null;
  
  // Search and filtering
  searchQuery: string;
  selectedSubjects: string[];
  availableSubjects: string[];
  
  // Pagination
  hasMore: boolean;
  page: number;
  limit: number;
  
  // Actions
  fetchPosts: (page?: number, limit?: number) => Promise<void>;
  searchPosts: (query: string) => Promise<void>;
  filterBySubjects: (subjects: string[]) => void;
  applyFilters: () => void;
  loadMorePosts: () => Promise<void>;
  refreshPosts: () => Promise<void>;
  
  // CRUD operations
  createPost: (postData: CreatePostData) => Promise<void>;
  updatePost: (id: number, postData: UpdatePostData) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  
  // Like functionality
  likePost: (postId: number) => Promise<void>;
  unlikePost: (postId: number) => Promise<void>;
  
  // State management
  setSearchQuery: (query: string) => void;
  setSelectedSubjects: (subjects: string[]) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  // Core data
  posts: [],
  filteredPosts: [],
  loading: false,
  error: null,
  
  // Search and filtering
  searchQuery: '',
  selectedSubjects: [],
  availableSubjects: [],
  
  // Pagination
  hasMore: true,
  page: 1,
  limit: 10,

  // Actions
  fetchPosts: async (page = 1, limit = 10) => {
    try {
      set({loading: true, error: null});
      const posts = await postsService.fetchPosts(page, limit);
      
      // Extract unique subjects
      const subjects = [...new Set(posts.map(post => post.materia).filter(Boolean))];
      
      if (page === 1) {
        set({
          posts,
          filteredPosts: posts,
          availableSubjects: subjects,
          page: 1,
          hasMore: posts.length === limit,
          loading: false,
        });
      } else {
        const currentPosts = get().posts;
        const newPosts = [...currentPosts, ...posts];
        set({
          posts: newPosts,
          filteredPosts: newPosts,
          availableSubjects: [...new Set([...get().availableSubjects, ...subjects])],
          page,
          hasMore: posts.length === limit,
          loading: false,
        });
      }
      
      // Apply current filters
      get().applyFilters();
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
      
      if (query.trim() === '') {
        // If empty query, show all posts
        set({filteredPosts: get().posts, loading: false});
        get().applyFilters();
        return;
      }
      
      const posts = await postsService.searchPosts(query);
      set({
        posts,
        filteredPosts: posts,
        page: 1,
        hasMore: false, // Search results don't support pagination
        loading: false,
      });
      
      // Apply subject filters to search results
      get().applyFilters();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao buscar posts',
        loading: false,
      });
    }
  },

  filterBySubjects: (subjects: string[]) => {
    set({selectedSubjects: subjects});
    get().applyFilters();
  },

  applyFilters: () => {
    const {posts, selectedSubjects} = get();
    
    if (selectedSubjects.length === 0) {
      set({filteredPosts: posts});
      return;
    }
    
    const filtered = posts.filter(post => 
      post.materia && selectedSubjects.includes(post.materia)
    );
    
    set({filteredPosts: filtered});
  },

  loadMorePosts: async () => {
    const {hasMore, loading, page, limit} = get();
    
    if (!hasMore || loading) return;
    
    await get().fetchPosts(page + 1, limit);
  },

  refreshPosts: async () => {
    set({page: 1, hasMore: true});
    await get().fetchPosts(1, get().limit);
  },

  // CRUD operations
  createPost: async (postData: CreatePostData) => {
    try {
      set({loading: true, error: null});
      await postsService.createPost(postData);
      // Refresh posts after creating
      await get().refreshPosts();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao criar post',
        loading: false,
      });
      throw error;
    }
  },

  updatePost: async (id: number, postData: UpdatePostData) => {
    try {
      set({loading: true, error: null});
      await postsService.updatePost(id, postData);
      
      // Update post in local state
      const currentPosts = get().posts;
      const updatedPosts = currentPosts.map(post => 
        post.id === id ? {...post, ...postData} : post
      );
      
      set({posts: updatedPosts, loading: false});
      get().applyFilters();
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
      
      // Remove post from local state
      const currentPosts = get().posts;
      const updatedPosts = currentPosts.filter(post => post.id !== id);
      
      set({posts: updatedPosts, loading: false});
      get().applyFilters();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao excluir post',
        loading: false,
      });
      throw error;
    }
  },

  // Like functionality
  likePost: async (postId: number) => {
    try {
      // Optimistic update
      const currentPosts = get().posts;
      const optimisticPosts = currentPosts.map(post => 
        post.id === postId 
          ? {...post, is_liked_by_user: true, likes: post.likes + 1}
          : post
      );
      set({posts: optimisticPosts});
      get().applyFilters();
      
      await postsService.likePost(postId);
    } catch (error) {
      // Revert optimistic update on error
      const currentPosts = get().posts;
      const revertedPosts = currentPosts.map(post => 
        post.id === postId 
          ? {...post, is_liked_by_user: false, likes: Math.max(0, post.likes - 1)}
          : post
      );
      set({
        posts: revertedPosts,
        error: error instanceof Error ? error.message : 'Erro ao curtir post',
      });
      get().applyFilters();
      throw error;
    }
  },

  unlikePost: async (postId: number) => {
    try {
      // Optimistic update
      const currentPosts = get().posts;
      const optimisticPosts = currentPosts.map(post => 
        post.id === postId 
          ? {...post, is_liked_by_user: false, likes: Math.max(0, post.likes - 1)}
          : post
      );
      set({posts: optimisticPosts});
      get().applyFilters();
      
      await postsService.unlikePost(postId);
    } catch (error) {
      // Revert optimistic update on error
      const currentPosts = get().posts;
      const revertedPosts = currentPosts.map(post => 
        post.id === postId 
          ? {...post, is_liked_by_user: true, likes: post.likes + 1}
          : post
      );
      set({
        posts: revertedPosts,
        error: error instanceof Error ? error.message : 'Erro ao descurtir post',
      });
      get().applyFilters();
      throw error;
    }
  },

  // State management
  setSearchQuery: (query: string) => {
    set({searchQuery: query});
  },

  setSelectedSubjects: (subjects: string[]) => {
    set({selectedSubjects: subjects});
    get().applyFilters();
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      selectedSubjects: [],
      filteredPosts: get().posts,
    });
  },

  clearError: () => {
    set({error: null});
  },
}));