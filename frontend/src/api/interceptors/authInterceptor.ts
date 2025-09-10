// src/api/interceptors/authInterceptor.ts
import type {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { getToken, setToken, clearTokens } from "../../auth/utils/storage";
import { logger } from "../../utils/logger";

/**
 * Interface describing the expected shape of a refresh response
 * from the backend when using the Bearer (dev) strategy.
 */
interface RefreshResponse {
  access: string;
  refresh?: string;
}

/**
 * Shared flags and queues for coordinating refresh requests.
 */
let isRefreshing = false;
let waiters: Array<(access?: string) => void> = [];

/**
 * Utility: determine if a URL is an authentication endpoint that
 * should not trigger refresh logic (avoids recursion).
 */
const isAuthUrl = (url?: string) =>
  !!url &&
  (url.includes("/auth/login") ||
    url.includes("/auth/token-refresh") ||
    url.includes("/auth/me") ||
    url.includes("/logout"));

/**
 * Extend Axios request config with a private `_retry` flag
 * to prevent infinite loops on repeated 401s.
 */
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/**
 * authInterceptor
 * ----------------
 * Attaches authentication lifecycle management to an Axios instance.
 *
 * Responsibilities:
 * - DEV (Bearer strategy):
 *   • Attach access token from localStorage to every request.
 *   • On 401, attempt a single refresh using refresh token.
 *   • Update stored tokens and retry original request after refresh.
 *
 * - PROD (Cookie strategy):
 *   • Do NOT attach Authorization headers manually.
 *   • Let the browser send HttpOnly cookies automatically.
 *   • On 401, simply clear local state and route to login.
 *
 * Features:
 * - Prevents multiple simultaneous refresh calls (queues requests).
 * - Skips refresh logic for auth endpoints themselves.
 * - Provides optional `onLogout` callback for graceful redirects.
 *
 * @param api   Axios instance to enhance (e.g., authApi, examApi).
 * @param opts  Optional hooks (e.g., custom onLogout handler).
 */
export function authInterceptor(api: AxiosInstance, opts?: { onLogout?: () => void }) {
  const isProd = import.meta.env.PROD;

  // ──────────────────────────────────────────────
  // REQUEST INTERCEPTOR
  // ──────────────────────────────────────────────
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (!isProd) {
      // In DEV, attach Bearer token from storage.
      const token = getToken("access_token");
      if (token) {
        const headers = (config.headers ?? {}) as AxiosRequestHeaders;
        headers.Authorization = `Bearer ${token}`;
        config.headers = headers;
      }
    }
    // In PROD, do nothing — rely on cookies.
    return config;
  });

  // ──────────────────────────────────────────────
  // RESPONSE INTERCEPTOR
  // ──────────────────────────────────────────────
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      if (!isProd) {
        // In DEV: capture new tokens if backend rotates them.
        const { access, refresh } = (response.data ?? {}) as Partial<RefreshResponse>;
        if (access) {
          setToken("access_token", access);
          api.defaults.headers.common.Authorization = `Bearer ${access}`;
        }
        if (refresh) setToken("refresh_token", refresh);
      }

      // On logout endpoint, clear local tokens regardless of env.
      if (response.config.url && response.config.url.includes("/logout")) {
        clearTokens();
      }

      return response;
    },

    // ──────────────────────────────────────────────
    // ERROR HANDLER
    // ──────────────────────────────────────────────
    async (error: AxiosError) => {
      const original = error.config as RetryConfig | undefined;
      const status = error.response?.status;

      // If no config, already retried, or hitting auth endpoints → bail out.
      if (!original || original._retry || isAuthUrl(original.url)) {
        return Promise.reject(error);
      }

      // PROD STRATEGY (HttpOnly cookies)
      if (isProd) {
        if (status === 401) {
          clearTokens();
          if (opts?.onLogout) opts.onLogout();
          else window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      // DEV STRATEGY (Bearer tokens)
      if (status === 401) {
        original._retry = true;

        const refreshToken = getToken("refresh_token");
        if (!refreshToken) {
          logger.warn("No refresh token available — forcing logout");
          clearTokens();
          if (opts?.onLogout) opts.onLogout();
          else window.location.href = "/login";
          return Promise.reject(error);
        }

        // Queue up requests while a refresh is happening.
        if (isRefreshing) {
          await new Promise<void>((resolve) => waiters.push(() => resolve()));
          return api(original); // retry once refresh is done
        }

        isRefreshing = true;
        try {
          // Call refresh endpoint with stored refresh token.
          const { data } = await api.post<RefreshResponse>("/auth/token-refresh/", {
            refresh: refreshToken,
          });

          // Persist and apply new tokens.
          if (data.access) {
            setToken("access_token", data.access);
            api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
          }
          if (data.refresh) setToken("refresh_token", data.refresh);

          // Notify all queued waiters.
          waiters.forEach((w) => w(data.access));
          waiters = [];

          // Ensure retried request has updated header.
          const headers = (original.headers ?? {}) as AxiosRequestHeaders;
          if (data.access) headers.Authorization = `Bearer ${data.access}`;
          original.headers = headers;

          return api(original);
        } catch (refreshErr) {
          logger.error("Refresh failed — logging out", refreshErr);
          clearTokens();
          waiters.forEach((w) => w());
          waiters = [];
          if (opts?.onLogout) opts.onLogout();
          else window.location.href = "/login";
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      // Other errors: pass through
      return Promise.reject(error);
    }
  );
}
