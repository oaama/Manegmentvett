import axios from 'axios';

// All client-side requests will now go to our Next.js API proxy
// which will then securely forward them to the backend with the auth token.
const api = axios.create({
  baseURL: '/api',
});

// We no longer need the client-side interceptor as the proxy handles authentication.
// This also solves the issue of not being able to read httpOnly cookies from the client.

export default api;
