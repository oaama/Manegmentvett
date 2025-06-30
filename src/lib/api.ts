import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
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
