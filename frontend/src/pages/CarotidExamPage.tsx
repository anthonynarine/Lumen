import React, { useEffect, useState } from "react";
import { CarotidExamForm } from "../exams/carotid/CarotidExamForm"
import { SegmentDefinition } from "../exams/carotid/types/CarotidTypes";
import { useAuth } from "../auth/hooks/useAuth";


/**
 * CarotidExamPage
 *
 * Loads the carotid exam segment template and renders the dynamic exam form.
 * Assumes the user is already authenticated (route should be protected).
 *
 * @returns {JSX.Element}
 */
export const CarotidExamPage = (): JSX.Element => {
  const { user } = useAuth();
  const [template, setTemplate] = useState<{
    right: SegmentDefinition[];
    left: SegmentDefinition[];
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  /** Load carotid.json on mount */
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch("/exam_templates/carotid.json");
        if (!res.ok) throw new Error("Failed to load template.");
        const data = await res.json();
        setTemplate(data);
      } catch (err) {
        setError("Failed to load carotid template.");
        console.error(err);
      }
    };

    fetchTemplate();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-600 text-center font-semibold">
        {error}
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading carotid exam form...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 Carotid Exam</h1>
      <CarotidExamForm template={template} user={user} />
    </div>
  );
};
