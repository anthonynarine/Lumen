/**
 * Represents a segment definition from the carotid JSON template.
 * Includes the segment's internal ID and its display label.
 */
export type SegmentDefinition = {
  id: string;    // e.g., "prox_ica"
  label: string; // e.g., "Proximal ICA"
};

/**
 * Represents velocity measurements for a single segment.
 * Both PSV (peak systolic velocity) and EDV (end diastolic velocity) are optional.
 */
export type SegmentMeasurement = {
  psv?: number;
  edv?: number;
};

/**
 * Represents the set of measurements for all segments on one side (right or left).
 * The key is the segment ID (e.g., "dist_cca"), and the value is the measurement.
 */
export type SideMeasurements = {
  [segmentId: string]: SegmentMeasurement;
};

/**
 * Full Formik shape for the carotid exam form.
 * Includes segmental measurements for both sides and optional clinical notes.
 */
export type CarotidFormValues = {
  right: SideMeasurements;
  left: SideMeasurements;
  notes: string;
};
