// src/api/examApi.ts

import { CreateExamPayload, Exam } from "../exams/carotid/types/core";

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

// Optional: log HTML responses mistakenly treated as JSON
examApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const htmlFallback = typeof error?.response?.data === "string" &&
                          error.response.data.startsWith("<!DOCTYPE");
    if (htmlFallback) {
      console.error("❌ Received HTML instead of JSON:", error.response.data);
    }
    return Promise.reject(error);
  }
);

// Attach shared auth logic (access token, 401 retry, etc.)
authInterceptor(examApi);

export default examApi;


/**
 * Fetches the JSON-based segment template for a given exam type and site.
 * This is used to build the UI dynamically from backend JSON config.
 *
 * @param examType - The exam slug (e.g. "carotid", "renal")
 * @param site - Optional site identifier (default: "mount_sinai_hospital")
 * @returns The template object (segment keys, labels, fields)
 */
export async function fetchExamTemplate(
  examType: string,
  site = "mount_sinai_hospital"
): Promise<any> {
  const URL = `/reports/${examType}/template/?site=${site}`;
  const response = await examApi.get(URL);

  console.log("📦 fetchExamTemplate:", response);

  if (!response.data || !response.data.template) {
    throw new Error(`Missing template for ${examType}`);
  }

  return response.data.template;
}

/**
 * Generic exam creation function for any vascular modality.
 *
 * @param examType - The exam type slug (e.g. "carotid", "renal")
 * @param payload - Patient metadata and exam config
 * @returns Newly created exam object from backend
 */
export async function createExam<T = any>(
  examType: string,
  payload: CreateExamPayload
): Promise<T> {
  const URL = `/reports/${examType}/`;
  const response = await examApi.post(URL, payload);

  console.log("📝 createExam:", response);

  if (!response.data || !response.data.exam) {
    throw new Error(`Failed to create ${examType} exam`);
  }

  return response.data.exam;
}
