// src/exams/carotid/forms/SegmentTableFormik.tsx

import React from "react";
import { useFormikContext } from "formik";

import {
  CarotidFormValues,
  SideMeasurements,
} from "../types/carotidExamFormTypes";
import { SegmentDefinition } from "../types/carotidTemplateTypes";
import { CarotidSegmentTable } from "./SegmentTable";

/**
 * Props for SegmentTableFormik
 *
 * This component handles rendering one side of the carotid segment table.
 * It connects Formik context to the presentational table, passing:
 * - Side ("left" or "right")
 * - Segment definitions for that side
 * - Formik values for that side only
 */
export interface SegmentTableFormikProps {
  /** Which side to render: "left" or "right" */
  side: "left" | "right";

  /** Segment definitions loaded from JSON template */
  segments: SegmentDefinition[];
}

/**
 * SegmentTableFormik
 *
 * Bridges Formik context into the `CarotidSegmentTable` UI component.
 * It slices out `values.left` or `values.right` depending on `side`,
 * and ensures safe rendering even if segment definitions are missing.
 *
 * Example Formik structure:
 * {
 *   left: { ica_prox: { psv: 120, edv: 30 }, ... },
 *   right: { cca_mid: { psv: 130 }, ... },
 *   notes: "Limited views due to artifact"
 * }
 */
export const SegmentTableFormik: React.FC<SegmentTableFormikProps> = ({
  side,
  segments,
}) => {
  const { values, setFieldValue } = useFormikContext<CarotidFormValues>();

  // Defensive fallback: if values[side] is missing, use an empty object
  const sideValues: SideMeasurements = values?.[side] ?? {};

  // If segments is undefined or not an array, show a helpful warning in dev
  if (!Array.isArray(segments)) {
    console.warn(`❗ SegmentTableFormik received invalid segments for side: "${side}"`, segments);
    return (
      <p className="text-red-500">
        Unable to render segment table for <strong>{side}</strong>. Segment definitions missing.
      </p>
    );
  }

  return (
    <CarotidSegmentTable
      side={side}
      segments={segments}
      values={sideValues}            // 👈 Only this side's values from Formik
      setFieldValue={setFieldValue}  // 👈 Allows SegmentRow to write to Formik via e.g. `left.ica_prox.psv`
    />
  );
};
