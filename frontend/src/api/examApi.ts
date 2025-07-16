// src/api/examApi.ts

/**
 * Axios instance configured for the main Exam API.
 *
 * This instance is used to communicate with the Django-based Lumen backend,
 * which handles all vascular exam types (e.g., carotid, renal, venous).
 *
 * ✅ Responsibilities:
 * - Authenticated requests using the user's access token
 * - Handles token refresh automatically via authInterceptor
 * - Supports multi-exam workflows (shared instance for all exam modules)
 * - Injects `Authorization` and `withCredentials` headers
 *
 * Used by: carotidApi.ts, renalApi.ts, etc.
 */

import axios from "axios";
import { authInterceptor } from "./interceptors/authInterceptor";

/**
 * Axios instance for interacting with the Lumen Exam API.
 * Automatically attaches JWT tokens and handles refresh logic.
 */
const examApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Set in your frontend .env file
  withCredentials: true,                 // Enable cross-origin cookies if needed
});

// Attach shared auth logic (access token, 401 retry, etc.)
authInterceptor(examApi);

export default examApi;
