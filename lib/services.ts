import { getAccessToken } from "./auth";
import { jwtVerify } from 'jose'
// URL base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Interface para Post
export interface Post {
  id?: number;
  title: string;
  content: string;
  author_id?: number;
  created_at?: string;
  updated_at?: string;
  materia?: string;
}

// Interface para os parâmetros de busca
export interface ReadParams {
  id?: number;
  search?: string;
}

// Função para buscar todos os posts
export async function fetchPosts(params?: ReadParams): Promise<Post[]> {
  try {
    let url = `${API_BASE_URL}/posts`;
    
    // Adicionar parâmetros de busca se fornecidos
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.id) queryParams.append('id', params.id.toString());
      if (params.search) queryParams.append('search', params.search);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    const token = await getAccessToken()
    const response = await fetch(url, {
      headers: {
        'accessToken': token!
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar posts: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    throw error;
  }
}

// Função para buscar um post específico
export async function fetchPost(id: number): Promise<Post> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      headers: {
        'accessToken': token!
      }
    });
    console.log(token)
    if (!response.ok) {
      throw new Error(`Erro ao buscar post: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar post #${id}:`, error);
    throw error;
  }
}

// Função para criar um novo post
export async function createPost(postData: Post): Promise<number> {
  try {
    const token = await getAccessToken()
    const { payload } = await jwtVerify(token!, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!))
    const decoded = payload as { userId: number }
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accessToken': token!
      },
      body: JSON.stringify({...postData, author: decoded.userId})
    });
    if (!response.ok) {
      throw new Error(`Erro ao criar post: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw error;
  }
}

// Função para atualizar um post existente
export async function updatePost(id: number, postData: Partial<Post>): Promise<Post> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accessToken': token!
      },
      body: JSON.stringify(postData)
    });
    console.log(response)
    if (!response.ok) {
      throw new Error(`Erro ao atualizar post: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao atualizar post #${id}:`, error);
    throw error;
  }
}

// Função para excluir um post
export async function deletePost(id: number): Promise<Post> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'accessToken': token!
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao excluir post: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao excluir post #${id}:`, error);
    throw error;
  }
} 