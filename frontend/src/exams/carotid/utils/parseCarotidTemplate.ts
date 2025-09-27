// src/exams/carotid/utils/parseCarotidTemplate.ts

import { CarotidTemplate, SegmentDefinition } from "../types/carotidTemplateTypes";

/**
 * buildCarotidTemplate
 *
 * Converts raw segment data from the backend JSON template into a
 * strongly typed CarotidTemplate object for the frontend.
 *
 * Ensures that measurements, UI flags, and labels are preserved.
 */
export function buildCarotidTemplate(rawSegments: any[]): CarotidTemplate {
  const segments: SegmentDefinition[] = rawSegments.map((seg) => ({
    id: seg.id,
    label: seg.label,
    side: seg.side,
    vessel: seg.vessel,
    position: seg.position,

    // Measurements array: may include ["psv", "edv"] or also "ica_cca_ratio"
    measurements: seg.measurements,

    // UI flags
    supportsPlaque: seg.supportsPlaque ?? false,
    supportsStenosis: seg.supportsStenosis ?? false,
    supportsWaveform: seg.supportsWaveform ?? false,
    supportsDirection: seg.supportsDirection ?? false,
    supportsFindings: seg.supportsFindings ?? false,
  }));

  return {
    id: "carotid",
    version: "1.0.0",
    site: "mount_sinai_hospital",
    title: "Bilateral Carotid Duplex Protocol",
    segments,
  };
}
