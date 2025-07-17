import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  loading: boolean;
  error: string | null;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
  loadStoredTheme: () => Promise<void>;
  clearError: () => void;
}

const THEME_STORAGE_KEY = 'app_theme';

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  loading: false,
  error: null,

  toggleTheme: async () => {
    try {
      set({loading: true, error: null});
      const currentTheme = get().theme;
      const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
      
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      set({theme: newTheme, loading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao alterar tema',
        loading: false,
      });
    }
  },

  setTheme: async (theme: Theme) => {
    try {
      set({loading: true, error: null});
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      set({theme, loading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao definir tema',
        loading: false,
      });
    }
  },

  loadStoredTheme: async () => {
    try {
      set({loading: true, error: null});
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        set({theme: storedTheme as Theme, loading: false});
      } else {
        // Default to light theme if no stored preference
        set({theme: 'light', loading: false});
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar tema',
        loading: false,
        theme: 'light', // Fallback to light theme
      });
    }
  },

  clearError: () => {
    set({error: null});
  },
}));