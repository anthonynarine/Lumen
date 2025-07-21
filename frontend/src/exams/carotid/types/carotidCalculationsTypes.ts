/**
 * Represents a single carotid artery segment's raw velocity measurements.
 * 
 * These values are entered by the technologist and used to compute
 * ICA/CCA ratio and classify the degree of stenosis.
 */
export type Segment = {
  /** Peak systolic velocity (cm/s) */
  psv?: number;

  /** End diastolic velocity (cm/s) */
  edv?: number;

  /**
   * ICA/CCA ratio, computed from PSV values.
   * This is not manually entered — it's derived in the calculator.
   */
  ica_cca_ratio?: number;
};

/**
 * Mapping of segment IDs (e.g., "prox_ica", "prox_cca") to their corresponding measurements.
 * Used per side (right or left).
 */
export type SegmentValues = {
  [segmentId: string]: Segment;
};

/**
 * Top-level input structure for the carotid calculator.
 * Contains bilateral segment measurements.
 * 
 * Passed into `calculateCarotidStenosis()` to compute ICA/CCA ratios
 * and estimate percent stenosis for each side.
 */
export type CarotidValues = {
  /** Right-side segment data */
  right: SegmentValues;

  /** Left-side segment data */
  left: SegmentValues;
};

/**
 * Output structure returned by the stenosis calculator per side.
 * 
 * Used to describe the severity of internal carotid artery disease,
 * based on PSV, EDV, and ICA/CCA ratio.
 */
export type StenosisResult = {
  /** Interpreted stenosis percentage (e.g. "0–19%", "70–99%") */
  percent?: string;

  /** Optional explanation if data is ambiguous or incomplete */
  notes?: string;

  /** ICA/CCA ratio value used for classification */
  icaCcaRatio?: number;
};

/**
 * Full output of the carotid stenosis calculator.
 * Contains classification results for both right and left sides.
 */
export type CalcResult = {
  stenosisRight: StenosisResult;
  stenosisLeft: StenosisResult;
};

/**
 * Alias for CalcResult used across the app (UI, PDF, HL7).
 * Helps standardize the naming in frontend and backend.
 */
export type CarotidCalculations = CalcResult;
