import {
  CarotidTemplate,
  SegmentDefinition,
} from "../types/carotidTemplateTypes";

/**
 * templateNormalizer
 *
 * Converts CarotidTemplate into structured arrays for rendering.
 * Uses `display.groups` from backend JSON to maintain anatomical order.
 */
export function templateNormalizer(tpl: CarotidTemplate): {
  right: SegmentDefinition[];
  left: SegmentDefinition[];
  temporal: SegmentDefinition[];
} {
  // Build a lookup map: segmentId -> SegmentDefinition
  const segmentMap: Record<string, SegmentDefinition> = {};
  tpl.segments.forEach((seg) => {
    segmentMap[seg.id] = seg;
  });

  // Helper: resolve group ids into definitions
  const resolveGroup = (ids: string[]): SegmentDefinition[] =>
    ids
      .map((id) => segmentMap[id])
      .filter((seg): seg is SegmentDefinition => Boolean(seg));

  // Pull groups by title
  const rightGroup = tpl.display?.groups.find((g) =>
    g.title.toLowerCase().includes("right")
  );
  const leftGroup = tpl.display?.groups.find((g) =>
    g.title.toLowerCase().includes("left")
  );
  const temporalGroup = tpl.display?.groups.find((g) =>
    g.title.toLowerCase().includes("temporal")
  );

  return {
    right: rightGroup ? resolveGroup(rightGroup.segments) : [],
    left: leftGroup ? resolveGroup(leftGroup.segments) : [],
    temporal: temporalGroup ? resolveGroup(temporalGroup.segments) : [],
  };
}
