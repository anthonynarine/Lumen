# report/calculators/carotid.py

from decimal import Decimal
from typing import Optional

from reports.calculators.base_calculator import calculate_from_segment
from reports.types.segments.carotid_segments import CarotidSegmentDict


class CarotidCalculator:
    """
    Carotid calculator engine that applies stenosis and vertebral logic
    based on site-specific criteria passed during initialization.
    """

    def __init__(self, segments: dict[str, CarotidSegmentDict], criteria: dict):
        """
        Args:
            segments (dict): Mapping from segment key → segment dictionary.
            criteria (dict): Site-specific threshold logic loaded from JSON.
        """
        self.segments = segments
        self.criteria = criteria

    def compute_ica_cca_ratio(self, segment: CarotidSegmentDict) -> None:
        """
        Computes and stores ICA/CCA ratio if possible.
        """
        ratio = calculate_from_segment("psv / cca_psv", segment, ["psv", "cca_psv"])
        if ratio is not None:
            segment["ica_cca_ratio"] = float(round(ratio, 2))

    def apply_stenosis_logic(self, segment: CarotidSegmentDict) -> None:
        """
        Applies site-specific stenosis classification using PSV, EDV, and ICA/CCA ratio.
        Uses dynamic rules from loaded criteria JSON.
        """
        psv = segment.get("psv")
        edv = segment.get("edv")
        ica_cca_ratio = segment.get("ica_cca_ratio")
        thresholds = self.criteria["stenosis_thresholds"]
        notes = []

        if psv is None:
            return

        # Step 1: 0–19%
        if psv <= thresholds["0_19"]["psv_max"]:
            segment["stenosis_category"] = "0–19%"

        # Step 2: 20–39%
        elif thresholds["20_39"]["psv_min"] <= psv <= thresholds["20_39"]["psv_max"]:
            segment["stenosis_category"] = "20–39%"

        # Step 3: 40–59%
        elif thresholds["40_59"]["psv_min"] <= psv <= thresholds["40_59"]["psv_max"]:
            segment["stenosis_category"] = "40–59%"

        # Step 4: 60–79%
        elif thresholds["60_79"]["psv_min"] <= psv <= thresholds["60_79"]["psv_max"]:
            if edv is not None and edv <= thresholds["60_79"]["edv_max"]:
                if ica_cca_ratio is not None and ica_cca_ratio > thresholds["upgrade_if_ratio_gt"]:
                    segment["stenosis_category"] = "≥70% (ICA/CCA > 4)"
                    notes.append("ICA/CCA ratio > 4 suggests a stenosis ≥70%")
                else:
                    segment["stenosis_category"] = "60–79%"
            else:
                segment["stenosis_category"] = "Uncertain (missing or high EDV)"
                notes.append("Unable to confirm 60–79% due to missing or elevated EDV.")

        # Step 5: 80–99%
        elif psv >= thresholds["80_99"]["psv_min"]:
            if edv is not None and edv >= thresholds["80_99"]["edv_min"]:
                segment["stenosis_category"] = "80–99%"
            else:
                segment["stenosis_category"] = "Uncertain (PSV >240, EDV not >135)"
                notes.append("PSV >240 suggests high-grade, but EDV criteria not met.")

        # Step 6: Attach any notes
        if notes:
            segment["stenosis_notes"] = " ".join(notes)

    def interpret_vertebral_waveform(self, segment_key: str, segment: CarotidSegmentDict) -> None:
        """
        Interprets vertebral segment based on site-specific waveform and direction rules.

        Adds a 'vertebral_comment' to the segment based on:
        - Retrograde flow (steal pattern)
        - Pre-steal waveform types
        - Otherwise marks as normal
        """
        if "vertebral" not in segment_key.lower():
            return  # Not a vertebral artery segment

        # Step 1: Load vertebral rules from criteria
        rules = self.criteria.get("vertebral_rules", {})
        steal_direction = rules.get("steal_direction", "retrograde").lower()
        pre_steal_waveforms = [w.lower() for w in rules.get("pre_steal_waveforms", [])]

        # Step 2: Normalize fields
        direction = segment.get("direction", "").lower()
        waveform = segment.get("waveform", "").lower()

        # Step 3: Apply interpretation logic
        if direction == steal_direction:
            segment["vertebral_comment"] = "Retrograde vertebral flow is consistent with subclavian steal."
        elif waveform in pre_steal_waveforms:
            formatted = waveform.replace("_", " ").capitalize()
            segment["vertebral_comment"] = f"{formatted} waveform pattern indicative of pre-steal physiology."
        else:
            segment["vertebral_comment"] = "Normal vertebral flow pattern."

    def run_all(self) -> None:
        """
        Applies all carotid calculator logic using site criteria.
        """
        for segment_key, segment in self.segments.items():
            self.compute_ica_cca_ratio(segment)
            self.apply_stenosis_logic(segment)
            self.interpret_vertebral_waveform(segment_key, segment)
