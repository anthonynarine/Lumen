import React, { useEffect, useState } from "react";
import { CarotidTemplate } from "../types/carotidTemplateTypes";
import { CarotidExamForm } from "../forms/CarotidExamForm";
import { User } from "../../../types/userType";

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
        const res = await fetch("/exam_templates/carotid.json");
        const data = await res.json();
        setTemplate(data);
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
        template={{
          right: Object.values(template.right),
          left: Object.values(template.left),
        }}
        user={user}
        examId={101}
        initialNotes=""
      />
    </div>
  );
};
