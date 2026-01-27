import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = 'slick-user';
const CREDENTIAL_KEY = 'slick-credentials';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(USER_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (typeof window === 'undefined') return false;
    const raw = window.localStorage.getItem(CREDENTIAL_KEY);
    if (!raw) return false;
    const creds = JSON.parse(raw) as { email: string; password: string; name: string };
    if (creds.email === email && creds.password === password) {
      const loggedUser: User = { email, name: creds.name };
      window.localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
      setUser(loggedUser);
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string) => {
    if (typeof window === 'undefined') return false;
    const creds = { name, email, password };
    window.localStorage.setItem(CREDENTIAL_KEY, JSON.stringify(creds));
    const newUser: User = { name, email };
    window.localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

