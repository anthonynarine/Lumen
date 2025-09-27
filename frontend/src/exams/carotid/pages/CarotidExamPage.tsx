// src/exams/carotid/pages/CarotidExamPage.tsx

import React, { useEffect, useState } from "react";
import { CarotidTemplate } from "../types/carotidTemplateTypes";
import { CarotidExamForm } from "../forms/CarotidExamForm";
import { User } from "../../../types/userType";
import examApi from "../../../api/examApi";

/**
 * CarotidExamPage
 *
 * Main entry point for performing or editing a carotid duplex exam.
 * Responsibilities:
 *  - Fetch JSON template from backend (/api/templates/carotid/).
 *  - Handle variations in backend response shape.
 *  - Preserve `display.groups`, `dropdowns`, and `units`.
 *  - Render the Formik-powered carotid exam form.
 */
export const CarotidExamPage: React.FC = () => {
  /** Template state (null until fetched). */
  const [template, setTemplate] = useState<CarotidTemplate | null>(null);

  /** Loading state for UX feedback. */
  const [loading, setLoading] = useState(true);

  /** 🚧 Simulated user (replace with AuthContext/provider later). */
  const user: User = {
    id: "tech_123",
    name: "Anthony Narine",
    role: "technologist",
  };

  useEffect(() => {
    /**
     * Fetch carotid exam template from backend.
     * Includes site query param (mount_sinai_hospital) so site-specific
     * templates can be supported in the future.
     */
    const fetchTemplate = async () => {
      try {
        const res = await examApi.get(
          "/templates/carotid/?site=mount_sinai_hospital"
        );

        console.log("📥 Template API response:", res.data);

        // ✅ Extract template object (handle both possible response shapes)
        const tpl: CarotidTemplate = res.data?.template ?? res.data;

        if (!tpl?.segments || tpl.segments.length === 0) {
          console.error("❌ No segments found in carotid template response");
          setTemplate(null);
          return;
        }

        // ✅ Store the full template (segments + display + dropdowns + units)
        setTemplate(tpl);
      } catch (err) {
        console.error("❌ Failed to load carotid template:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  // ----- Conditional UI States -----
  if (loading) {
    return <p className="text-center mt-10">Loading carotid exam template...</p>;
  }

  if (!template) {
    return (
      <p className="text-red-500 text-center mt-10">
        Unable to load carotid exam. Please try again later.
      </p>
    );
  }

  // ----- Main Render -----
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">🧠 Carotid Duplex Exam</h1>

      <CarotidExamForm template={template} user={user} />
    </div>
  );
};
