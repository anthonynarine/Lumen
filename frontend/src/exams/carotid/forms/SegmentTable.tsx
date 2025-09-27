// src/exams/carotid/forms/SegmentTable.tsx

import React from "react";
import { SegmentDefinition } from "../types/carotidTemplateTypes";
import { SideMeasurements } from "../types/carotidExamFormTypes";
import { SegmentRow } from "./SegmentRow";

/**
 * SegmentTableProps
 *
 * Props for rendering the compact carotid segment table for a single side
 * (left or right). This is the presentational table wrapper that:
 * - Applies clinical/anatomical ordering to segments
 * - Renders sticky column headers for usability
 * - Maps Formik values into <SegmentRow /> children
 */
export interface SegmentTableProps {
  /** Which side to render: "left" or "right". */
  side: "left" | "right";

  /** Segment metadata definitions for this side, provided by the JSON template. */
  segments: SegmentDefinition[];

  /** Current Formik values for this side only (e.g., { ica_prox: { psv: 120, edv: 40 } }). */
  values: SideMeasurements;

  /**
   * Formik setter for updating field values.
   * Passed down to SegmentRow so fields can write to paths like:
   *   "right.ica_prox.psv" or "left.va_origin.direction"
   */
  setFieldValue: (
    field: string,
    value: number | string | boolean | undefined
  ) => void;
}

/**
 * CarotidSegmentTable
 *
 * Clinical table view for one side of the carotid exam. Columns are fixed to
 * match the VascuPro/Lumen protocol:
 * - Segment name
 * - PSV, EDV, ICA/CCA Ratio
 * - Stenosis %, Plaque, Waveform, Direction, Other findings
 *
 * Rows are rendered with <SegmentRow /> bound to Formik values.
 */
export const CarotidSegmentTable: React.FC<SegmentTableProps> = ({
  side,
  segments,
  values,
  setFieldValue,
}) => {
  /**
   * Clinical/anatomical display order.
   * Segments not listed here fall to the end but retain stable order.
   * This ensures technologists always enter data in a consistent workflow.
   */
  const order = React.useMemo(
    () => [
      "subclavian_origin",
      "subclavian_prox",
      "subclavian_mid",
      "subclavian_dist",
      "cca_prox",
      "cca_mid",
      "cca_dist",
      "bifurcation",
      "ica_prox",
      "ica_mid",
      "ica_dist",
      "eca",
      "va_origin",
      "va_prox",
      "va_mid",
      "va_dist",
      "superficial_temporal", // optional temporal artery segments
    ],
    []
  );

  /** Sort segments based on the clinical order above. */
  const sortedSegments = React.useMemo(() => {
    return [...segments].sort((a, b) => {
      const ia = order.findIndex((prefix) => a.id.startsWith(prefix));
      const ib = order.findIndex((prefix) => b.id.startsWith(prefix));
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
            {/* 🔑 New column for ICA/CCA Ratio */}
            <th className="p-2 w-24">ICA/CCA Ratio</th>
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
              values={values}              // side-specific values only
              setFieldValue={setFieldValue} // writes to `${side}.${id}.*`
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
