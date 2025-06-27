"""
Carotid Segment Builder

This module defines the `CarotidSegmentDict` interface used by the CarotidCalculator,
and provides the `build_segment_dict()` function to extract structured data from a
carotid Exam instance.

The returned format feeds the CarotidCalculator and downstream reporting logic.
"""

import logging
from typing import Optional
from reports.models import Exam
from reports.types.segments.base_arterial_segments import ArterialSegmentBase

# Configure logger
logger = logging.getLogger(__name__)


class CarotidSegmentDict(ArterialSegmentBase):
    """
    Dictionary-style interface for a single carotid segment.

    Fields may include primary velocities (PSV, EDV), waveform/direction indicators,
    and any calculated annotations such as ICA/CCA ratio or stenosis category.
    """
    cca_psv: Optional[float]
    ica_cca_ratio: Optional[float]
    stenosis_category: Optional[str]
    vertebral_comment: Optional[str]


def build_segment_dict(exam: Exam) -> dict[str, dict]:
    """
    Construct a dictionary of segment measurements from a carotid exam.

    Pulls raw PSV, EDV, waveform, direction, and optional morphology fields from the
    database, and returns them in a structured format expected by the calculator.

    Args:
        exam (Exam): A carotid Exam instance containing segment and measurement data.

    Returns:
        dict[str, dict]: A mapping of segment name → measurement dictionary.
                        Each entry includes raw values required by CarotidCalculator.
    """
    segment_data = {}

    logger.info(f"Building segment data from Exam ID: {exam.id}")

    for segment in exam.segments.select_related("measurement").all():
        name = segment.name  # e.g., "prox_ica_right"
        m = segment.measurement

        if not m:
            logger.warning(f"No measurement found for segment '{name}' in exam {exam.id}")
            continue

        logger.debug(f"Processing segment '{name}'")

        segment_data[name] = {
            "psv": m.psv,
            "edv": m.edv,
            "direction": m.direction,
            "waveform": m.waveform,
            "cca_psv": m.cca_psv,
            "morphology": getattr(m, "morphology", None),
            "plaque": getattr(m, "plaque_description", None),
        }

    logger.info(f"Segment build complete for Exam ID: {exam.id}. Total segments: {len(segment_data)}")
    return segment_data
