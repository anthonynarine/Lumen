// src/exams/carotid/types/carotidExamFormTypes.ts

import { User } from "../../../types/userType";
import { SegmentDefinition, CarotidTemplate } from "./carotidTemplateTypes";

// ===============================
// 📋 Carotid Exam Formik Types
// ===============================

/**
 * Represents a single segment’s editable measurements.
 * Used as the value shape for inputs in <SegmentTable />.
 */
export type SegmentMeasurement = {
  psv?: number;
  edv?: number;
};

/**
 * Maps segment IDs (e.g., "prox_ica") to their corresponding measurements.
 * Each side (right/left) of the carotid exam uses this structure.
 */
export type SideMeasurements = {
  [segmentId: string]: SegmentMeasurement;
};

/**
 * Formik-compatible top-level form state for the Carotid Exam.
 * Includes bilateral segment measurements and free-text notes.
 */
export type CarotidFormValues = {
  right: SideMeasurements;
  left: SideMeasurements;
  notes: string;
};

/**
 * Props passed to the CarotidExamForm component.
 * Enables dynamic rendering and backend linkage.
 */
export type CarotidExamFormProps = {
  template: CarotidTemplate;
  user: User;
  examId: number;
  initialNotes: string;
};

/**
 * Props passed to the <SegmentTable /> component.
 * Handles dynamic input rendering and Formik value updates.
 */
export type SegmentTableProps = {
  side: "right" | "left";
  segments: SegmentDefinition[];
  values: SideMeasurements;
  setFieldValue: (field: string, value: number | undefined) => void;
};
