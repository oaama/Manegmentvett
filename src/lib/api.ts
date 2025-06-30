import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mrvet-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// This interceptor runs only on the client-side
if (typeof window !== 'undefined') {
  api.interceptors.request.use(
    (config) => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

export default api;
