// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach the auth token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors (e.g., 401, 5xx)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Global 401 handler triggered');
      // Potential logic: redirect to login or clear expired token
    } else if (error.response?.status >= 500) {
      console.error('Server Error: Global 5xx handler triggered');
    }
    return Promise.reject(error);
  }
);

// Service Functions
export const productsService = {
  getProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
};

export const cartService = {
  getCartByUserId: (userId) => api.get(`/carts/user/${userId}`),
  addToCart: (cartData) => api.post('/carts', cartData),
  updateCart: (id, cartData) => api.put(`/carts/${id}`, cartData),
  deleteCart: (id) => api.delete(`/carts/${id}`),
};

export const userService = {
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  createUser: (userData) => api.post('/users', userData),
};

export default api;
