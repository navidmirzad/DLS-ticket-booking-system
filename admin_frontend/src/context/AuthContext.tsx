import { createContext, useContext, useState, ReactNode } from 'react';
import { validateToken } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const valid = await validateToken();
    setIsAuthenticated(valid);
    setLoading(false);
    return valid;
  };

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    return checkAuth();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Check authentication status on mount
  useState(() => {
    checkAuth();
  });

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 