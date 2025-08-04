// src/exams/carotid/forms/CarotidExamForm.tsx

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SegmentTableFormik } from "./SegmentTableFormik";

import { CarotidFormValues, CarotidMetadata } from "../types/carotidExamFormTypes";
import { CarotidTemplate } from "../types/carotidTemplateTypes";
import { templateNormalizer } from "../utils/templateNormalizer";


/**
 * CarotidExamForm
 *
 * We accept a backend-driven template (maps + order arrays) and
 * immediately normalize it to ordered arrays so the UI layer
 * always iterates over plain arrays.
 */
interface Props {
  template: CarotidTemplate;           // maps + order arrays
  user: { id: string; name: string };
}

export const CarotidExamForm: React.FC<Props> = ({ template, user }) => {
  /** 1) Normalize template once so children get arrays. */
  const norm = React.useMemo(() => templateNormalizer(template), [template]);

  /** 2) Initial values aligned with your side-based Formik shape. */
  const initialValues: CarotidFormValues = {
    metadata: {
      patientName: "",
      mrn: "",
      accessionNumber: "",
      dateOfBirth: "",
      examDate: "",
      referringMd: "",
      orderingMd: "",
      laterality: "bilateral",
      icd10Codes: [],
      cptCode: "93880",
    },
    left: {},
    right: {},
    notes: "",
  };

  /** 3) Minimal validation (expand as you add rules). */
  const validationSchema = Yup.object({
    metadata: Yup.object({
      patientName: Yup.string().required(),
      mrn: Yup.string().required(),
      accessionNumber: Yup.string().required(),
      dateOfBirth: Yup.string().required(),
      examDate: Yup.string().required(),
      laterality: Yup.mixed<CarotidMetadata["laterality"]>()
        .oneOf(["bilateral", "unilateral_right", "unilateral_left", "limited"])
        .required(),
      icd10Codes: Yup.array().of(Yup.string()),
      cptCode: Yup.string().required(),
    }).required(),
    left: Yup.object().required(),
    right: Yup.object().required(),
    notes: Yup.string().nullable(),
  });

  return (
    <Formik<CarotidFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("📦 Payload", values);
        console.log("👤 User", user);
        // TODO: call save API
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6">
          <h2 className="text-xl font-bold">Right Side</h2>
          {/* Pass arrays guaranteed by the normalizer */}
          <SegmentTableFormik side="right" segments={norm.right} />

          <h2 className="text-xl font-bold mt-8">Left Side</h2>
          <SegmentTableFormik side="left" segments={norm.left} />

          {/* Notes / etc. */}
          <div className="mt-6">
            <label className="block font-semibold mb-1">Technologist Notes</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border rounded dark:bg-gray-800"
              value={values.notes}
              onChange={(e) => setFieldValue("notes", e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded shadow">
              Save Exam
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
