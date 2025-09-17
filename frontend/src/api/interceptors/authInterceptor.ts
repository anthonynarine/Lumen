/**
 * 🔐 authInterceptor
 * ------------------
 * Installs an Axios interceptor on the given Lumen API client (examApi).
 *
 * ✅ Responsibilities
 * - Attach `Authorization: Bearer <token>` in DEV (from localStorage).
 * - In PROD, skip Authorization → rely on HttpOnly cookies.
 * - Handle 401 Unauthorized:
 *   • Attempt single refresh via Auth API (`refreshAccessToken`).
 *   • Queue concurrent requests while refresh is in progress.
 *   • Retry original + queued requests if refresh succeeds.
 *   • Clear tokens + logout if refresh fails.
 *
 * 🔒 Safety
 * - Skips refresh logic for auth endpoints (/login, /token-refresh/, /logout, /whoami).
 * - Optional `onLogout` callback for centralizing logout handling.
 */

import type {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { getToken, setToken, clearTokens } from "../../auth/utils/storage";
import { refreshAccessToken } from "../authApi";
import { logger } from "../../utils/logger";

// ─────────────────────────────────────────────
// Types & internal state
// ─────────────────────────────────────────────
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
interface RefreshResponse {
  access?: string;
  access_token?: string; // some backends use this key
  refresh?: string;
}

let isRefreshing = false;
let queue: Array<{ resolve: () => void; reject: (err: unknown) => void }> = [];

/** Guard: return true if a URL is an auth endpoint → skip refresh. */
const isAuthUrl = (url?: string) =>
  !!url &&
  (url.includes("/login") ||
    url.includes("/token-refresh/") ||
    url.includes("/logout") ||
    url.includes("/whoami"));

/**
 * Apply authInterceptor to the given Axios instance.
 *
 * @param api  The Lumen client (e.g. examApi)
 * @param opts Optional hooks (e.g. onLogout)
 */
export function authInterceptor(api: AxiosInstance, opts?: { onLogout?: () => void }) {
  const isProd = import.meta.env.PROD;

  // ─────────────────────────────────────────────
  // REQUEST: attach Authorization in DEV
  // ─────────────────────────────────────────────
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!isProd) {
      const token = getToken("access_token");
      if (token) {
        const headers = (config.headers ?? {}) as AxiosRequestHeaders;
        headers.Authorization = `Bearer ${token}`;
        config.headers = headers;
      }
    }
    config.withCredentials = true; // always send cookies
    return config;
  });

  // ─────────────────────────────────────────────
  // RESPONSE: capture rotated tokens, handle 401
  // ─────────────────────────────────────────────
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // Capture rotated tokens in DEV (if server returns them on success)
      if (!isProd) {
        const { access, access_token, refresh } = (response.data ?? {}) as Partial<RefreshResponse>;
        const rotatedAccess = access || access_token;
        if (rotatedAccess) {
          setToken("access_token", rotatedAccess);
          api.defaults.headers.common.Authorization = `Bearer ${rotatedAccess}`;
        }
        if (refresh) setToken("refresh_token", refresh);
      }

      // If this was a logout call, clear tokens
      if (response.config.url && response.config.url.includes("/logout")) {
        clearTokens();
      }

      return response;
    },

    // ERROR HANDLER
    async (error: AxiosError) => {
      const original = error.config as RetryConfig | undefined;

      // Only handle fresh 401s on non-auth URLs
      if (!original || original._retry || isAuthUrl(original.url)) {
        return Promise.reject(error);
      }

      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      original._retry = true;

      // DEV requires refresh token in storage; if missing, logout
      const refreshToken = getToken("refresh_token");
      if (!isProd && !refreshToken) {
        logger.warn("No refresh token available — forcing logout");
        clearTokens();
        if (opts?.onLogout) opts.onLogout();
        else window.location.href = "/login";
        return Promise.reject(error);
      }

      // If refresh already running, enqueue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: () => resolve(api(original)),
            reject,
          });
        });
      }

      // Perform refresh
      isRefreshing = true;
      try {
        const { data } = await refreshAccessToken(refreshToken);
        const newAccess = data.access || data.access_token;

        if (!isProd && newAccess) {
          setToken("access_token", newAccess);
          if (data.refresh) setToken("refresh_token", data.refresh);
          api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        }

        // Retry original request with new token if applicable
        if (!isProd && newAccess) {
          const headers = (original.headers ?? {}) as AxiosRequestHeaders;
          headers.Authorization = `Bearer ${newAccess}`;
          original.headers = headers;
        }

        // Release queued requests
        queue.forEach(({ resolve }) => resolve());
        queue = [];

        return api(original);
      } catch (refreshErr) {
        logger.error("Token refresh failed — logging out", refreshErr);
        queue.forEach(({ reject }) => reject(refreshErr));
        queue = [];

        clearTokens();
        if (opts?.onLogout) opts.onLogout();
        else window.location.href = "/login";

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
