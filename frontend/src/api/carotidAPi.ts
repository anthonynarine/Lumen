// src/api/carotidApi.ts

import examApi from "../api/examApi"
import { CreateExamPayload, Exam } from "../exams/carotid/types/core";
import { SegmentUpdateResult } from "../exams/carotid/types/apiResponse"

/**
 * Fetches the JSON-based template for a given vascular exam type and site.
 * This template defines segment keys, labels, and measurement fields used to build the Form UI.
 *
 * @function fetchExamTemplate
 * @param {string} examType - The type of exam (e.g. "carotid", "renal", "ivc").
 * @param {string} [site="mount_sinai_hospital"] - Optional site identifier for site-specific protocol.
 * @returns {Promise<object>} - Resolves to the template object used for rendering the exam form.
 */

export async function createExam( examType: string, payload: CreateExamPayload): Promise<Exam> {

    const URL = `/reports/${examType}/`
    const response = await examApi.post(URL, payload );

    console.log("createExam response:", response)

    if(!response.data || !response.data.exam) {
        throw new Error(`Failed to create ${examType}`);
    }

    return response.data.exam;
};

/**
 * Updates PSV/EDV measurement data for a carotid exam’s segments.
 *
 * This is typically called after the technologist enters or modifies velocity data.
 * Only the specified fields are patched — partial update.
 *
 * @param examId - Unique ID of the carotid exam.
 * @param updates - Raw measurement updates grouped by segment name.
 *   Example:
 *     {
 *       prox_ica_right: { psv: 300, edv: 100 },
 *       mid_cca_left: { psv: 150 }
 *     }
 *
 * @returns Confirmation message and count of segments updated.
 */
export async function updateCarotidSegments( examId: number, updates: Record<string, any>// or use `CarotidSegmentUpdatePayload` if shape is known
    ): Promise<SegmentUpdateResult> {
    const URL = `/reports/carotid/${examId}/segments/`;
    const res = await examApi.patch(URL, updates);

    console.log("updateCarotidSegments results:", res);

    if (!res.data) {
        throw new Error("Failed to update carotid segments.");
    }

    return res.data;
}

/**
 * Triggers backend calculation logic for a carotid exam.
 *
 * This computes ICA/CCA ratio, stenosis classification, and stores results on the exam record.
 * Typically called after all segment PSV/EDV data has been entered.
 *
 * @param examId - Unique ID of the carotid exam
 * @returns {Promise<{ result: string }>} - Status or result message
 */
export async function calculateCarotidExam(
    examId: number
    ): Promise<{ result: string }> {
    const URL = `/reports/carotid/${examId}/calculate/`;
    const response = await examApi.post(URL);

    console.log("calculateCarodidExam:", response)

    if (!response.data) {
        throw new Error("Failed to run carotid exam calculation.");
    }

    return response.data;
};


/**
 * Retrieves the auto-generated clinical conclusion for a carotid exam.
 *
 * This conclusion is derived from PSV/EDV measurements, ICA/CCA ratios,
 * and backend criteria logic (e.g. Mount Sinai velocity thresholds).
 *
 * @param examId - Unique ID of the carotid exam
 * @returns {Promise<string>} - The generated impression text
 */
export async function fetchCarotidConclusion(
    examId: number
): Promise<string> {
    const URL = `/reports/carotid/${examId}/conclusion/`;
    const response = await examApi.get(URL);

  // 🪵 Debugging output
    console.log("🧾 fetchCarotidConclusion response:", response);

    if (!response.data || !response.data.conclusion) {
        throw new Error("Failed to fetch carotid conclusion.");
    }

    return response.data.conclusion;
}






