import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with baseURL
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is expired, clear localStorage and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User related API calls
export const userApi = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/profile'),
  getUserSubscription: () => api.get('/users/subscription')
};

// Menu related API calls
export const menuApi = {
  getTodaysMenu: () => api.get('/menu/today'),
  getMenuByDate: (date) => api.get(`/menu/date/${date}`),
  getMenusByDateRange: (startDate, endDate) => 
    api.get('/menu/range', { params: { startDate, endDate } }),
  createMenu: (menuData) => api.post('/menu', menuData),
  updateMenu: (menuId, menuData) => api.put(`/menu/${menuId}`, menuData),
  deleteMenu: (menuId) => api.delete(`/menu/${menuId}`)
};

// Subscription related API calls
export const subscriptionApi = {
  getAllSubscriptions: () => api.get('/subscriptions'),
  getSubscriptionById: (id) => api.get(`/subscriptions/${id}`),
  createSubscription: (subscriptionData) => api.post('/subscriptions', subscriptionData),
  updateSubscription: (id, subscriptionData) => api.put(`/subscriptions/${id}`, subscriptionData),
  cancelSubscription: (id) => api.delete(`/subscriptions/${id}`)
};

export default api; 