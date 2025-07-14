// src/exams/carotid/generateConclusion.ts

import { CarotidFormValues } from "./types/CarotidTypes";
import { CarotidCalculations } from "../hooks/carotid-hooks/useCarotidCalculator"; // 🧠 type only

/**
 * Generates a formatted clinical impression for a carotid duplex ultrasound exam.
 *
 * This utility function takes the raw form input (`CarotidFormValues`) and the calculated
 * metrics from `useCarotidCalculator` and synthesizes them into a concise, human-readable
 * summary following standard vascular reporting conventions.
 *
 * Example output:
 *  - "Right Internal Carotid Artery: B-mode and spectral analysis is consistent with 0-19% stenosis...
 *    There is calcified plaque visualized."
 *
 * @param {CarotidFormValues} values - The segmental PSV/EDV values entered by the user.
 * @param {CarotidCalculations} calcs - Metrics computed by the `useCarotidCalculator` hook.
 * @returns {string} A formatted clinical impression string suitable for inclusion in a report.
 */
export const generateConclusion = (
  values: CarotidFormValues,
  calcs: CarotidCalculations
): string => {
  const lines: string[] = [];

  /**
   * Formats the clinical impression for a given side ("right" or "left").
   *
   * @param side - Either "right" or "left"
   */
  const buildSide = (side: "right" | "left") => {
    const result = calcs[`stenosis${side.charAt(0).toUpperCase() + side.slice(1)}`];
    const percent = result?.percent;
    const note = result?.notes || "";
    const ratio = result?.icaCcaRatio;
    const plaque = note.includes("plaque") ? note : "no plaque detected";

    if (!percent) return;

    // Format side-specific findings string
    lines.push(
      `${side.charAt(0).toUpperCase() + side.slice(1)} Internal Carotid Artery:\n` +
      `B-mode and spectral analysis is consistent with ${percent} stenosis of the proximal internal carotid artery. ` +
      `There is ${plaque} visualized.\n`
    );
  };

  buildSide("right");
  buildSide("left");

  return lines.join("\n");
};
