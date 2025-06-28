"""
Carotid Calculator Module

This module contains the CarotidCalculator class, which evaluates ICA/CCA ratio,
stenosis classification, and vertebral flow interpretation per segment based on
site-specific criteria. It also includes orchestration helpers to apply the calculator
to an Exam instance and persist the annotated results.
"""

import logging
import json
from decimal import Decimal
from typing import Optional

from reports.models import Exam
from reports.site.site_loader import load_carotid_criteria
from reports.types.segments.carotid_segments import build_segment_dict
from reports.calculators.base_calculator import calculate_from_segment
from reports.types.segments.carotid_segments import CarotidSegmentDict

# Configure logger
logger = logging.getLogger(__name__)


# ========================
# Core Calculator Class
# ========================

class CarotidCalculator:
    """
    Applies ICA/CCA ratio, stenosis classification, and vertebral interpretation logic
    to carotid segments using site-specific JSON criteria.

    This calculator operates on in-memory dictionaries that represent per-segment data.
    """

    def __init__(self, segments: dict[str, CarotidSegmentDict], criteria: dict):
        """
        Initializes the calculator.

        Args:
            segments (dict): Segment name to measurement dictionary.
            criteria (dict): Site-specific JSON thresholds and rules.
        """
        self.segments = segments
        self.criteria = criteria

    def compute_ica_cca_ratio(self, segment: CarotidSegmentDict) -> None:
        """
        Computes ICA/CCA ratio and stores it in the segment dictionary.

        Args:
            segment (CarotidSegmentDict): Segment containing 'psv' and 'cca_psv'.
        """
        ratio = calculate_from_segment("psv / cca_psv", segment, ["psv", "cca_psv"])
        if ratio is not None:
            segment["ica_cca_ratio"] = float(round(ratio, 2))
            logger.debug(f"ICA/CCA ratio computed: {segment['ica_cca_ratio']}")

    def apply_stenosis_logic(self, segment: CarotidSegmentDict) -> None:
        """
        Applies PSV/EDV/ratio-based rules to classify ICA stenosis.

        Args:
            segment (CarotidSegmentDict): Segment with velocity values.
        """
        psv = segment.get("psv")
        edv = segment.get("edv")
        ica_cca_ratio = segment.get("ica_cca_ratio")
        thresholds = self.criteria["stenosis_thresholds"]
        notes = []

        if psv is None:
            logger.debug("PSV missing; skipping stenosis classification.")
            return

        logger.debug(f"Stenosis evaluation: PSV={psv}, EDV={edv}, ICA/CCA={ica_cca_ratio}")

        if psv <= thresholds["0_19"]["psv_max"]:
            segment["stenosis_category"] = "0–19%"

        elif thresholds["20_39"]["psv_min"] <= psv <= thresholds["20_39"]["psv_max"]:
            segment["stenosis_category"] = "20–39%"

        elif thresholds["40_59"]["psv_min"] <= psv <= thresholds["40_59"]["psv_max"]:
            segment["stenosis_category"] = "40–59%"

        elif thresholds["60_79"]["psv_min"] <= psv <= thresholds["60_79"]["psv_max"]:
            if edv is not None and edv <= thresholds["60_79"]["edv_max"]:
                if ica_cca_ratio is not None and ica_cca_ratio > thresholds["upgrade_if_ratio_gt"]:
                    segment["stenosis_category"] = "≥70% (ICA/CCA > 4)"
                    notes.append("Ratio > 4.0 suggests upgrade to ≥70% stenosis.")
                else:
                    segment["stenosis_category"] = "60–79%"
            else:
                segment["stenosis_category"] = "Uncertain (missing or high EDV)"
                notes.append("Unable to confirm 60–79% due to missing or high EDV.")

        elif psv >= thresholds["80_99"]["psv_min"]:
            if edv is not None and edv >= thresholds["80_99"]["edv_min"]:
                segment["stenosis_category"] = "80–99%"
            else:
                segment["stenosis_category"] = "Uncertain (PSV >240, EDV not >135)"
                notes.append("PSV suggests high-grade, but EDV does not confirm.")

        if notes:
            segment["stenosis_notes"] = " ".join(notes)
            logger.debug(f"Stenosis notes: {segment['stenosis_notes']}")

    def interpret_vertebral_waveform(self, segment_key: str, segment: CarotidSegmentDict) -> None:
        """
        Adds interpretation for vertebral flow patterns based on site rules.

        Args:
            segment_key (str): Name of the segment.
            segment (CarotidSegmentDict): Segment data dictionary.
        """
        if "vertebral" not in segment_key.lower():
            return

        rules = self.criteria.get("vertebral_rules", {})
        steal_direction = rules.get("steal_direction", "retrograde").lower()
        pre_steal_waveforms = [w.lower() for w in rules.get("pre_steal_waveforms", [])]

        direction = segment.get("direction", "").lower()
        waveform = segment.get("waveform", "").lower()

        logger.debug(f"Vertebral flow: direction={direction}, waveform={waveform}")

        if direction == steal_direction:
            segment["vertebral_comment"] = "Retrograde vertebral flow is consistent with subclavian steal."
        elif waveform in pre_steal_waveforms:
            label = waveform.replace("_", " ").capitalize()
            segment["vertebral_comment"] = f"{label} waveform pattern indicative of pre-steal physiology."
        else:
            segment["vertebral_comment"] = "Normal vertebral flow pattern."

    def run_all(self) -> None:
        """
        Runs all carotid calculations across all segments.
        """
        for segment_key, segment in self.segments.items():
            logger.debug(f"Processing segment: {segment_key}")
            self.compute_ica_cca_ratio(segment)
            self.apply_stenosis_logic(segment)
            self.interpret_vertebral_waveform(segment_key, segment)

    def get_segment_data(self) -> dict[str, CarotidSegmentDict]:
        """
        Returns:
            dict: Annotated segment dictionary.
        """
        return self.segments

    def export_json(self, indent: int = 2) -> str:
        """
        Serialize segment results to JSON.

        Args:
            indent (int): Indentation level for pretty-printing.

        Returns:
            str: JSON-encoded segment data.
        """
        return json.dumps(self.segments, indent=indent, default=str)

    def log_all_segments(self) -> None:
        """
        Logs all final segment fields for debugging.
        """
        for key, segment in self.segments.items():
            logger.debug(f"Segment: {key}")
            for field, value in segment.items():
                logger.debug(f"  {field}: {value}")


