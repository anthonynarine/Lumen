// src/api/authApi.ts
// 🔐 Axios instance for all Auth API communication (login, refresh, logout, etc.)

import axios from "axios";
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { getToken, setToken, clearTokens } from './../auth/utils/storage';
import { logger } from "@/utils/logger";


interface RefreshResponse {
    access: string;
}

// ─────────────────────────────────────────────────────────────
// 🔁 Refresh Token Queue
// Ensures only one refresh request is sent while others wait
// ─────────────────────────────────────────────────────────────
let refreshTokenPromise: Promise<{ data: RefreshResponse }> | null = null;

// ─────────────────────────────────────────────────────────────
// 🔨 Axios Instance: Auth API
// Configured to use cookies and custom base URL
// ─────────────────────────────────────────────────────────────
const authApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_API_URL || "/auth",
    withCredentials: true, // Needed for secure cookie-based login
});

// ─────────────────────────────────────────────────────────────
// 🔐 Request Interceptor
// Automatically attach access token to all requests
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
// 📦 Response Interceptor
// - Store tokens after login or refresh
// - Clear tokens on logout
// - Retry requests on 401 by refreshing the access token
// ─────────────────────────────────────────────────────────────
authApi.interceptors.response.use(
    (response) => {
        const { access, refresh } = response.data || {};

        if (access) setToken("access_token", access);
        if (refresh) setToken("refresh_token", refresh);

        // On logout, remove everything
        if (response.config.url?.includes("/logout")) {
        clearTokens();
        }

        return response;
    },

    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // 401 Unauthorized: try refreshing the access token
        if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = getToken("refresh_token");
        if (!refreshToken) {
            clearTokens();
            window.location.href = "/login"; // fallback: full redirect
            return Promise.reject(error);
        }

        try {
            // Only allow one active refresh request
            if (!refreshTokenPromise) {
            refreshTokenPromise = authApi.post("/token/refresh/", {
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

        return authApi(originalRequest);
        } catch (refreshError) {
            refreshTokenPromise = null;
            clearTokens();
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }

        return Promise.reject(error);
    }
);

export default authApi;
