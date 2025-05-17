import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.apiBase,
  withCredentials: true,
});

export function setupInterceptors(onTokenRefresh) {
  const id = api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const { data } = await api.post('/api/token/refresh/');
          onTokenRefresh(data.access);
          original.headers['Authorization'] = `Bearer ${data.access}`;
          return api(original);
        } catch {
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    },
  );

  return () => api.interceptors.response.eject(id);
}

export default api;
