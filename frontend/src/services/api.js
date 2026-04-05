import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (email, password, full_name) => {
    const response = await api.post('/auth/signup', { email, password, full_name });
    return response.data;
  },
  getCurrentUser: async (token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await api.get('/users/me', { headers });
    return response.data;
  },
  getCurrentUserWithToken: async (token) => {
    // Special method that takes token directly (for login flow)
    const response = await api.get('/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};

export const dashboardAPI = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
};

export const recordsAPI = {
  list: async (params = {}) => {
    const {
      skip = 0,
      limit = 10,
      type = '',
      category = '',
      start_date = '',
      end_date = '',
    } = params;
    const response = await api.get('/records', {
      params: {
        skip,
        limit,
        type: type || undefined,
        category: category || undefined,
        start_date: start_date || undefined,
        end_date: end_date || undefined,
      },
    });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/records', data);
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/records/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/records/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/records/${id}`);
  },
};

export const usersAPI = {
  list: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },
};

export const roleRequestsAPI = {
  requestRoleChange: async (requested_role, reason) => {
    const response = await api.post('/role-requests/request', {
      requested_role,
      reason,
    });
    return response.data;
  },
  getPendingRequests: async () => {
    const response = await api.get('/role-requests/pending');
    return response.data;
  },
  approveRequest: async (request_id, approved) => {
    const response = await api.post(`/role-requests/approve/${request_id}`, {
      approved,
    });
    return response.data;
  },
};

export default api;
