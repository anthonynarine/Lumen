// src/exams/carotid/SegmentTable.tsx

import React from "react";
import {
  SegmentDefinition,
  SideMeasurements,
} from "./types/CarotidTypes";

type SegmentTableProps = {
  side: "right" | "left";
  segments: SegmentDefinition[];
  values: SideMeasurements;
  setFieldValue: (field: string, value: number) => void;
};

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
                <td className="p-2">
                  <input
                    type="number"
                    value={segmentValues.psv ?? ""}
                    onChange={(e) =>
                      setFieldValue(`${segmentKey}.psv`, parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 border rounded dark:bg-gray-800"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={segmentValues.edv ?? ""}
                    onChange={(e) =>
                      setFieldValue(`${segmentKey}.edv`, parseFloat(e.target.value) || 0)
                    }
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
