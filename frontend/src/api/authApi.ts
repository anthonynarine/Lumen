/**
 * 🔑 authApi
 * ----------
 * Dedicated Axios client for the centralized Auth API (Heroku).
 *
 * ✅ Responsibilities
 * - Handles login, register, logout requests
 * - Provides helper to refresh access tokens
 * - Supports PROD (HttpOnly cookie flow) and DEV (Bearer token flow)
 *
 * ⚠️ Important
 * - Do NOT attach the shared authInterceptor here → it would recurse on refresh.
 * - This client is standalone; examApi.ts is where you apply the interceptor.
 */

import axios from "axios";

/**
 * Axios instance that always points to the Auth API.
 * - baseURL comes from `VITE_AUTH_API_URL` (must include `/api`).
 * - `withCredentials` ensures HttpOnly cookies work in PROD.
 */
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || "/auth",
  withCredentials: true,
});

export default authApi;

/**
 * refreshAccessToken
 * ------------------
 * Requests a new access token from the Auth API.
 *
 * DEV: Passes `{ refresh }` in the request body (since refresh token is stored client-side).
 * PROD: Sends no body; server uses HttpOnly cookie to find the refresh token.
 *
 * @param refresh Optional refresh token (only needed in DEV)
 * @returns Axios promise resolving to `{ access, refresh? }`
 */
export function refreshAccessToken(refresh?: string) {
  const isProd = import.meta.env.PROD;
  const body = isProd ? undefined : { refresh };
  return authApi.post("token-refresh/", body);
}
