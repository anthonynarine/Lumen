// src/exams/carotid/forms/SegmentTable.tsx

import React from "react";
import { SegmentDefinition } from "../types/carotidTemplateTypes";
import { SideMeasurements } from "../types/carotidExamFormTypes";
import { SegmentRow } from "./SegmentRow";

/**
 * SegmentTableProps
 *
 * Renders the compact clinical table for a single side ("left" or "right").
 * It handles:
 * - Anatomical sorting of segments for consistent clinical workflow
 * - Passing the correct side-specific Formik values to each SegmentRow
 * - Sticky, compact column headers for high-density data entry
 */
export interface SegmentTableProps {
  /** Which side to render: "left" or "right" */
    side: "left" | "right";
    /** Segment metadata for this side (from the loaded carotid template) */
    segments: SegmentDefinition[];
    /** Formik values for this side only: { [segmentId]: { psv?, edv?, ... } } */
    values: SideMeasurements;
    /**
     * Formik setter for updating field values; used by child rows to write to
     * paths like "right.ica_prox.psv" or "left.va_origin.direction".
     */
    setFieldValue: (
        field: string,
        value: number | string | boolean | undefined
    ) => void;
}

/**
 * CarotidSegmentTable
 *
 * Table view for one side of the carotid exam. The header shows fixed clinical
 * columns (Segment, PSV, EDV, Stenosis, Plaque, Waveform, Direction, Other).
 * Each row is a <SegmentRow /> bound to Formik via `setFieldValue`.
 */
export const CarotidSegmentTable: React.FC<SegmentTableProps> = ({
        side,
        segments,
        values,
        setFieldValue,
    }) => {
    /**
     * Clinical/anatomical display order.
     * If a segment ID isn't found here, it falls to the end but remains stable.
     */
    const order = React.useMemo(
        () => [
        "subclavian_origin",
        "subclavian_prox",
        "subclavian_mid",
        "subclavian_distal",
        "cca_prox",
        "cca_mid",
        "cca_distal",
        "bifurcation",
        "ica_prox",
        "ica_mid",
        "ica_distal",
        "eca_prox",
        "va_origin",
        "va_prox",
        "va_mid",
        "va_distal",
        ],
        []
    );

    /** Sort segments by the clinical order above. */
    const sortedSegments = React.useMemo(() => {
            return [...segments].sort((a, b) => {
            const ia = order.indexOf(a.id);
            const ib = order.indexOf(b.id);
            if (ia === -1 && ib === -1) return 0;
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });
    }, [segments, order]);

    return (
        <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="w-full table-auto text-sm">
            {/* Sticky header improves usability during long data entry sessions */}
            <thead className="bg-secondary text-left text-xs uppercase font-semibold sticky top-0 z-10">
            <tr>
                <th className="p-2">Segment</th>
                <th className="p-2 w-20">PSV</th>
                <th className="p-2 w-20">EDV</th>
                <th className="p-2 w-24">% Stenosis</th>
                <th className="p-2 w-16">Plaque</th>
                <th className="p-2 w-24">Waveform</th>
                <th className="p-2 w-24">Direction</th>
                <th className="p-2 w-32">Other</th>
            </tr>
            </thead>

            <tbody>
            {sortedSegments.map((definition) => (
                <SegmentRow
                key={`${side}_${definition.id}`}
                side={side}
                definition={definition}
                values={values}              /* <— side-specific values only */
                setFieldValue={setFieldValue}/* <— writes to `${side}.${id}.*`  */
                />
            ))}
            </tbody>
        </table>
        </div>
    );
};
