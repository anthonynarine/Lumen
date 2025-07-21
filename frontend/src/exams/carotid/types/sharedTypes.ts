// =========================================
// 🧠 Core Exam Interfaces (shared across UI, PDF, API)
// =========================================

/**
 * Represents a complete vascular ultrasound exam.
 * Contains patient identifiers, clinical metadata, and segment-level measurements.
 */
export interface Exam {
  /** Unique database ID for the exam */
  id: number;

  /** Full name of the patient */
  patient_name: string;

  /** Medical Record Number */
  mrn: string;

  /** Patient's date of birth (YYYY-MM-DD) */
  dob: string;

  /** Optional accession number from EPIC or modality */
  accession?: string;

  /** Patient gender */
  gender?: "male" | "female" | "other";

  /** Type of exam (e.g., "carotid", "renal") */
  exam_type: string;

  /** Laterality or scope of study */
  exam_scope: "bilateral" | "unilateral" | "limited";

  /** Extent of study ("complete", "follow-up", etc.) */
  exam_extent: string;

  /** CPT billing code */
  cpt_code: string;

  /** Optional technique description (e.g., transducer, doppler used) */
  technique?: string;

  /** Optional surgical or intervention history */
  operative_history?: string;

  /** ICD-10 code for clinical indication */
  indication_code: string;

  /** User or technologist who created the exam */
  created_by: string;

  /** Current status of the exam */
  status?: "draft" | "signed" | "finalized";

  /** Timestamp when exam was created (ISO 8601) */
  created_at: string;

  /** Optional timestamp of last update */
  updated_at?: string;

  /** List of artery segments with associated measurements */
  segments: Segment[];
}

/**
 * Wrapper for API responses when retrieving or creating an exam.
 */
export interface ExamResponse {
  exam: Exam;
}

/**
 * Payload sent from the frontend to create a new exam.
 */
export interface CreateExamPayload {
  /** Full name of the patient */
  patient_name: string;

  /** Medical Record Number */
  mrn: string;

  /** Gender of the patient */
  gender: "male" | "female" | "other";

  /** Date of birth */
  dob: string;

  /** Optional accession number from modality */
  accession?: string;

  /** ICD-10 indication code */
  indication_code: string;

  /** Study scope (laterality) */
  exam_scope: "bilateral" | "unilateral" | "limited";

  /** Study extent (e.g. "follow-up") */
  extent: string;

  /** CPT billing code */
  cpt_code: string;

  /** Creator username or ID */
  created_by: string;

  /** Optional technique notes */
  technique?: string;

  /** Optional surgical/operative history */
  operative_history?: string;
  ordering_physician: string;
  clinical_indication: string;
  site: string;
}

/**
 * Represents a single artery segment within an exam (e.g., prox_ica_right).
 */
export interface Segment {
  /** Internal identifier or label (e.g. "prox_ica") */
  name: string;

  /** Side of the body the segment is on */
  side: "right" | "left" | "n/a";

  /** Artery name (e.g. ICA, CCA, ECA, VA) */
  artery: string;

  /** Optional measurements for this segment */
  measurement?: Measurement;
}

/**
 * Represents PSV/EDV velocities and plaque descriptors for a segment.
 */
export interface Measurement {
  /** Peak systolic velocity (cm/s) */
  psv?: number;

  /** End-diastolic velocity (cm/s) */
  edv?: number;

  /** Flow direction: antegrade, retrograde, bidirectional */
  direction?: string;

  /** Waveform pattern (e.g. triphasic, monophasic) */
  waveform?: string;

  /** CCA PSV if calculating ICA/CCA ratio */
  cca_psv?: number;

  /** Plaque morphology (e.g. calcified, soft, mixed) */
  morphology?: string;

  /** Optional narrative description of plaque or findings */
  plaque_description?: string;

  /** Backend-calculated fields such as ICA/CCA ratio, velocity thresholds, etc. */
  calculated_fields?: Record<string, any>;
}
