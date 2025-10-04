import React, { useEffect, useState } from "react";
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

/**
 * SegmentDefinition
 *
 * Defines the metadata for each carotid segment as delivered
 * by the backend JSON template. This drives the UI rendering.
 */
export interface SegmentDefinition {
	id: string; // Unique identifier, e.g., "ica_prox_right"
	label: string; // Display label, e.g., "ICA Prox (Right)".
	side: "left" | "right"; // Anatomical side this segment belongs to.
	vessel: string; // Vessel type, e.g., "ica", "cca", "subclavian".
	position?: string; // Anatomical position within vessel (prox, mid, dist, origin, etc.).
	/**
	 * Measurements supported by this segment.
	 * Always includes PSV, EDV. ICA segments may include "ica_cca_ratio".
	 */
	measurements?: string[];

	/** UI flags that control optional fields. */
	supportsPlaque?: boolean;
	supportsStenosis?: boolean;
	supportsWaveform?: boolean;
	supportsDirection?: boolean;
	supportsFindings?: boolean;
}

/**
 * CarotidTemplate
 *
 * Top-level structure for a carotid exam template.
 * Contains all segment definitions plus dropdowns and unit metadata.
 */
export interface CarotidTemplate {
	id: string;
	version: string;
	site: string;
	title: string;
	segments: SegmentDefinition[]; // Flat list of all segments in this exam template.
	display?: {
		groups: { title: string; segments: string[] }[];
	}; // Groupings for UI display (right, left, temporal).
	units?: Record<string, string>; // Units override mapping (psv, edv, ica_cca_ratio).
	dropdowns?: Record<string, string[]>; // Dropdown options for stenosis, plaque morphology, etc. */
}
export const CarotidExamPage: React.FC = () => {
	const [template, setTemplate] = useState<CarotidTemplate | null>(null); // Template state (null until fetched).
	const [loading, setLoading] = useState(true); // Loading state for UX feedback.
	const user: User = {
		id: "tech_123",
		name: "Anthony Narine",
		role: "technologist",
	}; // 🚧 Simulated user (replace with AuthContext/provider later).

	useEffect(() => {
		/**
		 * Fetch carotid exam template from backend.
		 * Includes site query param (mount_sinai_hospital) so site-specific
		 * templates can be supported in the future.
		 */
		const fetchTemplate = async () => {
			try {
				const res = await examApi.get("/templates/carotid/?site=mount_sinai_hospital");

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
		return <p className="text-red-500 text-center mt-10">Unable to load carotid exam. Please try again later.</p>;
	}

	// ----- Main Render -----
	return (
		<div className="p-6 max-w-6xl mx-auto">
			<h1 className="text-2xl font-semibold mb-6">🧠 Carotid Duplex Exam</h1>

			<CarotidExamForm template={template} user={user} />
		</div>
	);
};
