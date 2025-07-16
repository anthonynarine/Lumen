// src/api/authApi.ts
// Axios instance for Auth API communication (login, refresh, logout)

import axios from "axios";
import { authInterceptor } from "./interceptors/authInterceptor";

/**
 * Axios instance for communicating with the Auth API.
 * Includes cookie support for CSRF or session tokens.
 */
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || "/auth",
  withCredentials: true,
});

// Attach full auth logic (token, refresh, retry)
authInterceptor(authApi);

export default authApi;
