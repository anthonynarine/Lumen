// src/exams/carotid/types/carotidExamFormTypes.ts

import { User } from "../../../types/userType";
import { SegmentDefinition, CarotidTemplate } from "./carotidTemplateTypes";

/** Editable measurements captured for a single segment row. */
export type SegmentMeasurement = {
  psv?: number;
  edv?: number;
  // Optional future fields (kept here so rows can bind safely)
  stenosisPercent?: string;
  plaquePresent?: boolean;
  waveformShape?: "Triphasic" | "Biphasic" | "Monophasic";
  direction?: "Antegrade" | "Retrograde";
  diseaseFinding?: "FMD" | "Dissection" | "String of Beads";
};

/** Map of segmentId -> SegmentMeasurement for one side. */
export type SideMeasurements = Record<string, SegmentMeasurement>;

/** Patient & exam metadata captured at the top of the form. */
export type CarotidMetadata = {
  patientName: string;
  mrn: string;
  accessionNumber: string;
  dateOfBirth: string; // ISO yyyy-mm-dd
  examDate: string;    // ISO yyyy-mm-dd
  referringMd: string;
  orderingMd: string;
  laterality: "bilateral" | "unilateral_right" | "unilateral_left" | "limited";
  icd10Codes: string[];  // multi-select
  cptCode: string;       // auto-derived
};

/** Top-level Formik state for the Carotid Exam. */
export type CarotidFormValues = {
  metadata: CarotidMetadata;
  right: SideMeasurements;
  left: SideMeasurements;
  notes: string;
};

/** CarotidExamForm props. */
export type CarotidExamFormProps = {
  template: CarotidTemplate;
  user: User;
  examId: number;
  initialNotes: string;
};

/** Segment table props (per side). */
export type SegmentTableProps = {
  side: "right" | "left";
  segments: SegmentDefinition[];
  values: SideMeasurements;
  setFieldValue: (field: string, value: number | string | boolean | undefined) => void;
};
