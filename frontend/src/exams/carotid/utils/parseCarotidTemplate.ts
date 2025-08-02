import { CarotidTemplate, SegmentDefinition } from "../types/carotidTemplateTypes";

/**
 * Transforms flat segment list into a CarotidTemplate with right/left maps.
 */
export function buildCarotidTemplate(segments: SegmentDefinition[]): CarotidTemplate {
  const right: Record<string, SegmentDefinition> = {};
  const left: Record<string, SegmentDefinition> = {};

  for (const segment of segments) {
    if (segment.side === "right") {
      right[segment.id] = segment;
    } else if (segment.side === "left") {
      left[segment.id] = segment;
    }
  }

  return { right, left };
}