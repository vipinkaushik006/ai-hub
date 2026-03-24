import axios from 'axios';

// ✅ Vite env prefix is VITE_ not REACT_APP_
// ✅ No silent fallback — misconfigured env should be visible immediately
const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) throw new Error('VITE_API_URL must be set in .env');

// ─────────────────────────────────────────────
// In-memory access token
// ✅ Never store access token in localStorage —
// any XSS can steal it. Memory is wiped on tab
// close, refresh token cookie handles re-auth.
// ─────────────────────────────────────────────
let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };
export const clearAccessToken = () => { accessToken = null; };
export const getAccessToken = () => accessToken;

// ─────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ Send httpOnly refresh token cookie on every request
  timeout: 10_000,       // ✅ Fail fast — don't hang forever on dead server
});

// ─────────────────────────────────────────────
// Request interceptor
// Attach in-memory access token if present
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// ─────────────────────────────────────────────
// Token refresh logic
// One shared promise so concurrent 401s only
// trigger a single /auth/refresh call
// ─────────────────────────────────────────────
let refreshPromise = null;

const tryRefreshToken = () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh') // cookie is sent automatically
      .then((res) => {
        setAccessToken(res.data.accessToken);
        return res.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null; // ✅ Reset so next expiry triggers a fresh attempt
      });
  }
  return refreshPromise;
};

// ─────────────────────────────────────────────
// Response interceptor
// On 401: attempt token refresh, retry original
// request once. On second 401: log out cleanly.
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    const is401 = err.response?.status === 401;
    const isRefreshEndpoint = original.url?.includes('/auth/refresh');
    const alreadyRetried = original._retry;

    // ✅ If refresh itself fails with 401 — session is dead, log out
    if (is401 && isRefreshEndpoint) {
      clearAccessToken();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      return Promise.reject(err);
    }

    // ✅ First 401 on a normal request — try to refresh and retry
    if (is401 && !alreadyRetried) {
      original._retry = true;

      try {
        const newToken = await tryRefreshToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // ✅ Retry original request with new token
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