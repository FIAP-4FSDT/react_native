import {create} from 'zustand';
import {commentsService} from '../services/commentsService';

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  created_at: string;
  author: {
    id: number;
    nome: string;
    email: string;
    avatar?: string;
  };
}

export interface CreateCommentData {
  content: string;
  post_id: number;
}

interface CommentsState {
  // Core data - organized by post ID
  commentsByPost: Record<number, Comment[]>;
  loading: boolean;
  error: string | null;
  
  // Loading states for specific posts
  loadingByPost: Record<number, boolean>;
  
  // Actions
  fetchComments: (postId: number) => Promise<void>;
  addComment: (postId: number, content: string) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
  
  // State management
  clearError: () => void;
  clearCommentsForPost: (postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[];
  isLoadingForPost: (postId: number) => boolean;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  // Core data
  commentsByPost: {},
  loading: false,
  error: null,
  loadingByPost: {},

  // Actions
  fetchComments: async (postId: number) => {
    try {
      set(state => ({
        loadingByPost: {...state.loadingByPost, [postId]: true},
        error: null,
      }));
      
      const comments = await commentsService.fetchComments(postId);
      
      set(state => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: comments,
        },
        loadingByPost: {...state.loadingByPost, [postId]: false},
      }));
    } catch (error) {
      set(state => ({
        error: error instanceof Error ? error.message : 'Erro ao carregar comentários',
        loadingByPost: {...state.loadingByPost, [postId]: false},
      }));
    }
  },

  addComment: async (postId: number, content: string) => {
    try {
      set({loading: true, error: null});
      
      const newComment = await commentsService.addComment(postId, content);
      
      set(state => {
        const currentComments = state.commentsByPost[postId] || [];
        return {
          commentsByPost: {
            ...state.commentsByPost,
            [postId]: [...currentComments, newComment],
          },
          loading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao adicionar comentário',
        loading: false,
      });
      throw error;
    }
  },

  deleteComment: async (postId: number, commentId: number) => {
    try {
      set({loading: true, error: null});
      
      await commentsService.deleteComment(commentId);
      
      set(state => {
        const currentComments = state.commentsByPost[postId] || [];
        return {
          commentsByPost: {
            ...state.commentsByPost,
            [postId]: currentComments.filter(comment => comment.id !== commentId),
          },
          loading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao excluir comentário',
        loading: false,
      });
      throw error;
    }
  },

  // State management
  clearError: () => {
    set({error: null});
  },

  clearCommentsForPost: (postId: number) => {
    set(state => {
      const newCommentsByPost = {...state.commentsByPost};
      delete newCommentsByPost[postId];
      
      const newLoadingByPost = {...state.loadingByPost};
      delete newLoadingByPost[postId];
      
      return {
        commentsByPost: newCommentsByPost,
        loadingByPost: newLoadingByPost,
      };
    });
  },

  getCommentsForPost: (postId: number) => {
    return get().commentsByPost[postId] || [];
  },

  isLoadingForPost: (postId: number) => {
    return get().loadingByPost[postId] || false;
  },
}));