import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService} from '../services/authService';

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'professor' | 'aluno';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: 'professor' | 'aluno';
  confirmacao_senha: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      set({isLoading: true});
      const response = await authService.login(email, password);
      
      await AsyncStorage.setItem('token', response.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({isLoading: false});
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  register: async (userData: RegisterData) => {
    try {
      set({isLoading: true});
      await authService.register(userData);
      set({isLoading: false});
    } catch (error) {
      set({isLoading: false});
      throw error;
    }
  },

  loadStoredAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      
      if (token && userString) {
        const user = JSON.parse(userString);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
    }
  },

  setUser: (user: User) => {
    set({user});
  },
}));