import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Validate current session / token on mount
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authAPI.getMe();
      if (res.data && res.data.data && res.data.data.user) {
        setUser(res.data.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      // 401 or invalid token - clean user state and token
      localStorage.removeItem('designspace_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for auth:expired event from Axios interceptor
    const handleAuthExpired = (event) => {
      localStorage.removeItem('designspace_token');
      setUser(null);
      showToast('Your session has expired. Please sign in again.', 'warning');
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [checkAuth, showToast]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const authenticatedUser = res.data.data.user;
      const token = res.data.data.token;
      if (token) {
        localStorage.setItem('designspace_token', token);
      }
      setUser(authenticatedUser);
      showToast(`Welcome back, ${authenticatedUser.name}!`, 'success');
      return { success: true, user: authenticatedUser };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      const newUser = res.data.data.user;
      const token = res.data.data.token;
      if (token) {
        localStorage.setItem('designspace_token', token);
      }
      setUser(newUser);
      showToast('Registration successful! Welcome to DesignSpace.', 'success');
      return { success: true, user: newUser };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('Logout API error:', error);
    } finally {
      localStorage.removeItem('designspace_token');
      setUser(null);
      showToast('You have been signed out.', 'info');
    }
  };

  // Update profile
  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    refreshUser: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
