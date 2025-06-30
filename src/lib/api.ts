import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mrvet-production.up.railway.app/api',
});

// Add a request interceptor to automatically attach the auth token to client-side requests
api.interceptors.request.use(
  (config) => {
    // Check if the code is running in a browser environment
    if (typeof window !== 'undefined') {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Could not get auth token from cookie", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;
