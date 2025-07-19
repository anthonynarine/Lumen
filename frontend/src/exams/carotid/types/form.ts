// =========================================
// 📋 Carotid Exam Form Types (Formik usage)
// =========================================

/**
 * Represents a single segment’s editable measurements.
 * Used as the value shape for inputs in <SegmentTable />.
 *
 * @property psv - Peak systolic velocity in cm/s
 * @property edv - End diastolic velocity in cm/s
 */
export type SegmentMeasurement = {
    psv?: number;
    edv?: number;
};

/**
 * Maps segment IDs (e.g., "prox_ica") to their corresponding measurements.
 * Each side (right/left) of the carotid exam uses this structure.
 */
export type SideMeasurements = {
    [segmentId: string]: SegmentMeasurement;
};

/**
 * Formik-compatible top-level form state for the Carotid Exam.
 * Includes bilateral segment measurements and free-text notes.
 *
 * This structure is transformed before sending to the backend.
 *
 * @property right - Measurements for the right side of the neck
 * @property left - Measurements for the left side of the neck
 * @property notes - Free-text notes entered by the technologist
 */
export type CarotidFormValues = {
    right: SideMeasurements;
    left: SideMeasurements;
    notes: string;
};
