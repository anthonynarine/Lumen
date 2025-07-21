import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { CarotidSegmentTable } from "../forms/CarotidSegTableForm"
import { calculateCarotidStenosis } from "../utils/CaroitdCalculations";
import { generateConclusion } from "../utils/generateConclusion";
import { CarotidFormValues, SideMeasurements } from "../types/carotidExamFormTypes";
import { CarotidExamFormProps } from "../types/carotidExamFormTypes";


/**
 * CarotidExamForm
 *
 * Formik-powered dynamic form for bilateral carotid exams.
 * Renders PSV/EDV input fields by segment, calculates ICA/CCA ratios,
 * classifies stenosis, and shows a live auto-generated clinical impression.
 *
 * @component
 * @param {CarotidExamFormProps} props - Props including segment template and user info
 * @returns {JSX.Element}
 */
export const CarotidExamForm = ({ template, user }: CarotidExamFormProps): JSX.Element => {
  /** Initial empty Formik values */
  const initialValues: CarotidFormValues = {
    right: {} as SideMeasurements,
    left: {} as SideMeasurements,
    notes: "",
  };

  /** Validation schema placeholder (can be extended later) */
  const validationSchema = Yup.object().shape({
    right: Yup.object(),
    left: Yup.object(),
    notes: Yup.string(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("🧠 Raw values:", values);
        const calcs = calculateCarotidStenosis(values);
        console.log("📊 Calculated:", calcs);
        const finalImpression = generateConclusion(values, calcs);
        console.log("📝 Final impression on submit:", finalImpression);

        // TODO: submit to API or backend
      }}
    >
      {({ values, setFieldValue }) => {
        // 🧠 Live real-time calculation of stenosis and impression
        const calcs = calculateCarotidStenosis(values);
        const liveImpression = generateConclusion(values, calcs);

        return (
          <Form className="space-y-6">
            {/* === Right Side === */}
            <h2 className="text-lg font-semibold">Right Side</h2>
            <CarotidSegmentTable
              side="right"
              segments={template.right}
              values={values.right}
              setFieldValue={setFieldValue}
            />

            {/* === Left Side === */}
            <h2 className="text-lg font-semibold mt-8">Left Side</h2>
            <CarotidSegmentTable
              side="left"
              segments={template.left}
              values={values.left}
              setFieldValue={setFieldValue}
            />

            {/* === Notes Field === */}
            <div>
              <label htmlFor="notes" className="block font-medium mb-1">
                Technologist Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                className="w-full border rounded px-3 py-2 dark:bg-gray-800"
                rows={3}
                onChange={(e) => setFieldValue("notes", e.target.value)}
              />
            </div>

            {/* === Live Clinical Impression (read-only) === */}
            <div className="mt-6">
              <label className="block font-semibold mb-1">
                Live Clinical Impression
              </label>
              <textarea
                value={liveImpression}
                readOnly
                rows={5}
                className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-900 text-sm font-mono"
              />
            </div>

            {/* === Submit Button === */}
            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-white rounded shadow hover:bg-opacity-90"
              >
                Save Exam
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
