// src/exams/carotid/forms/SegmentTableFormik.tsx

import React from "react";
import { useFormikContext } from "formik";

import {
  CarotidFormValues,
  SideMeasurements,
} from "../types/carotidExamFormTypes";
import {
  SegmentDefinition,
  CarotidTemplate,
} from "../types/carotidTemplateTypes";
import { CarotidSegmentTable } from "./SegmentTable";

/**
 * Props for SegmentTableFormik
 *
 * Connects Formik context to a carotid segment table (left, right, temporal, etc.).
 * Passes Formik values + setters into CarotidSegmentTable, along with
 * segment definitions and dropdowns from the template.
 */
export interface SegmentTableFormikProps {
  /** Which group this represents (e.g. "left", "right", "temporal") */
  side: string;

  /** Segment definitions loaded from template JSON */
  segments: SegmentDefinition[];

  /** Dropdowns loaded from template JSON */
  dropdowns: CarotidTemplate["dropdowns"];
}

/**
 * SegmentTableFormik
 *
 * Bridges Formik state into the CarotidSegmentTable component:
 * - Extracts group-specific values (values.left, values.right, values.temporal, etc.)
 * - Passes Formik's setFieldValue to children for controlled updates
 * - Ensures dropdowns are passed down so SegmentRow is template-driven
 */
export const SegmentTableFormik: React.FC<SegmentTableFormikProps> = ({
  side,
  segments,
  dropdowns,
}) => {
  const { values, setFieldValue } = useFormikContext<CarotidFormValues>();

  // Defensive fallback: if values[side] is missing, use an empty object
  const sideValues: SideMeasurements =
    (values as any)?.[side] ?? ({} as SideMeasurements);

  // Guard: if no valid segments provided, show a warning in dev
  if (!Array.isArray(segments)) {
    console.warn(
      `❗ SegmentTableFormik received invalid segments for side="${side}"`,
      segments
    );
    return (
      <p className="text-red-500">
        Unable to render segment table for <strong>{side}</strong>. Segment
        definitions missing.
      </p>
    );
  }

  return (
    <CarotidSegmentTable
      side={side}
      segments={segments} // Template-driven segment definitions
      values={sideValues} // Formik group-specific values
      setFieldValue={setFieldValue} // Formik setter for controlled updates
      dropdowns={dropdowns} // 👈 Pass dropdowns from template JSON
    />
  );
};
