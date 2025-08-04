// ===============================
// 🧠 Carotid Template Definitions
// ===============================

/** Optional enums to keep values consistent */
export type CarotidSide = "right" | "left" | "temporal";
export type Artery =
  | "Subclavian"
  | "CCA"
  | "Bifurcation"
  | "ICA"
  | "ECA"
  | "VA";

/**
 * Template-driven segment definition loaded from backend.
 * Used to render fields dynamically in carotid forms.
 */
export interface SegmentDefinition {
  /** Unique key *per side* (e.g., "ica_prox") — side is kept separate below */
  id: string;

  /** Human-readable label (e.g., "Proximal ICA") */
  label: string;

  /** Artery name */
  artery: Artery;

  /** Laterality for Formik segmentation */
  side: CarotidSide; // normally "right" | "left" for this form

  /** ---- UI capability flags (what columns to show for this segment) ---- */
  supportsPlaque?: boolean;     // e.g., ICA, CCA, bifurcation
  supportsStenosis?: boolean;   // typically ICA
  supportsDirection?: boolean;  // vertebrals
  supportsWaveform?: boolean;   // arterial segments
  supportsFindings?: boolean;   // FMD, dissection, string of beads, etc.

  /** Optional group label (if you later group sections visually) */
  displayGroup?: string;

  /** Explicit sort order to enforce anatomical flow in tables */
  order?: number;
}

/** Map of segment keys (e.g., "ica_prox") to definitions */
export type SegmentDefinitionMap = {
  [segmentKey: string]: SegmentDefinition;
};

/**
 * Full template structure returned by the backend for a carotid exam.
 * Includes both right and left segment definitions.
 * Keep maps for O(1) lookup, and provide an order array to render rows.
 */
export interface CarotidTemplate {
  right: SegmentDefinitionMap;
  left: SegmentDefinitionMap;

  /** Rendering order for each side (array of keys from the maps above) */
  rightOrder: string[];
  leftOrder: string[];

  /** Optional display metadata for headers/sections */
  display?: {
    groups?: Array<{ key: string; title: string; order?: number }>;
  };
}

/**
 * Reduced segment template used in limited or legacy workflows.
 * Extended to allow future fields beyond PSV/EDV.
 */
export type SegmentTemplate = {
  label: string;
  fields: (
    | "psv"
    | "edv"
    | "stenosisPercent"
    | "plaquePresent"
    | "waveformShape"
    | "direction"
    | "diseaseFinding"
  )[];
};
