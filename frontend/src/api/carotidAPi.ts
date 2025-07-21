// src/api/carotidApi.ts

import examApi from "../api/examApi";
import { CreateExamPayload, Exam } from "../exams/carotid/types/sharedTypes";
import { SegmentUpdateResult } from "../exams/carotid/types/apiResponsetypes";
import { fetchExamTemplate } from "./examApi";

/**
 * Creates a new carotid exam record in the backend.
 * This includes patient info, scope, clinical indication, and site.
 *
 * @param payload - The form values used to create a carotid exam
 * @returns The newly created carotid Exam object
 */
export async function createCarotidExam( payload: CreateExamPayload): Promise<Exam> {

    const URL = `/reports/carotid/`;
    const response = await examApi.post(URL, payload);

    console.log("📄 createCarotidExam response:", response);

    if (!response.data || !response.data.exam) {
        throw new Error("Failed to create carotid exam.");
    }

    return response.data.exam;
}

/**
 * Updates PSV/EDV measurement data for a carotid exam’s segments.
 *
 * This is typically called after the technologist enters or modifies velocity data.
 * Only the specified fields are patched — partial update.
 *
 * @param examId - Unique ID of the carotid exam
 * @param updates - Raw measurement updates grouped by segment key
 *   Example:
 *     {
 *       prox_ica_right: { psv: 300, edv: 100 },
 *       mid_cca_left: { psv: 150 }
 *     }
 *
 * @returns Confirmation message and count of segments updated
 */
export async function updateCarotidSegments(
    examId: number,
    updates: Record<string, any> // Replace with a typed interface if desired
    ): Promise<SegmentUpdateResult> {

    const URL = `/reports/carotid/${examId}/segments/`;
    const response = await examApi.patch(URL, updates);

    console.log("✏️ updateCarotidSegments response:", response);

    if (!response.data) {
        throw new Error("Failed to update carotid segments.");
    }

    return response.data;
}

/**
 * Triggers backend calculation logic for a carotid exam.
 *
 * This computes ICA/CCA ratio, stenosis classification, and stores results on the exam record.
 * Typically called after all segment PSV/EDV data has been entered.
 *
 * @param examId - Unique ID of the carotid exam
 * @returns { result: string } - Confirmation from backend
 */
export async function calculateCarotidExam( examId: number): Promise<{ result: string }> {

    const URL = `/reports/carotid/${examId}/calculate/`;
    const response = await examApi.post(URL);

    console.log("🧠 calculateCarotidExam response:", response);

    if (!response.data) {
        throw new Error("Failed to run carotid exam calculation.");
    }

    return response.data;
}

/**
 * Retrieves the auto-generated clinical conclusion for a carotid exam.
 *
 * This conclusion is derived from PSV/EDV measurements, ICA/CCA ratios,
 * and backend criteria logic (e.g. Mount Sinai velocity thresholds).
 *
 * @param examId - Unique ID of the carotid exam
 * @returns The generated impression text
 */
export async function fetchCarotidConclusion( examId: number): Promise<string> {

    const URL = `/reports/carotid/${examId}/conclusion/`;
    const response = await examApi.get(URL);

    console.log("📋 fetchCarotidConclusion response:", response);

    if (!response.data || !response.data.conclusion) {
        throw new Error("Failed to fetch carotid conclusion.");
    }

    return response.data.conclusion;
}

/**
 * Fetches the carotid JSON-based template from the backend.
 * This template defines segments, field labels, and measurement types.
 *
 * Used to build the dynamic Formik UI structure.
 *
 * @param site - Optional site identifier (default: "mount_sinai_hospital")
 * @returns The full template object for carotid exams
 */
export const fetchCarotidTemplate = (site = "mount_sinai_hospital") =>
    fetchExamTemplate("carotid", site);

