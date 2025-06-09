import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../config/api';
import {Post} from '../stores/postsStore';

class PostsService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'accessToken': token || '',
    };
  }

  async fetchPosts(): Promise<Post[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar posts: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async fetchPost(id: number): Promise<Post> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async searchPosts(query: string): Promise<Post[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/posts/search/${encodeURIComponent(query)}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar posts: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'author_id' | 'nome'>): Promise<number> {
    try {
      const headers = await this.getAuthHeaders();
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...postData,
          author: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar post: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async deletePost(id: number): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir post: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }
}

export const postsService = new PostsService();