import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api
        .get('/auth/me')
        .then(({ data }) => setUser(data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithToken = (token) => {
    localStorage.setItem('token', token);
    return api.get('/auth/me').then(({ data }) => {
      setUser(data);
      return data;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    api.post('/auth/logout').catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithToken,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
