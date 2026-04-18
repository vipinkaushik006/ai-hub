import axios from 'axios';

// ✅ VITE syntax (not REACT_APP_ for Vite)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (!BASE_URL.includes('/api')) {
  console.warn('⚠️ API URL missing /api prefix - routes may 404');
}

// In-memory access token (correct ✅)
let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };
export const clearAccessToken = () => { accessToken = null; };
export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: BASE_URL,           // ✅ Now has /api
  withCredentials: true,       // ✅ Cookies for refresh token
  timeout: 10_000,
});

// Request interceptor ✅ (unchanged - perfect)
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`); // ✅ Debug
    return config;
  },
  (err) => Promise.reject(err)
);

// Refresh logic ✅ (unchanged - perfect)
let refreshPromise = null;
const tryRefreshToken = () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh')
      .then((res) => {
        setAccessToken(res.data.accessToken || res.data.token); // ✅ Handle both formats
        return res.data.accessToken || res.data.token;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

// Response interceptor ✅ (unchanged - perfect)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const is401 = err.response?.status === 401;
    const isRefreshEndpoint = original.url?.includes('/auth/refresh');
    const alreadyRetried = original._retry;

    if (is401 && isRefreshEndpoint) {
      clearAccessToken();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(err);
    }

    if (is401 && !alreadyRetried) {
      original._retry = true;
      try {
        const newToken = await tryRefreshToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        clearAccessToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default api;