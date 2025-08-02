// src/exams/carotid/SegmentTable.tsx

import React from "react";
import { SegmentTableProps } from "../types";

/**
 * CarotidSegmentTable
 *
 * Renders a dynamic table for a single side (right or left) of the neck
 * using template-defined segments (e.g., CCA, ICA, ECA).
 *
 * For each segment, it provides editable input fields for PSV (Peak Systolic Velocity)
 * and EDV (End Diastolic Velocity), connected to Formik via `values` and `setFieldValue`.
 *
 * @component
 * @param {SegmentTableProps} props - The side, template segments, form values, and updater function
 * @returns {JSX.Element}
 */
export const CarotidSegmentTable = ({
  side,
  segments,
  values,
  setFieldValue,
}: SegmentTableProps): JSX.Element => {
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
          {Object.values(segments).map((segment) => {
            const segmentKey = `${side}.${segment.id}`;
            const segmentValues = values[segment.id] || {};

            return (
              <tr key={segment.id} className="border-t border-border">
                <td className="p-2">{segment.label}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={segmentValues.psv ?? ""}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFieldValue(`${segmentKey}.psv`, isNaN(value) ? undefined : value);
                    }}
                    placeholder="PSV"
                    className="w-full px-2 py-1 border rounded dark:bg-gray-800"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={segmentValues.edv ?? ""}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setFieldValue(`${segmentKey}.edv`, isNaN(value) ? undefined : value);
                    }}
                    placeholder="EDV"
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
