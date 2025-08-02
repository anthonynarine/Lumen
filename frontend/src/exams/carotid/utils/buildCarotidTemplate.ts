import { CarotidTemplate } from "../types";

export function buildCarotidTemplate(
    segments: any[]
    ): CarotidTemplate {
    const right: Record<string, any> = {};
    const left: Record<string, any> = {};

    for (const segment of segments) {
        if (segment.side === "right") right[segment.id] = segment;
        else if (segment.side === "left") left[segment.id] = segment;
    }

    return { right, left };
}