/**
 * 🫀 carotidApi
 * -------------
 * Thin, typed wrappers around the Lumen carotid endpoints.
 * These functions delegate transport to `examApi` (which carries auth/refresh).
 */

import examApi from "../api/examApi";
import { CreateExamPayload, Exam } from "../exams/carotid/types/sharedTypes";
import { SegmentUpdateResult } from "../exams/carotid/types/apiResponsetypes";
import { fetchExamTemplate } from "./examApi";

/**
 * Create a new carotid exam.
 *
 * @param payload Form values (patient info, scope, indication, site, etc.)
 * @returns       Newly created carotid exam
 */
export async function createCarotidExam(payload: CreateExamPayload): Promise<Exam> {
  const URL = `/reports/carotid/`;
  const response = await examApi.post<{ exam: Exam }>(URL, payload);

  // Simple guard against unexpected shapes
  if (!response.data || !response.data.exam) {
    throw new Error("Failed to create carotid exam.");
  }
  return response.data.exam;
}

/**
 * Patch PSV/EDV measurement updates for one or more carotid segments.
 * Only the specified fields are updated.
 *
 * @param examId  Carotid exam id
 * @param updates Partial segment updates keyed by segment id
 * @returns       Backend acknowledgement (count/message/etc.)
 */
export async function updateCarotidSegments(
  examId: number,
  updates: Record<string, unknown> // swap to a stricter type as your model stabilizes
): Promise<SegmentUpdateResult> {
  const URL = `/reports/carotid/${examId}/segments/`;
  const response = await examApi.patch<SegmentUpdateResult>(URL, updates);

  if (!response.data) {
    throw new Error("Failed to update carotid segments.");
  }
  return response.data;
}

/**
 * Trigger the carotid calculator (ICA/CCA ratio, stenosis classification, etc.).
 * Some backends respond 204 No Content; handle that gracefully.
 *
 * @param examId Carotid exam id
 * @returns      A simple object confirming completion (or the server’s payload)
 */
export async function calculateCarotidExam(
  examId: number
): Promise<{ result: string }> {
  const URL = `/reports/carotid/${examId}/calculate/`;
  const response = await examApi.post(URL);

  // Accept either 200 with JSON or 204 with no body
  if (response.status === 204) {
    return { result: "ok" };
  }
  if (!response.data) {
    throw new Error("Failed to run carotid exam calculation.");
  }
  return response.data as { result: string };
}

/**
 * Fetch the auto-generated/improved clinical conclusion for a carotid exam.
 *
 * @param examId Carotid exam id
 * @returns      Impression text
 */
export async function fetchCarotidConclusion(examId: number): Promise<string> {
  const URL = `/reports/carotid/${examId}/conclusion/`;
  const response = await examApi.get<{ conclusion: string }>(URL);

  if (!response.data || !response.data.conclusion) {
    throw new Error("Failed to fetch carotid conclusion.");
  }
  return response.data.conclusion;
}

/**
 * Fetch the carotid template (segments, labels, field definitions).
 * Delegates to the shared exam helper to keep endpoints centralized.
 *
 * @param site Optional site code (defaults to Mount Sinai)
 * @returns    Carotid template object
 */
export const fetchCarotidTemplate = (site = "mount_sinai_hospital") =>
  fetchExamTemplate("carotid", site);
