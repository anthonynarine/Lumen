
import { SideMeasurements } from "./carotidExamFormTypes"


/**
 * Represents grouped segment measurements for both sides of a carotid exam.
 * Each side contains segment objects with PSV, EDV, and optional notes.
 */
export interface CarotidSegmentUpdatePayload {
  right: SideMeasurements;
  left: SideMeasurements;
}

/**
 * Represents a flattened segment payload ready for backend PATCH submission.
 *
 * Keys are segment identifiers (e.g., "prox_ica_right"), and each value contains
 * the PSV, EDV, and optional notes for that segment.
 *
 * Used when sending PATCH requests to update an existing exam’s segment measurements.
 */
export type FlatCarotidSegmentUpdatePayload = {
  [segmentKey: string]: {
    psv?: number;
    edv?: number;
    notes?: string;
  };
};

/**
 * Standard backend response format after submitting segment updates.
 */
export interface SegmentUpdateResult {
  /** Status message from the backend */
  message: string;

  /** Count of segments successfully updated */
  segments_updated: number;
}
