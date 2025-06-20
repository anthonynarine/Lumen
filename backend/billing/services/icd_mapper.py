"""
ICD-10 Mapper Service for Vascular Exams

This module provides centralized ICD-10 codes based on exam type and indication.
Used for auto-populating the `indication_code` field and generating HL7 outputs.

Usage:
    from reports.services.icd_mapper import get_icd_codes

    icd_list = get_icd_codes("carotid")
    # → ["I65.23", "I73.9", ...]
"""

import logging
import json

logger = logging.getLogger(__name__)

ICD10_MAP = {
    "carotid": [
        {"code": "I65.23", "label": "Occlusion and stenosis of bilateral carotid arteries"},
        {"code": "I73.9",  "label": "Peripheral vascular disease, unspecified"},
        {"code": "G45.9",  "label": "Transient cerebral ischemic attack, unspecified"},
    ],
    "renal": [
        {"code": "I77.3", "label": "Arterial fibromuscular dysplasia"},
        {"code": "I12.9", "label": "Hypertensive chronic kidney disease, stage 1-4"},
        {"code": "N28.9", "label": "Disorder of kidney and ureter, unspecified"},
    ],
    "ivc": [
        {"code": "I82.90", "label": "Acute embolism and thrombosis of unspecified vein"},
        {"code": "I87.2",  "label": "Venous insufficiency (chronic)"},
    ],
    "le_venous": [
        {"code": "I83.90", "label": "Varicose veins of lower extremities without complications"},
        {"code": "I87.2",  "label": "Venous insufficiency (chronic)"},
        {"code": "I82.403", "label": "Acute embolism and thrombosis of unspecified deep veins of lower extremity"},
    ],
    "le_arterial": [
        {"code": "I70.213", "label": "Atherosclerosis of native arteries of extremities with intermittent claudication, bilateral legs"},
        {"code": "I70.92",  "label": "Atherosclerosis, unspecified"},
    ],
    "mesenteric": [
        {"code": "K55.1", "label": "Chronic vascular disorders of intestine"},
        {"code": "I77.6", "label": "Arteritis, unspecified"},
    ],
    "hd_access": [
        {"code": "T82.858A", "label": "Stenosis of vascular prosthetic device, initial encounter"},
        {"code": "N18.6",    "label": "End stage renal disease"},
    ],
    "aorta": [
        {"code": "I71.4", "label": "Abdominal aortic aneurysm without rupture"},
        {"code": "I70.0", "label": "Atherosclerosis of aorta"},
    ]
}


def get_icd_codes(exam_type: str, strict: bool = False):
    """
    Return ICD-10 options based on exam_type.

    Args:
        exam_type (str): The type of exam (e.g., 'renal', 'carotid')
        strict (bool): If True, raises error on missing exam_type

    Returns:
        list[dict]: List of {"code": ..., "label": ...} pairs
    """
    codes = ICD10_MAP.get(exam_type)

    if not codes:
        logger.warning(f"No ICD-10 codes found for exam_type='{exam_type}'")
        if strict:
            raise ValueError(f"No ICD-10 codes for exam_type='{exam_type}'")

    return codes or []


