import {
  CarotidTemplate,
  SegmentDefinition,
} from "../types/carotidTemplateTypes";

/**
 * normalizeTemplate
 * Converts the backend template (maps + order arrays) into ordered arrays
 * for each side. This keeps the rendering layer simple and predictable.
 */
export function templateNormalizer(tpl: CarotidTemplate): {
        right: SegmentDefinition[];
        left: SegmentDefinition[];
    } {
    const toArrayUsingOrder = (
        map: Record<string, SegmentDefinition>,
        order: string[]
    ): SegmentDefinition[] => {
        // Prefer explicit order; skip unknown ids safely
        const ordered = order
        ?.map((key) => map[key])
        .filter((def): def is SegmentDefinition => Boolean(def));

        // If order missed some or is empty, append any remaining items deterministically
        const remaining = Object.keys(map)
        .filter((k) => !order?.includes(k))
        .sort()
        .map((k) => map[k]);

        return [...ordered, ...remaining];
    };

    const right = toArrayUsingOrder(tpl.right ?? {}, tpl.rightOrder ?? []);
    const left  = toArrayUsingOrder(tpl.left ?? {}, tpl.leftOrder ?? []);
    return { right, left };
}
