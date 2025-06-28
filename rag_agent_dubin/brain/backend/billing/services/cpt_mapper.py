
"""
CPT Mapper Service for Vascular Exams

This module provides a centralized mapping of CPT (Current Procedural Terminology) codes
based on the type and scope/extent of vascular ultrasound exams.

It is used to auto-populate the `cpt_code` field on the `Exam` model based on user-selected
exam metadata such as exam type (e.g., "carotid", "renal"), scope ("bilateral", "unilateral"),
and extent ("complete", "limited").

Usage Example:
---------------
    from reports.services.cpt_mapper import get_cpt_code

    cpt_code = get_cpt_code(
        exam_type="le_venous",
        scope="bilateral"
    )
    # → "93970"

This service ensures that CPT selection is:
    ✅ Centralized and easy to update
    ✅ Accurate per clinical billing standards
    ✅ Used consistently in serializers, views, and report generators

"""

import logging
import json

logger = logging.getLogger(__name__)  # ✅ This is the missing line


CPT_MAP = {
    "le_venous": {
        "unilateral": "93971",   # Limited or unilateral
        "bilateral": "93970",    # Complete bilateral
    },
    "ue_venous": {
        "unilateral": "93971",   # Same code as LE
        "bilateral": "93970",
    },
    "le_arterial": {
        "physiologic": "93922",   # Limited (e.g., ABI single level)
        "segmental": "93923",     # Multi-level physiologic study
        "complete": "93925",      # Duplex scan, bilateral
        "unilateral": "93926",    # Duplex scan, unilateral
    },
    "ue_arterial": {
        "physiologic": "93922",
        "segmental": "93923",
        "complete": "93930",      # Duplex scan, bilateral
        "unilateral": "93931",    # Duplex scan, unilateral
    },
    "aorta": {
        "complete": "93978",      # Aorta, IVC, iliacs
        "limited": "93979",       # Limited aorto-iliac scan
    },
    "ivc": {
        "patency": "93978",       # Part of a complete aorto-iliac scan
        "limited": "93979",
    },
    "carotid": {
        "unilateral": "93882",
        "bilateral": "93880",     # Complete bilateral duplex
    },
    "renal": {
        "unilateral": "93975",
        "bilateral": "93976",
    },
    "mesenteric": {
        "complete": "93975",      # Same CPT as renal — includes aorta + branch vessels
        "limited": "93976"
    },
    "hd_access": {
        "maturation": "93990",    # AV fistula graft evaluation
        "follow_up": "93990"
    },
}


def get_cpt_code(exam_type: str, scope: str = "", extent: str = "", strict: bool = False) -> str:
    """
    Return the CPT code based on the given exam_type and scope or extent.

    Parameters:
        exam_type (str): Type of the vascular exam (e.g., 'renal', 'carotid')
        scope (str): Scope of the exam (e.g., 'unilateral', 'bilateral')
        extent (str): Extent of the exam (e.g., 'complete', 'limited')
        strict (bool): Raise error if no match is found (default: False)

    Returns:
        str: The corresponding CPT code if matched, otherwise an empty string.
    """
    key_map = CPT_MAP.get(exam_type, {})
    cpt = key_map.get(scope) or key_map.get(extent)

    if not cpt:
        logger.warning(f"No CPT code found for exam_type='{exam_type}', scope='{scope}', extent='{extent}'")
        if strict:
            raise ValueError(f"No CPT code found for exam_type='{exam_type}', scope='{scope}', extent='{extent}'")

    return cpt or ""