# ========================
# Calculator Helpers
# ========================

def save_segment_results_to_exam(exam: Exam, segment_results: dict[str, dict]) -> None:
    """
    Saves calculated segment data into Measurement.calculated_fields for persistence.

    Args:
        exam (Exam): Target exam instance.
        segment_results (dict): Output from CarotidCalculator.get_segment_data().
    """
    for name, data in segment_results.items():
        try:
            segment = exam.segments.get(name=name)
            measurement = segment.measurement
            if not measurement:
                logger.warning(f"Measurement missing for segment '{name}' in exam ID {exam.id}")
                continue
            measurement.calculated_fields = data
            measurement.save()
            logger.debug(f"Saved results for segment '{name}' (exam ID {exam.id})")
        except Exception as e:
            logger.error(f"Error saving segment '{name}' (exam ID {exam.id}): {str(e)}")


def run_carotid_calculator(exam: Exam) -> None:
    """
    Applies CarotidCalculator to a given Exam and persists all results.

    Args:
        exam (Exam): The target carotid exam.
    """
    logger.info(f"Running carotid calculator for exam ID {exam.id}")

    segments = build_segment_dict(exam)
    site = getattr(exam, "site", "mount_sinai_gp1c")
    criteria = load_carotid_criteria(site)

    calculator = CarotidCalculator(segments, criteria)
    calculator.run_all()

    save_segment_results_to_exam(exam, calculator.get_segment_data())

    logger.info(f"Carotid calculation complete and results saved for exam ID {exam.id}")
