// src/api/authApi.ts
//  Axios instance for all Auth API communication (login, refresh, logout, etc.)

import axios from "axios";
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { getToken, setToken, clearTokens } from './../auth/utils/storage';
import { logger } from "../utils/logger";

/**
 * Expected shape of a successful refresh response.
 */
interface RefreshResponse {
  access: string;
}

// ─────────────────────────────────────────────────────────────
//  Refresh Queue State
// Ensures only one refresh request is active at a time,
// even if multiple requests fail simultaneously.
// ─────────────────────────────────────────────────────────────
let refreshTokenPromise: Promise<{ data: RefreshResponse }> | null = null;

// ─────────────────────────────────────────────────────────────
// 🔨 Create Axios Instance for the Auth API
// Uses VITE_AUTH_API_URL or defaults to `/auth` for local fallback
// withCredentials ensures secure cookie handling
// ─────────────────────────────────────────────────────────────
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || "/auth",
  withCredentials: true,
});

// ─────────────────────────────────────────────────────────────
//  Request Interceptor
// Attaches access token (if present) to each request's Authorization header
// ─────────────────────────────────────────────────────────────
authApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getToken("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────
//    Response Interceptor
// 1. Stores new tokens (access + refresh) if found in response
// 2. Clears tokens if logout route is hit
// 3. Handles 401 by attempting token refresh and retrying the original request
// ─────────────────────────────────────────────────────────────
authApi.interceptors.response.use(
  (response) => {
    const { access, refresh } = response.data || {};

    if (access) setToken("access_token", access);
    if (refresh) setToken("refresh_token", refresh);

    // On logout, clean up all tokens
    if (response.config.url?.includes("/logout")) {
      clearTokens();
    }

    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized — likely due to expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getToken("refresh_token");
      if (!refreshToken) {
        logger.warn("No refresh token available — forcing logout");
        clearTokens();
        window.location.href = "/login"; // Hard redirect as fallback
        return Promise.reject(error);
      }

      try {
        // Allow only one concurrent refresh request
        if (!refreshTokenPromise) {
          refreshTokenPromise = authApi.post("/token-refresh/", {
            refresh: refreshToken,
          });
        }

        const { data } = await refreshTokenPromise;
        refreshTokenPromise = null;

        // Store new access token
        setToken("access_token", data.access);

        // Retry original request with new access token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.access}`,
        };

        return authApi(originalRequest);
      } catch (refreshError) {
        refreshTokenPromise = null;
        logger.error("Token refresh failed — logging out", refreshError);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, pass through
    return Promise.reject(error);
  }
);

export default authApi;
