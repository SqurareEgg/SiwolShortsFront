import { api } from './client';

export const authApi = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email); // OAuth2 spec uses 'username'
    formData.append('password', password);

    const response = await api.post('/auth/login', formData);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};