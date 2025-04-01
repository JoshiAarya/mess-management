import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/me', { withCredentials: true });
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      }, { withCredentials: true });
      
      const userData = response.data.user;
      
      // Store token in local storage if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Set default headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/users/admin/login', {
        email,
        password
      }, { withCredentials: true });
      
      const userData = response.data.user;
      
      // Store token in local storage if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Set default headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:5000/api/users/register', userData);
      
      const user = response.data.user;
      
      // Store token in local storage if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Set default headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/logout', {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    adminLogin,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};