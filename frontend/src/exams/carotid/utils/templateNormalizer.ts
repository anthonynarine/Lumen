import {
  CarotidTemplate,
  SegmentDefinition,
} from "../types/carotidTemplateTypes";

/**
 * templateNormalizer
 *
 * Converts CarotidTemplate into structured arrays for rendering.
 * Dynamically builds groups from `display.groups` in backend JSON.
 *
 * Example return:
 * {
 *   groups: [
 *     { title: "Right Side", segments: [ ... ] },
 *     { title: "Left Side", segments: [ ... ] },
 *     { title: "Temporal Arteries", segments: [ ... ] }
 *   ]
 * }
 */
export function templateNormalizer(tpl: CarotidTemplate): {
  groups: { title: string; segments: SegmentDefinition[] }[];
} {
  // Build a lookup map: segmentId -> SegmentDefinition
  const segmentMap: Record<string, SegmentDefinition> = {};
  tpl.segments.forEach((seg) => {
    segmentMap[seg.id] = seg;
  });

  // Resolve each group dynamically
  const groups =
    tpl.display?.groups.map((g) => ({
      title: g.title,
      segments: g.segments
        .map((id) => segmentMap[id])
        .filter((seg): seg is SegmentDefinition => Boolean(seg)),
    })) ?? [];

  return { groups };
}
