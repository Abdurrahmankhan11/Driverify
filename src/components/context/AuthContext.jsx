import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and check credentials from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccess = localStorage.getItem('accessToken');
      const storedRefresh = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (storedAccess && storedRefresh) {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            setUser(null);
          }
        }
        setIsAuthenticated(true);

        // Fetch fresh profile details to sync state
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (error) {
          console.error('Failed to load profile on mount, tokens might be expired/cleared:', error);
          // If profile fails, interceptor should handle logout if it was a 401 refresh failure
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (access, refresh, userData) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(userData));

    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
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
