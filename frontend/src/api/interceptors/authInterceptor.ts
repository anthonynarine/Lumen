import React from "react";
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { getToken,setToken, clearTokens } from "../../auth/utils/storage";
import { logger } from "../../utils/logger";


/**
 * Interface for a successful response from the token refresh endpoint.
 */
interface RefreshResponse {
  access: string;
}

/**
 * Shared promise to prevent multiple concurrent token refresh requests.
 * This ensures that if many requests fail with 401 at once,
 * only one actual refresh request is sent to the backend.
 */
let refreshTokenPromise: Promise<{ data: RefreshResponse }> | null = null;

/**
 * Attaches authentication and session management logic to a given Axios instance.
 *
 * This includes:
 * - Automatically attaching the access token to all requests.
 * - Detecting expired tokens (401) and refreshing them using the refresh token.
 * - Retrying the original request exactly once after refreshing the token.
 * - Clearing tokens and redirecting to login on refresh failure.
 *
 * This function can be applied to any Axios instance (e.g., `authApi`, `examApi`).
 *
 * @param {AxiosInstance} api - The Axios instance to enhance with auth behavior.
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
  // ─────────────────────────────────────────────────────
  // Request Interceptor
  // Adds the access token to Authorization header before sending any request
  // ─────────────────────────────────────────────────────
  api.interceptors.request.use((config) => {
    const token = getToken("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ─────────────────────────────────────────────────────
  // Response Interceptor
  // Handles:
  //  - Successful token rotation if new tokens are returned
  //  - Logout cleanup on `/logout`
  //  - Automatic refresh and retry of original request if 401
  // ─────────────────────────────────────────────────────
  api.interceptors.response.use(
    (response) => {
      const { access, refresh } = response.data || {};

      // Store new tokens if returned by backend
      if (access) setToken("access_token", access);
      if (refresh) setToken("refresh_token", refresh);

      // Clear tokens if hitting logout route
      if (response.config.url?.includes("/logout")) {
        clearTokens();
      }

      return response;
    },

    /**
     * Handles expired access tokens by refreshing and retrying the original request.
     * If refresh fails, logs out the user and redirects to login page.
     *
     * @param {AxiosError} error - The original error returned from Axios
     * @returns {Promise<any>} - A retry of the original request, or rejection if failed
     */
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Attempt token refresh on first 401 only
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
          // Only send one refresh request, even if multiple calls fail
          if (!refreshTokenPromise) {
            refreshTokenPromise = api.post("/auth/token-refresh/", {
              refresh: refreshToken,
            });
          }

          const { data } = await refreshTokenPromise;
          refreshTokenPromise = null;

          // Store new access token
          setToken("access_token", data.access);

          // Retry the original failed request with new token
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

      // If not 401 or already retried, propagate the error
      return Promise.reject(error);
    }
  );
}