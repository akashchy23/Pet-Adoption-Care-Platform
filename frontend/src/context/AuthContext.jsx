import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { MOCK_USERS } from '../data/mockData';
import { ROLE_REDIRECT_PATHS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('pethaven_jwt_token');
      const storedUser = localStorage.getItem('pethaven_user');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        setRole(parsedUser.role || 'Adopter');
      } else {
        setUser(null);
        setToken(null);
        setRole(null);
      }
    } catch (err) {
      console.error('Failed to parse auth token:', err);
      setUser(null);
      setToken(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      setToken(response.token);
      setRole(response.role);
      localStorage.setItem('pethaven_jwt_token', response.token);
      localStorage.setItem('pethaven_user', JSON.stringify(response.user));
      return { success: true, redirectPath: ROLE_REDIRECT_PATHS[response.role] || '/' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      setUser(response.user);
      setToken(response.token);
      setRole(response.role);
      localStorage.setItem('pethaven_jwt_token', response.token);
      localStorage.setItem('pethaven_user', JSON.stringify(response.user));
      return { success: true, redirectPath: ROLE_REDIRECT_PATHS[response.role] || '/' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('pethaven_jwt_token');
    localStorage.removeItem('pethaven_user');
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    if (updated.role) {
      setRole(updated.role);
    }
    localStorage.setItem('pethaven_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
