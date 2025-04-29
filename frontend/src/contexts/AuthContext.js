import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_URLS, API_CONFIG } from '../config/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica autenticação ao carregar o app
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(API_URLS.auth.status, {
          ...API_CONFIG,
          method: 'GET'
        });
        const data = await response.json();
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(`${API_URLS.auth.base}/logout`, {
        ...API_CONFIG,
        method: 'GET'
      });
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const loginWithSocial = (provider) => {
    window.location.href = API_URLS.auth[provider];
  };

  const handleSocialCallback = async (provider, code) => {
    try {
      const response = await fetch(`${API_URLS.base}/api/auth/${provider}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao processar autenticação social');
      }

      const data = await response.json();
      
      if (data.requiresRegistration) {
        return { requiresRegistration: true, userData: data.userData };
      }

      login(data.user);
      return { requiresRegistration: false };
    } catch (error) {
      console.error('Erro ao processar callback social:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading,
      login, 
      logout,
      loginWithSocial,
      handleSocialCallback
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 