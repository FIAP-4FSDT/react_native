import React, {createContext, useContext, useEffect} from 'react';
import {useAuthStore} from '../stores/authStore';

interface AuthContextType {
  // Contexto pode ser expandido conforme necessário
}

const AuthContext = createContext<AuthContextType>({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const {loadStoredAuth} = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};