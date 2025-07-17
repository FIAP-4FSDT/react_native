import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../config/api';
import {AdminStats} from '../stores/adminStore';
import {Post} from '../stores/postsStore';

class AdminService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'accessToken': token || '',
    };
  }

  async fetchStats(): Promise<AdminStats> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar estatísticas: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async fetchAllPosts(): Promise<Post[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/posts`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar todos os posts: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async bulkDeletePosts(postIds: number[]): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/posts/bulk-delete`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({postIds}),
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir posts em lote: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async bulkDeleteUsers(userIds: number[], userType: 'professor' | 'aluno'): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/users/bulk-delete`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({userIds, userType}),
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir usuários em lote: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async exportData(type: 'posts' | 'users' | 'stats'): Promise<string> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/export/${type}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao exportar dados: ${response.status}`);
      }

      // Return the data as a JSON string for export
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async moderatePost(postId: number, action: 'approve' | 'reject', reason?: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/posts/${postId}/moderate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({action, reason}),
      });

      if (!response.ok) {
        throw new Error(`Erro ao moderar post: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async banUser(userId: number, reason: string, duration?: number): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
        method: 'POST',
        headers,
        body: JSON.stringify({reason, duration}),
      });

      if (!response.ok) {
        throw new Error(`Erro ao banir usuário: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }

  async unbanUser(userId: number): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Erro ao desbanir usuário: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão');
    }
  }
}

export const adminService = new AdminService();