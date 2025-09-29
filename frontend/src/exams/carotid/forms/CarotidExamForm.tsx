// src/exams/carotid/forms/CarotidExamForm.tsx

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SegmentTableFormik } from "./SegmentTableFormik";

import {
  CarotidFormValues,
  CarotidMetadata,
} from "../types/carotidExamFormTypes";
import { CarotidTemplate } from "../types/carotidTemplateTypes";
import { templateNormalizer } from "../utils/templateNormalizer";

interface Props {
  template: CarotidTemplate;
  user: { id: string; name: string };
}

/**
 * CarotidExamForm
 *
 * Renders a full carotid exam entry form:
 * - Patient metadata (MRN, accession, DOB, etc.)
 * - Right + Left carotid segment tables
 * - Notes + future history section
 *
 * Uses a card-based layout for modern styling and readability.
 */
export const CarotidExamForm: React.FC<Props> = ({ template, user }) => {
  // Normalize template into arrays for Formik
  const norm = React.useMemo(() => templateNormalizer(template), [template]);

  // Initial Formik values
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

  // Validation schema
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
        <Form className="space-y-8">
          {/* Patient Metadata */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">🧾 Patient Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patient Name"
                className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                value={values.metadata.patientName}
                onChange={(e) =>
                  setFieldValue("metadata.patientName", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="MRN"
                className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                value={values.metadata.mrn}
                onChange={(e) => setFieldValue("metadata.mrn", e.target.value)}
              />
              <input
                type="text"
                placeholder="Accession #"
                className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                value={values.metadata.accessionNumber}
                onChange={(e) =>
                  setFieldValue("metadata.accessionNumber", e.target.value)
                }
              />
              <input
                type="date"
                placeholder="DOB"
                className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                value={values.metadata.dateOfBirth}
                onChange={(e) =>
                  setFieldValue("metadata.dateOfBirth", e.target.value)
                }
              />
              <input
                type="date"
                placeholder="Exam Date"
                className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                value={values.metadata.examDate}
                onChange={(e) =>
                  setFieldValue("metadata.examDate", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Referring MD"
                className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                value={values.metadata.referringMd}
                onChange={(e) =>
                  setFieldValue("metadata.referringMd", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Ordering MD"
                className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                value={values.metadata.orderingMd}
                onChange={(e) =>
                  setFieldValue("metadata.orderingMd", e.target.value)
                }
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">➡️ Right Carotid</h2>
            <SegmentTableFormik
              side="right"
              segments={norm.right}
              dropdowns={template.dropdowns}
            />
          </div>

          {/* Left Side */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">⬅️ Left Carotid</h2>
            <SegmentTableFormik
              side="left"
              segments={norm.left}
              dropdowns={template.dropdowns}
            />
          </div>

          {/* Notes */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">📝 Technologist Notes</h2>
            <textarea
              rows={4}
              placeholder="Enter technologist notes..."
              className="w-full px-3 py-2 text-sm border rounded-lg resize-y
                        bg-white text-gray-900 border-gray-300
                        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        dark:focus:ring-blue-400 dark:focus:border-blue-400"
              value={values.notes}
              onChange={(e) => setFieldValue("notes", e.target.value)}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 
                        bg-blue-600 hover:bg-blue-700 text-white 
                        font-medium text-sm rounded-lg shadow
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-blue-500 dark:focus:ring-offset-gray-900
                        transition-colors"
            >
              💾 Save Exam
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
