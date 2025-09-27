// src/exams/carotid/types/carotidExamFormTypes.ts

/**
 * Metadata about the exam itself, not tied to a specific segment.
 */
export interface CarotidMetadata {
  patientName: string;
  mrn: string;
  accessionNumber: string;
  dateOfBirth: string;
  examDate: string;
  referringMd?: string;
  orderingMd?: string;
  laterality: "bilateral" | "unilateral_right" | "unilateral_left" | "limited";
  icd10Codes: string[];
  cptCode: string;
}

/**
 * Measurements for a single segment.
 * PSV and EDV always exist, ICA/CCA ratio optional (ICA only).
 * Other optional values (stenosis, plaque, waveform, direction).
 */
export interface SegmentMeasurements {
  /** Peak systolic velocity (cm/s). */
  psv?: number;

  /** End diastolic velocity (cm/s). */
  edv?: number;

  /** ICA/CCA ratio (only applies to ICA segments). */
  ica_cca_ratio?: number;

  /** Stenosis category selected from dropdown. */
  stenosisPercent?: string;

  /** Whether plaque is present. */
  plaquePresent?: boolean;

  /** Waveform morphology. */
  waveformShape?: string;

  /** Flow direction (antegrade, retrograde). */
  direction?: string;

  /** Optional disease finding (FMD, dissection, etc.). */
  diseaseFinding?: string;
}

/**
 * Map of segment ID → SegmentMeasurements.
 * Example: { ica_prox_right: { psv: 120, edv: 40, ica_cca_ratio: 2.0 } }
 */
export type SideMeasurements = Record<string, SegmentMeasurements>;

/**
 * Full Formik values object for a carotid exam form.
 */
export interface CarotidFormValues {
  metadata: CarotidMetadata;
  left: SideMeasurements;
  right: SideMeasurements;
  notes: string;
}
