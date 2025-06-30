/**
 * Token Storage Utility
 * ----------------------
 * Handles secure storage and retrieval of authentication tokens
 * using either browser cookies (in production) or localStorage (in development).
 *
 * What it does:
 * - Keeps token logic centralized
 * - Adapts to environment (dev vs. production)
 * - Ensures HIPAA-friendly storage in prod (via secure cookies)
 */

import Cookies from "js-cookie";

// Environment flag: true if running in production mode
const isProd = import.meta.env.PROD;

/**
 * Store a token securely.
 *
 * @param key - Token name (e.g., "access_token", "refresh_token")
 * @param value - The token value to store
 */
export const setToken = (key: string, value: string): void => {
    if (isProd) {
        Cookies.set(key, value, {
        secure: true,         // Enforce HTTPS-only cookies
        sameSite: "None",     // Cross-origin cookie support (required if API is on a different domain)
        expires: key === "refresh_token" ? 7 : undefined, // Expire refresh token after 7 days
        });
    } else {
        localStorage.setItem(key, value);
    }
};

/**
 * Retrieve a stored token.
 *
 * @param key - Token name (e.g., "access_token", "refresh_token")
 * @returns The token value or undefined if not found
 */
export const getToken = (key: string): string | undefined => {
    return isProd ? Cookies.get(key) : localStorage.getItem(key) || undefined;
};

/**
 * Remove a specific token.
 *
 * @param key - Token name to remove
 */
export const removeToken = (key: string): void => {
    if (isProd) {
        Cookies.remove(key);
    } else {
        localStorage.removeItem(key);
    }
};

/**
 * Clear all authentication-related tokens and session data.
 *
 * This is typically used during logout or on token refresh failure.
 */
export const clearTokens = (): void => {
    removeToken("access_token");
    removeToken("refresh_token");

    // Optionally remove additional session cookies set by the backend
    Cookies.remove("csrftoken");
    Cookies.remove("sessionid");
};
