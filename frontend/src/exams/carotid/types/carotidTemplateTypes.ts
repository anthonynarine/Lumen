// src/exams/carotid/types/carotidTemplateTypes.ts

/**
 * SegmentDefinition
 *
 * Defines the metadata for each carotid segment as delivered
 * by the backend JSON template. This drives the UI rendering.
 */
export interface SegmentDefinition {
  /** Unique identifier, e.g., "ica_prox_right". */
  id: string;

  /** Display label, e.g., "ICA Prox (Right)". */
  label: string;

  /** Anatomical side this segment belongs to. */
  side: "left" | "right";

  /** Vessel type, e.g., "ica", "cca", "subclavian". */
  vessel: string;

  /** Anatomical position within vessel (prox, mid, dist, origin, etc.). */
  position?: string;

  /**
   * Measurements supported by this segment.
   * Always includes PSV, EDV. ICA segments may include "ica_cca_ratio".
   */
  measurements?: string[];

  /** UI flags that control optional fields. */
  supportsPlaque?: boolean;
  supportsStenosis?: boolean;
  supportsWaveform?: boolean;
  supportsDirection?: boolean;
  supportsFindings?: boolean;
}

/**
 * CarotidTemplate
 *
 * Top-level structure for a carotid exam template.
 * Contains all segment definitions plus dropdowns and unit metadata.
 */
export interface CarotidTemplate {
  id: string;
  version: string;
  site: string;
  title: string;

  /** Flat list of all segments in this exam template. */
  segments: SegmentDefinition[];

  /** Groupings for UI display (right, left, temporal). */
  display?: {
    groups: { title: string; segments: string[] }[];
  };

  /** Units override mapping (psv, edv, ica_cca_ratio). */
  units?: Record<string, string>;

  /** Dropdown options for stenosis, plaque morphology, etc. */
  dropdowns?: Record<string, string[]>;
}
