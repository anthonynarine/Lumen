// src/exams/carotid/forms/SegmentRow.tsx

import React from "react";
import { Field } from "formik";

import { SegmentDefinition } from "../types/carotidTemplateTypes";
import { SideMeasurements } from "../types/carotidExamFormTypes";

/**
 * SegmentRowProps
 *
 * Props required to render a single row in the SegmentTable.
 */
export interface SegmentRowProps {
    /** The side this segment belongs to: "left" or "right" */
    side: "left" | "right";

    /** The metadata definition of this segment (label, supported fields, etc.) */
    definition: SegmentDefinition;

    /** The current Formik values for this side only (left or right) */
    values: SideMeasurements;

    /**
     * Formik setter to update the field path directly.
     * e.g. setFieldValue("right.ica_prox.psv", 134)
     */
    setFieldValue: (field: string, value: number | string | boolean | undefined) => void;
}

// Constants for dropdowns
const STENOSIS_OPTIONS = ["0–19%", "20–49%", "50–69%", "70–99%", "Occluded"] as const;
const WAVEFORM_OPTIONS = ["Triphasic", "Biphasic", "Monophasic"] as const;
const DIRECTION_OPTIONS = ["Antegrade", "Retrograde"] as const;
const DISEASE_FINDING_OPTIONS = ["FMD", "Dissection", "String of Beads"] as const;

/**
 * SegmentRow
 *
 * Renders one row in the carotid segment table. Each row includes:
 * - Segment name
 * - PSV and EDV inputs (always shown)
 * - Optional dropdowns and checkboxes (stenosis, plaque, waveform, direction, disease)
 *
 * Fields are shown conditionally based on the segment’s capabilities.
 */
export const SegmentRow: React.FC<SegmentRowProps> = ({
    side,
    definition,
    values,
    setFieldValue,
}) => {
    const { id, label } = definition;

    // Formik field path: e.g., "left.ica_prox.psv"
    const basePath = `${side}.${id}`;

    // Current row values for this segment (may be undefined if not filled yet)
    const rowValues = values?.[id] ?? {};

    return (
        <tr className="border-t border-border">
        {/* Segment Label */}
        <td className="p-2 font-medium">{label}</td>

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
            placeholder="PSV"
            className="w-full px-1 py-1 border rounded text-xs dark:bg-gray-800"
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
            placeholder="EDV"
            className="w-full px-1 py-1 border rounded text-xs dark:bg-gray-800"
            inputMode="decimal"
            />
        </td>

        {/* % Stenosis Dropdown */}
        <td className="p-2">
            {definition.supportsStenosis && (
            <Field
                as="select"
                name={`${basePath}.stenosisPercent`}
                aria-label={`${label} % Stenosis`}
                className="w-full px-1 py-1 border rounded text-xs dark:bg-gray-800"
            >
                <option value="">--</option>
                {STENOSIS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
                ))}
            </Field>
            )}
        </td>

        {/* Plaque Checkbox */}
        <td className="p-2 text-center">
            {definition.supportsPlaque && (
            <Field
                type="checkbox"
                name={`${basePath}.plaquePresent`}
                aria-label={`${label} plaque present`}
            />
            )}
        </td>

        {/* Waveform Dropdown */}
        <td className="p-2">
            {definition.supportsWaveform && (
            <Field
                as="select"
                name={`${basePath}.waveformShape`}
                aria-label={`${label} waveform shape`}
                className="w-full px-1 py-1 border rounded text-xs dark:bg-gray-800"
            >
                <option value="">--</option>
                {WAVEFORM_OPTIONS.map((opt) => (
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
                className="w-full px-1 py-1 border rounded text-xs dark:bg-gray-800"
            >
                <option value="">--</option>
                {DIRECTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
                ))}
            </Field>
            )}
        </td>

        {/* Other / Disease Finding Dropdown */}
        <td className="p-2">
            {definition.supportsFindings && (
            <Field
                as="select"
                name={`${basePath}.diseaseFinding`}
                aria-label={`${label} disease finding`}
                className="w-full px-1 py-1 border rounded text-xs dark:bg-gray-800"
            >
                <option value="">--</option>
                {DISEASE_FINDING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
                ))}
            </Field>
            )}
        </td>
        </tr>
    );
};
