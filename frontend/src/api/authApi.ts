// src/api/authApi.ts

/**
 * Axios instance configured for authentication-related requests.
 *
 * This instance is dedicated to communicating with the external Auth API,
 * which manages user login, logout, token refresh, and session validation.
 *
 * ✅ Responsibilities:
 * - Sends credentials (username/password) to obtain JWT tokens
 * - Refreshes expired tokens using the authInterceptor logic
 * - Includes `withCredentials` to support secure cookies (if used)
 * - Used by useAuth(), login/logout flows, and token validation utilities
 *
 * This instance is isolated from the main exam API to support
 * cross-origin deployment and service separation.
 */

import axios from "axios";
import { authInterceptor } from "./interceptors/authInterceptor";

/**
 * Axios instance for interacting with the centralized Auth microservice.
 * Automatically manages token handling and secure session headers.
 */
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || "/auth", // Backend Auth API base URL
  withCredentials: true,                                 // Support cross-origin cookies
});

// Attach token/refresh handling and 401 intercept logic
authInterceptor(authApi);

export default authApi;
