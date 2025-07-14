import type { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { getToken,setToken, clearTokens } from "../../auth/utils/storage";

import 

/**
 * Shape of the response returned by a successful token refresh call.
 */
interface RefreshResponse {
  access: string;
}

/**
 * Ensures only one refresh request is sent at a time.
 * Prevents multiple simultaneous retries from racing.
 */
let refreshTokenPromise: Promise<{ data: RefreshResponse }> | null = null;

/**
 * authInterceptor
 *
 * Attaches full authentication logic to a provided Axios instance.
 * This includes:
 * - Adding Bearer token to all requests
 * - Automatically refreshing access tokens on 401 responses
 * - Retrying failed requests once after refresh
 * - Redirecting to login if refresh fails
 *
 * @param {AxiosInstance} api - An Axios instance to attach auth logic to
 *
 * @example
 * import axios from "axios";
 * import { authInterceptor } from "@/api/interceptors/authInterceptor";
 *
 * const examApi = axios.create({ baseURL: import.meta.env.VITE_API_URL });
 * authInterceptor(examApi);
 * export default examApi;
 */
export function authInterceptor(api: AxiosInstance): void {
  // 🔐 Request Interceptor — Inject token into every outgoing request
  api.interceptors.request.use((config) => {
    const token = getToken("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 🔁 Response Interceptor — Handle 401 + refresh + retry
  api.interceptors.response.use(
    (response) => {
      const { access, refresh } = response.data || {};

      // Store new tokens if provided
      if (access) setToken("access_token", access);
      if (refresh) setToken("refresh_token", refresh);

      // If logout, clear tokens
      if (response.config.url?.includes("/logout")) {
        clearTokens();
      }

      return response;
    },

    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Handle expired token (401)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = getToken("refresh_token");
        if (!refreshToken) {
          logger.warn("No refresh token available — forcing logout");
          clearTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        try {
          // Queue refresh if not already in progress
          if (!refreshTokenPromise) {
            refreshTokenPromise = api.post("/auth/token-refresh/", {
              refresh: refreshToken,
            });
          }

          const { data } = await refreshTokenPromise;
          refreshTokenPromise = null;

          // Store new access token
          setToken("access_token", data.access);

          // Retry original request with new token
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${data.access}`,
          };

          return api(originalRequest);
        } catch (err) {
          refreshTokenPromise = null;
          logger.error("Refresh failed — redirecting to login", err);
          clearTokens();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
}
