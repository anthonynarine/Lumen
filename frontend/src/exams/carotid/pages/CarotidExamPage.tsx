import React, { useEffect, useState } from "react";
import { CarotidTemplate } from "../types/carotidTemplateTypes";
import { CarotidExamForm } from "../forms/CarotidExamForm";
import { buildCarotidTemplate } from "../utils/parseCarotidTemplate";
import { User } from "../../../types/userType";
import examApi from "../../../api/examApi";

/**
 * CarotidExamPage
 *
 * Main entry point for performing or editing a carotid exam.
 * Loads segment template and renders Formik-powered carotid form.
 */
export const CarotidExamPage = () => {
  const [template, setTemplate] = useState<CarotidTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // 🚧 Simulated user (replace with context/provider later)
  const user: User = {
    id: "tech_123",
    name: "Anthony Narine",
    role: "technologist",
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await examApi.get("/api/templates/carotid/?site=mount_sinai_hospital");

        // Extract and transform segments
        const rawSegments = res.data.template.segments;
        const parsedTemplate = buildCarotidTemplate(rawSegments);

        setTemplate(parsedTemplate);
      } catch (err) {
        console.error("Failed to load carotid template:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading exam template...</p>;
  if (!template) return <p className="text-red-500 text-center">Unable to load exam.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">🧠 Carotid Duplex Exam</h1>

      <CarotidExamForm
        template={template}
        user={user}
        examId={101}
        initialNotes=""
      />
    </div>
  );
};
