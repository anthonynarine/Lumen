// src/exams/carotid/SegmentTable.tsx

import React from "react";
import { SegmentDefinition } from "./types/template"; // Segment labels + ids from template
import { SideMeasurements } from "./types/form"; // Formik values: { prox_ica: { psv, edv } }

type SegmentTableProps = {
  /** Side of the body this table represents */
  side: "right" | "left";

  /** Template-defined segments for this side */
  segments: SegmentDefinition[];

  /** Live Formik form values for this side */
  values: SideMeasurements;

  /** Formik-provided method to update nested field values */
  setFieldValue: (field: string, value: number | undefined) => void;
};

/**
 * Renders a dynamic PSV/EDV input table for carotid artery segments.
 * Connected to Formik via `values` and `setFieldValue`.
 */
export const SegmentTable = ({
  side,
  segments,
  values,
  setFieldValue,
}: SegmentTableProps) => {
  return (
    <div className="overflow-x-auto border rounded-md shadow-sm">
      <table className="w-full table-auto text-sm">
        <thead className="bg-secondary text-left text-xs uppercase font-semibold">
          <tr>
            <th className="p-2">Segment</th>
            <th className="p-2">PSV (cm/s)</th>
            <th className="p-2">EDV (cm/s)</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment) => {
            const segmentKey = `${side}.${segment.id}`;
            const segmentValues = values[segment.id] || {};

            return (
              <tr key={segment.id} className="border-t border-border">
                <td className="p-2">{segment.label}</td>

                {/* PSV input */}
                <td className="p-2">
                  <input
                    type="number"
                    value={segmentValues.psv ?? ""}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFieldValue(`${segmentKey}.psv`, isNaN(value) ? undefined : value);
                    }}
                    className="w-full px-2 py-1 border rounded dark:bg-gray-800"
                  />
                </td>

                {/* EDV input */}
                <td className="p-2">
                  <input
                    type="number"
                    value={segmentValues.edv ?? ""}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFieldValue(`${segmentKey}.edv`, isNaN(value) ? undefined : value);
                    }}
                    className="w-full px-2 py-1 border rounded dark:bg-gray-800"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
