import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api, { clearAuthStorage, setAccessToken, setAuthSessionHint } from '../services/api';
import { extractCpBalance } from '../../shared/utils/cpBalance';

interface User {
  uid: string;
  username: string;
  email: string;
  rank: string;
  cp: number;
  isAdmin: boolean;
  role: string;
  bootcampId: string;
  bootcampStatus: string;
}

export class MustChangePasswordError extends Error {
  passwordChangeToken: string;
  constructor(token: string) {
    super('Password change required');
    this.name = 'MustChangePasswordError';
    this.passwordChangeToken = token;
  }
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email?: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

interface BackendUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  hackerHandle?: string;
  cpPoints?: number;
  bootcampId?: string;
  bootcampStatus?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toFrontendUser = (backendUser: BackendUser): User => {
  const role = String(backendUser?.role || 'student');
  const cp = extractCpBalance(backendUser) ?? Number(backendUser?.cpPoints || 0);
  return {
    uid: String(backendUser?.id || ''),
    username: String(backendUser?.hackerHandle || 'OPERATOR'),
    email: String(backendUser?.email || ''),
    rank: role === 'admin' ? 'Administrator' : cp >= 1500 ? 'Vanguard' : cp >= 900 ? 'Architect' : cp >= 450 ? 'Specialist' : cp >= 150 ? 'Contributor' : 'Candidate',
    cp,
    isAdmin: role === 'admin',
    role,
    bootcampId: String(backendUser?.bootcampId || ''),
    bootcampStatus: String(backendUser?.bootcampStatus || 'not_enrolled'),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const bootstrapRanRef = useRef(false);

  const refreshMe = async () => {
    const meRes = await api.get('/auth/me');
    setAuthSessionHint(true);
    setUser(toFrontendUser(meRes.data || {}));
  };

  useEffect(() => {
    if (bootstrapRanRef.current) return;
    bootstrapRanRef.current = true;
    (async () => {
      try {
        await refreshMe();
      } catch {
        setUser(null);
        clearAuthStorage();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (credentials: { email?: string; password?: string }) => {
    const email = String(credentials?.email || '').trim();
    const password = String(credentials?.password || '');
    const res = await api.post('/auth/login', { email, password });

    // Backend signals that the password doesn't meet the new strength rules.
    // Throw a typed error so the caller (LoginPage) can redirect to the
    // change-password flow instead of treating this as a credential failure.
    if (res.data?.mustChangePassword && res.data?.passwordChangeToken) {
      throw new MustChangePasswordError(String(res.data.passwordChangeToken));
    }

    if (res.data?.token) setAccessToken(String(res.data.token));
    setAuthSessionHint(true);
    if (res.data?.user) {
      setUser(toFrontendUser(res.data.user));
      return;
    }
    await refreshMe();
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // ignore network/logout edge cases and clear local auth anyway
    } finally {
      clearAuthStorage();
      setUser(null);
    }
  };

  const value = useMemo(() => ({ user, loading, login, logout, refreshMe }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
