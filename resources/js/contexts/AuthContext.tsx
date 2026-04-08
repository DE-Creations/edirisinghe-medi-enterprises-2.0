import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type UserRole = 'owner' | 'admin' | 'cashier';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  bootstrapped: boolean;
}

const AUTH_STORAGE_KEY = 'pharmapos-auth-user';
const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<string, { password: string; user: User }> = {
  owner: {
    password: '123456',
    user: { id: '1', username: 'owner', name: 'Dr. Sarah Chen', role: 'owner' },
  },
  admin: {
    password: '123456',
    user: { id: '2', username: 'admin', name: 'James Wilson', role: 'admin' },
  },
  cashier: {
    password: '123456',
    user: { id: '3', username: 'cashier', name: 'Emily Davis', role: 'cashier' },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setBootstrapped(true);
  }, []);

  const login = (username: string, password: string) => {
    const entry = mockUsers[username];
    if (entry && entry.password === password) {
      setUser(entry.user);
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, bootstrapped }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
