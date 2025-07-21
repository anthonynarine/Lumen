// src/exams/carotid/types/carotidTemplateTypes.ts

// ===============================
// 🧠 Carotid Template Definitions
// ===============================

/**
 * Template-driven segment definition loaded from backend.
 * Used to render fields dynamically in carotid forms.
 */
export interface SegmentDefinition {
  /** Unique key (e.g., "prox_ica") */
  id: string;

  /** Human-readable label (e.g., "Proximal ICA") */
  label: string;

  /** Artery name (e.g., "ICA", "CCA", "ECA") */
  artery: string;

  /** Laterality for Formik segmentation */
  side: "right" | "left";
}

/**
 * A mapping of segment keys (e.g., "prox_ica") to SegmentDefinition objects.
 * Used internally for quick lookup or rendering order.
 */
export type SegmentDefinitionMap = {
  [segmentKey: string]: SegmentDefinition;
};

/**
 * Full template structure returned by the backend for a carotid exam.
 * Includes both right and left segment definitions.
 */
export interface CarotidTemplate {
  right: SegmentDefinitionMap;
  left: SegmentDefinitionMap;
}

/**
 * Reduced segment template used in limited or legacy workflows.
 * Only includes the label and allowed measurement fields.
 */
export type SegmentTemplate = {
  label: string;
  fields: ("psv" | "edv")[]; // Could extend later to include "plaque", "direction", etc.
};
