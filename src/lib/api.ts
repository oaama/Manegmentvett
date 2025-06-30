import axios from 'axios';

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn("***********************************************************************************");
  console.warn("WARNING: 'NEXT_PUBLIC_API_BASE_URL' is not set in your environment variables.");
  console.warn("The application will not be able to connect to the backend API.");
  console.warn("To fix this, open the '.env' file in the root of the project,");
  console.warn("uncomment the NEXT_PUBLIC_API_BASE_URL line, and set it to your API's URL.");
  console.warn("***********************************************************************************");
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up an interceptor to automatically add the auth token to every request.
api.interceptors.request.use((config) => {
  // We can't access cookies directly in a universal library file like this
  // in Next.js. Instead, we'll retrieve the token when making the actual call
  // in server actions or client components where context is available.
  // For client-side requests, you could read from document.cookie.
  if (typeof window !== 'undefined') {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default api;
