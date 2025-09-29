// src/exams/carotid/forms/SegmentTable.tsx

import React from "react";
import { SegmentDefinition, CarotidTemplate } from "../types/carotidTemplateTypes";
import { SideMeasurements } from "../types/carotidExamFormTypes";
import { SegmentRow } from "./SegmentRow";

/**
 * SegmentTableProps
 *
 * Renders the carotid segment table for one side ("left" or "right").
 */
export interface SegmentTableProps {
  side: "left" | "right";
  segments: SegmentDefinition[];
  values: SideMeasurements;
  setFieldValue: (
    field: string,
    value: number | string | boolean | undefined
  ) => void;
  dropdowns: CarotidTemplate["dropdowns"];
}

/**
 * CarotidSegmentTable
 *
 * Displays a styled carotid exam table:
 * - Sticky headers
 * - Zebra striping
 * - Right-aligned numeric columns
 * - Template-driven dropdowns
 */
export const CarotidSegmentTable: React.FC<SegmentTableProps> = ({
  side,
  segments,
  values,
  setFieldValue,
  dropdowns,
}) => {
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
      "eca_prox",
      "va_origin",
      "va_prox",
      "va_mid",
      "va_dist",
    ],
    []
  );

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
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full table-fixed text-sm border-collapse">
        {/* Header */}
        <thead className="bg-gray-100 dark:bg-gray-800 text-xs font-semibold sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="p-2 text-left">Segment</th>
            <th className="p-2 w-20 text-right">PSV</th>
            <th className="p-2 w-20 text-right">EDV</th>
            <th className="p-2 w-24 text-right">ICA/CCA Ratio</th>
            <th className="p-2 w-28 text-left">% Stenosis</th>
            <th className="p-2 w-16 text-center">Plaque</th>
            <th className="p-2 w-28 text-left">Waveform</th>
            <th className="p-2 w-28 text-left">Direction</th>
            <th className="p-2 w-32 text-left">Other</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedSegments.map((definition, idx) => (
            <tr
              key={`${side}_${definition.id}`}
              className={
                idx % 2 === 0
                  ? "bg-white dark:bg-gray-900"
                  : "bg-gray-50 dark:bg-gray-800"
              }
            >
              <SegmentRow
                side={side}
                definition={definition}
                values={values}
                setFieldValue={setFieldValue}
                dropdowns={dropdowns}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
