// src/exams/carotid/types/carotidExamFormTypes.ts

/**
 * Metadata entered at the top of the carotid exam form
 */
export interface CarotidMetadata {
  patientName: string;
  mrn: string;
  accessionNumber: string;
  dateOfBirth: string;
  examDate: string;
  referringMd: string;
  orderingMd: string;
  laterality: "bilateral" | "unilateral_right" | "unilateral_left" | "limited";
  icd10Codes: string[];
  cptCode: string;
}

/**
 * SegmentMeasurements
 *
 * Represents the values entered for a single carotid segment row.
 */
export interface SegmentMeasurements {
  /** Peak systolic velocity (cm/s) */
  psv?: number;

  /** End diastolic velocity (cm/s) */
  edv?: number;

  /** ICA/CCA ratio (dimensionless, only for ICA segments) */
  ica_cca_ratio?: number;

  /** % stenosis (selected from dropdown) */
  stenosisPercent?: string;

  /** Plaque present? */
  plaquePresent?: boolean;

  /** Plaque morphology (Homogeneous, Heterogeneous, Calcified, etc.) */
  plaqueMorphology?: string;

  /** Waveform shape (Triphasic, Biphasic, Monophasic) */
  waveformShape?: string;

  /** Flow direction (Antegrade, Retrograde, Bidirectional) */
  direction?: string;

  /** Disease finding (FMD, Dissection, etc.) */
  diseaseFinding?: string;
}

/**
 * SideMeasurements
 *
 * A map of segment IDs → SegmentMeasurements
 * Example: { ica_prox: { psv: 120, edv: 40, ica_cca_ratio: 2.0 } }
 */
export type SideMeasurements = Record<string, SegmentMeasurements>;

/**
 * CarotidFormValues
 *
 * Full Formik shape for carotid exam form.
 */
export interface CarotidFormValues {
  metadata: CarotidMetadata;
  left: SideMeasurements;
  right: SideMeasurements;
  notes: string;
}
