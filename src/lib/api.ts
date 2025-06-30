import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can set up interceptors here to automatically handle
// adding auth tokens to every request, or for global error handling.
// For example:
/*
api.interceptors.request.use((config) => {
  // This is where you would get the token, e.g., from cookies or local storage
  const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});
*/

export default api;
