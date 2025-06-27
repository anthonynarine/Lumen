# report/calculators/carotid.py

import logging
from decimal import Decimal
from typing import Optional
import json

from reports.calculators.base_calculator import calculate_from_segment
from reports.types.segments.carotid_segments import CarotidSegmentDict

# Setup logger
logger = logging.getLogger(__name__)


class CarotidCalculator:
    """
    CarotidCalculator applies ICA/CCA ratio, stenosis classification, and vertebral
    interpretation logic to each segment of a carotid exam, using site-specific criteria.

    This class supports dynamic rule sets loaded from JSON and ensures all output fields
    (e.g., 'ica_cca_ratio', 'stenosis_category', 'vertebral_comment') are injected into
    their respective segment dictionaries.

    Example usage:
        calculator = CarotidCalculator(segments, criteria)
        calculator.run_all()
    """

    def __init__(self, segments: dict[str, CarotidSegmentDict], criteria: dict):
        """
        Initialize the calculator with carotid segments and site-specific criteria.

        Args:
            segments (dict): Mapping of segment key → segment dictionary.
            criteria (dict): Threshold rules and interpretation logic from carotid.json.
        """
        self.segments = segments
        self.criteria = criteria

    def compute_ica_cca_ratio(self, segment: CarotidSegmentDict) -> None:
        """
        Computes the ICA/CCA ratio using PSV and CCA PSV fields, if both are present.
        Result is stored in the 'ica_cca_ratio' field.

        Args:
            segment (CarotidSegmentDict): A single segment dictionary.
        """
        ratio = calculate_from_segment("psv / cca_psv", segment, ["psv", "cca_psv"])
        if ratio is not None:
            segment["ica_cca_ratio"] = float(round(ratio, 2))
            logger.debug(f"Computed ICA/CCA ratio: {segment['ica_cca_ratio']}")

    def apply_stenosis_logic(self, segment: CarotidSegmentDict) -> None:
        """
        Applies stenosis classification based on site-specific thresholds defined in JSON.
        Uses PSV, EDV, and optionally ICA/CCA ratio to determine stenosis_category.
        If criteria are unclear, sets fallback note in 'stenosis_notes'.

        Args:
            segment (CarotidSegmentDict): A single segment dictionary.
        """
        psv = segment.get("psv")
        edv = segment.get("edv")
        ica_cca_ratio = segment.get("ica_cca_ratio")
        thresholds = self.criteria["stenosis_thresholds"]
        notes = []

        if psv is None:
            logger.debug("PSV missing — skipping stenosis logic.")
            return

        logger.debug(f"Evaluating stenosis: PSV={psv}, EDV={edv}, ICA/CCA={ica_cca_ratio}")

        if psv <= thresholds["0_19"]["psv_max"]:
            segment["stenosis_category"] = "0–19%"
            logger.debug("Stenosis category: 0–19%")

        elif thresholds["20_39"]["psv_min"] <= psv <= thresholds["20_39"]["psv_max"]:
            segment["stenosis_category"] = "20–39%"
            logger.debug("Stenosis category: 20–39%")

        elif thresholds["40_59"]["psv_min"] <= psv <= thresholds["40_59"]["psv_max"]:
            segment["stenosis_category"] = "40–59%"
            logger.debug("Stenosis category: 40–59%")

        elif thresholds["60_79"]["psv_min"] <= psv <= thresholds["60_79"]["psv_max"]:
            if edv is not None and edv <= thresholds["60_79"]["edv_max"]:
                if ica_cca_ratio is not None and ica_cca_ratio > thresholds["upgrade_if_ratio_gt"]:
                    segment["stenosis_category"] = "≥70% (ICA/CCA > 4)"
                    logger.debug("Upgraded to ≥70% due to ICA/CCA > 4.")
                    notes.append("ICA/CCA ratio > 4.0 suggests a stenosis ≥70%.")
                else:
                    segment["stenosis_category"] = "60–79%"
                    logger.debug("Stenosis category: 60–79%")
            else:
                segment["stenosis_category"] = "Uncertain (missing or high EDV)"
                notes.append("Unable to confirm 60–79% due to missing or elevated EDV.")
                logger.debug("Stenosis uncertain — EDV missing or too high.")

        elif psv >= thresholds["80_99"]["psv_min"]:
            if edv is not None and edv >= thresholds["80_99"]["edv_min"]:
                segment["stenosis_category"] = "80–99%"
                logger.debug("Stenosis category: 80–99%")
            else:
                segment["stenosis_category"] = "Uncertain (PSV >240, EDV not >135)"
                notes.append("PSV >240 suggests high-grade, but EDV criteria not met.")
                logger.debug("Stenosis uncertain — EDV not elevated enough.")

        if notes:
            segment["stenosis_notes"] = " ".join(notes)
            logger.debug(f"Stenosis notes: {segment['stenosis_notes']}")

    def interpret_vertebral_waveform(self, segment_key: str, segment: CarotidSegmentDict) -> None:
        """
        Applies vertebral interpretation rules based on flow direction and waveform pattern.
        Uses site-specific rules from criteria JSON to add a 'vertebral_comment'.

        Args:
            segment_key (str): The key of the segment (used to identify vertebrals).
            segment (CarotidSegmentDict): The segment dictionary.
        """
        if "vertebral" not in segment_key.lower():
            return

        rules = self.criteria.get("vertebral_rules", {})
        steal_direction = rules.get("steal_direction", "retrograde").lower()
        pre_steal_waveforms = [w.lower() for w in rules.get("pre_steal_waveforms", [])]

        direction = segment.get("direction", "").lower()
        waveform = segment.get("waveform", "").lower()

        logger.debug(f"Vertebral analysis: direction={direction}, waveform={waveform}")

        if direction == steal_direction:
            segment["vertebral_comment"] = "Retrograde vertebral flow is consistent with subclavian steal."
            logger.debug("Vertebral result: subclavian steal.")
        elif waveform in pre_steal_waveforms:
            formatted = waveform.replace("_", " ").capitalize()
            segment["vertebral_comment"] = f"{formatted} waveform pattern indicative of pre-steal physiology."
            logger.debug("Vertebral result: pre-steal physiology.")
        else:
            segment["vertebral_comment"] = "Normal vertebral flow pattern."
            logger.debug("Vertebral result: normal pattern.")

    def run_all(self) -> None:
        """
        Run all carotid logic across all segments:
        - ICA/CCA ratio computation
        - Stenosis classification
        - Vertebral flow interpretation
        """
        for segment_key, segment in self.segments.items():
            logger.debug(f"▶️ Processing segment: {segment_key}")
            self.compute_ica_cca_ratio(segment)
            self.apply_stenosis_logic(segment)
            self.interpret_vertebral_waveform(segment_key, segment)
    
    def get_segment_data(self) -> dict[str, CarotidSegmentDict]:
        """
        Returns the full state of the calculated segments.
        Used for PDF export, frontend display, or HL7 payloads.
        """
        return self.segments

    def export_json(self, indent: int = 2) -> str:
        """
        Converts the final segment output to a JSON string.
        Useful for debugging or passing to external tools.

        Args:
            indent (int): Indentation level for pretty-printing.
        """
        return json.dumps(self.segments, indent=indent, default=str)
    
    def log_all_segments(self, verbose: bool = True) -> None:
        """
        Logs the full state of each segment after processing.
        Useful for debugging or snapshotting calculator output.
        """
        for key, segment in self.segments.items():
            logger.debug(f"Segment: {key}")
            for field, value in segment.items():
                logger.debug(f"    {field}: {value}")