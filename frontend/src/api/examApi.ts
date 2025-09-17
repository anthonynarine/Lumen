/**
 * 🩺 examApi (Lumen client)
 * -------------------------
 * Axios instance + helpers for talking to the Lumen backend (Django).
 *
 * Responsibilities
 * - Sends authenticated requests to Lumen (all exam types).
 * - Mounts the shared authInterceptor to seamlessly refresh on 401.
 * - Exposes small helpers for common patterns (fetching templates, creating exams).
 *
 * Environment
 * - VITE_API_URL .......... Base URL for Lumen (should include "/api" if routes live there)
 *
 * Notes
 * - Keep this client interceptor-enabled.
 * - Do NOT attach the interceptor to authApi (that talks to the Auth microservice).
 */

import axios from "axios";
import { authInterceptor } from "./interceptors/authInterceptor";

// ─────────────────────────────────────────────────────────────
// Axios instance for Lumen
// ─────────────────────────────────────────────────────────────
const examApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:8000/api
  withCredentials: true,                 // cookies for PROD flows (CSRF/session)
});

// Optional: make HTML mismatch obvious during dev
examApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const htmlFallback =
      typeof error?.response?.data === "string" &&
      error.response.data.startsWith("<!DOCTYPE");
    if (htmlFallback) {
      // eslint-disable-next-line no-console
      console.error("❌ Received HTML instead of JSON:", error.response.data);
    }
    return Promise.reject(error);
  }
);

// Attach auth lifecycle (Bearer in DEV, cookie refresh in PROD)
authInterceptor(examApi);

export default examApi;

// ─────────────────────────────────────────────────────────────
// Typed helpers used across exam modules
// ─────────────────────────────────────────────────────────────

/** Canonical shape when Lumen returns a single exam object. */
type ApiExamResponse<T> = { exam: T };
/** Canonical shape when Lumen returns a template. */
type TemplateResponse = { template: unknown };

/**
 * Fetch a JSON-based segment template for a given exam type and site.
 * Primary path is `/reports/{exam}/template/`. A legacy fallback is attempted
 * if your server still exposes `/templates/{exam}/`.
 *
 * @param examType The exam slug (e.g., "carotid", "renal")
 * @param site Optional site identifier (default: "mount_sinai_hospital")
 * @returns The template payload used to build the dynamic UI
 */
export async function fetchExamTemplate(
  examType: string,
  site = "mount_sinai_hospital"
): Promise<TemplateResponse["template"]> {
  const primaryURL = `/reports/${examType}/template/?site=${site}`;

  try {
    const response = await examApi.get<TemplateResponse>(primaryURL);
    if (!response.data?.template) throw new Error("Missing template");
    return response.data.template;
  } catch {
    // 🔙 Legacy fallback (only used if your backend still serves old route)
    const legacyURL = `/templates/${examType}/?site=${site}`;
    const legacy = await examApi.get<TemplateResponse>(legacyURL);
    if (!legacy.data?.template) {
      throw new Error(`Missing template for ${examType}`);
    }
    return legacy.data.template;
  }
}

/**
 * Create a new exam for any modality (carotid, renal, venous, …).
 *
 * @param examType The exam slug (e.g., "carotid")
 * @param payload  Patient metadata and exam config
 * @returns        The created exam object
 */
export async function createExam<T = any>(
  examType: string,
  payload: Record<string, unknown>
): Promise<T> {
  const URL = `/reports/${examType}/`;
  const response = await examApi.post<ApiExamResponse<T>>(URL, payload);

  if (!response.data?.exam) {
    throw new Error(`Failed to create ${examType} exam`);
  }
  return response.data.exam;
}
