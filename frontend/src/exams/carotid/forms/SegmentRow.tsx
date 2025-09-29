// src/exams/carotid/forms/SegmentRow.tsx

import React from "react";
import { Field } from "formik";
import { SegmentDefinition, CarotidTemplate } from "../types/carotidTemplateTypes";
import { SideMeasurements } from "../types/carotidExamFormTypes";

/**
 * SegmentRowProps
 *
 * Defines props required to render a single carotid segment row.
 */
export interface SegmentRowProps {
  side: "left" | "right";
  definition: SegmentDefinition;
  values: SideMeasurements;
  setFieldValue: (field: string, value: number | string | boolean | undefined) => void;
  dropdowns: CarotidTemplate["dropdowns"];
}

/**
 * SegmentRow
 *
 * Displays PSV, EDV, ICA/CCA ratio, stenosis %, plaque (present + morphology),
 * waveform, direction, and disease-finding controls for one vascular segment.
 *
 * Styling:
 * - Numeric inputs: right-aligned, compact, dark-mode aware
 * - Dropdowns: consistent Tailwind classes across light/dark
 * - Checkbox: styled with focus rings and dark-mode borders
 */
export const SegmentRow: React.FC<SegmentRowProps> = ({
  side,
  definition,
  values,
  setFieldValue,
  dropdowns,
}) => {
  const { id, label } = definition;
  const basePath = `${side}.${id}`;
  const rowValues = values?.[id] ?? {};

  return (
    <>
      {/* Segment Label */}
      <td className="p-2 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
        {label}
      </td>

      {/* PSV Input */}
      <td className="p-2">
        <input
          aria-label={`${label} PSV`}
          type="number"
          value={rowValues.psv ?? ""}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setFieldValue(`${basePath}.psv`, Number.isNaN(val) ? undefined : val);
          }}
          placeholder="—"
          className="w-full px-2 py-1 border rounded text-xs text-right
                     bg-white text-gray-900 border-gray-300
                     dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          inputMode="decimal"
        />
      </td>

      {/* EDV Input */}
      <td className="p-2">
        <input
          aria-label={`${label} EDV`}
          type="number"
          value={rowValues.edv ?? ""}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setFieldValue(`${basePath}.edv`, Number.isNaN(val) ? undefined : val);
          }}
          placeholder="—"
          className="w-full px-2 py-1 border rounded text-xs text-right
                     bg-white text-gray-900 border-gray-300
                     dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          inputMode="decimal"
        />
      </td>

      {/* ICA/CCA Ratio Input */}
      <td className="p-2">
        {definition.measurements?.includes("ica_cca_ratio") && (
          <input
            aria-label={`${label} ICA/CCA Ratio`}
            type="number"
            value={rowValues.ica_cca_ratio ?? ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setFieldValue(`${basePath}.ica_cca_ratio`, Number.isNaN(val) ? undefined : val);
            }}
            placeholder="—"
            className="w-full px-2 py-1 border rounded text-xs text-right
                       bg-white text-gray-900 border-gray-300
                       dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            inputMode="decimal"
          />
        )}
      </td>

      {/* % Stenosis Dropdown */}
      <td className="p-2">
        {definition.supportsStenosis && (
          <Field
            as="select"
            name={`${basePath}.stenosisPercent`}
            aria-label={`${label} % Stenosis`}
            className="w-full px-2 py-1 text-xs rounded border
                       bg-white text-gray-900 border-gray-300
                       dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">—</option>
            {dropdowns.stenosisPercent.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Field>
        )}
      </td>

      {/* Plaque: Present + Morphology */}
      <td className="p-2">
        {definition.supportsPlaque && (
          <div className="flex items-center gap-2">
            {/* Plaque Present Checkbox */}
            <Field
              type="checkbox"
              name={`${basePath}.plaquePresent`}
              aria-label={`${label} plaque present`}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded
                         focus:ring-blue-500
                         dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-400"
            />

            {/* Plaque Morphology Dropdown */}
            <Field
              as="select"
              name={`${basePath}.plaqueMorphology`}
              aria-label={`${label} plaque morphology`}
              className="flex-1 px-2 py-1 text-xs rounded border
                         bg-white text-gray-900 border-gray-300
                         dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
            >
              <option value="">—</option>
              {dropdowns.plaqueMorphology.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Field>
          </div>
        )}
      </td>

      {/* Waveform Dropdown */}
      <td className="p-2">
        {definition.supportsWaveform && (
          <Field
            as="select"
            name={`${basePath}.waveformShape`}
            aria-label={`${label} waveform shape`}
            className="w-full px-2 py-1 text-xs rounded border
                       bg-white text-gray-900 border-gray-300
                       dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">—</option>
            {dropdowns.waveformShape.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Field>
        )}
      </td>

      {/* Direction Dropdown */}
      <td className="p-2">
        {definition.supportsDirection && (
          <Field
            as="select"
            name={`${basePath}.direction`}
            aria-label={`${label} flow direction`}
            className="w-full px-2 py-1 text-xs rounded border
                       bg-white text-gray-900 border-gray-300
                       dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">—</option>
            {dropdowns.direction.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Field>
        )}
      </td>

      {/* Disease Finding Dropdown (optional, currently hardcoded) */}
      <td className="p-2">
        {definition.supportsFindings && (
          <Field
            as="select"
            name={`${basePath}.diseaseFinding`}
            aria-label={`${label} disease finding`}
            className="w-full px-2 py-1 text-xs rounded border
                       bg-white text-gray-900 border-gray-300
                       dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">—</option>
            <option value="FMD">FMD</option>
            <option value="Dissection">Dissection</option>
            <option value="String of Beads">String of Beads</option>
          </Field>
        )}
      </td>
    </>
  );
};
